/**
 * AUTOCORE — Data Access Layer
 * Post-load data aggregation, deduplication, and utility extensions.
 * Loaded after all data scripts, before app.js.
 *
 * Responsibilities:
 *  1. Ensure AUTOCORE_DB.vehicles array exists and de-duplicate entries.
 *  2. Register cars-catalog vehicles into AUTOCORE_DB (if not already pushed).
 *  3. Merge / extend the DB with any missing utilities.
 *  4. Expose a global addToRecent() helper (called by vehicle detail renderer).
 *  5. Provide showToast() utility used throughout app.js.
 */

'use strict';

(function () {

  // ── Safety guard ─────────────────────────────────────────────────────────────
  if (typeof AUTOCORE_DB === 'undefined') {
    console.error('[AUTOCORE] data-access.js: AUTOCORE_DB not found. Ensure database.js loads first.');
    return;
  }

  // ── 1. Ensure vehicles array exists ──────────────────────────────────────────
  if (!Array.isArray(AUTOCORE_DB.vehicles)) {
    AUTOCORE_DB.vehicles = [];
  }

  // ── 2. De-duplicate vehicles by id (manufacturer scripts may overlap) ─────────
  (function dedupeVehicles() {
    const seen = new Set();
    AUTOCORE_DB.vehicles = AUTOCORE_DB.vehicles.filter(v => {
      if (!v || !v.id) return false;
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  })();

  // ── 3. Ensure engineFamilies is a plain object ────────────────────────────────
  if (!AUTOCORE_DB.engineFamilies || typeof AUTOCORE_DB.engineFamilies !== 'object') {
    AUTOCORE_DB.engineFamilies = {};
  }

  // ── 4. Inject manufacturerEngines into individual manufacturers where missing ─
  AUTOCORE_DB.manufacturers.forEach(mfr => {
    if (!mfr.engineFamilies && AUTOCORE_DB.engineFamilies) {
      // Collect engine families whose IDs are referenced by this manufacturer's vehicles
      const mfrVehicles = AUTOCORE_DB.vehicles.filter(v => v.manufacturer === mfr.id);
      const engineIds = new Set(mfrVehicles.map(v => v.engineId).filter(Boolean));
      if (engineIds.size > 0) {
        mfr.engineFamilies = {};
        engineIds.forEach(eid => {
          if (AUTOCORE_DB.engineFamilies[eid]) {
            mfr.engineFamilies[eid] = AUTOCORE_DB.engineFamilies[eid];
          }
        });
      }
    }
  });

  // ── 5. Extended search: also search vehicle taglines & descriptions ───────────
  const _originalSearchAll = AUTOCORE_DB.searchAll.bind(AUTOCORE_DB);
  AUTOCORE_DB.searchAll = function (query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const base = _originalSearchAll(query);
    const baseIds = new Set(base.map(r => r.id));

    // Extra pass: match on tagline / description fields
    this.vehicles.forEach(v => {
      if (baseIds.has(v.id)) return;
      const haystack = [
        v.name, v.tagline, v.description, v.generation,
        this.getManufacturerName(v.manufacturer),
      ].filter(Boolean).join(' ').toLowerCase();
      if (haystack.includes(q)) {
        base.push({
          type: 'vehicle',
          id: v.id,
          label: `${this.getManufacturerName(v.manufacturer)} ${v.name}`,
          subtitle: this.getCategoryDisplay(v.category) || v.type,
          score: 1,
        });
      }
    });

    return base.sort((a, b) => b.score - a.score).slice(0, 12);
  };

  // ── 6. Additional DB helpers used by app.js ───────────────────────────────────
  if (!AUTOCORE_DB.getEvVehicles) {
    AUTOCORE_DB.getEvVehicles = function () {
      return this.vehicles.filter(v => v.ev || v.fuelType === 'electric');
    };
  }

  if (!AUTOCORE_DB.getCarVehicles) {
    AUTOCORE_DB.getCarVehicles = function () {
      return this.vehicles.filter(v => v.type === 'car');
    };
  }

  if (!AUTOCORE_DB.getBikeVehicles) {
    AUTOCORE_DB.getBikeVehicles = function () {
      return this.vehicles.filter(v => v.type === 'motorcycle' || v.type === 'scooter');
    };
  }

  if (!AUTOCORE_DB.getVehiclesByPriceRange) {
    AUTOCORE_DB.getVehiclesByPriceRange = function (minLakh, maxLakh) {
      return this.vehicles.filter(v => {
        const p = v.price?.india?.min;
        if (!p) return false;
        const lakh = p / 100000;
        return lakh >= minLakh && lakh <= maxLakh;
      });
    };
  }

  if (!AUTOCORE_DB.getRelatedVehicles) {
    AUTOCORE_DB.getRelatedVehicles = function (vehicleId, limit = 4) {
      const v = this.getVehicle(vehicleId);
      if (!v) return [];
      const myCategories = this.getCategoryList(v.category);
      return this.vehicles
        .filter(candidate => {
          if (candidate.id === vehicleId) return false;
          const candidateCats = this.getCategoryList(candidate.category);
          return (
            candidate.manufacturer === v.manufacturer ||
            myCategories.some(c => candidateCats.includes(c))
          );
        })
        .slice(0, limit);
    };
  }

  // ── 7. Stats helper ───────────────────────────────────────────────────────────
  AUTOCORE_DB.getStats = function () {
    return {
      manufacturers: this.manufacturers.length,
      vehicles: this.vehicles.length,
      components: this.components ? this.components.length : 0,
      technologies: this.technologies ? this.technologies.length : 0,
      glossary: this.glossary ? this.glossary.length : 0,
      engineFamilies: Object.keys(this.engineFamilies || {}).length,
      motorcycleCategories: this.motorcycleCategories ? this.motorcycleCategories.length : 0,
    };
  };

  // ── 8. addToRecent — used by renderVehicleDetail in app.js ───────────────────
  //    Defined here so app.js can call it before DOM is fully interactive.
  window.addToRecent = function (id, type = 'vehicle') {
    try {
      let recent = JSON.parse(localStorage.getItem('autocore_recent') || '[]');
      recent = recent.filter(r => r.id !== id);
      recent.unshift({ id, type, ts: Date.now() });
      recent = recent.slice(0, 20); // Keep last 20
      localStorage.setItem('autocore_recent', JSON.stringify(recent));
      // Also update APP state if available
      if (typeof APP !== 'undefined') {
        APP.recentlyViewed = recent;
      }
    } catch (e) {
      // localStorage may be blocked in private browsing — silent fail
    }
  };

  // ── 9. showToast — global toast notification used in app.js ──────────────────
  window.showToast = function (message, type = 'info', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('visible'));
    });
    setTimeout(() => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  };

  // ── 10. Hero search handler ───────────────────────────────────────────────────
  window.handleHeroSearch = function () {
    const input = document.getElementById('hero-search');
    if (!input) return;
    const q = input.value.trim();
    if (!q) return;
    const results = AUTOCORE_DB.searchAll(q);
    if (results.length === 1) {
      const r = results[0];
      if (typeof window.handleSearchSelect === 'function') {
        window.handleSearchSelect(r.type, r.id);
      }
    } else if (results.length > 1) {
      if (typeof window.Router !== 'undefined') {
        window.Router.navigate('vehicle-db');
      }
    } else {
      window.showToast('No results found. Try a different term.', 'info');
    }
  };

  window.heroSearchFor = function (term) {
    const input = document.getElementById('hero-search');
    if (input) {
      input.value = term;
      window.handleHeroSearch();
    }
  };

  // ── 11. Hero search live dropdown ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    const heroInput = document.getElementById('hero-search');
    const liveResults = document.getElementById('hero-live-results');
    if (!heroInput || !liveResults) return;

    const icons = { manufacturer: '🏭', vehicle: '🚗', component: '🔧', technology: '⚡', glossary: '📚' };
    const typeIcons = { motorcycle: '🏍️', car: '🏎️', scooter: '🛵' };

    function debounce(fn, ms) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }

    heroInput.addEventListener('input', debounce(function () {
      const q = heroInput.value.trim();
      if (q.length < 2) {
        liveResults.style.display = 'none';
        liveResults.innerHTML = '';
        return;
      }
      const results = AUTOCORE_DB.searchAll(q);
      if (!results.length) {
        liveResults.innerHTML = '<div class="hero-live-empty">No results found</div>';
        liveResults.style.display = 'block';
        return;
      }
      liveResults.innerHTML = results.slice(0, 8).map(r => {
        const v = r.type === 'vehicle' ? AUTOCORE_DB.getVehicle(r.id) : null;
        const ico = v ? (typeIcons[v.type] || icons.vehicle) : (icons[r.type] || '📄');
        return `
          <div class="hero-live-item" onclick="handleSearchSelect('${r.type}','${r.id}');document.getElementById('hero-live-results').style.display='none';">
            <div class="hero-live-icon">${ico}</div>
            <div class="hero-live-info">
              <div class="hero-live-title">${r.label}</div>
              <div class="hero-live-sub">${r.subtitle}</div>
            </div>
            <span class="hero-live-badge ${r.type}">${r.type}</span>
          </div>
        `;
      }).join('');
      liveResults.style.display = 'block';
    }, 160));

    // Close live dropdown on outside click
    document.addEventListener('click', function (e) {
      if (!heroInput.contains(e.target) && !liveResults.contains(e.target)) {
        liveResults.style.display = 'none';
      }
    });

    heroInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        liveResults.style.display = 'none';
        window.handleHeroSearch();
      }
      if (e.key === 'Escape') {
        liveResults.style.display = 'none';
      }
    });
  });

  // ── 12. Final vehicle count log ───────────────────────────────────────────────
  if (typeof console !== 'undefined') {
    // Deferred to give all scripts a chance to push their vehicles
    setTimeout(() => {
      const stats = AUTOCORE_DB.getStats();
      console.log(
        `%c[AUTOCORE] Data loaded ✓  Manufacturers: ${stats.manufacturers} | Vehicles: ${stats.vehicles} | Components: ${stats.components} | Technologies: ${stats.technologies}`,
        'color:#d4af37;font-weight:700;font-size:12px;'
      );
    }, 0);
  }

})();

