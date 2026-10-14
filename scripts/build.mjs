import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { home, article, esc } from '../src/templates.mjs';

const project=fileURLToPath(new URL('../',import.meta.url));
const dist=join(project,'dist');
const items=JSON.parse(await readFile(join(project,'src/content.json'),'utf8'));
const rawSiteUrl=process.env.SITE_URL;
let base;
if(rawSiteUrl){base=new URL(rawSiteUrl.endsWith('/')?rawSiteUrl:rawSiteUrl+'/');if(!['https:','http:'].includes(base.protocol))throw new Error('SITE_URL must use HTTP(S)');}
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(join(project,'public'),dist,{recursive:true});
await cp(join(project,'src/styles.css'),join(dist,'styles.css'));
await cp(join(project,'src/app.js'),join(dist,'app.js'));
await cp(join(project,'src/content.json'),join(dist,'content.json'));
await mkdir(join(dist,'modules'),{recursive:true});
for(const f of ['i18n.mjs','icons.mjs','art.mjs','templates.mjs'])await cp(join(project,'src',f),join(dist,'modules',f));
const urls=[];
async function page(path,html,enPath,viPath,lang){
 const url=base?new URL(path,base).href:null;
 const depth=path.split('/').filter(Boolean).length;
 const relativeRoot='../'.repeat(depth);
 const en=base?new URL(enPath,base).href:relativeRoot+(enPath||'./');
 const vi=base?new URL(viPath,base).href:relativeRoot+viPath;
 let seo=`<link rel="alternate" hreflang="en" href="${esc(en)}"><link rel="alternate" hreflang="vi" href="${esc(vi)}"><link rel="alternate" hreflang="x-default" href="${esc(en)}">`;
 if(url){seo+=`<link rel="canonical" href="${esc(url)}">`;html=html.replace(/(<meta property="og:image" content=")[^"]*(">)/,`$1${new URL('assets/images/brand-cover.webp',base).href}$2`);seo+=`<meta property="og:url" content="${esc(url)}">`;urls.push({url,lang});}
 html=html.replace('<!-- SEO_URLS -->',seo);
 const out=join(dist,path,'index.html');await mkdir(resolve(out,'..'),{recursive:true});await writeFile(out,html);
}
for(const lang of ['en','vi']){
 const locale=lang==='vi'?'vi/':'';
 await page(locale,home(lang,items),'','vi/',lang);
 for(const item of items){const slug=`learn/${item.slug}/`;await page(locale+slug,article(lang,item,items),slug,'vi/'+slug,lang);}
}
await writeFile(join(dist,'.nojekyll'),'');
await writeFile(join(dist,'404.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clue not found — ClueTek</title><style>body{background:#081426;color:#f3f7ff;font:18px/1.7 system-ui;max-width:620px;margin:15vh auto;padding:25px}a{color:#19d9f4}h1{font-size:45px}</style><h1>This clue is still missing.</h1><p>The page may have moved. There are more explanations to explore in the library.</p><a href="${base?base.href:'./'}">Back to ClueTek</a></html>`);
await writeFile(join(dist,'robots.txt'),`User-agent: *\nAllow: /\n${base?'Sitemap: '+new URL('sitemap.xml',base).href+'\n':''}`);
if(base)await writeFile(join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(({url})=>`<url><loc>${esc(url)}</loc></url>`).join('')}</urlset>`);
console.log(`Built 52 pages, ${items.length} explanations, ${items.filter(i=>i.video).length} films${base?' for '+base.href:''}.`);
