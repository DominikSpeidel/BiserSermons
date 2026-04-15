/* wheel.js — Kirchenjahresrad
 * Zeichnet ein interaktives SVG-Rad mit einem Slice pro Sonntag.
 * Datenquelle: KIRCHENJAHR und SEASON_COLORS aus data.js
 */

(function () {
  'use strict';

  // ── Konfiguration ────────────────────────────────────────────────────────
  const CFG = {
    size: 700,          // SVG-Breite und -Höhe in px
    outerR: 323,        // Außenradius der Slices
    innerR: 125,        // Innenradius (Freiraum in der Mitte)
    startAngle: -90,    // 0° = oben (Advent startet oben)
  };

  const CX = CFG.size / 2;
  const CY = CFG.size / 2;

  let activeYear = 'A';
  let activeSlice = null;

  // Heute als ISO-String "YYYY-MM-DD" (lokale Zeitzone)
  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Ermittelt das aktuell gültige Lesejahr anhand der Datumsbereiche in KIRCHENJAHR.
  // Fällt auf 'A' zurück, wenn kein Jahr passt.
  function getCurrentYearKey() {
    const today = todayISO();
    for (const key of Object.keys(KIRCHENJAHR)) {
      const days = KIRCHENJAHR[key] && KIRCHENJAHR[key].days;
      if (!days || !days.length) continue;
      const first = days[0].date;
      const last  = days[days.length - 1].date;
      if (today >= first && today <= last) return key;
    }
    return 'A';
  }

  // Index des kommenden Sonntags (date >= heute). -1 wenn keiner mehr.
  function findUpcomingSundayIdx(days) {
    const today = todayISO();
    for (let i = 0; i < days.length; i++) {
      if (days[i].date >= today) return i;
    }
    return -1;
  }

  // ── Hilfsfunktionen ──────────────────────────────────────────────────────
  function toRad(deg) { return (deg * Math.PI) / 180; }

  function lightenHex(hex, amount) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.round(r+(255-r)*amount)},${Math.round(g+(255-g)*amount)},${Math.round(b+(255-b)*amount)})`;
  }

  function polarToXY(cx, cy, r, angleDeg) {
    const rad = toRad(angleDeg);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function slicePath(cx, cy, innerR, outerR, startDeg, endDeg) {
    const p1 = polarToXY(cx, cy, outerR, startDeg);
    const p2 = polarToXY(cx, cy, outerR, endDeg);
    const p3 = polarToXY(cx, cy, innerR, endDeg);
    const p4 = polarToXY(cx, cy, innerR, startDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x} ${p4.y}`,
      'Z',
    ].join(' ');
  }

  function formatDate(iso) {
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  }

  // ── SVG-Namespace ────────────────────────────────────────────────────────
  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  // ── Festkreis-Grenzen dynamisch aus Daten berechnen ─────────────────────
  function computeFestkreisBounds(days) {
    const bounds = { christmas: [null, null], easter: [null, null] };
    for (let i = 0; i < days.length; i++) {
      if (days[i].season === 'christmas') {
        if (bounds.christmas[0] === null) bounds.christmas[0] = i;
        bounds.christmas[1] = i;
      }
      if (days[i].season === 'easter') {
        if (bounds.easter[0] === null) bounds.easter[0] = i;
        bounds.easter[1] = i;
      }
    }
    return bounds;
  }

  // ── Tooltip ──────────────────────────────────────────────────────────────
  let tooltip = null;

  function showTooltip(e, sunday) {
    if (!tooltip) return;
    const dateStr = formatDate(sunday.date);
    tooltip.querySelector('.tt-label').textContent = sunday.label;
    tooltip.querySelector('.tt-date').textContent = dateStr;
    tooltip.classList.add('visible');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    if (!tooltip) return;
    const margin = 16;
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    let left = e.clientX + margin;
    let top  = e.clientY + margin;
    if (left + tw > window.innerWidth  - margin) left = e.clientX - tw - margin;
    if (top  + th > window.innerHeight - margin) top  = e.clientY - th - margin;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove('visible');
  }

  window.addEventListener('scroll', hideTooltip, { passive: true });

  // ── Info-Panel ───────────────────────────────────────────────────────────
  let infoPanel = null;

  function showInfoPanel(sunday) {
    if (!infoPanel) return;
    const seasonMeta = SEASON_COLORS[sunday.season];
    infoPanel.querySelector('.ip-label').textContent = sunday.label;
    infoPanel.querySelector('.ip-date').textContent  = formatDate(sunday.date);
    infoPanel.querySelector('.ip-season').textContent = seasonMeta ? seasonMeta.label : '';

    const lesungEl = infoPanel.querySelector('.ip-lesung');
    if (lesungEl) {
      lesungEl.textContent = sunday.lesung ? `Lesung: ${sunday.lesung}` : '\u00A0';
      lesungEl.style.visibility = sunday.lesung ? 'visible' : 'hidden';
    }

    const predigtDateEl = infoPanel.querySelector('.ip-predigt-date');
    if (predigtDateEl) {
      predigtDateEl.textContent = sunday.predigtDate ? `Predigt gehalten am ${formatDate(sunday.predigtDate)}` : '\u00A0';
      predigtDateEl.style.visibility = sunday.predigtDate ? 'visible' : 'hidden';
    }

    const predigtBtn = infoPanel.querySelector('#info-predigt');
    if (predigtBtn) {
      predigtBtn.dataset.url = sunday.url || '';
      predigtBtn.classList.toggle('no-url', !sunday.url);
      predigtBtn.textContent = sunday.url ? 'Zur Predigt' : 'Keine Predigtaufnahme verfügbar';
    }

    const dot = infoPanel.querySelector('.ip-color-dot');
    if (dot && seasonMeta) {
      dot.style.background = seasonMeta.fill;
      dot.style.border = `2px solid ${seasonMeta.stroke}`;
    }

    infoPanel.classList.add('visible');
  }

  function hideInfoPanel() {
    if (infoPanel) infoPanel.classList.remove('visible', 'is-upcoming');
  }

  // ── Rad zeichnen ─────────────────────────────────────────────────────────
  function buildWheel(days) {
    const svgContainer = document.getElementById('wheel-container');
    if (!svgContainer) return;

    // Clearing: altes Rad + Legende entfernen, Info-Panel zurücksetzen
    svgContainer.innerHTML = '';
    activeSlice = null;
    const legendEl = document.getElementById('legend');
    if (legendEl) legendEl.innerHTML = '';
    if (infoPanel) infoPanel.classList.remove('visible', 'is-upcoming');

    tooltip   = document.getElementById('tooltip');
    infoPanel = document.getElementById('info-panel');

    const TOTAL     = days.length;
    const SLICE_DEG = 360 / TOTAL;

    const yearMeta = KIRCHENJAHR[activeYear];

    const svg = svgEl('svg', {
      viewBox: `0 0 ${CFG.size} ${CFG.size}`,
      class: 'wheel-svg',
      role: 'img',
      'aria-label': `Kirchenjahresrad ${yearMeta ? yearMeta.yearRange : ''}`,
    });

    // ── Defs (Farbverläufe) ──────────────────────────────────────────────
    const defs = svgEl('defs', {});
    svg.appendChild(defs);

    // ── Slices ───────────────────────────────────────────────────────────
    const slicesGroup = svgEl('g', { class: 'slices' });

    days.forEach((sunday, idx) => {
      const startDeg = CFG.startAngle + idx * SLICE_DEG;
      const endDeg   = startDeg + SLICE_DEG;
      const colors   = SEASON_COLORS[sunday.season] || SEASON_COLORS.ordinary;

      const path = svgEl('path', {
        d: slicePath(CX, CY, CFG.innerR, CFG.outerR, startDeg, endDeg),
        fill: colors.fill,
        stroke: colors.stroke,
        'stroke-width': '1.5',
        class: 'slice',
        'data-idx': idx,
        'data-orig-fill': colors.fill,
        tabindex: '0',
        role: 'button',
        'aria-label': `${sunday.label}, ${formatDate(sunday.date)}`,
      });

      path.style.transformOrigin = `${CX}px ${CY}px`;
      slicesGroup.appendChild(path);
    });

    // Event-Delegation auf Slice-Gruppe
    function getSliceData(target) {
      if (!target.classList.contains('slice')) return null;
      return days[+target.dataset.idx];
    }

    slicesGroup.addEventListener('mouseenter', (e) => {
      const sunday = getSliceData(e.target);
      if (!sunday) return;
      e.target.classList.add('hovered');
      showTooltip(e, sunday);
    }, true);

    slicesGroup.addEventListener('mousemove', (e) => {
      if (e.target.classList.contains('slice')) positionTooltip(e);
    }, true);

    slicesGroup.addEventListener('mouseleave', (e) => {
      if (!e.target.classList.contains('slice')) return;
      e.target.classList.remove('hovered');
      hideTooltip();
    }, true);

    const upcomingIdx = activeYear === getCurrentYearKey() ? findUpcomingSundayIdx(days) : -1;

    function selectSliceByIdx(idx) {
      if (idx < 0 || idx >= days.length) return;
      const path = slicesGroup.querySelector(`.slice[data-idx="${idx}"]`);
      if (!path) return;
      if (activeSlice) {
        activeSlice.setAttribute('fill', activeSlice.dataset.origFill);
        activeSlice.classList.remove('active');
      }
      path.setAttribute('fill', lightenHex(path.dataset.origFill, 0.35));
      path.classList.add('active');
      activeSlice = path;
      showInfoPanel(days[idx]);
      if (infoPanel) infoPanel.classList.toggle('is-upcoming', idx === upcomingIdx);
      if (infoPanel && window.innerWidth <= 1020) {
        setTimeout(() => infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      }
    }

    slicesGroup.addEventListener('click', (e) => {
      if (!e.target.classList.contains('slice')) return;
      selectSliceByIdx(+e.target.dataset.idx);
    });

    slicesGroup.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('slice')) {
        e.preventDefault();
        e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });

    svg.appendChild(slicesGroup);

    // ── Festkreis-Beschriftungen (gebogen außerhalb des Rades) ───────────
    const bounds = computeFestkreisBounds(days);
    const LABEL_R = CFG.outerR + 22;
    const festkreisArcs = [];
    if (bounds.christmas[0] !== null) {
      festkreisArcs.push({ label: 'Weihnachtszeit', startIdx: bounds.christmas[0], endIdx: bounds.christmas[1] + 1 });
    }
    if (bounds.easter[0] !== null) {
      festkreisArcs.push({ label: 'Osterzeit', startIdx: bounds.easter[0], endIdx: bounds.easter[1] + 1 });
    }

    const labelsGroup = svgEl('g', { class: 'festkreis-labels', 'pointer-events': 'none' });

    festkreisArcs.forEach((item, i) => {
      const startDeg = CFG.startAngle + item.startIdx * SLICE_DEG;
      const endDeg   = CFG.startAngle + item.endIdx * SLICE_DEG;
      const pS       = polarToXY(CX, CY, LABEL_R, startDeg);
      const pE       = polarToXY(CX, CY, LABEL_R, endDeg);
      const large    = ((endDeg - startDeg) + 360) % 360 > 180 ? 1 : 0;

      const arcId   = `festkreis-arc-${i}`;
      const from    = i === 1 ? pE : pS;
      const to      = i === 1 ? pS : pE;
      const sweep   = i === 1 ? 0  : 1;
      defs.appendChild(svgEl('path', {
        id: arcId,
        d: `M ${from.x} ${from.y} A ${LABEL_R} ${LABEL_R} 0 ${large} ${sweep} ${to.x} ${to.y}`,
      }));

      const textEl = svgEl('text', {
        'font-size': '13',
        'font-weight': '600',
        'font-family': "'Inter', system-ui, sans-serif",
        fill: '#8a8a9a',
        'letter-spacing': '4',
      });
      const tp = svgEl('textPath', {
        href: `#${arcId}`,
        startOffset: '50%',
        'text-anchor': 'middle',
      });
      tp.textContent = item.label.toUpperCase();
      textEl.appendChild(tp);
      labelsGroup.appendChild(textEl);
    });
    svg.appendChild(labelsGroup);

    // ── Festtag-Beschriftungen (radial in den goldenen Slices) ───────────
    const FESTTAG_R = (CFG.innerR + CFG.outerR) / 2;
    const festtagLabels = svgEl('g', {
      class: 'festtag-labels',
      'pointer-events': 'none',
    });

    days.forEach((day, idx) => {
      if (day.season !== 'festtag') return;

      const startDeg = CFG.startAngle + idx * SLICE_DEG;
      const midDeg   = startDeg + SLICE_DEG / 2;
      const pos      = polarToXY(CX, CY, FESTTAG_R, midDeg);

      const shortLabel = day.label.replace(/\s*\([^)]*\)\s*/g, '').trim();

      const normDeg = ((midDeg % 360) + 360) % 360;
      const rotation = (normDeg > 90 && normDeg < 270) ? midDeg + 180 : midDeg;

      const textEl = svgEl('text', {
        x: pos.x,
        y: pos.y,
        'font-size': '11',
        'font-weight': '700',
        'font-family': "'Inter', system-ui, sans-serif",
        fill: '#3a2a1a',
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        transform: `rotate(${rotation}, ${pos.x}, ${pos.y})`,
      });
      textEl.textContent = shortLabel;
      festtagLabels.appendChild(textEl);
    });
    svg.appendChild(festtagLabels);

    // ── Innenkreis (Dekoration) ───────────────────────────────────────────
    const centerGroup = svgEl('g', { class: 'center-decoration' });

    const innerCircle = svgEl('circle', {
      cx: CX, cy: CY,
      r: CFG.innerR - 2,
      fill: '#faf8f0',
      stroke: '#c8a400',
      'stroke-width': '3',
    });
    centerGroup.appendChild(innerCircle);

    const PORTRAIT_R = 78;

    // Gestrichelter Ring als Upload-Slot-Indikator
    centerGroup.appendChild(svgEl('circle', {
      cx: CX, cy: CY,
      r: PORTRAIT_R,
      fill: 'none',
      stroke: '#c8a400',
      'stroke-width': '1.5',
      'stroke-dasharray': '5 4',
      opacity: '0.55',
    }));

    // Zentrales Plus-Symbol (SVG <path>)
    const PLUS_SIZE = 28;
    centerGroup.appendChild(svgEl('path', {
      d: `M ${CX - PLUS_SIZE} ${CY} H ${CX + PLUS_SIZE} M ${CX} ${CY - PLUS_SIZE} V ${CY + PLUS_SIZE}`,
      stroke: '#c8a400',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      opacity: '0.7',
      fill: 'none',
    }));

    // ── Innere Beschriftungen (gekrümmt im freien Ring) ─────────────────
    const TOP_LABEL_R = 92;
    const BOT_LABEL_R = 104;

    const itS = polarToXY(CX, CY, TOP_LABEL_R, -178);
    const itE = polarToXY(CX, CY, TOP_LABEL_R, -2);
    defs.appendChild(svgEl('path', {
      id: 'inner-top-arc',
      d: `M ${itS.x} ${itS.y} A ${TOP_LABEL_R} ${TOP_LABEL_R} 0 0 1 ${itE.x} ${itE.y}`,
    }));

    const ibS = polarToXY(CX, CY, BOT_LABEL_R, 10);
    const ibE = polarToXY(CX, CY, BOT_LABEL_R, 170);
    defs.appendChild(svgEl('path', {
      id: 'inner-bot-arc',
      d: `M ${ibE.x} ${ibE.y} A ${BOT_LABEL_R} ${BOT_LABEL_R} 0 0 0 ${ibS.x} ${ibS.y}`,
    }));

    const innerLabelsGroup = svgEl('g', { 'pointer-events': 'none' });

    const topText = svgEl('text', {
      'font-size': '14',
      'font-weight': '600',
      'font-family': "'Inter', system-ui, sans-serif",
      fill: '#9a8a78',
      'letter-spacing': '2',
    });
    const topTp = svgEl('textPath', { href: '#inner-top-arc', startOffset: '50%', 'text-anchor': 'middle' });
    topTp.textContent = 'DURCH DAS KIRCHENJAHR MIT';
    topText.appendChild(topTp);
    innerLabelsGroup.appendChild(topText);

    const botText = svgEl('text', {
      'font-size': '16',
      'font-weight': '700',
      'font-family': "'Inter', system-ui, sans-serif",
      fill: '#3a2a1a',
      'letter-spacing': '0.8',
    });
    const botTp = svgEl('textPath', { href: '#inner-bot-arc', startOffset: '50%', 'text-anchor': 'middle' });
    botTp.textContent = 'Eugen Biser (1918 \u2013 2014)';
    botText.appendChild(botTp);
    innerLabelsGroup.appendChild(botText);

    centerGroup.appendChild(innerLabelsGroup);

    svg.appendChild(centerGroup);
    svgContainer.appendChild(svg);

    // ── Legende ───────────────────────────────────────────────────────────
    buildLegend();

    // ── Auto-Auswahl: kommender Sonntag im aktuell gültigen Lesejahr ─────
    if (upcomingIdx !== -1) {
      selectSliceByIdx(upcomingIdx);
    }
  }

  function buildLegend() {
    const legendEl = document.getElementById('legend');
    if (!legendEl) return;

    const seasons = ['christmas', 'easter', 'ordinary', 'festtag'];

    seasons.forEach(key => {
      const meta = SEASON_COLORS[key];
      if (!meta) return;

      const item = document.createElement('div');
      item.className = 'legend-item';

      const dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.background = meta.fill;
      dot.style.border = `2px solid ${meta.stroke}`;

      const lbl = document.createElement('span');
      lbl.textContent = meta.label;

      item.appendChild(dot);
      item.appendChild(lbl);
      legendEl.appendChild(item);
    });
  }

  // ── Lesejahr wechseln ────────────────────────────────────────────────────
  function switchYear(yearKey) {
    const yearData = KIRCHENJAHR[yearKey];
    if (!yearData) return;

    activeYear = yearKey;

    // UI-Texte aktualisieren
    const yearLabel = document.getElementById('year-label');
    if (yearLabel) yearLabel.textContent = `${yearData.title} \u00B7 ${yearData.yearRange}`;

    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.innerHTML = `Kirchenjahr ${yearData.yearRange} (${yearData.title}) &mdash; Alle Sonn- und ausgew&auml;hlte Festtage vom 1.&nbsp;Advent bis Christk\u00F6nig`;

    document.title = `Kirchenjahresrad ${yearData.yearRange} \u2014 Predigten`;

    // Button-States
    document.querySelectorAll('.year-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.year === yearKey);
    });

    // Rad neu zeichnen
    buildWheel(yearData.days);
  }

  // ── Höhen-Sync: Sidebar-Unterkante = Bio-Box-Unterkante ──────────────────
  function syncPanelHeight() {
    const bioBox    = document.querySelector('.bio-box');
    const legendBox = document.querySelector('.legend-box');
    const infoPanel = document.getElementById('info-panel');
    const sidebar   = document.querySelector('.sidebar');
    if (!bioBox || !legendBox || !infoPanel || !sidebar) return;
    const gap = parseFloat(getComputedStyle(sidebar).gap) || 0;
    const available = bioBox.offsetHeight - legendBox.offsetHeight - gap;
    infoPanel.style.minHeight = Math.max(available, 160) + 'px';
  }

  function initHeightSync() {
    syncPanelHeight();
    const bioBox = document.querySelector('.bio-box');
    if (bioBox && window.ResizeObserver) {
      new ResizeObserver(syncPanelHeight).observe(bioBox);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    // "Zur Predigt"-Button einmalig verkabeln (Event-Delegation)
    const predigtBtn = document.getElementById('info-predigt');
    if (predigtBtn) {
      predigtBtn.addEventListener('click', () => {
        const url = predigtBtn.dataset.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      });
    }

    // Lesejahr-Buttons verkabeln
    document.querySelectorAll('.year-btn').forEach(btn => {
      const key = btn.dataset.year;
      btn.disabled = !KIRCHENJAHR[key];
      btn.addEventListener('click', () => {
        if (btn.disabled || btn.classList.contains('active')) return;
        switchYear(key);
      });
    });

    // Initiales Lesejahr dynamisch bestimmen (das, in dessen Zeitraum heute liegt)
    const initialYearKey = getCurrentYearKey();
    if (KIRCHENJAHR[initialYearKey]) {
      switchYear(initialYearKey);
    } else if (KIRCHENJAHR[activeYear]) {
      buildWheel(KIRCHENJAHR[activeYear].days);
    }

    initHeightSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
