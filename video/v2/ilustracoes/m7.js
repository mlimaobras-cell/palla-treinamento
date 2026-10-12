// Ilustrações do Módulo 7 (segurança, NRs e documentação de obra). Conteúdo: Caderno do Módulo 7 (revisão 2).
// Noções das NRs; não substitui os treinamentos obrigatórios.
(function () {
  const { C, pessoa, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 500, LP = "#D9DCE8";
  const T = (x, y, txt, tam = 20, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;
  const caixa = (k, x, y, w, h, titulo, corpo, sub = "", cor = null) => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${cor ?? LP}" stroke-width="${cor ? 4 : 2}"/>
    ${T(0, 38, titulo, 23, cor ?? C.escuro, "middle", 700)}${corpo}${sub ? `<foreignObject x="${-w / 2 + 10}" y="${h - 86}" width="${w - 20}" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 17px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${sub}</div></foreignObject>` : ""}</g>`;
  const papel = (w, h, linhas = 5) => `<path d="M${-w / 2} ${-h / 2}h${w - 22}l22 22v${h - 22}h${-w}z" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/>${Array.from({ length: linhas }, (_, i) => `<path d="M${-w / 2 + 16} ${-h / 2 + 34 + i * 22}h${(w - 32) * (i % 3 === 2 ? .6 : 1)}" stroke="${LP}" stroke-width="6" stroke-linecap="round"/>`).join("")}`;
  const gancho = (k, cor) => `<g data-k="${k}"><path d="M0 0q-12 0 -12 12t12 12" fill="none" stroke="${cor}" stroke-width="6"/></g>`;

  // ------------------------------------------------------------ 7.1 NRs (largo)
  D.nrs = {
    largo: true,
    svg: () => [["n1", "NR-01", "gerenciamento de riscos: identificar, avaliar, controlar"], ["n6", "NR-06", "EPI com CA, entregue com ficha, usado e conservado"], ["n11", "NR-11", "movimentação de cargas: operador treinado, içamento planejado"], ["n12", "NR-12", "máquinas: só opera quem é treinado; proteções no lugar"], ["n18", "NR-18", "construção: canteiro organizado, treinamentos"], ["n35", "NR-35", "altura: treinamento, aptidão, análise, permissão, proteção"]]
      .map(([k, nr, sub], i) => caixa(k, 110 + (i % 6) * 192, 60, 176, 380, nr, `<g transform="translate(0 150)"><circle r="46" fill="${k === "n35" ? C.vermelho : C.azul}"/>${T(0, 10, nr.slice(3), 32, "#fff", "middle", 700)}</g>`, sub, k === "n35" ? C.vermelho : null)).join("")
      + `<g data-k="av" transform="translate(590 500)">${T(0, 0, "Noções: não substitui os treinamentos obrigatórios de cada NR", 22, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["n1", "n6", "n11", "n12", "n18", "n35", "av"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.doisMetros = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><path d="M200 ${CHAO}v-330M520 ${CHAO}v-330" stroke="${C.aco}" stroke-width="16"/><rect x="190" y="${CHAO - 340}" width="340" height="18" fill="${C.aco}"/>
      ${pessoa("", 380, CHAO - 340, { pose: "neutro" })}
      <g data-k="m"><path d="M110 ${CHAO}v-150M98 ${CHAO}h24M98 ${CHAO - 150}h24" stroke="${C.vermelho}" stroke-width="3"/><path d="M60 ${CHAO - 150}h520" stroke="${C.vermelho}" stroke-width="2" stroke-dasharray="10 6"/>${T(100, CHAO - 66, "2,00 m", 24, C.vermelho, "end", 700)}${T(222, CHAO - 160, "acima de 2 m com risco de queda", 16, C.vermelho, "start", 700)}</g>
      <g transform="translate(640 100)">${[["t", "NR-35 válida (inicial ≥ 8 h)"], ["a", "ASO apto para altura"], ["p", "análise de risco + PT"]].map(([k, txt], i) => `<g data-k="${k}" transform="translate(0 ${i * 56})">${ok("", -90, 0, 16)}${T(-66, 7, txt, 18, C.escuro, "start", 700)}</g>`).join("")}</g>`,
    quadro(raiz, t, m, c, q) { ["m", "t", "a", "p"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.ordemProtecao = {
    largo: true,
    svg: (u) => caixa("ev", 210, 40, 360, 420, "1. Evitar", `<g transform="translate(0 220)"><path d="M-130 70h260" stroke="${C.chao}" stroke-width="3"/><path d="M-110 60h220M-110 60l110 -60l110 60" fill="none" stroke="${C.aco}" stroke-width="8"/>${pessoa("", 120, 70, { esc: .55 })}</g>`, "pré-montar tesouras e terças no chão")
      + caixa("co", 590, 40, 360, 420, "2. Proteção coletiva", `<g transform="translate(0 220)"><rect x="-130" y="20" width="260" height="14" fill="${C.aco}"/><path d="M-120 20v-70M0 20v-70M120 20v-70M-120 -50h240M-120 -15h240" stroke="${C.ambar}" stroke-width="6"/><path d="M-130 60q130 40 260 0" fill="none" stroke="${C.cinza}" stroke-width="3" stroke-dasharray="4 4"/></g>`, "guarda-corpo, plataforma, rede: protege todos")
      + caixa("in", 970, 40, 360, 420, "3. Individual", `<g transform="translate(0 260)">${pessoa("", 0, 60, { esc: .9 })}<path d="M0 -60V-130" stroke="${C.ambar}" stroke-width="4"/><circle cx="0" cy="-134" r="8" fill="${C.escuro}"/></g>`, "cinturão e talabarte: reduz as consequências")
      + [0, 1].map((i) => `<path data-k="s${i}" d="M${398 + i * 380} 250h-6" stroke="${C.escuro}" stroke-width="6" marker-end="url(#pe-${u})"/>`).join(""),
    quadro(raiz, t, m, c, q) { vis(q("ev"), P(t, m.ev)); vis(q("s0"), P(t, m.co)); vis(q("co"), P(t, m.co)); vis(q("s1"), P(t, m.in)); vis(q("in"), P(t, m.in)); },
  };
  D.talabarte = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><rect x="40" y="${CHAO - 300}" width="740" height="20" fill="${C.aco}"/><rect x="390" y="${CHAO - 280}" width="30" height="280" fill="${C.aco}"/>
      <path d="M60 ${CHAO - 360}h330M420 ${CHAO - 360}h340" stroke="${C.azul}" stroke-width="4"/><path d="M60 ${CHAO - 380}v40M390 ${CHAO - 380}v40M420 ${CHAO - 380}v40M760 ${CHAO - 380}v40" stroke="${C.escuro}" stroke-width="6"/>${T(220, CHAO - 380, "linha de vida (projetada por PLH)", 16, C.azul, "middle", 700)}
      <g data-k="pes">${pessoa("", 0, 0, { pose: "neutro", esc: .95 })}</g>
      <path data-k="la" stroke="${C.ambar}" stroke-width="5" fill="none"/><path data-k="lb" stroke="${C.vermelho}" stroke-width="5" fill="none"/>
      <circle data-k="ga" r="9" fill="${C.ambar}" stroke="${C.escuro}" stroke-width="2"/><circle data-k="gb" r="9" fill="${C.vermelho}" stroke="${C.escuro}" stroke-width="2"/>
      <g data-k="txt" transform="translate(410 60)"><rect x="-300" y="-34" width="600" height="64" rx="10" fill="${C.verde}"/>${T(0, 8, "um gancho sempre preso: 100% conectado", 22, "#fff", "middle", 700)}</g>
      <g data-k="an" transform="translate(410 ${CHAO + 40})">${T(0, 0, "nunca em tubulação, telha ou peça solta · ancoragem acima da cintura", 18, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      const px = 400 + 120 * P(t, (m.s ?? 99) + 1.2, 1.4), py = CHAO - 300, linha = CHAO - 360;
      q("pes").setAttribute("transform", `translate(${px} ${py})`);
      const cint = [px, py - 70];
      const bc = P(t, m.c, 1), as = P(t, m.s, 1);
      const gb = [lerp(px + 10, 460, bc), lerp(py - 60, linha, bc)];
      const ga = as <= 0 ? [360, linha] : as >= 1 ? [500, linha] : [lerp(360, 500, as), linha - 40 * Math.sin(Math.PI * as)];
      q("ga").setAttribute("cx", ga[0]); q("ga").setAttribute("cy", ga[1]); q("gb").setAttribute("cx", gb[0]); q("gb").setAttribute("cy", gb[1]);
      q("la").setAttribute("d", `M${cint[0]} ${cint[1]}L${ga[0]} ${ga[1]}`); q("lb").setAttribute("d", `M${cint[0]} ${cint[1]}L${gb[0]} ${gb[1]}`);
      vis(q("txt"), P(t, m.d)); vis(q("an"), P(t, m.an));
    },
  };

  // ------------------------------------------------------------ 7.2 EPI, APR, DDS, integração
  D.epi = {
    svg: () => `<g transform="translate(300 ${CHAO}) scale(1.9)">${pessoa("", 0, 0, { pose: "neutro" })}</g>
      ${[["ca", 300, CHAO - 330, 480, 90, "capacete com jugular"], ["ob", 300, CHAO - 300, 480, 150, "óculos de segurança"], ["lu", 250, CHAO - 170, 480, 210, "luva adequada à tarefa"], ["ci", 300, CHAO - 200, 480, 270, "cinturão + talabarte duplo"], ["pa", 320, CHAO - 315, 480, 330, "protetor auricular (ruído)"], ["bo", 280, CHAO - 6, 480, 390, "botina com biqueira"]]
        .map(([k, x1, y1, x2, y2, txt]) => `<g data-k="${k}"><path d="M${x1} ${y1}L${x2 - 10} ${y2 - 6}" stroke="${C.azul}" stroke-width="2"/><circle cx="${x1}" cy="${y1}" r="5" fill="${C.azul}"/>${T(x2, y2, txt, 20, C.escuro, "start", 700)}</g>`).join("")}
      <g data-k="rg" transform="translate(600 460)"><rect x="-130" y="-40" width="300" height="80" rx="10" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${T(20, -6, "CA válido · ficha assinada", 18, C.vermelho, "middle", 700)}${T(20, 22, "danificado: troca na hora", 18, C.escuro, "middle", 600)}</g>`,
    quadro(raiz, t, m, c, q) { ["ca", "ob", "lu", "ci", "pa", "bo", "rg"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.aprPt = {
    svg: () => `<g data-k="a" transform="translate(220 260)"><path d="M-170 -200h320l20 20v380h-340z" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/>${T(0, -160, "APR", 30, C.azul, "middle", 700)}
        ${T(-150, -118, "etapa", 15, C.cinza)}${T(-60, -118, "risco", 15, C.cinza)}${T(40, -118, "controle", 15, C.cinza)}${[0, 1, 2, 3].map((i) => `<path d="M-160 ${-104 + i * 64}h320" stroke="${LP}"/>${[-150, -60, 40].map((x) => `<path d="M${x} ${-80 + i * 64}h${x === 40 ? 110 : 70}" stroke="${LP}" stroke-width="6" stroke-linecap="round"/>`).join("")}`).join("")}${T(0, 186, "feita com a equipe que executa", 15, C.cinza, "middle")}</g>
      <g data-k="p" transform="translate(590 230)"><path d="M-150 -170h280l20 20v320h-300z" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/>${T(0, -126, "PT", 30, C.vermelho, "middle", 700)}${["validade", "responsáveis", "condições"].map((s, i) => `${T(-120, -70 + i * 50, s, 18, C.escuro, "start", 700)}<path d="M10 ${-76 + i * 50}h100" stroke="${LP}" stroke-width="6" stroke-linecap="round"/>`).join("")}${T(0, 130, "altura, quente, içamento crítico", 15, C.cinza, "middle")}</g>
      <g data-k="v" transform="translate(590 470)"><rect x="-200" y="-36" width="400" height="72" rx="10" fill="${C.vermelho}"/>${T(0, -6, "mudou vento, chuva, equipamento", 18, "#fff", "middle", 700)}${T(0, 20, "ou local? parar e revisar a APR", 18, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("a"), P(t, m.a)); vis(q("p"), P(t, m.p)); vis(q("v"), P(t, m.v)); },
  };
  D.dds = {
    svg: () => `<ellipse cx="300" cy="${CHAO}" rx="230" ry="40" fill="#E6E8F0"/>${[0, 1, 2, 3, 4, 5].map((i) => { const a = Math.PI * (i / 5); return pessoa("", 300 - Math.cos(a) * 210, CHAO - Math.sin(a) * 20, { esc: .8, flip: i > 2, colete: i === 2 ? C.azul : undefined, pose: i === 2 ? "aponta" : "neutro" }); }).join("")}
      <g data-k="t" transform="translate(640 160)"><circle r="70" fill="#fff" stroke="${C.escuro}" stroke-width="5"/><path d="M0 0V-48" stroke="${C.escuro}" stroke-width="5" stroke-linecap="round"/><path d="M0 0A50 50 0 0 1 50 0" fill="none" stroke="${C.verde}" stroke-width="10"/>${T(0, 104, "10 a 15 min, todo dia", 19, C.escuro, "middle", 700)}</g>
      <g data-k="tm" transform="translate(300 120)"><rect x="-170" y="-34" width="340" height="64" rx="10" fill="${C.azul}"/>${T(0, 8, "tema das atividades do dia", 20, "#fff", "middle", 700)}</g>
      <g data-k="l" transform="translate(640 400)">${papel(150, 130, 4)}${T(0, 92, "lista assinada", 18, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("t"), P(t, m.t)); vis(q("tm"), P(t, m.tm)); vis(q("l"), P(t, m.l)); },
  };
  D.integracao = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><rect x="330" y="${CHAO - 260}" width="24" height="260" fill="${C.escuro}"/><rect data-k="cancela" x="354" y="${CHAO - 150}" width="300" height="20" rx="6" fill="${C.vermelho}"/>${pessoa("", 200, CHAO, { pose: "neutro" })}
      <g transform="translate(560 90)">${[["n", "ASO e NRs da função"], ["e", "EPI com ficha"], ["o", "integração desta obra"], ["tc", "terceiros: documentos conferidos"]].map(([k, txt], i) => `<g data-k="${k}" transform="translate(0 ${i * 50})">${ok("", -150, 0, 15)}${T(-128, 7, txt, 18, C.escuro, "start", 700)}</g>`).join("")}</g>
      <g data-k="b" transform="translate(500 ${CHAO + 40})">${T(0, 0, "sem integração ou documento vencido: bloqueado no portão", 19, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["n", "o", "tc", "b"].forEach((k) => vis(q(k), P(t, m[k]))); vis(q("e"), P(t, (m.n ?? 99) + .6)); q("cancela").setAttribute("transform", `rotate(${-70 * P(t, m.ok ?? 99, 1)} 354 ${CHAO - 140})`); },
  };

  // ------------------------------------------------------------ 7.3 documentação
  D.diario = {
    svg: () => `<g data-k="r" transform="translate(210 230)">${papel(300, 260, 0)}${T(-130, -90, "Diário · 14/mm", 17, C.cinza)}${T(-130, -40, "montagem de estrutura", 21, C.escuro, "start", 700)}${xis("", 120, 100, 26)}</g>
      <g data-k="b" transform="translate(580 230)">${papel(320, 260, 0)}${T(-140, -90, "Diário · 14/mm", 17, C.cinza)}${["montados pórticos", "dos eixos 3 a 6", "12 terças", "prumo verificado", "efetivo: 9 · guindaste"].map((s, i) => T(-140, -48 + i * 30, s, 19, C.escuro, "start", 700)).join("")}${ok("", 130, 100, 26)}</g>
      <g data-k="d" transform="translate(410 460)"><rect x="-370" y="-36" width="740" height="72" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -6, "todos os dias corridos; sem atividade, com o motivo", 20, C.azul, "middle", 700)}${T(0, 22, "assinado pelo cliente ao fim de cada etapa", 18, C.escuro, "middle", 600)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("r"), P(t, m.r)); vis(q("b"), P(t, m.b)); vis(q("d"), P(t, m.d)); },
  };
  D.rncDoc = {
    svg: () => `<path d="M0 ${CHAO - 120}h820" stroke="${C.chao}" stroke-width="3"/><rect x="60" y="${CHAO - 170}" width="380" height="40" fill="${C.aco}"/><path d="M200 ${CHAO - 170}q30 18 60 0" fill="#F5F6FA" stroke="${C.vermelho}" stroke-width="3"/>
      <g data-k="m"><path d="M200 ${CHAO - 190}h60M200 ${CHAO - 198}v16M260 ${CHAO - 198}v16" stroke="${C.ambar}" stroke-width="4"/>${T(230, CHAO - 206, "medida do desvio", 16, C.ambar, "middle", 700)}</g>
      <g data-k="f" transform="translate(380 120)"><rect x="-40" y="-26" width="80" height="54" rx="8" fill="${C.escuro}"/><circle r="15" fill="#fff"/><circle r="8" fill="${C.escuro}"/>${T(0, 58, "foto", 17, C.escuro, "middle", 700)}</g>
      <g data-k="d" transform="translate(640 200)">${papel(220, 230, 5)}${T(0, -60, "RNC", 26, C.vermelho, "middle", 700)}${T(0, 150, "na hora em que achou", 17, C.escuro, "middle", 700)}</g>
      <g data-k="e" transform="translate(410 ${CHAO - 20})"><rect x="-380" y="-36" width="760" height="72" rx="10" fill="${C.vermelho}"/>${T(0, -6, "nenhum retrabalho sem aprovação da engenharia", 20, "#fff", "middle", 700)}${T(0, 22, "RNC não é caça a culpado: é para corrigir e não repetir", 17, "#fff", "middle", 600)}</g>`,
    quadro(raiz, t, m, c, q) { ["m", "f", "d", "e"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.cores = {
    svg: () => `<g transform="translate(300 290)"><rect x="-250" y="-210" width="500" height="420" rx="6" fill="#fff" stroke="${C.escuro}" stroke-width="2.5"/>
        ${[-180, -60, 60, 180].map((x) => `<path d="M${x} -180v360" stroke="${C.azul}" stroke-width="1.5" stroke-dasharray="8 5"/>`).join("")}${[-120, 0, 120].map((y) => `<path d="M-220 ${y}h440" stroke="${C.azul}" stroke-width="1.5" stroke-dasharray="8 5"/>`).join("")}
        ${[-180, -60, 60, 180].flatMap((x) => [-120, 0, 120].map((y) => `<rect x="${x - 7}" y="${y - 7}" width="14" height="14" fill="${C.aco}"/>`)).join("")}
        <g data-k="az">${[[-180, -120], [-60, -120], [60, -120], [-180, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#2F6FE0" stroke-width="5"/>`).join("")}</g>
        <g data-k="am">${[[-120, -120], [0, 0]].map(([x, y]) => `<path d="M${x - 30} ${y}h60" stroke="#F2C230" stroke-width="10" opacity=".9"/>`).join("")}</g>
        <g data-k="vd">${[[120, 120], [-120, 120]].map(([x, y]) => `<path d="M${x - 30} ${y}h60" stroke="${C.verde}" stroke-width="10" opacity=".9"/>`).join("")}</g></g>
      <g transform="translate(590 160)">${[["az", "#2F6FE0", "azul: torque"], ["am", "#F2C230", "amarelo: solda"], ["vd", C.verde, "verde: pintura"]].map(([k, cor, txt], i) => `<g data-k="L${k}" transform="translate(0 ${i * 70})"><rect x="0" y="-18" width="30" height="30" rx="6" fill="${cor}"/>${T(42, 4, txt, 19, C.escuro, "start", 700)}</g>`).join("")}${T(0, 230, "+ foto e registro no diário", 18, C.cinza)}</g>`,
    quadro(raiz, t, m, c, q) { ["az", "am", "vd"].forEach((k) => { vis(q(k), P(t, m[k])); vis(q(`L${k}`), P(t, m[k])); }); },
  };
  const ICOE = {
    rt: `<rect x="-40" y="-50" width="80" height="100" rx="6" fill="#fff" stroke="${C.escuro}" stroke-width="2"/><path d="M-26 20l14 -20l14 10l20 -30" fill="none" stroke="#2F6FE0" stroke-width="4"/>`,
    if: `${pessoa("", -24, 50, { esc: .5 })}${pessoa("", 24, 50, { esc: .5, colete: C.azul, flip: true })}`,
    te: `<rect x="-40" y="-50" width="80" height="100" rx="6" fill="#fff" stroke="${C.escuro}" stroke-width="2"/><path d="M-24 30c8 -14 16 6 24 -4s14 -10 20 0" fill="none" stroke="${C.azul}" stroke-width="3"/>`,
    mg: `<rect x="-36" y="-50" width="72" height="100" rx="4" fill="${C.azul}"/><path d="M-20 -20h40M-20 0h40" stroke="#fff" stroke-width="5"/>`,
    db: `<rect x="-46" y="-50" width="92" height="100" rx="4" fill="${C.escuro}"/><rect x="-36" y="-40" width="72" height="16" fill="${C.ambar}"/>`,
  };
  D.entrega = {
    largo: true,
    svg: () => [["rt", "Relatório de torque", "feito ao longo da obra, torquímetro calibrado"], ["if", "Inspeção final", "com o cliente, ao fim de cada etapa"], ["te", "Termo de entrega", "assinado pelo cliente após a inspeção"], ["mg", "Manual de garantia", "com ciência formal da manutenção"], ["db", "Data book", "PIT, certificados, solda, ensaios, pintura, as built"]]
      .map(([k, nome, sub], i) => caixa(k, 120 + i * 235, 40, 220, 400, nome, `<g transform="translate(0 170)">${ICOE[k]}</g>`, sub)).join("")
      + `<g data-k="nr" transform="translate(590 495)"><rect x="-420" y="-34" width="840" height="68" rx="10" fill="${C.vermelho}"/>${T(0, 9, "O que não foi registrado não aconteceu.", 26, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["rt", "if", "te", "mg", "db", "nr"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
})();
