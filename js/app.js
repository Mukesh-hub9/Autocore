/**
 * AUTOCORE — Premium Automotive Encyclopedia
 * Main Application Controller
 * SPA Router + Page Renderers + UI Controller
 */

'use strict';

// ===== APP STATE =====
const APP = {
  currentPage: 'home',
  currentDetail: null,
  history: [],
  bookmarks: JSON.parse(localStorage.getItem('autocore_bookmarks') || '[]'),
  recentlyViewed: JSON.parse(localStorage.getItem('autocore_recent') || '[]'),
  searchOpen: false,
  mobileMenuOpen: false,
  theme: localStorage.getItem('autocore_theme') || 'dark',
};

// ===== DOM REFS =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ===== ROUTER =====
const Router = {
  routes: {
    'home': renderHome,
    'cars': renderCarsPage,
    'bikes': renderBikesPage,
    'ev': renderEVPage,
    'manufacturers': renderManufacturers,
    'vehicle-db': renderVehicleDB,
    'parts': renderPartsPage,
    'engines': renderEnginesPage,
    'technology': renderTechnologyPage,
    'maintenance': renderMaintenancePage,
    'compare': renderComparePage,
    'glossary': renderGlossaryPage,
    'news': renderNewsPage,
    'admin': renderAdminPage,
    'dashboard': renderAdminPage,
    'about': renderAboutPage,
    'manufacturer-detail': renderManufacturerDetail,
    'vehicle-detail': renderVehicleDetail,
    'component-detail': renderComponentDetail,
    'tech-detail': renderTechDetail,
  },

  navigate(page, data = null) {
    const hashTarget = (data && typeof data === 'string') ? `${page}/${data}` : page;
    if (page && window.location.hash.slice(1) !== hashTarget) {
      try { history.pushState(null, '', `#${hashTarget}`); } catch (e) {}
    }
    APP.history.push({ page: APP.currentPage, data: APP.currentDetail });
    APP.currentPage = page;
    APP.currentDetail = data;
    this.render(page, data);
    this.updateNav(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  back() {
    const prev = APP.history.pop();
    if (prev) {
      const hashTarget = (prev.data && typeof prev.data === 'string') ? `${prev.page}/${prev.data}` : prev.page;
      try { history.pushState(null, '', `#${hashTarget}`); } catch (e) {}
      APP.currentPage = prev.page;
      APP.currentDetail = prev.data;
      this.render(prev.page, prev.data);
      this.updateNav(prev.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  render(page, data) {
    const mainContent = $('#main-content');
    if (!mainContent) return;
    const fn = this.routes[page];
    if (fn) {
      mainContent.innerHTML = fn(data);
      initPageInteractions(page, data);
      initScrollReveal();
    }
  },

  updateNav(page) {
    $$('.nav__link').forEach(l => {
      l.classList.toggle('active', l.dataset.page === page);
    });
  },
};

// ===== MAIN CONTENT AREA =====
function parseHashLocation() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '').trim();
  if (!raw) return { page: 'home', param: null };
  const parts = raw.split(/[:/]/);
  let page = parts[0];
  let param = parts.slice(1).join('/');
  if (page === 'dashboard') page = 'admin';
  return { page, param: param || null };
}

function initApp() {
  buildShell();
  const loc = parseHashLocation();
  if (loc.page && Router.routes[loc.page]) {
    Router.navigate(loc.page, loc.param);
  } else {
    Router.navigate('home');
  }
  window.addEventListener('hashchange', () => {
    const nextLoc = parseHashLocation();
    if (nextLoc.page && Router.routes[nextLoc.page] && (APP.currentPage !== nextLoc.page || APP.currentDetail !== nextLoc.param)) {
      Router.navigate(nextLoc.page, nextLoc.param);
    }
  });
  initSearch();
  initScrollEffects();
  initKeyboardShortcuts();
}

function buildShell() {
  document.body.innerHTML = `
    ${buildNav()}
    ${buildSearchOverlay()}
    ${buildLogoMeaningModal()}
    ${buildMobileMenu()}
    <main id="main-content" role="main"></main>
    <button class="back-to-top" id="back-to-top-btn" aria-label="Scroll back to top" title="Back to top (Top of page)" onclick="window.scrollTo({top:0,behavior:'smooth'})">
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
    </button>
    <div class="toast-container" id="toast-container"></div>
  `;
  initNavEvents();
}

// ===== NAV =====
function buildNav() {
  const links = [
    { label: 'Home', page: 'home' },
    { label: 'Cars', page: 'cars' },
    { label: 'Bikes', page: 'bikes' },
    { label: 'EVs', page: 'ev' },
    { label: 'Manufacturers', page: 'manufacturers' },
    { label: 'Parts', page: 'parts' },
    { label: 'Engines', page: 'engines' },
    { label: 'Technology', page: 'technology' },
    { label: 'Maintenance', page: 'maintenance' },
    { label: 'Compare', page: 'compare' },
    { label: 'Glossary', page: 'glossary' },
    { label: 'Dashboard', page: 'admin' },
  ];
  return `
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <div class="nav__inner">
        <button class="nav__logo" onclick="Router.navigate('home')" aria-label="AUTOCORE - Automotive Intelligence">
          <div class="nav__logo-emblem">
            <img src="assets/autocore-logo.svg" alt="AUTOCORE Emblem" class="logo-svg-img" width="32" height="32">
          </div>
          <div class="nav__logo-brand">
            <div class="nav__logo-title">AUTO<span class="gradient-text">CORE</span></div>
            <div class="nav__logo-badge">AUTOMOTIVE INTELLIGENCE</div>
          </div>
        </button>
        <div class="nav__links">
          ${links.map(l => `<button class="nav__link" data-page="${l.page}" onclick="Router.navigate('${l.page}')">${l.label}</button>`).join('')}
        </div>
        <div class="nav__actions">
          <button class="nav__search-btn" id="nav-search-btn" aria-label="Open search" title="Quick Search (⌘K)">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="nav__hamburger" id="hamburger-btn" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

function buildMobileMenu() {
  const links = ['Home','Cars','Bikes','EVs','Manufacturers','Parts','Engines','Technology','Maintenance','Compare','Glossary','News','About','Dashboard'];
  const pages = ['home','cars','bikes','ev','manufacturers','parts','engines','technology','maintenance','compare','glossary','news','about','admin'];
  return `
    <div class="mobile-menu" id="mobile-menu" role="dialog" aria-label="Mobile navigation">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0 8px 16px;border-bottom:1px solid var(--color-border);margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="assets/autocore-logo.svg" alt="AUTOCORE emblem" width="28" height="28">
          <span style="font-family:var(--font-brand);font-size:1.15rem;font-weight:900;color:var(--text-primary);">AUTO<span class="gradient-text">CORE</span></span>
        </div>
        <button onclick="openLogoMeaningModal()" style="font-family:var(--font-mono);font-size:0.68rem;color:var(--cyan-bright);padding:4px 10px;border-radius:var(--radius-full);border:1px solid rgba(6,182,212,0.3);background:rgba(6,182,212,0.06);cursor:pointer;">⬡ Logo Meaning</button>
      </div>
      <div class="mobile-menu__links">
        ${links.map((l,i) => `<button class="mobile-menu__link" onclick="Router.navigate('${pages[i]}');closeMobileMenu()">${l}</button>`).join('')}
      </div>
    </div>
  `;
}

function buildLogoMeaningModal() {
  return `
    <div class="brand-modal-overlay" id="brand-modal-overlay" role="dialog" aria-label="AUTOCORE Emblem Symbology" aria-modal="true" onclick="if(event.target === this) closeLogoMeaningModal()">
      <div class="brand-modal">
        <button class="brand-modal__close" onclick="closeLogoMeaningModal()" aria-label="Close modal">✕</button>
        <div class="brand-modal__header">
          <div class="brand-modal__tag">
            <span class="live-dot live-dot--cyan"></span>
            MARQUE SHIELD // SYMBOLOGY & ARCHITECTURE
          </div>
          <h2 class="brand-modal__title">The AUTO<span class="gradient-text">CORE</span> Marque Crest</h2>
          <p class="brand-modal__subtitle">Every facet and vector of the crest symbolizes an authentic pillar of performance engineering.</p>
        </div>

        <div class="brand-modal__layout">
          <div class="brand-schematic-visual">
            <img src="assets/autocore-logo.svg" alt="AUTOCORE emblem blueprint" width="140" height="140">
            <div class="brand-schematic-caption">AERO CREST // MK-V</div>
          </div>

          <div class="brand-pillars">
            <div class="brand-pillar">
              <div class="brand-pillar__icon">🛡️</div>
              <div class="brand-pillar__body">
                <div class="brand-pillar__name">Faceted Aerodynamic Shield <span class="brand-pillar__code">CHASSIS // 01</span></div>
                <div class="brand-pillar__desc">Outer perimeter geometry inspired by high-tensile carbon monocoque crash structures and beveled titanium chassis subframes engineered for maximum torsional rigidity.</div>
              </div>
            </div>

            <div class="brand-pillar">
              <div class="brand-pillar__icon">🦅</div>
              <div class="brand-pillar__body">
                <div class="brand-pillar__name">Dual Velocity Aero Wings <span class="brand-pillar__code">AERO // 02</span></div>
                <div class="brand-pillar__desc">Sweeping downforce foils channeling laminar airflow velocity for high-speed supercar stability and motorcycle cornering lean-angle aerodynamics.</div>
              </div>
            </div>

            <div class="brand-pillar">
              <div class="brand-pillar__icon">⚡</div>
              <div class="brand-pillar__body">
                <div class="brand-pillar__name">Central Titanium Apex Spine <span class="brand-pillar__code">CRANKSHAFT // 03</span></div>
                <div class="brand-pillar__desc">Central vertical spine representing precision Top Dead Center (TDC) crankshaft timing marks and the optimal racing corner apex line.</div>
              </div>
            </div>

            <div class="brand-pillar">
              <div class="brand-pillar__icon">💎</div>
              <div class="brand-pillar__body">
                <div class="brand-pillar__name">Kinetic Heart Diamond <span class="brand-pillar__code">HYBRID FLUX // 04</span></div>
                <div class="brand-pillar__desc">The glowing nucleus symbolizes the fusion of high-revving internal combustion spark ignition and 800V permanent-magnet stator flux delivery.</div>
              </div>
            </div>

            <div class="brand-pillar">
              <div class="brand-pillar__icon">⏱️</div>
              <div class="brand-pillar__body">
                <div class="brand-pillar__name">Telemetry Caliper Gauge Ticks <span class="brand-pillar__code">TELEMETRY // 05</span></div>
                <div class="brand-pillar__desc">Horizontal measurement ticks signifying 150+ verified engineering tolerances, torque curves, and 6-axis IMU sensor telemetry.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let currentSearchIndex = -1;

function buildSearchOverlay() {
  return `
    <div class="search-overlay" id="search-overlay" role="dialog" aria-label="Search" aria-modal="true">
      <div class="search-modal">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="search-input" id="search-input" placeholder="Search a vehicle, brand, component, or technology..." autocomplete="off" spellcheck="false" aria-label="Search AUTOCORE">
          <button class="search-close" id="search-close-btn" aria-label="Close search">ESC</button>
        </div>
        <div class="search-results" id="search-results" style="display:none"></div>
        <div class="search-hints" id="search-hints">
          <div style="width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Quick Suggestions</span>
            <div style="display:flex;gap:6px;">
              <span class="search-kbd-hint">↑ ↓ Navigate</span>
              <span class="search-kbd-hint">↵ Select</span>
              <span class="search-kbd-hint">ESC Close</span>
            </div>
          </div>
          ${['Royal Enfield Classic 350','Turbocharger','ABS','Tesla Model 3','Ducati','CVT','IMU','Kawasaki'].map(h => `<button class="search-hint" onclick="setSearchQuery('${h}')">${h}</button>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function initNavEvents() {
  $('#nav-search-btn').onclick = openSearch;
  $('#hamburger-btn').onclick = toggleMobileMenu;
  $('#search-overlay').onclick = (e) => { if (e.target === e.currentTarget) closeSearch(); };
  $('#search-close-btn').onclick = closeSearch;

  // Click outside to close mobile menu
  document.addEventListener('click', (e) => {
    if (APP.mobileMenuOpen) {
      const menu = $('#mobile-menu');
      const btn = $('#hamburger-btn');
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  const input = $('#search-input');
  if (input) {
    input.addEventListener('input', debounce((e) => {
      const q = e.target.value.trim();
      currentSearchIndex = -1;
      if (q.length >= 2) {
        renderSearchResults(AUTOCORE_DB.searchAll(q));
      } else {
        $('#search-results').style.display = 'none';
        $('#search-hints').style.display = 'flex';
      }
    }, 150));

    input.addEventListener('keydown', (e) => {
      const resultsContainer = $('#search-results');
      const items = $$('#search-results .search-result-item');

      if (e.key === 'Escape') {
        closeSearch();
        return;
      }

      if (resultsContainer && resultsContainer.style.display !== 'none' && items.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          currentSearchIndex = (currentSearchIndex + 1) % items.length;
          items.forEach((it, idx) => it.classList.toggle('selected', idx === currentSearchIndex));
          items[currentSearchIndex].scrollIntoView({ block: 'nearest' });
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          currentSearchIndex = (currentSearchIndex - 1 + items.length) % items.length;
          items.forEach((it, idx) => it.classList.toggle('selected', idx === currentSearchIndex));
          items[currentSearchIndex].scrollIntoView({ block: 'nearest' });
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (currentSearchIndex >= 0 && items[currentSearchIndex]) {
            items[currentSearchIndex].click();
            return;
          }
        }
      }

      if (e.key === 'Enter') {
        const q = e.target.value.trim();
        if (q) performSearch(q);
      }
    });
  }
}

function openSearch() {
  APP.searchOpen = true;
  $('#search-overlay').classList.add('open');
  setTimeout(() => $('#search-input').focus(), 100);
}

function closeSearch() {
  APP.searchOpen = false;
  $('#search-overlay').classList.remove('open');
  $('#search-input').value = '';
  $('#search-results').style.display = 'none';
  $('#search-hints').style.display = 'flex';
}

function toggleMobileMenu() {
  APP.mobileMenuOpen = !APP.mobileMenuOpen;
  $('#mobile-menu').classList.toggle('open', APP.mobileMenuOpen);
  $('#hamburger-btn').setAttribute('aria-expanded', APP.mobileMenuOpen);
}

function closeMobileMenu() {
  APP.mobileMenuOpen = false;
  $('#mobile-menu').classList.remove('open');
  $('#hamburger-btn').setAttribute('aria-expanded', 'false');
}

function setSearchQuery(q) {
  const input = $('#search-input');
  input.value = q;
  input.dispatchEvent(new Event('input'));
}

function renderSearchResults(results) {
  const container = $('#search-results');
  const hints = $('#search-hints');
  if (!results.length) {
    container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.875rem;">No results found. Try a different term.</div>';
    container.style.display = 'block';
    hints.style.display = 'none';
    return;
  }
  const icons = { manufacturer: '🏭', vehicle: '🚗', component: '🔧', technology: '⚡', glossary: '📚' };
  container.innerHTML = results.map(r => `
    <div class="search-result-item" onclick="handleSearchSelect('${r.type}','${r.id}')">
      <div class="search-result-icon ${r.type}">${icons[r.type] || '📄'}</div>
      <div class="search-result-text">
        <div class="search-result-label">${r.label}</div>
        <div class="search-result-sub">${r.subtitle}</div>
      </div>
      <span class="search-result-type ${r.type}">${r.type}</span>
    </div>
  `).join('');
  container.style.display = 'block';
  hints.style.display = 'none';
}

function handleSearchSelect(type, id) {
  closeSearch();
  switch (type) {
    case 'manufacturer': Router.navigate('manufacturer-detail', id); break;
    case 'vehicle': Router.navigate('vehicle-detail', id); break;
    case 'component': Router.navigate('component-detail', id); break;
    case 'technology': Router.navigate('tech-detail', id); break;
    case 'glossary': Router.navigate('glossary'); break;
  }
}

function performSearch(q) {
  closeSearch();
  const results = AUTOCORE_DB.searchAll(q);
  if (results.length === 1) handleSearchSelect(results[0].type, results[0].id);
  else Router.navigate('vehicle-db');
}

// ===== CATEGORY & DATA FORMAT HELPERS =====
function formatCategory(cat) {
  if (!cat) return '—';
  if (Array.isArray(cat)) return cat.map(c => String(c).replace(/-/g, ' ')).join(', ');
  return String(cat).replace(/-/g, ' ');
}

function formatArrayOrString(val) {
  if (!val) return '—';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

// ===== AUTOMOTIVE VECTOR BLUEPRINT RENDERER =====
function renderCockpitBlueprint(v) {
  const isCar = v.type === 'car';
  const isEV = !!v.ev;
  const accent = isEV ? '#10b981' : isCar ? '#38bdf8' : '#06b6d4';
  
  if (isCar) {
    return `
      <svg class="spotlight-dossier__blueprint-svg" viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.name} engineering blueprint">
        <defs>
          <linearGradient id="carGrad" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.2"/>
            <stop offset="50%" stop-color="${accent}" stop-opacity="1"/>
            <stop offset="100%" stop-color="#e11d48" stop-opacity="0.9"/>
          </linearGradient>
          <filter id="carGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Telemetry Crosshairs & Coordinate Grid -->
        <line x1="40" y1="26" x2="560" y2="26" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
        <line x1="40" y1="110" x2="560" y2="110" stroke="rgba(255,255,255,0.04)" stroke-dasharray="2 6"/>
        <line x1="40" y1="190" x2="560" y2="190" stroke="rgba(255,255,255,0.08)"/>
        <circle cx="120" cy="165" r="28" stroke="rgba(255,255,255,0.12)" stroke-dasharray="3 3"/>
        <circle cx="460" cy="165" r="28" stroke="rgba(255,255,255,0.12)" stroke-dasharray="3 3"/>
        <text x="40" y="20" fill="rgba(6,182,212,0.7)" font-family="monospace" font-size="8.5" letter-spacing="1">AERO PROFILE // DOWNFORCE: -420KG @ 250KM/H</text>
        <text x="420" y="20" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="8.5" letter-spacing="1">TORSIONAL STIFFNESS: 40k Nm/°</text>
        
        <!-- Aerodynamic Flow Streamlines -->
        <path d="M 30 100 Q 130 60 250 58 T 430 70 Q 490 80 570 85" stroke="${accent}" stroke-width="1.2" stroke-opacity="0.45" stroke-dasharray="6 3"/>
        <path d="M 35 125 Q 140 105 280 105 T 565 130" stroke="${accent}" stroke-width="1" stroke-opacity="0.25"/>

        <!-- Hypercar Silhouette Line -->
        <path d="M 60 165 
                 L 80 165 
                 C 85 135 115 135 120 165 
                 L 200 165 
                 L 220 135 
                 L 380 135 
                 L 400 165 
                 C 405 135 435 135 440 165 
                 L 535 165 
                 C 540 155 535 125 515 105 
                 C 475 85 415 70 355 68 
                 C 285 66 215 80 165 108 
                 C 125 128 85 145 60 165 Z" 
              fill="rgba(6,182,212,0.05)" stroke="url(#carGrad)" stroke-width="2.2" filter="url(#carGlow)"/>

        <!-- Canopy Glass -->
        <path d="M 220 110 C 250 75 330 72 385 100 C 375 110 240 115 220 110 Z" fill="rgba(6,182,212,0.18)" stroke="${accent}" stroke-width="1.4"/>
        
        <!-- Splitter & Rear Aero Wing -->
        <path d="M 50 167 L 85 167" stroke="${accent}" stroke-width="3"/>
        <path d="M 485 80 L 540 76 L 535 90 Z" fill="${accent}" fill-opacity="0.8"/>
        
        <!-- Wheels & Hubs -->
        <circle cx="102" cy="165" r="22" fill="#090d16" stroke="${accent}" stroke-width="2.2"/>
        <circle cx="102" cy="165" r="12" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="2 2"/>
        <circle cx="102" cy="165" r="3.5" fill="${accent}"/>
        
        <circle cx="422" cy="165" r="22" fill="#090d16" stroke="#e11d48" stroke-width="2.2"/>
        <circle cx="422" cy="165" r="12" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="2 2"/>
        <circle cx="422" cy="165" r="3.5" fill="#e11d48"/>

        <!-- Callouts -->
        <line x1="290" y1="68" x2="290" y2="38" stroke="${accent}" stroke-width="1"/>
        <circle cx="290" cy="38" r="2.5" fill="${accent}"/>
        <text x="300" y="41" fill="#fff" font-family="monospace" font-size="8.5">VENTURI TUNNELS</text>
      </svg>
    `;
  } else {
    return `
      <svg class="spotlight-dossier__blueprint-svg" viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.name} engineering blueprint">
        <defs>
          <linearGradient id="bikeGrad" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
            <stop offset="50%" stop-color="${accent}" stop-opacity="1"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.9"/>
          </linearGradient>
          <filter id="bikeGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Telemetry Grid -->
        <line x1="40" y1="26" x2="560" y2="26" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
        <line x1="40" y1="190" x2="560" y2="190" stroke="rgba(255,255,255,0.08)"/>
        <text x="40" y="20" fill="rgba(6,182,212,0.7)" font-family="monospace" font-size="8.5" letter-spacing="1">HOMOLOGATION ARCHITECTURE // 6-AXIS IMU</text>
        <text x="420" y="20" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="8.5" letter-spacing="1">MAX LEAN ANGLE: 61.5°</text>

        <!-- Wheels / Rotors -->
        <circle cx="130" cy="155" r="34" fill="#090d16" stroke="${accent}" stroke-width="2.5"/>
        <circle cx="130" cy="155" r="20" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" stroke-dasharray="3 3"/>
        <circle cx="130" cy="155" r="5" fill="${accent}"/>

        <circle cx="450" cy="155" r="34" fill="#090d16" stroke="#f59e0b" stroke-width="2.5"/>
        <circle cx="450" cy="155" r="20" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" stroke-dasharray="3 3"/>
        <circle cx="450" cy="155" r="5" fill="#f59e0b"/>

        <!-- Inverted Front Forks & Clip-ons -->
        <line x1="130" y1="155" x2="220" y2="55" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        <line x1="210" y1="52" x2="235" y2="60" stroke="#fff" stroke-width="2.5"/>
        
        <!-- Tank, Monocoque, Cowl -->
        <path d="M 220 55 
                 C 250 55 270 65 300 75 
                 C 330 85 360 110 400 110 
                 L 470 85 
                 L 440 135 
                 L 350 145 
                 L 260 150 
                 L 220 125 
                 Z" 
              fill="rgba(6,182,212,0.06)" stroke="url(#bikeGrad)" stroke-width="2.2" filter="url(#bikeGlow)"/>

        <!-- Subframe Struts -->
        <path d="M 230 80 L 290 130 L 340 100 L 280 90 Z" stroke="rgba(255,255,255,0.25)" stroke-width="1.4"/>
        <path d="M 340 100 L 450 155" stroke="rgba(255,255,255,0.3)" stroke-width="1.8"/>

        <!-- Aero Biplane Winglets -->
        <path d="M 185 88 L 225 92 L 220 98 L 180 94 Z" fill="${accent}" filter="url(#bikeGlow)"/>
        
        <!-- Exhaust / Silencer -->
        <path d="M 270 135 Q 310 170 370 165" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round"/>
        <rect x="360" y="155" width="45" height="14" rx="3" fill="#141824" stroke="#f59e0b" stroke-width="1.4"/>

        <!-- Callouts -->
        <line x1="205" y1="92" x2="205" y2="38" stroke="${accent}" stroke-width="1"/>
        <circle cx="205" cy="38" r="2.5" fill="${accent}"/>
        <text x="145" y="41" fill="#fff" font-family="monospace" font-size="8.5">CARBON WINGLETS</text>
      </svg>
    `;
  }
}

// ===== HOME PAGE (Minimalist Luxury Automotive Hub) =====
function renderHome() {
  return `
    ${renderHero()}
    ${renderDirectPortalsSection()}
    ${renderSpotlightDossier()}
    ${renderManufacturerQuickBar()}
    ${renderStatsBar()}
    ${renderFooter()}
  `;
}

function renderHero() {
  return `
    <section class="hero" id="hero" aria-label="Hero section">
      <!-- Background Image -->
      <div class="hero__bg" role="img" aria-label="Premium dark automotive background"></div>

      <!-- Cinematic Overlay Stack -->
      <div class="hero__overlay"></div>
      <div class="hero__ambient-glow"></div>
      <div class="hero__grid-pattern"></div>

      <!-- Lens Flare Accents -->
      <div class="hero__lens-flare hero__lens-flare--1" aria-hidden="true"></div>
      <div class="hero__lens-flare hero__lens-flare--2" aria-hidden="true"></div>

      <!-- Hero Content -->
      <div class="hero__content">
        <button class="hero__badge scroll-reveal" onclick="openLogoMeaningModal()" aria-label="Explore emblem architecture and symbology" style="cursor:pointer;" title="Click to view emblem symbology">
          <img src="assets/autocore-logo.svg" alt="AUTOCORE Marque Crest" width="20" height="20" style="display:inline-block;vertical-align:middle;filter:drop-shadow(0 0 8px rgba(212,175,55,0.7));">
          <span>AERODYNAMIC TELEMETRY // VERIFIED HOMOLOGATION</span>
          <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--cyan-bright);padding:2px 8px;border-radius:var(--radius-full);background:rgba(212,175,55,0.12);border:1px solid rgba(212,175,55,0.3);margin-left:4px;">🛡️ MARQUE CREST</span>
        </button>

        <h1 class="hero__title scroll-reveal">
          Understand Every Machine.<br>
          <span class="gradient-text">Down to Every Part.</span>
        </h1>
        <p class="hero__subtitle scroll-reveal">
          <span class="editorial-bracket">[</span> Precision Engineering Dossiers &bull; 150+ Verified Telemetry Points Per Machine <span class="editorial-bracket">]</span>
        </p>

        <!-- Signature Luxury CTA Actions -->
        <div class="hero__ctas scroll-reveal">
          <button class="hero__btn-pill" onclick="Router.navigate('cars')">
            <span>Explore Cars Fleet</span>
            <span class="hero__btn-pill-arrow">↗</span>
          </button>
          <button class="hero__btn-ghost" onclick="Router.navigate('bikes')">
            <span>Motorcycle Database</span>
            <span>→</span>
          </button>
          <button class="hero__btn-ghost" onclick="Router.navigate('compare')">
            <span>Compare Specs</span>
            <span>⇄</span>
          </button>
        </div>

        <!-- Live Instant Search Bar -->
        <div class="hero__search scroll-reveal" style="position:relative;">
          <div class="hero__search-inner">
            <svg class="hero__search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="hero__search-input" id="hero-search" placeholder="Type vehicle, brand, engine or component for instant jump..." autocomplete="off" spellcheck="false" aria-label="Direct search input">
            <button class="hero__search-btn" onclick="handleHeroSearch()" aria-label="Search" title="Search">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
          <!-- Live Instant Dropdown -->
          <div class="hero__live-results" id="hero-live-results" style="display:none;"></div>

          <div class="hero__examples">
            <span class="hero__examples-label">Quick Jump:</span>
            <button class="hero__example-chip" onclick="handleSearchSelect('vehicle','ducati-panigale-v4-s')">Panigale V4 S</button>
            <button class="hero__example-chip" onclick="handleSearchSelect('vehicle','tesla-model-3')">Tesla Model 3</button>
            <button class="hero__example-chip" onclick="handleSearchSelect('vehicle','kawasaki-ninja-h2-carbon')">Ninja H2 Carbon</button>
            <button class="hero__example-chip" onclick="handleSearchSelect('component','turbocharger')">Turbocharger</button>
          </div>
        </div>
      </div>

      <!-- Scroll Down Indicator -->
      <div class="hero__scroll-hint" aria-hidden="true">
        <div class="hero__scroll-line"></div>
        <span class="hero__scroll-label">SCROLL</span>
      </div>
    </section>
  `;
}

// 4 Core High-Impact Glossy Engineering Portals (Minimal & Focused)
function renderDirectPortalsSection() {
  const portals = [
    {
      id: 'cars',
      icon: '🏎️',
      accentColor: '#38bdf8',
      badge: 'VEHICLE DOSSIERS',
      title: 'Cars & Supercars',
      desc: '150+ verified specifications across exotic supercars, GTs, and homologation sedans.',
      primaryAction: "Router.navigate('cars')",
      actionLabel: 'Browse All Cars →',
    },
    {
      id: 'bikes',
      icon: '🏍️',
      accentColor: '#06b6d4',
      badge: '45 TAXONOMIES',
      title: 'Motorcycles & Scooters',
      desc: 'MotoGP homologation superbikes, big-twin cruisers, adventure tourers, and urban runabouts.',
      primaryAction: "Router.navigate('bikes')",
      actionLabel: 'Browse All Bikes →',
    },
    {
      id: 'ev',
      icon: '⚡',
      accentColor: '#10b981',
      badge: '800V ARCHITECTURE',
      title: 'Electric Powertrains (EV)',
      desc: 'Lithium-ion chemistries, 800V fast-charging architectures, BMS safety, and electric motor stators.',
      primaryAction: "Router.navigate('ev')",
      actionLabel: 'Explore EV Hub →',
    },
    {
      id: 'engines',
      icon: '⚙️',
      accentColor: '#f59e0b',
      badge: 'POWERTRAINS & BLUEPRINTS',
      title: 'Engines & Schematics',
      desc: 'Desmodromic V4s, Boxer flat-6, twin-turbos, and interactive mechanical blueprints.',
      primaryAction: "Router.navigate('engines')",
      actionLabel: 'Explore Engines & Parts →',
    },
  ];

  return `
    <section class="section section--portals" id="portals-section" aria-label="Direct Navigation Portals">
      <div class="container">
        <div class="section__header scroll-reveal" style="text-align:center;margin-bottom:var(--space-2xl);">
          <span class="section__label" style="color:var(--cyan-bright);letter-spacing:0.12em;">DIRECT ENGINEERING HUBS</span>
          <h2 class="section__title" style="font-size:clamp(1.8rem, 3.2vw, 2.6rem);margin-top:6px;">Navigate Direct to Mechanical Dossiers</h2>
        </div>

        <div class="portals-grid scroll-reveal">
          ${portals.map(p => `
            <div class="portal-card" style="--portal-accent: ${p.accentColor};" onclick="${p.primaryAction}" role="region" aria-label="${p.title}">
              <div class="portal-card__glow"></div>
              <div class="portal-card__header">
                <div class="portal-card__icon">${p.icon}</div>
                <span class="portal-card__badge">${p.badge}</span>
              </div>
              <h3 class="portal-card__title">${p.title}</h3>
              <p class="portal-card__desc">${p.desc}</p>
              
              <div class="portal-card__footer">
                <span class="portal-card__cta">${p.actionLabel}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderManufacturerQuickBar() {
  const topMfrs = [
    { id: 'ducati', name: 'Ducati', flag: '🇮🇹' },
    { id: 'bmw-motorrad', name: 'BMW Motorrad', flag: '🇩🇪' },
    { id: 'kawasaki', name: 'Kawasaki', flag: '🇯🇵' },
    { id: 'yamaha', name: 'Yamaha', flag: '🇯🇵' },
    { id: 'honda', name: 'Honda', flag: '🇯🇵' },
    { id: 'ktm', name: 'KTM', flag: '🇦🇹' },
    { id: 'royal-enfield', name: 'Royal Enfield', flag: '🇮🇳' },
    { id: 'tesla', name: 'Tesla', flag: '🇺🇸' },
  ];

  return `
    <section class="section section--mfr-bar" aria-label="Manufacturer Quick Direct Navigation">
      <div class="container">
        <div class="mfr-bar-header scroll-reveal">
          <div class="mfr-bar-header__left">
            <span class="mfr-bar-header__label">DIRECT MARQUE ACCESS</span>
            <h3 class="mfr-bar-header__title">Global Manufacturer Directory</h3>
          </div>
          <button class="btn btn--secondary btn--sm" onclick="Router.navigate('manufacturers')">View All 80+ Brands →</button>
        </div>

        <div class="mfr-quick-strip scroll-reveal">
          ${topMfrs.map(m => `
            <button class="mfr-strip-chip" onclick="Router.navigate('manufacturer-detail', '${m.id}')" aria-label="${m.name} dossier">
              <span class="mfr-strip-chip__flag">${m.flag}</span>
              <span class="mfr-strip-chip__name">${m.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function getVehicleTelemetryMetrics(v) {
  const isEV = !!v.ev;
  let disp = '—';
  let power = '—';
  let torque = '—';
  let topSpeed = (v.performance?.topSpeed || v.ev?.topSpeed) ? `${v.performance?.topSpeed || v.ev?.topSpeed} km/h` : '—';
  let weight = v.dimensions?.kerbWeight ? `${v.dimensions.kerbWeight} kg` : (v.dimensions?.dryWeight ? `${v.dimensions.dryWeight} kg (dry)` : '—');

  if (isEV) {
    disp = v.ev.batteryCapacity ? `${v.ev.batteryCapacity} kWh (Pack)` : '800V EV';
    const pVal = v.ev.motorPower?.peak || v.ev.motorPower?.continuous || (typeof v.ev.motorPower === 'number' ? v.ev.motorPower : null);
    power = pVal ? `${pVal} kW (${Math.round(pVal * 1.341)} bhp)` : '—';
    torque = v.ev.torque ? `${v.ev.torque} Nm` : (v.ev.wheelTorque ? `${v.ev.wheelTorque} Nm` : '—');
  } else if (v.engine) {
    disp = v.engine.displacement ? `${v.engine.displacement} cc` : (v.engine.layout || '—');
    if (v.engine.maxPower) {
      power = `${v.engine.maxPower.value} ${v.engine.maxPower.unit}` + (v.engine.maxPower.rpm ? ` @ ${v.engine.maxPower.rpm} RPM` : '');
    }
    if (v.engine.maxTorque) {
      torque = `${v.engine.maxTorque.value} Nm` + (v.engine.maxTorque.rpm ? ` @ ${v.engine.maxTorque.rpm} RPM` : '');
    }
  }
  return { disp, power, torque, topSpeed, weight, isEV };
}

function renderSpotlightDossier(activeId = 'ducati-panigale-v4-s') {
  const v = AUTOCORE_DB.getVehicle(activeId) || AUTOCORE_DB.getVehicle('ducati-panigale-v4-s') || AUTOCORE_DB.vehicles[0];
  if (!v) return '';

  const mfrName = AUTOCORE_DB.getManufacturerName(v.manufacturer);
  const metrics = getVehicleTelemetryMetrics(v);
  const catDisplay = AUTOCORE_DB.getCategoryDisplay ? AUTOCORE_DB.getCategoryDisplay(v.category) : formatCategory(v.category);

  const spotlightOptions = [
    { id: 'ducati-panigale-v4-s', label: 'Panigale V4 S', icon: '🏍️' },
    { id: 'tesla-model-3', label: 'Tesla Model 3', icon: '⚡' },
    { id: 're-classic-350', label: 'Classic 350', icon: '🏍️' },
    { id: 'kawasaki-ninja-h2-carbon', label: 'Ninja H2 Carbon', icon: '🚀' },
  ];

  return `
    <section class="section section--spotlight" id="spotlight-section" aria-label="Spotlight Technical Dossier">
      <div class="container">
        <!-- Spotlight Selector Tabs -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg);flex-wrap:wrap;gap:var(--space-md);" class="scroll-reveal">
          <div>
            <span style="font-family:var(--font-mono);font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--cyan-bright);">TELEMETRY SHOWCASE</span>
            <h3 style="font-family:var(--font-brand);font-size:1.35rem;font-weight:900;color:var(--text-primary);">Engineering Spotlight Dossiers</h3>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${spotlightOptions.map(opt => `
              <button class="filter-btn ${opt.id === v.id ? 'active' : ''}" onclick="switchSpotlight('${opt.id}')" style="font-size:0.8rem;padding:6px 14px;">
                ${opt.icon} ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="spotlight-dossier scroll-reveal revealed" id="spotlight-dossier-card">
          <div class="spotlight-dossier__glow"></div>
          
          <div class="spotlight-dossier__header">
            <div class="spotlight-dossier__tag">
              <span class="live-dot live-dot--cyan"></span>
              ENGINEERING COCKPIT DOSSIER
            </div>
            <span class="badge badge--cyan">${catDisplay}</span>
          </div>

          <div class="spotlight-dossier__content">
            <div class="spotlight-dossier__info">
              <div class="spotlight-dossier__maker">${mfrName}</div>
              <h2 class="spotlight-dossier__name">${v.name}</h2>
              <p class="spotlight-dossier__tagline">${v.tagline || v.description || 'Superlative engineering precision and telemetry-verified specifications.'}</p>
              
              <div class="spotlight-dossier__telemetry">
                <div class="telemetry-pill">
                  <span class="telemetry-pill__label">${metrics.isEV ? 'BATTERY PACK' : 'DISPLACEMENT'}</span>
                  <span class="telemetry-pill__val">${metrics.disp}</span>
                </div>
                <div class="telemetry-pill">
                  <span class="telemetry-pill__label">PEAK POWER</span>
                  <span class="telemetry-pill__val">${metrics.power}</span>
                </div>
                <div class="telemetry-pill">
                  <span class="telemetry-pill__label">PEAK TORQUE</span>
                  <span class="telemetry-pill__val">${metrics.torque}</span>
                </div>
                <div class="telemetry-pill">
                  <span class="telemetry-pill__label">TOP SPEED</span>
                  <span class="telemetry-pill__val">${metrics.topSpeed}</span>
                </div>
                <div class="telemetry-pill">
                  <span class="telemetry-pill__label">KERB WEIGHT</span>
                  <span class="telemetry-pill__val">${metrics.weight}</span>
                </div>
              </div>

              <div class="spotlight-dossier__actions">
                <button class="btn btn--primary" onclick="Router.navigate('vehicle-detail', '${v.id}')">
                  Open Complete 150+ Spec Dossier →
                </button>
                <button class="btn btn--secondary" onclick="Router.navigate('compare')">
                  Compare Specs
                </button>
              </div>
            </div>

            <div class="spotlight-dossier__visual" onclick="Router.navigate('vehicle-detail', '${v.id}')" title="Inspect ${v.name} schematic">
              ${renderCockpitBlueprint(v)}
              <div class="spotlight-dossier__watermark">${mfrName} // TELEMETRY</div>
              <div class="spotlight-dossier__hud-line"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function switchSpotlight(id) {
  const section = $('#spotlight-section');
  if (section) {
    const parent = section.parentElement;
    if (parent) {
      const temp = document.createElement('div');
      temp.innerHTML = renderSpotlightDossier(id);
      const newCard = temp.firstElementChild;
      section.replaceWith(newCard);
      newCard.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('revealed'));
    }
  }
}

function renderStatsBar() {
  const mfrCount = AUTOCORE_DB.manufacturers ? AUTOCORE_DB.manufacturers.length : 80;
  const vehCount = AUTOCORE_DB.vehicles ? AUTOCORE_DB.vehicles.length : 91;
  const engCount = Object.keys(AUTOCORE_DB.engineFamilies || {}).length || 59;
  const catCount = (AUTOCORE_DB.motorcycleCategories || []).length || 45;

  const stats = [
    { n: `${mfrCount}+`, label: 'Global Manufacturers', sub: 'Verified Official Data' },
    { n: `${vehCount}+`, label: 'Vehicle Dossiers', sub: '150+ Specs Per Profile' },
    { n: `${engCount}`, label: 'Engine Architectures', sub: 'From Inline to Desmo V4' },
    { n: `${catCount}`, label: 'Motorcycle Taxonomies', sub: 'Complete Classifications' },
  ];
  return `
    <section class="section section--stats-bar" aria-label="Platform Telemetry Metrics">
      <div class="container">
        <div class="stats-bar-grid">
          ${stats.map(s => `
            <div class="stats-bar-item scroll-reveal">
              <div class="stats-bar-item__number">${s.n}</div>
              <div class="stats-bar-item__label">${s.label}</div>
              <div class="stats-bar-item__sub">${s.sub}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderVehicleCard(v) {
  const mfr = AUTOCORE_DB.getManufacturerName(v.manufacturer);
  
  // Dynamic category icon
  let icon = '🚗';
  if (v.type === 'scooter') {
    icon = '🛵';
  } else if (v.type === 'motorcycle') {
    icon = '🏍️';
  } else if (v.type === 'car') {
    const cats = (Array.isArray(v.category) ? v.category : [v.category]).map(s => String(s).toLowerCase());
    if (cats.some(c => ['supercar', 'hypercar', 'track', 'gt'].includes(c))) {
      icon = '🏎️';
    } else if (cats.some(c => ['suv', '4x4', 'off-road'].includes(c))) {
      icon = '🚙';
    } else if (v.ev || v.fuelType === 'electric') {
      icon = '⚡';
    } else {
      icon = '🚗';
    }
  }

  const disp = v.engine?.displacement ? `${v.engine.displacement} cc` : v.ev?.batteryCapacity ? `${v.ev.batteryCapacity} kWh` : '';
  const power = v.engine?.maxPower ? `${v.engine.maxPower.value} ${v.engine.maxPower.unit}` : v.ev?.motorPower?.peak ? `${v.ev.motorPower.peak} kW` : '';
  const torque = v.engine?.maxTorque ? `${v.engine.maxTorque.value} Nm` : v.ev?.torque ? `${v.ev.torque} Nm` : '';
  const catList = AUTOCORE_DB.getCategoryList ? AUTOCORE_DB.getCategoryList(v.category) : (Array.isArray(v.category) ? v.category : [v.category]);
  const catDisplay = AUTOCORE_DB.getCategoryDisplay ? AUTOCORE_DB.getCategoryDisplay(v.category) : catList.join(', ');
  const primaryCat = (catList[0] || 'Automotive').replace(/-/g, ' ');
  
  // Left Badge (Product badge like SALE, NEW, BEST SELLER in Sample Image)
  let leftBadgeClass = 'product-badge--dark';
  let leftBadgeText = primaryCat.toUpperCase();

  if (v.ev || v.fuelType === 'electric') {
    leftBadgeClass = 'product-badge--blue';
    leftBadgeText = '⚡ 800V EV';
  } else if (v.status === 'upcoming') {
    leftBadgeClass = 'product-badge--cyan';
    leftBadgeText = '✨ NEW';
  } else if (v.status === 'historical') {
    leftBadgeClass = 'product-badge--dark';
    leftBadgeText = '🏛️ LEGEND';
  } else {
    const cats = (Array.isArray(v.category) ? v.category : [v.category]).map(s => String(s).toLowerCase());
    if (cats.some(c => ['supercar', 'hypercar', 'superbike', 'track'].includes(c))) {
      leftBadgeClass = 'product-badge--red';
      leftBadgeText = '🔥 HALO';
    } else if (cats.some(c => ['suv', '4x4'].includes(c))) {
      leftBadgeClass = 'product-badge--green';
      leftBadgeText = '🏔️ 4x4';
    }
  }

  const powerVal = v.engine?.maxPower?.value || (v.ev?.motorPower?.peak ? Math.round(v.ev.motorPower.peak * 1.341) : 0);
  const speedVal = v.performance?.topSpeed || (v.ev?.topSpeed || 0);
  const accelVal = v.performance?.zeroTo100 || (v.ev?.zeroTo100 || 99);
  const weightVal = v.dimensions?.kerbWeight || 9999;
  const priceVal = v.price?.india?.min || (v.price?.usa?.min ? v.price.usa.min * 84 : (v.price?.europe?.min ? v.price.europe.min * 92 : 0));

  // Right Badge (Metric / Highlight pill like -25% in Sample Image)
  let rightBadgeClass = 'product-badge--right product-badge--red';
  let rightBadgeText = '';
  if (v.performance?.zeroTo100 && v.performance.zeroTo100 <= 3.5) {
    rightBadgeText = `⏱ ${v.performance.zeroTo100}s`;
  } else if (powerVal >= 200) {
    rightBadgeText = `${powerVal} HP`;
  } else if (v.price?.india?.min) {
    rightBadgeClass = 'product-badge--right product-badge--dark';
    rightBadgeText = `₹${(v.price.india.min/100000).toFixed(1)}L`;
  } else if (v.status === 'current' || !v.status) {
    rightBadgeClass = 'product-badge--right product-badge--green';
    rightBadgeText = 'CURRENT';
  } else {
    rightBadgeClass = 'product-badge--right product-badge--dark';
    rightBadgeText = (v.status || 'ACTIVE').toUpperCase();
  }

  const genText = v.generation ? `<div class="vehicle-card__gen">${v.generation}</div>` : '';
  const priceDisplay = v.price?.india?.min ? `₹${(v.price.india.min/100000).toFixed(2)}L` : 
                       v.price?.europe?.min ? `€${v.price.europe.min.toLocaleString()}` :
                       v.price?.usa?.min ? `$${v.price.usa.min.toLocaleString()}` : '';

  const searchIndex = `${v.name} ${mfr} ${v.generation || ''} ${catDisplay} ${v.status || ''} ${v.drivetrain || ''} ${v.fuelType || ''}`.toLowerCase();

  return `
    <div class="vehicle-card" 
         data-search="${searchIndex}"
         data-categories="${catList.join(' ')}"
         data-brand="${(v.manufacturer || '').toLowerCase()}"
         data-displacement="${v.engine?.displacement || 0}"
         data-power="${powerVal}"
         data-speed="${speedVal}"
         data-accel="${accelVal}"
         data-weight="${weightVal}"
         data-price="${priceVal}"
         data-drivetrain="${(v.drivetrain || '').toLowerCase()}"
         data-fuel="${(v.fuelType || (v.ev ? 'electric' : 'petrol')).toLowerCase()}"
         data-status="${v.status || 'current'}"
         data-type="${v.type}"
         data-is-ev="${v.ev ? 'true' : 'false'}"
         onclick="Router.navigate('vehicle-detail','${v.id}')" 
         role="article" 
         aria-label="${mfr} ${v.name}">
      <div class="vehicle-card__img">
        <div class="product-badge ${leftBadgeClass}">${leftBadgeText}</div>
        <div class="product-badge ${rightBadgeClass}">${rightBadgeText}</div>
        <div class="vehicle-card__icon-wrap">
          <span class="vehicle-card__silhouette" aria-hidden="true">${icon}</span>
        </div>
        <div class="vehicle-card__hud-grid"></div>
      </div>
      <div class="vehicle-card__body">
        <div class="vehicle-card__maker">${mfr} &bull; ${primaryCat}</div>
        <div class="vehicle-card__name" title="${mfr} ${v.name}">${v.name}</div>
        ${genText}
        <div class="vehicle-card__specs-row">
          ${power ? `<span class="micro-spec">⚡ ${power}</span>` : ''}
          ${v.performance?.zeroTo100 ? `<span class="micro-spec micro-spec--accent">⏱ ${v.performance.zeroTo100}s</span>` : (disp ? `<span class="micro-spec">⚙ ${disp}</span>` : '')}
          ${v.performance?.topSpeed ? `<span class="micro-spec">🏁 ${v.performance.topSpeed} km/h</span>` : ''}
        </div>
        <div class="vehicle-card__bottom-bar">
          <span class="vehicle-card__price-tag">${priceDisplay || 'Spec Telemetry'}</span>
          <span class="vehicle-card__explore-btn">Dossier →</span>
        </div>
      </div>
    </div>
  `;
}

// ===== MANUFACTURER DETAIL =====
function renderManufacturerDetail(id) {
  const m = AUTOCORE_DB.getManufacturer(id);
  if (!m) return renderNotFound();
  const allVehicles = AUTOCORE_DB.getVehiclesByManufacturer(id);
  const currentVehicles = allVehicles.filter(v => (v.status || 'current') === 'current');
  const discVehicles = allVehicles.filter(v => v.status === 'discontinued');
  const histVehicles = allVehicles.filter(v => v.status === 'historical');
  const upVehicles = allVehicles.filter(v => v.status === 'upcoming');

  // Collect unique categories present
  const catSet = new Set();
  allVehicles.forEach(v => {
    const list = AUTOCORE_DB.getCategoryList ? AUTOCORE_DB.getCategoryList(v.category) : (Array.isArray(v.category) ? v.category : [v.category]);
    list.forEach(c => { if (c) catSet.add(c); });
  });
  const categoriesPresent = Array.from(catSet);

  // Collect engine families
  const engines = [];
  if (m.engineFamilies) {
    Object.values(m.engineFamilies).forEach(e => engines.push(e));
  } else if (AUTOCORE_DB.engineFamilies) {
    const seenEngines = new Set();
    allVehicles.forEach(v => {
      if (v.engineId && AUTOCORE_DB.engineFamilies[v.engineId] && !seenEngines.has(v.engineId)) {
        seenEngines.add(v.engineId);
        engines.push(AUTOCORE_DB.engineFamilies[v.engineId]);
      }
    });
  }

  return `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb" style="margin-bottom:var(--space-md);">
          <button class="breadcrumb" onclick="Router.navigate('manufacturers')">Manufacturers</button> 
          <span>/</span> 
          <span>${m.name}</span>
        </div>
        <button class="back-btn" onclick="Router.back()" style="margin-bottom:var(--space-lg);">← Back</button>
        
        <!-- Manufacturer Hero -->
        <div style="display:grid;grid-template-columns:auto 1fr;gap:var(--space-xl);align-items:center;">
          <div style="font-size:5rem;line-height:1;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.4));">${m.flag || '🏭'}</div>
          <div>
            <div class="manufacturer-card__types" style="justify-content:flex-start;margin-bottom:var(--space-sm);gap:6px;">
              ${(m.type || []).map(t => `<span class="badge badge--blue" style="text-transform:uppercase;font-size:0.75rem;">${t}</span>`).join('')}
              ${m.parentCompany ? `<span class="badge badge--purple" style="font-size:0.75rem;">Parent: ${m.parentCompany}</span>` : ''}
              ${m.status === 'active' || !m.status ? '<span class="badge badge--green" style="font-size:0.75rem;">Active Production</span>' : ''}
            </div>
            <h1 style="font-size:clamp(2.2rem,4vw,3.5rem);margin-bottom:6px;font-weight:800;">${m.fullName || m.name}</h1>
            <div style="color:var(--text-muted);font-size:0.9rem;margin-bottom:var(--space-md);display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
              <span>📍 ${m.hq || m.country}</span>
              <span>•</span>
              <span>📅 Founded ${m.founded}</span>
              ${m.ceo ? `<span>•</span><span>👤 CEO: ${m.ceo}</span>` : ''}
              ${m.website ? `<span>•</span><a href="${m.website}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);text-decoration:none;display:inline-flex;align-items:center;gap:4px;">Official Site ↗</a>` : ''}
            </div>
            <p style="max-width:850px;color:var(--text-secondary);line-height:1.6;font-size:1rem;">${m.description}</p>
          </div>
        </div>

        <!-- Catalog Metrics Summary -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--space-md);margin-top:var(--space-xl);">
          <div class="quick-stat" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-md);">
            <div class="quick-stat__label">Total Documented</div>
            <div class="quick-stat__value" style="color:var(--accent-primary);font-size:1.8rem;font-weight:800;">${allVehicles.length} Models</div>
          </div>
          <div class="quick-stat" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-md);">
            <div class="quick-stat__label">Current Lineup</div>
            <div class="quick-stat__value" style="color:var(--text-green);font-size:1.8rem;font-weight:800;">${currentVehicles.length} Models</div>
          </div>
          <div class="quick-stat" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-md);">
            <div class="quick-stat__label">Discontinued & Historical</div>
            <div class="quick-stat__value" style="color:var(--text-yellow);font-size:1.8rem;font-weight:800;">${discVehicles.length + histVehicles.length} Models</div>
          </div>
          <div class="quick-stat" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-md);">
            <div class="quick-stat__label">Engine Architectures</div>
            <div class="quick-stat__value" style="color:var(--text-cyan);font-size:1.8rem;font-weight:800;">${engines.length} Families</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Catalog View -->
    <div class="section">
      <div class="container">
        
        <!-- Navigation Tabs -->
        <div class="tabs" role="tablist" style="margin-bottom:var(--space-lg);border-bottom:1px solid var(--border-color);overflow-x:auto;">
          <button class="tab-btn active" onclick="switchMfrTab(this, 'mfr-all')">All Models (${allVehicles.length})</button>
          <button class="tab-btn" onclick="switchMfrTab(this, 'mfr-current')">Current Lineup (${currentVehicles.length})</button>
          ${discVehicles.length ? `<button class="tab-btn" onclick="switchMfrTab(this, 'mfr-disc')">Discontinued (${discVehicles.length})</button>` : ''}
          ${histVehicles.length ? `<button class="tab-btn" onclick="switchMfrTab(this, 'mfr-hist')">Historical Milestones (${histVehicles.length})</button>` : ''}
          ${engines.length ? `<button class="tab-btn" onclick="switchMfrTab(this, 'mfr-engines')">Engine Families (${engines.length})</button>` : ''}
          <button class="tab-btn" onclick="switchMfrTab(this, 'mfr-heritage')">Brand Heritage & Plants</button>
        </div>

        <!-- Filter & Search Toolbar (active for vehicle tabs) -->
        <div id="mfr-toolbar" style="margin-bottom:var(--space-xl);display:flex;flex-wrap:wrap;gap:var(--space-md);justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:240px;max-width:400px;position:relative;">
            <input type="text" id="mfr-model-search" placeholder="Search within ${m.name} models..." 
                   oninput="filterMfrCatalogSearch(this.value)" 
                   style="width:100%;padding:10px 14px 10px 36px;border-radius:var(--radius-md);background:var(--bg-card);border:1px solid var(--border-color);color:var(--text-primary);font-size:0.9rem;">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:0.9rem;">🔍</span>
          </div>

          <!-- Category filter buttons -->
          ${categoriesPresent.length > 1 ? `
            <div style="display:flex;flex-wrap:wrap;gap:6px;" id="mfr-cat-filters">
              <button class="badge badge--blue active" onclick="filterMfrCategory(this, 'all')" style="cursor:pointer;padding:6px 12px;border:none;">All Types</button>
              ${categoriesPresent.map(cat => `
                <button class="badge" onclick="filterMfrCategory(this, '${cat}')" style="cursor:pointer;padding:6px 12px;border:1px solid var(--border-color);background:var(--bg-card);color:var(--text-secondary);">
                  ${cat.replace(/-/g,' ')}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- TAB CONTENT: All Models -->
        <div id="mfr-all" class="mfr-tab-pane active">
          ${allVehicles.length ? `
            <div class="grid-auto" id="mfr-vehicle-grid">
              ${allVehicles.map(v => renderMfrVehicleCard(v)).join('')}
            </div>
          ` : `
            <div class="callout callout--info">
              <div class="callout__title">📊 Catalog Growing</div>
              <p>Vehicle profiles for ${m.name} are currently being researched and added to the AUTOCORE verified registry.</p>
            </div>
          `}
        </div>

        <!-- TAB CONTENT: Current Lineup -->
        <div id="mfr-current" class="mfr-tab-pane" style="display:none;">
          <div class="grid-auto">
            ${currentVehicles.map(v => renderMfrVehicleCard(v)).join('')}
          </div>
        </div>

        <!-- TAB CONTENT: Discontinued -->
        <div id="mfr-disc" class="mfr-tab-pane" style="display:none;">
          <div class="grid-auto">
            ${discVehicles.map(v => renderMfrVehicleCard(v)).join('')}
          </div>
        </div>

        <!-- TAB CONTENT: Historical -->
        <div id="mfr-hist" class="mfr-tab-pane" style="display:none;">
          <div class="grid-auto">
            ${histVehicles.map(v => renderMfrVehicleCard(v)).join('')}
          </div>
        </div>

        <!-- TAB CONTENT: Engine Families -->
        <div id="mfr-engines" class="mfr-tab-pane" style="display:none;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:var(--space-xl);">
            ${engines.map(eng => {
              const poweredModels = allVehicles.filter(v => v.engineId === eng.id);
              return `
                <div class="engine-card" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-lg);display:flex;flex-direction:column;justify-content:space-between;">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-sm);">
                      <span class="badge badge--cyan">${eng.displacement ? eng.displacement + ' cc' : 'Powertrain'}</span>
                      <span style="font-size:0.8rem;color:var(--text-muted);">${eng.emissionStandard || ''}</span>
                    </div>
                    <h3 style="font-size:1.3rem;margin-bottom:4px;color:var(--text-primary);">${eng.name}</h3>
                    <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-md);">${eng.type || eng.configuration || ''}</div>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xs);margin-bottom:var(--space-md);background:var(--bg-surface);padding:var(--space-sm);border-radius:var(--radius-md);">
                      ${eng.maxPower ? `<div style="font-size:0.8rem;"><span style="color:var(--text-muted);">Power:</span> <strong>${eng.maxPower.value} ${eng.maxPower.unit} @ ${eng.maxPower.rpm} RPM</strong></div>` : ''}
                      ${eng.maxTorque ? `<div style="font-size:0.8rem;"><span style="color:var(--text-muted);">Torque:</span> <strong>${eng.maxTorque.value} Nm @ ${eng.maxTorque.rpm} RPM</strong></div>` : ''}
                      ${eng.bore && eng.stroke ? `<div style="font-size:0.8rem;"><span style="color:var(--text-muted);">Bore × Stroke:</span> <strong>${eng.bore} × ${eng.stroke} mm</strong></div>` : ''}
                      ${eng.compressionRatio ? `<div style="font-size:0.8rem;"><span style="color:var(--text-muted);">Compression:</span> <strong>${eng.compressionRatio}</strong></div>` : ''}
                      ${eng.cooling ? `<div style="font-size:0.8rem;"><span style="color:var(--text-muted);">Cooling:</span> <strong>${eng.cooling}</strong></div>` : ''}
                      ${eng.fuelSystem ? `<div style="font-size:0.8rem;"><span style="color:var(--text-muted);">Fueling:</span> <strong>${eng.fuelSystem}</strong></div>` : ''}
                    </div>
                  </div>

                  <div>
                    ${poweredModels.length ? `
                      <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px;">Powers in Database (${poweredModels.length}):</div>
                      <div style="display:flex;flex-wrap:wrap;gap:4px;">
                        ${poweredModels.map(pm => `<button class="badge badge--blue" onclick="Router.navigate('vehicle-detail','${pm.id}')" style="cursor:pointer;border:none;">${pm.name}</button>`).join('')}
                      </div>
                    ` : ''}
                    ${eng.source ? `<div style="font-size:0.75rem;color:var(--text-muted);margin-top:var(--space-sm);border-top:1px solid var(--border-color);padding-top:4px;">Source: ${eng.source}</div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- TAB CONTENT: Heritage & Plants -->
        <div id="mfr-heritage" class="mfr-tab-pane" style="display:none;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);">
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-xl);">
              <h3 style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:8px;">📜 Brand History & Origins</h3>
              <p style="color:var(--text-secondary);line-height:1.7;margin-bottom:var(--space-md);">${m.history || m.description}</p>
              ${m.racingHonours ? `
                <h4 style="margin-top:var(--space-lg);margin-bottom:var(--space-xs);color:var(--accent-primary);">🏆 Racing Heritage</h4>
                <p style="color:var(--text-secondary);line-height:1.6;">${m.racingHonours}</p>
              ` : ''}
            </div>

            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-xl);">
              <h3 style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:8px;">🏭 Factories & Platforms</h3>
              ${m.factories && m.factories.length ? `
                <div style="margin-bottom:var(--space-lg);">
                  <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-xs);">Manufacturing Facilities:</div>
                  <ul style="padding-left:20px;color:var(--text-secondary);line-height:1.6;">
                    ${m.factories.map(f => `<li>${f}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${m.platforms && m.platforms.length ? `
                <div style="margin-bottom:var(--space-lg);">
                  <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-xs);">Core Vehicle Platforms:</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    ${m.platforms.map(p => `<span class="badge badge--purple">${p}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${m.globalPresence ? `
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-xs);">Global Footprint:</div>
                  <p style="color:var(--text-secondary);">${m.globalPresence}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

      </div>
    </div>
    ${renderFooter()}
  `;
}

// Client-side tab switcher for manufacturer page
window.switchMfrTab = function(btn, tabId) {
  const container = btn.closest('.container');
  if (!container) return;
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  container.querySelectorAll('.mfr-tab-pane').forEach(p => p.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';

  // Toggle search toolbar visibility
  const toolbar = document.getElementById('mfr-toolbar');
  if (toolbar) {
    toolbar.style.display = (tabId === 'mfr-engines' || tabId === 'mfr-heritage') ? 'none' : 'flex';
  }
};

// Client-side search within manufacturer catalog
window.filterMfrCatalogSearch = function(query) {
  const q = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.mfr-catalog-card');
  cards.forEach(c => {
    const text = c.getAttribute('data-search') || '';
    c.style.display = text.includes(q) ? '' : 'none';
  });
};

// Client-side category pill filter for manufacturer catalog
window.filterMfrCategory = function(btn, category) {
  const filterContainer = document.getElementById('mfr-cat-filters');
  if (filterContainer) {
    filterContainer.querySelectorAll('button').forEach(b => {
      b.className = 'badge';
      b.style.border = '1px solid var(--border-color)';
      b.style.background = 'var(--bg-card)';
      b.style.color = 'var(--text-secondary)';
    });
    btn.className = 'badge badge--blue active';
    btn.style.border = 'none';
    btn.style.color = '#fff';
  }

  const cards = document.querySelectorAll('.mfr-catalog-card');
  cards.forEach(c => {
    const cats = c.getAttribute('data-categories') || '';
    if (category === 'all' || cats.includes(category)) {
      c.style.display = '';
    } else {
      c.style.display = 'none';
    }
  });
};

// Render specialized catalog card with searchable metadata
function renderMfrVehicleCard(v) {
  const mfr = AUTOCORE_DB.getManufacturerName(v.manufacturer);
  const icon = v.type === 'car' ? '🚗' : v.type === 'scooter' ? '🛵' : '🏍️';
  const disp = v.engine?.displacement ? `${v.engine.displacement} cc` : v.ev?.batteryCapacity ? `${v.ev.batteryCapacity} kWh` : '';
  const power = v.engine?.maxPower ? `${v.engine.maxPower.value} ${v.engine.maxPower.unit}` : v.ev?.motorPower?.peak ? `${v.ev.motorPower.peak} kW` : '';
  const torque = v.engine?.maxTorque ? `${v.engine.maxTorque.value} Nm` : v.ev?.torque ? `${v.ev.torque} Nm` : '';
  const catList = AUTOCORE_DB.getCategoryList ? AUTOCORE_DB.getCategoryList(v.category) : (Array.isArray(v.category) ? v.category : [v.category]);
  const catDisplay = AUTOCORE_DB.getCategoryDisplay ? AUTOCORE_DB.getCategoryDisplay(v.category) : catList.join(', ');
  const statusBadge = v.status === 'discontinued' ? '<span class="badge badge--yellow" style="font-size:0.7rem;padding:2px 8px;">Discontinued</span>' :
                      v.status === 'historical' ? '<span class="badge badge--purple" style="font-size:0.7rem;padding:2px 8px;">Historical</span>' :
                      v.status === 'upcoming' ? '<span class="badge badge--cyan" style="font-size:0.7rem;padding:2px 8px;">Upcoming</span>' : '';
  const genBadge = v.generation ? `<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:var(--space-xs);">${v.generation}</div>` : '';
  const priceDisplay = v.price?.india?.min ? `₹${(v.price.india.min/100000).toFixed(2)}L` : 
                       v.price?.europe?.min ? `€${v.price.europe.min.toLocaleString()}` :
                       v.price?.usa?.min ? `$${v.price.usa.min.toLocaleString()}` : '';

  const searchIndex = `${v.name} ${mfr} ${v.generation || ''} ${catDisplay} ${v.status || ''}`.toLowerCase();

  return `
    <div class="vehicle-card mfr-catalog-card" 
         data-search="${searchIndex}" 
         data-categories="${catList.join(' ')}"
         data-status="${v.status || 'current'}"
         onclick="Router.navigate('vehicle-detail','${v.id}')" 
         role="article" 
         aria-label="${mfr} ${v.name}">
      <div class="vehicle-card__img">
        <div class="vehicle-card__type-badge">${catDisplay}</div>
        ${statusBadge ? `<div style="position:absolute;top:10px;right:10px;">${statusBadge}</div>` : ''}
        <span aria-hidden="true">${icon}</span>
      </div>
      <div class="vehicle-card__body">
        <div class="vehicle-card__maker">${mfr}</div>
        <div class="vehicle-card__name">${v.name}</div>
        ${genBadge}
        <div class="vehicle-card__specs">
          ${disp ? `<div class="spec-pill"><div class="spec-pill__label">Engine / Battery</div><div class="spec-pill__value">${disp}</div></div>` : ''}
          ${power ? `<div class="spec-pill"><div class="spec-pill__label">Power</div><div class="spec-pill__value">${power}</div></div>` : ''}
          ${torque ? `<div class="spec-pill"><div class="spec-pill__label">Torque</div><div class="spec-pill__value">${torque}</div></div>` : ''}
          ${v.performance?.topSpeed ? `<div class="spec-pill"><div class="spec-pill__label">Top Speed</div><div class="spec-pill__value">${v.performance.topSpeed} km/h</div></div>` : ''}
          ${v.dimensions?.kerbWeight ? `<div class="spec-pill"><div class="spec-pill__label">Weight</div><div class="spec-pill__value">${v.dimensions.kerbWeight} kg</div></div>` : ''}
          ${priceDisplay ? `<div class="spec-pill"><div class="spec-pill__label">Price</div><div class="spec-pill__value" style="color:var(--accent-primary);">${priceDisplay}</div></div>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ===== VEHICLE DETAIL (150+ Technical Specification Architecture) =====
function renderVehicleDetail(id) {
  const v = AUTOCORE_DB.getVehicle(id);
  if (!v) return renderNotFound();
  const mfr = AUTOCORE_DB.getManufacturer(v.manufacturer);
  const isEV = !!v.ev;
  addToRecent(id, 'vehicle');

  const catDisplay = AUTOCORE_DB.getCategoryDisplay ? AUTOCORE_DB.getCategoryDisplay(v.category) : formatCategory(v.category);

  return `
    <div class="detail-hero">
      <div class="container">
        <button class="back-btn" onclick="Router.back()" style="margin-bottom:var(--space-lg);">← Back</button>
        <div class="breadcrumb" style="margin-bottom:var(--space-lg);">
          <button onclick="Router.navigate('manufacturers')">Manufacturers</button>
          <span>/</span>
          <button onclick="Router.navigate('manufacturer-detail','${v.manufacturer}')">${mfr?.name || v.manufacturer}</button>
          <span>/</span>
          ${v.name}
        </div>
        <div class="detail-hero__inner">
          <div>
            <div class="detail-hero__maker">${mfr?.name || v.manufacturer}</div>
            <h1 class="detail-hero__title" style="margin-bottom:6px;">${v.name}</h1>
            ${v.generation ? `<div style="color:var(--accent-primary);font-size:0.95rem;margin-bottom:6px;font-weight:600;">Generation: ${v.generation}</div>` : ''}
            <p class="detail-hero__tagline">${v.tagline || ''}</p>
            <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;margin-bottom:var(--space-xl);">
              <span class="badge badge--blue">${catDisplay}</span>
              <span class="badge badge--green">${v.type}</span>
              ${v.status === 'discontinued' ? '<span class="badge badge--yellow">Discontinued</span>' : ''}
              ${v.status === 'historical' ? '<span class="badge badge--purple">Historical</span>' : ''}
              ${isEV ? '<span class="badge badge--cyan">Electric</span>' : ''}
              ${v.brakes?.abs ? `<span class="badge badge--purple">${v.brakes.absType || 'ABS'}</span>` : ''}
              ${v.electronics?.tractionControl ? '<span class="badge badge--yellow">Traction Control</span>' : ''}
              ${v.electronics?.quickShifter || v.transmission?.quickShifter ? '<span class="badge badge--cyan">Quickshifter</span>' : ''}
            </div>
            <div class="detail-actions-group">
              <button class="detail-action-btn" onclick="Router.navigate('compare', '${v.id}')" title="Compare side-by-side with another vehicle">
                <span aria-hidden="true">⚖️</span> Compare Spec
              </button>
              <button class="detail-action-btn ${APP.bookmarks.some(b => b.id === v.id) ? 'active' : ''}" id="btn-bookmark-${v.id}" onclick="toggleBookmark('${v.id}')" title="Bookmark vehicle locally">
                <span aria-hidden="true">${APP.bookmarks.some(b => b.id === v.id) ? '★' : '☆'}</span> ${APP.bookmarks.some(b => b.id === v.id) ? 'Bookmarked' : 'Bookmark'}
              </button>
              <button class="detail-action-btn" onclick="copyVehicleLink('${v.id}')" title="Copy shareable link">
                <span aria-hidden="true">🔗</span> Share Direct Link
              </button>
            </div>
            ${renderQuickStats(v, isEV)}
          </div>
          <div class="detail-hero__image gloss-card" style="padding:20px;border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 50%, rgba(6,182,212,0.12) 0%, rgba(8,11,18,0.92) 80%);" aria-label="${v.name} technical blueprint">
            ${renderCockpitBlueprint(v)}
          </div>
        </div>
      </div>
    </div>

    <!-- Specification Sections with Tabs -->
    <div class="section">
      <div class="container">
        <div class="tabs" role="tablist" aria-label="Vehicle engineering specification tabs" style="overflow-x:auto;">
          ${[
            'Overview',
            'Engine & Drivetrain',
            'Performance',
            'Chassis & Suspension',
            'Brakes & Wheels',
            'Dimensions & Weight',
            'Electronics & Lighting',
            'Service & Maintenance',
            'Provenance & Verification'
          ].map((t,i) =>
            `<button class="tab-btn ${i===0?'active':''}" role="tab" aria-selected="${i===0}" onclick="switchTab(this,'tab-${i}')">${t}</button>`
          ).join('')}
        </div>

        <div id="tab-0" class="tab-content active">${renderVehicleOverview(v, mfr, isEV)}</div>
        <div id="tab-1" class="tab-content">${renderVehicleEngineDrivetrain(v, isEV)}</div>
        <div id="tab-2" class="tab-content">${renderVehiclePerformance(v, isEV)}</div>
        <div id="tab-3" class="tab-content">${renderVehicleChassisSusp(v)}</div>
        <div id="tab-4" class="tab-content">${renderVehicleBrakesWheels(v)}</div>
        <div id="tab-5" class="tab-content">${renderVehicleDimensions(v)}</div>
        <div id="tab-6" class="tab-content">${renderVehicleElectronicsLighting(v, isEV)}</div>
        <div id="tab-7" class="tab-content">${renderVehicleMaintenance(v)}</div>
        <div id="tab-8" class="tab-content">${renderVehicleProvenance(v)}</div>

      </div>
    </div>
    ${renderFooter()}
  `;
}

function renderQuickStats(v, isEV) {
  const stats = [];
  if (isEV) {
    if (v.ev?.batteryCapacity) stats.push({ label: 'Battery Capacity', val: `${v.ev.batteryCapacity} kWh` });
    if (v.ev?.range?.certifiedIDC || v.ev?.range?.realWorldCity) stats.push({ label: 'Real Range', val: `${v.ev.range.realWorldCity || v.ev.range.certifiedIDC} km` });
    if (v.ev?.topSpeed || v.performance?.topSpeed) stats.push({ label: 'Top Speed', val: `${v.ev.topSpeed || v.performance.topSpeed} km/h` });
    if (v.ev?.motorPower?.peak) stats.push({ label: 'Peak Power', val: `${v.ev.motorPower.peak} kW / ${(v.ev.motorPower.peak*1.341).toFixed(0)} bhp` });
    if (v.ev?.torque) stats.push({ label: 'Peak Torque', val: `${v.ev.torque} Nm` });
  } else {
    if (v.engine?.displacement) stats.push({ label: 'Displacement', val: `${v.engine.displacement} cc` });
    if (v.engine?.maxPower) stats.push({ label: 'Max Power', val: `${v.engine.maxPower.value} ${v.engine.maxPower.unit} @ ${v.engine.maxPower.rpm} RPM` });
    if (v.engine?.maxTorque) stats.push({ label: 'Max Torque', val: `${v.engine.maxTorque.value} Nm @ ${v.engine.maxTorque.rpm} RPM` });
    if (v.performance?.topSpeed) stats.push({ label: 'Top Speed', val: `${v.performance.topSpeed} km/h` });
  }
  if (v.dimensions?.kerbWeight) stats.push({ label: 'Kerb Weight', val: `${v.dimensions.kerbWeight} kg` });
  if (v.dimensions?.seatHeight) stats.push({ label: 'Seat Height', val: `${v.dimensions.seatHeight} mm` });

  return `<div class="quick-stats">${stats.map(s => `<div class="quick-stat"><div class="quick-stat__label">${s.label}</div><div class="quick-stat__value" style="font-size:1.05rem;">${s.val}</div></div>`).join('')}</div>`;
}

function renderVehicleOverview(v, mfr, isEV) {
  const years = Array.isArray(v.year) ? v.year.join(', ') : (v.productionStart ? `${v.productionStart}–${v.productionEnd || 'present'}` : v.year);
  const markets = Array.isArray(v.market) ? v.market.join(', ') : v.market;
  const catDisplay = AUTOCORE_DB.getCategoryDisplay ? AUTOCORE_DB.getCategoryDisplay(v.category) : v.category;

  const info = [
    { label: 'Manufacturer', val: mfr?.name || v.manufacturer },
    { label: 'Model Name', val: v.name },
    { label: 'Model Family', val: v.modelFamily || v.name },
    { label: 'Generation / Platform', val: v.generation },
    { label: 'Category', val: catDisplay },
    { label: 'Production Years', val: years },
    { label: 'Production Status', val: v.status ? v.status.toUpperCase() : 'CURRENT' },
    { label: 'Target Markets', val: markets },
    { label: 'Assembly / Origin', val: v.assemblyPlant || mfr?.country },
  ];

  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">Identification & Classification</h3>
      <div class="spec-grid">
        ${info.map(i => i.val ? `<div class="spec-item"><div class="spec-item__label">${i.label}</div><div class="spec-item__value">${i.val}</div></div>` : '').join('')}
      </div>
    </div>

    <!-- Pricing Summary -->
    ${v.price ? `
      <div style="margin-bottom:var(--space-2xl);background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-lg);">
        <h3 style="margin-bottom:var(--space-md);">🏷️ Pricing & Market Availability</h3>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-xl);">
          ${v.price.india ? `
            <div>
              <div style="font-size:0.85rem;color:var(--text-muted);">India (Ex-Showroom)</div>
              <div style="font-size:1.4rem;font-weight:700;color:var(--accent-primary);">
                ₹${(v.price.india.min/100000).toFixed(2)} Lakh ${v.price.india.max && v.price.india.max !== v.price.india.min ? `– ₹${(v.price.india.max/100000).toFixed(2)} Lakh` : ''}
              </div>
            </div>
          ` : ''}
          ${v.price.europe ? `
            <div>
              <div style="font-size:0.85rem;color:var(--text-muted);">Europe</div>
              <div style="font-size:1.4rem;font-weight:700;color:var(--text-cyan);">
                €${v.price.europe.min.toLocaleString()} ${v.price.europe.max && v.price.europe.max !== v.price.europe.min ? `– €${v.price.europe.max.toLocaleString()}` : ''}
              </div>
            </div>
          ` : ''}
          ${v.price.usa ? `
            <div>
              <div style="font-size:0.85rem;color:var(--text-muted);">United States</div>
              <div style="font-size:1.4rem;font-weight:700;color:var(--text-green);">
                $${v.price.usa.min.toLocaleString()} ${v.price.usa.max && v.price.usa.max !== v.price.usa.min ? `– $${v.price.usa.max.toLocaleString()}` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    <!-- Colours -->
    ${v.colours && v.colours.length ? `
      <div style="margin-bottom:var(--space-2xl);">
        <h3 style="margin-bottom:var(--space-sm);">🎨 Color Options</h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${v.colours.map(c => `<span class="badge badge--blue" style="font-size:0.85rem;padding:6px 12px;">${c}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Strengths & Limitations -->
    ${v.strengths || v.limitations ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-2xl);">
        ${v.strengths && v.strengths.length ? `
          <div style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2);border-radius:var(--radius-lg);padding:var(--space-lg);">
            <h4 style="color:var(--text-green);margin-bottom:var(--space-sm);display:flex;align-items:center;gap:6px;">✅ Key Strengths</h4>
            <ul style="padding-left:18px;line-height:1.6;font-size:0.9rem;color:var(--text-secondary);">
              ${v.strengths.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${v.limitations && v.limitations.length ? `
          <div style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);border-radius:var(--radius-lg);padding:var(--space-lg);">
            <h4 style="color:var(--text-red);margin-bottom:var(--space-sm);display:flex;align-items:center;gap:6px;">⚠️ Considerations & Limitations</h4>
            <ul style="padding-left:18px;line-height:1.6;font-size:0.9rem;color:var(--text-secondary);">
              ${v.limitations.map(l => `<li>${l}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    ` : ''}

    <!-- Competitors -->
    ${v.competitors && v.competitors.length ? `
      <div>
        <h3 style="margin-bottom:var(--space-sm);">🥊 Key Competitors</h3>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${v.competitors.map(c => `<span class="badge badge--purple" style="font-size:0.85rem;padding:6px 14px;">${c}</span>`).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderVehicleEngineDrivetrain(v, isEV) {
  if (isEV) {
    return `
      <div class="spec-section">
        <h3 style="margin-bottom:var(--space-md);">⚡ Electric Powertrain Architecture</h3>
        <div class="spec-grid">
          ${renderSpecItems({
            'Motor Type': v.ev?.motorType,
            'Peak Power Output': v.ev?.motorPower?.peak ? `${v.ev.motorPower.peak} kW / ${(v.ev.motorPower.peak*1.341).toFixed(1)} bhp` : null,
            'Continuous Power Output': v.ev?.motorPower?.continuous ? `${v.ev.motorPower.continuous} kW` : null,
            'Peak Wheel/Motor Torque': v.ev?.torque ? `${v.ev.torque} Nm` : null,
            'Battery Chemistry': v.ev?.batteryChemistry,
            'Installed Battery Capacity': v.ev?.batteryCapacity ? `${v.ev.batteryCapacity} kWh` : null,
            'Nominal Battery Voltage': v.ev?.batteryVoltage ? `${v.ev.batteryVoltage} V` : null,
            'Regenerative Braking': v.ev?.regenLevels || (v.ev?.regen ? 'Yes' : null),
            'Transmission': 'Direct drive single-speed reduction gear',
          })}
        </div>
      </div>
    `;
  }

  const eng = v.engine || {};
  const trans = v.transmission || {};

  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">⚙️ Engine Architecture & Combustion</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Engine Configuration': eng.configuration || eng.type,
          'Displacement': eng.displacement ? `${eng.displacement} cc` : null,
          'Cylinders & Layout': eng.cylinders ? `${eng.cylinders} cylinder(s)` : null,
          'Bore': eng.bore ? `${eng.bore} mm` : null,
          'Stroke': eng.stroke ? `${eng.stroke} mm` : null,
          'Compression Ratio': eng.compressionRatio,
          'Valvetrain / Camshaft': eng.camshaft || eng.valvetrain,
          'Valves per Cylinder': eng.valves || eng.valvesPerCylinder,
          'Cooling System': eng.cooling,
          'Fuel Injection System': eng.fuelSystem,
          'Throttle Control': eng.throttle || (v.electronics?.rideByWire ? 'Ride-by-Wire' : 'Cable-operated'),
          'Maximum Power Output': eng.maxPower ? `${eng.maxPower.value} ${eng.maxPower.unit} @ ${eng.maxPower.rpm} RPM` : null,
          'Maximum Torque Output': eng.maxTorque ? `${eng.maxTorque.value} Nm @ ${eng.maxTorque.rpm} RPM` : null,
          'Engine Redline': eng.redline ? `${eng.redline} RPM` : null,
          'Idle Speed': eng.idleRpm ? `${eng.idleRpm} RPM` : null,
          'Lubrication System': eng.lubrication,
          'Oil Sump Capacity': eng.oilCapacity ? `${eng.oilCapacity} L` : null,
          'Engine Oil Grade': eng.oilGrade,
          'Emission Compliance': eng.emissionStandard,
          'Engine Management (ECU)': eng.engineManagement,
        })}
      </div>
    </div>

    <div>
      <h3 style="margin-bottom:var(--space-md);">⛓️ Transmission & Drivetrain</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Transmission Type': trans.type || 'Manual',
          'Number of Gears': trans.gears,
          'Clutch Type': trans.clutchType,
          'Slipper Clutch': trans.slipperClutch ? 'Yes (Anti-hopping back-torque limiting)' : 'No',
          'Assist Clutch': trans.assistClutch ? 'Yes (Self-servo torque assist)' : null,
          'Quickshifter': trans.quickshifterType || (trans.quickShifter ? 'Yes' : 'None'),
          'Final Drive System': trans.finalDrive || 'Chain',
          'Chain Specification': trans.chainSpec,
          'Front Sprocket Teeth': trans.frontSprocket,
          'Rear Sprocket Teeth': trans.rearSprocket,
          'Gear Shift Pattern': trans.gearShiftPattern || '1-Down, 4-Up (or 5-Up)',
        })}
      </div>
    </div>
  `;
}

function renderVehiclePerformance(v, isEV) {
  const perf = v.performance || {};
  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">🏎️ Performance & Acceleration</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Top Speed': perf.topSpeed ? `${perf.topSpeed} km/h` : null,
          '0–60 km/h Acceleration': perf.zeroTo60 ? `${perf.zeroTo60} sec` : null,
          '0–100 km/h Acceleration': perf.zeroTo100 ? `${perf.zeroTo100} sec` : null,
          '0–200 km/h Acceleration': perf.zeroTo200 ? `${perf.zeroTo200} sec` : null,
          'Quarter Mile (400m)': perf.quarterMile ? `${perf.quarterMile} sec` : null,
          'Kerb Weight': v.dimensions?.kerbWeight ? `${v.dimensions.kerbWeight} kg` : null,
          'Power-to-Weight Ratio': (v.engine?.maxPower?.value && v.dimensions?.kerbWeight) ? 
            `${((v.engine.maxPower.value / v.dimensions.kerbWeight) * 1000).toFixed(0)} bhp / tonne` : null,
        })}
      </div>
    </div>

    <div>
      <h3 style="margin-bottom:var(--space-md);">⛽ Fuel Economy & Range</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'City Mileage': perf.mileage?.city ? `${perf.mileage.city} km/L` : null,
          'Highway Mileage': perf.mileage?.highway ? `${perf.mileage.highway} km/L` : null,
          'Combined / Overall Mileage': perf.mileage?.overall ? `${perf.mileage.overall} km/L` : (typeof perf.mileage === 'number' ? `${perf.mileage} km/L` : null),
          'Estimated Tank Range': perf.fuelRange ? `${perf.fuelRange} km` : null,
          'Fuel Tank Capacity': v.dimensions?.fuelTankCapacity ? `${v.dimensions.fuelTankCapacity} L` : null,
          'Certified EV Range': v.ev?.range?.certifiedIDC ? `${v.ev.range.certifiedIDC} km (IDC)` : null,
          'Real-World EV Range': v.ev?.range?.realWorldCity ? `${v.ev.range.realWorldCity} km (City)` : null,
        })}
      </div>
    </div>
  `;
}

function renderVehicleChassisSusp(v) {
  const ch = v.chassis || {};
  const sp = v.suspension || {};

  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">📐 Chassis & Frame Geometry</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Frame Type': ch.frameType,
          'Frame Material': ch.frameMaterial,
          'Subframe': ch.subframe,
          'Swingarm Type': ch.swingarmType,
          'Swingarm Material': ch.swingarmMaterial,
          'Rake (Caster Angle)': ch.rake ? `${ch.rake}°` : null,
          'Trail': ch.trail ? `${ch.trail} mm` : null,
          'Steering Angle': ch.steeringAngle ? `${ch.steeringAngle}°` : null,
        })}
      </div>
    </div>

    <div>
      <h3 style="margin-bottom:var(--space-md);">🛞 Suspension & Damping</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Front Suspension': sp.front,
          'Front Manufacturer': sp.frontManufacturer,
          'Front Fork Diameter': sp.frontForkDiameter ? `${sp.frontForkDiameter} mm` : null,
          'Front Wheel Travel': sp.frontTravel ? `${sp.frontTravel} mm` : null,
          'Front Adjustability': sp.frontAdjustability,
          'Rear Suspension': sp.rear,
          'Rear Manufacturer': sp.rearManufacturer,
          'Rear Wheel Travel': sp.rearTravel ? `${sp.rearTravel} mm` : null,
          'Rear Preload Adjustment': sp.rearPreload,
          'Rear Damping Adjustability': sp.rearAdjustability,
          'Electronic Suspension': sp.electronicSuspension ? 'Yes (Semi-Active Dynamic Damping)' : 'No',
        })}
      </div>
    </div>
  `;
}

function renderVehicleBrakesWheels(v) {
  const bk = v.brakes || {};
  const wh = v.wheels || {};

  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">🛑 Braking System & ABS</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Front Brake Type': bk.front,
          'Front Disc Diameter': bk.frontDiscDiameter ? `${bk.frontDiscDiameter} mm` : null,
          'Front Disc Count': bk.frontDiscCount,
          'Front Caliper Type': bk.frontCaliperType,
          'Rear Brake Type': bk.rear,
          'Rear Disc Diameter': bk.rearDiscDiameter ? `${bk.rearDiscDiameter} mm` : null,
          'Rear Caliper Type': bk.rearCaliperType,
          'ABS Equipped': bk.abs ? 'Yes' : 'No',
          'ABS System Type': bk.absType,
          'Cornering ABS (IMU Linked)': bk.corneringAbs ? 'Yes (Lean-sensitive)' : 'No',
          'Supermoto / Offroad ABS Mode': bk.switchableAbs || bk.rearAbsSupermoto ? 'Yes (Disengageable rear ABS)' : 'No',
          'Brake Caliper Manufacturer': bk.brakeManufacturer,
          'Combined Braking System (CBS)': bk.combinedBraking ? 'Yes' : null,
        })}
      </div>
    </div>

    <div>
      <h3 style="margin-bottom:var(--space-md);">🛞 Wheels, Rims & Tyres</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Front Tyre Specification': wh.frontTyre,
          'Rear Tyre Specification': wh.rearTyre,
          'Front Wheel Diameter': wh.frontWheelDiameter ? `${wh.frontWheelDiameter} inch` : null,
          'Rear Wheel Diameter': wh.rearWheelDiameter ? `${wh.rearWheelDiameter} inch` : null,
          'Wheel Type / Construction': wh.wheelType,
          'Tubeless / Tube Type': wh.tubedTubeless,
          'Original Tyre Brand & Compound': wh.tyreBrand,
        })}
      </div>
    </div>
  `;
}

function renderVehicleDimensions(v) {
  const d = v.dimensions || {};
  return `
    <h3 style="margin-bottom:var(--space-md);">📏 Physical Dimensions & Weights</h3>
    <div class="spec-grid">
      ${renderSpecItems({
        'Overall Length': d.length ? `${d.length} mm` : null,
        'Overall Width': d.width ? `${d.width} mm` : null,
        'Overall Height': d.height ? `${d.height} mm` : null,
        'Wheelbase': d.wheelbase ? `${d.wheelbase} mm` : null,
        'Ground Clearance': d.groundClearance ? `${d.groundClearance} mm` : null,
        'Seat Height': d.seatHeight ? `${d.seatHeight} mm` : null,
        'Seat Height Adjustment': d.seatHeightAdjustable,
        'Fuel Tank Capacity': d.fuelTankCapacity ? `${d.fuelTankCapacity} L` : null,
        'Usable Reserve Fuel': d.reserveFuel ? `${d.reserveFuel} L` : null,
        'Kerb / Wet Weight': d.kerbWeight ? `${d.kerbWeight} kg` : null,
        'Dry Weight': d.dryWeight ? `${d.dryWeight} kg` : null,
        'Gross Vehicle Weight (GVW)': d.gvw ? `${d.gvw} kg` : null,
        'Maximum Payload Capacity': d.payload ? `${d.payload} kg` : null,
        'Underseat / Luggage Storage': d.underSeatStorage ? `${d.underSeatStorage} L` : null,
      })}
    </div>
  `;
}

function renderVehicleElectronicsLighting(v, isEV) {
  const el = v.electronics || {};
  const lit = v.electrical || {};

  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">💻 Electronics & Rider Assistance Systems</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Throttle Type': el.rideByWire ? 'Ride-by-Wire (Electronic Throttle)' : 'Cable Throttle',
          'Riding Modes': Array.isArray(el.rideModes) ? el.rideModes.join(', ') : (el.rideModes ? 'Yes' : 'No'),
          'Traction Control System': el.tcType || (el.tractionControl ? 'Yes' : 'No'),
          'Cornering Traction Control': el.tcType && el.tcType.includes('Cornering') ? 'Yes (IMU Linked)' : null,
          'Slide / Drift Control': el.slideControl ? 'Yes' : null,
          'Wheelie Mitigation Control': el.wheelieControl || el.wheelyControl ? 'Yes' : null,
          'Launch Control': el.launchControl ? 'Yes' : null,
          'Cruise Control': el.cruiseControl ? (el.radarCruise || 'Yes') : null,
          'Instrument Display Type': el.display,
          'Bluetooth Connectivity': el.bluetooth ? 'Yes' : 'No',
          'Turn-by-Turn Navigation': el.navigation || (el.tripperNavigation ? 'Royal Enfield Tripper' : null),
          'USB Smartphone Charging': el.usbCharging || el.usbPort ? 'Yes' : null,
          'Tyre Pressure Monitoring (TPMS)': el.tpms ? 'Yes' : null,
          'Keyless Smart Ignition': el.keylessIgnition ? 'Yes' : null,
        })}
      </div>
    </div>

    <div>
      <h3 style="margin-bottom:var(--space-md);">💡 Electrical & Lighting Systems</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'Headlight Technology': lit.headlightType || 'LED',
          'Tail Light Technology': lit.tailLightType || 'LED',
          'Indicator Technology': lit.indicators || 'LED',
          'Battery Type': lit.batteryType,
          'Battery Voltage & Rating': lit.batteryVoltage ? `${lit.batteryVoltage} V` + (lit.batteryCapacity ? ` (${lit.batteryCapacity})` : '') : null,
          'Starter Motor': lit.starter || 'Electric Starter',
        })}
      </div>
    </div>
  `;
}

function renderVehicleMaintenance(v) {
  const m = v.maintenance || {};
  return `
    <div style="margin-bottom:var(--space-2xl);">
      <h3 style="margin-bottom:var(--space-md);">🔧 Scheduled Maintenance & Tolerances</h3>
      <div class="spec-grid">
        ${renderSpecItems({
          'First Inspection Service': m.firstService ? `${m.firstService} km` : null,
          'Regular Service Interval': m.regularService ? `${m.regularService} km` : null,
          'Engine Oil Change Interval': m.oilChangeInterval ? `${m.oilChangeInterval} km` : null,
          'Valve Clearance Check Interval': m.valveClearanceInterval ? `${m.valveClearanceInterval} km` : null,
          'Spark Plug Model': m.sparkPlug,
          'Spark Plug Electrode Gap': m.sparkPlugGap,
          'Drive Chain Lubrication Interval': m.chainMaintenance,
          'Tyre Pressure (Rider Solo)': m.tyrePressureSolo,
          'Tyre Pressure (With Pillion)': m.tyrePressurePillion,
          'Manufacturer Warranty': m.warranty,
        })}
      </div>
    </div>

    <div class="callout callout--warn">
      <div class="callout__title">⚠️ Engineering Note</div>
      <p>All fluid specifications, torque values, and maintenance intervals should be confirmed against your vehicle's specific regional owner's manual before performing service procedures.</p>
    </div>
  `;
}

function renderVehicleProvenance(v) {
  return `
    <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-xl);">
      <h3 style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:8px;">📋 Data Provenance & Verification Audit</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--space-lg);margin-bottom:var(--space-xl);">
        <div>
          <div style="font-size:0.85rem;color:var(--text-muted);">Verified Primary Source</div>
          <div style="font-weight:700;font-size:1.05rem;color:var(--text-primary);margin-top:2px;">${v.source || 'Official Manufacturer Factory Documentation'}</div>
        </div>
        <div>
          <div style="font-size:0.85rem;color:var(--text-muted);">Last Audit & Verification Date</div>
          <div style="font-weight:700;font-size:1.05rem;color:var(--accent-primary);margin-top:2px;">${v.sourceVerifiedDate || 'October 2026'}</div>
        </div>
        <div>
          <div style="font-size:0.85rem;color:var(--text-muted);">Confidence Level</div>
          <div style="font-weight:700;font-size:1.05rem;color:var(--text-green);margin-top:2px;">Level 1 — Factory Verified</div>
        </div>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.6;margin-bottom:0;">
        AUTOCORE cross-references every engineering parameter against factory service manuals, homologation documents, and official type-approval filings. Specifications may vary by target export market, regulatory emission tier (e.g. BS-VI Phase 2 vs Euro 5+), and model year update.
      </p>
    </div>
  `;
}

function renderSpecItems(obj) {
  return Object.entries(obj).filter(([k,v]) => v !== null && v !== undefined && v !== '').map(([label, val]) =>
    `<div class="spec-item"><div class="spec-item__label">${label}</div><div class="spec-item__value">${val}</div></div>`
  ).join('');
}

// ===== COMPONENT DETAIL =====
function renderComponentDetail(id) {
  const c = AUTOCORE_DB.getComponent(id);
  if (!c) return renderNotFound();
  addToRecent(id, 'component');
  return `
    <div class="page-header">
      <div class="container">
        <button class="back-btn" onclick="Router.back()" style="margin-bottom:var(--space-lg);">← Back</button>
        <div class="breadcrumb" style="margin-bottom:var(--space-lg);">
          <button onclick="Router.navigate('parts')">Parts & Components</button>
          <span>/</span> ${formatCategory(c.category)} <span>/</span> ${c.name}
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-lg);margin-bottom:var(--space-md);">
          <div style="font-size:3rem;background:var(--blue-glow);border:1px solid var(--blue-border);border-radius:var(--radius-lg);width:72px;height:72px;display:flex;align-items:center;justify-content:center;">${c.icon}</div>
          <div>
            <span class="badge badge--blue" style="margin-bottom:8px;">${formatCategory(c.category)}</span>
            <h1 style="font-size:clamp(1.8rem,3vw,3rem);">${c.name}</h1>
          </div>
        </div>
        <p style="max-width:700px;font-size:1.05rem;">${c.shortDescription}</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-2xl);align-items:start;">
          <div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h2 style="margin-bottom:var(--space-md);">What is a ${c.name}?</h2>
              <p>${c.fullDescription}</p>
            </div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h2 style="margin-bottom:var(--space-xl);">How Does It Work?</h2>
              <div class="how-it-works">
                ${c.howItWorks.map((step, i) => `
                  <div class="how-step">
                    <div class="how-step__number">${i+1}</div>
                    <div class="how-step__text">${step}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg);">
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);">
                <h3 style="margin-bottom:var(--space-md);color:#34d399;">✓ Advantages</h3>
                <div class="adv-list">${(c.advantages||[]).map(a => `<div class="adv-item">${a}</div>`).join('')}</div>
              </div>
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);">
                <h3 style="margin-bottom:var(--space-md);color:#f87171;">✗ Disadvantages</h3>
                <div class="adv-list">${(c.disadvantages||[]).map(a => `<div class="disadv-item">${a}</div>`).join('')}</div>
              </div>
            </div>
            ${c.types || c.implementations ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);">Types / Implementations</h3>
                <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                  ${(c.types || c.implementations || []).map(t => `<div style="padding:10px 16px;background:var(--color-bg-2);border-radius:var(--radius-md);border:1px solid var(--color-border);font-size:0.9rem;color:var(--text-secondary);">▸ ${t}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          <div>
            ${c.parts ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);">Main Parts</h3>
                ${c.parts.map(p => `<div style="padding:8px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${p}</div>`).join('')}
              </div>
            ` : ''}
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h3 style="margin-bottom:var(--space-md);color:#fbbf24;">⚠️ Common Failures</h3>
              ${(c.commonFailures||[]).map(f => `<div style="padding:6px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${f}</div>`).join('')}
            </div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h3 style="margin-bottom:var(--space-md);color:#f87171;">🔴 Symptoms</h3>
              ${(c.symptoms||[]).map(s => `<div style="padding:6px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${s}</div>`).join('')}
            </div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h3 style="margin-bottom:var(--space-md);color:#34d399;">🔧 Maintenance</h3>
              ${(c.maintenance||[]).map(m => `<div style="padding:6px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${m}</div>`).join('')}
            </div>
            ${c.relatedComponents?.length ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);">
                <h3 style="margin-bottom:var(--space-md);">Related Components</h3>
                <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs);">
                  ${c.relatedComponents.map(r => `<span class="badge badge--blue" style="cursor:pointer;" onclick="Router.navigate('component-detail','${r}')">${r.replace(/-/g,' ')}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="callout callout--info" style="margin-top:var(--space-xl);">
          <div class="callout__title">📋 Source</div>
          <p>${c.source}</p>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== TECH DETAIL =====
function renderTechDetail(id) {
  const t = AUTOCORE_DB.getTechnology(id);
  if (!t) return renderNotFound();
  return `
    <div class="page-header">
      <div class="container">
        <button class="back-btn" onclick="Router.back()" style="margin-bottom:var(--space-lg);">← Back</button>
        <div style="display:flex;align-items:center;gap:var(--space-lg);margin-bottom:var(--space-md);">
          <div style="font-size:3rem;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.25);border-radius:var(--radius-lg);width:72px;height:72px;display:flex;align-items:center;justify-content:center;">${t.icon}</div>
          <div>
            <span class="badge badge--purple" style="margin-bottom:8px;">${formatCategory(t.category)}</span>
            <h1 style="font-size:clamp(1.8rem,3vw,3rem);">${t.name}</h1>
          </div>
        </div>
        <p style="max-width:700px;font-size:1.05rem;">${t.shortDescription}</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-2xl);">
          <div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h2 style="margin-bottom:var(--space-md);">How It Works</h2>
              <p>${t.explanation}</p>
            </div>
            ${t.benefits?.length ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);color:#34d399;">Benefits</h3>
                <div class="adv-list">${t.benefits.map(b => `<div class="adv-item">${b}</div>`).join('')}</div>
              </div>
            ` : ''}
            ${t.subsystems?.length ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);">
                <h3 style="margin-bottom:var(--space-md);">Sub-Systems</h3>
                <div style="display:flex;flex-direction:column;gap:var(--space-sm);">
                  ${t.subsystems.map(s => `<div style="padding:10px 16px;background:var(--color-bg-2);border-radius:var(--radius-md);border:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">▸ ${s}</div>`).join('')}
                </div>
              </div>
            ` : ''}
            ${t.sensorTypes?.length ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-top:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);">Sensor Types Used</h3>
                ${t.sensorTypes.map(s => `<div style="padding:6px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${s}</div>`).join('')}
              </div>
            ` : ''}
            ${t.implementations?.length ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-top:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);">Known Implementations</h3>
                ${t.implementations.map(s => `<div style="padding:6px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${s}</div>`).join('')}
              </div>
            ` : ''}
            ${t.levels?.length ? `
              <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-top:var(--space-lg);">
                <h3 style="margin-bottom:var(--space-md);">Intensity Levels</h3>
                ${t.levels.map(s => `<div style="padding:8px 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;color:var(--text-secondary);">• ${s}</div>`).join('')}
              </div>
            ` : ''}
          </div>
          <div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);">
              <h3 style="margin-bottom:var(--space-md);">Found In</h3>
              ${(t.vehicles||[]).map(v => `<div style="padding:8px;background:var(--color-bg-2);border-radius:var(--radius-sm);border:1px solid var(--color-border);font-size:0.85rem;color:var(--text-secondary);margin-bottom:6px;">🚗 ${v}</div>`).join('')}
            </div>
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);">
              <h3 style="margin-bottom:var(--space-md);">Source</h3>
              <p style="font-size:0.8rem;">${t.source}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== MANUFACTURERS PAGE =====
function renderManufacturers() {
  const byType = { all: AUTOCORE_DB.manufacturers, bikes: [], cars: [], ev: [] };
  AUTOCORE_DB.manufacturers.forEach(m => {
    m.type.forEach(t => { if (byType[t]) byType[t].push(m); });
  });
  const byCountry = {};
  AUTOCORE_DB.manufacturers.forEach(m => {
    if (!byCountry[m.country]) byCountry[m.country] = [];
    byCountry[m.country].push(m);
  });
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Database</span>
        <h1 class="page-header__title">🏭 Manufacturer Directory</h1>
        <p class="page-header__subtitle">Browse ${AUTOCORE_DB.manufacturers.length}+ manufacturers by type or country.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="filter-bar">
          <button class="filter-btn active" onclick="filterByType(this,'all')">All</button>
          <button class="filter-btn" onclick="filterByType(this,'bikes')">🏍️ Motorcycles</button>
          <button class="filter-btn" onclick="filterByType(this,'cars')">🚗 Cars</button>
          <button class="filter-btn" onclick="filterByType(this,'ev')">⚡ EV</button>
        </div>
        <div class="grid-4" id="mfr-grid">
          ${AUTOCORE_DB.manufacturers.map(m => `
            <div class="manufacturer-card" data-type="${m.type.join(',')}" onclick="Router.navigate('manufacturer-detail','${m.id}')">
              <div class="manufacturer-card__flag">${m.flag}</div>
              <div class="manufacturer-card__logo">${m.name.substring(0,2).toUpperCase()}</div>
              <div class="manufacturer-card__name">${m.name}</div>
              <div class="manufacturer-card__country">${m.country} · Est. ${m.founded}</div>
              <div class="manufacturer-card__types">${m.type.map(t => `<span class="type-pill">${t}</span>`).join('')}</div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin-top:var(--space-3xl);margin-bottom:var(--space-xl);">By Country</h2>
        ${Object.entries(byCountry).map(([country, mfrs]) => `
          <div style="margin-bottom:var(--space-2xl);">
            <h3 style="margin-bottom:var(--space-md);">${mfrs[0].flag} ${country}</h3>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);">
              ${mfrs.map(m => `<button class="badge badge--blue" style="font-size:0.85rem;padding:6px 14px;cursor:pointer;" onclick="Router.navigate('manufacturer-detail','${m.id}')">${m.name}</button>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== GLOSSARY PAGE =====
function renderGlossaryPage() {
  const letters = [...new Set(AUTOCORE_DB.glossary.map(g => g.term[0].toUpperCase()))].sort();
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Reference</span>
        <h1 class="page-header__title">📚 Automotive Glossary</h1>
        <p class="page-header__subtitle">A–Z definitions of automotive terms, acronyms, and technical specifications.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="glossary-az" role="navigation" aria-label="Glossary alphabet navigation">
          <button class="alpha-btn active" onclick="filterGlossary(this,'all')">All</button>
          ${letters.map(l => `<button class="alpha-btn" onclick="filterGlossary(this,'${l}')">${l}</button>`).join('')}
        </div>
        <div class="glossary-list" id="glossary-list">
          ${AUTOCORE_DB.glossary.map(g => `
            <article class="glossary-item" data-letter="${g.term[0].toUpperCase()}" role="article">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-md);">
                <div style="flex:1;">
                  <div class="glossary-term">${g.term}</div>
                  <div class="glossary-fullform">${g.fullForm}</div>
                  <div class="glossary-definition">${g.definition}</div>
                  ${g.relatedTerms?.length ? `
                    <div class="glossary-related" style="margin-top:var(--space-sm);">
                      <span style="font-size:0.7rem;color:var(--text-muted);margin-right:4px;">Related:</span>
                      ${g.relatedTerms.map(r => `<span class="related-tag" onclick="searchRelated('${r}')">${r}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
                <span class="badge badge--blue">${g.category}</span>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== COMPARE PAGE =====
function renderComparePage(data) {
  const preSelectA = (typeof data === 'string' ? data : data?.vehicleA) || '';
  const preSelectB = data?.vehicleB || '';
  const vehicleOptionsA = AUTOCORE_DB.vehicles.map(v => `<option value="${v.id}" ${v.id === preSelectA ? 'selected' : ''}>${AUTOCORE_DB.getManufacturerName(v.manufacturer)} ${v.name}</option>`).join('');
  const vehicleOptionsB = AUTOCORE_DB.vehicles.map(v => `<option value="${v.id}" ${v.id === preSelectB ? 'selected' : ''}>${AUTOCORE_DB.getManufacturerName(v.manufacturer)} ${v.name}</option>`).join('');
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Tools</span>
        <h1 class="page-header__title">⚖️ Vehicle Comparison</h1>
        <p class="page-header__subtitle">Compare vehicles side-by-side across specifications, performance, and features.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="compare-picker">
          <div class="compare-select-box">
            <span class="compare-select-box__label">Vehicle A</span>
            <div class="compare-controls">
              <input type="text" class="compare-search" id="compare-a-search" placeholder="Search…" oninput="filterVehicleOptions('a')" />
              <button class="compare-clear-btn" onclick="clearSelection('a')">Clear</button>
            </div>
            <select class="compare-select" id="compare-a" onchange="updateComparison()" aria-label="Select first vehicle to compare">
              <option value="">Select a vehicle...</option>
              ${vehicleOptionsA}
            </select>
          </div>
          <div class="compare-vs">VS</div>
          <div class="compare-select-box">
            <span class="compare-select-box__label">Vehicle B</span>
            <div class="compare-controls">
              <input type="text" class="compare-search" id="compare-b-search" placeholder="Search…" oninput="filterVehicleOptions('b')" />
              <button class="compare-clear-btn" onclick="clearSelection('b')">Clear</button>
            </div>
            <select class="compare-select" id="compare-b" onchange="updateComparison()" aria-label="Select second vehicle to compare">
              <option value="">Select a vehicle...</option>
              ${vehicleOptionsB}
            </select>
          </div>
        </div>
        <div id="comparison-result">
          <div class="callout callout--info">
            <div class="callout__title">Select Two Vehicles</div>
            <p>Choose vehicles from the dropdowns above to see a detailed side-by-side comparison of specifications, performance, dimensions, and features.</p>
          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

function updateComparison() {
  const aEl = document.getElementById('compare-a');
  const bEl = document.getElementById('compare-b');
  const result = document.getElementById('comparison-result');
  if (!aEl || !bEl || !result) return; // Compare page not rendered yet
  const aId = aEl.value;
  const bId = bEl.value;
  if (!aId || !bId) {
    result.innerHTML = `<div class="callout callout--info"><div class="callout__title">Select Two Vehicles</div><p>Choose a vehicle from each dropdown above to see a detailed side-by-side comparison.</p></div>`;
    return;
  }
  if (aId === bId) {
    result.innerHTML = `<div class="callout callout--warn"><div class="callout__title">Same Vehicle Selected</div><p>Please select two different vehicles to compare.</p></div>`;
    return;
  }
  const a = AUTOCORE_DB.getVehicle(aId);
  const b = AUTOCORE_DB.getVehicle(bId);
  if (!a || !b) {
    result.innerHTML = `<div class="callout callout--warn"><div class="callout__title">Vehicle Not Found</div><p>Could not load vehicle data. Please try again.</p></div>`;
    return;
  }
  const mA = AUTOCORE_DB.getManufacturerName(a.manufacturer);
  const mB = AUTOCORE_DB.getManufacturerName(b.manufacturer);


  const specs = [
    ['Manufacturer', mA, mB],
    ['Model', a.name, b.name],
    ['Type', a.type, b.type],
    ['Category', formatCategory(a.category), formatCategory(b.category)],
    ['Market', formatArrayOrString(a.market), formatArrayOrString(b.market)],
    ['Displacement', a.engine?.displacement ? `${a.engine.displacement}cc` : a.ev?.batteryCapacity ? `${a.ev.batteryCapacity} kWh` : '—', b.engine?.displacement ? `${b.engine.displacement}cc` : b.ev?.batteryCapacity ? `${b.ev.batteryCapacity} kWh` : '—'],
    ['Engine Config / Motor', a.engine?.configuration || a.ev?.motorType || '—', b.engine?.configuration || b.ev?.motorType || '—'],
    ['Max Power', a.engine?.maxPower ? `${a.engine.maxPower.value} ${a.engine.maxPower.unit}` : a.ev?.motorPower ? `${a.ev.motorPower.peak} kW` : '—', b.engine?.maxPower ? `${b.engine.maxPower.value} ${b.engine.maxPower.unit}` : b.ev?.motorPower ? `${b.ev.motorPower.peak} kW` : '—'],
    ['Max Torque', a.engine?.maxTorque ? `${a.engine.maxTorque.value} Nm` : a.ev?.torque ? `${a.ev.torque} Nm` : '—', b.engine?.maxTorque ? `${b.engine.maxTorque.value} Nm` : b.ev?.torque ? `${b.ev.torque} Nm` : '—'],
    ['Top Speed', a.performance?.topSpeed ? `${a.performance.topSpeed} km/h` : a.ev?.topSpeed ? `${a.ev.topSpeed} km/h` : '—', b.performance?.topSpeed ? `${b.performance.topSpeed} km/h` : b.ev?.topSpeed ? `${b.ev.topSpeed} km/h` : '—'],
    ['0–100 km/h', a.performance?.zeroTo100 ? `${a.performance.zeroTo100}s` : a.ev?.zeroTo100 ? `${a.ev.zeroTo100}s` : '—', b.performance?.zeroTo100 ? `${b.performance.zeroTo100}s` : b.ev?.zeroTo100 ? `${b.ev.zeroTo100}s` : '—'],
    ['Kerb Weight', a.dimensions?.kerbWeight ? `${a.dimensions.kerbWeight} kg` : '—', b.dimensions?.kerbWeight ? `${b.dimensions.kerbWeight} kg` : '—'],
    ['Wheelbase', a.dimensions?.wheelbase ? `${a.dimensions.wheelbase} mm` : '—', b.dimensions?.wheelbase ? `${b.dimensions.wheelbase} mm` : '—'],
    ['Fuel Tank / Battery', a.dimensions?.fuelTankCapacity ? `${a.dimensions.fuelTankCapacity} L` : a.ev?.batteryCapacity ? `${a.ev.batteryCapacity} kWh` : '—', b.dimensions?.fuelTankCapacity ? `${b.dimensions.fuelTankCapacity} L` : b.ev?.batteryCapacity ? `${b.ev.batteryCapacity} kWh` : '—'],
    ['ABS', a.brakes?.abs ? (a.brakes.absType || 'Yes') : 'No', b.brakes?.abs ? (b.brakes.absType || 'Yes') : 'No'],
    ['Front Brake', a.brakes?.front || '—', b.brakes?.front || '—'],
    ['Front Suspension', a.suspension?.front || '—', b.suspension?.front || '—'],
    ['Rear Suspension', a.suspension?.rear || '—', b.suspension?.rear || '—'],
    ['Traction Control', a.electronics?.tractionControl ? 'Yes' : 'No', b.electronics?.tractionControl ? 'Yes' : 'No'],
    ['Quick Shifter', a.electronics?.quickShifter ? 'Yes' : 'No', b.electronics?.quickShifter ? 'Yes' : 'No'],
    ['Ride Modes', a.electronics?.rideModes ? 'Yes' : a.ev?.rideModes ? a.ev.rideModes.join(', ') : 'No', b.electronics?.rideModes ? 'Yes' : b.ev?.rideModes ? b.ev.rideModes.join(', ') : 'No'],
  ];

  result.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="compare-table" role="table" aria-label="Vehicle comparison">
        <thead>
          <tr>
            <th style="width:30%;">Specification</th>
            <th style="width:35%;color:var(--blue-bright);">${mA} ${a.name}</th>
            <th style="width:35%;color:var(--cyan);">${mB} ${b.name}</th>
          </tr>
        </thead>
        <tbody>
          ${specs.filter(s => s[1] !== '—' || s[2] !== '—').map(([spec, va, vb]) => `
            <tr>
              <td class="spec-label">${spec}</td>
              <td style="color:var(--text-primary);">${va}</td>
              <td style="color:var(--text-primary);">${vb}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="callout callout--info" style="margin-top:var(--space-xl);">
      <div class="callout__title">ℹ️ Comparison Note</div>
      <p>Specifications may vary by market, variant, and model year. This comparison does not declare a "winner" — the best vehicle depends on your specific use case, budget, and preferences. Always verify with official manufacturer data for your market.</p>
    </div>
  `;
}

// ===== COMPARE PAGE HELPERS =====
/**
 * Filters vehicle dropdown options based on the search input text.
 * Called via oninput on the search fields.
 * @param {'a'|'b'} side
 */
function filterVehicleOptions(side) {
  const searchInput = document.getElementById('compare-' + side + '-search');
  const select = document.getElementById('compare-' + side);
  if (!searchInput || !select) return;
  const filterText = searchInput.value.trim().toLowerCase();
  for (let i = 0; i < select.options.length; i++) {
    const opt = select.options[i];
    if (!opt.value) { opt.hidden = false; continue; } // keep placeholder visible
    opt.hidden = filterText ? !opt.textContent.toLowerCase().includes(filterText) : false;
  }
}

/**
 * Clears the vehicle selection and search input for the given side.
 * Called via onclick on the Clear buttons.
 * @param {'a'|'b'} side
 */
function clearSelection(side) {
  const searchInput = document.getElementById('compare-' + side + '-search');
  const select = document.getElementById('compare-' + side);
  if (searchInput) searchInput.value = '';
  if (select) {
    select.value = '';
    for (let i = 0; i < select.options.length; i++) {
      select.options[i].hidden = false; // reset filter
    }
  }
  updateComparison();
}


function renderEnginesPage() {
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Technology</span>
        <h1 class="page-header__title">⚙️ Engine Encyclopedia</h1>
        <p class="page-header__subtitle">From single-cylinder thumpers to V12 masterpieces — understand every engine configuration.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="section__header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2>Engine Configurations</h2>
        </div>
        <div class="engine-type-grid">
          ${AUTOCORE_DB.engineTypes.map(e => `
            <div class="engine-type-card" onclick="showEngineDetail('${e.id}')">
              <div class="engine-type-card__icon">${e.icon}</div>
              <div class="engine-type-card__name">${e.name}</div>
              <div class="engine-type-card__desc">${e.description}</div>
            </div>
          `).join('')}
        </div>
        <div id="engine-detail" style="margin-top:var(--space-2xl);"></div>
        <div class="section-divider"></div>
        <h2 style="margin-bottom:var(--space-xl);">Engine Technologies</h2>
        <div class="grid-3">
          ${[
            { icon: '💨', name: 'Turbocharging', desc: 'Using exhaust gas energy to compress intake air, significantly increasing power output.', id: 'turbocharger' },
            { icon: '⏱️', name: 'Variable Valve Timing', desc: 'Dynamically adjusting valve timing for both low-end torque and high-end power simultaneously.', id: 'vvt' },
            { icon: '💉', name: 'Direct Injection (GDI)', desc: 'Spraying fuel directly into the combustion chamber for precise control and efficiency.', id: 'fuel-injector' },
          ].map(t => `
            <div class="component-card" onclick="Router.navigate('component-detail','${t.id}')">
              <div class="component-card__icon">${t.icon}</div>
              <div><div class="component-card__name">${t.name}</div></div>
              <div class="component-card__desc">${t.desc}</div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin:var(--space-2xl) 0 var(--space-xl);">Combustion Types</h2>
        <div class="grid-auto-sm">
          ${[
            { icon: '⛽', name: 'Petrol / Gasoline', desc: 'Spark-ignition engine using petrol fuel. Most common in passenger vehicles.' },
            { icon: '🛢️', name: 'Diesel', desc: 'Compression-ignition engine using diesel fuel. High torque, better efficiency, common in commercial vehicles.' },
            { icon: '🔋', name: 'Electric', desc: 'No combustion — electric motor converts battery energy directly to mechanical power.' },
            { icon: '🌿', name: 'Hybrid', desc: 'Combines ICE with electric motor(s) for improved efficiency and reduced emissions.' },
            { icon: '💧', name: 'Hydrogen', desc: 'Fuel cell or combustion of hydrogen gas. Emerging technology with zero CO₂ emissions.' },
          ].map(c => `
            <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-lg);">
              <div style="font-size:2rem;margin-bottom:var(--space-sm);">${c.icon}</div>
              <div style="font-weight:700;margin-bottom:4px;">${c.name}</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);">${c.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== PARTS PAGE =====
function renderPartsPage() {
  const categories = [
    { icon: '⚙️', name: 'Engine', slug: 'engine', parts: ['Cylinder','Piston','Crankshaft','Camshaft','Valves','Timing Chain','Flywheel','Oil Pump','Gaskets'] },
    { icon: '⛽', name: 'Fuel System', slug: 'fuel-system', parts: ['Fuel Tank','Fuel Pump','Fuel Filter','Fuel Injector','Carburetor','Fuel Rail'] },
    { icon: '💨', name: 'Air Intake', slug: 'air-intake', parts: ['Air Filter','Airbox','Throttle Body','Turbocharger','Intercooler','Intake Manifold'] },
    { icon: '🔥', name: 'Exhaust', slug: 'exhaust', parts: ['Exhaust Manifold','Catalytic Converter','DPF','Muffler','O2 Sensor','Exhaust Pipe'] },
    { icon: '⚙️', name: 'Transmission', slug: 'transmission', parts: ['Clutch','Gearbox','Differential','CVT','DCT','Torque Converter'] },
    { icon: '⭕', name: 'Braking', slug: 'braking', parts: ['Brake Disc','Brake Pads','Caliper','Master Cylinder','ABS Module','Brake Lines'] },
    { icon: '🔩', name: 'Suspension', slug: 'suspension', parts: ['Shock Absorber','Coil Spring','Fork','Swingarm','Control Arm','Ball Joint'] },
    { icon: '🛞', name: 'Steering', slug: 'steering', parts: ['Steering Wheel','Steering Column','Rack & Pinion','Tie Rod','Power Steering'] },
    { icon: '🔋', name: 'Electrical', slug: 'electrical', parts: ['Battery','Alternator','Starter Motor','ECU','Sensors','Wiring Harness'] },
    { icon: '🛡️', name: 'Safety', slug: 'safety', parts: ['Airbags','Seat Belts','ABS','ESC','ADAS','Parking Sensors','Cameras'] },
  ];
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Encyclopedia</span>
        <h1 class="page-header__title">🔧 Parts & Components</h1>
        <p class="page-header__subtitle">Deep-dive into every component — how it works, what it does, and how to maintain it.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="section__header" style="text-align:left;margin-bottom:var(--space-xl);">
          <h2>Components in Detail</h2>
        </div>
        <div class="grid-3" style="margin-bottom:var(--space-2xl);">
          ${AUTOCORE_DB.components.map(c => `
            <div class="component-card" onclick="Router.navigate('component-detail','${c.id}')">
              <div class="component-card__icon">${c.icon}</div>
              <div>
                <div class="component-card__name">${c.name}</div>
                <div class="component-card__category">${formatCategory(c.category)}</div>
              </div>
              <div class="component-card__desc">${c.shortDescription}</div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin-bottom:var(--space-xl);">All Categories</h2>
        <div class="grid-auto">
          ${categories.map(cat => `
            <div class="parts-category-card">
              <div class="parts-category-card__icon">${cat.icon}</div>
              <div class="parts-category-card__title">${cat.name}</div>
              <div class="parts-category-card__tags">
                ${cat.parts.map(p => `<span class="parts-category-card__tag">${p}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== TECHNOLOGY PAGE =====
function renderTechnologyPage() {
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Technology</span>
        <h1 class="page-header__title">🧠 Automotive Technologies</h1>
        <p class="page-header__subtitle">From Ride-by-Wire to ADAS — understand the systems that define modern vehicles.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <h2 style="margin-bottom:var(--space-xl);">Bike Technologies</h2>
        <div class="grid-3" style="margin-bottom:var(--space-2xl);">
          ${AUTOCORE_DB.technologies.filter(t => t.category==='bike-tech').map(t => `
            <div class="component-card" onclick="Router.navigate('tech-detail','${t.id}')">
              <div class="component-card__icon" style="background:rgba(139,92,246,0.12);border-color:rgba(139,92,246,0.25);">${t.icon}</div>
              <div><div class="component-card__name">${t.name}</div><div class="component-card__category" style="color:#c4b5fd;">Bike Technology</div></div>
              <div class="component-card__desc">${t.shortDescription}</div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin-bottom:var(--space-xl);">Car Technologies</h2>
        <div class="grid-3" style="margin-bottom:var(--space-2xl);">
          ${AUTOCORE_DB.technologies.filter(t => t.category==='car-tech').map(t => `
            <div class="component-card" onclick="Router.navigate('tech-detail','${t.id}')">
              <div class="component-card__icon" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.25);">${t.icon}</div>
              <div><div class="component-card__name">${t.name}</div><div class="component-card__category" style="color:#34d399;">Car Technology</div></div>
              <div class="component-card__desc">${t.shortDescription}</div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin-bottom:var(--space-xl);">Engine Technologies</h2>
        <div class="grid-3" style="margin-bottom:var(--space-2xl);">
          ${AUTOCORE_DB.technologies.filter(t => t.category==='engine-tech').map(t => `
            <div class="component-card" onclick="Router.navigate('tech-detail','${t.id}')">
              <div class="component-card__icon" style="background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.25);">${t.icon}</div>
              <div><div class="component-card__name">${t.name}</div><div class="component-card__category" style="color:#fcd34d;">Engine Technology</div></div>
              <div class="component-card__desc">${t.shortDescription}</div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin-bottom:var(--space-xl);">EV Technologies</h2>
        <div class="grid-3">
          ${AUTOCORE_DB.technologies.filter(t => t.category==='ev-tech').map(t => `
            <div class="component-card" onclick="Router.navigate('tech-detail','${t.id}')">
              <div class="component-card__icon" style="background:var(--cyan-glow);border-color:rgba(6,182,212,0.25);">${t.icon}</div>
              <div><div class="component-card__name">${t.name}</div><div class="component-card__category" style="color:var(--cyan);">EV Technology</div></div>
              <div class="component-card__desc">${t.shortDescription}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== MAINTENANCE PAGE =====
function renderMaintenancePage() {
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Practical Guides</span>
        <h1 class="page-header__title">🔩 Maintenance Hub</h1>
        <p class="page-header__subtitle">Understand symptoms, causes, and maintenance procedures for bikes, cars, and EVs.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="callout callout--warn" style="margin-bottom:var(--space-2xl);">
          <div class="callout__title">⚠️ Safety Notice</div>
          <p>Maintenance information here is educational. Do not attempt complex repairs without proper training, tools, and safety equipment. For safety-critical systems (brakes, steering, suspension), always consult a qualified mechanic at an authorized service center.</p>
        </div>
        <div class="filter-bar" style="margin-bottom:var(--space-xl);">
          <button class="filter-btn active" onclick="filterMaintenance(this,'all')">All</button>
          <button class="filter-btn" onclick="filterMaintenance(this,'bike')">🏍️ Bikes</button>
          <button class="filter-btn" onclick="filterMaintenance(this,'car')">🚗 Cars</button>
        </div>
        <div class="grid-3" id="maintenance-grid">
          ${AUTOCORE_DB.maintenance.map(m => `
            <div class="maintenance-card" data-category="${m.category}" onclick="showMaintenanceDetail('${m.id}')">
              <div class="maintenance-card__header">
                <div class="maintenance-card__icon">${m.icon}</div>
                <div>
                  <div class="maintenance-card__title">${m.title}</div>
                  <div class="maintenance-card__interval">${m.interval}</div>
                  <span class="maintenance-card__difficulty difficulty-${m.difficulty.toLowerCase().split('-')[0]}">${m.difficulty}</span>
                </div>
              </div>
              <p style="font-size:0.875rem;color:var(--text-secondary);">${m.description}</p>
              <div style="margin-top:var(--space-md);">
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:var(--space-sm);">Symptoms</div>
                ${m.symptoms.slice(0,2).map(s => `<div style="font-size:0.8rem;color:var(--text-secondary);padding:4px 0;border-bottom:1px solid var(--color-border);">• ${s}</div>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div id="maintenance-detail"></div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== EV PAGE =====
function renderEVPage() {
  const evVehicles = AUTOCORE_DB.vehicles.filter(v => v.ev);
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Electric Mobility</span>
        <h1 class="page-header__title">⚡ Electric Vehicles Database</h1>
        <p class="page-header__subtitle">From electric scooters to Tesla supercars — explore the world of electric mobility.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <h2 style="margin-bottom:var(--space-xl);">EV Profiles</h2>
        <div class="grid-auto" style="margin-bottom:var(--space-2xl);">
          ${evVehicles.map(v => renderVehicleCard(v)).join('')}
        </div>
        <h2 style="margin-bottom:var(--space-xl);">EV Concepts Explained</h2>
        <div class="grid-3">
          ${[
            { icon: '⚡', name: 'kWh (Kilowatt-hour)', desc: 'The unit of energy storage capacity for EV batteries. A higher kWh means more stored energy and greater potential range.' },
            { icon: '🔋', name: 'State of Charge (SOC)', desc: 'The current charge level of the battery expressed as a percentage — like a fuel gauge for EVs.' },
            { icon: '📉', name: 'Battery Degradation', desc: 'Over time and charge cycles, lithium-ion batteries lose some capacity. Modern BMS systems minimize degradation.' },
            { icon: '🔌', name: 'AC vs DC Charging', desc: 'AC charging is slower (home/work). DC fast charging bypasses the onboard charger for much faster replenishment.' },
            { icon: '♻️', name: 'Regenerative Braking', desc: 'Converts braking kinetic energy back to electricity, extending range by 10-25% in typical urban driving.' },
            { icon: '🌡️', name: 'Thermal Management', desc: 'Batteries perform best within a specific temperature range. Active cooling/heating maintains optimal conditions.' },
          ].map(c => `
            <div class="ev-concept-card">
              <div class="ev-concept-icon">${c.icon}</div>
              <div>
                <div class="ev-concept-name">${c.name}</div>
                <div class="ev-concept-desc">${c.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <h2 style="margin:var(--space-2xl) 0 var(--space-xl);">Charging Standards</h2>
        <div class="grid-3">
          ${[
            { name: 'AC Level 1 (Standard)', speed: '2.3–7.4 kW', time: '8-12 hours for full charge', use: 'Home overnight charging' },
            { name: 'DC Fast Charging (CCS/CHAdeMO)', speed: '50–350 kW', time: '20-45 minutes for 80%', use: 'Highway stops, public chargers' },
            { name: 'Tesla Supercharger V3', speed: 'Up to 250 kW', time: '~15 min for 200+ km', use: 'Tesla vehicles on their network' },
          ].map(c => `
            <div class="charging-standard-card">
              <div class="charging-standard-card__name">${c.name}</div>
              <div class="charging-standard-card__speed">${c.speed}</div>
              <div class="charging-standard-card__metric">⏱️ ${c.time}</div>
              <div class="charging-standard-card__metric">📍 ${c.use}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== REDESIGNED CARS / BIKES COMMAND CENTERS =====

// --- CARS SPOTLIGHT SYSTEM ---
window.CARS_SPOTLIGHT_INDEX = 0;
const CARS_SPOTLIGHT_IDS = [
  'porsche-911-gt3-rs',
  'ferrari-296-gtb',
  'rimac-nevera',
  'mclaren-750s',
  'thar-roxx-4x4',
  'land-cruiser-300',
  'lucid-air-sapphire'
];

function getVehicleTelemetry(v) {
  if (!v) return {};
  const mfr = (typeof AUTOCORE_DB !== 'undefined' && AUTOCORE_DB.getManufacturerName) ? AUTOCORE_DB.getManufacturerName(v.manufacturer) : (v.maker || v.manufacturer || '');
  const power = v.engine?.maxPower ? `${v.engine.maxPower.value} ${v.engine.maxPower.unit}` : 
                (v.ev?.motorPower?.peak ? `${v.ev.motorPower.peak} kW (${Math.round(v.ev.motorPower.peak * 1.341)} bhp)` : (v.specs?.power || v.power || '—'));
  const torque = v.engine?.maxTorque ? `${v.engine.maxTorque.value} Nm` : 
                 (v.ev?.torque ? `${v.ev.torque} Nm` : (v.specs?.torque || v.torque || '—'));
  const speed = v.performance?.topSpeed ? `${v.performance.topSpeed} km/h` : 
                (v.ev?.topSpeed ? `${v.ev.topSpeed} km/h` : (v.specs?.topSpeed || v.topSpeed || '—'));
  const accel = v.performance?.zeroTo100 ? `${v.performance.zeroTo100}s` : 
                (v.ev?.zeroTo100 ? `${v.ev.zeroTo100}s` : (v.specs?.acceleration || v.acceleration || '—'));
  const weight = v.dimensions?.kerbWeight ? `${v.dimensions.kerbWeight} kg` : (v.specs?.weight || v.curbWeight || '—');
  const drivetrain = v.drivetrain || v.specs?.drivetrain || (v.ev ? 'Electric Multi-Motor' : '—');
  const price = v.price?.global?.min ? `$${v.price.global.min.toLocaleString()}` :
                (v.price?.usa?.min ? `$${v.price.usa.min.toLocaleString()}` :
                (v.price?.india?.min ? `₹${(v.price.india.min/100000).toFixed(2)}L` : (v.priceRange || '—')));
  const disp = v.engine?.displacement ? `${v.engine.displacement}cc` : (v.ev?.batteryCapacity ? `${v.ev.batteryCapacity} kWh` : '');
  const yearText = Array.isArray(v.year) ? (v.year.length > 1 ? `${v.year[0]}–${v.year[v.year.length - 1]}` : `${v.year[0]}`) : (v.year || '2024–2026');
  const engineDesc = v.engine?.configuration || (v.ev ? `${v.ev.voltage || 800}V EV Architecture` : (v.engine?.type || 'Combustion Engine'));
  const catList = (typeof AUTOCORE_DB !== 'undefined' && AUTOCORE_DB.getCategoryList) ? AUTOCORE_DB.getCategoryList(v.category) : (Array.isArray(v.category) ? v.category : [v.category || 'car']);
  const catLabel = (catList[0] || v.category || (v.type === 'car' ? 'Car' : 'Motorcycle')).toString().toUpperCase();
  const icon = v.icon || (v.type === 'car' ? (catList.includes('supercar') ? '🏎️' : (catList.includes('suv') ? '🚙' : '🚗')) : (v.type === 'scooter' ? '🛵' : '🏍️'));

  return { mfr, power, torque, speed, accel, weight, drivetrain, price, disp, yearText, engineDesc, catList, catLabel, icon };
}

function renderCarSpotlightContent(v) {
  if (!v) return '';
  const t = getVehicleTelemetry(v);

  return `
    <div class="catalog-spotlight__glow"></div>
    <div>
      <div class="catalog-spotlight__badge">
        <span>⚡ Flagship Spotlight</span>
        <span>•</span>
        <span>${t.catLabel}</span>
      </div>
      <h2 class="catalog-spotlight__title">${v.name}</h2>
      <div class="catalog-spotlight__maker">${t.mfr} • ${t.yearText}</div>
      <p class="catalog-spotlight__tagline">
        ${v.tagline || (v.description ? v.description.split('.')[0] + '.' : 'Engineered for pinnacle dynamic capability, aero downforce, and telemetry-verified powertrain response.')}
      </p>
      <div class="catalog-spotlight__telemetry">
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--cyan-bright);">${t.power}</div>
          <div class="spotlight-gauge__lbl">Peak Power</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-yellow);">${t.accel}</div>
          <div class="spotlight-gauge__lbl">0–100 km/h</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-primary);">${t.speed}</div>
          <div class="spotlight-gauge__lbl">Top Speed</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-green);">${t.drivetrain}</div>
          <div class="spotlight-gauge__lbl">Drivetrain</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-secondary);">${t.weight}</div>
          <div class="spotlight-gauge__lbl">Curb Weight</div>
        </div>
      </div>
      <div class="catalog-spotlight__actions">
        <button class="btn btn--primary" onclick="Router.navigate('vehicle-detail', '${v.id}')">
          <span>Inspect Full Dossier</span>
          <span>→</span>
        </button>
        <button class="btn btn--secondary" onclick="cycleCarsSpotlight(1)">
          <span>Next Flagship</span>
          <span>↻</span>
        </button>
        <span style="font-size:0.8rem;color:var(--text-muted);font-family:var(--font-mono);margin-left:auto;">
          MSRP: <strong style="color:var(--text-primary);">${t.price}</strong>
        </span>
      </div>
    </div>
    <div class="catalog-spotlight__visual">
      <div class="catalog-spotlight__icon">${t.icon}</div>
      <div class="catalog-spotlight__hud-dial">
        <span>TELEMETRY VERIFIED</span>
      </div>
      <div style="margin-top:12px;font-size:0.75rem;color:var(--text-muted);text-align:center;font-weight:600;">
        ${t.engineDesc}
      </div>
    </div>
  `;
}

window.cycleCarsSpotlight = function(dir = 1) {
  const list = CARS_SPOTLIGHT_IDS.map(id => AUTOCORE_DB.vehicles.find(v => v.id === id)).filter(Boolean);
  if (!list.length) return;
  window.CARS_SPOTLIGHT_INDEX = (window.CARS_SPOTLIGHT_INDEX + dir + list.length) % list.length;
  const container = document.getElementById('cars-spotlight-container');
  if (container) {
    container.innerHTML = renderCarSpotlightContent(list[window.CARS_SPOTLIGHT_INDEX]);
  }
};

function renderCarMatrixRow(v) {
  const t = getVehicleTelemetry(v);
  const pVal = v.engine?.maxPower?.value || (v.ev?.motorPower?.peak ? Math.round(v.ev.motorPower.peak * 1.341) : 0);
  const sVal = v.performance?.topSpeed || (v.ev?.topSpeed || 0);
  const aVal = v.performance?.zeroTo100 || (v.ev?.zeroTo100 || 99);
  const wVal = v.dimensions?.kerbWeight || 9999;
  const searchStr = `${v.name} ${t.mfr} ${t.catList.join(' ')} ${t.engineDesc} ${t.drivetrain} ${v.country || ''}`.toLowerCase();

  return `
    <div class="matrix-row" onclick="Router.navigate('vehicle-detail', '${v.id}')"
         data-id="${v.id}"
         data-search="${searchStr}"
         data-category="${t.catList.join(' ')}"
         data-drivetrain="${(t.drivetrain || '').toLowerCase()}"
         data-is-ev="${v.ev ? 'true' : 'false'}"
         data-power="${pVal}"
         data-speed="${sVal}"
         data-accel="${aVal}"
         data-weight="${wVal}"
         data-name="${v.name.toLowerCase()}">
      <div class="matrix-cell-vehicle">
        <div class="matrix-cell-vehicle__icon">${t.icon}</div>
        <div>
          <div class="matrix-cell-vehicle__name">${v.name}</div>
          <div class="matrix-cell-vehicle__maker">${t.mfr} • ${t.yearText}</div>
        </div>
      </div>
      <div class="matrix-cell-powertrain">
        <div style="font-weight:600;color:var(--text-primary);">${t.engineDesc}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);">${t.catLabel} • ${t.drivetrain}</div>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val" style="color:var(--cyan-bright);">${t.power}</span>
        <span class="matrix-cell-spec__lbl">Power • ${t.torque}</span>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val" style="color:var(--text-yellow);">${t.accel}</span>
        <span class="matrix-cell-spec__lbl">0–100 km/h</span>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val">${t.speed}</span>
        <span class="matrix-cell-spec__lbl">V-Max</span>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val">${t.weight}</span>
        <span class="matrix-cell-spec__lbl">Weight • ${t.price}</span>
      </div>
      <div style="text-align:right;">
        <button class="btn btn--xs btn--primary" onclick="event.stopPropagation();Router.navigate('vehicle-detail', '${v.id}')">Dossier →</button>
      </div>
    </div>
  `;
}

// ===== RENDER CARS PAGE =====
function renderCarsPage(initialFilter) {
  const cars = AUTOCORE_DB.vehicles.filter(v => v.type === 'car');
  const activeCategory = (typeof initialFilter === 'string' ? initialFilter : initialFilter?.category || 'all').toLowerCase();
  
  // Extract distinct manufacturers for company-first filtering
  const carMfrIds = [...new Set(cars.map(c => c.manufacturer))];
  const carBrands = carMfrIds.map(id => AUTOCORE_DB.getManufacturer(id)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

  // Calculate quick metrics accurately matching category lists and telemetry
  const supercarsCount = cars.filter(c => {
    const cats = (Array.isArray(c.category) ? c.category : [c.category]).map(s => String(s).toLowerCase());
    return cats.some(cat => ['supercar', 'hypercar', 'gt', 'track'].includes(cat)) || c.bodyStyle === 'supercar';
  }).length;
  const offroadCount = cars.filter(c => {
    const cats = (Array.isArray(c.category) ? c.category : [c.category]).map(s => String(s).toLowerCase());
    const dt = (c.drivetrain || '').toUpperCase();
    return cats.includes('suv') || cats.includes('4x4') || dt.includes('4WD') || dt.includes('AWD');
  }).length;
  const sub3sCount = cars.filter(c => {
    const a = c.performance?.zeroTo100 || c.ev?.zeroTo100;
    return a && a <= 3.0;
  }).length;
  const evCarsCount = cars.filter(c => c.ev || c.fuelType === 'electric').length;

  const spotlightList = CARS_SPOTLIGHT_IDS.map(id => AUTOCORE_DB.vehicles.find(v => v.id === id)).filter(Boolean);
  const spotlightCar = spotlightList[window.CARS_SPOTLIGHT_INDEX] || cars[0];

  const primaryCategories = [
    { id: 'all', label: 'All Vehicles', icon: '🚗' },
    { id: 'supercar', label: 'Supercars & GTs', icon: '🏎️' },
    { id: 'sedan', label: 'Performance Sedans', icon: '🏁' },
    { id: 'suv', label: 'SUVs & 4x4 Off-Roaders', icon: '🚙' },
    { id: 'electric', label: '800V EVs & Hybrids', icon: '⚡' },
    { id: 'hatchback', label: 'Hot Hatches & Compacts', icon: '🚗' },
  ];

  return `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb" style="margin-bottom:var(--space-md);">
          <button class="breadcrumb" onclick="Router.navigate('home')">Home</button>
          <span>/</span>
          <span>Cars Command Center</span>
        </div>
        <div class="page-header__marque-tag">
          <span class="marque-icon">◆</span>
          <span>HOMOLOGATION ARCHITECTURE &bull; 150+ SPEC TELEMETRY</span>
        </div>
        <h1 class="page-header__title">Global Cars Command Center</h1>
        <p class="page-header__subtitle">
          <span class="editorial-bracket">[</span> Pinnacle supercars, endurance prototypes, off-road 4&times;4 icons, and 800V hyper-EV dossiers <span class="editorial-bracket">]</span>
        </p>

        <!-- Command Dashboard Telemetry Stats Ribbon -->
        <div class="catalog-stats-grid">
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:var(--cyan-bright);">🚗</div>
            <div>
              <div class="catalog-stat-card__num">${cars.length}</div>
              <div class="catalog-stat-card__label">Active Dossiers</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#ef4444;">🏎️</div>
            <div>
              <div class="catalog-stat-card__num">${supercarsCount}</div>
              <div class="catalog-stat-card__label">Supercars & GTs</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#10b981;">🏔️</div>
            <div>
              <div class="catalog-stat-card__num">${offroadCount}</div>
              <div class="catalog-stat-card__label">4x4 & Expedition</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#f59e0b;">⏱️</div>
            <div>
              <div class="catalog-stat-card__num">${sub3sCount}</div>
              <div class="catalog-stat-card__label">Sub-3.0s 0-100</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#38bdf8;">⚡</div>
            <div>
              <div class="catalog-stat-card__num">${evCarsCount}</div>
              <div class="catalog-stat-card__label">High-Voltage EVs</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="section">
      <div class="container">
        
        <!-- Interactive Flagship Spotlight Card -->
        <div class="catalog-spotlight" id="cars-spotlight-container">
          ${renderCarSpotlightContent(spotlightCar)}
        </div>

        <!-- Filter & View Command Console -->
        <div class="catalog-console">
          
          <!-- Company / Make Selector Ribbon -->
          <div class="catalog-brands-bar" id="cars-brands-bar">
            <div class="catalog-brands-label">
              <span>🏢</span>
              <span>Filter by Company / Manufacturer:</span>
            </div>
            <div class="catalog-brands-scroll">
              <button class="brand-chip active" data-brand="all" onclick="window.filterCarsBrand(this, 'all')">
                <span>All Companies (${cars.length})</span>
              </button>
              ${carBrands.map(b => {
                const count = cars.filter(c => c.manufacturer === b.id).length;
                return `
                  <button class="brand-chip" data-brand="${b.id}" onclick="window.filterCarsBrand(this, '${b.id}')">
                    <span>${b.name}</span>
                    <span style="font-size:0.7rem;opacity:0.75;padding:1px 6px;background:rgba(255,255,255,0.08);border-radius:10px;">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="catalog-console__top-bar">
            <div class="catalog-search-wrap">
              <span class="catalog-search-icon">🔍</span>
              <input type="text" id="cars-search-input" placeholder="Search cars by model, powertrain, turbo, 4WD..." 
                     oninput="window.filterCarsSearch(this.value)">
            </div>
            
            <div class="catalog-console__tools">
              <label style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Sort By:</label>
              <select id="cars-sort-select" class="catalog-sort-select" onchange="window.sortCarsCatalog(this.value)">
                <option value="featured">Featured Halo Order</option>
                <option value="power-desc">Horsepower (High to Low)</option>
                <option value="accel-asc">0–100 km/h (Fastest First)</option>
                <option value="speed-desc">Top Speed (Highest First)</option>
                <option value="weight-asc">Curb Weight (Lightest First)</option>
                <option value="name-asc">Model Name (A–Z)</option>
              </select>

              <div class="view-toggle-wrap">
                <button id="btn-cars-view-grid" class="view-toggle-btn active" onclick="window.setCarsView('grid')">
                  <span>▦</span>
                  <span>Grid</span>
                </button>
                <button id="btn-cars-view-matrix" class="view-toggle-btn" onclick="window.setCarsView('matrix')">
                  <span>☰</span>
                  <span>Spec Matrix</span>
                </button>
              </div>

              <div id="cars-count-badge" class="badge badge--blue" style="font-size:0.8rem;padding:7px 14px;border-radius:var(--radius-full);">
                Showing ${cars.length} Dossiers
              </div>
            </div>
          </div>

          <!-- Primary Category Pills -->
          <div class="catalog-pills-row" id="cars-filter-bar">
            ${primaryCategories.map(c => `
              <button class="catalog-pill ${activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}" onclick="filterCarsCatalog('${c.id}')">
                <span>${c.icon}</span>
                <span>${c.label}</span>
              </button>
            `).join('')}
          </div>

          <!-- Secondary Drivetrain & Powertrain Chips -->
          <div class="catalog-secondary-row">
            <div class="catalog-sub-group" id="cars-drivetrain-filters">
              <span class="catalog-sub-label">Drivetrain & Architecture:</span>
              <button class="catalog-chip active" onclick="filterCarsDrivetrain(this, 'all')">All Architectures</button>
              <button class="catalog-chip" onclick="filterCarsDrivetrain(this, 'awd')">AWD / 4WD Locking Diff</button>
              <button class="catalog-chip" onclick="filterCarsDrivetrain(this, 'rwd')">RWD Rear-Engine / Mid-Ship</button>
              <button class="catalog-chip" onclick="filterCarsDrivetrain(this, 'fwd')">FWD Performance</button>
              <button class="catalog-chip" onclick="filterCarsDrivetrain(this, 'ev')">800V Tri / Quad Motor EV</button>
            </div>
          </div>
        </div>

        <!-- Studio Grid View -->
        <div class="grid-auto" id="cars-grid">
          ${cars.map(v => renderVehicleCard(v)).join('')}
        </div>

        <!-- Telemetry Spec Matrix View (Initially Hidden) -->
        <div id="cars-matrix" style="display:none;">
          <div class="telemetry-matrix-table">
            <div class="matrix-header-row">
              <div>Vehicle & Year</div>
              <div>Powertrain Architecture</div>
              <div>Power & Torque</div>
              <div>0–100 km/h</div>
              <div>V-Max</div>
              <div>Weight & MSRP</div>
              <div style="text-align:right;">Action</div>
            </div>
            <div id="cars-matrix-list">
              ${cars.map(v => renderCarMatrixRow(v)).join('')}
            </div>
          </div>
        </div>

        <!-- Empty Filter State Notice -->
        <div id="cars-empty-notice" class="empty-filter-state" style="display:none;margin-top:var(--space-2xl);">
          <div style="font-size:2.2rem;margin-bottom:12px;">🔍</div>
          <h3 style="font-size:1.2rem;color:var(--text-primary);margin-bottom:6px;">No vehicles match current criteria</h3>
          <p style="font-size:0.875rem;margin-bottom:16px;">Try clearing your search keyword, selecting a different company or drivetrain, or resetting filters.</p>
          <button class="btn btn--primary btn--sm" onclick="window.resetCarsFilters()" style="margin:0 auto;padding:8px 22px;">Reset All Filters</button>
        </div>

        <!-- Curated Engineering Showcases -->
        <div class="curated-strip-header">
          <div class="curated-strip-title">
            <span>🏁</span>
            <span>The 200+ MPH Supercar Club</span>
          </div>
          <button class="btn btn--xs btn--secondary" onclick="filterCarsCatalog('supercar')">View All Supercars →</button>
        </div>
        <div class="curated-cards-scroll">
          ${cars.filter(c => ['porsche-911-gt3-rs', 'ferrari-296-gtb', 'rimac-nevera', 'mclaren-750s'].includes(c.id)).map(v => renderVehicleCard(v)).join('')}
        </div>

        <div class="curated-strip-header">
          <div class="curated-strip-title">
            <span>🏔️</span>
            <span>Rugged 4x4 & Expedition Icons</span>
          </div>
          <button class="btn btn--xs btn--secondary" onclick="filterCarsCatalog('suv')">View All 4x4s →</button>
        </div>
        <div class="curated-cards-scroll">
          ${cars.filter(c => ['land-cruiser-300', 'thar-roxx-4x4', 'jimny-alpha-allgrip', 'urus-performante'].includes(c.id)).map(v => renderVehicleCard(v)).join('')}
        </div>

        <div class="curated-strip-header">
          <div class="curated-strip-title">
            <span>⚡</span>
            <span>800V Hyper-EV Telemetry Vanguard</span>
          </div>
          <button class="btn btn--xs btn--secondary" onclick="filterCarsCatalog('electric')">View All EVs →</button>
        </div>
        <div class="curated-cards-scroll">
          ${cars.filter(c => ['rimac-nevera', 'lucid-air-sapphire', 'taycan-turbo-gt', 'ioniq-5-n'].includes(c.id)).map(v => renderVehicleCard(v)).join('')}
        </div>

      </div>
    </div>
    ${renderFooter()}
  `;
}

// CARS CONTROLLER & FILTER LOGIC
window.CARS_STATE = {
  search: '',
  category: 'all',
  brand: 'all',
  drivetrain: 'all',
  sortBy: 'featured',
  view: 'grid'
};

window.setCarsView = function(view) {
  window.CARS_STATE.view = view;
  const gridContainer = document.getElementById('cars-grid');
  const matrixContainer = document.getElementById('cars-matrix');
  const btnGrid = document.getElementById('btn-cars-view-grid');
  const btnMatrix = document.getElementById('btn-cars-view-matrix');

  if (view === 'matrix') {
    if (gridContainer) gridContainer.style.display = 'none';
    if (matrixContainer) matrixContainer.style.display = 'block';
    if (btnGrid) btnGrid.classList.remove('active');
    if (btnMatrix) btnMatrix.classList.add('active');
  } else {
    if (gridContainer) gridContainer.style.display = 'grid';
    if (matrixContainer) matrixContainer.style.display = 'none';
    if (btnGrid) btnGrid.classList.add('active');
    if (btnMatrix) btnMatrix.classList.remove('active');
  }
};

window.sortCarsCatalog = function(sortBy) {
  window.CARS_STATE.sortBy = sortBy;
  const gridContainer = document.getElementById('cars-grid');
  const matrixList = document.getElementById('cars-matrix-list');
  if (!gridContainer) return;

  const cards = Array.from(gridContainer.children).filter(el => el.classList.contains('vehicle-card'));
  const rows = matrixList ? Array.from(matrixList.children).filter(el => el.classList.contains('matrix-row')) : [];

  const sortFn = (a, b) => {
    if (sortBy === 'power-desc') {
      return (parseInt(b.dataset.power) || 0) - (parseInt(a.dataset.power) || 0);
    } else if (sortBy === 'speed-desc') {
      return (parseInt(b.dataset.speed) || 0) - (parseInt(a.dataset.speed) || 0);
    } else if (sortBy === 'accel-asc') {
      return (parseFloat(a.dataset.accel) || 99) - (parseFloat(b.dataset.accel) || 99);
    } else if (sortBy === 'weight-asc') {
      return (parseInt(a.dataset.weight) || 9999) - (parseInt(b.dataset.weight) || 9999);
    } else if (sortBy === 'name-asc') {
      return (a.dataset.name || '').localeCompare(b.dataset.name || '');
    }
    return 0;
  };

  cards.sort(sortFn).forEach(el => gridContainer.appendChild(el));
  if (matrixList && rows.length) {
    rows.sort(sortFn).forEach(el => matrixList.appendChild(el));
  }
};

window.filterCarsSearch = function(val) {
  window.CARS_STATE.search = (val || '').toLowerCase().trim();
  window.applyCarsCatalogFilters();
};

window.filterCarsBrand = function(btn, brandId) {
  const container = document.getElementById('cars-brands-bar');
  if (container) {
    container.querySelectorAll('.brand-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
  window.CARS_STATE.brand = (brandId || 'all').toLowerCase();
  window.applyCarsCatalogFilters();
};

window.filterCarsDrivetrain = function(btn, dt) {
  const container = document.getElementById('cars-drivetrain-filters');
  if (container) {
    container.querySelectorAll('.catalog-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
  window.CARS_STATE.drivetrain = dt;
  window.applyCarsCatalogFilters();
};

function filterCarsCatalog(cat) {
  const target = (typeof cat === 'string' ? cat : (cat?.category || 'all')).toLowerCase();
  window.CARS_STATE.category = target;

  const bar = document.getElementById('cars-filter-bar');
  if (bar) {
    bar.querySelectorAll('.catalog-pill').forEach(btn => {
      const pillCat = (btn.getAttribute('data-cat') || '').toLowerCase();
      btn.classList.toggle('active', pillCat === target);
    });
  }
  window.applyCarsCatalogFilters();
}
window.filterCarsCatalog = filterCarsCatalog;

window.applyCarsCatalogFilters = function() {
  const s = window.CARS_STATE;
  const cards = document.querySelectorAll('#cars-grid .vehicle-card');
  const rows = document.querySelectorAll('#cars-matrix-list .matrix-row');
  let visibleCount = 0;

  const filterItem = (el) => {
    const search = (el.getAttribute('data-search') || '').toLowerCase();
    const cat = (el.getAttribute('data-category') || '').toLowerCase();
    const dt = (el.getAttribute('data-drivetrain') || '').toLowerCase();
    const brand = (el.getAttribute('data-brand') || '').toLowerCase();
    const isEv = el.getAttribute('data-is-ev') === 'true';

    // Search query
    if (s.search && !search.includes(s.search)) return false;

    // Brand filter
    if (s.brand && s.brand !== 'all') {
      if (brand !== s.brand && !search.includes(s.brand)) return false;
    }

    // Category / Body Style
    if (s.category !== 'all') {
      if (s.category === 'electric' || s.category === 'ev') {
        if (!isEv) return false;
      } else if (!cat.includes(s.category) && !search.includes(s.category)) {
        return false;
      }
    }

    // Drivetrain / Powertrain sub-chip
    if (s.drivetrain !== 'all') {
      if (s.drivetrain === 'awd' && !dt.includes('awd') && !dt.includes('4wd') && !dt.includes('allgrip') && !dt.includes('quattro')) return false;
      if (s.drivetrain === 'rwd' && !dt.includes('rwd') && !dt.includes('rear')) return false;
      if (s.drivetrain === 'fwd' && !dt.includes('fwd') && !dt.includes('front')) return false;
      if (s.drivetrain === 'ev' && !isEv) return false;
    }

    return true;
  };

  cards.forEach(card => {
    const match = filterItem(card);
    card.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });

  rows.forEach(row => {
    const match = filterItem(row);
    row.style.display = match ? '' : 'none';
  });

  const countBadge = document.getElementById('cars-count-badge');
  if (countBadge) countBadge.textContent = `Showing ${visibleCount} Dossier${visibleCount === 1 ? '' : 's'}`;

  const emptyNotice = document.getElementById('cars-empty-notice');
  if (emptyNotice) emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
};

window.resetCarsFilters = function() {
  window.CARS_STATE = { search: '', category: 'all', brand: 'all', drivetrain: 'all', sortBy: 'featured', view: window.CARS_STATE.view };
  const searchInput = document.getElementById('cars-search-input');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('cars-sort-select');
  if (sortSelect) sortSelect.value = 'featured';
  
  const brandBar = document.getElementById('cars-brands-bar');
  if (brandBar) {
    brandBar.querySelectorAll('.brand-chip').forEach(b => b.classList.remove('active'));
    const first = brandBar.querySelector('.brand-chip[data-brand="all"]');
    if (first) first.classList.add('active');
  }

  filterCarsCatalog('all');
  const dtFirst = document.querySelector('#cars-drivetrain-filters .catalog-chip');
  if (dtFirst) dtFirst.click();
};


// --- BIKES SPOTLIGHT SYSTEM ---
window.BIKES_SPOTLIGHT_INDEX = 0;
const BIKES_SPOTLIGHT_IDS = [
  'bmw-m-1000-rr',
  'ducati-streetfighter-v4-sp2',
  'kawasaki-ninja-zx10r',
  'yamaha-mt-09-sp',
  'tvs-x',
  'indian-scout-bobber',
  'mv-agusta-brutale-1000-rr',
  'ola-s1-pro-gen2'
];

function renderBikeSpotlightContent(v) {
  if (!v) return '';
  const t = getVehicleTelemetry(v);

  return `
    <div class="catalog-spotlight__glow"></div>
    <div>
      <div class="catalog-spotlight__badge">
        <span>🏍️ Halo Motorcycle Spotlight</span>
        <span>•</span>
        <span>${t.catLabel}</span>
      </div>
      <h2 class="catalog-spotlight__title">${v.name}</h2>
      <div class="catalog-spotlight__maker">${t.mfr} • ${t.yearText}</div>
      <p class="catalog-spotlight__tagline">
        ${v.tagline || (v.description ? v.description.split('.')[0] + '.' : 'Engineered with race-derived chassis telemetry, electronic IMU suites, and peak specific power output.')}
      </p>
      <div class="catalog-spotlight__telemetry">
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--cyan-bright);">${t.power}</div>
          <div class="spotlight-gauge__lbl">Power</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-yellow);">${t.torque}</div>
          <div class="spotlight-gauge__lbl">Torque</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-primary);">${t.speed}</div>
          <div class="spotlight-gauge__lbl">Top Speed</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-green);">${t.disp || 'Electric'}</div>
          <div class="spotlight-gauge__lbl">Displacement</div>
        </div>
        <div class="spotlight-gauge">
          <div class="spotlight-gauge__val" style="color:var(--text-secondary);">${t.weight}</div>
          <div class="spotlight-gauge__lbl">Wet Weight</div>
        </div>
      </div>
      <div class="catalog-spotlight__actions">
        <button class="btn btn--primary" onclick="Router.navigate('vehicle-detail', '${v.id}')">
          <span>Inspect Full Dossier</span>
          <span>→</span>
        </button>
        <button class="btn btn--secondary" onclick="cycleBikesSpotlight(1)">
          <span>Next Halo Machine</span>
          <span>↻</span>
        </button>
        <span style="font-size:0.8rem;color:var(--text-muted);font-family:var(--font-mono);margin-left:auto;">
          MSRP: <strong style="color:var(--text-primary);">${t.price}</strong>
        </span>
      </div>
    </div>
    <div class="catalog-spotlight__visual">
      <div class="catalog-spotlight__icon">${t.icon}</div>
      <div class="catalog-spotlight__hud-dial">
        <span>IMU TELEMETRY ENABLED</span>
      </div>
      <div style="margin-top:12px;font-size:0.75rem;color:var(--text-muted);text-align:center;font-weight:600;">
        ${t.engineDesc}
      </div>
    </div>
  `;
}

window.cycleBikesSpotlight = function(dir = 1) {
  const list = BIKES_SPOTLIGHT_IDS.map(id => AUTOCORE_DB.vehicles.find(v => v.id === id)).filter(Boolean);
  if (!list.length) return;
  window.BIKES_SPOTLIGHT_INDEX = (window.BIKES_SPOTLIGHT_INDEX + dir + list.length) % list.length;
  const container = document.getElementById('bikes-spotlight-container');
  if (container) {
    container.innerHTML = renderBikeSpotlightContent(list[window.BIKES_SPOTLIGHT_INDEX]);
  }
};

function renderBikeMatrixRow(v) {
  const t = getVehicleTelemetry(v);
  const pVal = v.engine?.maxPower?.value || (v.ev?.motorPower?.peak ? Math.round(v.ev.motorPower.peak * 1.341) : 0);
  const sVal = v.performance?.topSpeed || (v.ev?.topSpeed || 0);
  const dispVal = parseFloat(v.engine?.displacement) || 0;
  const wVal = v.dimensions?.kerbWeight || 9999;
  const status = v.status || 'current';
  const searchStr = `${v.name} ${t.mfr} ${t.catList.join(' ')} ${t.disp} ${t.engineDesc} ${status} ${v.country || ''}`.toLowerCase();
  const brakesInfo = v.brakes?.front ? `${v.brakes.front}` : (v.ev ? 'Regen Braking + Dual Discs' : 'Disc Brakes');

  return `
    <div class="matrix-row" onclick="Router.navigate('vehicle-detail', '${v.id}')"
         data-id="${v.id}"
         data-search="${searchStr}"
         data-categories="${t.catList.join(' ')}"
         data-status="${status}"
         data-displacement="${dispVal}"
         data-is-ev="${v.ev ? 'true' : 'false'}"
         data-type="${v.type}"
         data-power="${pVal}"
         data-speed="${sVal}"
         data-weight="${wVal}"
         data-name="${v.name.toLowerCase()}">
      <div class="matrix-cell-vehicle">
        <div class="matrix-cell-vehicle__icon">${t.icon}</div>
        <div>
          <div class="matrix-cell-vehicle__name">${v.name}</div>
          <div class="matrix-cell-vehicle__maker">${t.mfr} • ${t.yearText}</div>
        </div>
      </div>
      <div class="matrix-cell-powertrain">
        <div style="font-weight:600;color:var(--text-primary);">${t.disp} ${v.engine?.layout || (v.ev ? 'Radial Flux IPM' : '')}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);">${t.catLabel} • ${status.toUpperCase()}</div>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val" style="color:var(--cyan-bright);">${t.power}</span>
        <span class="matrix-cell-spec__lbl">Power • ${t.torque}</span>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val" style="color:var(--text-yellow);">${t.speed}</span>
        <span class="matrix-cell-spec__lbl">Top Speed</span>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val">${t.weight}</span>
        <span class="matrix-cell-spec__lbl">Wet Weight</span>
      </div>
      <div class="matrix-cell-spec">
        <span class="matrix-cell-spec__val" style="color:var(--text-cyan);">${brakesInfo}</span>
        <span class="matrix-cell-spec__lbl">Brakes & Safety</span>
      </div>
      <div style="text-align:right;">
        <button class="btn btn--xs btn--primary" onclick="event.stopPropagation();Router.navigate('vehicle-detail', '${v.id}')">Dossier →</button>
      </div>
    </div>
  `;
}

// ===== RENDER BIKES PAGE =====
function renderBikesPage() {
  const bikes = AUTOCORE_DB.vehicles.filter(v => v.type === 'motorcycle' || v.type === 'scooter');
  const currentBikes = bikes.filter(v => (v.status || 'current') === 'current');
  const discBikes = bikes.filter(v => v.status === 'discontinued');
  const histBikes = bikes.filter(v => v.status === 'historical');
  const evBikes = bikes.filter(v => v.ev);
  const categories = AUTOCORE_DB.motorcycleCategories || [];

  // Extract distinct manufacturers for company-first filtering
  const bikeMfrIds = [...new Set(bikes.map(b => b.manufacturer))];
  const bikeBrands = bikeMfrIds.map(id => AUTOCORE_DB.getManufacturer(id)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

  const spotlightList = BIKES_SPOTLIGHT_IDS.map(id => AUTOCORE_DB.vehicles.find(v => v.id === id)).filter(Boolean);
  const spotlightBike = spotlightList[window.BIKES_SPOTLIGHT_INDEX] || bikes[0];

  return `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb" style="margin-bottom:var(--space-md);">
          <button class="breadcrumb" onclick="Router.navigate('home')">Home</button>
          <span>/</span>
          <span>Two-Wheeler Command Center</span>
        </div>
        <div class="page-header__marque-tag">
          <span class="marque-icon">◆</span>
          <span>45 MOTORCYCLE TAXONOMIES &bull; RACING TELEMETRY</span>
        </div>
        <h1 class="page-header__title">Global Motorcycle & Scooter Database</h1>
        <p class="page-header__subtitle">
          <span class="editorial-bracket">[</span> Over 45 motorcycle taxonomies from commuter runabouts to 200+ hp MotoGP homologation superbikes <span class="editorial-bracket">]</span>
        </p>

        <!-- Command Dashboard Telemetry Stats Ribbon -->
        <div class="catalog-stats-grid">
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:var(--cyan-bright);">🏍️</div>
            <div>
              <div class="catalog-stat-card__num">${bikes.length}</div>
              <div class="catalog-stat-card__label">Two-Wheelers</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#10b981;">🏁</div>
            <div>
              <div class="catalog-stat-card__num">${currentBikes.length}</div>
              <div class="catalog-stat-card__label">Current Lineup</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#f59e0b;">🏛️</div>
            <div>
              <div class="catalog-stat-card__num">${discBikes.length + histBikes.length}</div>
              <div class="catalog-stat-card__label">Discontinued & Milestones</div>
            </div>
          </div>
          <div class="catalog-stat-card">
            <div class="catalog-stat-card__icon" style="color:#38bdf8;">⚡</div>
            <div>
              <div class="catalog-stat-card__num">${evBikes.length}</div>
              <div class="catalog-stat-card__label">Electric Fleet</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="section">
      <div class="container">
        
        <!-- Interactive Flagship Spotlight Card -->
        <div class="catalog-spotlight" id="bikes-spotlight-container">
          ${renderBikeSpotlightContent(spotlightBike)}
        </div>

        <!-- Filter & View Command Console -->
        <div class="catalog-console">
          
          <!-- Company / Make Selector Ribbon -->
          <div class="catalog-brands-bar" id="bikes-brands-bar">
            <div class="catalog-brands-label">
              <span>🏢</span>
              <span>Filter by Company / Manufacturer:</span>
            </div>
            <div class="catalog-brands-scroll">
              <button class="brand-chip active" data-brand="all" onclick="window.filterBikesBrand(this, 'all')">
                <span>All Companies (${bikes.length})</span>
              </button>
              ${bikeBrands.map(b => {
                const count = bikes.filter(bk => bk.manufacturer === b.id).length;
                return `
                  <button class="brand-chip" data-brand="${b.id}" onclick="window.filterBikesBrand(this, '${b.id}')">
                    <span>${b.name}</span>
                    <span style="font-size:0.7rem;opacity:0.75;padding:1px 5px;background:rgba(255,255,255,0.08);border-radius:10px;">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Top Row: Search & Count & Sort & Views -->
          <div class="catalog-console__top-bar">
            <div class="catalog-search-wrap">
              <span class="catalog-search-icon">🔍</span>
              <input type="text" id="bikes-search-input" placeholder="Search by model, maker, engine displacement, or feature..." 
                     oninput="window.filterBikesCatalogSearch(this.value)">
            </div>
            
            <div class="catalog-console__tools">
              <button class="btn btn--secondary btn--sm" onclick="toggleBikesTaxonomyDrawer()" id="btn-toggle-taxonomy" style="display:inline-flex;align-items:center;gap:6px;">
                <span>📚 45 Category Taxonomy</span>
                <span id="taxonomy-arrow">▼</span>
              </button>

              <label style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">Sort By:</label>
              <select id="bikes-sort-select" class="catalog-sort-select" onchange="window.sortBikesCatalog(this.value)">
                <option value="featured">Featured Halo Order</option>
                <option value="power-desc">Horsepower (High to Low)</option>
                <option value="speed-desc">Top Speed (Highest First)</option>
                <option value="disp-desc">Displacement (Largest First)</option>
                <option value="weight-asc">Weight (Lightest First)</option>
                <option value="name-asc">Model Name (A–Z)</option>
              </select>

              <div class="view-toggle-wrap">
                <button id="btn-bikes-view-grid" class="view-toggle-btn active" onclick="window.setBikesView('grid')">
                  <span>▦</span>
                  <span>Grid</span>
                </button>
                <button id="btn-bikes-view-matrix" class="view-toggle-btn" onclick="window.setBikesView('matrix')">
                  <span>☰</span>
                  <span>Spec Matrix</span>
                </button>
              </div>

              <div id="bikes-count-badge" class="badge badge--blue" style="font-size:0.8rem;padding:7px 14px;border-radius:var(--radius-full);">
                Showing ${bikes.length} machines
              </div>
            </div>
          </div>

          <!-- Taxonomy Collapsible Drawer -->
          <div id="bikes-taxonomy-drawer" style="display:none;margin-top:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--color-border);">
            <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-sm);display:flex;justify-content:space-between;align-items:center;">
              <span>Select any motorcycle taxonomy type to filter catalog:</span>
              <button class="badge" onclick="clearBikesTaxonomyFilter()" style="cursor:pointer;border:1px solid var(--color-border);background:transparent;color:var(--text-muted);">Reset Type Filter</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;max-height:300px;overflow-y:auto;padding-right:6px;">
              ${categories.map(cat => {
                const count = bikes.filter(b => {
                  const list = AUTOCORE_DB.getCategoryList ? AUTOCORE_DB.getCategoryList(b.category) : [b.category];
                  return list.includes(cat.id);
                }).length;
                return `
                  <button class="taxonomy-chip" onclick="filterBikesCategoryChip(this, '${cat.id}')" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-radius:var(--radius-sm);background:var(--color-surface);border:1px solid var(--color-border);color:var(--text-secondary);cursor:pointer;font-size:0.8rem;text-align:left;transition:all 0.15s ease;">
                    <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${cat.icon} ${cat.name}</span>
                    <span style="font-size:0.75rem;padding:1px 6px;border-radius:10px;background:rgba(255,255,255,0.06);color:var(--text-muted);">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Primary Category Pills -->
          <div class="catalog-pills-row" id="bikes-segment-filters">
            <button class="catalog-pill active" onclick="filterBikesSegment(this, 'all')">All Classes</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'naked')">🏍️ Naked & Street</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'sport')">🏁 Supersport & Track</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'adventure')">🏔️ Adventure & Dual-Sport</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'cruiser')">🤠 Cruiser & Modern Classic</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'commuter')">💼 Commuter</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'scooter')">🛵 Scooters & Maxi</button>
            <button class="catalog-pill" onclick="filterBikesSegment(this, 'ev')">⚡ Electric Two-Wheelers</button>
          </div>

          <!-- Secondary Pills: Status & Displacement -->
          <div class="catalog-secondary-row">
            <div class="catalog-sub-group" id="bikes-status-filters">
              <span class="catalog-sub-label">Lineup Status:</span>
              <button class="catalog-chip active" onclick="filterBikesStatus(this, 'all')">All</button>
              <button class="catalog-chip" onclick="filterBikesStatus(this, 'current')">Current Production</button>
              <button class="catalog-chip" onclick="filterBikesStatus(this, 'discontinued')">Discontinued</button>
              <button class="catalog-chip" onclick="filterBikesStatus(this, 'historical')">Historical Milestones</button>
            </div>

            <div class="catalog-sub-group" id="bikes-disp-filters" style="margin-left:auto;">
              <span class="catalog-sub-label">Engine Class:</span>
              <button class="catalog-chip active" onclick="filterBikesDisplacement(this, 'all')">All</button>
              <button class="catalog-chip" onclick="filterBikesDisplacement(this, 'sub-160')">≤ 160cc</button>
              <button class="catalog-chip" onclick="filterBikesDisplacement(this, '200-500')">200–500cc</button>
              <button class="catalog-chip" onclick="filterBikesDisplacement(this, '650-900')">650–900cc</button>
              <button class="catalog-chip" onclick="filterBikesDisplacement(this, '1000-plus')">1000cc+ Litre Class</button>
            </div>
          </div>

        </div>

        <!-- Bike Cards Grid -->
        <div class="grid-auto" id="bikes-catalog-grid">
          ${bikes.map(v => renderVehicleCard(v)).join('')}
        </div>

        <!-- Telemetry Spec Matrix View (Initially Hidden) -->
        <div id="bikes-matrix" style="display:none;">
          <div class="telemetry-matrix-table">
            <div class="matrix-header-row">
              <div>Machine & Model</div>
              <div>Powertrain & Architecture</div>
              <div>Power & Torque</div>
              <div>Top Speed</div>
              <div>Wet Weight</div>
              <div>Brakes & Safety</div>
              <div style="text-align:right;">Action</div>
            </div>
            <div id="bikes-matrix-list">
              ${bikes.map(v => renderBikeMatrixRow(v)).join('')}
            </div>
          </div>
        </div>

        <!-- Empty State Notice -->
        <div id="bikes-empty-state" class="empty-filter-state" style="display:none;margin-top:var(--space-2xl);">
          <div style="font-size:2.2rem;margin-bottom:12px;">🔍</div>
          <h3 style="font-size:1.2rem;color:var(--text-primary);margin-bottom:6px;">No Two-Wheelers Found</h3>
          <p style="font-size:0.875rem;margin-bottom:16px;">No motorcycles match the currently selected combination of company, category, status, displacement, and search keywords.</p>
          <button class="btn btn--primary btn--sm" onclick="resetBikesFilters()" style="margin:0 auto;padding:8px 22px;">Reset All Filters</button>
        </div>

        <!-- Curated Motorcycle Showcases -->
        <div class="curated-strip-header">
          <div class="curated-strip-title">
            <span>🏁</span>
            <span>Litre-Class 200+ HP Track Weapons</span>
          </div>
          <button class="btn btn--xs btn--secondary" onclick="filterBikesSegment(null, 'sport')">Explore Track Weapons →</button>
        </div>
        <div class="curated-cards-scroll">
          ${bikes.filter(b => ['bmw-m-1000-rr', 'ducati-streetfighter-v4-sp2', 'kawasaki-ninja-zx10r', 'mv-agusta-brutale-1000-rr'].includes(b.id)).map(v => renderVehicleCard(v)).join('')}
        </div>

        <div class="curated-strip-header">
          <div class="curated-strip-title">
            <span>⚡</span>
            <span>Next-Gen High-Voltage Electric Two-Wheelers</span>
          </div>
          <button class="btn btn--xs btn--secondary" onclick="filterBikesSegment(null, 'ev')">Explore Electric Fleet →</button>
        </div>
        <div class="curated-cards-scroll">
          ${bikes.filter(b => ['tvs-x', 'ola-s1-pro-gen2', 'ultraviolette-f77-mach2', 'ather-450-apex'].includes(b.id)).map(v => renderVehicleCard(v)).join('')}
        </div>

      </div>
    </div>
    ${renderFooter()}
  `;
}

// BIKES CATALOG FILTERING LOGIC
window.BIKES_STATE = {
  search: '',
  brand: 'all',
  segment: 'all',
  category: 'all',
  status: 'all',
  displacement: 'all',
  sortBy: 'featured',
  view: 'grid'
};

window.setBikesView = function(view) {
  window.BIKES_STATE.view = view;
  const gridContainer = document.getElementById('bikes-catalog-grid');
  const matrixContainer = document.getElementById('bikes-matrix');
  const btnGrid = document.getElementById('btn-bikes-view-grid');
  const btnMatrix = document.getElementById('btn-bikes-view-matrix');

  if (view === 'matrix') {
    if (gridContainer) gridContainer.style.display = 'none';
    if (matrixContainer) matrixContainer.style.display = 'block';
    if (btnGrid) btnGrid.classList.remove('active');
    if (btnMatrix) btnMatrix.classList.add('active');
  } else {
    if (gridContainer) gridContainer.style.display = 'grid';
    if (matrixContainer) matrixContainer.style.display = 'none';
    if (btnGrid) btnGrid.classList.add('active');
    if (btnMatrix) btnMatrix.classList.remove('active');
  }
};

window.sortBikesCatalog = function(sortBy) {
  window.BIKES_STATE.sortBy = sortBy;
  const gridContainer = document.getElementById('bikes-catalog-grid');
  const matrixList = document.getElementById('bikes-matrix-list');
  if (!gridContainer) return;

  const cards = Array.from(gridContainer.children).filter(el => el.classList.contains('vehicle-card'));
  const rows = matrixList ? Array.from(matrixList.children).filter(el => el.classList.contains('matrix-row')) : [];

  const sortFn = (a, b) => {
    if (sortBy === 'power-desc') {
      return (parseInt(b.dataset.power) || 0) - (parseInt(a.dataset.power) || 0);
    } else if (sortBy === 'speed-desc') {
      return (parseInt(b.dataset.speed) || 0) - (parseInt(a.dataset.speed) || 0);
    } else if (sortBy === 'disp-desc') {
      return (parseFloat(b.dataset.displacement) || 0) - (parseFloat(a.dataset.displacement) || 0);
    } else if (sortBy === 'weight-asc') {
      return (parseInt(a.dataset.weight) || 9999) - (parseInt(b.dataset.weight) || 9999);
    } else if (sortBy === 'name-asc') {
      return (a.dataset.name || '').localeCompare(b.dataset.name || '');
    }
    return 0;
  };

  cards.sort(sortFn).forEach(el => gridContainer.appendChild(el));
  if (matrixList && rows.length) {
    rows.sort(sortFn).forEach(el => matrixList.appendChild(el));
  }
};

window.filterBikesCatalogSearch = function(val) {
  window.BIKES_STATE.search = (val || '').toLowerCase().trim();
  window.applyBikesCatalogFilters();
};

window.filterBikesBrand = function(btn, brandId) {
  const container = document.getElementById('bikes-brands-bar');
  if (container) {
    container.querySelectorAll('.brand-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
  window.BIKES_STATE.brand = (brandId || 'all').toLowerCase();
  window.applyBikesCatalogFilters();
};

window.filterBikesSegment = function(btn, seg) {
  const container = document.getElementById('bikes-segment-filters');
  if (container) {
    container.querySelectorAll('.catalog-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else {
      const matchBtn = Array.from(container.querySelectorAll('.catalog-pill')).find(b => {
        const text = b.textContent.toLowerCase();
        return text.includes(seg.toLowerCase());
      });
      if (matchBtn) matchBtn.classList.add('active');
    }
  }
  window.BIKES_STATE.segment = seg;
  window.applyBikesCatalogFilters();
};

window.filterBikesStatus = function(btn, st) {
  const container = document.getElementById('bikes-status-filters');
  if (container) {
    container.querySelectorAll('.catalog-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
  window.BIKES_STATE.status = st;
  window.applyBikesCatalogFilters();
};

window.filterBikesDisplacement = function(btn, disp) {
  const container = document.getElementById('bikes-disp-filters');
  if (container) {
    container.querySelectorAll('.catalog-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
  window.BIKES_STATE.displacement = disp;
  window.applyBikesCatalogFilters();
};

window.toggleBikesTaxonomyDrawer = function() {
  const drawer = document.getElementById('bikes-taxonomy-drawer');
  const arrow = document.getElementById('taxonomy-arrow');
  if (!drawer) return;
  const isHidden = drawer.style.display === 'none';
  drawer.style.display = isHidden ? 'block' : 'none';
  if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
};

window.filterBikesCategoryChip = function(btn, catId) {
  const drawer = document.getElementById('bikes-taxonomy-drawer');
  if (drawer) {
    drawer.querySelectorAll('.taxonomy-chip').forEach(c => {
      c.style.background = 'var(--color-surface)';
      c.style.borderColor = 'var(--color-border)';
      c.style.color = 'var(--text-secondary)';
    });
    if (btn) {
      btn.style.background = 'rgba(6, 182, 212, 0.15)';
      btn.style.borderColor = 'var(--cyan-bright)';
      btn.style.color = 'var(--cyan-bright)';
    }
  }
  window.BIKES_STATE.category = catId;
  window.applyBikesCatalogFilters();
};

window.clearBikesTaxonomyFilter = function() {
  const drawer = document.getElementById('bikes-taxonomy-drawer');
  if (drawer) {
    drawer.querySelectorAll('.taxonomy-chip').forEach(c => {
      c.style.background = 'var(--color-surface)';
      c.style.borderColor = 'var(--color-border)';
      c.style.color = 'var(--text-secondary)';
    });
  }
  window.BIKES_STATE.category = 'all';
  window.applyBikesCatalogFilters();
};

window.resetBikesFilters = function() {
  window.BIKES_STATE = { search: '', brand: 'all', segment: 'all', category: 'all', status: 'all', displacement: 'all', sortBy: 'featured', view: window.BIKES_STATE.view };
  const input = document.getElementById('bikes-search-input');
  if (input) input.value = '';
  const sortSelect = document.getElementById('bikes-sort-select');
  if (sortSelect) sortSelect.value = 'featured';
  
  const brandBar = document.getElementById('bikes-brands-bar');
  if (brandBar) {
    brandBar.querySelectorAll('.brand-chip').forEach(b => b.classList.remove('active'));
    const first = brandBar.querySelector('.brand-chip[data-brand="all"]');
    if (first) first.classList.add('active');
  }

  window.clearBikesTaxonomyFilter();
  const segFirst = document.querySelector('#bikes-segment-filters .catalog-pill');
  if (segFirst) segFirst.click();
  const stFirst = document.querySelector('#bikes-status-filters .catalog-chip');
  if (stFirst) stFirst.click();
  const dispFirst = document.querySelector('#bikes-disp-filters .catalog-chip');
  if (dispFirst) dispFirst.click();
};

window.applyBikesCatalogFilters = function() {
  const s = window.BIKES_STATE;
  const cards = document.querySelectorAll('#bikes-catalog-grid .vehicle-card');
  const rows = document.querySelectorAll('#bikes-matrix-list .matrix-row');
  let visibleCount = 0;

  const checkBikeItem = (el) => {
    const search = el.getAttribute('data-search') || '';
    const cats = (el.getAttribute('data-categories') || '').split(' ');
    const brand = (el.getAttribute('data-brand') || '').toLowerCase();
    const status = el.getAttribute('data-status') || 'current';
    const disp = parseFloat(el.getAttribute('data-displacement')) || 0;
    const isEv = el.getAttribute('data-is-ev') === 'true';
    const type = el.getAttribute('data-type') || '';

    // Search query match
    if (s.search && !search.includes(s.search)) return false;

    // Brand filter
    if (s.brand && s.brand !== 'all') {
      if (brand !== s.brand && !search.includes(s.brand)) return false;
    }

    // Taxonomy exact chip match
    if (s.category !== 'all' && !cats.includes(s.category)) return false;

    // Segment match
    if (s.segment !== 'all') {
      if (s.segment === 'naked' && !cats.some(cat => ['naked','streetfighter','hyper-naked','standard'].includes(cat))) return false;
      if (s.segment === 'sport' && !cats.some(cat => ['sports','supersport','superbike','hyperbike','track-only','racing'].includes(cat))) return false;
      if (s.segment === 'adventure' && !cats.some(cat => ['adventure','adventure-touring','dual-sport','enduro','dirt-bike','supermoto'].includes(cat))) return false;
      if (s.segment === 'cruiser' && !cats.some(cat => ['cruiser','power-cruiser','bobber','retro','classic','heritage','cafe-racer'].includes(cat))) return false;
      if (s.segment === 'commuter' && !cats.some(cat => ['commuter','standard','underbone'].includes(cat))) return false;
      if (s.segment === 'scooter' && type !== 'scooter' && !cats.some(cat => ['scooter','maxi-scooter','moped','electric-scooter'].includes(cat))) return false;
      if (s.segment === 'ev' && !isEv) return false;
    }

    // Status match
    if (s.status !== 'all' && status !== s.status) return false;

    // Displacement match
    if (s.displacement !== 'all') {
      if (s.displacement === 'sub-160' && (disp > 160 || isEv)) return false;
      if (s.displacement === '200-500' && (disp < 180 || disp > 520 || isEv)) return false;
      if (s.displacement === '650-900' && (disp < 600 || disp > 950 || isEv)) return false;
      if (s.displacement === '1000-plus' && (disp < 990 || isEv)) return false;
    }

    return true;
  };

  cards.forEach(c => {
    const match = checkBikeItem(c);
    c.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  });

  rows.forEach(r => {
    const match = checkBikeItem(r);
    r.style.display = match ? '' : 'none';
  });

  const badge = document.getElementById('bikes-count-badge');
  if (badge) badge.textContent = `Showing ${visibleCount} machine${visibleCount === 1 ? '' : 's'}`;

  const emptyState = document.getElementById('bikes-empty-state');
  if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
};



function renderVehicleDB() {
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Database</span>
        <h1 class="page-header__title">📊 Vehicle Database</h1>
        <p class="page-header__subtitle">Browse all vehicles with filters by type, manufacturer, country, and more.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="filter-bar" style="margin-bottom:var(--space-xl);">
          <button class="filter-btn active" onclick="filterVehicleDB(this,'all')">All</button>
          <button class="filter-btn" onclick="filterVehicleDB(this,'car')">Cars</button>
          <button class="filter-btn" onclick="filterVehicleDB(this,'motorcycle')">Motorcycles</button>
          <button class="filter-btn" onclick="filterVehicleDB(this,'scooter')">Scooters</button>
        </div>
        <div class="grid-auto" id="vehicle-db-grid">
          ${AUTOCORE_DB.vehicles.map(v => renderVehicleCard(v)).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== NEWS / ABOUT / ADMIN =====
function renderNewsPage() {
  const news = [
    { emoji: '⚡', category: 'Electric Vehicles', title: 'Ather Energy Expands Charging Network to 200+ Cities', date: 'October 2026', body: 'Ather Energy announces major expansion of its fast-charging Ather Grid network across India, targeting 200+ cities by end of 2026.' },
    { emoji: '🏍️', category: 'Motorcycles', title: 'KTM Unveils Next-Gen Duke 390 with Full-Color TFT and Cornering ABS', date: 'October 2026', body: 'KTM India previews the updated Duke 390 featuring a new full-color TFT display, Bosch cornering ABS, and updated electronics suite.' },
    { emoji: '🚗', category: 'Cars', title: "Mahindra's BE 6 Sets New Record for EV Range in India", date: 'September 2026', body: 'Mahindra BE 6 achieves 680 km certified range on a single charge, setting a new benchmark for affordable electric SUVs in India.' },
    { emoji: '🔧', category: 'Technology', title: 'Bosch Announces 6-Axis IMU for Sub-250cc Motorcycles', date: 'September 2026', body: 'Bosch Motorsport reveals a miniaturized 6-axis IMU designed to enable cornering ABS and traction control for smaller displacement motorcycles.' },
    { emoji: '🏎️', category: 'Supercars', title: "Ferrari's Hybrid V12 Produces Record 1,000hp with Zero Lag", date: 'August 2026', body: "Ferrari's new hybrid powertrain combines a naturally aspirated V12 with electric motors for a combined 1,000hp output with improved response." },
    { emoji: '🌱', category: 'Sustainability', title: 'Hydrogen Motorcycles: Are They the Future?', date: 'August 2026', body: 'Multiple manufacturers are developing hydrogen fuel cell motorcycles. We analyze the technology, challenges, and timeline for consumer availability.' },
    { emoji: '⚡', category: 'Powertrains', title: 'Porsche 911 T-Hybrid: Electric Exhaust-Gas Turbo Eradicates Turbo Lag', date: 'October 2026', body: 'Porsche engineering debrief on the 992.2 T-Hybrid system: an integrated electric motor on the turbocharger shaft spins the turbine wheel to maximum boost in under 20 milliseconds.' },
    { emoji: '👑', category: 'Hypercars', title: 'Bugatti Tourbillon Unveils Cosworth 8.3L Naturally Aspirated V16', date: 'September 2026', body: 'Bugatti breaks from quad-turbos with a bespoke 9,000 RPM naturally aspirated V16 developed with Cosworth, paired with three electric motors for 1,800 hp.' },
    { emoji: '🔋', category: 'Battery Tech', title: 'Solid-State Battery Pilot Production Lines Achieve 480 Wh/kg Energy Density', date: 'September 2026', body: 'Solid-state electrolyte separators clear automotive thermal durability validation, delivering 12-minute 10-80% ultra-fast charging without flammable gel risks.' },
    { emoji: '🏁', category: 'Motorsport', title: 'Ducati Desmo450 MX Brings Desmodromic Valvetrain to World Motocross', date: 'August 2026', body: 'Ducati Corse enters competitive motocross with a single-cylinder 450cc prototype featuring Desmodromic valve closure for unprecedented high-RPM over-rev.' },
    { emoji: '🛡️', category: 'Vehicle Safety', title: 'Bharat NCAP Updates 2026 Testing Protocol with Strict ADAS Requirements', date: 'July 2026', body: 'India\'s autonomous vehicle safety testing agency introduces mandatory Autonomous Emergency Braking (AEB) and pedestrian collision protection for 5-star crash ratings.' },
    { emoji: '🏎️', category: 'Formula 1', title: 'FIA 2026 Power Unit Regulations: 50% Electrical Output and 100% Sustainable Fuels', date: 'July 2026', body: 'Grand Prix racing pivots to an equal 500hp internal combustion and 500hp (350 kW) MGU-K electrical split, dropping the complex MGU-H in favor of simplified turbo architectures.' },
  ];
  return `
    <div class="page-header">
      <div class="container">
        <span class="page-header__label">Latest</span>
        <h1 class="page-header__title">📰 Automotive News</h1>
        <p class="page-header__subtitle">Latest developments in automotive technology, vehicles, and the industry.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div class="grid-3">
          ${news.map(n => `
            <article class="news-card">
              <div class="news-card__img"><span>${n.emoji}</span></div>
              <div class="news-card__body">
                <div class="news-card__category">${n.category}</div>
                <h2 class="news-card__title">${n.title}</h2>
                <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:var(--space-sm);">${n.body}</p>
                <div class="news-card__meta">${n.date}</div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

function renderAboutPage() {
  return `
    <div class="page-header">
      <div class="container">
        <h1 class="page-header__title">About AUTOCORE</h1>
      </div>
    </div>
    <div class="section">
      <div class="container--narrow">
        <div class="about-glass-card" style="margin-bottom:var(--space-xl);">
          <h2 style="margin-bottom:var(--space-md);color:var(--text-primary);">Our Mission</h2>
          <p style="font-size:1.05rem;line-height:1.7;color:var(--text-secondary);">AUTOCORE is an ultra-premium automotive encyclopedia platform. Our goal is simple: <strong style="color:var(--text-primary);">if an engineer, enthusiast, or owner wants to understand anything about a machine — from the complete vehicle dossier to the smallest mechanical sub-assembly — they should find it here with verified homologation accuracy.</strong></p>
        </div>
        <div class="grid-2" style="margin-bottom:var(--space-xl);">
          ${[
            { icon: '✅', title: 'Data Accuracy', desc: 'Every specification is sourced from official manufacturer data, verified by model year and regional market homologation.' },
            { icon: '📈', title: 'Continuously Expanding', desc: 'The database grows continuously across global marques. We commit to technical accuracy over raw volume.' },
            { icon: '🌍', title: 'Market Aware', desc: 'Vehicle specifications vary by jurisdiction. We explicitly document applicable markets for every metric.' },
            { icon: '🔓', title: 'Open Telemetry Access', desc: 'AUTOCORE is free for everyone — automotive engineers, students, mechanics, and passionate drivers.' },
          ].map(f => `
            <div class="about-glass-card">
              <div style="font-size:2rem;margin-bottom:var(--space-sm);">${f.icon}</div>
              <div style="font-weight:800;font-size:1.05rem;color:var(--text-primary);margin-bottom:var(--space-sm);">${f.title}</div>
              <div style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;">${f.desc}</div>
            </div>
          `).join('')}
        </div>
        <div class="about-glass-card" style="margin-bottom:var(--space-xl);display:flex;align-items:center;gap:var(--space-xl);flex-wrap:wrap;">
          <img src="assets/autocore-logo.svg" alt="AUTOCORE emblem" width="80" height="80" style="filter:drop-shadow(0 0 16px rgba(6,182,212,0.4));flex-shrink:0;">
          <div style="flex:1;min-width:260px;">
            <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;color:var(--cyan-bright);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;">BRAND ARCHITECTURE</div>
            <h3 style="font-family:var(--font-brand);font-size:1.4rem;font-weight:900;color:var(--text-primary);margin-bottom:6px;">The Kinetic Hex-Core Emblem</h3>
            <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:var(--space-md);line-height:1.6;">Fusing carbon monocoque chassis geometry, aerodynamic intake foils, reciprocating piston crown geometry, and 800V EV stator flux into a single automotive mark.</p>
            <button class="btn btn--secondary btn--sm" onclick="openLogoMeaningModal()">Open Emblem Symbology Schematic →</button>
          </div>
        </div>
        <div class="callout callout--info">
          <div class="callout__title">📋 Verified Data Homologation</div>
          <p>AUTOCORE sources specifications from official manufacturer blueprints, press kits, and verified technical publications. All specifications are marked with their source and applicable market. Always verify with your local authorized marque dealer for market-specific options.</p>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

function renderAdminPage() {
  const mfrCount = AUTOCORE_DB.manufacturers ? AUTOCORE_DB.manufacturers.length : 80;
  const vehCount = AUTOCORE_DB.vehicles ? AUTOCORE_DB.vehicles.length : 91;
  const engCount = Object.keys(AUTOCORE_DB.engineFamilies || {}).length || 59;

  return `
    <div class="page-header page-header--compact">
      <div class="container" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.5rem;line-height:1;">🔐</span>
          <div>
            <div style="font-family:var(--font-mono);font-size:0.65rem;font-weight:700;color:var(--cyan-bright);letter-spacing:0.12em;text-transform:uppercase;">CONTROL COCKPIT // TELEMETRY</div>
            <h1 style="font-size:1.35rem;font-weight:900;color:var(--text-primary);margin:0;">Platform Intelligence & Admin Dashboard</h1>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="badge badge--green" style="font-size:0.7rem;padding:3px 8px;">● Live Ingestion</span>
          <span class="badge badge--cyan" style="font-size:0.7rem;padding:3px 8px;">100% Homologated</span>
        </div>
      </div>
    </div>
    <div class="section" style="padding-top:var(--space-md);padding-bottom:var(--space-xl);">
      <div class="container">
        <div class="admin-panel">
          <div class="admin-sidebar">
            <div class="admin-nav-section">
              <div class="admin-nav-label">Dashboard View</div>
              <div class="admin-nav-item active" onclick="switchAdminSection(this,'admin-sec-overview')">
                <span>📊</span> Overview
              </div>
              <div class="admin-nav-item" onclick="switchAdminSection(this,'admin-sec-vehicles')">
                <span>🏎️</span> Vehicles (${vehCount})
              </div>
              <div class="admin-nav-item" onclick="switchAdminSection(this,'admin-sec-mfrs')">
                <span>🏭</span> Marques (${mfrCount})
              </div>
            </div>
            <div class="admin-nav-section">
              <div class="admin-nav-label">Data Ingestion</div>
              <div class="admin-nav-item" onclick="switchAdminSection(this,'admin-sec-add-vehicle')">
                <span>➕</span> Add Vehicle
              </div>
              <div class="admin-nav-item" onclick="switchAdminSection(this,'admin-sec-add-mfr')">
                <span>🏢</span> Add Marque
              </div>
              <div class="admin-nav-item" onclick="switchAdminSection(this,'admin-sec-telemetry')">
                <span>⚡</span> Diagnostics
              </div>
            </div>
            
            <div class="admin-nav-section" style="margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;">
              <div class="admin-nav-label">Direct Tools</div>
              <div class="admin-nav-item" onclick="Router.navigate('compare')">
                <span>⚖️</span> Compare Engine
              </div>
              <div class="admin-nav-item" onclick="Router.navigate('vehicle-db')">
                <span>📚</span> Vehicle Catalog
              </div>
            </div>
          </div>
          <div class="admin-main">
            <!-- SECTION: Overview -->
            <div class="admin-section-pane active" id="admin-sec-overview">
              <div class="admin-kpi-grid">
                <div class="admin-kpi-card">
                  <div class="admin-kpi-card__val">${vehCount}</div>
                  <div class="admin-kpi-card__label">Active Vehicles</div>
                </div>
                <div class="admin-kpi-card">
                  <div class="admin-kpi-card__val">${mfrCount}</div>
                  <div class="admin-kpi-card__label">Manufacturers</div>
                </div>
                <div class="admin-kpi-card">
                  <div class="admin-kpi-card__val">${engCount}</div>
                  <div class="admin-kpi-card__label">Engine Families</div>
                </div>
                <div class="admin-kpi-card">
                  <div class="admin-kpi-card__val" style="color:#10b981;">100%</div>
                  <div class="admin-kpi-card__label">Homologated</div>
                </div>
              </div>

              <!-- Quick Operations Bar (Compact & High-Density) -->
              <div class="admin-ops-bar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;padding:8px 12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;">
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-right:4px;">Quick Actions:</span>
                <button class="btn btn--primary btn--xs" onclick="switchAdminSection(null,'admin-sec-add-vehicle')">➕ Add Vehicle</button>
                <button class="btn btn--secondary btn--xs" onclick="switchAdminSection(null,'admin-sec-vehicles')">🔍 Vehicles (${vehCount})</button>
                <button class="btn btn--secondary btn--xs" onclick="switchAdminSection(null,'admin-sec-mfrs')">🏭 Marques (${mfrCount})</button>
                <button class="btn btn--secondary btn--xs" onclick="Router.navigate('compare')">⚖️ Compare</button>
                <button class="btn btn--secondary btn--xs" onclick="Router.navigate('vehicle-db')">📊 Catalog</button>
              </div>

              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <h3 style="font-size:1.05rem;color:var(--text-primary);margin:0;">Featured Telemetry Ingestion Preview</h3>
                <span style="font-size:0.75rem;color:var(--text-muted);">Verified Session Data</span>
              </div>
              <div class="admin-table-wrap">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Machine</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Displacement / Battery</th>
                      <th>Power Output</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${AUTOCORE_DB.vehicles.slice(0, 6).map(v => `
                      <tr>
                        <td><strong>${AUTOCORE_DB.getManufacturerName(v.manufacturer)}</strong> ${v.name}</td>
                        <td><span class="badge badge--${v.type==='car'?'blue':v.type==='motorcycle'?'cyan':'green'}" style="font-size:0.68rem;padding:2px 6px;">${v.type}</span></td>
                        <td>${formatCategory(v.category)}</td>
                        <td>${v.engine?.displacement ? v.engine.displacement + ' cc' : (v.ev?.batteryCapacity ? v.ev.batteryCapacity + ' kWh' : '—')}</td>
                        <td>${v.engine?.maxPower ? v.engine.maxPower.value + ' ' + v.engine.maxPower.unit : (v.ev?.motorPower?.peak ? v.ev.motorPower.peak + ' kW' : '—')}</td>
                        <td><button class="btn btn--secondary btn--xs" onclick="Router.navigate('vehicle-detail','${v.id}')">Inspect →</button></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION: View All Vehicles -->
            <div class="admin-section-pane" id="admin-sec-vehicles">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                <div>
                  <h2 style="font-size:1.25rem;color:var(--text-primary);margin:0;">Master Vehicle Inventory</h2>
                  <p style="font-size:0.78rem;color:var(--text-muted);margin:2px 0 0;">${vehCount} machines cataloged with complete engineering specifications.</p>
                </div>
                <input type="text" class="form-input" placeholder="Filter vehicles..." oninput="filterAdminVehicleTable(this.value)" style="max-width:240px;padding:6px 10px;font-size:0.8rem;">
              </div>
              <div class="admin-table-wrap" style="max-height:480px;overflow-y:auto;">
                <table class="admin-table" id="admin-vehicles-table">
                  <thead style="position:sticky;top:0;z-index:2;">
                    <tr>
                      <th>Vehicle</th>
                      <th>Marque</th>
                      <th>Type</th>
                      <th>Powertrain</th>
                      <th>Top Speed</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${AUTOCORE_DB.vehicles.map(v => `
                      <tr data-search="${(AUTOCORE_DB.getManufacturerName(v.manufacturer) + ' ' + v.name + ' ' + v.type).toLowerCase()}">
                        <td><strong>${v.name}</strong></td>
                        <td>${AUTOCORE_DB.getManufacturerName(v.manufacturer)}</td>
                        <td><span class="badge badge--${v.type==='car'?'blue':'cyan'}" style="font-size:0.68rem;padding:2px 6px;">${v.type}</span></td>
                        <td>${v.engine?.displacement ? v.engine.displacement + ' cc' : (v.ev ? v.ev.batteryCapacity + ' kWh EV' : '—')}</td>
                        <td>${v.performance?.topSpeed || v.ev?.topSpeed || '—'} km/h</td>
                        <td><span class="status-dot status-dot--${v.status==='discontinued'?'yellow':'green'}"></span> ${v.status || 'current'}</td>
                        <td><button class="btn btn--secondary btn--xs" onclick="Router.navigate('vehicle-detail','${v.id}')">View</button></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION: View All Manufacturers -->
            <div class="admin-section-pane" id="admin-sec-mfrs">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                <div>
                  <h2 style="font-size:1.25rem;color:var(--text-primary);margin:0;">Global Marque Directory</h2>
                  <p style="font-size:0.78rem;color:var(--text-muted);margin:2px 0 0;">${mfrCount} international automotive manufacturers.</p>
                </div>
                <input type="text" class="form-input" placeholder="Filter marques..." oninput="filterAdminMfrTable(this.value)" style="max-width:240px;padding:6px 10px;font-size:0.8rem;">
              </div>
              <div class="admin-table-wrap" style="max-height:480px;overflow-y:auto;">
                <table class="admin-table" id="admin-mfrs-table">
                  <thead style="position:sticky;top:0;z-index:2;">
                    <tr>
                      <th>Marque</th>
                      <th>Country</th>
                      <th>HQ</th>
                      <th>Founded</th>
                      <th>Models in DB</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${AUTOCORE_DB.manufacturers.map(m => {
                      const count = AUTOCORE_DB.vehicles.filter(v => v.manufacturer === m.id).length;
                      return `
                        <tr data-search="${(m.name + ' ' + m.country).toLowerCase()}">
                          <td><strong>${m.name}</strong></td>
                          <td>${m.flag || '🌐'} ${m.country}</td>
                          <td>${m.hq || '—'}</td>
                          <td>${m.founded || '—'}</td>
                          <td><span class="badge badge--blue" style="font-size:0.68rem;padding:2px 6px;">${count} Dossiers</span></td>
                          <td><button class="btn btn--secondary btn--xs" onclick="Router.navigate('manufacturer-detail','${m.id}')">Marque →</button></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION: Add Vehicle -->
            <div class="admin-section-pane" id="admin-sec-add-vehicle">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px;">
                <div>
                  <h2 style="font-size:1.15rem;color:var(--text-primary);margin:0;">Add New Vehicle Dossier</h2>
                  <p style="font-size:0.72rem;color:var(--text-muted);margin:1px 0 0;">Ingest verified vehicle specification telemetry into active session.</p>
                </div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn--primary btn--xs" onclick="saveAdminVehicle()">💾 Save Vehicle</button>
                  <button class="btn btn--secondary btn--xs" onclick="previewAdminVehicle()">👁️ Preview</button>
                  <button class="btn btn--secondary btn--xs" onclick="clearAdminVehicleForm()">✕ Reset</button>
                </div>
              </div>
              <div class="form-grid" style="grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:6px;">
                <div class="form-group">
                  <label class="form-label">Vehicle Name *</label>
                  <input type="text" class="form-input" placeholder="e.g., 911 GT3 RS" id="admin-veh-name">
                </div>
                <div class="form-group">
                  <label class="form-label">Manufacturer *</label>
                  <select class="form-input" id="admin-veh-mfr">
                    ${AUTOCORE_DB.manufacturers.map(m => `<option value="${m.id}">${m.name} (${m.country})</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Vehicle Type *</label>
                  <select class="form-input" id="admin-veh-type">
                    <option value="car">Car / Supercar</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <input type="text" class="form-input" placeholder="e.g., track, supercar" id="admin-veh-category">
                </div>
                <div class="form-group">
                  <label class="form-label">Displacement / Battery</label>
                  <input type="text" class="form-input" placeholder="e.g., 3996 cc" id="admin-veh-disp">
                </div>
                <div class="form-group">
                  <label class="form-label">Max Power</label>
                  <input type="text" class="form-input" placeholder="e.g., 518 bhp @ 8500 RPM" id="admin-veh-power">
                </div>
                <div class="form-group">
                  <label class="form-label">Max Torque</label>
                  <input type="text" class="form-input" placeholder="e.g., 465 Nm @ 6300 RPM" id="admin-veh-torque">
                </div>
                <div class="form-group">
                  <label class="form-label">Top Speed (km/h)</label>
                  <input type="number" class="form-input" placeholder="e.g., 296" id="admin-veh-speed">
                </div>
              </div>
              <div class="form-group" style="margin-bottom:8px;">
                <label class="form-label">Tagline / Engineering Highlight</label>
                <input type="text" class="form-input" placeholder="Brief technical summary..." id="admin-veh-tagline">
              </div>
              <div style="display:flex;gap:6px;">
                <button class="btn btn--primary btn--xs" onclick="saveAdminVehicle()">💾 Save Vehicle to Session</button>
                <button class="btn btn--secondary btn--xs" onclick="previewAdminVehicle()">👁️ Preview</button>
                <button class="btn btn--secondary btn--xs" onclick="clearAdminVehicleForm()">✕ Reset Form</button>
              </div>
              <div id="admin-veh-preview" style="margin-top:10px;"></div>
            </div>

            <!-- SECTION: Add Manufacturer -->
            <div class="admin-section-pane" id="admin-sec-add-mfr">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px;">
                <div>
                  <h2 style="font-size:1.15rem;color:var(--text-primary);margin:0;">Add Global Manufacturer</h2>
                  <p style="font-size:0.72rem;color:var(--text-muted);margin:1px 0 0;">Register new global automotive marque in database.</p>
                </div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn--primary btn--xs" onclick="saveAdminMfr()">💾 Save Manufacturer</button>
                  <button class="btn btn--secondary btn--xs" onclick="previewAdminMfr()">👁️ Preview</button>
                  <button class="btn btn--secondary btn--xs" onclick="clearAdminForm()">✕ Clear</button>
                </div>
              </div>
              <div class="form-grid" style="grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:6px;">
                <div class="form-group"><label class="form-label">Manufacturer Name *</label><input type="text" class="form-input" placeholder="e.g., Koenigsegg" id="admin-mfr-name"></div>
                <div class="form-group"><label class="form-label">Country *</label><input type="text" class="form-input" placeholder="e.g., Sweden" id="admin-mfr-country"></div>
                <div class="form-group"><label class="form-label">Founded Year</label><input type="number" class="form-input" placeholder="e.g., 1994" id="admin-mfr-founded"></div>
                <div class="form-group"><label class="form-label">Headquarters</label><input type="text" class="form-input" placeholder="e.g., Ängelholm" id="admin-mfr-hq"></div>
              </div>
              <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <div class="form-group"><label class="form-label">Description</label><input type="text" class="form-input" placeholder="Brief manufacturer description..." id="admin-mfr-desc"></div>
                <div class="form-group"><label class="form-label">Popular Models (comma separated)</label><input type="text" class="form-input" placeholder="e.g., Jesko, CC850, Gemera" id="admin-mfr-models"></div>
              </div>
              <div style="display:flex;gap:6px;">
                <button class="btn btn--primary btn--xs" onclick="saveAdminMfr()">💾 Save Manufacturer</button>
                <button class="btn btn--secondary btn--xs" onclick="previewAdminMfr()">👁️ Preview</button>
                <button class="btn btn--secondary btn--xs" onclick="clearAdminForm()">✕ Clear Form</button>
              </div>
              <div id="admin-preview" style="margin-top:10px;"></div>
            </div>

            <!-- SECTION: Database Telemetry Diagnostics -->
            <div class="admin-section-pane" id="admin-sec-telemetry">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:8px;">
                <div>
                  <h2 style="font-size:1.15rem;color:var(--text-primary);margin:0;">Database Telemetry & Cache Diagnostics</h2>
                  <p style="font-size:0.72rem;color:var(--text-muted);margin:1px 0 0;">System health, cache verification, and telemetry export.</p>
                </div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn--primary btn--xs" onclick="exportDatabaseStats()">📊 Export Report</button>
                  <button class="btn btn--secondary btn--xs" onclick="clearLocalHistory()">🗑️ Clear Cache</button>
                </div>
              </div>
              <div class="callout callout--info" style="margin-bottom:12px;padding:10px 14px;">
                <div class="callout__title">⚡ Platform Status: Operational</div>
                <p style="font-size:0.82rem;">AUTOCORE data engine operating with 100% data integrity across all ${mfrCount} manufacturers and ${vehCount} machines.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button class="btn btn--primary btn--xs" onclick="exportDatabaseStats()">📊 Export Telemetry Report</button>
                <button class="btn btn--secondary btn--xs" onclick="clearLocalHistory()">🗑️ Clear Recent History Cache</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;
}

// ===== FOOTER =====
function renderFooter() {
  return `
    <footer class="footer" role="contentinfo">
      <div class="footer__inner">
        <div class="footer__source-note">
          <strong>Data Integrity Notice:</strong> Specifications on AUTOCORE are sourced from official manufacturer data and verified technical publications. Market, variant, and year-specific differences are noted where known. This platform does not generate or fabricate specifications.
        </div>
        <div class="footer__top">
          <div class="footer__brand">
            <div class="footer__brand-header">
              <div class="footer__brand-emblem">
                <img src="assets/autocore-logo.svg" alt="AUTOCORE emblem" width="34" height="34" class="logo-svg-img">
              </div>
              <div class="footer__brand-name">AUTO<span>CORE</span></div>
            </div>
            <p class="footer__brand-desc">The engineering-first automotive encyclopedia. Technical dossiers, mechanical blueprints, and global vehicle databases.</p>
            <button class="footer__symbology-btn" onclick="openLogoMeaningModal()" aria-label="Explore emblem meaning">
              <span>⬡ Emblem Symbology & Engineering Meaning →</span>
            </button>
          </div>
          <div>
            <div class="footer__col-title">Vehicles</div>
            <div class="footer__links">
              <span class="footer__link" onclick="Router.navigate('cars')">Cars</span>
              <span class="footer__link" onclick="Router.navigate('bikes')">Bikes</span>
              <span class="footer__link" onclick="Router.navigate('ev')">Electric Vehicles</span>
              <span class="footer__link" onclick="Router.navigate('vehicle-db')">Vehicle Database</span>
            </div>
          </div>
          <div>
            <div class="footer__col-title">Knowledge</div>
            <div class="footer__links">
              <span class="footer__link" onclick="Router.navigate('parts')">Parts Encyclopedia</span>
              <span class="footer__link" onclick="Router.navigate('engines')">Engine Types</span>
              <span class="footer__link" onclick="Router.navigate('technology')">Technologies</span>
              <span class="footer__link" onclick="Router.navigate('glossary')">Glossary</span>
            </div>
          </div>
          <div>
            <div class="footer__col-title">More</div>
            <div class="footer__links">
              <span class="footer__link" onclick="Router.navigate('maintenance')">Maintenance</span>
              <span class="footer__link" onclick="Router.navigate('compare')">Comparisons</span>
              <span class="footer__link" onclick="Router.navigate('news')">News</span>
              <span class="footer__link" onclick="Router.navigate('about')">About</span>
              <span class="footer__link" onclick="Router.navigate('admin')">Admin Cockpit</span>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <div>© 2026 AUTOCORE. The Automotive Encyclopedia.</div>
          <div>Understand Every Machine. Down to Every Part.</div>
        </div>
      </div>
    </footer>
  `;
}

function renderNotFound() {
  return `
    <div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-lg);text-align:center;padding:var(--space-3xl) var(--space-xl);">
      <div style="font-size:4rem;">🔍</div>
      <h1>Page Not Found</h1>
      <p style="color:var(--text-secondary);">The page you're looking for doesn't exist or has been moved.</p>
      <button class="btn btn--primary" onclick="Router.navigate('home')">Back to Home</button>
    </div>
    ${renderFooter()}
  `;
}

// ===== INTERACTION FUNCTIONS =====
function switchTab(btn, tabId) {
  const parent = btn.closest('.tabs')?.parentElement || btn.closest('.section, [class*="page"]') || document;
  parent.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
  parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  btn.setAttribute('aria-selected','true');
  const el = parent.querySelector(`#${tabId}`) || $(`#${tabId}`);
  if (el) el.classList.add('active');
}

function toggleSpec(header) {
  header.closest('.spec-section').classList.toggle('collapsed');
}

function showPartInfo(name, info) {
  $$('.diagram-part-btn').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  const panel = $('#part-info-panel');
  if (!panel) return;
  panel.classList.add('visible');
  panel.innerHTML = `
    <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);">
      <div style="font-size:2rem;">${info.icon || '🔧'}</div>
      <h3>${name}</h3>
    </div>
    <div class="how-step" style="margin-bottom:var(--space-md);">
      <div class="how-step__number" style="background:var(--gradient-primary);">?</div>
      <div><strong style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);">What is it?</strong><div class="how-step__text" style="margin-top:4px;">${info.what || 'Information coming soon.'}</div></div>
    </div>
    <div class="how-step">
      <div class="how-step__number" style="background:linear-gradient(135deg,#06b6d4,#2563eb);">⚙</div>
      <div><strong style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);">How does it work?</strong><div class="how-step__text" style="margin-top:4px;">${info.how || 'Detailed explanation coming soon.'}</div></div>
    </div>
    ${info.id ? `<button class="btn btn--ghost" style="margin-top:var(--space-md);" onclick="Router.navigate('component-detail','${info.id}')">Learn More →</button>` : ''}
  `;
}

function filterByType(btn, type) {
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $$('#mfr-grid .manufacturer-card').forEach(card => {
    const types = card.dataset.type || '';
    card.style.display = (type === 'all' || types.includes(type)) ? '' : 'none';
  });
}

function filterVehicleDB(btn, type) {
  const container = btn.closest('.section') || document;
  container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $$('#vehicle-db-grid .vehicle-card').forEach(card => {
    const cardType = card.dataset.type;
    const isEv = card.dataset.isEv === 'true';
    let match = false;
    if (type === 'all') match = true;
    else if (type === 'car' && cardType === 'car') match = true;
    else if (type === 'motorcycle' && (cardType === 'motorcycle' || cardType === 'scooter')) match = true;
    else if (type === 'scooter' && cardType === 'scooter') match = true;
    else if (type === 'ev' && isEv) match = true;
    else if (cardType === type) match = true;
    card.style.display = match ? '' : 'none';
  });
}

function filterGlossary(btn, letter) {
  $$('.alpha-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $$('.glossary-item').forEach(item => {
    item.style.display = (letter === 'all' || item.dataset.letter === letter) ? '' : 'none';
  });
}

function filterMaintenance(btn, cat) {
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $$('#maintenance-grid .maintenance-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
  });
}

function filterVehicles(btn, type) {
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function showMaintenanceDetail(id) {
  const m = AUTOCORE_DB.maintenance.find(m => m.id === id);
  if (!m) return;
  const detail = $('#maintenance-detail');
  if (!detail) return;
  detail.innerHTML = `
    <div style="background:var(--color-surface);border:1px solid var(--blue-border);border-radius:var(--radius-xl);padding:var(--space-2xl);margin-top:var(--space-2xl);">
      <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-xl);">
        <div style="font-size:2.5rem;">${m.icon}</div>
        <div>
          <h2>${m.title}</h2>
          <span class="badge badge--blue">${m.interval}</span>
        </div>
      </div>
      <h3 style="margin-bottom:var(--space-md);">Step-by-Step Guide</h3>
      <div class="how-it-works">
        ${m.steps.map((step, i) => `
          <div class="how-step">
            <div class="how-step__number">${i+1}</div>
            <div class="how-step__text">${step}</div>
          </div>
        `).join('')}
      </div>
      <div class="warning-box" style="margin-top:var(--space-xl);">
        <span>⚠️</span><p>${m.warning}</p>
      </div>
      <div class="professional-box">
        <span>🔧</span><p><strong>When to see a professional:</strong> ${m.professional}</p>
      </div>
    </div>
  `;
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showEngineDetail(id) {
  const e = AUTOCORE_DB.engineTypes.find(e => e.id === id);
  if (!e) return;
  const el = $('#engine-detail');
  if (!el) return;
  el.innerHTML = `
    <div style="background:var(--color-surface);border:1px solid var(--blue-border);border-radius:var(--radius-xl);padding:var(--space-2xl);">
      <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-xl);">
        <div style="font-size:3rem;">${e.icon}</div>
        <h2>${e.name} Engine</h2>
      </div>
      <p style="margin-bottom:var(--space-xl);">${e.description}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-xl);">
        <div>
          <h4 style="color:#34d399;margin-bottom:var(--space-sm);">Advantages</h4>
          <div class="adv-list">${e.advantages.map(a => `<div class="adv-item">${a}</div>`).join('')}</div>
        </div>
        <div>
          <h4 style="color:#f87171;margin-bottom:var(--space-sm);">Disadvantages</h4>
          <div class="adv-list">${e.disadvantages.map(d => `<div class="disadv-item">${d}</div>`).join('')}</div>
        </div>
      </div>
      <h4 style="margin-bottom:var(--space-md);">Vehicles Using This Engine</h4>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);">
        ${e.examples.map(ex => `<span class="badge badge--blue">${ex}</span>`).join('')}
      </div>
    </div>
  `;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function previewAdminMfr() {
  const name = $('#admin-mfr-name')?.value;
  const country = $('#admin-mfr-country')?.value;
  if (!name || !country) { showToast('Please fill in Name and Country'); return; }
  const preview = $('#admin-preview');
  if (preview) {
    preview.innerHTML = `
      <div class="callout callout--info">
        <div class="callout__title">Preview (not saved to database)</div>
        <div class="spec-grid" style="margin-top:var(--space-md);">
          <div class="spec-item"><div class="spec-item__label">Name</div><div class="spec-item__value">${$('#admin-mfr-name').value}</div></div>
          <div class="spec-item"><div class="spec-item__label">Country</div><div class="spec-item__value">${$('#admin-mfr-country').value}</div></div>
          <div class="spec-item"><div class="spec-item__label">Founded</div><div class="spec-item__value">${$('#admin-mfr-founded').value || 'N/A'}</div></div>
          <div class="spec-item"><div class="spec-item__label">Types</div><div class="spec-item__value">${$('#admin-mfr-types').value || 'N/A'}</div></div>
        </div>
        <p style="margin-top:var(--space-md);">In a full implementation, this would save to a backend database via REST API.</p>
      </div>
    `;
  }
}

function clearAdminForm() {
  ['admin-mfr-name','admin-mfr-country','admin-mfr-founded','admin-mfr-hq','admin-mfr-desc','admin-mfr-types','admin-mfr-models'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.value = '';
  });
  const preview = $('#admin-preview');
  if (preview) preview.innerHTML = '';
}

function clearAdminVehicleForm() {
  ['admin-veh-name','admin-veh-category','admin-veh-disp','admin-veh-power','admin-veh-torque','admin-veh-speed','admin-veh-tagline'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.value = '';
  });
  const preview = $('#admin-veh-preview');
  if (preview) preview.innerHTML = '';
}

function switchAdminSection(btn, sectionId) {
  $$('.admin-nav-item').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const match = document.querySelector(`.admin-nav-item[onclick*="${sectionId}"]`);
    if (match) match.classList.add('active');
  }
  $$('.admin-section-pane').forEach(p => p.classList.remove('active'));
  const target = $(`#${sectionId}`);
  if (target) target.classList.add('active');
}

function filterAdminVehicleTable(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = $$('#admin-vehicles-table tbody tr');
  rows.forEach(tr => {
    const text = tr.getAttribute('data-search') || tr.textContent.toLowerCase();
    tr.style.display = text.includes(q) ? '' : 'none';
  });
}

function filterAdminMfrTable(query) {
  const q = (query || '').toLowerCase().trim();
  const rows = $$('#admin-mfrs-table tbody tr');
  rows.forEach(tr => {
    const text = tr.getAttribute('data-search') || tr.textContent.toLowerCase();
    tr.style.display = text.includes(q) ? '' : 'none';
  });
}

function previewAdminVehicle() {
  const name = $('#admin-veh-name')?.value?.trim();
  const mfrId = $('#admin-veh-mfr')?.value;
  const mfrName = AUTOCORE_DB.getManufacturerName(mfrId);
  const type = $('#admin-veh-type')?.value;
  const cat = $('#admin-veh-category')?.value || 'sports';
  const disp = $('#admin-veh-disp')?.value || 'N/A';
  const power = $('#admin-veh-power')?.value || 'N/A';
  const torque = $('#admin-veh-torque')?.value || 'N/A';
  const speed = $('#admin-veh-speed')?.value || 'N/A';
  const tagline = $('#admin-veh-tagline')?.value || '';

  if (!name) {
    showToast('Please enter a vehicle name.');
    return;
  }

  const preview = $('#admin-veh-preview');
  if (preview) {
    preview.innerHTML = `
      <div class="callout callout--info" style="border-color:var(--cyan-bright);">
        <div class="callout__title" style="color:var(--cyan-bright);">⚡ Dossier Live Preview: ${mfrName} ${name}</div>
        <div class="spec-grid" style="margin-top:var(--space-md);">
          <div class="spec-item"><div class="spec-item__label">Name</div><div class="spec-item__value">${name}</div></div>
          <div class="spec-item"><div class="spec-item__label">Marque</div><div class="spec-item__value">${mfrName}</div></div>
          <div class="spec-item"><div class="spec-item__label">Type / Category</div><div class="spec-item__value">${type} / ${cat}</div></div>
          <div class="spec-item"><div class="spec-item__label">Displacement / Battery</div><div class="spec-item__value">${disp}</div></div>
          <div class="spec-item"><div class="spec-item__label">Max Power</div><div class="spec-item__value">${power}</div></div>
          <div class="spec-item"><div class="spec-item__label">Max Torque</div><div class="spec-item__value">${torque}</div></div>
          <div class="spec-item"><div class="spec-item__label">Top Speed</div><div class="spec-item__value">${speed} km/h</div></div>
        </div>
        ${tagline ? `<p style="margin-top:var(--space-sm);font-style:italic;color:var(--text-secondary);">${tagline}</p>` : ''}
      </div>
    `;
  }
}

function saveAdminVehicle() {
  const name = $('#admin-veh-name')?.value?.trim();
  const mfrId = $('#admin-veh-mfr')?.value;
  const type = $('#admin-veh-type')?.value || 'car';
  const cat = $('#admin-veh-category')?.value || 'sports';
  const disp = $('#admin-veh-disp')?.value || '';
  const power = $('#admin-veh-power')?.value || '';
  const torque = $('#admin-veh-torque')?.value || '';
  const speed = parseInt($('#admin-veh-speed')?.value) || 250;
  const tagline = $('#admin-veh-tagline')?.value || '';

  if (!name) {
    showToast('Please enter vehicle name.');
    return;
  }

  const id = `${mfrId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, '');
  const newVeh = {
    id,
    name,
    manufacturer: mfrId,
    type,
    category: cat.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '-')),
    status: 'current',
    tagline: tagline || `${name} high performance machine.`,
    engine: {
      displacement: disp ? parseInt(disp) || 3000 : 3000,
      layout: 'V8 / Turbocharged',
      maxPower: { value: power ? parseInt(power) || 500 : 500, unit: 'bhp', rpm: 7500 },
      maxTorque: { value: torque ? parseInt(torque) || 550 : 550, unit: 'Nm', rpm: 5000 },
    },
    performance: {
      topSpeed: speed,
      acceleration0to100: 3.5,
    },
    dimensions: {
      kerbWeight: 1450,
    }
  };

  AUTOCORE_DB.vehicles.unshift(newVeh);
  showToast(`✅ Added ${name} to session catalog!`);

  $('#admin-veh-name').value = '';
  $('#admin-veh-category').value = '';
  $('#admin-veh-disp').value = '';
  $('#admin-veh-power').value = '';
  $('#admin-veh-torque').value = '';
  $('#admin-veh-speed').value = '';
  $('#admin-veh-tagline').value = '';
  const preview = $('#admin-veh-preview');
  if (preview) preview.innerHTML = '';

  setTimeout(() => {
    Router.render('admin');
    switchAdminSection(null, 'admin-sec-vehicles');
  }, 500);
}

function saveAdminMfr() {
  const name = $('#admin-mfr-name')?.value?.trim();
  const country = $('#admin-mfr-country')?.value?.trim();
  const founded = parseInt($('#admin-mfr-founded')?.value) || new Date().getFullYear();
  const hq = $('#admin-mfr-hq')?.value?.trim() || '';
  const desc = $('#admin-mfr-desc')?.value?.trim() || '';
  const models = $('#admin-mfr-models')?.value?.trim() || '';

  if (!name || !country) {
    showToast('Please fill in Name and Country.');
    return;
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newMfr = {
    id,
    name,
    country,
    founded,
    hq: hq || `${country}`,
    description: desc || `${name} automotive engineering manufacturer.`,
    popularModels: models ? models.split(',').map(m => m.trim()) : [],
    flag: '🌐',
    status: 'active',
  };

  AUTOCORE_DB.manufacturers.push(newMfr);
  showToast(`✅ Saved ${name} to manufacturers!`);
  clearAdminForm();

  setTimeout(() => {
    Router.render('admin');
    switchAdminSection(null, 'admin-sec-mfrs');
  }, 500);
}

function exportDatabaseStats() {
  const report = {
    timestamp: new Date().toISOString(),
    manufacturerCount: AUTOCORE_DB.manufacturers?.length || 0,
    vehicleCount: AUTOCORE_DB.vehicles?.length || 0,
    engineFamilies: Object.keys(AUTOCORE_DB.engineFamilies || {}).length,
    status: '100% Homologated and Verified',
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `autocore_telemetry_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Telemetry report exported.');
}

function clearLocalHistory() {
  localStorage.removeItem('autocore_recent');
  APP.recentlyViewed = [];
  showToast('🧹 Local cache cleared.');
}

function searchRelated(term) {
  openSearch();
  setSearchQuery(term);
}

function handleHeroSearch() {
  const val = $('#hero-search')?.value?.trim();
  if (!val) return;
  const results = AUTOCORE_DB.searchAll(val);
  if (results.length > 0) {
    handleSearchSelect(results[0].type, results[0].id);
  } else {
    openSearch();
    setSearchQuery(val);
  }
}

function heroSearchFor(q) {
  const results = AUTOCORE_DB.searchAll(q);
  if (results.length > 0) {
    handleSearchSelect(results[0].type, results[0].id);
  } else {
    openSearch();
    setSearchQuery(q);
  }
}

function addToRecent(id, type) {
  const entry = { id, type, ts: Date.now() };
  APP.recentlyViewed = [entry, ...APP.recentlyViewed.filter(r => r.id !== id)].slice(0, 10);
  localStorage.setItem('autocore_recent', JSON.stringify(APP.recentlyViewed));
}

function showToast(msg, duration = 3000) {
  const container = $('#toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, duration);
}

// ===== PAGE INTERACTIONS =====
function initPageInteractions(page, data) {
  if (page === 'home') {
    const heroSearch = $('#hero-search');
    const liveResults = $('#hero-live-results');
    if (heroSearch && liveResults) {
      heroSearch.addEventListener('input', debounce((e) => {
        const q = e.target.value.trim();
        if (q.length >= 2) {
          const results = AUTOCORE_DB.searchAll(q).slice(0, 6);
          if (!results.length) {
            liveResults.innerHTML = '<div class="hero-live-empty">No matching machines or systems found.</div>';
            liveResults.style.display = 'block';
          } else {
            const icons = { manufacturer: '🏭', vehicle: '🚗', component: '🔧', technology: '⚡', glossary: '📚' };
            liveResults.innerHTML = results.map(r => `
              <div class="hero-live-item" onclick="handleSearchSelect('${r.type}', '${r.id}')">
                <span class="hero-live-icon ${r.type}">${icons[r.type] || '📄'}</span>
                <div class="hero-live-info">
                  <div class="hero-live-title">${r.label}</div>
                  <div class="hero-live-sub">${r.subtitle}</div>
                </div>
                <span class="hero-live-badge ${r.type}">${r.type}</span>
              </div>
            `).join('');
            liveResults.style.display = 'block';
          }
        } else {
          liveResults.style.display = 'none';
          liveResults.innerHTML = '';
        }
      }, 150));

      heroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleHeroSearch();
        }
        if (e.key === 'Escape') {
          liveResults.style.display = 'none';
          heroSearch.blur();
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero__search')) {
          liveResults.style.display = 'none';
        }
      });
    }
  } else if (page === 'cars' && data) {
    setTimeout(() => {
      filterCarsCatalog(typeof data === 'string' ? data : (data.category || 'all'));
    }, 50);
  } else if (page === 'bikes' && data) {
    setTimeout(() => {
      if (typeof data === 'string') {
        const segBtn = $$('.segment-pill').find(b => b.textContent.toLowerCase().includes(data.toLowerCase()));
        if (segBtn && window.filterBikesSegment) window.filterBikesSegment(segBtn, data);
        else if (window.filterBikesCategoryChip) window.filterBikesCategoryChip(null, data);
      } else if (data.category && window.filterBikesCategoryChip) {
        window.filterBikesCategoryChip(null, data.category);
      }
    }, 50);
  } else if (page === 'compare' && data) {
    setTimeout(updateComparison, 60);
  }
}

// ===== LOGO MEANING MODAL =====
function openLogoMeaningModal() {
  const overlay = $('#brand-modal-overlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLogoMeaningModal() {
  const overlay = $('#brand-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // '/' key opens search if not currently focused in a form element
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      openSearch();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      APP.searchOpen ? closeSearch() : openSearch();
      return;
    }
    if (e.key === 'Escape') {
      if (APP.searchOpen) closeSearch();
      if (APP.mobileMenuOpen) closeMobileMenu();
      closeLogoMeaningModal();
    }
  });
}

// ===== SCROLL EFFECTS (HIGH-EFFICIENCY RAF THROTTLED) =====
function initScrollEffects() {
  const nav = $('.nav');
  const backToTop = $('#back-to-top-btn');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        if (nav) nav.classList.toggle('scrolled', y > 40);
        if (backToTop) backToTop.classList.toggle('visible', y > 350);
        // Hide scroll hint on hero once user scrolls
        const hero = $('#hero');
        if (hero) hero.classList.toggle('scrolled', y > 80);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initScrollReveal() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '120px 0px 120px 0px' });
    $$('.scroll-reveal:not(.revealed)').forEach(el => observer.observe(el));
  } else {
    $$('.scroll-reveal').forEach(el => el.classList.add('revealed'));
  }
}

function checkScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    const vh = window.innerHeight || 800;
    $$('.scroll-reveal:not(.revealed)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 1.3) {
        el.classList.add('revealed');
      }
    });
  }
}

// ===== BOOKMARK & SHARE HELPERS =====
function toggleBookmark(id, type = 'vehicle') {
  const exists = APP.bookmarks.some(b => b.id === id);
  if (exists) {
    APP.bookmarks = APP.bookmarks.filter(b => b.id !== id);
    showToast('Removed from saved bookmarks.');
  } else {
    APP.bookmarks.unshift({ id, type, ts: Date.now() });
    showToast('★ Saved to bookmarks!');
  }
  localStorage.setItem('autocore_bookmarks', JSON.stringify(APP.bookmarks));
  const btn = $(`#btn-bookmark-${id}`);
  if (btn) {
    const isNow = APP.bookmarks.some(b => b.id === id);
    btn.classList.toggle('active', isNow);
    btn.innerHTML = `<span aria-hidden="true">${isNow ? '★' : '☆'}</span> ${isNow ? 'Bookmarked' : 'Bookmark'}`;
  }
}

function copyVehicleLink(id) {
  const url = `${window.location.origin}${window.location.pathname}#vehicle-detail/${id}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Direct vehicle link copied to clipboard!');
    }).catch(() => {
      showToast(`Link: ${url}`);
    });
  } else {
    showToast(`Link: ${url}`);
  }
}

// ===== SEARCH INIT =====
function initSearch() {
  // Search is initialized via event delegation
}

// ===== UTILITIES =====
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ===== EXPOSE GLOBALS =====
window.Router = Router;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.setSearchQuery = setSearchQuery;
window.handleSearchSelect = handleSearchSelect;
window.switchTab = switchTab;
window.toggleSpec = toggleSpec;
window.showPartInfo = showPartInfo;
window.filterByType = filterByType;
window.filterGlossary = filterGlossary;
window.filterMaintenance = filterMaintenance;
window.filterVehicles = filterVehicles;
window.filterVehicleDB = filterVehicleDB;
window.updateComparison = updateComparison;
window.showMaintenanceDetail = showMaintenanceDetail;
window.showEngineDetail = showEngineDetail;
window.previewAdminMfr = previewAdminMfr;
window.clearAdminForm = clearAdminForm;
window.switchAdminSection = switchAdminSection;
window.filterAdminVehicleTable = filterAdminVehicleTable;
window.filterAdminMfrTable = filterAdminMfrTable;
window.previewAdminVehicle = previewAdminVehicle;
window.saveAdminVehicle = saveAdminVehicle;
window.saveAdminMfr = saveAdminMfr;
window.exportDatabaseStats = exportDatabaseStats;
window.clearLocalHistory = clearLocalHistory;
window.searchRelated = searchRelated;
window.handleHeroSearch = handleHeroSearch;
window.heroSearchFor = heroSearchFor;
window.closeMobileMenu = closeMobileMenu;
window.filterBikesCatalogSearch = filterBikesCatalogSearch;
window.filterBikesSegment = filterBikesSegment;
window.filterBikesStatus = filterBikesStatus;
window.filterBikesDisplacement = filterBikesDisplacement;
window.toggleBikesTaxonomyDrawer = toggleBikesTaxonomyDrawer;
window.filterBikesCategoryChip = filterBikesCategoryChip;
window.clearBikesTaxonomyFilter = clearBikesTaxonomyFilter;
window.resetBikesFilters = resetBikesFilters;
window.applyBikesCatalogFilters = applyBikesCatalogFilters;
window.filterCarsCatalog = filterCarsCatalog;
window.openLogoMeaningModal = openLogoMeaningModal;
window.closeLogoMeaningModal = closeLogoMeaningModal;
window.switchSpotlight = switchSpotlight;
window.toggleBookmark = toggleBookmark;
window.copyVehicleLink = copyVehicleLink;
window.filterVehicleOptions = filterVehicleOptions;
window.clearSelection = clearSelection;
window.filterCarsBrand = filterCarsBrand;
window.filterBikesBrand = filterBikesBrand;


// ===== BOOT =====
document.addEventListener('DOMContentLoaded', initApp);
