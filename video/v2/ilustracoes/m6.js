// Ilustrações do Módulo 6 (metrologia e topografia de montagem). Conteúdo: Caderno do Módulo 6 (revisão 2); NBR 8800:2008 citada no caderno.
(function () {
  const { C, pessoa, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 500, LP = "#D9DCE8", CONC = "#C9CCD6", LASER = "#E0404A";
  const T = (x, y, txt, tam = 20, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;
  const card = (k, x, y, w, h, titulo, corpo, sub = "") => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${LP}" stroke-width="2"/>
    ${T(0, 34, titulo, 21, C.escuro, "middle", 700)}${corpo}${sub ? `<foreignObject x="${-w / 2 + 8}" y="${h - 62}" width="${w - 16}" height="58"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 16px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.2">${sub}</div></foreignObject>` : ""}</g>`;
  const tripe = (x, y, s = 1, topo = "") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -90l-40 90M0 -90l40 90M0 -90v90" stroke="${C.cinza}" stroke-width="5"/>${topo}</g>`;
  const estacao = `<rect x="-22" y="-140" width="44" height="50" rx="6" fill="${C.ambar}"/><circle cx="0" cy="-122" r="10" fill="${C.escuro}"/>`;
  const nivelLaser = `<rect x="-26" y="-120" width="52" height="30" rx="6" fill="${C.vermelho}"/><circle cx="0" cy="-105" r="7" fill="#fff"/>`;

  // ------------------------------------------------------------ 6.1 alinhar antes de fixar
  D.acumula = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>${[0, 1, 2].map((i) => `<g data-k="pl${i}"><path d="M0 0v-300" stroke="${C.aco}" stroke-width="16"/></g>`).join("")}
      ${[0, 1].map((i) => `<path data-k="vg${i}" d="M0 0h0" stroke="${C.acoE}" stroke-width="14"/>`).join("")}
      <path data-k="ref" d="M160 ${CHAO}v-320M410 ${CHAO}v-320M660 ${CHAO}v-320" stroke="${C.verde}" stroke-width="2" stroke-dasharray="8 6"/>
      <g data-k="err">${T(410, 90, "o erro de um pilar passa para o próximo", 22, C.vermelho, "middle", 700)}</g>
      <g data-k="ok" transform="translate(410 70)"><rect x="-370" y="-34" width="740" height="68" rx="10" fill="${C.verde}"/>${T(0, 8, "estaiar, alinhar, nivelar, aprumar · depois fixar de vez", 22, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      const inc = 4 * P(t, m.e, 1.4) * (1 - P(t, m.c, 1.4));
      [0, 1, 2].forEach((i) => q(`pl${i}`).setAttribute("transform", `translate(${160 + i * 250} ${CHAO}) rotate(${inc * (1 + i * .35)})`));
      const topo = (i) => { const a = inc * (1 + i * .35) * Math.PI / 180; return [160 + i * 250 + Math.sin(a) * 300, CHAO - Math.cos(a) * 300]; };
      [0, 1].forEach((i) => { const a = topo(i), b = topo(i + 1); q(`vg${i}`).setAttribute("d", `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`); });
      vis(q("ref"), P(t, m.e)); vis(q("err"), P(t, m.e + .6) * (1 - P(t, m.c))); vis(q("ok"), P(t, m.c));
    },
  };
  const ICOI = [
    ["Trena de aço", "entre eixos, chumbadores, furos", `<circle r="34" fill="${C.ambar}"/><circle r="12" fill="${C.escuro}"/><path d="M30 18h60" stroke="#E8C24A" stroke-width="10"/>`],
    ["Linha de náilon", "alinhar chumbadores, bases, terças", `<path d="M-70 0h140" stroke="${C.azul}" stroke-width="2"/><circle cx="-70" cy="0" r="8" fill="${C.escuro}"/><circle cx="70" cy="0" r="8" fill="${C.escuro}"/>`],
    ["Prumo e nível de bolha", "verificações rápidas", `<path d="M-60 -40v50" stroke="${C.escuro}" stroke-width="2"/><path d="M-60 10l-10 22h20z" fill="${C.escuro}"/><rect x="-20" y="-10" width="90" height="22" rx="4" fill="${C.ambar}"/><rect x="16" y="-6" width="18" height="14" rx="6" fill="#9FE0A0"/>`],
    ["Mangueira de nível", "transferir nível entre pontos próximos", `<path d="M-60 -30v50q0 20 20 20h80q20 0 20 -20v-50" fill="none" stroke="#5AA9E6" stroke-width="8"/><path d="M-68 -6h16M52 -6h16" stroke="${C.vermelho}" stroke-width="3"/>`],
    ["Nível óptico ou laser", "bases e topo de vigas na obra toda", `<g transform="translate(0 60) scale(.6)">${tripe(0, 0, 1, nivelLaser)}</g><path d="M14 -3h70" stroke="${LASER}" stroke-width="3"/>`],
    ["Teodolito / estação total", "eixos, prumo de pilares altos", `<g transform="translate(0 70) scale(.6)">${tripe(0, 0, 1, estacao)}</g>`],
    ["Paquímetro e esquadro", "peças, chapas, furos, esquadro", `<path d="M-70 -20h120v14h-120z" fill="${C.cinza}"/><path d="M-70 -6v40h12v-40M30 -6v26h10v-26" fill="${C.cinza}"/><path d="M50 30v-60h12v48h40v12z" fill="${C.azul}"/>`],
  ];
  D.instrumentos = {
    largo: true,
    svg: () => ICOI.map(([nome, sub, corpo], i) => { const lin = i < 4 ? 0 : 1, col = lin ? i - 4 : i, x = lin ? 220 + col * 370 : 160 + col * 287; return card(`i${i + 1}`, x, 20 + lin * 270, lin ? 340 : 270, 250, nome, `<g transform="translate(0 115)">${corpo}</g>`, sub); }).join(""),
    quadro(raiz, t, m, c, q) { for (let i = 1; i <= 7; i++) vis(q(`i${i}`), P(t, m[`i${i}`])); },
  };
  D.calibracao = {
    svg: () => `${tripe(220, CHAO, 1.6, estacao)}<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="id" transform="translate(300 230)"><rect x="0" y="0" width="150" height="70" rx="6" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(12, 26, "ID: ET-02", 18, C.escuro, "start", 700)}${T(12, 54, "próx.: mm/aaaa", 16, C.cinza)}<path d="M0 35l-60 -20" stroke="${C.escuro}" stroke-width="2"/></g>
      <g data-k="ce" transform="translate(560 120)"><path d="M0 0h170l30 30v230h-200z" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/>${T(100, 50, "Certificado", 20, C.azul, "middle", 700)}${T(100, 76, "de calibração", 18, C.azul, "middle", 600)}${[0, 1, 2, 3].map((i) => `<path d="M24 ${110 + i * 26}h150" stroke="${LP}" stroke-width="6" stroke-linecap="round"/>`).join("")}${ok("", 170, 230, 18)}${T(100, 290, "cópia arquivada na obra", 16, C.cinza, "middle")}</g>
      <g data-k="ve" transform="translate(300 400) rotate(-6)"><rect x="-10" y="-30" width="240" height="56" rx="6" fill="${C.vermelho}"/>${T(110, 6, "VENCIDO: FORA DE USO", 20, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("id"), P(t, m.id)); vis(q("ce"), P(t, m.ce)); vis(q("ve"), P(t, m.ve)); },
  };
  D.referencias = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="mc" transform="translate(120 ${CHAO})"><path d="M-30 0l8 -40h44l8 40z" fill="${CONC}"/><path d="M-10 -40h20M0 -50v20" stroke="${C.vermelho}" stroke-width="4"/>${T(0, 36, "marco de eixo", 18, C.escuro, "middle", 700)}${T(0, 58, "protegido, nunca removido", 15, C.cinza, "middle")}</g>
      <g data-k="rn" transform="translate(320 ${CHAO})"><rect x="-26" y="-50" width="52" height="50" fill="${CONC}"/><circle cy="-50" r="9" fill="${C.azul}"/>${T(0, 36, "referência de nível", 18, C.escuro, "middle", 700)}${T(0, 58, "o “nível zero”", 15, C.cinza, "middle")}</g>
      <g data-k="fr" transform="translate(660 ${CHAO})"><path d="M-80 0v-220M80 0v-220" stroke="${C.aco}" stroke-width="14"/>${T(0, 36, "frente de trabalho", 18, C.escuro, "middle", 700)}</g>
      <path data-k="tr" d="M150 ${CHAO - 70}C300 ${CHAO - 260} 480 ${CHAO - 260} 570 ${CHAO - 140}" fill="none" stroke="${C.azul}" stroke-width="4" stroke-dasharray="10 6" marker-end="url(#pa-${u})"/>
      <path data-k="cf" d="M570 ${CHAO - 110}C480 ${CHAO - 30} 400 ${CHAO - 30} 340 ${CHAO - 70}" fill="none" stroke="${C.verde}" stroke-width="4" stroke-dasharray="10 6" marker-end="url(#pg-${u})"/>
      <g data-k="trT">${T(360, CHAO - 250, "transferir eixo e nível", 19, C.azul, "middle", 700)}</g><g data-k="cfT">${T(470, CHAO - 10, "conferir de volta", 19, C.verde, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("mc"), P(t, m.mc)); vis(q("rn"), P(t, m.rn)); vis(q("fr"), P(t, m.tr)); vis(q("tr"), P(t, m.tr + .3)); vis(q("trT"), P(t, m.tr + .3)); vis(q("cf"), P(t, m.cf)); vis(q("cfT"), P(t, m.cf)); },
  };

  // ------------------------------------------------------------ 6.2 chumbadores e bases
  D.chumbadores = {
    svg: (u) => `<g transform="translate(220 260)">${T(0, -190, "vista de cima", 18, C.cinza, "middle")}<rect x="-130" y="-130" width="260" height="260" fill="${CONC}"/>
        <path data-k="eix" d="M-170 0h340M0 -170v340" stroke="${C.vermelho}" stroke-width="2" stroke-dasharray="10 6"/>
        <path data-k="lin" d="M-170 -60h340M-170 60h340" stroke="${C.azul}" stroke-width="2"/>
        ${[[-60, -60], [60, -60], [-60, 60], [60, 60]].map(([x, y], i) => `<g data-k="c${i}"><circle cx="${x}" cy="${y}" r="13" fill="${C.escuro}"/>${num("", x + 26, y - 22, i + 1, C.azul).replace('r="19"', 'r="13"').replace('font-size="22"', 'font-size="15"').replace('y="8"', 'y="5"')}</g>`).join("")}
        <g data-k="tre"><path d="M0 -60h60" stroke="${C.ambar}" stroke-width="6"/>${T(30, -76, "ao eixo", 15, C.ambar, "middle", 700)}<path d="M-60 100h120" stroke="${C.ambar}" stroke-width="6"/>${T(0, 124, "entre chumbadores", 15, C.ambar, "middle", 700)}</g></g>
      <g transform="translate(600 0)">${T(0, 70, "vista de lado", 18, C.cinza, "middle")}<rect x="-140" y="${CHAO - 60}" width="280" height="60" fill="${CONC}"/>
        <g data-k="pr"><rect x="-8" y="${CHAO - 230}" width="16" height="200" fill="${C.escuro}"/><path d="M60 ${CHAO - 250}v230" stroke="${C.verde}" stroke-width="2" stroke-dasharray="6 4"/>${T(70, CHAO - 200, "prumo", 16, C.verde, "start", 700)}</g>
        <g data-k="pj"><path d="M-40 ${CHAO - 230}v170M-52 ${CHAO - 230}h24M-52 ${CHAO - 60}h24" stroke="${C.vermelho}" stroke-width="3"/>${T(-56, CHAO - 140, "projeção", 16, C.vermelho, "end", 700)}</g>
        <g data-k="rs"><g data-k="porca" transform="translate(0 ${CHAO - 230})"><rect x="-20" y="0" width="40" height="18" rx="3" fill="${C.ambar}"/></g>${T(0, CHAO - 270, "porca de teste: entra com a mão", 16, C.ambar, "middle", 700)}</g></g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("eix"), P(t, m.q)); [0, 1, 2, 3].forEach((i) => vis(q(`c${i}`), P(t, m.q + i * .35)));
      vis(q("lin"), P(t, m.p)); vis(q("tre"), P(t, m.p + .5)); vis(q("pj"), P(t, m.pj)); vis(q("pr"), P(t, (m.pj ?? 0) - .2));
      vis(q("rs"), P(t, m.r)); q("porca").setAttribute("transform", `translate(0 ${CHAO - 230 + 80 * P(t, m.r + .3, 1.8)})`);
    },
  };
  D.chumbErrado = {
    svg: () => `<rect x="80" y="${CHAO - 60}" width="360" height="60" fill="${CONC}"/><path d="M200 ${CHAO - 60}v-80l40 -60" fill="none" stroke="${C.escuro}" stroke-width="16"/><rect x="300" y="${CHAO - 120}" width="16" height="60" fill="${C.escuro}"/><path d="M290 ${CHAO - 124}l36 -8" stroke="${C.vermelho}" stroke-width="5"/>
      <g data-k="e">${xis("", 260, 210, 26)}${T(260, 160, "dobrar ou cortar por conta própria", 20, C.vermelho, "middle", 700)}</g>
      <g data-k="k" transform="translate(620 280)"><rect x="-170" y="-120" width="340" height="240" rx="12" fill="#fff" stroke="${C.verde}" stroke-width="3"/>${T(0, -80, "fora do projeto:", 21, C.verde, "middle", 700)}${["comunicar o cliente", "comunicar a engenharia", "registrar no diário"].map((s, i) => `${ok("", -130, -30 + i * 50, 13)}${T(-108, -24 + i * 50, s, 19, C.escuro)}`).join("")}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("e"), P(t, m.e)); vis(q("k"), P(t, m.k)); },
  };
  D.nivelamento = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><rect x="200" y="${CHAO - 90}" width="300" height="90" fill="${CONC}"/>
      <path d="M260 ${CHAO - 90}v-80M440 ${CHAO - 90}v-80" stroke="${C.escuro}" stroke-width="10"/>
      <g data-k="n"><rect x="246" y="${CHAO - 136}" width="28" height="14" fill="${C.ambar}"/><rect x="426" y="${CHAO - 136}" width="28" height="14" fill="${C.ambar}"/>${T(350, CHAO - 50, "porcas niveladoras", 17, C.escuro, "middle", 700)}</g>
      <g data-k="l">${tripe(700, CHAO, 1.1, nivelLaser)}<path d="M672 ${CHAO - 115}H180" stroke="${LASER}" stroke-width="3" opacity=".8"/>${T(700, CHAO - 160, "nível laser", 17, C.vermelho, "middle", 700)}</g>
      <g data-k="pi"><rect x="230" y="${CHAO - 122}" width="240" height="14" fill="${C.aco}"/><rect x="335" y="${CHAO - 420}" width="30" height="298" fill="${C.aco}"/></g>
      <g data-k="pr"><path d="M390 ${CHAO - 430}v300" stroke="${C.verde}" stroke-width="2" stroke-dasharray="6 4"/>${T(398, CHAO - 380, "prumo + alinhamento", 16, C.verde, "start", 700)}</g>
      <g data-k="at">${T(398, CHAO - 350, "aperto final", 16, C.azul, "start", 700)}</g>
      <g data-k="g"><path d="M230 ${CHAO - 108}h240v18h-240z" fill="#9A9DA8"/>${T(350, CHAO + 30, "graute por último", 18, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["n", "l", "pi", "pr", "at", "g"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 6.3 prumo e tolerâncias
  D.prumo = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><g data-k="pil"><rect x="-14" y="-380" width="28" height="380" fill="${C.aco}"/></g>
      <path d="M260 ${CHAO}v-400" stroke="${C.verde}" stroke-width="2" stroke-dasharray="8 6"/>${T(268, CHAO - 404, "linha de trabalho", 15, C.verde)}
      <g data-k="alt"><path d="M150 ${CHAO}v-380M140 ${CHAO}h20M140 ${CHAO - 380}h20" stroke="${C.cinza}" stroke-width="2"/>${T(140, CHAO - 190, "9 m", 22, C.cinza, "end", 700)}</g>
      <g data-k="lim" transform="translate(600 130)"><rect x="-170" y="-50" width="340" height="100" rx="10" fill="${C.escuro}"/>${T(0, -10, "limite = altura ÷ 500", 21, "#fff", "middle", 700)}${T(0, 26, "9.000 ÷ 500 = 18 mm", 23, "#fff", "middle", 700)}</g>
      <g data-k="d1" transform="translate(600 260)">${T(-150, 0, "direção 1: 12 mm", 22, C.escuro, "start", 700)}${ok("", 150, -8, 18)}</g>
      <g data-k="d2" transform="translate(600 320)">${T(-150, 0, "direção 2: 21 mm", 22, C.vermelho, "start", 700)}${xis("", 150, -8, 18)}</g>
      <g data-k="aj" transform="translate(600 400)"><rect x="-170" y="-34" width="340" height="68" rx="10" fill="${C.vermelho}"/>${T(0, 8, "ajustar antes do torque final", 20, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      const ang = 2.6 * P(t, m.d2, 1) * (1 - P(t, m.aj + .4, 1.4)) + 1.5 * P(t, m.d1, 1) * (1 - P(t, m.d2, .6));
      q("pil").setAttribute("transform", `translate(260 ${CHAO}) rotate(${ang})`);
      vis(q("alt"), P(t, m.p)); vis(q("lim"), P(t, m.lim)); vis(q("d1"), P(t, m.d1)); vis(q("d2"), P(t, m.d2)); vis(q("aj"), P(t, m.aj));
    },
  };
  D.emenda = {
    largo: true,
    svg: () => [["a", "até 1,5 mm", "aceita", 6, C.verde, ""], ["c", "de 1,5 a 6 mm", "falta contato: calço de aço de faces paralelas", 20, C.ambar, `<rect x="-60" y="-10" width="50" height="20" fill="${C.ambar}"/>`], ["e", "acima de 6 mm", "consultar a engenharia", 40, C.vermelho, ""]]
      .map(([k, nome, sub, gap, cor, calco], i) => `<g data-k="${k}" transform="translate(${210 + i * 380} 40)"><rect x="-170" y="0" width="340" height="440" rx="12" fill="#fff" stroke="${cor}" stroke-width="3"/>${T(0, 44, nome, 26, cor, "middle", 700)}
        <g transform="translate(0 210)"><rect x="-60" y="${-130 - gap / 2}" width="120" height="130" fill="${C.aco}"/><rect x="-60" y="${gap / 2}" width="120" height="130" fill="${C.acoE}"/>${calco}<path d="M80 ${-gap / 2}h30M80 ${gap / 2}h30" stroke="${cor}" stroke-width="2"/></g>
        <foreignObject x="-160" y="376" width="320" height="60"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 19px 'IBM Plex Sans';text-align:center;color:${C.escuro};line-height:1.2">${sub}</div></foreignObject></g>`).join(""),
    quadro(raiz, t, m, c, q) { ["a", "c", "e"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.liberacao = {
    largo: true,
    svg: (u) => `${[["t", 150, "Topógrafo", "prumo, nível, eixos · equipamento calibrado", C.azul], ["c", 470, "Encarregado", "compara o laudo com as tolerâncias", C.azul]].map(([k, x, nome, sub, cor]) => `<g data-k="${k}" transform="translate(${x} 200)"><rect x="-130" y="-80" width="260" height="160" rx="12" fill="${cor}"/>${T(0, -26, nome, 24, "#fff", "middle", 700)}<foreignObject x="-120" y="-6" width="240" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 17px 'IBM Plex Sans';text-align:center;color:#fff;line-height:1.2">${sub}</div></foreignObject></g>`).join("")}
      <path data-k="a1" d="M286 200h44" stroke="${C.escuro}" stroke-width="5" marker-end="url(#pe-${u})"/>
      <g data-k="d" transform="translate(900 110)"><path d="M-300 90L-140 0" stroke="${C.verde}" stroke-width="5" marker-end="url(#pg-${u})"/><rect x="-130" y="-60" width="380" height="120" rx="12" fill="${C.verde}"/>${T(60, -14, "Dentro: libera a etapa", 22, "#fff", "middle", 700)}${T(60, 18, "e registra no diário", 20, "#fff", "middle", 600)}</g>
      <g data-k="f" transform="translate(900 300)"><path d="M-300 -100L-140 0" stroke="${C.vermelho}" stroke-width="5" marker-end="url(#pv-${u})"/><rect x="-130" y="-60" width="380" height="120" rx="12" fill="${C.vermelho}"/>${T(60, -14, "Fora: ação com o cliente", 22, "#fff", "middle", 700)}${T(60, 18, "e registro", 20, "#fff", "middle", 600)}</g>
      <g data-k="px" transform="translate(590 470)"><rect x="-500" y="-36" width="1000" height="72" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>${T(0, 10, "etapa liberada → torque final, cobertura, fechamento", 24, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("t"), P(t, m.t)); vis(q("a1"), P(t, m.c)); vis(q("c"), P(t, m.c)); vis(q("d"), P(t, m.d)); vis(q("f"), P(t, m.f)); vis(q("px"), P(t, m.px)); },
  };
})();
