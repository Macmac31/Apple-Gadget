// ════════════════════════════════════════════════════════════
// COLOR MAP
// ════════════════════════════════════════════════════════════
const COLOR_HEX = {
  'Cosmic Orange':'#d4712a','Deep Blue':'#1c3a5c','Silver':'#e8e8e0',
  'Sky Blue':'#87b8d8','Cloud White':'#f0ede8','Light Gold':'#d4b896','Space Black':'#2a2a2a',
  'Lavender':'#b8a8d4','Mist Blue':'#8aaec4','Sage':'#8aab8a',
  'White':'#f5f5f5','Black':'#1a1a1a','Pink':'#e8a0b8',
  'Ultramarine':'#3a5cac','Teal':'#4a9090',
  'Black Titanium':'#2a2a2c','Desert Titanium':'#c8a86c','Natural Titanium':'#b0a898','White Titanium':'#e8e4dc',
  'Blue':'#4a78b8','Green':'#4a8860','Yellow':'#e8c840','Red':'#c02020','Midnight':'#1a1c2c','Starlight':'#e8e0d0','Purple':'#7860a8',
  'Alpine Green':'#4a7050','Gold':'#c4a048','Graphite':'#6a6a6a','Sierra Blue':'#6890b8',
  'Pacific Blue':'#3858a0','(PRODUCT)RED':'#c02020',
  'Deep Purple':'#3a2060','Blue Titanium':'#4a6888',
  'Midnight Green':'#2a4a38','Space Grey':'#4a4a4c',
};
const LIGHT_COLORS = new Set(['Silver','Cloud White','Light Gold','White','White Titanium','Natural Titanium','Starlight','Desert Titanium','Gold']);

function hexFor(c) { return COLOR_HEX[c] || '#888'; }
function isLight(c) { return LIGHT_COLORS.has(c); }
function swatchStyle(c) { const h = hexFor(c); return `background:${h};${isLight(c) ? 'border:1.5px solid rgba(255,255,255,.2);' : ''}`; }

// ════════════════════════════════════════════════════════════
// LINEUP DATA & RENDERING
// ════════════════════════════════════════════════════════════
const lineup = [
  { id:'pro', cls:'card-pro', sid:'sec-pro', tag:'Titanium. A18 Pro. Camera Control.', price:'&#8369;78,990',
    models:[
      { label:'iPhone 17 Pro', variants:[{c:'Cosmic Orange',f:'iphone17pro_cosmic_orange.png'},{c:'Deep Blue',f:'iphone17pro_deepblue.png'},{c:'Silver',f:'iphone17pro_silver.png'}] },
      { label:'iPhone 17 Pro Max', variants:[{c:'Cosmic Orange',f:'iphone17promax_cosmic_orange.png'},{c:'Deep Blue',f:'iphone17promax_deepblue.png'},{c:'Silver',f:'iphone17promax_silver.png'}] },
    ]},
  { id:'air', cls:'card-air', sid:'sec-air', tag:'The thinnest iPhone ever.', price:'&#8369;72,990',
    models:[
      { label:'iPhone Air', variants:[{c:'Sky Blue',f:'iphoneair_skyblue.png'},{c:'Cloud White',f:'iphoneair_cloudwhite.png'},{c:'Light Gold',f:'iphoneair_lightgold.png'},{c:'Space Black',f:'iphoneair_spaceblack.png'}] },
    ]},
  { id:'std', cls:'card-std', sid:'sec-17', tag:'Even more delightful. Even more durable.', price:'&#8369;57,990',
    models:[
      { label:'iPhone 17', variants:[{c:'Lavender',f:'iphone17_lavender.png'},{c:'Mist Blue',f:'iphone17_mistblue.png'},{c:'Sage',f:'iphone17_sage.png'},{c:'White',f:'iphone17_white.png'},{c:'Black',f:'iphone17_black.png'}] },
    ]},
  { id:'e', cls:'card-e', sid:'sec-17e', tag:'Feature stacked. Value packed.', price:'&#8369;44,990', isNew:true,
    models:[
      { label:'iPhone 17e', variants:[{c:'Pink',f:'iphone17e_pink.png'},{c:'White',f:'iphone17e_white.png'},{c:'Black',f:'iphone17e_black.png'}] },
    ]},
  { id:'i16', cls:'card-16', sid:'sec-16', tag:'A17 Bionic chip. Advanced camera system.', price:'&#8369;46,990',
    models:[
      { label:'iPhone 16', variants:[{c:'Ultramarine',f:'iphone16_ultramarine.png'},{c:'Teal',f:'iphone16_teal.png'},{c:'Pink',f:'iphone16_pink.png'},{c:'White',f:'iphone16_white.png'},{c:'Black',f:'iphone16_black.png'}] },
      { label:'iPhone 16 Plus', variants:[{c:'Ultramarine',f:'iphone16_ultramarine.png'},{c:'Teal',f:'iphone16_teal.png'},{c:'Pink',f:'iphone16_pink.png'},{c:'White',f:'iphone16_white.png'},{c:'Black',f:'iphone16_black.png'}] },
    ]},
];

const lstate = {};
lineup.forEach(item => { lstate[item.id] = {mi:0, vi:0}; });

