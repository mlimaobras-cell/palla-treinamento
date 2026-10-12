// Ilustrações do Módulo 2 (leitura e interpretação de projetos). Conteúdo: Caderno do Módulo 2 (revisão 2).
(function () {
  const { C, pessoa, viga, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 515;
  const LP = "#D9DCE8";
  const folha = (x, y, w, h, extra = "") => `<g transform="translate(${x} ${y})"><path d="M0 0h${w - 26}l26 26v${h - 26}h${-w}z" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/><path d="M${w - 26} 0v26h26" fill="#EEF0F6" stroke="${C.escuro}" stroke-width="2"/>${extra}</g>`;
  const T = (x, y, txt, tam = 18, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;
  const linhas = (x, y, n, w, gap = 22) => Array.from({ length: n }, (_, i) => `<path d="M${x} ${y + i * gap}h${w * (i % 3 === 2 ? .6 : 1)}" stroke="${LP}" stroke-width="7" stroke-linecap="round"/>`).join("");
  const circ = (k, x, y, r = 34) => `<circle data-k="${k}" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.vermelho}" stroke-width="4"/>`;
  const card = (k, x, y, w, h, titulo, corpo, sub = "", destaque = false) => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${destaque ? C.vermelho : LP}" stroke-width="${destaque ? 4 : 2}"/>
    ${T(0, 40, titulo, 26, destaque ? C.vermelho : C.escuro, "middle", 700)}${corpo}${sub ? `<foreignObject x="${-w / 2 + 10}" y="${h - 92}" width="${w - 20}" height="86"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 19px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${sub}</div></foreignObject>` : ""}</g>`;

  // mini-desenhos reutilizáveis (origem no centro)
  const miniGrade = (s = 1) => `<g transform="scale(${s})">${[-60, -20, 20, 60].map((x) => `<path d="M${x} -60v120" stroke="${C.azul}" stroke-width="2" stroke-dasharray="8 5"/>`).join("")}${[-40, 0, 40].map((y) => `<path d="M-80 ${y}h160" stroke="${C.azul}" stroke-width="2" stroke-dasharray="8 5"/>`).join("")}${[-60, -20, 20, 60].flatMap((x) => [-40, 40].map((y) => `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="${C.aco}"/>`)).join("")}</g>`;
  const miniPortico = (s = 1) => `<g transform="scale(${s})"><path d="M-70 50v-80l70 -30l70 30v80" fill="none" stroke="${C.aco}" stroke-width="9" stroke-linejoin="round"/><path d="M-90 50h180" stroke="${C.chao}" stroke-width="3"/></g>`;
  const miniLig = (s = 1) => `<g transform="scale(${s})"><rect x="-70" y="-14" width="140" height="28" fill="${C.aco}"/><rect x="-20" y="-50" width="40" height="100" fill="${C.acoE}"/>${[-30, 0, 30].map((y) => `<circle cx="0" cy="${y}" r="6" fill="${C.escuro}"/>`).join("")}</g>`;

  // ------------------------------------------------------------ 2.1 três desenhos (largo)
  D.tresDesenhos = {
    largo: true,
    svg: (u) => card("p", 200, 40, 340, 440, "Projeto", `<g transform="translate(0 170)">${miniPortico(1.2)}${[-50, 0, 50].map((x) => `<path d="M${x} -110v34" stroke="${C.vermelho}" stroke-width="4" marker-end="url(#pv-${u})"/>`).join("")}</g>${T(0, 290, "feito pelo calculista", 20, C.azul, "middle")}`, "materiais, cargas, tipo de ligação, contraflecha · engenharia e detalhamento")
      + card("f", 590, 40, 340, 440, "Fabricação", `<g transform="translate(0 170)"><rect x="-120" y="-16" width="240" height="32" fill="${C.aco}"/>${[-100, -80, 80, 100].map((x) => `<circle cx="${x}" cy="0" r="6" fill="#fff"/>`).join("")}<path d="M-120 40h240M-120 32v16M120 32v16" stroke="${C.cinza}" stroke-width="2"/>${T(0, 64, "6.000", 18, C.cinza, "middle")}</g>${T(0, 290, "feito pelo detalhista", 20, C.azul, "middle")}`, "cada peça: medidas, furos, soldas · usado pela fábrica")
      + card("m", 980, 40, 340, 440, "Montagem", `<g transform="translate(0 170)">${miniGrade(1.3)}${T(-78, -60, "P1", 16, C.vermelho)}${T(-26, -60, "P2", 16, C.vermelho)}</g>${T(0, 290, "feito pelo detalhista", 20, C.azul, "middle")}`, "onde cada peça vai: marcas, eixos, níveis · usado por você", true),
    quadro(raiz, t, m, c, q) { ["p", "f", "m"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 2.1 o que o desenho de montagem traz
  D.folhaMontagem = {
    svg: () => folha(40, 40, 740, 470, `
        <g transform="translate(230 180)">${miniGrade(2)}</g>
        ${["P1", "P2", "P3", "P4"].map((p, i) => T(96 + i * 80, 80, p, 18, C.vermelho, "start", 700)).join("")}
        <path d="M110 300h240M110 290v20M350 290v20" stroke="${C.cinza}" stroke-width="2"/>${T(230, 328, "18.000", 18, C.cinza, "middle")}
        <g transform="translate(470 60)"><rect width="230" height="120" fill="#F5F6FA" stroke="${LP}"/>${T(12, 26, "DET. CHUMBADOR", 16)}<rect x="70" y="40" width="90" height="12" fill="${C.aco}"/><path d="M95 52v54M135 52v54" stroke="${C.escuro}" stroke-width="5"/>${T(12, 112, "EL +0,050", 15, C.azul)}</g>
        <g transform="translate(470 200)"><rect width="230" height="96" fill="#F5F6FA" stroke="${LP}"/>${T(12, 26, "PARAFUSOS", 16)}${T(12, 54, "4 Ø 3/4″ × 65 · A325", 16, C.cinza)}${T(12, 80, "solda de campo ⚑", 16, C.cinza)}</g>
        <g transform="translate(40 360)">${T(0, 20, "CV-1 provisório", 16, C.vermelho)}<path d="M0 34l120 50M0 84l120 -50" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="7 5"/></g>
        <rect x="520" y="370" width="200" height="80" fill="#F5F6FA" stroke="${C.escuro}"/>${T(530, 395, "OBRA · DES. 05", 14)}${T(530, 420, "REV. 3", 14, C.vermelho, "start", 700)}`)
      + circ("d", 270, 360, 70) + circ("mc", 230, 116, 50) + circ("nv", 590, 150, 46) + circ("ch", 590, 130, 70) + circ("pf", 590, 276, 54) + circ("sc", 600, 312, 30) + circ("pv", 140, 440, 70),
    quadro(raiz, t, m, c, q) {
      const ks = ["d", "mc", "nv", "ch", "pf", "sc", "pv"], ts = ks.map((k) => m[k] ?? 99);
      ks.forEach((k, i) => { if (t > 50) { vis(q(k), 0); return; } const fim = Math.min(...ts.filter((x) => x > ts[i]), 1e9); vis(q(k), t >= ts[i] && t < fim + .2 ? P(t, ts[i], .4) : 0); });
    },
  };

  // ------------------------------------------------------------ 2.1 documentos (largo)
  const DOC = {
    n: `${linhas(-90, -60, 5, 180)}`,
    l: `${[0, 1, 2, 3, 4].map((i) => `<path d="M-100 ${-70 + i * 28}h200" stroke="${LP}" stroke-width="2"/>`).join("")}${T(-96, -76, "MARCA · PERFIL · QTD · kg", 13, C.cinza)}${["V-12", "P-01", "T-03", "L-02"].map((mk, i) => T(-96, -48 + i * 28, mk, 15, C.escuro)).join("")}`,
    p: `${[-60, -20, 20, 60].map((x) => `<g transform="translate(${x} -10)"><rect x="-6" y="-34" width="12" height="68" fill="${C.escuro}"/><rect x="-13" y="-40" width="26" height="10" rx="2" fill="${C.escuro}"/></g>`).join("")}`,
    r: `<rect x="-90" y="-40" width="140" height="56" fill="${C.aco}"/><rect x="50" y="-26" width="44" height="42" fill="${C.azul}"/><circle cx="-60" cy="22" r="12" fill="${C.escuro}"/><circle cx="70" cy="22" r="12" fill="${C.escuro}"/>${T(-20, -54, "carga 03", 16, C.cinza, "middle")}`,
    m: `${[1, 2, 3].map((n, i) => `<g transform="translate(${-60 + i * 60} -10)"><circle r="22" fill="${C.azul}"/>${T(0, 7, n, 20, "#fff", "middle", 700)}</g>`).join("")}<path d="M-38 -10h16M22 -10h16" stroke="${C.escuro}" stroke-width="3"/>`,
  };
  D.documentos = {
    largo: true,
    svg: () => [["n", "Notas gerais", "aço, parafusos, pintura, tolerâncias, normas"], ["l", "Lista de material", "marca, perfil, comprimento, quantidade, peso"], ["p", "Lista de parafusos", "quantidade, diâmetro, comprimento, especificação"], ["r", "Romaneio", "o que veio em cada carga"], ["m", "Plano de montagem", "sequência, içamento, travamentos provisórios"]]
      .map(([k, nome, sub], i) => card(k, 120 + i * 235, 60, 220, 420, nome, `<g transform="translate(0 180)">${DOC[k]}</g>`, sub)).join(""),
    quadro(raiz, t, m, c, q) { ["n", "l", "p", "r", "m"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 2.1 carimbo e revisão
  D.carimbo = {
    svg: () => `<g data-k="cb">${folha(40, 30, 380, 260, `<g transform="translate(150 110)">${miniGrade(1.2)}</g><rect x="230" y="190" width="130" height="56" fill="#F5F6FA" stroke="${C.vermelho}" stroke-width="3"/>`)}
        <path d="M400 250L460 300" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="6 5"/>
        <g transform="translate(450 60)"><rect width="340" height="240" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>
        ${[["OBRA", "Galpão exemplo"], ["DESENHO / FOLHA", "DM-05 · 1/3"], ["REVISÃO", "3"], ["DATA · ESCALA", "dd/mm · 1:100"], ["RESP. TÉCNICO", "nome · registro"]].map(([a, b], i) => `<path d="M0 ${48 * (i + 1)}h340" stroke="${LP}" stroke-width="2"/>${T(12, 20 + 48 * i, a, 13, C.cinza)}${T(12, 40 + 48 * i, b, 18, a === "REVISÃO" ? C.vermelho : C.escuro, "start", 700)}`).join("")}</g></g>
      <g data-k="tab" transform="translate(450 320)"><rect width="340" height="104" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(12, 24, "REV · DESCRIÇÃO", 13, C.cinza)}${["0 · emissão inicial", "1 · alterada ligação V-12", "2 · incluído CV-3", "3 · alterado nível V-20"].map((s, i) => T(12, 44 + i * 18, s, 14)).join("")}</g>
      <g data-k="r1">${folha(60, 330, 160, 120, `${T(14, 40, "DM-05", 18)}${T(14, 66, "REV. 1", 18, C.cinza)}`)}<g transform="translate(140 410) rotate(-14)"><rect x="-80" y="-20" width="160" height="40" rx="4" fill="none" stroke="${C.vermelho}" stroke-width="4"/>${T(0, 9, "CANCELADO", 22, C.vermelho, "middle", 700)}</g></g>
      <g data-k="r3">${folha(250, 330, 160, 120, `${T(14, 40, "DM-05", 18)}${T(14, 66, "REV. 3", 18, C.vermelho, "start", 700)}`)}${ok("", 390, 330, 24)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("cb"), P(t, m.c)); vis(q("tab"), P(t, m.t)); vis(q("r3"), P(t, m.r)); vis(q("r1"), P(t, m.x)); },
  };

  // ------------------------------------------------------------ 2.2 vistas (largo)
  D.vistas = {
    largo: true,
    svg: () => [["pl", "Planta", "vista de cima: eixos, bases, vigas, terças", miniGrade(1.3)], ["el", "Elevação", "de frente ou de lado: pilares, longarinas, níveis", `<path d="M-110 60v-120M-37 60v-120M37 60v-120M110 60v-120" stroke="${C.aco}" stroke-width="9"/><path d="M-110 -60h220" stroke="${C.aco}" stroke-width="9"/>${[-20, 20].map((y) => `<path d="M-110 ${y}h220" stroke="#9AA0B8" stroke-width="5"/>`).join("")}`], ["co", "Corte", "a estrutura “fatiada”: pórtico e alturas", miniPortico(1.4)], ["de", "Detalhe", "a ligação ampliada: chapas, parafusos, soldas", miniLig(1.3)]]
      .map(([k, nome, sub, corpo], i) => card(k, 160 + i * 287, 60, 270, 420, nome, `<g transform="translate(0 190)">${corpo}</g>`, sub)).join(""),
    quadro(raiz, t, m, c, q) { ["pl", "el", "co", "de"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 2.2 eixos e cotas
  const EX = [150, 300, 450, 600], EY = [140, 280, 420];
  D.eixos = {
    svg: (u) => `${EX.map((x, i) => `<path d="M${x} 90v380" stroke="${C.azul}" stroke-width="2" stroke-dasharray="10 6"/><circle cx="${x}" cy="66" r="20" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(x, 73, i + 1, 20, C.azul, "middle", 700)}`).join("")}
      ${EY.map((y, i) => `<path d="M100 ${y}h560" stroke="${C.azul}" stroke-width="2" stroke-dasharray="10 6"/><circle cx="76" cy="${y}" r="20" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(76, y + 7, "ABC"[i], 20, C.azul, "middle", 700)}`).join("")}
      ${EX.flatMap((x) => EY.map((y) => `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="${C.aco}"/>`)).join("")}
      <path data-k="lb" d="M100 280h560" stroke="${C.vermelho}" stroke-width="6" opacity=".7"/><path data-k="l3" d="M450 90v380" stroke="${C.vermelho}" stroke-width="6" opacity=".7"/>
      <g data-k="b3"><circle cx="450" cy="280" r="30" fill="none" stroke="${C.vermelho}" stroke-width="5"/><rect x="474" y="232" width="70" height="36" rx="6" fill="${C.vermelho}"/>${T(509, 258, "B3", 22, "#fff", "middle", 700)}</g>
      <g data-k="cota"><path d="M150 520h150M150 508v24M300 508v24" stroke="${C.escuro}" stroke-width="2.5"/>${T(225, 550, "6.000 (mm)", 20, C.escuro, "middle")}${T(225, 576, "entre eixos", 17, C.cinza, "middle")}</g>
      <circle data-k="dedo" r="13" fill="${C.ambar}" stroke="#fff" stroke-width="3"/>`,
    quadro(raiz, t, m, c, q) {
      vis(q("lb"), P(t, m.b)); vis(q("l3"), P(t, m.n)); vis(q("b3"), P(t, m.x)); vis(q("cota"), P(t, m.q));
      const d = q("dedo");
      if (t < m.b) { vis(d, 0); return; }
      vis(d, 1 - P(t, m.x + 1.5));
      if (t < m.n) { const p = P(t, m.b + .2, 1.6); d.setAttribute("cx", lerp(76, 450, p)); d.setAttribute("cy", 280); }
      else { const p = P(t, m.n + .2, 1.2); d.setAttribute("cx", 450); d.setAttribute("cy", lerp(66, 280, p)); }
    },
  };

  // ------------------------------------------------------------ 2.2 erro acumulado
  D.acumulado = {
    svg: () => `${T(20, 70, "medindo da peça vizinha", 22, C.vermelho, "start", 700)}${T(20, 330, "medindo do eixo", 22, C.verde, "start", 700)}
      ${[0, 1, 2, 3, 4].map((i) => { const x = 90 + i * 160; return `<path d="M${x} 90v170M${x} 350v170" stroke="${C.azul}" stroke-width="2" stroke-dasharray="8 5"/>
        <rect data-k="e${i}" x="${x - 9}" y="140" width="18" height="110" fill="${C.aco}"/><path data-k="s${i}" d="M${x} 270h0" stroke="${C.vermelho}" stroke-width="5"/>
        <rect data-k="c${i}" x="${x - 9}" y="400" width="18" height="110" fill="${C.aco}"/>`; }).join("")}
      ${xis("xe", 760, 190, 22)}${ok("oc", 760, 450, 22)}`,
    quadro(raiz, t, m, c, q) {
      [0, 1, 2, 3, 4].forEach((i) => {
        const pe = P(t, m.e + i * .5), desv = 10 * i * P(t, m.e + 1 + i * .4);
        vis(q(`e${i}`), pe); q(`e${i}`).setAttribute("transform", `translate(${desv} 0)`);
        q(`s${i}`).setAttribute("d", `M${90 + i * 160} 270h${desv}`); vis(q(`s${i}`), pe);
        vis(q(`c${i}`), P(t, m.c + i * .3));
      });
      vis(q("xe"), P(t, m.e + 3)); vis(q("oc"), P(t, m.c + 1.8));
    },
  };

  // ------------------------------------------------------------ 2.2 níveis
  D.niveis = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <path d="M220 ${CHAO}v-330M560 ${CHAO}v-330" stroke="${C.aco}" stroke-width="16"/><rect x="200" y="${CHAO - 346}" width="380" height="30" fill="${C.aco}"/>
      <g data-k="zero"><path d="M60 ${CHAO}h-30l15 -18z" fill="${C.azul}"/>${T(70, CHAO - 6, "±0,000", 22, C.azul, "start", 700)}${T(70, CHAO + 30, "referência da obra", 17, C.cinza)}</g>
      <g data-k="seis"><path d="M640 ${CHAO - 316}h120" stroke="${C.vermelho}" stroke-width="2" stroke-dasharray="6 4"/><path d="M740 ${CHAO - 316}h-30l15 -18z" fill="${C.vermelho}"/>${T(620, CHAO - 340, "EL +6,000", 26, C.vermelho, "start", 700)}
        <path d="M700 ${CHAO - 8}V${CHAO - 300}" stroke="${C.vermelho}" stroke-width="3" marker-end="url(#pv-${u})"/>${T(712, CHAO - 150, "6 m", 24, C.vermelho)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("zero"), P(t, m.z)); vis(q("seis"), P(t, m.s)); },
  };

  // ------------------------------------------------------------ 2.3 marca nos três lugares (largo)
  D.marcas = {
    largo: true,
    svg: () => `${card("pe", 200, 40, 330, 330, "Na peça", `<g transform="translate(0 170)"><rect x="-130" y="-20" width="260" height="40" fill="${C.aco}"/><rect x="-40" y="-16" width="80" height="32" rx="3" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(0, 8, "V-12", 20, C.escuro, "middle", 700)}</g>`, "etiqueta ou pintura")}
      ${card("ro", 590, 40, 330, 330, "No romaneio", `<g transform="translate(0 150)">${[0, 1, 2, 3].map((i) => `<path d="M-120 ${-40 + i * 30}h240" stroke="${LP}" stroke-width="2"/>`).join("")}${["P-01", "V-12", "T-03"].map((mk, i) => T(-110, -18 + i * 30, mk, 18, mk === "V-12" ? C.vermelho : C.escuro, "start", 700)).join("")}<rect x="-118" y="-4" width="236" height="28" fill="none" stroke="${C.vermelho}" stroke-width="3"/></g>`, "o que veio na carga")}
      ${card("de", 980, 40, 330, 330, "No desenho", `<g transform="translate(0 160)">${miniGrade(1.2)}<rect x="-30" y="-58" width="60" height="26" rx="3" fill="${C.vermelho}"/>${T(0, -39, "V-12", 16, "#fff", "middle", 700)}</g>`, "desenho de montagem")}
      <g data-k="pd" transform="translate(590 440)"><rect x="-520" y="-36" width="1040" height="80" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -6, "Padrão comum: P pilar · V viga · T terça · L longarina · CV contravento · TR tirante", 22, C.escuro, "middle", 600)}${T(0, 26, "confira o padrão do projeto da obra", 18, C.cinza, "middle", 500)}</g>`,
    quadro(raiz, t, m, c, q) { ["pe", "ro", "de", "pd"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 2.3 símbolo de solda
  D.soldaSimbolo = {
    svg: (u) => `<g transform="translate(0 30)">
      <g data-k="junta"><rect x="40" y="340" width="190" height="24" fill="${C.aco}"/><rect x="120" y="230" width="24" height="110" fill="${C.aco}"/><path d="M144 340l16 0l-16 -16z" fill="${C.ambar}"/></g>
      <path data-k="seta" d="M380 220L168 322" stroke="${C.escuro}" stroke-width="4" marker-end="url(#pe-${u})"/>
      <path data-k="linha" d="M380 220h300" stroke="${C.escuro}" stroke-width="4"/>
      <path data-k="tri" d="M500 222v38l38 -38z" fill="${C.azul}"/>
      <path data-k="triO" d="M500 218v-38l38 38z" fill="none" stroke="${C.azul}" stroke-width="3" stroke-dasharray="6 4"/>
      <g data-k="band"><path d="M380 220v-80" stroke="${C.vermelho}" stroke-width="4"/><path d="M380 140l46 14l-46 14z" fill="${C.vermelho}"/></g>
      <circle data-k="circ" cx="380" cy="220" r="14" fill="none" stroke="${C.verde}" stroke-width="4"/>
      <g data-k="num">${T(476, 254, "6", 30, C.escuro, "end", 700)}</g>
      <g data-k="cauda"><path d="M680 220l36 -30M680 220l36 30" stroke="${C.escuro}" stroke-width="4"/>${T(726, 228, "WPS", 22, C.cinza)}</g>
      <g data-k="lbl">${T(600, 300, "abaixo da linha = lado da seta", 19, C.azul, "middle")}</g>
      <g data-k="lblO">${T(560, 168, "acima = lado oposto", 19, C.azul, "middle")}</g>
      <g data-k="lnum">${T(470, 360, "perna de 6 mm", 19, C.escuro, "middle")}</g></g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("junta"), P(t, m.s)); vis(q("seta"), P(t, m.s)); vis(q("linha"), P(t, m.l)); vis(q("tri"), P(t, m.t)); vis(q("lbl"), P(t, m.t) * (1 - P(t, m.b)));
      vis(q("triO"), P(t, m.o) * (1 - P(t, m.b))); vis(q("lblO"), P(t, m.o) * (1 - P(t, m.b)));
      vis(q("band"), P(t, m.b)); vis(q("circ"), P(t, m.c)); vis(q("num"), P(t, m.n)); vis(q("lnum"), P(t, m.n)); vis(q("cauda"), P(t, m.k));
    },
  };

  // ------------------------------------------------------------ 2.3 parafusos no desenho
  D.parafusoTexto = {
    svg: () => `<g transform="translate(410 120)"><rect x="-380" y="-50" width="760" height="80" rx="10" fill="${C.escuro}"/>
        ${T(-310, 6, "4", 40, "#fff", "middle", 700)}${T(-150, 6, "Ø 3/4″", 40, "#fff", "middle", 700)}${T(30, 6, "× 65", 40, "#fff", "middle", 700)}${T(230, 6, "· A325", 40, "#fff", "middle", 700)}</g>
      ${[["q", -310, "quantidade"], ["d", -150, "diâmetro"], ["c", 30, "comprimento (mm)"], ["e", 230, "especificação"]].map(([k, x, txt]) => `<g data-k="${k}" transform="translate(${410 + x} 190)"><path d="M-60 0h120" stroke="${C.vermelho}" stroke-width="4"/>${T(0, 32, txt, 20, C.vermelho, "middle", 700)}</g>`).join("")}
      <g data-k="desenho" transform="translate(410 340)">${[-150, -50, 50, 150].map((x) => `<g transform="translate(${x} 0)"><rect x="-10" y="-60" width="20" height="120" fill="${C.cinza}"/><rect x="-22" y="-74" width="44" height="18" rx="3" fill="${C.escuro}"/><rect x="-20" y="40" width="40" height="16" rx="3" fill="${C.escuro}"/></g>`).join("")}</g>
      <g data-k="a" transform="translate(410 470)"><rect x="-370" y="-30" width="740" height="62" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, 10, "aperto normal ou protendido: o projeto define (Módulo 4)", 21, C.escuro, "middle")}</g>`,
    quadro(raiz, t, m, c, q) { ["q", "d", "c", "e"].forEach((k) => vis(q(k), P(t, m[k]))); vis(q("desenho"), P(t, m.q)); vis(q("a"), P(t, m.a)); },
  };

  // ------------------------------------------------------------ 2.4 contraflecha
  const vigaCurva = (y, f) => `<path d="M120 ${y}Q410 ${y - f} 700 ${y}" fill="none" stroke="${C.aco}" stroke-width="26"/><path d="M100 ${y + 14}l20 30h-40zM720 ${y + 14}l-20 30h40z" fill="${C.cinza}"/>`;
  D.contraflecha = {
    svg: () => `<g data-k="cert">${vigaCurva(200, 70)}${T(410, 120, "curva para cima", 22, C.verde, "middle", 700)}${ok("", 760, 160, 24)}</g>
      <g data-k="err">${vigaCurva(420, -70)}${T(410, 520, "invertida", 22, C.vermelho, "middle", 700)}${xis("", 760, 420, 24)}</g>
      <g data-k="info" transform="translate(410 40)">${T(0, 0, "curvatura dada na fábrica (NBR 8800, 4.2.8)", 20, C.cinza, "middle")}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("cert"), P(t, m.c)); vis(q("info"), P(t, m.c + .4)); vis(q("err"), P(t, m.e)); },
  };

  // ------------------------------------------------------------ 2.4 o que mais a marca diz
  D.marcaInfo = {
    svg: (u) => `<rect x="60" y="250" width="700" height="70" fill="${C.aco}"/>
      <g data-k="mk"><rect x="110" y="264" width="110" height="42" rx="4" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(165, 293, "V-12", 22, C.escuro, "middle", 700)}${T(165, 360, "mesmo lado sempre", 18, C.cinza, "middle")}</g>
      <g data-k="ei">${T(290, 293, "EIXO B", 20, "#fff", "start", 700)}<g transform="translate(450 286)"><path d="M0 14V-14" stroke="#fff" stroke-width="4" marker-end="url(#pe-${u})"/>${T(16, 8, "N", 22, "#fff", "start", 700)}</g>${T(370, 230, "eixo e norte de projeto", 18, C.azul, "middle")}</g>
      <g data-k="lc"><path d="M590 240V150" stroke="${C.vermelho}" stroke-width="5" marker-end="url(#pv-${u})"/>${T(606, 180, "LADO DE CIMA", 20, C.vermelho, "start", 700)}</g>
      <g data-k="cg"><circle cx="410" cy="285" r="16" fill="#fff" stroke="${C.escuro}" stroke-width="3"/><path d="M410 269v32M394 285h32" stroke="${C.escuro}" stroke-width="3"/><path d="M410 320v90" stroke="${C.ambar}" stroke-width="3" stroke-dasharray="6 4"/>${T(410, 440, "centro de gravidade: orienta a lingada", 20, C.ambar, "middle", 700)}</g>
      <g data-k="pu" transform="translate(410 520)">${T(0, 0, "obras industriais: punção + tinta de cor contrastante", 19, C.cinza, "middle")}</g>`,
    quadro(raiz, t, m, c, q) { ["mk", "ei", "lc", "cg", "pu"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 2.4 erro: marca ilegível
  D.marcaIlegivel = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <rect x="80" y="${CHAO - 70}" width="420" height="40" fill="${C.aco}"/><g transform="translate(200 ${CHAO - 66})"><rect width="100" height="32" rx="3" fill="#fff" stroke="${C.escuro}" stroke-width="2"/><text x="50" y="24" text-anchor="middle" font-size="20" font-weight="700" fill="${C.escuro}" filter="blur(1.6px)" style="filter:blur(1.6px)">V-1?</text></g>
      ${B.caibro(120, CHAO, 60)}${B.caibro(420, CHAO, 60)}
      <g data-k="ica"><path d="M290 40v${CHAO - 260}" stroke="${C.cabo}" stroke-width="4"/><path d="M290 ${CHAO - 220}l-120 140M290 ${CHAO - 220}l120 140" stroke="${C.ambar}" stroke-width="5"/>${xis("", 380, 130, 30)}${T(420, 140, "içar assim?", 22, C.vermelho, "start", 700)}</g>
      <g data-k="sep"><g transform="translate(540 ${CHAO - 130})"><rect x="-90" y="-36" width="180" height="56" rx="6" fill="${C.vermelho}"/>${T(0, 0, "SEPARADA", 22, "#fff", "middle", 700)}</g>${pessoa("", 700, CHAO, { pose: "prancheta", flip: true })}<g transform="translate(560 120) rotate(-8)"><rect x="-60" y="-26" width="120" height="52" rx="6" fill="none" stroke="${C.vermelho}" stroke-width="4"/>${T(0, 10, "RNC", 28, C.vermelho, "middle", 700)}</g></g>`,
    quadro(raiz, t, m, c, q) { vis(q("ica"), P(t, m.e) * (1 - P(t, m.k))); vis(q("sep"), P(t, m.k)); },
  };

  // ------------------------------------------------------------ 2.4 cinco passos (largo)
  const ICO = [
    `<rect x="-50" y="-22" width="100" height="44" rx="4" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>${T(0, 9, "V-12", 22, C.escuro, "middle", 700)}`,
    `<rect x="-46" y="-56" width="92" height="112" rx="6" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>${linhas(-32, -30, 4, 64, 20)}<path d="M-34 -10h68" stroke="${C.vermelho}" stroke-width="7"/>`,
    `${miniGrade(.8)}<circle cx="16" cy="0" r="14" fill="none" stroke="${C.vermelho}" stroke-width="4"/>`,
    `<path d="M-50 30h100" stroke="${C.chao}" stroke-width="3"/><path d="M-30 30v-70M30 30v-70M-34 -44h68" stroke="${C.aco}" stroke-width="8"/><path d="M50 -44l-14 -10v20z" fill="${C.vermelho}"/>${T(56, -60, "EL", 16, C.vermelho)}`,
    `${miniLig(.85)}`,
  ];
  D.passos = {
    largo: true,
    svg: () => [["p1", "Ler a marca", "na etiqueta da peça"], ["p2", "Conferir", "romaneio e lista de material"], ["p3", "Achar no desenho", "planta ou elevação; anotar os eixos"], ["p4", "Nível e orientação", "conferir antes de içar"], ["p5", "Abrir o detalhe", "ligação e lista de parafusos"]]
      .map(([k, nome, sub], i) => `<g data-k="${k}" transform="translate(${120 + i * 235} 70)"><rect x="-105" y="0" width="210" height="340" rx="12" fill="#fff" stroke="${LP}" stroke-width="2"/>
        <circle cx="0" cy="0" r="26" fill="${C.azul}"/>${T(0, 9, i + 1, 24, "#fff", "middle", 700)}<g transform="translate(0 130)">${ICO[i]}</g>${T(0, 240, nome, 23, C.escuro, "middle", 700)}
        <foreignObject x="-98" y="256" width="196" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 18px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${sub}</div></foreignObject></g>`).join("")
      + `<g data-k="duv" transform="translate(590 480)"><rect x="-360" y="-34" width="720" height="68" rx="10" fill="${C.vermelho}"/>${T(0, 10, "Na dúvida, pare e pergunte ao encarregado.", 26, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["p1", "p2", "p3", "p4", "p5", "duv"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
})();
