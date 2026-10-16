import { cp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
await rm(path.join(root, 'dist'), { recursive: true, force: true });
await mkdir(path.join(root, 'dist'), { recursive: true });
await cp(path.join(root, 'site'), path.join(root, 'dist'), { recursive: true });
await writeFile(path.join(root, 'dist', '.nojekyll'), '');
const base = new URL((process.env.SITE_URL || 'https://vimplayapi-cpu.github.io/streamlab.github.io').replace(/\/$/,'')+'/');
if (!['http:','https:'].includes(base.protocol)) throw new Error('SITE_URL must use HTTP or HTTPS');
const indexSite = process.env.INDEX_SITE === 'true';
const routes = [];
const posts = [];
const xml = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const decode = text => text.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
async function metadata(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()){await metadata(file);continue;}
    if(!entry.name.endsWith('.html'))continue;
    const relative=path.relative(path.join(root,'dist'),file).replaceAll('\\','/');
    const route=relative.replace(/index\.html$/,'');
    const canonical=new URL(route,base).href;
    let html=await readFile(file,'utf8');
    const title=/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] || 'Streamlab Platform';
    if(route.startsWith('post/')){
      const description=/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/i.exec(html)?.[1] || title;
      const published=/"datePublished"\s*:\s*"([^"]+)"/.exec(html)?.[1];
      posts.push({title:decode(title),description:decode(description),link:canonical,published});
    }
    html=html.replace(/<link\b[^>]*rel="canonical"[^>]*>/gi,'').replace(/<meta\b[^>]*name="robots"[^>]*>/gi,'');
    html=html.replace(/<meta\b[^>]*property="og:url"[^>]*>/gi,'');
    // Original JSON-LD URL values follow the deployment location. Media remains local.
    html=html.replaceAll('https://www.streamlabplatform.com',base.href.replace(/\/$/,''));
    html=html.replace(/<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*>/gi,tag=>tag.replace(/content="([^"]+)"/,(_,value)=>`content="${new URL(value,new URL(route,base)).href}"`));
    html=html.replace(/<meta\b[^>]*(?:property|name)="(?:og:title|twitter:title)"[^>]*>/gi,tag=>tag.replace(/content="[^"]*"/,`content="${title}"`));
    if(entry.name==='404.html') html=html.replace('<head>',`<head><base href="${base.href}">`);
    html=html.replace('</head>',`<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta name="robots" content="${indexSite&&entry.name!=='404.html'?'index,follow':'noindex,follow'}"></head>`);
    await writeFile(file,html);
    if(entry.name!=='404.html')routes.push(canonical);
  }
}
await metadata(path.join(root,'dist'));
await writeFile(path.join(root,'dist','sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(url=>`<url><loc>${url}</loc></url>`).join('')+'</urlset>');
await writeFile(path.join(root,'dist','robots.txt'),`User-agent: *\n${indexSite?'Allow: /':'Disallow: /'}\nSitemap: ${new URL('sitemap.xml',base).href}\n`);
const feed='<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Streamlab Platform News</title><link>'+xml(new URL('blog/',base).href)+'</link><description>News and ideas from Streamlab Platform.</description>'+posts.map(post=>`<item><title>${xml(post.title)}</title><link>${xml(post.link)}</link><guid isPermaLink="true">${xml(post.link)}</guid><description>${xml(post.description)}</description>${post.published?'<pubDate>'+new Date(post.published).toUTCString()+'</pubDate>':''}</item>`).join('')+'</channel></rss>';
await writeFile(path.join(root,'dist','blog-feed.xml'),feed);
// Keep a static root fallback for repositories whose Pages source is still branch-based.
for (const name of ['index.html','404.html','assets','games','company','blog','post','join-us','privacy','design.css','experience.js','product-tour.css','product-tour.js','sitemap.xml','robots.txt','blog-feed.xml','.nojekyll']) {
  await cp(path.join(root,'dist',name), path.join(root,name), {recursive:true});
}
console.log(`Built ${routes.length} pages in dist/ for ${base.href} (${indexSite?'indexable':'migration preview; noindex'})`);
