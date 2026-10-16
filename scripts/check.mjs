import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../site/', import.meta.url));
const errors = [];
let pages = 0, links = 0;
async function check(dir) {
 for (const entry of await readdir(dir, {withFileTypes:true})) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) { await check(file); continue; }
  if (!entry.name.endsWith('.html')) continue;
  pages++;
  const html = await readFile(file,'utf8');
  const fail = message => errors.push(`${path.relative(root,file)}: ${message}`);
  if ((html.match(/<h1\b/g)||[]).length !== 1) fail('expected one h1');
  if (!/<main id="main">/.test(html)) fail('missing main landmark');
  if (!/<title>.+?<\/title>/.test(html)) fail('missing title');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if (new Set(ids).size!==ids.length) fail('duplicate IDs');
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
   try { JSON.parse(block[1]); } catch { fail('invalid JSON-LD'); }
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(image[0])) fail('image missing alt');
  for (const tag of html.matchAll(/<(img|script|link|a)\b[^>]*>/gi)) {
   if(tag[1]==='link'&&!/rel="(?:stylesheet|icon)"/.test(tag[0]))continue;
   const attr=/\b(?:src|href)="([^"]+)"/.exec(tag[0]);
   if(!attr)continue;
   const url=attr[1];
   if(/^(?:https?:|mailto:|tel:|data:|blob:)/i.test(url)) { if(tag[1]!=='a')fail(`external dependency ${url}`); continue; }
   const [name, fragment] = url.split('#');
   const target=name?path.resolve(path.dirname(file),decodeURIComponent(name.split('?')[0])):file;
   if(!target.startsWith(root)) {fail('path escapes site');continue;}
   try {
    if(!(await stat(target)).isFile())fail(`not a file: ${url}`);
    if(fragment&&target.endsWith('.html')) {
     const targetHtml=target===file?html:await readFile(target,'utf8');
     if(!targetHtml.includes(`id="${fragment}"`))fail(`missing fragment: ${url}`);
    }
   } catch {fail(`missing local file ${url}`);}
   links++;
  }
 }
}
await check(root);
if(pages!==11)errors.push(`Expected 11 pages; found ${pages}`);
const contact=await readFile(path.join(root,'join-us/index.html'),'utf8');
for(const marker of ['id="contact-form"','id="form-status"','id="email-fallback"'])if(!contact.includes(marker))errors.push(`Missing ${marker}`);
const css=await readFile(path.join(root,'design.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))try{await stat(path.resolve(root,match[1]));}catch{errors.push(`Missing CSS asset: ${match[1]}`);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`Passed ${pages} pages and ${links} local references; fragments, headings, landmarks, image alt text, JSON-LD, CSS assets and contact hooks verified.`);
