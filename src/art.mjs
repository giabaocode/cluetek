import { icon } from './icons.mjs';
export const heroArt = (c) => `<div class="hero-art" aria-label="${c.artNote}">
 <div class="art-grid"></div><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
 <svg class="lens-art" viewBox="0 0 600 600" fill="none" aria-hidden="true">
 <defs>
 <linearGradient id="lens-edge" x1="130" y1="110" x2="435" y2="460" gradientUnits="userSpaceOnUse"><stop stop-color="#F4F9FF"/><stop offset=".28" stop-color="#a9c7d9"/><stop offset=".5" stop-color="#253d55"/><stop offset=".78" stop-color="#d3e4ed"/><stop offset="1" stop-color="#4b7387"/></linearGradient>
 <linearGradient id="lens-face" x1="170" y1="130" x2="340" y2="430" gradientUnits="userSpaceOnUse"><stop stop-color="#162d43"/><stop offset="1" stop-color="#0a1728"/></linearGradient>
 <linearGradient id="handle" x1="320" y1="370" x2="470" y2="510" gradientUnits="userSpaceOnUse"><stop stop-color="#a6c4d5"/><stop offset=".36" stop-color="#f1f7ff"/><stop offset=".62" stop-color="#7399ad"/><stop offset="1" stop-color="#25435b"/></linearGradient>
 <linearGradient id="trace" x1="170" y1="340" x2="370" y2="180" gradientUnits="userSpaceOnUse"><stop stop-color="#02a3cb"/><stop offset=".6" stop-color="#1cdcf2"/><stop offset="1" stop-color="#a3f7ff"/></linearGradient>
 <radialGradient id="glass"><stop stop-color="#20d5ed" stop-opacity=".07"/><stop offset=".8" stop-color="#092033" stop-opacity=".2"/><stop offset="1" stop-color="#7febff" stop-opacity=".13"/></radialGradient>
 <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
 </defs>
 <ellipse cx="301" cy="522" rx="169" ry="19" fill="#000" opacity=".5" filter="url(#shadow)"/>
 <g transform="rotate(-12 300 300)">
 <path d="m356 379 96 110" stroke="#06121e" stroke-width="65" stroke-linecap="round"/>
 <path d="m350 365 100 112" stroke="url(#handle)" stroke-width="53" stroke-linecap="round"/>
 <circle cx="265" cy="260" r="167" fill="#071320" stroke="#173346" stroke-width="18" transform="translate(0 14)"/>
 <circle cx="265" cy="260" r="164" fill="url(#lens-face)" stroke="url(#lens-edge)" stroke-width="28"/>
 <circle cx="265" cy="260" r="143" stroke="#ebf8ff" stroke-opacity=".34" stroke-width="2"/>
 <circle cx="265" cy="260" r="139" fill="url(#glass)"/>
 <g stroke="#56d3e6" stroke-opacity=".15" stroke-width="1"><path d="M150 215h234M145 260h240M153 305h225M220 128v264M265 122v275M310 132v253"/></g>
 <path d="m155 321 66-61h60v-51" stroke="#028cab" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 7)"/>
 <path d="m155 313 66-61h60v-51" stroke="url(#trace)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
 <circle cx="281" cy="184" r="31" fill="#0c1b2a" stroke="#12d9ee" stroke-width="14"/>
 <circle cx="281" cy="184" r="13" fill="#8ef3ff"/>
 <path d="m209 318 61 0 58-53v-14" stroke="url(#trace)" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>
 <circle cx="328" cy="239" r="7" fill="#d9fcff"/>
 <path d="M151 178a141 141 0 0 1 120-61" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
 </g>
 <g stroke="#548196" stroke-width="1"><path d="M128 165H57v-50"/><path d="M422 263h116v78"/><path d="M256 436v73h-88"/></g>
 <g fill="#24d9ed"><circle cx="128" cy="165" r="4"/><circle cx="422" cy="263" r="4"/><circle cx="256" cy="436" r="4"/></g>
 </svg>
 <a href="#library" data-topic="networking" class="art-node node-connections">${icon('wifi')}<span>${c.connections}</span></a>
 <a href="#library" data-topic="hardware" class="art-node node-devices">${icon('chip')}<span>${c.devices}</span></a>
 <a href="#library" data-topic="safety" class="art-node node-data">${icon('layers')}<span>${c.data}</span></a>
 <div class="art-caption"><span class="live-dot"></span>${c.artTag}</div>
 </div>`;

export function illustration(item,lang='en') {
 const id=Number(item.id.slice(2));
 if(id===1) return `<div class="topic-art network-art">${icon('phone')}<span class="connection-line"></span>${icon('router')}<span class="connection-line broken"></span>${icon('globe')}<span class="tiny-note">Wi-Fi <b>✓</b> &nbsp; / &nbsp; Internet <b>×</b></span></div>`;
 if(id===2) return `<div class="topic-art sync-art">${icon('layers')}<span class="sync-flow">↔</span>${icon('shield')}<span class="tiny-note">${lang==='vi'?'đồng bộ / khôi phục':'sync / recover'}</span></div>`;
 if(id===3) return `<div class="topic-art number-art"><span>100<small>Mbps</small></span><span class="divide">÷ 8</span><span>${lang==='vi'?'12,5':'12.5'}<small>MB/s</small></span></div>`;
 if(id===4) return `<div class="topic-art network-art">${icon('globe')}<span class="connection-line"></span>${icon('router')}<span class="connection-line"></span>${icon('wifi')}<span class="tiny-note">${lang==='vi'?'modem / router / điểm truy cập':'modem / router / access point'}</span></div>`;
 if(id===5) return `<div class="topic-art bands-art"><div class="wave wave-a"></div><div class="wave wave-b"></div>${icon('router')}<span class="band-label">2.4 <small>GHz</small></span><span class="band-label second">5 <small>GHz</small></span></div>`;
 return `<div class="topic-art general-art">${icon(item.icon)}<div class="diagram-ring"></div><div class="diagram-ring ring-2"></div><span class="tiny-note">${lang==='vi'?(item.category==='networking'?'theo dấu kết nối':item.category==='safety'?'tìm hiểu bên trong':'khám phá cơ chế'):(item.category==='networking'?'follow the connection':item.category==='safety'?'look beneath the surface':'inside the mechanism')}</span></div>`;
}