function buildLineupCard(item) {
  const card = document.createElement('div');
  card.className = `lineup-card ${item.cls}`;
  card.id = item.sid;
  const m0 = item.models[0], v0 = m0.variants[0];
  const opts = item.models.map((m,i) => `<option value="${i}">${m.label}</option>`).join('');
  const topHtml = item.models.length > 1
    ? `<div class="model-select-wrap"><select class="model-select" onchange="lSwitchModel(this,'${item.id}')">${opts}</select></div>`
    : `<div class="model-label">${m0.label}${item.isNew ? '<span class="new-pill">New</span>' : ''}</div>`;
  const swHtml = m0.variants.map((v,i) => `<div class="swatch${i===0?' active':''}" style="${swatchStyle(v.c)}" title="${v.c}" onclick="lPick('${item.id}',${i})"></div>`).join('');
  card.innerHTML = `
    <div class="color-bar"></div>
    ${topHtml}
    <div class="photo-wrap"><img src="images/${v0.f}" alt="${v0.c}" id="limg-${item.id}"></div>
    <div class="color-label" id="llbl-${item.id}">${v0.c}</div>
    <div class="swatches" id="lsw-${item.id}">${swHtml}</div>
    <div class="card-info">
      <h3 id="lname-${item.id}">${m0.label}</h3>
      <p class="tag">${item.tag}</p>
      <p class="price">From ${item.price}</p>
      <div class="card-ctas"><button class="btn filled">Learn more</button><button class="btn">Buy ›</button></div>
    </div>`;
  return card;
}

function renderLineup() {
  const lgrid = document.getElementById('lineup-grid');
  lineup.forEach(item => lgrid.appendChild(buildLineupCard(item)));
}

function lUpdateCard(id) {
  const item = lineup.find(x => x.id === id);
  const s = lstate[id];
  const model = item.models[s.mi];
  const v = model.variants[s.vi];
  const img = document.getElementById('limg-' + id);
  img.classList.add('fade');
  setTimeout(() => { img.src = 'images/' + v.f; img.onload = () => img.classList.remove('fade'); if(img.complete) img.classList.remove('fade'); }, 180);
  document.getElementById('llbl-' + id).textContent = v.c;
  document.getElementById('lname-' + id).textContent = model.label;
  document.getElementById('lsw-' + id).innerHTML = model.variants.map((vv,i) =>
    `<div class="swatch${i===s.vi?' active':''}" style="${swatchStyle(vv.c)}" title="${vv.c}" onclick="lPick('${id}',${i})"></div>`
  ).join('');
}
function lSwitchModel(sel, id) { lstate[id].mi = parseInt(sel.value); lstate[id].vi = 0; lUpdateCard(id); }
function lPick(id, idx) { lstate[id].vi = idx; lUpdateCard(id); }

