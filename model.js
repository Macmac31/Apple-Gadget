// ════════════════════════════════════════════════════════════
// MODEL DATA — all iPhone specs + showcase sections
// ════════════════════════════════════════════════════════════
const MODEL_DB = {

  'iphone17pro': {
    name: 'iPhone 17 Pro',
    tag: 'Titanium. A18 Pro chip. Camera Control.',
    price: 'From ₱78,990',
    img: 'iphone17pro_cosmic_orange.png',
    color: 'rgba(180,100,40,.3)',
    accent: '#ff9550',
    sections: [
      {
        label: 'Design',
        title: 'Titanium.\nReborn.',
        body: 'Crafted from aerospace-grade titanium — lighter and stronger than ever. The brushed finish catches the light in ways that make every glance feel new.',
        img: 'iphone17pro_cosmic_orange.png',
        bg: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(180,100,40,.2) 0%, transparent 70%)',
        specs: [{ v: '6.3″', l: 'Display' }, { v: 'Ti', l: 'Material' }, { v: '185g', l: 'Weight' }],
      },
      {
        label: 'Performance',
        title: 'A18 Pro.\nBeyond fast.',
        body: 'The A18 Pro chip delivers console-quality gaming, pro-level video editing, and Apple Intelligence — all at astonishing efficiency.',
        img: 'iphone17pro_deepblue.png',
        bg: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(30,60,140,.25) 0%, transparent 70%)',
        specs: [{ v: 'A18 Pro', l: 'Chip' }, { v: '6-core', l: 'GPU' }, { v: '16GB', l: 'RAM' }],
      },
      {
        label: 'Camera',
        title: 'Pro camera.\nPro results.',
        body: 'A 48MP Fusion camera, 5× Tetraprism telephoto, and Camera Control — a dedicated button that puts every shot within reach.',
        img: 'iphone17pro_silver.png',
        bg: 'radial-gradient(ellipse 80% 60% at 30% 60%, rgba(200,200,220,.08) 0%, transparent 70%)',
        specs: [{ v: '48MP', l: 'Main' }, { v: '5×', l: 'Optical zoom' }, { v: '4K 120', l: 'ProRes' }],
      },
      {
        label: 'Battery',
        title: 'All day.\nAll night.',
        body: 'Up to 27 hours of video playback. MagSafe, USB‑C fast charging, and wireless charging all included.',
        img: 'iphone17pro_cosmic_orange.png',
        bg: 'radial-gradient(ellipse 70% 55% at 60% 40%, rgba(60,160,80,.15) 0%, transparent 70%)',
        specs: [{ v: '27hr', l: 'Video' }, { v: '45W', l: 'Fast charge' }, { v: 'MagSafe', l: 'Wireless' }],
      },
    ],
  },

  'iphone17promax': {
    name: 'iPhone 17 Pro Max',
    tag: 'The biggest Pro. The longest battery.',
    price: 'From ₱94,990',
    img: 'iphone17promax_cosmic_orange.png',
    color: 'rgba(160,80,30,.3)',
    accent: '#ff8c42',
    sections: [
      { label:'Display', title:'6.9 inches.\nPure Pro.', body:'The largest Super Retina XDR display ever in an iPhone Pro, with ProMotion 120Hz and Always-On.', img:'iphone17promax_cosmic_orange.png', bg:'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(160,80,30,.2) 0%, transparent 70%)', specs:[{v:'6.9″',l:'Display'},{v:'120Hz',l:'ProMotion'},{v:'2796px',l:'Resolution'}] },
      { label:'Battery', title:'33 hours.\nNo compromise.', body:'The longest battery life ever in an iPhone. Up to 33 hours of video playback on a single charge.', img:'iphone17promax_deepblue.png', bg:'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(30,50,120,.25) 0%, transparent 70%)', specs:[{v:'33hr',l:'Video'},{v:'45W',l:'Fast charge'},{v:'MagSafe',l:'Wireless'}] },
      { label:'Camera', title:'5× zoom.\nUnmatched reach.', body:'Tetraprism telephoto lens at 5× optical zoom. Shoot far. Shoot sharp. Shoot in ProRes 4K at 120fps.', img:'iphone17promax_cosmic_orange.png', bg:'radial-gradient(ellipse 70% 55% at 35% 60%, rgba(200,160,40,.1) 0%, transparent 70%)', specs:[{v:'48MP',l:'Main'},{v:'5×',l:'Telephoto'},{v:'4K 120',l:'ProRes'}] },
    ],
  },

  'iphoneair': {
    name: 'iPhone Air',
    tag: 'The thinnest iPhone ever.',
    price: 'From ₱72,990',
    img: 'iphoneair_skyblue.png',
    color: 'rgba(80,160,220,.25)',
    accent: '#5ac8fa',
    sections: [
      { label:'Design', title:'6.25mm.\nImpossibly thin.', body:'At just 6.25mm, iPhone Air is the thinnest Apple product ever made — and it still has everything you love about iPhone.', img:'iphoneair_skyblue.png', bg:'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(80,160,220,.2) 0%, transparent 70%)', specs:[{v:'6.25mm',l:'Thickness'},{v:'6.7″',l:'Display'},{v:'145g',l:'Weight'}] },
      { label:'Performance', title:'A18 chip.\nFull power.', body:'Powered by the same A18 chip as iPhone 16 Pro — blazing fast, wildly efficient, ready for Apple Intelligence.', img:'iphoneair_cloudwhite.png', bg:'radial-gradient(ellipse 70% 55% at 70% 50%, rgba(60,140,200,.15) 0%, transparent 70%)', specs:[{v:'A18',l:'Chip'},{v:'Apple Intelligence',l:'AI'},{v:'5G',l:'Connectivity'}] },
      { label:'Camera', title:'48MP.\nEvery detail.', body:'A 48MP Fusion camera, photographic styles, and Action mode — all in the thinnest iPhone body ever made.', img:'iphoneair_lightgold.png', bg:'radial-gradient(ellipse 70% 55% at 35% 55%, rgba(200,170,100,.1) 0%, transparent 70%)', specs:[{v:'48MP',l:'Main'},{v:'4K',l:'Video'},{v:'2×',l:'Optical'} ] },
    ],
  },

  'iphone17': {
    name: 'iPhone 17',
    tag: 'Even more delightful. Even more durable.',
    price: 'From ₱57,990',
    img: 'iphone17_lavender.png',
    color: 'rgba(140,120,200,.25)',
    accent: '#bf5af2',
    sections: [
      { label:'Design', title:'New look.\nSame soul.', body:'A refreshed aluminum design in gorgeous new colors, with a tougher Ceramic Shield front and back.', img:'iphone17_lavender.png', bg:'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(140,120,200,.2) 0%, transparent 70%)', specs:[{v:'6.1″',l:'Display'},{v:'Al',l:'Material'},{v:'170g',l:'Weight'}] },
      { label:'Camera', title:'48MP.\nAll new system.', body:'A brand new 48MP camera system with a larger aperture, Night mode, and Photonic Engine processing.', img:'iphone17_mistblue.png', bg:'radial-gradient(ellipse 70% 55% at 70% 50%, rgba(60,100,180,.18) 0%, transparent 70%)', specs:[{v:'48MP',l:'Main'},{v:'f/1.6',l:'Aperture'},{v:'4K',l:'Video'}] },
      { label:'Intelligence', title:'Apple Intelligence.\nBuilt in.', body:'Writing tools, image generation, smarter Siri — Apple Intelligence comes built in, right out of the box.', img:'iphone17_sage.png', bg:'radial-gradient(ellipse 70% 55% at 35% 60%, rgba(80,140,80,.15) 0%, transparent 70%)', specs:[{v:'A18',l:'Chip'},{v:'16GB',l:'RAM'},{v:'On-device',l:'AI'}] },
    ],
  },

  'iphone17e': {
    name: 'iPhone 17e',
    tag: 'Feature stacked. Value packed.',
    price: 'From ₱44,990',
    img: 'iphone17e_pink.png',
    color: 'rgba(220,100,140,.25)',
    accent: '#ff6b98',
    sections: [
      { label:'Value', title:'Everything you need.\nNothing you don\'t.', body:'iPhone 17e packs the A18 chip, 48MP camera, and Apple Intelligence into an incredible value.', img:'iphone17e_pink.png', bg:'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(220,100,140,.2) 0%, transparent 70%)', specs:[{v:'6.1″',l:'Display'},{v:'A18',l:'Chip'},{v:'48MP',l:'Camera'}] },
      { label:'Design', title:'Fresh colors.\nBold statement.', body:'Three stunning colorways — Pink, White, and Black — each with a Ceramic Shield front that\'s tough as ever.', img:'iphone17e_white.png', bg:'radial-gradient(ellipse 70% 55% at 70% 50%, rgba(220,220,220,.06) 0%, transparent 70%)', specs:[{v:'3',l:'Colors'},{v:'Ceramic Shield',l:'Front'},{v:'IP68',l:'Rating'}] },
    ],
  },

  'iphone16': {
    name: 'iPhone 16',
    tag: 'A step forward in every way.',
    price: 'From ₱46,990',
    img: 'iphone16_ultramarine.png',
    color: 'rgba(60,90,180,.25)',
    accent: '#3478f6',
    sections: [
      { label:'Design', title:'Camera Control.\nGame changer.', body:'A dedicated Camera Control button gives you instant access to your camera, zoom, and shooting modes — all with one finger.', img:'iphone16_ultramarine.png', bg:'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(60,90,180,.22) 0%, transparent 70%)', specs:[{v:'6.1″',l:'Display'},{v:'Camera Control',l:'Feature'},{v:'IP68',l:'Rating'}] },
      { label:'Camera', title:'48MP.\nVisual Intelligence.', body:'A 48MP Fusion camera with a new vertical layout for Spatial Video, plus Visual Intelligence powered by Apple Intelligence.', img:'iphone16_teal.png', bg:'radial-gradient(ellipse 70% 55% at 70% 50%, rgba(40,140,140,.18) 0%, transparent 70%)', specs:[{v:'48MP',l:'Main'},{v:'4K 60',l:'Cinematic'},{v:'Visual IQ',l:'AI'}] },
      { label:'Performance', title:'A17 chip.\nAll-new GPU.', body:'The A17 Bionic chip with a 6-core GPU delivers stunning gaming performance and pro-level photo processing.', img:'iphone16_pink.png', bg:'radial-gradient(ellipse 70% 55% at 35% 55%, rgba(220,100,140,.12) 0%, transparent 70%)', specs:[{v:'A17',l:'Chip'},{v:'6-core',l:'GPU'},{v:'5G',l:'Connectivity'}] },
    ],
  },

};

