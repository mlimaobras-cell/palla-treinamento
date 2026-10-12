// Ilustrações do Módulo 4 (ligações parafusadas e torque). Conteúdo: Caderno do Módulo 4 (revisão 2).
// Valores numéricos só os que estão no caderno (NBR 8800 Tabela 15, RCSC); torque aparece apenas como conceito.
(function () {
  const { C, pessoa, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 515, LP = "#D9DCE8", GAL = "#B8BFCC", PRE = "#3A3F55";
  const T = (x, y, txt, tam = 20, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;
  const card = (k, x, y, w, h, titulo, corpo, sub = "", cor = null) => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${cor ?? LP}" stroke-width="${cor ? 4 : 2}"/>
    ${T(0, 40, titulo, 25, cor ?? C.escuro, "middle", 700)}${corpo}${sub ? `<foreignObject x="${-w / 2 + 10}" y="${h - 96}" width="${w - 20}" height="90"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 19px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${sub}</div></foreignObject>` : ""}</g>`;
  // parafuso de lado, cabeça para cima, origem no centro da cabeça; comprimento L; rosca nos últimos r px
  const rosca = (x, y, w, h) => Array.from({ length: Math.floor(h / 7) }, (_, i) => `<path d="M${x} ${y + i * 7}l${w} 4" stroke="#fff" stroke-width="1.6" opacity=".55"/>`).join("");
  const parafuso = (L = 200, w = 30, cor = C.aco, marca = "A325", r = 90) => `<rect x="${-w * .95}" y="-30" width="${w * 1.9}" height="30" rx="3" fill="${cor}"/>${marca ? T(0, -9, marca, 13, "#fff", "middle", 700) : ""}
    <rect x="${-w / 2}" y="0" width="${w}" height="${L}" fill="${cor}"/>${rosca(-w / 2, L - r, w, r)}`;
  const porca = (w = 30, cor = C.acoE, txt = "DH", alt = 30) => `<rect x="${-w * .95}" y="0" width="${w * 1.9}" height="${alt}" rx="3" fill="${cor}"/><path d="M${-w * .32} 0v${alt}M${w * .32} 0v${alt}" stroke="#fff" stroke-width="1.5" opacity=".4"/>${txt ? T(0, alt * .68, txt, 13, "#fff", "middle", 700) : ""}`;
  const arruela = (w = 30, cor = "#8C93AA") => `<rect x="${-w * 1.1}" y="0" width="${w * 2.2}" height="9" rx="2" fill="${cor}"/>`;
  const chapas = (x, y, w, e1, e2, furo = 34) => `<rect x="${x}" y="${y}" width="${w}" height="${e1}" fill="${C.aco}"/><rect x="${x}" y="${y + e1}" width="${w}" height="${e2}" fill="${C.acoE}"/>`;

  // ------------------------------------------------------------ 4.1 o conjunto
  D.conjunto = {
    svg: () => `<g data-k="p" transform="translate(200 150)">${parafuso(250, 34)}${T(0, -50, "Parafuso A325", 22, C.escuro, "middle", 700)}${T(0, 290, "“A325” + fabricante", 18, C.cinza, "middle")}</g>
      <g data-k="a" transform="translate(410 300)">${arruela(34)}${T(0, -20, "Arruela F436", 22, C.escuro, "middle", 700)}${T(0, 40, "endurecida", 18, C.cinza, "middle")}</g>
      <g data-k="po" transform="translate(600 290)">${porca(34)}${T(0, -20, "Porca A563", 22, C.escuro, "middle", 700)}${T(0, 66, "grau marcado", 18, C.cinza, "middle")}</g>
      <g data-k="mt"><rect x="60" y="490" width="700" height="66" rx="10" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${T(410, 532, "sempre os três juntos · porca comum em A325 é erro", 22, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["p", "a", "po", "mt"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.lotes = {
    svg: () => `${[["pr", 140, PRE, "A325", "Tipo 1 preto", "oleado"], ["gv", 410, GAL, "A325", "Tipo 1 galvanizado", "porca A563 DH"], ["t3", 680, "#8B5A2B", "<tspan text-decoration='underline'>A325</tspan>", "Tipo 3", "patinável · A325 sublinhado"]].map(([k, x, cor, mk, nome, sub]) => `<g data-k="${k}" transform="translate(${x} 90)">${parafuso(200, 32, cor, "")}<text x="0" y="-9" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${mk}</text>${T(0, 250, nome, 21, C.escuro, "middle", 700)}${T(0, 278, sub, 17, C.cinza, "middle")}</g>`).join("")}
      <g data-k="mx" transform="translate(410 470)"><rect x="-330" y="-40" width="660" height="80" rx="10" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${xis("", -290, 0, 22)}${T(10, 9, "nunca misture porca de um lote com parafuso de outro", 20, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["pr", "gv", "t3", "mx"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.bitolas = {
    svg: () => `${[["1/2″", 12.7], ["5/8″", 15.9], ["3/4″", 19.1], ["7/8″", 22.2], ["1″", 25.4]].map(([b, d], i) => `<g data-k="b${i}" transform="translate(${110 + i * 150} 120)">${parafuso(220, d * 2.2, i < 2 ? C.aco : C.azul, "")}${T(0, 270, b, 26, C.escuro, "middle", 700)}${T(0, 298, `${String(d).replace(".", ",")} mm`, 17, C.cinza, "middle")}</g>`).join("")}
      <g data-k="s"><path d="M60 450h270" stroke="${C.aco}" stroke-width="6"/>${T(195, 482, "secundárias: terças, travamentos", 18, C.cinza, "middle")}</g>
      <g data-k="p"><path d="M390 450h390" stroke="${C.azul}" stroke-width="6"/>${T(585, 482, "principais: viga-pilar, emendas, bases", 18, C.azul, "middle")}</g>`,
    quadro(raiz, t, m, c, q) { [0, 1, 2, 3, 4].forEach((i) => vis(q(`b${i}`), P(t, (m.b ?? 0) + i * .25))); vis(q("s"), P(t, m.s)); vis(q("p"), P(t, m.p)); },
  };
  D.semMarca = {
    svg: () => `<g transform="translate(220 120)">${parafuso(200, 34, C.aco, "")}${T(0, -50, "sem marcação", 22, C.vermelho, "middle", 700)}</g>
      <g transform="translate(520 260)">${porca(34, C.acoE, "", 20)}${T(0, -20, "porca comum", 22, C.vermelho, "middle", 700)}</g>
      ${xis("x1", 330, 64, 22)}${xis("x2", 640, 232, 22)}
      <g data-k="k" transform="translate(410 470)"><rect x="-320" y="-44" width="640" height="88" rx="10" fill="${C.verde}"/>${T(0, -6, "Separar como não conforme", 26, "#fff", "middle", 700)}${T(0, 26, "e registrar", 22, "#fff", "middle", 500)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("x1"), P(t, m.e)); vis(q("x2"), P(t, m.e + .8)); vis(q("k"), P(t, m.k)); },
  };

  // ------------------------------------------------------------ 4.2 comprimento
  D.pega = {
    svg: (u) => `${chapas(160, 220, 380, 50, 50)}<rect x="330" y="220" width="40" height="100" fill="#F5F6FA"/>
      <g data-k="pf"><g transform="translate(350 190)">${parafuso(190, 30, C.aco, "", 60)}</g><g transform="translate(350 320)">${arruela(30)}</g><g transform="translate(350 329)">${porca(30, C.acoE, "")}</g></g>
      <g data-k="pg"><path d="M130 220v100M118 220h24M118 320h24" stroke="${C.vermelho}" stroke-width="3"/>${T(116, 262, "16", 18, C.vermelho, "end")}${T(116, 296, "16", 18, C.vermelho, "end")}${T(40, 350, "pega = 32 mm", 22, C.vermelho, "start", 700)}</g>
      <g data-k="ac"><path d="M420 320v60M408 320h24M408 380h24" stroke="${C.azul}" stroke-width="3"/>${T(440, 350, "+ 25,4 mm (3/4″)", 20, C.azul, "start", 700)}${T(440, 376, "arruela, porca, sobra", 17, C.cinza)}</g>
      <g data-k="cm" transform="translate(410 470)"><rect x="-370" y="-44" width="740" height="88" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>${T(0, -6, "32 + 25,4 = 57,4 mm", 26, C.escuro, "middle", 700)}${T(0, 26, "use o comprimento comercial imediatamente acima", 19, C.cinza, "middle")}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("pf"), P(t, m.pg - .5)); vis(q("pg"), P(t, m.pg)); vis(q("ac"), P(t, m.ac)); vis(q("cm"), P(t, m.cm)); },
  };
  const caso = (k, x, sobra, titulo, cor, ico) => `<g data-k="${k}" transform="translate(${x} 0)">${chapas(-90, 200, 180, 40, 40)}<g transform="translate(0 170)">${parafuso(110 + sobra, 30, C.aco, "", 50)}</g><g transform="translate(0 280)">${arruela(30)}</g><g transform="translate(0 289)">${porca(30, C.acoE, "", 40)}</g>
    <path d="M-80 329h160" stroke="${cor}" stroke-width="2" stroke-dasharray="5 4"/>${T(0, 400, titulo, 21, cor, "middle", 700)}${ico === "ok" ? ok("", 0, 450, 22) : xis("", 0, 450, 22)}</g>`;
  D.ponta = {
    svg: () => caso("a", 150, -16, "abaixo da face", C.vermelho, "x") + caso("r", 410, 0, "rente: mínimo", C.verde, "ok") + caso("i", 670, 18, "2 a 3 fios: ideal", C.verde, "ok"),
    quadro(raiz, t, m, c, q) { ["a", "r", "i"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.planoCorte = {
    svg: () => [["x", 220, "Tipo X", "rosca fora do plano de corte", 60], ["n", 600, "Tipo N", "rosca pode ficar no plano", 120]].map(([k, x, nome, sub, r]) => `<g data-k="${k}" transform="translate(${x} 0)">${chapas(-130, 220, 260, 50, 50)}<g transform="translate(0 190)">${parafuso(170, 32, C.aco, "", r)}</g><g transform="translate(0 320)">${porca(32, C.acoE, "")}</g>
        <path d="M-160 270h320" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="10 6"/>${k === "x" ? T(-130, 346, "plano de corte ↑", 16, C.vermelho, "start", 700) : ""}${T(0, 420, nome, 26, C.escuro, "middle", 700)}${T(0, 450, sub, 18, C.cinza, "middle")}</g>`).join("")
      + `<g data-k="l" transform="translate(410 530)">${T(0, 0, "confira na lista de parafusos", 22, C.azul, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("x"), P(t, m.x)); vis(q("n"), P(t, m.n)); vis(q("l"), P(t, m.l)); },
  };
  D.tiposLig = {
    largo: true,
    svg: (u) => card("c", 210, 30, 360, 400, "Contato", `<g transform="translate(0 170)">${chapas(-110, -20, 220, 20, 20)}<rect x="-12" y="-46" width="24" height="92" fill="${C.escuro}"/><path d="M-150 -10h40M150 10h-40" stroke="${C.vermelho}" stroke-width="4" marker-end="url(#pv-${u})"/></g>`, "esforço passa pelo apoio do parafuso no furo · aperto firme · comum em galpões")
      + card("p", 590, 30, 360, 400, "Protendida", `<g transform="translate(0 170)">${chapas(-110, -20, 220, 20, 20)}<rect x="-12" y="-46" width="24" height="92" fill="${C.escuro}"/><path d="M0 -90v34M0 90v-34" stroke="${C.azul}" stroke-width="5" marker-end="url(#pa-${u})"/></g>`, "carga cíclica, inversão de esforços ou exigência de projeto · protensão mínima")
      + card("a", 970, 30, 360, 400, "Atrito", `<g transform="translate(0 170)">${chapas(-110, -20, 220, 20, 20)}<rect x="-12" y="-46" width="24" height="92" fill="${C.escuro}"/><path d="M-110 0h220" stroke="${C.ambar}" stroke-width="4" stroke-dasharray="4 4"/></g>`, "esforço passa pelo atrito entre as chapas · protensão + superfícies preparadas")
      + `<g data-k="pj" transform="translate(590 490)"><rect x="-500" y="-36" width="1000" height="72" rx="10" fill="${C.vermelho}"/>${T(0, 10, "Quem define o aperto é o projeto, nunca o montador.", 26, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["c", "p", "a", "pj"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 4.3 protensão e torque
  D.protensao = {
    svg: (u) => `<g transform="translate(300 0)">${chapas(-180, 230, 360, 50, 50)}<g transform="translate(0 200)">${parafuso(170, 34, C.aco, "A325", 60)}</g><g transform="translate(0 330)">${arruela(34)}</g><g transform="translate(0 339)">${porca(34)}</g>
        <g data-k="f"><path d="M-120 150v60M120 150v60" stroke="${C.azul}" stroke-width="6" marker-end="url(#pa-${u})"/><path d="M-120 430v-60M120 430v-60" stroke="${C.azul}" stroke-width="6" marker-end="url(#pa-${u})"/>${T(0, 470, "o parafuso estica e aperta as chapas", 20, C.azul, "middle", 700)}</g></g>
      <g data-k="v" transform="translate(640 250)"><rect x="-140" y="-90" width="280" height="190" rx="12" fill="${C.escuro}"/>${T(0, -50, "A325 3/4″", 22, "#fff", "middle", 700)}${T(0, 4, "125 kN", 44, "#fff", "middle", 700)}${T(0, 44, "≈ 12,7 toneladas-força", 19, "#C9CCE0", "middle")}${T(0, 80, "NBR 8800, Tabela 15", 15, "#9AA0C0", "middle")}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("f"), P(t, m.f)); const s = 1 + .04 * Math.max(0, Math.sin((t - m.f) * 3)) * P(t, m.f);
      q("f").setAttribute("transform", `scale(1 ${s})`); vis(q("v"), P(t, m.v));
    },
  };
  const barra = (k, y, nome, cor, txt) => `<g data-k="${k}" transform="translate(0 ${y})">${T(60, 30, nome, 21, C.escuro, "start", 700)}<rect x="300" y="8" width="360" height="30" rx="6" fill="#EEF0F6"/><rect data-k="${k}B" x="300" y="8" width="0" height="30" rx="6" fill="${cor}"/>${T(300, 70, txt, 17, cor)}</g>`;
  D.torqueK = {
    svg: () => `<g data-k="t">${T(410, 70, "mesmo torque na chave", 26, C.escuro, "middle", 700)}${T(410, 102, "T = K × d × Fp · K varia de 0,10 a 0,25", 19, C.cinza, "middle")}</g>
      <path d="M540 140v360" stroke="${C.verde}" stroke-width="3" stroke-dasharray="7 5"/>${T(540, 134, "protensão mínima", 16, C.verde, "middle", 700)}
      ${barra("pr", 160, "Preto oleado", C.azul, "chega na protensão prevista")}${barra("gv", 280, "Galvanizado lubrificado", C.vermelho, "passa do ponto: pode romper")}${barra("su", 400, "Sujo ou oxidado", C.ambar, "não chega: separar")}`,
    quadro(raiz, t, m, c, q) {
      vis(q("t"), P(t, m.t));
      [["pr", 250], ["gv", 360], ["su", 150]].forEach(([k, w]) => { vis(q(k), P(t, m[k])); q(`${k}B`).setAttribute("width", w * P(t, m[k] + .3, 1.4)); });
    },
  };

  // ------------------------------------------------------------ 4.4 métodos
  D.rotacao = {
    svg: () => `<g transform="translate(300 300)"><circle r="190" fill="#EEF0F6" stroke="${LP}" stroke-width="2"/>${T(-170, -160, "chapa", 18, C.cinza)}
        <g data-k="porca"><path d="M0 -90L78 -45L78 45L0 90L-78 45L-78 -45Z" fill="${C.acoE}"/><circle r="34" fill="${C.aco}"/><path data-k="mp" d="M0 -88V-34" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g>
        <path data-k="mc" d="M0 -186V-96" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path data-k="mpt" d="M0 -30V0" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
        <path data-k="arco" d="M0 -140A140 140 0 0 1 121 70" fill="none" stroke="${C.vermelho}" stroke-width="5" stroke-dasharray="10 6"/></g>
      <g data-k="tab" transform="translate(530 140)"><rect width="270" height="190" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(14, 30, "comprimento L", 15, C.cinza)}${T(150, 30, "giro", 15, C.cinza)}
        ${[["até 4d", "1/3 (120°)"], ["4d a 8d", "1/2 (180°)"], ["8d a 12d", "2/3 (240°)"]].map(([a, b], i) => `${T(14, 70 + i * 40, a, 19, i === 0 ? C.vermelho : C.escuro, "start", 700)}${T(150, 70 + i * 40, b, 19, i === 0 ? C.vermelho : C.escuro, "start", 700)}`).join("")}${T(14, 176, "tolerância conforme a tabela", 14, C.cinza)}</g>
      <g data-k="giz">${T(530, 400, "marca de giz: porca, ponta e chapa", 18, C.escuro)}</g>`,
    quadro(raiz, t, m, c, q) {
      ["mp", "mc", "mpt"].forEach((k) => vis(q(k), P(t, m.m)));
      vis(q("giz"), P(t, m.m)); vis(q("tab"), P(t, m.tb));
      const ang = 120 * P(t, m.g, 2.2); q("porca").setAttribute("transform", `rotate(${ang})`);
      vis(q("arco"), P(t, m.g) * (t < m.g + 2.4 ? 1 : 1));
      q("arco").setAttribute("stroke-dasharray", `${(ang / 360) * 2 * Math.PI * 140} 1000`);
    },
  };
  D.calibrada = {
    svg: () => `<g transform="translate(220 300)"><rect x="-150" y="-110" width="300" height="220" rx="14" fill="${C.escuro}"/>${T(0, -70, "célula de calibração", 18, "#C9CCE0", "middle")}
        <rect x="-110" y="-46" width="220" height="70" rx="8" fill="#fff"/><text data-k="kn" x="0" y="0" font-size="32" font-weight="700" fill="${C.escuro}" text-anchor="middle">0%</text>${T(0, 18, "da protensão mínima", 13, C.cinza, "middle")}
        ${[0, 1, 2].map((i) => `<g data-k="j${i}" transform="translate(${-70 + i * 70} 70)"><rect x="-10" y="-14" width="20" height="28" fill="${C.aco}"/></g>`).join("")}</g>
      <g data-k="tm" transform="translate(600 220)"><rect x="-170" y="-60" width="340" height="120" rx="12" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -16, "3 conjuntos por bitola e lote", 19, C.escuro, "middle", 700)}${T(0, 14, "até 1,05 × a protensão", 19, C.escuro, "middle", 700)}${T(0, 42, "torque médio = torque do dia", 19, C.azul, "middle", 700)}</g>
      <g data-k="rc" transform="translate(600 400)"><rect x="-170" y="-50" width="340" height="100" rx="12" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${T(0, -12, "recalibrar se mudar lote,", 19, C.vermelho, "middle", 700)}${T(0, 18, "bitola, lubrificação ou ferramenta", 19, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      [0, 1, 2].forEach((i) => vis(q(`j${i}`), P(t, m.c + i * .5)));
      q("kn").textContent = `${Math.round(105 * P(t, m.c + .3, 2))}%`;
      vis(q("tm"), P(t, m.m)); vis(q("rc"), P(t, m.r));
    },
  };
  D.dti = {
    svg: () => `<g transform="translate(330 300)"><circle r="170" fill="#8C93AA"/><circle r="56" fill="#F5F6FA"/>
        ${Array.from({ length: 6 }, (_, i) => { const a = i * 60 * Math.PI / 180; return `<ellipse cx="${Math.cos(a) * 112}" cy="${Math.sin(a) * 112}" rx="26" ry="16" transform="rotate(${i * 60} ${Math.cos(a) * 112} ${Math.sin(a) * 112})" fill="#6E7590"/>`; }).join("")}
        <g data-k="lam"><rect x="-350" y="-8" width="200" height="16" rx="3" fill="${C.ambar}"/>${T(-250, -18, "calibre 0,38 mm", 17, C.ambar, "middle", 700)}</g></g>
      <g data-k="l" transform="translate(620 180)">${ok("", -130, 0, 20)}${T(-100, 7, "não entra em ½ dos vãos", 19, C.verde, "start", 700)}${T(-100, 34, "protensão atingida", 17, C.cinza)}</g>
      <g data-k="z" transform="translate(620 300)">${xis("", -130, 0, 20)}${T(-100, 7, "folga zero em todos", 19, C.vermelho, "start", 700)}${T(-100, 34, "sobrecarga: rejeitar", 17, C.cinza)}</g>
      <g data-k="tc" transform="translate(620 430)"><rect x="-160" y="-40" width="330" height="86" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="2"/>${T(5, -8, "Parafuso TC: a pistola", 18, C.escuro, "middle", 700)}${T(5, 18, "rompe a ponta estriada", 18, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("lam"), P(t, m.l - .6)); q("lam").setAttribute("transform", `translate(${60 * P(t, m.l - .4, 1.2) - 60 * P(t, m.z, .6)} 0)`);
      vis(q("l"), P(t, m.l)); vis(q("z"), P(t, m.z)); vis(q("tc"), P(t, m.tc));
    },
  };
  const ICOF = {
    c: `<path d="M-90 10h150" stroke="${C.aco}" stroke-width="18" stroke-linecap="round"/><circle cx="70" cy="10" r="26" fill="none" stroke="${C.aco}" stroke-width="12"/>`,
    i: `<rect x="-70" y="-30" width="110" height="56" rx="12" fill="${C.ambar}"/><rect x="-40" y="20" width="40" height="70" rx="8" fill="${PRE}"/><rect x="40" y="-12" width="36" height="20" fill="${C.aco}"/>`,
    e: `<path d="M-100 10h170" stroke="${C.escuro}" stroke-width="14" stroke-linecap="round"/><rect x="-40" y="-2" width="60" height="24" rx="4" fill="${C.vermelho}"/><circle cx="80" cy="10" r="16" fill="${C.aco}"/>`,
    h: `<rect x="-60" y="-40" width="110" height="80" rx="10" fill="${C.vermelho}"/><path d="M50 0h50" stroke="${C.aco}" stroke-width="14"/><path d="M-60 -20h-40v60" fill="none" stroke="${C.escuro}" stroke-width="8"/>`,
  };
  D.ferramentas = {
    largo: true,
    svg: () => [["c", "Combinada / catraca", "aperto firme até 5/8″ · soquete de impacto"], ["i", "Chave de impacto", "aperto firme e pré-aperto · não controla torque"], ["e", "Torquímetro de estalo", "calibrado · zerar após o uso · nunca desapertar"], ["h", "Torquímetro hidráulico", "1″ ou mais · braço de reação em ponto rígido"]]
      .map(([k, nome, sub], i) => card(k, 160 + i * 287, 30, 270, 380, nome, `<g transform="translate(0 160)">${ICOF[k]}</g>`, sub)).join("")
      + `<g data-k="s" transform="translate(590 480)"><rect x="-520" y="-36" width="1040" height="72" rx="10" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${T(0, 10, "fora da linha de giro da chave · ferramenta amarrada em altura · recolher pontas TC", 22, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["c", "i", "e", "h", "s"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 4.5 sequência, inspeção, registro
  const FUROS = [[0, 1], [1, 1], [0, 2], [1, 2], [0, 0], [1, 0], [0, 3], [1, 3]]; // ordem: centro → bordas
  D.sequencia = {
    svg: () => `<rect x="170" y="70" width="300" height="440" rx="6" fill="${C.aco}"/>${FUROS.map(([c, l], i) => `<g data-k="f${i}" transform="translate(${260 + c * 120} ${130 + l * 110})"><circle r="30" fill="${C.escuro}"/><circle data-k="a${i}" r="30" fill="${C.ambar}"/><circle data-k="p${i}" r="30" fill="${C.azul}"/>${T(0, 8, i + 1, 22, "#fff", "middle", 700)}</g>`).join("")}
      <g transform="translate(520 120)">${[["f", C.ambar, "1. firme: centro → bordas"], ["p", C.azul, "2. protensão: idem"], ["r", C.verde, "3. repasse"]].map(([k, cor, txt], i) => `<g data-k="L${k}" transform="translate(0 ${i * 70})"><rect width="26" height="26" rx="4" fill="${cor}"/>${T(38, 21, txt, 19, C.escuro, "start", 700)}</g>`).join("")}</g>
      <g data-k="pin" transform="translate(520 400)"><rect width="270" height="80" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(135, 34, "alinhar furos com pino,", 17, C.escuro, "middle", 600)}${T(135, 60, "nunca com o parafuso", 17, C.escuro, "middle", 600)}</g>
      ${ok("okr", 320, 40, 22)}`,
    quadro(raiz, t, m, c, q) {
      FUROS.forEach((_, i) => { vis(q(`a${i}`), P(t, m.f + i * .45, .3)); vis(q(`p${i}`), P(t, m.p + i * .45, .3)); });
      ["f", "p", "r"].forEach((k) => vis(q(`L${k}`), P(t, m[k]))); vis(q("okr"), P(t, m.r)); vis(q("pin"), P(t, m.pn));
    },
  };
  D.inspecao = {
    svg: () => `<rect x="80" y="110" width="300" height="300" rx="6" fill="${C.aco}"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<circle data-k="v${i}" cx="${140 + (i % 3) * 90}" cy="${170 + Math.floor(i / 3) * 90}" r="26" fill="${C.escuro}"/>`).join("")}
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<g data-k="ck${i}" transform="translate(${158 + (i % 3) * 90} ${152 + Math.floor(i / 3) * 90})">${ok("", 0, 0, 11)}</g>`).join("")}
      <circle data-k="arb1" cx="230" cy="260" r="38" fill="none" stroke="${C.vermelho}" stroke-width="5"/><circle data-k="arb2" cx="320" cy="350" r="38" fill="none" stroke="${C.vermelho}" stroke-width="5"/>
      <g data-k="Tv" transform="translate(430 140)">${T(0, 0, "visual em 100%", 22, C.escuro, "start", 700)}${T(0, 28, "marcação, arruela, ponta, giz/DTI/TC", 16, C.cinza)}</g>
      <g data-k="Ta" transform="translate(430 230)">${T(0, 0, "arbitragem: 10% (mín. 2)", 22, C.vermelho, "start", 700)}${T(0, 28, "girou? repassar e reinspecionar tudo", 16, C.cinza)}</g>
      <g data-k="Tr" transform="translate(430 320)"><rect width="340" height="150" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(16, 34, "registro", 22, C.azul, "start", 700)}${T(16, 66, "nº de série do torquímetro", 17, C.escuro)}${T(16, 94, "marca azul no projeto", 17, C.escuro)}${T(16, 122, "foto + relatório de torque", 17, C.escuro)}</g>`,
    quadro(raiz, t, m, c, q) {
      for (let i = 0; i < 9; i++) vis(q(`ck${i}`), P(t, m.v + i * .2, .3));
      vis(q("Tv"), P(t, m.v)); vis(q("Ta"), P(t, m.ar)); vis(q("arb1"), P(t, m.ar + .4)); vis(q("arb2"), P(t, m.ar + .8)); vis(q("Tr"), P(t, m.rg));
    },
  };
  const ICOP = {
    c: `<path d="M-100 10h110" stroke="${C.aco}" stroke-width="16"/><path d="M10 10h90" stroke="${C.vermelho}" stroke-width="24"/>${T(55, 50, "cano", 17, C.vermelho, "middle", 700)}`,
    d: `<rect x="-60" y="-50" width="30" height="100" fill="${C.aco}"/><rect x="25" y="-50" width="18" height="100" fill="${C.vermelho}"/>${T(-45, 72, "projeto", 15, C.cinza, "middle")}${T(34, 72, "menor", 15, C.vermelho, "middle")}`,
    o: `<rect x="-80" y="-40" width="160" height="80" fill="${C.aco}"/><ellipse cx="0" cy="0" rx="40" ry="16" fill="#F5F6FA" stroke="${C.vermelho}" stroke-width="3"/>`,
    ap: `<path d="M-40 0a40 16 0 1 0 80 0a40 16 0 1 0 -80 0" fill="none" stroke="${C.aco}" stroke-width="12"/><path d="M30 -14l14 26" stroke="#F5F6FA" stroke-width="8"/>`,
  };
  D.proibidos = {
    largo: true,
    svg: () => [["c", "Extensão na chave", "nenhum recurso de aperto excessivo"], ["d", "Diâmetro menor", "mesmo de material mais resistente"], ["o", "Ovalizar furo", "furo errado: procedimento aprovado"], ["ap", "Arruela de pressão", "A325 protendido: só F436"]]
      .map(([k, nome, sub], i) => card(k, 160 + i * 287, 40, 270, 400, nome, `<g transform="translate(0 170)">${ICOP[k]}</g>${xis("", 100, 70, 22)}`, sub, C.vermelho)).join(""),
    quadro(raiz, t, m, c, q) { ["c", "d", "o", "ap"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
})();