// ════════════════════════════════════════════════════════════
// CATALOG DATA & RENDERING
// ════════════════════════════════════════════════════════════
const catalogGroups = [
  { id:'cat-17pro', name:'iPhone 17 Pro', sub:'The latest pro. Titanium.', tag:'gtag-pro', variants:[{c:'Cosmic Orange',f:'iphone17pro_cosmic_orange.png'},{c:'Deep Blue',f:'iphone17pro_deepblue.png'},{c:'Silver',f:'iphone17pro_silver.png'}]},
  { id:'cat-17promax', name:'iPhone 17 Pro Max', sub:'Bigger. More battery.', tag:'gtag-pro', variants:[{c:'Cosmic Orange',f:'iphone17promax_cosmic_orange.png'},{c:'Deep Blue',f:'iphone17promax_deepblue.png'},{c:'Silver',f:'iphone17promax_silver.png'}]},
  { id:'cat-air', name:'iPhone Air', sub:'The thinnest iPhone ever.', tag:'gtag-air', variants:[{c:'Sky Blue',f:'iphoneair_skyblue.png'},{c:'Cloud White',f:'iphoneair_cloudwhite.png'},{c:'Light Gold',f:'iphoneair_lightgold.png'},{c:'Space Black',f:'iphoneair_spaceblack.png'}]},
  { id:'cat-17', name:'iPhone 17', sub:'Even more delightful.', tag:'gtag-17', variants:[{c:'Lavender',f:'iphone17_lavender.png'},{c:'Mist Blue',f:'iphone17_mistblue.png'},{c:'Sage',f:'iphone17_sage.png'},{c:'White',f:'iphone17_white.png'},{c:'Black',f:'iphone17_black.png'}]},
  { id:'cat-17e', name:'iPhone 17e', sub:'Feature stacked. Value packed.', tag:'gtag-17e', variants:[{c:'Pink',f:'iphone17e_pink.png'},{c:'White',f:'iphone17e_white.png'},{c:'Black',f:'iphone17e_black.png'}]},
  { id:'cat-16', name:'iPhone 16', sub:'Amazing performance.', tag:'gtag-16', variants:[{c:'Ultramarine',f:'iphone16_ultramarine.png'},{c:'Teal',f:'iphone16_teal.png'},{c:'Pink',f:'iphone16_pink.png'},{c:'White',f:'iphone16_white.png'},{c:'Black',f:'iphone16_black.png'}]},
  { id:'cat-16plus', name:'iPhone 16 Plus', sub:'Larger display.', tag:'gtag-16', variants:[{c:'Ultramarine',f:'iphone16_ultramarine.png'},{c:'Teal',f:'iphone16_teal.png'},{c:'Pink',f:'iphone16_pink.png'},{c:'White',f:'iphone16_white.png'},{c:'Black',f:'iphone16_black.png'}]},
  { id:'cat-16e', name:'iPhone 16e', sub:'A great entry point.', tag:'gtag-16', variants:[{c:'Black',f:'iphone16e_black.png'},{c:'White',f:'iphone16e_white.png'}]},
  { id:'cat-16pro', name:'iPhone 16 Pro', sub:'Titanium. Camera Control.', tag:'gtag-pro', variants:[{c:'Black Titanium',f:'iphone16pro_blacktitanium.png'},{c:'Desert Titanium',f:'iphone16pro_deserttitanium.png'},{c:'Natural Titanium',f:'iphone16pro_naturaltitanium.png'},{c:'White Titanium',f:'iphone16pro_whitetitanium.png'}]},
  { id:'cat-16promax', name:'iPhone 16 Pro Max', sub:'The biggest Pro.', tag:'gtag-pro', variants:[{c:'Black Titanium',f:'iphone16promax_blacktitanium.png'},{c:'Desert Titanium',f:'iphone16promax_deserttitanium.png'},{c:'Natural Titanium',f:'iphone16promax_naturaltitanium.png'},{c:'White Titanium',f:'iphone16promax_whitetitanium.png'}]},
  { id:'cat-15', name:'iPhone 15', sub:'Dynamic Island. 48MP. USB‑C.', tag:'gtag-15', variants:[{c:'Black',f:'iphone15_black.png'},{c:'Blue',f:'iphone15_blue.png'},{c:'Green',f:'iphone15_green.png'},{c:'Pink',f:'iphone15_pink.png'},{c:'Yellow',f:'iphone15_yellow.png'}]},
  { id:'cat-15plus', name:'iPhone 15 Plus', sub:'Larger. Same great features.', tag:'gtag-15', variants:[{c:'Black',f:'iphone15plus_black.png'},{c:'Blue',f:'iphone15plus_blue.png'},{c:'Green',f:'iphone15plus_green.png'},{c:'Pink',f:'iphone15plus_pink.png'},{c:'Yellow',f:'iphone15plus_yellow.png'}]},
  { id:'cat-15pro', name:'iPhone 15 Pro', sub:'Titanium. So strong. So light.', tag:'gtag-pro', variants:[{c:'Black Titanium',f:'iphone15pro_blacktitanium.png'},{c:'Blue Titanium',f:'iphone15pro_bluetitanium.png'},{c:'Natural Titanium',f:'iphone15pro_natural_titanium.png'},{c:'White Titanium',f:'iphone15pro_whitetitanium.png'}]},
  { id:'cat-15promax', name:'iPhone 15 Pro Max', sub:'The biggest Pro yet.', tag:'gtag-pro', variants:[{c:'Black Titanium',f:'iphone15promax_blacktitanium.png'},{c:'Blue Titanium',f:'iphone15promax_bluetitanum.png'},{c:'Natural Titanium',f:'iphone15promax_naturaltitanum.png'},{c:'White Titanium',f:'iphone15promax_white.png'}]},
  { id:'cat-14', name:'iPhone 14', sub:'More power. More resolution.', tag:'gtag-14', variants:[{c:'Blue',f:'iphone14_blue.png'},{c:'Midnight',f:'iphone14_midnight.png'},{c:'Purple',f:'iphone14_purple.png'},{c:'(PRODUCT)RED',f:'iphone14_red.png'},{c:'Starlight',f:'iphone14_starlight.png'},{c:'Yellow',f:'iphone14_yellow.png'}]},
  { id:'cat-14plus', name:'iPhone 14 Plus', sub:'Big screen. Big battery.', tag:'gtag-14', variants:[{c:'Blue',f:'iphone14plus_blue.png'},{c:'Midnight',f:'iphone14plus_midnight.png'},{c:'Purple',f:'iphone14plus_purple.png'},{c:'(PRODUCT)RED',f:'iphone14plus_red.png'},{c:'Starlight',f:'iphone14plus_starlight.png'},{c:'Yellow',f:'iphone14plus_yellow.png'}]},
  { id:'cat-14pro', name:'iPhone 14 Pro', sub:'Dynamic Island. Always-On.', tag:'gtag-pro', variants:[{c:'Deep Purple',f:'iphone14pro_deeppurple.png'},{c:'Gold',f:'iphone14pro_gold.png'},{c:'Silver',f:'iphone14pro_silver.png'},{c:'Space Black',f:'iphone14pro_spaceblack.png'}]},
  { id:'cat-14promax', name:'iPhone 14 Pro Max', sub:'The largest Pro display.', tag:'gtag-pro', variants:[{c:'Deep Purple',f:'iphone14promax_deeppurple.png'},{c:'Gold',f:'iphone14promax_gold.png'},{c:'Silver',f:'iphone14promax_silver.png'},{c:'Space Black',f:'iphone14promax_spaceblack.png'}]},
  { id:'cat-13', name:'iPhone 13', sub:'Beautifully bright. Super fast.', tag:'gtag-13', variants:[{c:'Blue',f:'iphone13_blue.png'},{c:'Green',f:'iphone13_green.png'},{c:'Midnight',f:'iphone13_midnight.png'},{c:'Pink',f:'iphone13_pink.png'},{c:'(PRODUCT)RED',f:'iphone13_product_red.png'},{c:'Starlight',f:'iphone13_starlight.png'}]},
  { id:'cat-13mini', name:'iPhone 13 mini', sub:'Compact. Capable.', tag:'gtag-13', variants:[{c:'Blue',f:'iphone13mini_blue.png'},{c:'Green',f:'iphone13mini_green.png'},{c:'Midnight',f:'iphone13mini_midnight.png'},{c:'Pink',f:'iphone13mini_pink.png'},{c:'(PRODUCT)RED',f:'iphone13mini_productred.png'},{c:'Starlight',f:'iphone13mini_starlight.png'}]},
  { id:'cat-13pro', name:'iPhone 13 Pro', sub:'Pro. Beyond.', tag:'gtag-pro', variants:[{c:'Alpine Green',f:'iphone13pro_alpinegreen.png'},{c:'Gold',f:'iphone13pro_gold.png'},{c:'Graphite',f:'iphone13pro_graphite.png'},{c:'Sierra Blue',f:'iphone13pro_sierrablue.png'},{c:'Silver',f:'iphone13pro_silver.png'}]},
  { id:'cat-13promax', name:'iPhone 13 Pro Max', sub:'The biggest Pro camera.', tag:'gtag-pro', variants:[{c:'Alpine Green',f:'iphone13promax_alpinegreen.png'},{c:'Gold',f:'iphone13promax_gold.png'},{c:'Graphite',f:'iphone13promax_graphite.png'},{c:'Sierra Blue',f:'iphone13promax_sierrablue.png'},{c:'Silver',f:'iphone13promax_silver.png'}]},
  { id:'cat-12', name:'iPhone 12', sub:'5G. A14 Bionic.', tag:'gtag-12', variants:[{c:'Black',f:'iphone12_black.png'},{c:'Blue',f:'iphone12_blue.png'},{c:'Green',f:'iphone12_green.png'},{c:'Purple',f:'iphone12_purple.png'},{c:'(PRODUCT)RED',f:'iphone12_red.png'},{c:'White',f:'iphone12_white.png'}]},
  { id:'cat-12mini', name:'iPhone 12 mini', sub:'Small but mighty.', tag:'gtag-12', variants:[{c:'Black',f:'iphone12mini_black.png'},{c:'Blue',f:'iphone12mini_blue.png'},{c:'Green',f:'iphone12mini_green.png'},{c:'Purple',f:'iphone12mini_purple.png'},{c:'(PRODUCT)RED',f:'iphone12mini_red.png'},{c:'White',f:'iphone12mini_white.png'}]},
  { id:'cat-12pro', name:'iPhone 12 Pro', sub:"It's a leap year.", tag:'gtag-pro', variants:[{c:'Gold',f:'iphone12pro_gold.png'},{c:'Graphite',f:'iphone12pro_graphite.png'},{c:'Pacific Blue',f:'iphone12pro_pacificblue.png'},{c:'Silver',f:'iphone12pro_silver.png'}]},
  { id:'cat-12promax', name:'iPhone 12 Pro Max', sub:'The largest Pro camera.', tag:'gtag-pro', variants:[{c:'Gold',f:'iphone12promax_gold.png'},{c:'Graphite',f:'iphone12promax_graphite.png'},{c:'Pacific Blue',f:'iphone12promax_pacificblue.png'},{c:'Silver',f:'iphone12promax_silver.png'}]},
  { id:'cat-11', name:'iPhone 11', sub:'This changes everything. Again.', tag:'gtag-11', variants:[{c:'Black',f:'iphone11_black.png'},{c:'Green',f:'iphone11_green.png'},{c:'Purple',f:'iphone11_purple.png'},{c:'(PRODUCT)RED',f:'iphone11_red.png'},{c:'White',f:'iphone11_white.png'},{c:'Yellow',f:'iphone11_yellow.png'}]},
  { id:'cat-11pro', name:'iPhone 11 Pro', sub:'The first iPhone Pro.', tag:'gtag-pro', variants:[{c:'Gold',f:'iphone11pro_gold.png'},{c:'Midnight Green',f:'iphone11pro_midnightgreen.png'},{c:'Silver',f:'iphone11pro_silver.png'},{c:'Space Grey',f:'iphone11pro_spacegrey.png'}]},
  { id:'cat-11promax', name:'iPhone 11 Pro Max', sub:'The biggest Pro display.', tag:'gtag-pro', variants:[{c:'Gold',f:'iphone11promax_gold.png'},{c:'Midnight Green',f:'iphone11promax_midnightgreen.png'},{c:'Silver',f:'iphone11promax_silver.png'},{c:'Space Grey',f:'iphone11promax_spacegrey.png'}]},
];

