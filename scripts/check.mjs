import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../site/', import.meta.url));
const errors = [];
let pageCount = 0, resourceCount = 0;
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    pageCount++;
    const text = await readFile(file, 'utf8');
    if (/<script\b[^>]*src="https?:/i.test(text)) errors.push(`${file}: remote script dependency`);
    for (const tag of text.matchAll(/<(img|video|source|script|link|a)\b[^>]*>/gi)) {
      if (tag[1] === 'link' && !/rel="(?:stylesheet|icon|shortcut icon|apple-touch-icon)"/.test(tag[0])) continue;
      const attr = /\b(?:src|href)="([^"]+)"/.exec(tag[0]);
      if (!attr || /^(?:https?:|mailto:|tel:|data:|blob:|#)/i.test(attr[1])) {
        if (attr && tag[1] !== 'a' && /^https?:/.test(attr[1])) errors.push(`${file}: external resource ${attr[1]}`);
        continue;
      }
      const target = path.resolve(path.dirname(file), decodeURIComponent(attr[1].split(/[?#]/)[0]));
      if (!target.startsWith(root)) { errors.push(`${file}: resource escapes site`); continue; }
      try { if (!(await stat(target)).isFile()) errors.push(`${file}: missing file ${attr[1]}`); }
      catch { errors.push(`${file}: missing file ${attr[1]}`); }
      resourceCount++;
    }
  }
}
await visit(root);
if (pageCount !== 11) errors.push(`Expected nine migrated pages, privacy notice and 404, found ${pageCount}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Passed: ${pageCount} pages, ${resourceCount} local references, no remote script or media dependencies.`);
