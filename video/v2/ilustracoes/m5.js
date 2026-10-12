// Ilustrações do Módulo 5 (soldagem estrutural aplicada). Conteúdo: Caderno do Módulo 5 (revisão 2), AWS D1.1:2010 citada no caderno.
(function () {
  const { C, pessoa, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const LP = "#D9DCE8", SOLDA = "#C9862B", ESC = "#5B4A3A";
  const T = (x, y, txt, tam = 20, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;
  const card = (k, x, y, w, h, titulo, corpo, sub = "", cor = null) => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${cor ?? LP}" stroke-width="${cor ? 4 : 2}"/>
    ${T(0, 40, titulo, 24, cor ?? C.escuro, "middle", 700)}${corpo}${sub ? `<foreignObject x="${-w / 2 + 10}" y="${h - 96}" width="${w - 20}" height="90"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 18px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${sub}</div></foreignObject>` : ""}</g>`;
  const faisca = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="10" fill="#FFF4B0"/><circle r="5" fill="#fff"/>${[0, 50, 110, 160, 220, 290].map((a) => `<path d="M0 0l${Math.cos(a * Math.PI / 180) * 26} ${Math.sin(a * Math.PI / 180) * 26}" stroke="#F2B233" stroke-width="2.5"/>`).join("")}</g>`;
  const filete = (x, y, l = 60) => `<path d="M${x} ${y}l${l} 0l${-l} ${-l}z" fill="${SOLDA}"/>`;
  // junta em T vista em corte: chapa base + alma; cordão nos dois lados
  const juntaT = (s = 1, extra = "") => `<g transform="scale(${s})"><rect x="-120" y="20" width="240" height="30" fill="${C.aco}"/><rect x="-14" y="-90" width="28" height="110" fill="${C.aco}"/><path d="M14 20h26l-26 -26z" fill="${SOLDA}"/><path d="M-14 20h-26l26 -26z" fill="${SOLDA}"/>${extra}</g>`;

  // ------------------------------------------------------------ 5.1 processos (largo)
  const ICOP = {
    s: `<path d="M-70 40l90 -90" stroke="${C.escuro}" stroke-width="14" stroke-linecap="round"/><path d="M20 -50l40 -40" stroke="#8A7A5A" stroke-width="8"/>${faisca(62, -92, .9)}<path d="M-100 60h200" stroke="${C.aco}" stroke-width="12"/>`,
    g: `<path d="M-80 40l70 -70" stroke="${C.azul}" stroke-width="22" stroke-linecap="round"/><path d="M-10 -30l30 -30" stroke="${C.cinza}" stroke-width="10"/>${faisca(26, -64, .9)}${[0, 1, 2].map((i) => `<path data-k="gas${i}" d="M${50 + i * 14} ${-90 + i * 10}q14 -8 28 0" fill="none" stroke="#9AD0F5" stroke-width="4"/>`).join("")}<path d="M-100 60h200" stroke="${C.aco}" stroke-width="12"/>`,
    f: `<circle cx="-40" cy="-10" r="50" fill="none" stroke="${C.cinza}" stroke-width="12"/><circle cx="-40" cy="-10" r="14" fill="${C.cinza}"/><path d="M10 -10q40 0 50 -50" fill="none" stroke="${SOLDA}" stroke-width="5"/>${faisca(60, -64, .8)}<path d="M-100 60h200" stroke="${C.aco}" stroke-width="12"/>`,
  };
  D.processos = {
    largo: true,
    svg: () => [["s", "SMAW · eletrodo revestido", "o mais comum na obra · tolera vento · eletrodo básico exige estufa"], ["g", "GMAW · MIG/MAG", "arame + gás · produtivo · vento sopra o gás: anteparo"], ["f", "FCAW · arame tubular", "fluxo interno · versões autoprotegidas para campo"]]
      .map(([k, nome, sub], i) => card(k, 210 + i * 380, 30, 360, 400, nome, `<g transform="translate(0 170)">${ICOP[k]}</g>`, sub)).join("")
      + `<g data-k="w" transform="translate(590 490)"><rect x="-460" y="-34" width="920" height="68" rx="10" fill="${C.vermelho}"/>${T(0, 10, "O processo de cada junta é o da WPS. Não se troca na obra.", 25, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["s", "g", "f", "w"].forEach((k) => vis(q(k), P(t, m[k]))); [0, 1, 2].forEach((i) => { const el = q(`gas${i}`); if (el) el.setAttribute("transform", `translate(${(t * 40 + i * 12) % 40} 0)`); }); },
  };
  const doc = (k, x, titulo, corpo, sub) => `<g data-k="${k}" transform="translate(${x} 70)"><path d="M-110 0h190l30 30v290h-220z" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/>${T(0, 46, titulo, 26, C.azul, "middle", 700)}${corpo}${T(0, 360, sub, 18, C.cinza, "middle")}</g>`;
  D.wps = {
    svg: () => doc("w", 150, "WPS", ["processo", "consumível", "junta e posição", "corrente, tensão", "pré-aquecimento", "passes"].map((s, i) => T(-90, 90 + i * 32, `· ${s}`, 16, C.escuro)).join(""), "a “receita”")
      + doc("p", 410, "PQR", `<g transform="translate(0 170)"><path d="M-70 30q70 -110 140 0" fill="none" stroke="${C.aco}" stroke-width="22"/>${ok("", 0, 70, 22)}</g>`, "ensaios que provam a receita")
      + doc("q", 670, "Soldador", `<g transform="translate(0 150)"><circle cy="-20" r="30" fill="${C.ambar}"/><path d="M-50 60q50 -70 100 0" fill="${C.azul}"/>${T(0, 100, "processo · posição", 15, C.escuro, "middle")}${T(0, 120, "tipo de junta", 15, C.escuro, "middle")}</g>`, "qualificado (AWS D1.1, cap. 4)")
      + `<g data-k="v" transform="translate(670 470)">${T(0, 0, "+ de 6 meses sem usar o processo:", 17, C.vermelho, "middle", 700)}${T(0, 24, "qualificação perde a validade", 17, C.vermelho, "middle", 700)}</g>
      <g data-k="n" transform="translate(300 495)"><rect x="-260" y="-36" width="520" height="70" rx="10" fill="${C.vermelho}"/>${T(0, -6, "Sem WPS aprovada ou sem soldador", 21, "#fff", "middle", 700)}${T(0, 20, "qualificado, a solda não começa.", 21, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["w", "p", "q", "v", "n"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  // posições: chapa + tocha em 4 orientações
  const POS = [
    ["1", "plana", `<rect x="-70" y="10" width="140" height="18" fill="${C.aco}"/><path d="M0 -60v60" stroke="${C.escuro}" stroke-width="8"/>`],
    ["2", "horizontal", `<rect x="-14" y="-70" width="18" height="140" fill="${C.aco}"/><path d="M-80 0h66" stroke="${C.escuro}" stroke-width="8"/><path d="M-8 -6h-12v12" fill="${SOLDA}"/>`],
    ["3", "vertical", `<rect x="-14" y="-70" width="18" height="140" fill="${C.aco}"/><path d="M-80 -20h66" stroke="${C.escuro}" stroke-width="8"/><path d="M-30 50v-90" stroke="${SOLDA}" stroke-width="6" stroke-dasharray="6 4"/>`],
    ["4", "sobrecabeça", `<rect x="-70" y="-50" width="140" height="18" fill="${C.aco}"/><path d="M0 50v-82" stroke="${C.escuro}" stroke-width="8"/>${pessoa("", 60, 110, { esc: .45 })}`],
  ];
  D.posicoes = {
    svg: () => POS.map(([n, nome, corpo], i) => `<g data-k="p${n}" transform="translate(${110 + i * 200} 220)"><rect x="-90" y="-120" width="180" height="250" rx="12" fill="#fff" stroke="${LP}" stroke-width="2"/>${corpo}${T(0, -82, n, 34, C.azul, "middle", 700)}${T(0, 110, nome, 20, C.escuro, "middle", 700)}</g>`).join("")
      + `<g data-k="fg" transform="translate(410 440)"><rect x="-360" y="-40" width="720" height="110" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -4, "F = filete (1F a 4F) · G = chanfro (1G a 4G)", 23, C.escuro, "middle", 700)}${T(0, 34, "só as posições do certificado do soldador", 20, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["1", "2", "3", "4"].forEach((n) => vis(q(`p${n}`), P(t, m[`p${n}`]))); vis(q("fg"), P(t, m.fg)); },
  };
  D.estufa = {
    svg: () => `<g data-k="e" transform="translate(200 280)"><rect x="-130" y="-150" width="260" height="290" rx="14" fill="${C.escuro}"/><rect x="-100" y="-110" width="200" height="180" rx="6" fill="#2A3268"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${-80 + i * 24}" y="-70" width="8" height="120" fill="${SOLDA}"/>`).join("")}
        <rect x="-60" y="90" width="120" height="36" rx="6" fill="#fff"/><text data-k="tmp" x="0" y="116" font-size="24" font-weight="700" fill="${C.vermelho}" text-anchor="middle">25 °C</text>${T(0, 172, "estufa: mínimo 120 °C", 20, C.escuro, "middle", 700)}</g>
      <g data-k="h" transform="translate(540 190)"><circle r="70" fill="#fff" stroke="${C.escuro}" stroke-width="5"/><path data-k="pont" d="M0 0V-50" stroke="${C.vermelho}" stroke-width="6" stroke-linecap="round"/><path d="M0 0H34" stroke="${C.escuro}" stroke-width="5" stroke-linecap="round"/>${T(0, 106, "fora da estufa:", 19, C.escuro, "middle", 700)}${T(0, 132, "no máximo 4 horas (E70XX)", 19, C.vermelho, "middle", 700)}</g>
      <g data-k="c" transform="translate(540 420)"><rect x="-40" y="-50" width="80" height="100" rx="30" fill="${C.cinza}"/>${T(0, 80, "cochicho aquecido no posto", 19, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("e"), P(t, m.e)); q("tmp").textContent = `${Math.round(lerp(25, 120, P(t, m.e + .4, 1.5)))} °C`;
      vis(q("h"), P(t, m.h)); q("pont").setAttribute("transform", `rotate(${240 * P(t, m.h + .3, 2)})`); vis(q("c"), P(t, m.c));
    },
  };

  // ------------------------------------------------------------ 5.2 preparar e soldar
  D.preparacao = {
    svg: () => `<g transform="translate(410 260)"><path d="M-300 -40h270l-40 40v40h-230z" fill="${C.aco}"/><path data-k="pd" d="M300 -40h-270l40 40v40h230z" fill="${C.aco}"/>
        <g data-k="l"><rect x="-90" y="-60" width="70" height="20" fill="url(#hach-u)" opacity=".0"/><path d="M-110 -48h80M30 -48h80" stroke="${C.verde}" stroke-width="8" stroke-linecap="round"/>${T(0, -80, "limpo: pelo menos 20 mm em volta do bisel", 18, C.verde, "middle", 700)}</g>
        <g data-k="g"><path d="M-30 -40l-50 -40M30 -40l50 -40" stroke="${C.azul}" stroke-width="2" stroke-dasharray="5 4"/>${T(0, 100, "ângulo do bisel, face e abertura da raiz: conforme a WPS", 18, C.azul, "middle", 700)}<path d="M-10 40h20M-10 30v20M10 30v20" stroke="${C.azul}" stroke-width="3"/></g></g>
      <g data-k="a" transform="translate(410 470)"><rect x="-370" y="-40" width="740" height="90" rx="10" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${T(0, -4, "desalinhamento máximo: 10% da espessura ou 3 mm (o menor)", 19, C.vermelho, "middle", 700)}${T(0, 28, "solda não corrige junta mal ajustada", 19, C.escuro, "middle", 600)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("l"), P(t, m.l)); vis(q("g"), P(t, m.g)); vis(q("a"), P(t, m.a));
      q("pd").setAttribute("transform", `translate(0 ${12 * P(t, m.a) * (1 - P(t, m.a + 2.5))})`);
    },
  };
  D.preaquec = {
    svg: () => `<rect x="80" y="300" width="560" height="60" fill="${C.aco}"/><rect data-k="calor" x="250" y="300" width="220" height="60" fill="${C.vermelho}" opacity="0"/>
      <g data-k="mac"><path d="M560 120l-150 160" stroke="${C.escuro}" stroke-width="16" stroke-linecap="round"/><path d="M410 280l-20 18" stroke="#5AA9E6" stroke-width="14" stroke-linecap="round"/></g>
      <g data-k="giz"><path d="M200 296l10 -40h18l-6 40" fill="${C.ambar}"/>${T(150, 240, "giz térmico", 19, C.ambar, "middle", 700)}</g>
      <g data-k="ter" transform="translate(690 330)"><rect x="-30" y="-90" width="60" height="120" rx="8" fill="${C.escuro}"/><rect x="-20" y="-76" width="40" height="30" rx="4" fill="#fff"/>${T(0, -55, "°C", 16, C.escuro, "middle", 700)}<path d="M0 30v40" stroke="${C.escuro}" stroke-width="6"/></g>
      <g data-k="w" transform="translate(410 460)"><rect x="-360" y="-34" width="720" height="68" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, 8, "quando a WPS exigir · temperatura entre passes mantida", 20, C.azul, "middle", 700)}</g>
      <g data-k="ch" transform="translate(410 80)">${xis("", -230, 0, 22)}${T(-200, 8, "chuva, superfície molhada ou vento sem proteção", 19, C.vermelho, "start", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("mac"), P(t, m.p) * (1 - P(t, m.e + 1))); q("calor").setAttribute("opacity", .45 * P(t, m.p + .4, 1.6));
      vis(q("giz"), P(t, m.p + 1)); vis(q("ter"), P(t, m.p + 1.4)); vis(q("w"), P(t, m.e)); vis(q("ch"), P(t, m.ch));
    },
  };
  D.execucao = {
    svg: () => `<g transform="translate(200 300)">${juntaT(1.3)}<g data-k="esc"><path d="M18 26h30l-30 -30z" fill="${ESC}"/></g>${faisca(50, -20, 1)}</g>
      <g data-k="pa" transform="translate(420 140)">${T(0, 0, "1. parâmetros da WPS", 21, C.escuro, "start", 700)}</g>
      <g data-k="es" transform="translate(420 200)">${T(0, 0, "2. tirar a escória e inspecionar", 21, C.escuro, "start", 700)}${T(22, 26, "cada passe antes do próximo", 17, C.cinza)}</g>
      <g data-k="sq" transform="translate(420 270)">${T(0, 0, "3. sequência do projeto (distorção)", 21, C.escuro, "start", 700)}</g>
      <g data-k="rf" transform="translate(420 330)">${T(0, 0, "4. resfriar naturalmente", 21, C.escuro, "start", 700)}${xis("", 22, 30, 14)}${T(44, 36, "água ou ar comprimido", 17, C.vermelho, "start", 700)}</g>
      <g data-k="si" transform="translate(420 420)">${T(0, 0, "5. autoinspeção e sinete", 21, C.escuro, "start", 700)}<g transform="translate(60 40) rotate(-6)"><rect x="-40" y="-18" width="80" height="36" rx="4" fill="none" stroke="${C.azul}" stroke-width="4"/>${T(0, 8, "S-07", 20, C.azul, "middle", 700)}</g></g>`,
    quadro(raiz, t, m, c, q) {
      ["pa", "es", "sq", "rf", "si"].forEach((k) => vis(q(k), P(t, m[k]))); vis(q("esc"), 1 - P(t, m.es + .6, .8));
    },
  };
  D.filete = {
    svg: () => `<g transform="translate(230 300)">${juntaT(1.6)}<g data-k="cal"><path d="M22 30v-62h62" fill="none" stroke="${C.vermelho}" stroke-width="5"/>${T(90, -20, "perna", 20, C.vermelho, "start", 700)}</g></g>
      <g data-k="t" transform="translate(470 120)"><rect width="320" height="250" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(16, 34, "chapa (T)", 17, C.cinza)}${T(210, 34, "perna mín.", 17, C.cinza)}
        ${[["até 6 mm", "3 mm"], ["6 a 12 mm", "5 mm"], ["12 a 20 mm", "6 mm"], ["acima de 20 mm", "8 mm"]].map(([a, b], i) => `<path d="M10 ${50 + i * 46}h300" stroke="${LP}"/>${T(16, 82 + i * 46, a, 21, C.escuro, "start", 700)}${T(210, 82 + i * 46, b, 21, C.azul, "start", 700)}`).join("")}${T(160, 240, "AWS D1.1, Tabela 5.8", 14, C.cinza, "middle")}</g>
      <g data-k="pj" transform="translate(410 470)"><rect x="-370" y="-34" width="740" height="68" rx="10" fill="#fff" stroke="${C.verde}" stroke-width="3"/>${T(0, 8, "vale o tamanho do projeto, se for maior", 21, C.verde, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("t"), P(t, m.t)); vis(q("cal"), P(t, m.c)); vis(q("pj"), P(t, m.pj)); },
  };

  // ------------------------------------------------------------ 5.3 defeitos (largo)
  const cordao = (extra = "") => `<rect x="-100" y="10" width="200" height="22" fill="${C.aco}"/><path d="M-60 10q60 -36 120 0z" fill="${SOLDA}"/>${extra}`;
  const DEF = [
    ["Trinca", "a mais grave", cordao(`<path d="M-30 -2l12 -8l10 8l14 -10l12 8" fill="none" stroke="${C.vermelho}" stroke-width="3"/>`)],
    ["Falta de fusão", "não fundiu com a base", cordao(`<path d="M-58 10l20 -4" stroke="${C.vermelho}" stroke-width="5"/>`)],
    ["Mordedura", "sulco na margem", cordao(`<path d="M60 10q8 6 18 0" fill="#F5F6FA" stroke="${C.vermelho}" stroke-width="2"/>`)],
    ["Porosidade", "umidade, vento, sujeira", cordao([-30, -8, 14, 32].map((x) => `<circle cx="${x}" cy="0" r="4" fill="#F5F6FA" stroke="${C.vermelho}" stroke-width="1.5"/>`).join(""))],
    ["Cratera", "fim do cordão sem preencher", cordao(`<ellipse cx="50" cy="2" rx="12" ry="6" fill="#3A2A1A"/>`)],
    ["Sobreposição", "metal derramado na borda", cordao(`<path d="M50 6q30 -4 40 8l-30 0z" fill="${SOLDA}" stroke="${C.vermelho}" stroke-width="2"/>`)],
    ["Inclusão de escória", "presa entre passes", cordao(`<path d="M-20 -2h30l-6 6h-20z" fill="${ESC}"/>`)],
    ["Perna pequena", "cordão menor que o projeto", `<rect x="-100" y="10" width="200" height="22" fill="${C.aco}"/><path d="M-30 10q30 -14 60 0z" fill="${SOLDA}"/><path d="M-60 10q60 -36 120 0" fill="none" stroke="${C.vermelho}" stroke-width="2" stroke-dasharray="5 4"/>`],
  ];
  D.defeitos = {
    largo: true,
    svg: () => DEF.map(([nome, sub, corpo], i) => `<g data-k="d${i + 1}" transform="translate(${160 + (i % 4) * 287} ${40 + Math.floor(i / 4) * 255})"><rect x="-130" y="0" width="260" height="230" rx="12" fill="#fff" stroke="${LP}" stroke-width="2"/><g transform="translate(0 110) scale(1.05)">${corpo}</g>${T(0, 40, nome, 22, i === 0 ? C.vermelho : C.escuro, "middle", 700)}${T(0, 200, sub, 16, C.cinza, "middle")}</g>`).join(""),
    quadro(raiz, t, m, c, q) { for (let i = 1; i <= 8; i++) vis(q(`d${i}`), P(t, m[`d${i}`])); },
  };
  D.aceitacao = {
    svg: () => `<g transform="translate(240 280) scale(1.8)">${cordao(`<path d="M-30 -2l12 -8l10 8l14 -10l12 8" fill="none" stroke="${C.vermelho}" stroke-width="2.5"/>`)}</g>
      <g data-k="rp" transform="translate(240 180) rotate(-10)"><rect x="-130" y="-34" width="260" height="68" rx="6" fill="none" stroke="${C.vermelho}" stroke-width="5"/>${T(0, 12, "REPROVADA", 32, C.vermelho, "middle", 700)}</g>
      <g data-k="t" transform="translate(240 420)">${T(0, 0, "trinca: nenhuma, de qualquer tamanho", 21, C.vermelho, "middle", 700)}</g>
      <g data-k="rj" transform="translate(480 90)"><rect width="320" height="300" rx="12" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(16, 36, "rejeição imediata", 21, C.vermelho, "start", 700)}
        ${["qualquer trinca", "falta de fusão visível", "soldador sem qualificação", "junta sem WPS aprovada"].map((s, i) => `${xis("", 34, 82 + i * 56, 13)}${T(56, 88 + i * 56, s, 18, C.escuro)}`).join("")}</g>
      <g data-k="rn" transform="translate(640 450)">${T(0, 0, "registro: extensão, causa, ação", 18, C.cinza, "middle")}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("t"), P(t, m.t)); vis(q("rp"), P(t, m.t + .6)); vis(q("rj"), P(t, m.rj)); vis(q("rn"), P(t, m.rn)); },
  };

  // ------------------------------------------------------------ 5.4 inspeção, pinos, segurança
  D.vt = {
    svg: (u) => `<rect x="60" y="430" width="520" height="40" fill="${C.aco}"/><path d="M200 430q80 -30 160 0z" fill="${SOLDA}"/>
      <g data-k="fx"><path d="M170 425h-30M390 425h30" stroke="${C.verde}" stroke-width="8"/>${T(280, 500, "25 mm limpos de cada lado", 18, C.verde, "middle", 700)}</g>
      ${pessoa("", 640, 470, { pose: "aponta", flip: true })}
      <g data-k="lx"><path d="M600 300L320 420" stroke="#F2D25A" stroke-width="40" opacity=".35"/>${T(470, 260, "≥ 1000 lux", 22, C.ambar, "middle", 700)}</g>
      <g data-k="ds"><path d="M600 250L300 400" stroke="${C.azul}" stroke-width="3" stroke-dasharray="8 5" marker-end="url(#pa-${u})"/>${T(380, 300, "olho ≤ 600 mm", 20, C.azul, "middle", 700)}</g>
      <g data-k="an"><path d="M360 430a70 70 0 0 1 -12 -40" fill="none" stroke="${C.vermelho}" stroke-width="3"/>${T(310, 380, "≥ 30°", 20, C.vermelho, "end", 700)}</g>
      <g data-k="am" transform="translate(180 120)"><rect x="-120" y="-60" width="240" height="140" rx="8" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${[-60, -20, 20, 60].map((x) => `<path d="M${x} -40v100" stroke="${LP}" stroke-width="2"/>`).join("")}<path d="M-60 -20h120" stroke="#F2D25A" stroke-width="10"/>${T(0, 106, "amarelo no projeto + foto", 18, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["lx", "ds", "an", "fx", "am"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.end = {
    largo: true,
    svg: () => card("lp", 210, 40, 360, 380, "Líquido penetrante", `<g transform="translate(0 170)">${cordao(`<path d="M-30 -2l12 -8l10 8" fill="none" stroke="#E0408A" stroke-width="4"/>`)}</g>`, "defeitos abertos na superfície")
      + card("pm", 590, 40, 360, 380, "Partículas magnéticas", `<g transform="translate(0 170)">${cordao(Array.from({ length: 14 }, (_, i) => `<circle cx="${-60 + i * 9}" cy="${-4 + (i % 3) * 3}" r="2" fill="${C.escuro}"/>`).join(""))}</g>`, "superfície e logo abaixo")
      + card("us", 970, 40, 360, 380, "Ultrassom", `<g transform="translate(0 170)">${cordao(`<rect x="-20" y="-40" width="40" height="22" rx="4" fill="${C.escuro}"/>${[0, 1, 2].map((i) => `<path d="M${-14 + i * 4} ${-14 + i * 10}q14 -6 28 0" fill="none" stroke="${C.azul}" stroke-width="2"/>`).join("")}`)}</g>`, "defeitos internos em penetração total")
      + `<g data-k="iq" transform="translate(590 490)"><rect x="-460" y="-34" width="920" height="68" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, 8, "feitos por inspetor qualificado, na amostragem do projeto ou contrato", 22, C.azul, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["lp", "pm", "us", "iq"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.pinos = {
    svg: () => `<rect x="60" y="380" width="700" height="40" fill="${C.aco}"/><path d="M60 380l40 -30h60l40 30h60l40 -30h60l40 30h60l40 -30h60l40 30h60l40 -30h40v30" fill="#9AA0B8"/>
      <g data-k="pino"><g data-k="pinoR" transform="translate(410 380)"><rect x="-10" y="-120" width="20" height="120" fill="${C.cinza}"/><rect x="-20" y="-132" width="40" height="16" rx="3" fill="${C.cinza}"/><path data-k="colar" d="M-22 0q-4 -12 12 -14h20q16 2 12 14z" fill="${SOLDA}"/></g></g>
      <g data-k="c" transform="translate(410 470)">${T(0, 0, "colar de solda completo: 360°", 21, C.verde, "middle", 700)}</g>
      <g data-k="d" transform="translate(620 160)"><rect x="-150" y="-60" width="300" height="130" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -22, "início do turno:", 19, C.escuro, "middle", 700)}${T(0, 6, "2 primeiros pinos", 19, C.escuro, "middle", 700)}${T(0, 34, "dobrados cerca de 30°", 19, C.azul, "middle", 700)}</g>
      <g data-k="ox" transform="translate(180 160)">${xis("", 0, 0, 20)}${T(0, 44, "pino oxidado:", 18, C.vermelho, "middle", 700)}${T(0, 68, "não se solda", 18, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("c"), P(t, m.c)); vis(q("d"), P(t, m.d)); vis(q("ox"), P(t, m.ox));
      q("pinoR").setAttribute("transform", `translate(410 380) rotate(${30 * P(t, m.d + .6, 1.4)})`);
    },
  };
  const ICOS = {
    i: `<path d="M0 -60c30 30 40 50 20 80c20 -10 30 -30 20 -50c20 30 10 70 -40 70s-60 -40 -40 -70c0 20 10 30 20 30c-20 -30 0 -50 20 -60z" fill="${C.vermelho}"/>`,
    c: `<path d="M10 -70l-40 70h30l-14 60l44 -80h-30l20 -50z" fill="${C.ambar}"/>`,
    r: `<rect x="-50" y="-50" width="100" height="90" rx="14" fill="${C.escuro}"/><rect x="-34" y="-24" width="68" height="24" rx="4" fill="#2A8A4A"/>`,
    f: `${[0, 1, 2].map((i) => `<path d="M${-30 + i * 30} 50q-20 -30 0 -60t0 -50" fill="none" stroke="${C.cinza}" stroke-width="10" stroke-linecap="round"/>`).join("")}`,
  };
  D.segSolda = {
    largo: true,
    svg: () => [["i", "Incêndio", "PT a quente · extintor · manta · vigia · nada inflamável embaixo"], ["c", "Choque", "cabos sem emenda exposta · garra perto · máquina aterrada"], ["r", "Radiação", "máscara com filtro · raspa · biombo para quem passa"], ["f", "Fumos", "ventilação · fora da fumaça · atenção em galvanizado e pintado"]]
      .map(([k, nome, sub], i) => card(k, 160 + i * 287, 40, 270, 420, nome, `<g transform="translate(0 180)">${ICOS[k]}</g>`, sub)).join(""),
    quadro(raiz, t, m, c, q) { ["i", "c", "r", "f"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
})();