// ── Image + name lookup from catalogGroups (defined in script.js) ──
function getCatalogInfo(slug) {
  if (typeof catalogGroups === 'undefined') return null;
  // Try exact slug match against catalog id (e.g. 'cat-13promax')
  // Also try matching the model name slugified
  for (const g of catalogGroups) {
    const nameSlug = g.name.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
    if (nameSlug === slug) return g;
  }
  return null;
}

// Pick accent color based on first variant color name
function accentFromColor(colorName) {
  const map = {
    'Blue':'#3478f6','Ultramarine':'#3a5cac','Teal':'#4a9090',
    'Pink':'#ff6b98','Purple':'#bf5af2','Green':'#30d158',
    'Yellow':'#ffd60a','Red':'#ff3b30','Midnight':'#636366',
    'Starlight':'#c8c6be','Black':'#636366','White':'#e5e5ea',
    'Silver':'#b0b0b8','Gold':'#c4a048','Graphite':'#636366',
    'Cosmic Orange':'#ff9550','Deep Blue':'#1c3a5c',
    'Sky Blue':'#5ac8fa','Cloud White':'#e5e5ea','Light Gold':'#d4b896',
    'Space Black':'#636366','Lavender':'#bf5af2','Mist Blue':'#5ac8fa',
    'Sage':'#30d158','Alpine Green':'#30d158','Sierra Blue':'#3478f6',
    'Pacific Blue':'#3478f6','Deep Purple':'#bf5af2',
    'Black Titanium':'#636366','Desert Titanium':'#c4a048',
    'Natural Titanium':'#b0a898','White Titanium':'#e5e5ea',
    'Blue Titanium':'#3478f6','Midnight Green':'#30d158',
    'Space Grey':'#636366',
  };
  return map[colorName] || '#2997ff';
}