const catalogSections = [
  { header:'iPhone 17 Pro', sub:'The latest pro lineup — Titanium.', tag:'gtag-pro', ids:['cat-17pro','cat-17promax'] },
  { header:'iPhone Air', sub:'The thinnest iPhone ever.', tag:'gtag-air', ids:['cat-air'] },
  { header:'iPhone 17', sub:'Even more delightful. Even more durable.', tag:'gtag-17', ids:['cat-17'] },
  { header:'iPhone 17e', sub:'Feature stacked. Value packed.', tag:'gtag-17e', ids:['cat-17e'] },
  { header:'iPhone 16 & 16 Plus', sub:'A17 Bionic. Advanced camera system.', tag:'gtag-16', ids:['cat-16','cat-16plus'] },
  { header:'iPhone 16e', sub:'A great new entry point.', tag:'gtag-16', ids:['cat-16e'] },
  { header:'iPhone 16 Pro & 16 Pro Max', sub:'Camera Control. ProRes video.', tag:'gtag-pro', ids:['cat-16pro','cat-16promax'] },
  { header:'iPhone 15 & 15 Plus', sub:'Dynamic Island. 48MP. USB‑C.', tag:'gtag-15', ids:['cat-15','cat-15plus'] },
  { header:'iPhone 15 Pro & 15 Pro Max', sub:'Titanium. So strong. So light.', tag:'gtag-pro', ids:['cat-15pro','cat-15promax'] },
  { header:'iPhone 14 & 14 Plus', sub:'More power. More resolution.', tag:'gtag-14', ids:['cat-14','cat-14plus'] },
  { header:'iPhone 14 Pro & 14 Pro Max', sub:'Dynamic Island. Always-On display.', tag:'gtag-pro', ids:['cat-14pro','cat-14promax'] },
  { header:'iPhone 13 & 13 mini', sub:'Beautifully bright. Super fast.', tag:'gtag-13', ids:['cat-13','cat-13mini'] },
  { header:'iPhone 13 Pro & 13 Pro Max', sub:'Pro. Beyond.', tag:'gtag-pro', ids:['cat-13pro','cat-13promax'] },
  { header:'iPhone 12 & 12 mini', sub:'5G. A14 Bionic.', tag:'gtag-12', ids:['cat-12','cat-12mini'] },
  { header:'iPhone 12 Pro & 12 Pro Max', sub:"It's a leap year.", tag:'gtag-pro', ids:['cat-12pro','cat-12promax'] },
  { header:'iPhone 11', sub:'This changes everything. Again.', tag:'gtag-11', ids:['cat-11'] },
  { header:'iPhone 11 Pro & 11 Pro Max', sub:'The first iPhone Pro.', tag:'gtag-pro', ids:['cat-11pro','cat-11promax'] },
];

