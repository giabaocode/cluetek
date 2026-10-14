import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url)),dist=join(root,'dist');
const items=JSON.parse(await readFile(join(root,'src/content.json'),'utf8'));
assert.equal(items.length,25);assert.equal(items.filter(i=>i.video).length,10);
assert.equal(new Set(items.map(i=>i.slug)).size,25);
for(const i of items){assert.ok(i.title.en&&i.title.vi&&i.body.en&&i.body.vi);assert.ok(i.sources.length);for(const s of i.sources)assert.equal(new URL(s.url).protocol,'https:');}
for(const f of ['src/app.js','src/templates.mjs','scripts/build.mjs','scripts/serve.mjs']){const result=spawnSync(process.execPath,['--check',join(root,f)],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
async function walk(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const pages=(await walk(dist)).filter(p=>p.endsWith('index.html'));
assert.equal(pages.length,52);
let links=0;
for(const page of pages){const html=await readFile(page,'utf8');assert.ok(/<html lang="(en|vi)">/.test(html));assert.ok(html.includes('name="description"'));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const target=m[1];if(/^(https?:|#|mailto:|data:)/.test(target))continue;const clean=decodeURIComponent(target.split(/[?#]/)[0]);if(!clean)continue;let p=resolve(dirname(page),clean);try{if((await stat(p)).isDirectory())p=join(p,'index.html');await stat(p);links++;}catch{throw new Error(`Broken local link: ${page.replace(root,'')} → ${target}`);}}}
console.log(`Passed: content integrity, script syntax, 52 pages and ${links} local asset/page links.`);
