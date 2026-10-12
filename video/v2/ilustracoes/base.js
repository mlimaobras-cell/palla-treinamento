// Biblioteca de peças desenhadas para as aulas v2 (SVG, coordenadas do quadro 820 × 620 ou 1180 × 560).
// Cada função devolve marcação SVG; as cenas animam pelos atributos data-k (ver Q() no modelo).
// Regra de coerência física: pessoas sempre com os pés no chão ou numa plataforma, nunca sob carga suspensa
// (exceto quando a cena mostra o ERRO, marcado em vermelho), acessórios presos à peça que sobe.
(function () {
  const C = { azul: "#404D91", vermelho: "#D13542", escuro: "#1E2550", cinza: "#5B6178", aco: "#6E7799", acoE: "#4C5578", cabo: "#3A3F55",
    madeira: "#B07A45", madeiraE: "#8A5A2B", verde: "#1F8A5B", ambar: "#C77A12", amarelo: "#F2B705", pele: "#F2C9A8", laranja: "#E86A1A", chao: "#9AA0B8" };

  /** trabalhador com capacete; pés em (0,0); poses: neutro | guia | foto | aponta | prancheta | carrega */
  function pessoa(k, x, y, o = {}) {
    const col = o.colete ?? C.laranja, esc = o.esc ?? 1, flip = o.flip ? -1 : 1;
    const bracos = {
      neutro: `<path d="M0 -92l-16 34M0 -92l16 34" stroke="${C.escuro}" stroke-width="6" stroke-linecap="round"/>`,
      guia: `<path d="M0 -92l-28 22M0 -92l18 26" stroke="${C.escuro}" stroke-width="6" stroke-linecap="round"/>`,
      foto: `<path d="M0 -92l22 -6M0 -92l24 4" stroke="${C.escuro}" stroke-width="6" stroke-linecap="round"/><rect x="20" y="-108" width="22" height="16" rx="3" fill="${C.escuro}"/><circle cx="34" cy="-100" r="4" fill="#fff"/>`,
      aponta: `<path d="M0 -92l34 -18M0 -92l14 30" stroke="${C.escuro}" stroke-width="6" stroke-linecap="round"/>`,
      prancheta: `<path d="M0 -92l20 10M0 -92l14 26" stroke="${C.escuro}" stroke-width="6" stroke-linecap="round"/><rect x="14" y="-92" width="26" height="32" rx="3" fill="#fff" stroke="${C.escuro}" stroke-width="3"/><path d="M19 -84h16M19 -77h16M19 -70h10" stroke="${C.azul}" stroke-width="2.5"/>`,
      carrega: `<path d="M0 -92l-10 -24M0 -92l10 -24" stroke="${C.escuro}" stroke-width="6" stroke-linecap="round"/>`,
    }[o.pose ?? "neutro"];
    const pernas = o.agacha
      ? `<path d="M0 -51l-20 22l4 29M0 -51l18 24l-2 27" stroke="${C.escuro}" stroke-width="7" stroke-linecap="round" fill="none"/>`
      : `<path d="M0 -103v52M0 -51l-16 51M0 -51l16 51" stroke="${C.escuro}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    return `<g data-k="${k}" transform="translate(${x} ${y}) scale(${esc * flip} ${esc})">
      <circle cx="0" cy="-118" r="15" fill="${C.pele}" stroke="${C.escuro}" stroke-width="3"/>
      <path d="M-19 -122a19 17 0 0 1 38 0z" fill="${o.capacete ?? C.amarelo}" stroke="${C.escuro}" stroke-width="3"/>
      ${o.agacha ? `<path d="M0 -103v52" stroke="${C.escuro}" stroke-width="7" stroke-linecap="round"/>` : ""}${pernas}${bracos}
      <rect x="-11" y="-100" width="22" height="34" rx="4" fill="${col}"/></g>`;
  }
  const cone = (x, y) => `<path d="M${x - 13} ${y}l9 -36h8l9 36z" fill="${C.laranja}"/><path d="M${x - 9} ${y - 14}h18" stroke="#fff" stroke-width="5"/><rect x="${x - 17}" y="${y - 4}" width="34" height="5" fill="${C.escuro}"/>`;
  const fita = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${C.vermelho}" stroke-width="6" stroke-dasharray="16 12"/><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#fff" stroke-width="6" stroke-dasharray="12 16" stroke-dashoffset="16"/>`;
  /** isolamento com cones e fita entre x1 e x2 sobre o chão y */
  const isolamento = (k, x1, x2, y) => {
    const n = Math.max(2, Math.round((x2 - x1) / 130)), xs = Array.from({ length: n + 1 }, (_, i) => x1 + (i * (x2 - x1)) / n);
    return `<g data-k="${k}">${fita(x1, x2, y - 26)}${xs.map((x) => cone(x, y)).join("")}</g>`;
  };
  /** viga em vista lateral: (x,y) = canto superior esquerdo */
  const viga = (k, x, y, comp, alt = 34, o = {}) => `<g data-k="${k}" transform="translate(${x} ${y})">
    <rect width="${comp}" height="${alt}" rx="2" fill="${o.cor ?? C.aco}"/><rect width="${comp}" height="6" fill="${C.acoE}"/><rect y="${alt - 6}" width="${comp}" height="6" fill="${C.acoE}"/>
    ${o.marca ? `<rect x="${comp / 2 - 34}" y="${alt / 2 - 12}" width="68" height="24" rx="3" fill="#fff"/><text x="${comp / 2}" y="${alt / 2 + 7}" text-anchor="middle" font-family="Chakra Petch" font-weight="700" font-size="19" fill="${C.escuro}">${o.marca}</text>` : ""}</g>`;
  /** perfil I visto de topo (seção); (x,y) = centro; em pé = alma vertical */
  const perfilI = (x, y, o = {}) => {
    const b = o.b ?? 46, h = o.h ?? 62, tf = 8, tw = 7, emPe = o.emPe !== false;
    const g = `<path d="M${-b / 2} ${-h / 2}h${b}v${tf}h${-(b - tw) / 2}v${h - 2 * tf}h${(b - tw) / 2}v${tf}h${-b}v${-tf}h${(b - tw) / 2}v${-(h - 2 * tf)}h${-(b - tw) / 2}z" fill="${o.cor ?? C.aco}" stroke="${C.acoE}" stroke-width="2"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${emPe ? 0 : 90})">${g}</g>`;
  };
  const caibro = (x, y, w = 60, h = 14) => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="2" fill="${C.madeira}" stroke="${C.madeiraE}" stroke-width="2"/>`;
  /** carreta de lado: (x,y) = pneu traseiro no chão; plataforma em y-74 de x até x+520 */
  const carreta = (k, x, y) => `<g data-k="${k}" transform="translate(${x} ${y})">
    <rect x="0" y="-78" width="520" height="16" fill="#5C6380"/><rect x="520" y="-150" width="110" height="104" rx="10" fill="${C.azul}"/>
    <rect x="560" y="-140" width="58" height="40" rx="4" fill="#C9D3F2"/><rect x="500" y="-62" width="140" height="22" fill="#5C6380"/>
    ${[40, 100, 470, 590].map((cx) => `<circle cx="${cx}" cy="-22" r="22" fill="#2B2F45"/><circle cx="${cx}" cy="-22" r="9" fill="#9AA0B8"/>`).join("")}</g>`;
  /** guindaste sobre pneus: pivô da lança em (px,py) relativos; desenho base em (x,y) chão */
  const guindaste = (k, x, y, o = {}) => `<g data-k="${k}" transform="translate(${x} ${y})">
    <g data-k="${k}-pat" opacity="${o.patolas === false ? 0 : 1}"><rect x="-150" y="-22" width="30" height="22" fill="#5C6380"/><rect x="200" y="-22" width="30" height="22" fill="#5C6380"/>
      <rect x="-170" y="-6" width="70" height="6" fill="${C.madeira}"/><rect x="180" y="-6" width="70" height="6" fill="${C.madeira}"/><rect x="-136" y="-48" width="352" height="12" fill="#5C6380"/></g>
    <rect x="-120" y="-84" width="300" height="40" rx="6" fill="${C.amarelo}" stroke="#A97F00" stroke-width="3"/>
    ${[-80, -20, 100, 150].map((cx) => `<circle cx="${cx}" cy="-30" r="24" fill="#2B2F45"/><circle cx="${cx}" cy="-30" r="9" fill="#9AA0B8"/>`).join("")}
    <rect x="-40" y="-130" width="120" height="48" rx="6" fill="${C.amarelo}" stroke="#A97F00" stroke-width="3"/><rect x="40" y="-124" width="32" height="30" rx="3" fill="#C9D3F2"/>
    <g data-k="${k}-lanca"><rect x="0" y="-10" width="${o.comp ?? 420}" height="20" rx="4" fill="${C.amarelo}" stroke="#A97F00" stroke-width="3"/><line x1="20" y1="0" x2="${(o.comp ?? 420) - 10}" y2="0" stroke="#A97F00" stroke-width="2"/></g>
    <circle cx="0" cy="-106" r="9" fill="${C.cabo}"/>
    <line data-k="${k}-cabo" stroke="${C.cabo}" stroke-width="4"/>
    <g data-k="${k}-gancho"><rect x="-16" y="-24" width="32" height="22" rx="4" fill="${C.cabo}"/><path d="M0 -2v8a9 9 0 1 1 -9 9" fill="none" stroke="${C.cabo}" stroke-width="5" stroke-linecap="round"/></g></g>`;
  /** posiciona lança do guindaste: ângulo em graus (da horizontal), comprimento, comprimento de cabo; devolve ponta do gancho em coords do svg */
  function poseGuindaste(q, k, x, y, ang, comp, cabo) {
    const piv = { x: 0, y: -106 }, a = (ang * Math.PI) / 180;
    q(`${k}-lanca`).setAttribute("transform", `translate(${piv.x} ${piv.y}) rotate(${-ang})`);
    const ponta = { x: piv.x + comp * Math.cos(a), y: piv.y - comp * Math.sin(a) };
    const cb = q(`${k}-cabo`); cb.setAttribute("x1", ponta.x); cb.setAttribute("y1", ponta.y); cb.setAttribute("x2", ponta.x); cb.setAttribute("y2", ponta.y + cabo - 24);
    q(`${k}-gancho`).setAttribute("transform", `translate(${ponta.x} ${ponta.y + cabo})`);
    return { x: x + ponta.x, y: y + ponta.y + cabo + 16, raio: ponta.x };
  }
  /** selos ✓ e ✗ e número em círculo */
  const ok = (k, x, y, r = 22) => `<g data-k="${k}" transform="translate(${x} ${y})"><circle r="${r}" fill="${C.verde}"/><path d="M${-r * .45} 0l${r * .3} ${r * .32}l${r * .55} ${-r * .6}" fill="none" stroke="#fff" stroke-width="${r * .22}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const xis = (k, x, y, r = 22) => `<g data-k="${k}" transform="translate(${x} ${y})"><circle r="${r}" fill="${C.vermelho}"/><path d="M${-r * .4} ${-r * .4}l${r * .8} ${r * .8}M${r * .4} ${-r * .4}l${-r * .8} ${r * .8}" stroke="#fff" stroke-width="${r * .22}" stroke-linecap="round"/></g>`;
  const num = (k, x, y, n, cor = C.vermelho) => `<g data-k="${k}" transform="translate(${x} ${y})"><circle r="19" fill="${cor}"/><text y="8" text-anchor="middle" font-family="Chakra Petch" font-weight="700" font-size="22" fill="#fff">${n}</text></g>`;
  const rotulo = (k, x, y, txt, o = {}) => `<text data-k="${k}" x="${x}" y="${y}" font-size="${o.tam ?? 24}" font-weight="600" fill="${o.cor ?? C.escuro}" text-anchor="${o.anc ?? "start"}">${txt}</text>`;
  /** helpers de animação */
  const vis = (el, v) => { if (el) el.style.opacity = v; };
  const pos = (el, x, y, r = 0, s = 1) => { if (el) el.setAttribute("transform", `translate(${x} ${y}) rotate(${r}) scale(${s})`); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const pisca = (t, ini, fim) => (t > ini && t < fim ? .55 + .45 * Math.sin((t - ini) * 9) : 0);

  window.B = { C, pessoa, cone, fita, isolamento, viga, perfilI, caibro, carreta, guindaste, poseGuindaste, ok, xis, num, rotulo, vis, pos, lerp, pisca };
})();
