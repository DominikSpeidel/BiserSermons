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
  let activeCard = null;
  let currentDays = [];
  let currentUpcomingIdx = -1;

  // ── Media Queries / Modus-Erkennung ──────────────────────────────────────
  // Phone (≤680): immer Liste (Rad wäre zu klein).
  // Tablet & Desktop (>680): User wählt via Toggle; Wahl gilt nur für die
  // aktuelle Seiten-Session, jeder Reload startet wieder im Rad.
  const MQ = {
    phone: window.matchMedia('(max-width: 680px)'),
  };

  let selectedView = 'wheel';

  function currentMode() {
    if (MQ.phone.matches) return 'list';
    return selectedView;
  }

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
    infoPanel.querySelector('.ip-label').textContent  = sunday.label;
    infoPanel.querySelector('.ip-date').textContent   = formatDate(sunday.date);
    infoPanel.querySelector('.ip-season').textContent = seasonMeta ? seasonMeta.label : '';

    const lesungEl = infoPanel.querySelector('.ip-lesung');
    lesungEl.textContent = sunday.lesung ? `Lesung: ${sunday.lesung}` : '\u00A0';
    lesungEl.style.visibility = sunday.lesung ? 'visible' : 'hidden';

    const predigtDateEl = infoPanel.querySelector('.ip-predigt-date');
    predigtDateEl.textContent = sunday.predigtDate ? `Predigt gehalten am ${formatDate(sunday.predigtDate)}` : '\u00A0';
    predigtDateEl.style.visibility = sunday.predigtDate ? 'visible' : 'hidden';

    const predigtBtn = infoPanel.querySelector('#info-predigt');
    predigtBtn.dataset.url = sunday.url || '';
    predigtBtn.classList.toggle('no-url', !sunday.url);
    predigtBtn.textContent = sunday.url ? 'Zur Predigt' : 'Keine Predigtaufnahme verfügbar';

    if (seasonMeta) {
      const dot = infoPanel.querySelector('.ip-color-dot');
      dot.style.background = seasonMeta.fill;
      dot.style.border = `2px solid ${seasonMeta.stroke}`;
    }

    infoPanel.classList.add('visible');
  }

  function hideInfoPanel() {
    if (infoPanel) infoPanel.classList.remove('visible', 'is-upcoming');
  }

  // ── Gemeinsame Selektions-Logik (Wheel + List) ───────────────────────────
  function clearWheelActive() {
    if (activeSlice) {
      activeSlice.setAttribute('fill', activeSlice.dataset.origFill);
      activeSlice.classList.remove('active');
      activeSlice = null;
    }
  }

  function clearListActive() {
    if (activeCard) {
      activeCard.classList.remove('active');
      activeCard.setAttribute('aria-selected', 'false');
      activeCard = null;
    }
  }

  function paintSlice(idx) {
    const path = document.querySelector(`#wheel-container .slice[data-idx="${idx}"]`);
    if (!path) return;
    path.setAttribute('fill', lightenHex(path.dataset.origFill, 0.35));
    path.classList.add('active');
    activeSlice = path;
  }

  function paintCard(idx) {
    const card = document.querySelector(`#wheel-container .sl-card[data-idx="${idx}"]`);
    if (!card) return;
    card.classList.add('active');
    card.setAttribute('aria-selected', 'true');
    activeCard = card;
  }

  function selectIdx(idx) {
    if (idx < 0 || idx >= currentDays.length) return;
    clearWheelActive();
    clearListActive();
    // Beide Views bemalen, damit die Auswahl beim Toggle bestehen bleibt
    // (querySelector liefert null, wenn der jeweilige View nicht gerendert ist — dann no-op)
    paintSlice(idx);
    paintCard(idx);
    showInfoPanel(currentDays[idx]);
    if (infoPanel) infoPanel.classList.toggle('is-upcoming', idx === currentUpcomingIdx);
  }

  // ── Rad zeichnen ─────────────────────────────────────────────────────────
  function buildWheel(days) {
    const svgContainer = document.getElementById('wheel-container');
    if (!svgContainer) return;

    // Nur das alte Rad entfernen — evtl. vorhandene .swipe-list bleibt,
    // damit beide Views auf Desktop koexistieren können.
    const oldSvg = svgContainer.querySelector('.wheel-svg');
    if (oldSvg) oldSvg.remove();
    activeSlice = null;
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
    slicesGroup.addEventListener('mouseenter', (e) => {
      if (!e.target.classList.contains('slice')) return;
      e.target.classList.add('hovered');
      showTooltip(e, days[+e.target.dataset.idx]);
    }, true);

    slicesGroup.addEventListener('mousemove', (e) => {
      if (e.target.classList.contains('slice')) positionTooltip(e);
    }, true);

    slicesGroup.addEventListener('mouseleave', (e) => {
      if (!e.target.classList.contains('slice')) return;
      e.target.classList.remove('hovered');
      hideTooltip();
    }, true);

    slicesGroup.addEventListener('click', (e) => {
      if (!e.target.classList.contains('slice')) return;
      selectIdx(+e.target.dataset.idx);
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
    if (currentUpcomingIdx !== -1) {
      selectIdx(currentUpcomingIdx);
    }
  }

  function buildLegend() {
    const legendEl = document.getElementById('legend');
    if (!legendEl) return;
    legendEl.innerHTML = '';

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

  // ── Swipe-Liste zeichnen ─────────────────────────────────────────────────
  function buildList(days) {
    const container = document.getElementById('wheel-container');
    if (!container) return;

    // Nur die alte Liste entfernen — evtl. vorhandene .wheel-svg bleibt,
    // damit beide Views auf Desktop koexistieren können.
    const oldList = container.querySelector('.swipe-list');
    if (oldList) oldList.remove();
    activeCard = null;
    infoPanel = document.getElementById('info-panel');
    if (infoPanel) infoPanel.classList.remove('visible', 'is-upcoming');

    const wrapper = document.createElement('div');
    wrapper.className = 'swipe-list';
    wrapper.setAttribute('role', 'listbox');
    wrapper.setAttribute('aria-label', 'Sonntage des Kirchenjahres');

    const track = document.createElement('ul');
    track.className = 'swipe-list-track';

    days.forEach((day, idx) => {
      const li = document.createElement('li');
      li.className = `sl-card sl-${day.season}` + (day.url ? '' : ' no-sermon');
      li.dataset.idx = String(idx);
      li.setAttribute('role', 'option');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-selected', 'false');

      const seasonMeta = SEASON_COLORS[day.season];
      const metaParts = [];
      if (seasonMeta) metaParts.push(seasonMeta.label);
      metaParts.push(day.url ? 'Predigt verfügbar' : 'Keine Predigt');

      li.innerHTML = `
        <span class="sl-accent" aria-hidden="true"></span>
        <div class="sl-body">
          <span class="sl-date">${formatDate(day.date)}</span>
          <span class="sl-label">${day.label}</span>
          <span class="sl-meta">${metaParts.join(' · ')}</span>
        </div>
        <span class="sl-sermon-dot" aria-hidden="true"></span>
      `;

      track.appendChild(li);
    });

    wrapper.appendChild(track);
    container.appendChild(wrapper);

    // Event-Delegation: Klick + Keyboard
    track.addEventListener('click', (e) => {
      const card = e.target.closest('.sl-card');
      if (!card) return;
      selectIdx(+card.dataset.idx);
    });

    track.addEventListener('keydown', (e) => {
      const card = e.target.closest('.sl-card');
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectIdx(+card.dataset.idx);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        const next = track.querySelector(`.sl-card[data-idx="${+card.dataset.idx + dir}"]`);
        if (next) next.focus();
      }
    });

    buildLegend();

    // Auto-Auswahl + Zentrierung
    if (currentUpcomingIdx !== -1) {
      selectIdx(currentUpcomingIdx);
      const card = track.querySelector(`.sl-card[data-idx="${currentUpcomingIdx}"]`);
      if (card) {
        // instant scroll, nach nächstem Frame damit Layout steht
        requestAnimationFrame(() => {
          const top = card.offsetTop - wrapper.clientHeight / 2 + card.clientHeight / 2;
          wrapper.scrollTop = Math.max(0, top);
        });
      }
    } else {
      wrapper.scrollTop = 0;
    }
  }

  // ── Modus anwenden (Wheel oder Liste) ────────────────────────────────────
  // Auf Desktop (>=1181px) koexistieren beide Views im Slot und werden nur
  // bei Daten-/Jahreswechsel gebaut — der Toggle steuert nur CSS/ARIA, damit
  // das Layout nicht springt und der Listen-Scroll-Zustand erhalten bleibt.
  // Auf Tablet/Mobile wird weiterhin bei jedem Toggle der aktive View gebaut.
  let builtForKey = null;

  function applyMode(days) {
    const data = days || currentDays;
    if (!data || !data.length) return;
    currentDays = data;
    currentUpcomingIdx = activeYear === getCurrentYearKey() ? findUpcomingSundayIdx(data) : -1;

    // Badge-Text: "Heutige Predigt" wenn der kommende Termin heute ist,
    // sonst "Nächste Predigt".
    const badgeEl = document.querySelector('.ip-upcoming-badge');
    if (badgeEl) {
      const isToday = currentUpcomingIdx !== -1 && data[currentUpcomingIdx].date === todayISO();
      badgeEl.textContent = isToday ? 'Heutige Predigt' : 'Nächste Predigt';
    }

    const mode = currentMode();
    document.body.dataset.view = mode;

    // Toggle-Button-State synchron halten
    document.querySelectorAll('.vt-btn').forEach(btn => {
      const isActive = btn.dataset.view === mode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    const isDesktop = window.innerWidth >= 1181;
    const buildKey  = `${activeYear}|${isDesktop ? 'D' : 'S'}`;

    // Auf Tablet/Mobile darf immer nur ein View im DOM sein — vorhandene
    // Überbleibsel aus einem anderen Breakpoint aufräumen.
    if (!isDesktop) {
      const container = document.getElementById('wheel-container');
      if (container) {
        const strayWheel = mode !== 'wheel' ? container.querySelector('.wheel-svg') : null;
        const strayList  = mode !== 'list'  ? container.querySelector('.swipe-list') : null;
        if (strayWheel) strayWheel.remove();
        if (strayList)  strayList.remove();
      }
    }

    if (builtForKey !== buildKey) {
      if (isDesktop) {
        // Beide Views bauen → koexistieren im Slot, Toggle ist reiner CSS-Fade
        buildWheel(data);
        buildList(data);
      } else {
        // Tablet/Mobile: nur aktiven View bauen (wie zuvor)
        if (mode === 'list') buildList(data);
        else                 buildWheel(data);
      }
      builtForKey = buildKey;
    } else if (!isDesktop) {
      // Tablet/Mobile Toggle: aktiven View neu bauen (keine Koexistenz)
      if (mode === 'list') buildList(data);
      else                 buildWheel(data);
    }

    // Desktop: ARIA + inert auf dem inaktiven Sub-Container,
    // damit Screenreader und Tab-Fokus den unsichtbaren View überspringen.
    if (isDesktop) {
      const wheelEl = document.querySelector('#wheel-container .wheel-svg');
      const listEl  = document.querySelector('#wheel-container .swipe-list');
      const setInactive = (el, inactive) => {
        if (!el) return;
        el.setAttribute('aria-hidden', inactive ? 'true' : 'false');
        if (inactive) el.setAttribute('inert', '');
        else          el.removeAttribute('inert');
      };
      setInactive(wheelEl, mode !== 'wheel');
      setInactive(listEl,  mode !== 'list');
    }
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

    // Rad oder Liste neu zeichnen (je nach Modus)
    applyMode(yearData.days);
  }

  // ── Höhen-Sync: Sidebar-Unterkante = Bio-Box-Unterkante ──────────────────
  // Nur im echten 3-Spalten-Desktop-Layout sinnvoll. Tablet-Landscape bis
  // 1366px nutzt das 2-Spalten-Layout mit Bio unterhalb — dort zurücksetzen.
  function syncPanelHeight() {
    const infoPanel = document.getElementById('info-panel');
    if (!infoPanel) return;
    const isLandscapeTablet = matchMedia('(min-width: 1021px) and (max-width: 1366px) and (orientation: landscape)').matches;
    if (isLandscapeTablet || window.innerWidth <= 1180) {
      infoPanel.style.minHeight = '';
      return;
    }
    const bioBox    = document.querySelector('.bio-box');
    const legendBox = document.querySelector('.legend-box');
    const sidebar   = document.querySelector('.sidebar');
    if (!bioBox || !legendBox || !sidebar) return;
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
    window.addEventListener('resize', syncPanelHeight, { passive: true });

    // Breakpoint-Crossing: beim Wechsel zwischen Desktop und Tablet die Views
    // neu aufbauen (Desktop = beide koexistieren, Tablet = nur aktiver View).
    let wasDesktop = window.innerWidth >= 1181;
    window.addEventListener('resize', () => {
      const isDesktop = window.innerWidth >= 1181;
      if (isDesktop !== wasDesktop) {
        wasDesktop = isDesktop;
        builtForKey = null;
        applyMode();
      }
    }, { passive: true });
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

    // View-Toggle verkabeln (nur Tablet-MQ sichtbar)
    document.querySelectorAll('.vt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        const view = btn.dataset.view;
        if (view === 'wheel' || view === 'list') {
          selectedView = view;
          applyMode();
        }
      });
    });

    // Phone-MQ-Listener: beim Crossen der 680px-Schwelle Ansicht neu aufbauen
    const onMQChange = () => applyMode();
    if (MQ.phone.addEventListener)  MQ.phone.addEventListener('change', onMQChange);
    else if (MQ.phone.addListener)  MQ.phone.addListener(onMQChange);

    // Initiales Lesejahr dynamisch bestimmen (das, in dessen Zeitraum heute liegt)
    const initialYearKey = getCurrentYearKey();
    if (KIRCHENJAHR[initialYearKey]) {
      switchYear(initialYearKey);
    } else if (KIRCHENJAHR[activeYear]) {
      applyMode(KIRCHENJAHR[activeYear].days);
    }

    initHeightSync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