const cstate = {};
catalogGroups.forEach(g => { cstate[g.id] = 0; });

function buildCatCard(group) {
  const card = document.createElement('div');
  card.className = 'cat-card';
  const v0 = group.variants[0];
  const swHtml = group.variants.map((v,i) =>
    `<div class="cat-swatch${i===0?' active':''}" style="${swatchStyle(v.c)}" title="${v.c}" onclick="cPick('${group.id}',${i})"></div>`
  ).join('');
  card.innerHTML = `
    <div class="cat-photo"><img src="images/${v0.f}" alt="${v0.c}" id="cimg-${group.id}" onclick="openLightbox('images/${v0.f}','${group.name} — ${v0.c}')"></div>
    <div class="cat-color-label" id="clbl-${group.id}">${v0.c}</div>
    <div class="cat-swatches" id="csw-${group.id}">${swHtml}</div>
    <div class="cat-name">${group.name}</div>`;
  return card;
}

function cPick(id, idx) {
  cstate[id] = idx;
  const group = catalogGroups.find(g => g.id === id);
  const v = group.variants[idx];
  const img = document.getElementById('cimg-' + id);
  img.classList.add('fade');
  setTimeout(() => {
    img.src = 'images/' + v.f;
    img.onclick = () => openLightbox('images/' + v.f, group.name + ' — ' + v.c);
    img.onload = () => img.classList.remove('fade');
    if(img.complete) img.classList.remove('fade');
  }, 180);
  document.getElementById('clbl-' + id).textContent = v.c;
  document.getElementById('csw-' + id).innerHTML = group.variants.map((vv,i) =>
    `<div class="cat-swatch${i===idx?' active':''}" style="${swatchStyle(vv.c)}" title="${vv.c}" onclick="cPick('${id}',${i})"></div>`
  ).join('');
}

function renderCatalog() {
  const catEl = document.getElementById('catalog');
  const groupMap = {};
  catalogGroups.forEach(g => { groupMap[g.id] = g; });

  catalogSections.forEach(sec => {
    const wrap = document.createElement('div');
    wrap.className = 'model-group';
    wrap.innerHTML = `
      <div class="model-group-header">
        <h3>${sec.header}</h3>
        <span class="group-tag ${sec.tag}">${sec.tag.replace('gtag-','').toUpperCase()}</span>
        <span class="sub">${sec.sub}</span>
      </div>
      <div class="cat-grid" id="cg-${sec.ids[0]}"></div>`;
    catEl.appendChild(wrap);
    const grid = document.getElementById('cg-' + sec.ids[0]);
    sec.ids.forEach(id => { const g = groupMap[id]; if(g) grid.appendChild(buildCatCard(g)); });
  });
}

// ════════════════════════════════════════════════════════════
// NAVIGATION / SCROLL HELPERS
// ════════════════════════════════════════════════════════════
function goTo(id) { const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }
function scrollToSection(id) { const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); }

// ════════════════════════════════════════════════════════════
// LIGHTBOX
// ════════════════════════════════════════════════════════════
function openLightbox(src, cap) {
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-cap').textContent = cap;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(e) {
  if(e.target.id === 'lightbox' || e.target.classList.contains('close'))
    document.getElementById('lightbox').classList.remove('open');
}

