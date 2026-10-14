import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { createReadStream, watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const project=fileURLToPath(new URL('../',import.meta.url));
const base=resolve(project,'dist');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  // Preview both domain-root and GitHub project-subpath deployments.
  if(pathname.startsWith('/cluetek-ecosystem/'))pathname=pathname.slice('/cluetek-ecosystem'.length);
  let file=resolve(base,'.'+pathname);
  if(file!==base&&!file.startsWith(base+sep)){res.writeHead(403);return res.end('Forbidden');}
  let info=await stat(file);if(info.isDirectory()){file=resolve(file,'index.html');info=await stat(file);}
  const headers={'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'};
  let start=0,end=info.size-1,status=200;
  if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}start=m[1]?Number(m[1]):Math.max(0,info.size-Number(m[2]));end=m[1]?(m[2]?Math.min(Number(m[2]),end):end):end;if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;}
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);
  if(req.method==='HEAD')return res.end();createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
 }catch{
  let fallback;
  try{fallback=await readFile(resolve(base,'404.html'),'utf8');res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});}
  catch{fallback='<h1>Preview is rebuilding.</h1><p>Reload this page in a moment.</p>';res.writeHead(503,{'Content-Type':'text/html; charset=utf-8','Retry-After':'1'});}
  res.end(fallback);
 }
});
server.listen(port,'127.0.0.1',()=>console.log(`ClueTek preview: http://127.0.0.1:${port}`));
server.on('error',error=>{console.error(`Preview could not start on port ${port}: ${error.message}. Try PORT=${port+1} npm run dev.`);process.exit(1);});
let timer,building=false;
if(process.argv.includes('--watch'))watch(resolve(project,'src'),{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(()=>{if(building)return;building=true;const p=spawn(process.execPath,[resolve(project,'scripts/build.mjs')],{stdio:'inherit'});p.on('exit',()=>building=false);},250);});
process.on('SIGINT',()=>{server.close();process.exit();});
