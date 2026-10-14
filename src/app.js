import { copy } from './modules/i18n.mjs';
import { card, reelCard, esc, catLabel } from './modules/templates.mjs';
import { icon } from './modules/icons.mjs';

const lang=document.body.dataset.lang;
const root=document.body.dataset.root;
const locale=lang==='vi'?'vi/':'';
const c=copy[lang];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
let items=[],saved=new Set(),category='all',limit=6,toastTimer;
try { saved=new Set(JSON.parse(localStorage.getItem('cluetek:saved')||'[]')); } catch { saved=new Set(); }
function persist(){try{localStorage.setItem('cluetek:saved',JSON.stringify([...saved]));}catch{/* Preferences remain available for this visit. */}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2800);}
function syncSaved(){
 $$('[data-save]').forEach(b=>{const active=saved.has(b.dataset.save);b.setAttribute('aria-pressed',String(active));const title=items.find(i=>i.id===b.dataset.save)?.title[lang]||'';b.setAttribute('aria-label',`${active?c.saved:c.save}${title?': '+title:''}`);if(b.querySelector('span'))b.querySelector('span').textContent=active?c.saved:c.save;});
}
syncSaved();
function matches(item,term){return `${item.title.en} ${item.title.vi} ${item.description.en} ${item.description.vi} ${item.body.en} ${item.body.vi} ${catLabel(item,c)}`.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(term.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));}
function renderLibrary(){
 if(!$('#learn-grid'))return;
 const term=$('#library-search').value.trim();
 const filtered=items.filter(i=>(category==='all'||category===i.category||(category==='saved'&&saved.has(i.id)))&&matches(i,term));
 $('#learn-grid').innerHTML=filtered.slice(0,limit).map(i=>card(i,lang,root,locale)).join('');
 $('#empty-state').hidden=filtered.length>0;
 $('#load-more').hidden=limit>=filtered.length;
 $('#filter-status').textContent=`${filtered.length} ${c.count}`;
 syncSaved();
}
function showSearchResults(){
 const query=$('#global-search').value.trim();
 const results=items.filter(i=>matches(i,query)).slice(0,query?25:7);
 $('#search-results').innerHTML=results.length?results.map(i=>`<a class="search-result" href="${root+locale}learn/${i.slug}/">${icon(i.icon)}<span>${esc(i.title[lang])}<small>${catLabel(i,c)}</small></span>${icon('chevron')}</a>`).join(''):`<p>${c.noSearch}</p>`;
}
function openDialog(dialog){dialog.showModal();}
function openVideo(id){
 const item=items.find(i=>i.id===id&&i.video);if(!item)return;
 const player=$('#video-player');
 $('#video-heading').textContent=item.title[lang];player.src=root+item.video.src;player.poster=root+item.video.poster;
 $('#video-article-link').href=root+locale+`learn/${item.slug}/`;
 openDialog($('#video-dialog'));
 player.play().catch(()=>{/* Native controls remain available if autoplay is blocked. */});
}
$$('dialog').forEach(dialog=>{
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
});
$('#video-dialog').addEventListener('close',()=>{const p=$('#video-player');p.pause();p.removeAttribute('src');p.load();});
$$('.search-open').forEach(b=>b.addEventListener('click',()=>{showSearchResults();openDialog($('#search-dialog'));$('#global-search').focus();}));
$('#global-search').addEventListener('input',showSearchResults);
document.addEventListener('keydown',e=>{const activeDialog=document.querySelector('dialog[open]');if(e.key==='Escape'&&activeDialog){e.preventDefault();activeDialog.close();return;}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(!document.querySelector('dialog[open]')){showSearchResults();openDialog($('#search-dialog'));$('#global-search').focus();}}});
const menu=$('.menu-toggle');
function closeMenu(){menu.setAttribute('aria-expanded','false');$('#mobile-nav').hidden=true;}
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));$('#mobile-nav').hidden=expanded;});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
matchMedia('(min-width: 801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
document.addEventListener('click',e=>{
 const save=e.target.closest('[data-save]');
 if(save){const id=save.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);persist();syncSaved();if(category==='saved')renderLibrary();}
 const video=e.target.closest('[data-video]');if(video)openVideo(video.dataset.video);
 const topic=e.target.closest('[data-topic]');if(topic)$(`[data-filter="${topic.dataset.topic}"]`)?.click();
 const info=e.target.closest('[data-info]');if(info){const type=info.dataset.info;$('#info-heading').textContent=c[`${type}Title`];$('#info-text').textContent=c[`${type}Text`];$('#clear-storage').hidden=type!=='privacy';$('#info-status').textContent='';openDialog($('#info-dialog'));}
});
$('#clear-storage').addEventListener('click',()=>{saved.clear();try{localStorage.removeItem('cluetek:saved');localStorage.removeItem('cluetek:language');}catch{}syncSaved();renderLibrary();$('#info-status').textContent=c.storageCleared;});
$('.language-switch').addEventListener('click',()=>{try{localStorage.setItem('cluetek:language',lang==='en'?'vi':'en');}catch{}});
if($('#library-search')){
 $('#library-search').addEventListener('input',()=>{limit=6;renderLibrary();});
 $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;limit=6;$$('[data-filter]').forEach(f=>{const active=f===b;f.classList.toggle('active',active);f.setAttribute('aria-pressed',String(active));});renderLibrary();}));
 $('#clear-filters').addEventListener('click',()=>{$('#library-search').value='';$('[data-filter=all]').click();$('#library-search').focus();});
 $('#load-more').addEventListener('click',()=>{const oldCount=$$('#learn-grid .learn-card').length;limit+=6;renderLibrary();$$('#learn-grid .learn-card')[oldCount]?.querySelector('a')?.focus({preventScroll:true});});
 $('#all-films').addEventListener('click',()=>{const videos=items.filter(i=>i.video);$('#reels-track').innerHTML=videos.map(i=>reelCard(i,lang,root)).join('');$('#all-films').hidden=true;$('#reels-track').querySelectorAll('button')[5]?.focus({preventScroll:true});});
 function updateSpeed(value){$('#speed-range').value=value;$('#speed-value').textContent=value;$('#speed-result').textContent=new Intl.NumberFormat(lang==='vi'?'vi-VN':'en-US',{maximumFractionDigits:3}).format(value/8);$('#speed-range').setAttribute('aria-valuetext',`${value} Mbps, ${value/8} MB/s`);}
 $('#speed-range').addEventListener('input',e=>updateSpeed(Number(e.target.value)));
 $$('[data-speed]').forEach(b=>b.addEventListener('click',()=>updateSpeed(Number(b.dataset.speed))));
 updateSpeed(100);
 function updateConnection(){const w=$('#wifi-switch').checked,i=$('#internet-switch').checked;[['wifi-wire',w],['internet-wire',i]].forEach(([id,on])=>{const line=$('#'+id);line.classList.toggle('off',!on);line.querySelector('b').textContent=on?'✓':'×';});$('#connection-state').textContent=w&&i?c.stateBoth:w?c.stateWifi:i?c.stateInternet:c.stateNeither;$('#connection-state').classList.toggle('issue',!w||!i);}
 $('#wifi-switch').addEventListener('change',updateConnection);$('#internet-switch').addEventListener('change',updateConnection);
}
if($('#share-article'))$('#share-article').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast(c.copied);}catch{toast(c.copyFailed);}});
try{
 const response=await fetch(root+'content.json');if(!response.ok)throw new Error('Content unavailable');items=await response.json();syncSaved();document.body.dataset.ready='true';
 const selected=new URLSearchParams(location.search).get('topic');if(selected&&$(`[data-filter="${CSS.escape(selected)}"]`))$(`[data-filter="${CSS.escape(selected)}"]`).click();
}catch{
 const message=lang==='vi'?'Không tải được thư viện tương tác. Hãy tải lại trang. Bạn vẫn có thể đọc các bài đang hiển thị.':'The interactive library could not load. Reload this page to try again. The visible explanations are still available.';
 toast(message);$$('.search-open,#load-more,#all-films,[data-filter]').forEach(b=>b.disabled=true);
}