// ════════════════════════════════════════════════════════════
// SCROLL-TRIGGERED FADE-IN
// ════════════════════════════════════════════════════════════
function initScrollFadeIn() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
  }, { threshold: 0.08 });

  document.querySelectorAll('.feature-item, .model-group').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    io.observe(el);
  });
}

// ════════════════════════════════════════════════════════════
// INTRO SPLASH CONTROLLER
// ════════════════════════════════════════════════════════════
function initSplash() {
  const splash     = document.getElementById('intro-splash');
  const logoWrap   = document.getElementById('ferrari-logo-wrap');
  const appleBrand = document.getElementById('apple-brand');
  const appleChar  = document.getElementById('apple-logo-char');
  const appleLine  = document.getElementById('apple-line');
  const appleTag   = document.getElementById('apple-tagline');

  // Lock scroll initially
  document.body.style.overflow = 'hidden';
  let splashDone = false;

  function dismissSplash() {
    if (splashDone) return;
    splashDone = true;
    splash.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(() => splash.classList.add('hidden'), 950);
  }

  function showAppleBrand() {
    // Phase 1 logo fades out, Apple brand fades in
    logoWrap.classList.remove('show');
    appleBrand.classList.add('show');
    requestAnimationFrame(() => { appleChar.classList.add('animate'); });
    setTimeout(() => { appleLine.classList.add('show'); appleTag.classList.add('show'); }, 200);

    // Enable scroll-to-dismiss after Apple brand is visible
    setTimeout(() => {
      document.body.style.overflow = '';
      // Listen for scroll to dismiss
      const onScroll = () => {
        if (window.scrollY > 10) {
          dismissSplash();
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      // Also allow tap/click on brand screen to dismiss
      appleBrand.addEventListener('click', dismissSplash, { once: true });
    }, 800);
  }

  // Phase 1: show Apple logo for 1.8s, then transition
  logoWrap.classList.add('show');
  setTimeout(showAppleBrand, 1800);
}

// ════════════════════════════════════════════════════════════
// BACKGROUND MUSIC
// ════════════════════════════════════════════════════════════
let musicPlaying = false;

function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  if (musicPlaying) {
    bgMusic.pause();
    musicBtn.textContent = '🔇';
    musicPlaying = false;
  } else {
    bgMusic.play().catch(()=>{});
    musicBtn.textContent = '🎵';
    musicPlaying = true;
  }
}

function initMusicAutoStart() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  document.getElementById('intro-splash').addEventListener('transitionend', () => {
    if (document.getElementById('intro-splash').classList.contains('fade-out')) {
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicBtn.textContent = '🎵';
        // Fade music in gradually
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(vol + 0.04, 0.4);
          bgMusic.volume = vol;
          if (vol >= 0.4) clearInterval(fadeIn);
        }, 120);
      }).catch(()=>{});
    }
  });
}

// ════════════════════════════════════════════════════════════
// SITE PROTECTION — disable shortcuts & devtools
// ════════════════════════════════════════════════════════════
function initSiteProtection() {

  // Disable right-click context menu
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Disable keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    const key = e.key.toUpperCase();
    const ctrl = e.ctrlKey || e.metaKey; // ctrl on Win, cmd on Mac
    const shift = e.shiftKey;

    // Block ALL Ctrl/Cmd combos
    if (ctrl) {
      // Explicitly block common ones
      const blockedCtrl = ['U','S','A','C','V','X','P','I','J','K','L','F','G','H','R','N','T','W','E','D','B','1','2','3','4','5','6'];
      if (blockedCtrl.includes(key)) { e.preventDefault(); e.stopPropagation(); return false; }

      // Ctrl+Shift combos (DevTools, source, etc.)
      if (shift) {
        const blockedCtrlShift = ['I','J','C','K','M','N','P','R','S','U','E','DELETE'];
        if (blockedCtrlShift.includes(key)) { e.preventDefault(); e.stopPropagation(); return false; }
      }
    }

    // F-keys
    const blockedF = ['F1','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'];
    if (blockedF.includes(e.key)) { e.preventDefault(); e.stopPropagation(); return false; }

    // Alt combos (View Source etc.)
    if (e.altKey) { e.preventDefault(); e.stopPropagation(); return false; }

  }, true); // capture phase so it fires first

  // Disable drag (prevents image saving by drag)
  document.addEventListener('dragstart', e => e.preventDefault());

  // Disable text selection via mouse (optional but common)
  document.addEventListener('selectstart', e => {
    // Allow selection inside input/textarea fields
    if (!['INPUT','TEXTAREA'].includes(e.target.tagName)) e.preventDefault();
  });

  // Disable print shortcut (Ctrl+P already blocked above, but also CSS)
  const printStyle = document.createElement('style');
  printStyle.textContent = '@media print { body { display: none !important; } }';
  document.head.appendChild(printStyle);

  // DevTools detection (basic) — blurs page if open
  let devOpen = false;
  const devCheck = () => {
    const threshold = 160;
    const widthDiff  = window.outerWidth  - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const isOpen = widthDiff > threshold || heightDiff > threshold;
    if (isOpen && !devOpen) {
      devOpen = true;
      document.body.style.filter = 'blur(8px)';
      document.body.style.pointerEvents = 'none';
    } else if (!isOpen && devOpen) {
      devOpen = false;
      document.body.style.filter = '';
      document.body.style.pointerEvents = '';
    }
  };
  setInterval(devCheck, 1000);
}