function bgFromColor(colorName) {
  const hex = accentFromColor(colorName);
  // parse hex to rgb roughly
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},.22)`;
}

// Fallback for any model not in MODEL_DB — uses correct image from catalog
function getFallbackModel(slug) {
  const cat = getCatalogInfo(slug);

  const img    = cat ? cat.variants[0].f : 'iphone17pro_cosmic_orange.png';
  const name   = cat ? cat.name         : slug.replace(/iphone/i,'iPhone ').trim();
  const tag    = cat ? cat.sub          : 'An extraordinary iPhone experience.';
  const color  = cat ? bgFromColor(cat.variants[0].c) : 'rgba(40,80,160,.25)';
  const accent = cat ? accentFromColor(cat.variants[0].c) : '#2997ff';

  // Build one section per color variant so users can see all colors
  const sections = cat ? cat.variants.map((v, i) => ({
    label: v.c,
    title: v.c + '.',
    body: `${name} in ${v.c} — tap to explore every detail of this beautiful finish.`,
    img: v.f,
    bg: `radial-gradient(ellipse 75% 60% at ${i%2===0?'30%':'70%'} 50%, ${bgFromColor(v.c)} 0%, transparent 70%)`,
    specs: [{v:'iPhone', l:'Model'}, {v:'iOS 18', l:'System'}, {v:'5G', l:'Connectivity'}],
  })) : [
    { label:'Design', title:'Beautifully crafted.', body:'Every iPhone is designed and built to the highest standards.', img, bg:'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(40,80,160,.18) 0%, transparent 70%)', specs:[{v:'iPhone',l:'Model'},{v:'iOS 18',l:'System'},{v:'5G',l:'Connectivity'}] },
  ];

  return { name, tag, price: 'Contact us for pricing', img, color, accent, sections };
}

// ════════════════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════════════════
function initModelPage() {
  const params = new URLSearchParams(window.location.search);
  const slug   = (params.get('model') || 'iphone17pro').toLowerCase().replace(/\s+/g,'');
  const model  = MODEL_DB[slug] || getFallbackModel(slug);

  // Inject CSS custom properties for theming
  document.documentElement.style.setProperty('--model-color', model.color);
  document.documentElement.style.setProperty('--model-accent', model.accent);

  // Update <title>
  document.title = model.name + ' — Apple Store';

  // Hero
  document.getElementById('mp-eyebrow').textContent = 'iPhone';
  document.getElementById('mp-title').textContent   = model.name;
  document.getElementById('mp-tag').textContent     = model.tag;

  const heroImg = document.getElementById('mp-phone-img');
  heroImg.src = 'images/' + model.img;
  heroImg.alt = model.name;
  heroImg.onload = () => {
    setTimeout(() => {
      document.getElementById('mp-title').classList.add('show');
      document.getElementById('mp-tag').classList.add('show');
      document.getElementById('mp-hero-ctas').classList.add('show');
      heroImg.classList.add('show');
    }, 200);
  };
  if (heroImg.complete) heroImg.onload();

  // Final CTA
  document.getElementById('mp-final-img').src   = 'images/' + model.img;
  document.getElementById('mp-final-img').alt   = model.name;
  document.getElementById('mp-final-title').textContent = 'Get ' + model.name + '.';
  document.getElementById('mp-final-price').textContent = model.price;

  // Build scroll sections
  const story    = document.getElementById('mp-story');
  const progress = document.getElementById('mp-progress');
  const sections = [];

  // dot for hero
  progress.innerHTML = '';
  const heroDot = makeDot(0, sections); progress.appendChild(heroDot);
  sections.push(document.getElementById('mp-hero'));

  model.sections.forEach((sec, i) => {
    const el = document.createElement('div');
    el.className = 'mp-section';
    el.innerHTML = `
      <div class="mp-section-bg" style="background:${sec.bg}"></div>
      <div class="mp-section-phone">
        <img src="images/${sec.img}" alt="${sec.label}" loading="lazy">
      </div>
      <div class="mp-section-text">
        <span class="mp-section-number">0${i+1}</span>
        <span class="mp-section-label">${sec.label}</span>
        <h2 class="mp-section-title">${sec.title.replace(/\n/g,'<br>')}</h2>
        <p class="mp-section-body">${sec.body}</p>
        <div class="mp-specs">${sec.specs.map(s=>`<div class="mp-spec-chip"><span class="mp-spec-chip-value">${s.v}</span><span class="mp-spec-chip-label">${s.l}</span></div>`).join('')}</div>
      </div>`;
    story.appendChild(el);

    const dot = makeDot(i + 1, sections);
    progress.appendChild(dot);
    sections.push(el);
  });

  // dot for final
  const finalDot = makeDot(sections.length, sections);
  progress.appendChild(finalDot);
  sections.push(document.getElementById('mp-final'));

  // IntersectionObserver for scroll-driven reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        // update active dot
        const idx = sections.indexOf(e.target);
        document.querySelectorAll('.mp-dot').forEach((d,i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => io.observe(s));

  // Show progress dots after scrolling past hero
  const progressNav = document.getElementById('mp-progress');
  const heroEl = document.getElementById('mp-hero');
  const heroObserver = new IntersectionObserver(([e]) => {
    progressNav.classList.toggle('visible', !e.isIntersecting);
  }, { threshold: 0.1 });
  heroObserver.observe(heroEl);
}

function makeDot(idx, sections) {
  const dot = document.createElement('button');
  dot.className = 'mp-dot' + (idx === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to section ' + (idx+1));
  dot.addEventListener('click', () => {
    const target = sections[idx];
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  return dot;
}

// ════════════════════════════════════════════════════════════
// WIRE MEGA MENU MODELS → model.html?model=slug
// ════════════════════════════════════════════════════════════
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
}

// Patch renderMegaModel to make sub-items clickable links
const _origRenderMegaModel = window.renderMegaModel;
window.patchMegaLinks = function() {
  document.querySelectorAll('.mega-sub-item').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('dblclick', () => {
      const name = el.textContent.trim();
      window.location.href = 'model.html?model=' + slugify(name);
    });
  });
  // also make right panel "DISCOVER MORE" go to model page
  const discoverBtn = document.querySelector('.mega-btn-discover');
  if (discoverBtn) {
    discoverBtn.addEventListener('click', (e) => {
      const title = document.getElementById('mega-preview-title');
      if (title && title.textContent) {
        e.preventDefault();
        window.location.href = 'model.html?model=' + slugify(title.textContent);
      }
    });
  }
};

// Override renderMegaCategory to add click-to-navigate on sub items
document.addEventListener('DOMContentLoaded', () => {
  // Patch mega sub-items after they're rendered
  const origRenderCat = window.renderMegaCategory;
  if (typeof origRenderCat === 'function') {
    window.renderMegaCategory = function(idx) {
      origRenderCat(idx);
      // After render, wire sub-item single-clicks to navigate
      setTimeout(() => {
        document.querySelectorAll('.mega-sub-item').forEach(el => {
          el.onclick = null; // clear old inline onclick
          el.addEventListener('click', (e) => {
            const midx = parseInt(el.dataset.midx);
            renderMegaModel(idx, midx);
            // Single click = preview, but add a "Visit" row
          });
        });
        // Wire discover btn
        const discBtn = document.querySelector('.mega-btn-discover');
        if (discBtn) {
          discBtn.onclick = null;
          discBtn.href = '#';
          discBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = document.getElementById('mega-preview-title');
            if (title && title.textContent.trim()) {
              window.location.href = 'model.html?model=' + slugify(title.textContent.trim());
            }
          });
        }
        // Wire mega-right title as link
        const previewTitle = document.getElementById('mega-preview-title');
        if (previewTitle) {
          previewTitle.style.cursor = 'pointer';
          previewTitle.title = 'Click to explore';
          previewTitle.onclick = () => {
            const name = previewTitle.textContent.trim();
            if (name) window.location.href = 'model.html?model=' + slugify(name);
          };
        }
        // Wire preview image as link
        const previewImg = document.getElementById('mega-preview-img');
        if (previewImg) {
          previewImg.style.cursor = 'pointer';
          previewImg.onclick = () => {
            const title = document.getElementById('mega-preview-title');
            if (title && title.textContent.trim()) {
              window.location.href = 'model.html?model=' + slugify(title.textContent.trim());
            }
          };
        }
      }, 50);
    };
  }

  // Init model page only if we're on model.html
  if (document.getElementById('mp-hero')) {
    initModelPage();
  }
});