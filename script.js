(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utilidades ---------- */

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const hero3d = document.getElementById("hero3d");
  const bouquetsEl = document.getElementById("bouquets");

  /* ---------- estrellas ---------- */

  const starsEl = document.getElementById("stars");
  const count = Math.min(140, Math.max(90, Math.floor(window.innerWidth * window.innerHeight / 9000)));

  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = 0.8 + Math.random() * 2.2;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--t", (2 + Math.random() * 3.6).toFixed(2) + "s");
    s.style.animationDelay = (-Math.random() * 6).toFixed(2) + "s";
    s.style.boxShadow = `0 0 ${(size * 3).toFixed(1)}px rgba(255,255,255,0.85)`;
    starsEl.appendChild(s);
  }

  /* ---------- estrellas fugaces ---------- */

  if (!reduce) {
    const shootsEl = document.getElementById("shoots");
    for (let i = 0; i < 3; i++) {
      const m = document.createElement("div");
      m.className = "shoot";
      m.style.left = (18 + Math.random() * 65) + "%";
      m.style.top = (4 + Math.random() * 34) + "%";
      m.style.animationDuration = (5 + Math.random() * 5).toFixed(1) + "s";
      m.style.animationDelay = (4 + Math.random() * 12).toFixed(1) + "s";
      shootsEl.appendChild(m);
    }
  }

  /* ---------- ramo central 3D ---------- */

  const heroWrap = document.getElementById("heroWrap");
  const scaleU = heroWrap.getBoundingClientRect().width / 300;

  const headSpin = document.createElement("div");
  headSpin.className = "head-spin";

  const RINGS = [
    { n: 10, r: 64, tilt: 42, w: 34, h: 74, z: -12, grad: "linear-gradient(180deg, #c98a2a 0%, #a35c10 60%, #7c4110 100%)" },
    { n: 12, r: 108, tilt: 12, w: 46, h: 98, z: 0, grad: "linear-gradient(180deg, #f7c94f 0%, #e8a71f 55%, #c07814 100%)" },
    { n: 10, r: 82, tilt: 22, w: 38, h: 84, z: 24, grad: "linear-gradient(180deg, #ffe076 0%, #f2b62e 60%, #d98a12 100%)" },
    { n: 8, r: 50, tilt: 34, w: 28, h: 62, z: 48, grad: "linear-gradient(180deg, #ffe88f 0%, #ffc93c 55%, #e8a11a 100%)" }
  ];

  RINGS.forEach((ring) => {
    const g = document.createElement("div");
    g.className = "ring";
    g.style.transform = `translateZ(${Math.round(ring.z * scaleU)}px)`;
    for (let i = 0; i < ring.n; i++) {
      const p = document.createElement("div");
      p.className = "petal3";
      const w = Math.max(8, Math.round(ring.w * scaleU));
      const h = Math.max(16, Math.round(ring.h * scaleU));
      p.style.width = w + "px";
      p.style.height = h + "px";
      p.style.marginLeft = -w / 2 + "px";
      p.style.marginTop = -h / 2 + "px";
      p.style.background = ring.grad;
      p.style.transform =
        `rotateZ(${(360 / ring.n) * i}deg) translateY(-${Math.round(ring.r * scaleU)}px) rotateX(${ring.tilt}deg)`;
      g.appendChild(p);
    }
    headSpin.appendChild(g);
  });

  const core = document.createElement("div");
  core.className = "core3";
  core.style.width = "16%";
  core.style.height = "16%";
  headSpin.appendChild(core);

  hero3d.appendChild(headSpin);
  hero3d.appendChild(Object.assign(document.createElement("div"), { className: "stem3" }));
  hero3d.appendChild(Object.assign(document.createElement("div"), { className: "leaf3 left" }));
  hero3d.appendChild(Object.assign(document.createElement("div"), { className: "leaf3 right" }));

  if (!reduce) {
    for (let i = 0; i < 9; i++) {
      const sp = document.createElement("div");
      sp.className = "spark";
      const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;
      const r = 30 + Math.random() * 22;
      sp.style.left = `calc(50% + ${Math.cos(a) * r}%)`;
      sp.style.top = `calc(50% + ${Math.sin(a) * r * 0.85}%)`;
      sp.style.setProperty("--st", (1.8 + Math.random() * 2.2).toFixed(2) + "s");
      sp.style.animationDelay = (-Math.random() * 4).toFixed(2) + "s";
      hero3d.appendChild(sp);
    }
  }

  /* ---------- generadores de ramos SVG (6 diseños) ---------- */

  function petalsRing(cx, top, s, n, rx, ry, fill, stroke, offset) {
    let out = "";
    for (let i = 0; i < n; i++) {
      const a = Math.round((360 / n) * i + (offset || 0));
      out += `<ellipse cx="0" cy="${-ry}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="1" transform="rotate(${a})"/>`;
    }
    return `<g transform="translate(${cx} ${top}) scale(${s})">${out}</g>`;
  }

  function centerDot(cx, top, s, r, fill) {
    return `<g transform="translate(${cx} ${top}) scale(${s})">
      <circle r="${r}" fill="${fill}" stroke="#8a5412" stroke-width="1.5"/>
      <circle r="${Math.round(r * 0.32)}" fill="#ffedb0" cx="${Math.round(-r * 0.25)}" cy="${Math.round(-r * 0.25)}" opacity="0.9"/>
    </g>`;
  }

  function leafPair(cx, ty) {
    return `<path d="M ${cx + 6} ${ty} q 16 -6 22 6 q -12 10 -22 -6 Z" fill="#7ba33c" stroke="#4c6b23" stroke-width="1.5"/>
      <path d="M ${cx - 6} ${ty + 6} q -16 -6 -22 6 q 12 10 22 -6 Z" fill="#7ba33c" stroke="#4c6b23" stroke-width="1.5"/>`;
  }

  function svgSpray(p) {
    return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
      <path d="M 28 120 C 28 96 30 84 28 58" stroke="#5c8230" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 48 120 C 48 88 50 72 48 32" stroke="#5c8230" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M 70 120 C 70 96 72 82 70 50" stroke="#5c8230" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 92 120 C 92 100 93 88 92 70" stroke="#5c8230" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ${leafPair(46, 60)}
      ${petalsRing(28, 58, 0.6, 6, 6, 12, p.petal, "#d99a2e")}${centerDot(28, 58, 0.6, 5.5, p.center)}
      ${petalsRing(48, 32, 0.78, 7, 6.5, 13, p.petal, "#d99a2e")}${centerDot(48, 32, 0.78, 6, p.center)}
      ${petalsRing(70, 50, 0.62, 6, 6, 12, p.petal, "#d99a2e")}${centerDot(70, 50, 0.62, 5.5, p.center)}
      ${petalsRing(92, 70, 0.42, 6, 5.5, 11, p.petal, "#d99a2e")}${centerDot(92, 70, 0.42, 5, p.center)}
      <path d="M 34 120 L 86 120 L 96 128.5 L 24 128.5 Z" fill="${p.wrap}" stroke="#e6b95c" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 28 121.5 L 92 121.5" stroke="${p.ribbon}" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  function svgGirasol(p) {
    return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
      <path d="M 60 120 C 60 90 62 78 60 36" stroke="#5c8230" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 90 120 C 90 100 91 92 90 84" stroke="#5c8230" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ${leafPair(52, 56)}
      ${petalsRing(90, 84, 0.5, 8, 5.5, 11, p.petal, "#d99a2e")}${centerDot(90, 84, 0.5, 5, p.center)}
      ${petalsRing(60, 36, 1.1, 12, 7, 15, p.petal, "#d99a2e")}
      ${petalsRing(60, 36, 1.05, 12, 6.8, 14.5, p.petal2, "#d99a2e", 15)}
      ${centerDot(60, 36, 1.05, 9.5, p.center)}
      <path d="M 44 120 L 76 120 L 86 127 L 34 127 Z" fill="${p.wrap}" stroke="#e6b95c" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 40 121 L 80 121" stroke="${p.ribbon}" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  function tulipHead(cx, top, s, p) {
    const petal = (rot, d) =>
      `<path d="${d}" fill="${p.petal}" stroke="#d99a2e" stroke-width="1" transform="rotate(${rot})"/>`;
    const inner = (rot, d) => `<path d="${d}" fill="${p.petal2}" transform="rotate(${rot})"/>`;
    return `<g transform="translate(${cx} ${top}) scale(${s})">
      ${petal(0, "M 0 2 C -8 -14 -11 -28 0 -40 C 11 -28 8 -14 0 2 Z")}
      ${petal(120, "M 0 2 C -8 -14 -11 -28 0 -40 C 11 -28 8 -14 0 2 Z")}
      ${petal(240, "M 0 2 C -8 -14 -11 -28 0 -40 C 11 -28 8 -14 0 2 Z")}
      ${inner(60, "M 0 0 C -7 -12 -9 -24 0 -34 C 9 -24 7 -12 0 0 Z")}
      ${inner(180, "M 0 0 C -7 -12 -9 -24 0 -34 C 9 -24 7 -12 0 0 Z")}
      ${inner(300, "M 0 0 C -7 -12 -9 -24 0 -34 C 9 -24 7 -12 0 0 Z")}
      <circle r="2.5" fill="#a35c10"/>
    </g>`;
  }

  function svgTulipan(p) {
    return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
      <path d="M 38 120 C 38 98 40 90 38 74" stroke="#5c8230" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M 60 120 C 60 90 62 76 60 46" stroke="#5c8230" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 82 120 C 82 98 84 90 82 74" stroke="#5c8230" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ${tulipHead(38, 74, 0.9, p)}
      ${tulipHead(60, 46, 1.05, p)}
      ${tulipHead(82, 74, 0.85, p)}
      <path d="M 42 118 L 78 118" stroke="${p.ribbon}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="42" cy="118" r="3" fill="#ffffff" opacity="0.85"/>
      <circle cx="78" cy="118" r="3" fill="#ffffff" opacity="0.85"/>
    </svg>`;
  }

  function svgMargarita(p) {
    return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
      <path d="M 60 120 C 60 92 62 82 60 40" stroke="#5c8230" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M 34 120 C 34 98 34 82 34 60" stroke="#5c8230" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 88 120 C 88 100 88 88 88 54" stroke="#5c8230" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${leafPair(52, 66)}
      ${petalsRing(34, 60, 0.3, 6, 5.5, 10, p.petal, "#d99a2e")}${centerDot(34, 60, 0.3, 4, p.center)}
      ${petalsRing(88, 54, 0.28, 6, 5.5, 10, p.petal, "#d99a2e")}${centerDot(88, 54, 0.28, 4, p.center)}
      ${petalsRing(60, 40, 1, 12, 6.5, 14, p.petal, "#d99a2e")}
      ${petalsRing(60, 40, 0.94, 12, 6.2, 13.5, p.petal2, "#d99a2e", 15)}
      ${centerDot(60, 40, 0.94, 8.5, p.center)}
      <path d="M 42 120 L 78 120 L 88 127 L 32 127 Z" fill="${p.wrap}" stroke="#e6b95c" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="45" cy="115" rx="11" ry="6" fill="${p.ribbon}" stroke="#e6b95c" stroke-width="1.5" transform="rotate(-18 45 115)"/>
      <circle cx="60" cy="117" r="3.5" fill="#e08a2e"/>
    </svg>`;
  }

  function svgRacimo(p) {
    const pos = [[40, 60, 0.42], [74, 54, 0.45], [56, 34, 0.5], [88, 68, 0.38], [30, 72, 0.42]];
    let heads = "";
    pos.forEach(([cx, top, s]) => {
      heads += `<path d="M ${cx} 120 C ${cx + 2} 98, ${cx - 2} 88, ${cx} ${top + 8}" stroke="#5c8230" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      heads += petalsRing(cx, top, s, 6, 5.5, 11, p.petal, "#d99a2e");
      heads += centerDot(cx, top, s, 4.5, p.center);
    });
    return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
      ${heads}
      <path d="M 40 118 L 80 118 L 92 128 L 28 128 Z" fill="${p.wrap}" stroke="#e6b95c" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 34 119.5 L 86 119.5" stroke="${p.ribbon}" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }

  function svgLazo(p) {
    return `<svg viewBox="0 0 120 132" xmlns="http://www.w3.org/2000/svg">
      <path d="M 34 120 C 34 98 35 88 34 52" stroke="#5c8230" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 86 120 C 86 98 87 88 86 54" stroke="#5c8230" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M 60 120 C 60 92 61 80 60 28" stroke="#5c8230" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${leafPair(50, 66)}
      ${petalsRing(34, 52, 0.8, 7, 6, 12, p.petal, "#d99a2e")}${centerDot(34, 52, 0.8, 6, p.center)}
      ${petalsRing(86, 54, 0.72, 7, 6, 12, p.petal, "#d99a2e")}${centerDot(86, 54, 0.72, 5.5, p.center)}
      ${petalsRing(60, 28, 0.95, 9, 6.5, 13, p.petal, "#d99a2e")}${centerDot(60, 28, 0.95, 7, p.center)}
      <ellipse cx="43" cy="114" rx="12" ry="7" fill="${p.wrap}" stroke="#e6b95c" stroke-width="1.5" transform="rotate(-18 43 114)"/>
      <ellipse cx="77" cy="114" rx="12" ry="7" fill="${p.wrap}" stroke="#e6b95c" stroke-width="1.5" transform="rotate(18 77 114)"/>
      <circle cx="60" cy="116" r="4" fill="${p.ribbon}"/>
    </svg>`;
  }

  const GENERATORS = {
    spray: svgSpray,
    girasol: svgGirasol,
    tulipan: svgTulipan,
    margarita: svgMargarita,
    racimo: svgRacimo,
    lazo: svgLazo
  };

  const PALS = [
    { petal: "#ffd23e", petal2: "#f5a623", center: "#b06d1f", wrap: "#ffe28a", ribbon: "#d98f2e" },
    { petal: "#ffd94a", petal2: "#ecb122", center: "#a86414", wrap: "#ffd9a0", ribbon: "#e08a2e" },
    { petal: "#ffce36", petal2: "#f7b926", center: "#9c5a12", wrap: "#fff0c2", ribbon: "#c4731f" },
    { petal: "#f7c94f", petal2: "#e8a11a", center: "#8a5412", wrap: "#ffd6ae", ribbon: "#d98f2e" },
    { petal: "#ffdf5e", petal2: "#f2b62e", center: "#a06414", wrap: "#ffe9b8", ribbon: "#bf7a1e" },
    { petal: "#ffc237", petal2: "#edb225", center: "#b06d1f", wrap: "#ffedc9", ribbon: "#c98a2a" }
  ];

  /* ---------- tarjetas de los ramos laterales ---------- */

  const CARDS = [
    { em: "\u{1F33B}", title: "Ramo Solar", msg: "Brilla como el sol, tal como tú. Estas flores guardan todo el calor que mereces.", detail: "calor para tu d\u00eda m\u00e1s nublado", bg: "linear-gradient(165deg, #fffdf7, #ffe9ae)" },
    { em: "\u{1F319}", title: "Ramo de Medianoche", msg: "Aunque el cielo est\u00e9 oscuro, estas flores amarillas siguen encendidas por ti.", detail: "tu luz no se apaga jam\u00e1s", bg: "linear-gradient(165deg, #f6f4ff, #efe3ff)" },
    { em: "\u{2B50}", title: "Ramo Estelar", msg: "Cada flor es una estrella que cae del cielo para recordarte lo especial que eres.", detail: "una estrella que cay\u00f3 para ti", bg: "linear-gradient(165deg, #fdfbff, #ffe3f2)" },
    { em: "\u{1F49B}", title: "Ramo del Coraz\u00f3n", msg: "De todas las flores del universo, estas son las que m\u00e1s se parecen a tu risa.", detail: "alegr\u00eda que florece", bg: "linear-gradient(165deg, #fffdf4, #ffe6b0)" },
    { em: "\u{2728}", title: "Ramo de Nebulosa", msg: "Entre nubes de polvo c\u00f3smico guard\u00e9 el ramo m\u00e1s bonito, hecho solo para ti.", detail: "polvo de estrellas hecho flor", bg: "linear-gradient(165deg, #f4f3ff, #d9ecff)" },
    { em: "\u{1F30C}", title: "Ramo Eterno", msg: "Aunque el universo se expanda sin parar, estas flores no dejan de crecer por ti.", detail: "floreciendo para siempre", bg: "linear-gradient(165deg, #fffbf2, #ffd98a)" }
  ];

  /* ---------- posiciones aleatorias y alejadas entre si ---------- */

  function placeBouquets(count) {
    const pts = [];
    let guard = 0;
    while (pts.length < count && guard++ < 2000) {
      const x = 6 + Math.random() * 88;
      const y = 11 + Math.random() * 75;
      const dx = x - 50;
      const dy = y - 50;
      if (dx * dx + dy * dy < 26 * 26) continue;
      if (pts.some((p) => (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y) < 24 * 24)) continue;
      pts.push({ x, y });
    }
    return pts;
  }

  const kinds = shuffle(["spray", "girasol", "tulipan", "margarita", "racimo", "lazo"]);
  const pals = shuffle(PALS);
  const spots = placeBouquets(CARDS.length);

  CARDS.forEach((c, i) => {
    const wrap = document.createElement("div");
    wrap.className = "bq";
    wrap.style.left = spots[i].x + "%";
    wrap.style.top = spots[i].y + "%";
    wrap.style.width = Math.round(Math.min(66 + Math.random() * 30, window.innerWidth * 0.2)) + "px";
    wrap.style.setProperty("--ft", (4 + Math.random() * 2.4).toFixed(2) + "s");
    wrap.style.setProperty("--fd", (-Math.random() * 2).toFixed(2) + "s");
    wrap.style.setProperty("--us", (3.8 + Math.random() * 1.8).toFixed(2) + "s");
    wrap.style.setProperty("--ht", (2.2 + Math.random() * 1.4).toFixed(2) + "s");
    wrap.dataset.index = i;

    const halo = document.createElement("div");
    halo.className = "bq-halo";

    const sway = document.createElement("div");
    sway.className = "bq-sway";
    sway.innerHTML = GENERATORS[kinds[i]](pals[i]);

    wrap.appendChild(halo);
    wrap.appendChild(sway);
    bouquetsEl.appendChild(wrap);
  });

  /* ---------- mensajes aleatorios del ramo central ---------- */

  const MESSAGES = [
    {
      em: "\u{1F33C}",
      title: "Ramo Principal Estelar",
      msg: "En el coraz\u00f3n de este universo plant\u00e9 el ramo m\u00e1s grande, pero no m\u00e1s de los sentimientos que te tengo.",
      detail: "los sentimientos m\u00e1s grandes del universo",
      bg: "linear-gradient(165deg, #fffbe8, #ffd66b)"
    },
    {
      em: "\u{1F33B}",
      title: "Ramo Principal Estelar",
      msg: "Si este universo cabiera en una flor amarilla, a\u00fan as\u00ed no alcanzar\u00eda para explicar cu\u00e1nto te quiero.",
      detail: "una flor que no alcanza a medir mis sentimientos",
      bg: "linear-gradient(165deg, #fffdf0, #ffe9a3)"
    },
    {
      em: "\u{2728}",
      title: "Ramo Principal Estelar",
      msg: "Plant\u00e9 flores en cada galaxia del universo\u2026 y todas, todas, florecieron pensando en ti.",
      detail: "florecidas pensando en ti",
      bg: "linear-gradient(165deg, #fdf9ff, #ffe6f0)"
    },
    {
      em: "\u{1F4AB}",
      title: "Ramo Principal Estelar",
      msg: "Las estrellas se cansan de brillar cada noche, pero yo de quererte, jam\u00e1s.",
      detail: "brillo que no se apaga",
      bg: "linear-gradient(165deg, #f5f4ff, #e3d9ff)"
    },
    {
      em: "\u{1F30C}",
      title: "Ramo Principal Estelar",
      msg: "Dicen que el universo no tiene centro\u2026 hasta que llegaste t\u00fa a darle uno.",
      detail: "t\u00fa eres el centro de mi cosmos",
      bg: "linear-gradient(165deg, #fffdf6, #ffdf9e)"
    }
  ];

  let msgQueue = [];
  const nextMessage = () => {
    if (!msgQueue.length) msgQueue = shuffle(MESSAGES);
    return msgQueue.pop();
  };

  /* ---------- estallido ---------- */

  const burstsEl = document.getElementById("bursts");
  const EMOJIS = ["\u{1F49B}", "\u2728", "\u{1F31F}", "\u{1F33B}", "\u{1F4AB}"];

  function burst(x, y, amount) {
    if (reduce) return;
    for (let i = 0; i < amount; i++) {
      const it = document.createElement("span");
      it.className = "burst-item";
      it.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      it.style.left = x + "px";
      it.style.top = y + "px";
      const ang = Math.random() * Math.PI * 2;
      const dist = (60 + Math.random() * 120) * (1 + Math.random());
      it.style.setProperty("--dx", Math.round(Math.cos(ang) * dist) + "px");
      it.style.setProperty("--dy", Math.round(Math.sin(ang) * dist) + "px");
      it.style.setProperty("--dr", Math.round(Math.random() * 400 - 200) + "deg");
      it.style.fontSize = (16 + Math.random() * 18) + "px";
      burstsEl.appendChild(it);
      setTimeout(() => it.remove(), 1200);
    }
  }

  /* ---------- tarjetas ---------- */

  const modal = document.getElementById("modal");
  const card = document.getElementById("modalCard");
  const backdrop = document.getElementById("modalBackdrop");
  const ENTRANCES = ["enter-pop", "enter-flip", "enter-wiggle", "enter-zoom", "enter-rise"];

  function openCard(b) {
    card.className = "modal-card card " + ENTRANCES[Math.floor(Math.random() * ENTRANCES.length)];
    card.style.background = b.bg;
    card.innerHTML =
      `<button class="card-close" aria-label="Cerrar">\u00d7</button>` +
      `<span class="card-em">${b.em}</span>` +
      `<h2 class="card-title">${b.title}</h2>` +
      `<div class="card-divider"></div>` +
      `<p class="card-msg">${b.msg}</p>` +
      (b.detail ? `<p class="card-detail">\u2726 ${b.detail}</p>` : "");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    card.querySelector(".card-close").addEventListener("click", closeModal);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- arrastre 3D del universo ---------- */

  const space = document.getElementById("space");
  const scene = document.getElementById("scene");

  let rotX = 0, rotY = 0;
  let targetX = 0, targetY = 0;
  let drag = { active: false, moved: false, x0: 0, y0: 0, lx: 0, ly: 0 };
  let candidate = null;

  scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

  if (!reduce) {
    space.addEventListener("pointerdown", (e) => {
      const bq = e.target.closest(".bq");
      const hero = e.target.closest("#heroWrap");
      if (bq) candidate = { kind: "bq", index: +bq.dataset.index };
      else if (hero) candidate = { kind: "hero" };
      else candidate = null;

      drag.active = true;
      drag.moved = false;
      drag.x0 = drag.lx = e.clientX;
      drag.y0 = drag.ly = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 10) {
        drag.moved = true;
        drag.lx = e.clientX;
        drag.ly = e.clientY;
        return;
      }
      if (!drag.moved) return;
      const mdx = e.clientX - drag.lx;
      const mdy = e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      targetY = Math.max(-18, Math.min(18, targetY + mdx * 0.06));
      targetX = Math.max(-12, Math.min(12, targetX + mdy * 0.05));
    });

    window.addEventListener("pointerup", () => {
      if (drag.active && !drag.moved && candidate) {
        if (candidate.kind === "bq") {
          const b = CARDS[candidate.index];
          const bqEl = bouquetsEl.querySelector(`[data-index="${candidate.index}"]`);
          const rect = bqEl.getBoundingClientRect();
          burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
          openCard(b);
        } else {
          const rect = heroWrap.getBoundingClientRect();
          burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
          openCard(nextMessage());
        }
      }
      targetX = 0;
      targetY = 0;
      drag.active = false;
      drag.moved = false;
      candidate = null;
    });

    (function animate() {
      rotX += (targetX - rotX) * 0.09;
      rotY += (targetY - rotY) * 0.09;
      if (Math.abs(rotX - targetX) < 0.001 && Math.abs(rotY - targetY) < 0.001) {
        rotX = targetX;
        rotY = targetY;
      }
      scene.style.transform = `rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg)`;
      requestAnimationFrame(animate);
    })();
  }

  /* ---------- inclinacion 3D del ramo central ---------- */

  function applyTilt(rx, ry) {
    heroWrap.style.transform = `translate(-50%, -53%) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
  }
  applyTilt(8, 0);

  if (!reduce) {
    let ticking = false;
    heroWrap.addEventListener("pointermove", (e) => {
      if (drag.active || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = heroWrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        applyTilt(14 - py * 26, px * 26);
        ticking = false;
      });
    });
  }
})();