// ════════════════════════════════════════════════════════════
// INIT — run everything once the DOM is ready
// Guards check for each section's root element so this single
// script.js file can be shared safely across every page —
// pages only run the init/render logic for sections they contain.
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('lineup-grid')) renderLineup();
  if (document.getElementById('catalog')) renderCatalog();

  initScrollFadeIn();

  // Intro splash (and the music auto-start tied to it) only exists on the home page
  if (document.getElementById('intro-splash')) {
    initSplash();
    initMusicAutoStart();
  }

  initSiteProtection();
  initMegaMenu();

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    document.addEventListener('keydown', e => { if(e.key === 'Escape') lightbox.classList.remove('open'); });
  }
});
// ════════════════════════════════════════════════════════════
// MEGA MENU — Ferrari-style iPhone browser
// ════════════════════════════════════════════════════════════
const megaData = [
  { label:'All Models', heading:'Range', models:[
    { name:'iPhone 17 Pro',     tag:'Titanium. A18 Pro. Camera Control.', price:'From ₱78,990', img:'iphone17pro_cosmic_orange.png' },
    { name:'iPhone 17 Pro Max', tag:'Titanium. A18 Pro. Camera Control.', price:'From ₱94,990', img:'iphone17promax_cosmic_orange.png' },
    { name:'iPhone Air',        tag:'The thinnest iPhone ever.',           price:'From ₱72,990', img:'iphoneair_skyblue.png' },
    { name:'iPhone 17',         tag:'Even more delightful.',               price:'From ₱57,990', img:'iphone17_lavender.png' },
    { name:'iPhone 17e',        tag:'Feature stacked. Value packed.',      price:'From ₱44,990', img:'iphone17e_pink.png' },
    { name:'iPhone 16',         tag:'A17 Bionic. Advanced cameras.',       price:'From ₱46,990', img:'iphone16_ultramarine.png' },
  ]},
  { label:'iPhone 17 Pro', heading:'iPhone 17 Pro Series', models:[
    { name:'iPhone 17 Pro',     tag:'Titanium. A18 Pro. Camera Control.', price:'From ₱78,990', img:'iphone17pro_cosmic_orange.png' },
    { name:'iPhone 17 Pro Max', tag:'Bigger. Longer battery life.',        price:'From ₱94,990', img:'iphone17promax_deepblue.png' },
  ]},
  { label:'iPhone Air', heading:'iPhone Air', models:[
    { name:'iPhone Air', tag:'The thinnest iPhone ever.', price:'From ₱72,990', img:'iphoneair_skyblue.png' },
  ]},
  { label:'iPhone 17', heading:'iPhone 17', models:[
    { name:'iPhone 17', tag:'Even more delightful. Even more durable.', price:'From ₱57,990', img:'iphone17_lavender.png' },
  ]},
  { label:'iPhone 17e', heading:'iPhone 17e', models:[
    { name:'iPhone 17e', tag:'Feature stacked. Value packed.', price:'From ₱44,990', img:'iphone17e_pink.png' },
  ]},
  { label:'iPhone 16 Series', heading:'iPhone 16 Series', models:[
    { name:'iPhone 16',      tag:'A17 Bionic. Advanced camera system.',  price:'From ₱46,990', img:'iphone16_ultramarine.png' },
    { name:'iPhone 16 Plus', tag:'Larger display. Same great features.', price:'From ₱52,990', img:'iphone16_teal.png' },
    { name:'iPhone 16e',     tag:'A great entry point.',                 price:'From ₱38,990', img:'iphone16e_black.png' },
    { name:'iPhone 16 Pro',     tag:'Camera Control. ProRes video.',     price:'From ₱68,990', img:'iphone16pro_blacktitanium.png' },
    { name:'iPhone 16 Pro Max', tag:'The biggest Pro display.',          price:'From ₱84,990', img:'iphone16promax_deserttitanium.png' },
  ]},
  { label:'iPhone 15 Series', heading:'iPhone 15 Series', models:[
    { name:'iPhone 15',         tag:'Dynamic Island. 48MP. USB‑C.',    price:'From ₱42,990', img:'iphone15_blue.png' },
    { name:'iPhone 15 Plus',    tag:'Larger display.',                  price:'From ₱48,990', img:'iphone15plus_pink.png' },
    { name:'iPhone 15 Pro',     tag:'Titanium. So strong. So light.',   price:'From ₱58,990', img:'iphone15pro_bluetitanium.png' },
    { name:'iPhone 15 Pro Max', tag:'The biggest Pro yet.',             price:'From ₱74,990', img:'iphone15promax_naturaltitanum.png' },
  ]},
  { label:'iPhone 14 Series', heading:'iPhone 14 Series', models:[
    { name:'iPhone 14',         tag:'More power. More resolution.',          price:'From ₱36,990', img:'iphone14_blue.png' },
    { name:'iPhone 14 Plus',    tag:'Big screen. Big battery.',             price:'From ₱42,990', img:'iphone14plus_purple.png' },
    { name:'iPhone 14 Pro',     tag:'Dynamic Island. Always-On.',           price:'From ₱54,990', img:'iphone14pro_deeppurple.png' },
    { name:'iPhone 14 Pro Max', tag:'The largest Pro display.',             price:'From ₱68,990', img:'iphone14promax_gold.png' },
  ]},
  { label:'iPhone 13 Series', heading:'iPhone 13 Series', models:[
    { name:'iPhone 13',         tag:'Beautifully bright. Super fast.',  price:'From ₱28,990', img:'iphone13_blue.png' },
    { name:'iPhone 13 mini',    tag:'Compact. Capable.',               price:'From ₱24,990', img:'iphone13mini_pink.png' },
    { name:'iPhone 13 Pro',     tag:'Pro. Beyond.',                    price:'From ₱36,990', img:'iphone13pro_alpinegreen.png' },
    { name:'iPhone 13 Pro Max', tag:'The biggest Pro camera.',         price:'From ₱44,990', img:'iphone13promax_sierrablue.png' },
  ]},
  { label:'iPhone 12 Series', heading:'iPhone 12 Series', models:[
    { name:'iPhone 12',         tag:'5G. A14 Bionic.',           price:'From ₱22,990', img:'iphone12_blue.png' },
    { name:'iPhone 12 mini',    tag:'Small but mighty.',         price:'From ₱19,990', img:'iphone12mini_purple.png' },
    { name:'iPhone 12 Pro',     tag:"It's a leap year.",         price:'From ₱30,990', img:'iphone12pro_pacificblue.png' },
    { name:'iPhone 12 Pro Max', tag:'The largest Pro camera.',   price:'From ₱36,990', img:'iphone12promax_graphite.png' },
  ]},
  { label:'iPhone 11 Series', heading:'iPhone 11 Series', models:[
    { name:'iPhone 11',         tag:'This changes everything. Again.', price:'From ₱18,990', img:'iphone11_green.png' },
    { name:'iPhone 11 Pro',     tag:'The first iPhone Pro.',           price:'From ₱24,990', img:'iphone11pro_midnightgreen.png' },
    { name:'iPhone 11 Pro Max', tag:'The biggest Pro display.',        price:'From ₱28,990', img:'iphone11promax_spacegrey.png' },
  ]},
];

let megaOpen = false;
let megaActiveCategory = 0;
let megaActiveModel = 0;

function openMegaMenu(e) {
  if (e) e.preventDefault();
  document.getElementById('mega-menu').classList.add('open');
  document.getElementById('mega-overlay').classList.add('show');
  document.getElementById('nav-iphones-btn').classList.add('open');
  document.body.style.overflow = 'hidden';
  megaOpen = true;
  renderMegaCategory(0);
}

function closeMegaMenu() {
  document.getElementById('mega-menu').classList.remove('open');
  document.getElementById('mega-overlay').classList.remove('show');
  const btn = document.getElementById('nav-iphones-btn');
  if (btn) btn.classList.remove('open');
  document.body.style.overflow = '';
  megaOpen = false;
}

function renderMegaCategory(idx) {
  megaActiveCategory = idx;
  megaActiveModel = 0;

  // Highlight left list item
  document.querySelectorAll('.mega-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });

  const cat = megaData[idx];

  // Render center panel
  const center = document.getElementById('mega-center');
  center.innerHTML = `<p class="mega-center-heading">${cat.heading}</p>` +
    cat.models.map((m, i) =>
      `<div class="mega-sub-item${i===0?' active':''}" data-midx="${i}" onclick="renderMegaModel(${idx},${i})">${m.name}</div>`
    ).join('');

  // Render right panel with first model
  renderMegaModel(idx, 0);
}

function renderMegaModel(catIdx, modelIdx) {
  megaActiveModel = modelIdx;

  // Update center highlights
  document.querySelectorAll('.mega-sub-item').forEach((el, i) => {
    el.classList.toggle('active', i === modelIdx);
  });

  const m = megaData[catIdx].models[modelIdx];
  document.getElementById('mega-preview-title').textContent = m.name;
  document.getElementById('mega-preview-tag').textContent = m.tag;
  document.getElementById('mega-preview-price').textContent = m.price;

  const img = document.getElementById('mega-preview-img');
  img.classList.add('fade');
  setTimeout(() => {
    img.src = 'images/' + m.img;
    img.onload = () => img.classList.remove('fade');
    if (img.complete) img.classList.remove('fade');
  }, 180);
}

function initMegaMenu() {
  // Nav trigger
  const trigger = document.getElementById('nav-iphones-btn');
  if (trigger) trigger.addEventListener('click', openMegaMenu);

  // Close button
  const closeBtn = document.getElementById('mega-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMegaMenu);

  // Overlay click closes
  const overlay = document.getElementById('mega-overlay');
  if (overlay) overlay.addEventListener('click', closeMegaMenu);

  // Left list items
  document.querySelectorAll('.mega-item').forEach(el => {
    el.addEventListener('mouseenter', () => renderMegaCategory(parseInt(el.dataset.idx)));
    el.addEventListener('click', () => renderMegaCategory(parseInt(el.dataset.idx)));
  });

  // ESC key closes
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && megaOpen) closeMegaMenu(); });

  // "Browse by series" button on iphones.html
  const openLink = document.getElementById('open-mega-link');
  if (openLink) openLink.addEventListener('click', openMegaMenu);
}