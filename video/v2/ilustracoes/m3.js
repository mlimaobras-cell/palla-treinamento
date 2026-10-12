// Ilustrações do Módulo 3 (montagem, içamento e rigging). Conteúdo: Caderno do Módulo 3, revisão 2.
(function () {
  const { C, pessoa, isolamento, viga, caibro, carreta, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 560;
  const gancho = (k) => `<g data-k="${k}"><line x1="0" y1="-700" x2="0" y2="-40" stroke="${C.cabo}" stroke-width="5"/><rect x="-24" y="-46" width="48" height="32" rx="6" fill="${C.cabo}"/><path d="M0 -14v10a13 13 0 1 1 -13 13" fill="none" stroke="${C.cabo}" stroke-width="7" stroke-linecap="round"/></g>`;

  // ------------------------------------------------------------ 3.1 Antes da primeira carga
  D.preparacao = {
    svg: (u) => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="brita"><rect x="30" y="${CHAO}" width="540" height="22" fill="url(#brita-${u})"/></g>
      ${isolamento("isol", 30, 570, CHAO)}
      <g data-k="almox"><rect x="600" y="${CHAO - 110}" width="190" height="110" rx="4" fill="#7C86AE" stroke="${C.escuro}" stroke-width="3"/>
        <path d="M600 ${CHAO - 80}h190M600 ${CHAO - 50}h190M600 ${CHAO - 20}h190" stroke="#6A7399" stroke-width="2"/>
        <rect x="610" y="${CHAO - 138}" width="170" height="26" rx="4" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${rotulo("", 695, CHAO - 118, "ALMOXARIFADO", { anc: "middle", tam: 18 })}
        <rect x="560" y="${CHAO - 190}" width="10" height="190" fill="${C.cinza}"/><path d="M548 ${CHAO - 168}l12 -24l-2 16h12l-12 24l2 -16z" fill="${C.amarelo}" stroke="${C.escuro}" stroke-width="2"/></g>
      <g data-k="placa"><rect x="40" y="${CHAO - 210}" width="8" height="140" fill="${C.cinza}"/><rect x="20" y="${CHAO - 248}" width="180" height="44" rx="4" fill="${C.amarelo}" stroke="${C.escuro}" stroke-width="3"/>
        ${rotulo("", 110, CHAO - 218, "ÁREA DE DESCARGA", { anc: "middle", tam: 18 })}</g>
      <g data-k="docs">${["Romaneio", "Nota fiscal", "Pedido"].map((t, i) => `<g transform="translate(${60 + i * 130} 90)"><rect width="112" height="130" rx="6" fill="#fff" stroke="${C.escuro}" stroke-width="3"/><path d="M14 34h84M14 54h84M14 74h84M14 94h60" stroke="${C.linha ?? "#D9DCE8"}" stroke-width="5"/>${rotulo("", 56, 22, t, { anc: "middle", tam: 18 })}</g>`).join("")}
        ${ok("docsOk", 445, 100)}</g>
      <g data-k="planos">${["Plano de montagem", "Plano de içamento", "Integração · APR · PT"].map((t, i) => `<g transform="translate(${490 + (i % 2) * 0} ${70 + i * 52})"><rect width="300" height="42" rx="6" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${rotulo("", 16, 28, t, { tam: 20 })}</g>`).join("")}
        ${ok("planosOk", 790, 76, 18)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("brita"), P(t, m.a)); vis(q("isol"), P(t, m.a + .8)); 
      vis(q("almox"), P(t, m.b)); vis(q("placa"), P(t, m.c));
      vis(q("docs"), P(t, m.d)); vis(q("docsOk"), P(t, m.d + 1.5)); vis(q("planos"), P(t, m.e)); vis(q("planosOk"), P(t, m.e + 2));
    },
  };

  // ------------------------------------------------------------ 3.1 Descarga passo a passo
  const VX = 70, VC = 420, TOPO_CARRETA = CHAO - 78;
  D.descarga = {
    svg: (u) => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <rect data-k="zona" x="40" y="${CHAO + 2}" width="480" height="18" fill="url(#hach-${u})" opacity="0"/>
      ${isolamento("isol", 10, 800, CHAO)}
      ${carreta("carreta", 30, CHAO)}
      ${viga("v3", VX, TOPO_CARRETA - 30, VC, 30)}${viga("v2", VX, TOPO_CARRETA - 60, VC, 30)}
      <g data-k="carga">
        ${viga("v1", 0, 0, VC, 30, { marca: "V-12" })}
        <g data-k="cintas">${[90, 330].map((x) => `<rect x="${x - 8}" y="-6" width="16" height="42" rx="3" fill="${C.ambar}"/><rect x="${x - 14}" y="-8" width="10" height="10" fill="#222"/><rect x="${x + 4}" y="-8" width="10" height="10" fill="#222"/>`).join("")}</g>
        <g data-k="calcoTxt">${rotulo("", 90, -26, "calço de borracha", { anc: "middle", tam: 20, cor: C.cinza })}</g>
        <g data-k="balancim"><rect x="70" y="-150" width="280" height="18" rx="3" fill="${C.cabo}"/>
          <line x1="90" y1="-132" x2="90" y2="-4" stroke="${C.ambar}" stroke-width="9"/><line x1="330" y1="-132" x2="330" y2="-4" stroke="${C.ambar}" stroke-width="9"/>
          <line x1="210" y1="-236" x2="90" y2="-150" stroke="${C.cabo}" stroke-width="6"/><line x1="210" y1="-236" x2="330" y2="-150" stroke="${C.cabo}" stroke-width="6"/>
          ${rotulo("", 370, -136, "balancim", { tam: 22, cor: C.escuro })}</g>
        <g data-k="cota"><path d="M0 52v-12M${VC} 52v-12M0 46H${VC}" stroke="${C.vermelho}" stroke-width="3"/>${rotulo("", VC / 2, 76, "acima de 6 m", { anc: "middle", cor: C.vermelho })}</g>
      </g>
      <g data-k="gancho">${gancho("")}</g>
      ${pessoa("fotografo", 770, CHAO, { pose: "foto", flip: true })}
      <circle data-k="flash" cx="728" cy="${CHAO - 100}" r="26" fill="#fff8c4" opacity="0"/>
      ${pessoa("guia", 770, CHAO, { pose: "guia", colete: C.verde })}
      <path data-k="corda" fill="none" stroke="${C.madeiraE}" stroke-width="4"/>
      ${rotulo("corTxt", 640, 240, "corda-guia", { cor: C.madeiraE })}`,
    quadro(raiz, t, m, c, q) {
      // vistoria com fotos (pessoa fora da área), isolamento, amarração com calço, balancim e içamento, corda-guia
      vis(q("fotografo"), P(t, m.v) * (1 - P(t, m.g)));
      vis(q("flash"), Math.max(pisca(t, m.v + .8, m.v + 1.3), pisca(t, m.v + 2.2, m.v + 2.7)));
      vis(q("isol"), P(t, m.i)); vis(q("zona"), P(t, m.b + 1.6));
      vis(q("cintas"), P(t, m.m)); vis(q("calcoTxt"), P(t, m.m + .8) * (1 - P(t, m.b)));
      vis(q("balancim"), P(t, m.b)); vis(q("cota"), P(t, m.b + .3) * (1 - P(t, m.g + 1)));
      const sobe = P(t, m.b + 1.2, 3);
      const y = lerp(TOPO_CARRETA - 90, 250, sobe), x = lerp(VX, 70, sobe);
      pos(q("carga"), x, y);
      // gancho sempre sobre o centro do balancim (x+210), descendo antes da amarração
      const gy = P(t, m.b) > 0 ? y - 236 : lerp(-60, y - 236, P(t, m.i + 1, 1.6));
      pos(q("gancho"), x + 210, gy + 9); vis(q("gancho"), P(t, m.i + .6));
      vis(q("guia"), P(t, m.g)); vis(q("corda"), P(t, m.g)); vis(q("corTxt"), P(t, m.g));
      q("corda").setAttribute("d", `M${x + VC} ${y + 15} Q ${700} ${y + 120} ${742} ${CHAO - 70}`);
      q("corTxt").setAttribute("y", y + 70);
    },
  };

  // ------------------------------------------------------------ 3.1 Conferência com o romaneio
  const LINHAS = [["P-01", "Pilar", "ok"], ["P-02", "Pilar", "ok"], ["V-12", "Viga", "ok"], ["V-14", "Viga", "dano"], ["T-03", "Terça", "ok"], ["CX-1", "Parafusos", "ok"]];
  D.romaneio = {
    svg: () => `<line x1="0" y1="${CHAO}" x2="430" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      ${caibro(60, CHAO, 60)}${caibro(320, CHAO, 60)}
      ${viga("pecaOk", 30, CHAO - 14 - 34, 380, 34, { marca: "V-12" })}${viga("pecaDano", 30, CHAO - 14 - 76, 380, 34, { marca: "V-14" })}
      <g data-k="amassado"><path d="M300 ${CHAO - 90}q16 14 34 0" fill="none" stroke="${C.vermelho}" stroke-width="5"/><circle cx="317" cy="${CHAO - 74}" r="34" fill="none" stroke="${C.vermelho}" stroke-width="5"/></g>
      <circle data-k="flash" cx="317" cy="${CHAO - 74}" r="60" fill="#fff8c4" opacity="0"/>
      <g transform="translate(450 70)"><rect width="350" height="470" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>
        <rect width="350" height="56" rx="10" fill="${C.escuro}"/>${rotulo("", 175, 38, "ROMANEIO", { anc: "middle", cor: "#fff", tam: 26 })}
        ${LINHAS.map(([cod, nome, st], i) => `<g transform="translate(18 ${84 + i * 52})">${rotulo("", 0, 22, cod, { tam: 22 })}${rotulo("", 90, 22, nome, { tam: 22, cor: C.cinza })}
          <g data-k="l${i}">${st === "ok" ? ok("", 290, 12, 15) : xis("", 290, 12, 15)}</g></g>`).join("")}
        <g data-k="assin"><path d="M24 420c20 -30 34 10 50 -6s26 -24 40 0 30 8 44 -10" fill="none" stroke="${C.azul}" stroke-width="4"/>${rotulo("", 24, 450, "assinatura do motorista", { tam: 18, cor: C.cinza })}</g>
      </g>
      <g data-k="rnc"><rect x="-80" y="-34" width="160" height="64" rx="6" fill="#fff" stroke="${C.vermelho}" stroke-width="5"/>${rotulo("", 0, 12, "RNC", { anc: "middle", cor: C.vermelho, tam: 38 })}</g>`,
    quadro(raiz, t, m, c, q) {
      LINHAS.forEach((_, i) => vis(q(`l${i}`), P(t, m.c + .8 + i * .55)));
      vis(q("pecaDano"), 1); vis(q("amassado"), P(t, m.o + .4) * (.6 + .4 * Math.sin(t * 6) ** 2));
      vis(q("assin"), P(t, m.d + .6, 1.2)); vis(q("flash"), Math.max(pisca(t, m.f + .2, m.f + .7), 0));
      const r = P(t, m.r, .4); vis(q("rnc"), r); q("rnc").setAttribute("transform", `translate(210 330) rotate(-10) scale(${lerp(1.6, 1, r)})`);
    },
  };

  // ------------------------------------------------------------ 3.1 Erro: alguém sob a carga
  D.erroSobCarga = {
    svg: (u) => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <rect x="120" y="${CHAO + 2}" width="420" height="18" fill="url(#hach-${u})"/>
      <g transform="translate(330 120)">${gancho("")}</g>
      <line x1="330" y1="129" x2="190" y2="290" stroke="${C.ambar}" stroke-width="9"/><line x1="330" y1="129" x2="470" y2="290" stroke="${C.ambar}" stroke-width="9"/>
      ${viga("", 140, 290, 380, 32)}
      ${pessoa("errado", 330, CHAO, { pose: "carrega", colete: C.vermelho })}
      ${xis("x", 330, 380, 30)}
      <g data-k="perigo">${rotulo("", 580, 330, "sem tempo", { cor: C.vermelho, tam: 26 })}${rotulo("", 580, 362, "de sair", { cor: C.vermelho, tam: 26 })}<path d="M560 300v120" stroke="${C.vermelho}" stroke-width="6" marker-end="url(#pv-${u})"/></g>
      ${pessoa("certo", 740, CHAO, { pose: "guia", colete: C.verde })}
      <path data-k="corda" d="M520 306 Q 640 420 712 490" fill="none" stroke="${C.madeiraE}" stroke-width="4"/>
      ${ok("v", 740, 360, 28)}`,
    quadro(raiz, t, m, c, q) {
      const sai = P(t, m.k + .4, 1.6);
      vis(q("errado"), 1 - sai); vis(q("x"), P(t, m.e + 1) * (1 - sai));
      vis(q("perigo"), P(t, m.c) * (1 - sai));
      vis(q("certo"), sai); vis(q("corda"), sai); vis(q("v"), P(t, m.k + 2));
    },
  };

  // ------------------------------------------------------------ 3.2 Armazenagem: pilares e vigas (vista de topo da seção)
  const pilhaCerta = (x0, chao, linhas, colunas) => {
    let g = `${caibro(x0 - 10, chao, 70 * colunas + 20)}`;
    for (let l = 0; l < linhas; l++) for (let k = 0; k < colunas; k++) g += B.perfilI(x0 + 35 + k * 70, chao - 14 - 31 - l * 66, {});
    for (let l = 1; l < linhas; l++) g += caibro(x0 - 10, chao - 14 - l * 66 + 2, 70 * colunas + 20, 8);
    return g;
  };
  D.armazenagemVigas = {
    svg: (u) => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="caibros">${caibro(110, CHAO, 300)}</g>
      <g data-k="pilha">${pilhaCerta(120, CHAO, 3, 4)}</g>
      <g data-k="alma">${rotulo("", 120, CHAO - 290, "alma em pé (90° com o solo)", { cor: C.azul })}<path d="M155 ${CHAO - 280}v40" stroke="${C.azul}" stroke-width="4" marker-end="url(#pa-${u})"/></g>
      <g data-k="gotas">${[0, 1, 2, 3].map((i) => `<path data-k="g${i}" d="M0 0q-6 10 0 14q6 -4 0 -14z" fill="#5AA9E6"/>`).join("")}</g>
      <g data-k="cota"><path d="M470 ${CHAO}v-200M455 ${CHAO}h30M455 ${CHAO - 200}h30" stroke="${C.vermelho}" stroke-width="4"/>${rotulo("", 495, CHAO - 92, "máx. 2 m", { cor: C.vermelho, tam: 28 })}</g>
      <g data-k="corredor"><path d="M600 ${CHAO - 6}h200" stroke="${C.verde}" stroke-width="6" stroke-dasharray="14 10"/>${rotulo("", 700, CHAO - 24, "corredor livre", { anc: "middle", cor: C.verde })}
        ${pessoa("", 700, CHAO - 40, { esc: .7 })}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("caibros"), P(t, m.c)); vis(q("pilha"), P(t, m.c + .6));
      vis(q("alma"), P(t, m.a)); vis(q("cota"), P(t, m.h)); vis(q("corredor"), P(t, m.e));
      // gotas escorrendo pelos lados da mesa (não acumulam)
      [0, 1, 2, 3].forEach((i) => { const ph = ((t - m.a - i * .35) % 1.6) / 1.6; const g = q(`g${i}`);
        vis(g, t > m.a ? 1 : 0); B.pos(g, 132 + i * 70, CHAO - 238 + Math.max(0, ph) * 60); });
    },
  };

  // ------------------------------------------------------------ 3.2 Cada material no seu lugar (6 quadros)
  const quadroMat = (k, i, titulo, conteudo) => { const x = (i % 2) * 410, y = Math.floor(i / 2) * 200;
    return `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="6" y="6" width="396" height="186" rx="10" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>${rotulo("", 22, 40, titulo, { tam: 22 })}${conteudo}</g>`; };
  D.armazenagemOutros = {
    svg: () => [
      quadroMat("t", 0, "Telhas e painéis", `<path d="M40 160l300 -40v14l-300 40z" fill="${C.aco}"/><path d="M30 150l320 -44" stroke="#2E7D5B" stroke-width="10" opacity=".7"/>${caibro(60, 176, 30)}${caibro(170, 162, 30)}${caibro(280, 148, 30)}${rotulo("", 210, 80, "lona · inclinação · calço ≤ 2 m", { anc: "middle", tam: 18, cor: C.cinza })}`),
      quadroMat("k", 1, "Calhas, rufos, arremates", `${caibro(40, 176, 200)}${[0, 1, 2].map((l) => `<path d="M50 ${150 - l * 22}h180v-14h-180z" fill="${C.aco}"/>`).join("")}<path d="M290 176v-95M280 176h20M280 81h20" stroke="${C.vermelho}" stroke-width="3"/>${rotulo("", 300, 132, "≤ 1,5 m", { tam: 20, cor: C.vermelho })}`),
      quadroMat("m", 2, "Manta isolante", `<rect x="40" y="70" width="320" height="10" fill="${C.cinza}"/><path d="M40 70l160 -26l160 26" fill="none" stroke="${C.cinza}" stroke-width="5"/>${[0, 1, 2].map((r) => `<rect x="${70 + r * 90}" y="120" width="70" height="44" rx="20" fill="#E9D9B5" stroke="${C.madeiraE}" stroke-width="2"/>`).join("")}<rect x="60" y="164" width="290" height="12" fill="${C.madeira}"/>${rotulo("", 210, 112, "seco · coberto · fora do chão", { anc: "middle", tam: 18, cor: C.cinza })}`),
      quadroMat("p", 3, "Parafusos e selantes", `<rect x="60" y="66" width="280" height="110" rx="4" fill="#7C86AE"/>${[0, 1, 2, 3].map((b) => `<rect x="${80 + b * 62}" y="120" width="50" height="40" rx="3" fill="${C.ambar}"/>`).join("")}<rect x="250" y="76" width="70" height="26" rx="3" fill="#fff"/>${rotulo("", 285, 95, "restrito", { anc: "middle", tam: 16 })}`),
      quadroMat("s", 4, "Tintas e solventes", `${[0, 1, 2].map((b) => `<rect x="${60 + b * 60}" y="110" width="44" height="60" rx="4" fill="${C.azul}"/><rect x="${66 + b * 60}" y="104" width="32" height="8" fill="${C.cabo}"/>`).join("")}<path d="M250 80c10 20 -10 30 0 50" stroke="#9AA0B8" stroke-width="4" fill="none"/><path d="M280 80c10 20 -10 30 0 50" stroke="#9AA0B8" stroke-width="4" fill="none"/>
        <g transform="translate(330 140)"><circle r="26" fill="#fff" stroke="${C.vermelho}" stroke-width="5"/><path d="M-6 10c-10 -8 0 -18 4 -26c4 10 12 14 6 26z" fill="${C.ambar}"/><path d="M-18 -18l36 36" stroke="${C.vermelho}" stroke-width="5"/></g>`),
      quadroMat("d", 5, "Peças danificadas", `${viga("", 50, 120, 230, 28)}<path d="M180 120q14 12 30 0" fill="none" stroke="${C.vermelho}" stroke-width="4"/><g transform="translate(300 96)"><rect width="76" height="44" rx="4" fill="${C.vermelho}"/>${rotulo("", 38, 29, "SEPARADA", { anc: "middle", tam: 13, cor: "#fff" })}</g>`),
    ].join(""),
    quadro(raiz, t, m, c, q) { ["t", "k", "m", "p", "s", "d"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 3.2 Movimentação manual
  D.manual = {
    svg: () => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="dupla">${pessoa("", 200, CHAO, { pose: "carrega", colete: C.verde })}${pessoa("", 520, CHAO, { pose: "carrega", colete: C.verde })}
        <rect x="150" y="${CHAO - 150}" width="420" height="16" rx="3" fill="${C.aco}"/>${rotulo("", 360, CHAO - 166, "terça longa: em dupla", { anc: "middle" })}</g>
      <g data-k="postura">${pessoa("", 640, CHAO, { agacha: true, pose: "neutro" })}<rect x="610" y="${CHAO - 30}" width="60" height="30" rx="3" fill="${C.ambar}"/>
        <path d="M660 ${CHAO - 108}v52" stroke="${C.verde}" stroke-width="4" stroke-dasharray="6 5"/>${rotulo("", 680, CHAO - 120, "costas retas", { cor: C.verde, tam: 20 })}${rotulo("", 680, CHAO - 50, "joelhos", { cor: C.verde, tam: 20 })}</g>
      <g data-k="arrasta">${viga("", 60, CHAO - 60, 220, 22)}<path d="M60 ${CHAO - 38}l-30 38" stroke="${C.aco}" stroke-width="22"/>${xis("", 170, CHAO - 100, 24)}${rotulo("", 170, CHAO - 136, "nunca arrastar", { anc: "middle", cor: C.vermelho })}</g>
      <g data-k="sesmt" transform="translate(410 120)"><rect x="-230" y="-40" width="460" height="70" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${rotulo("", 0, 4, "Peso por pessoa: limite do SESMT", { anc: "middle", tam: 24 })}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("dupla"), P(t, m.d) * (1 - P(t, m.a - .2)));
      vis(q("postura"), P(t, m.p));
      vis(q("arrasta"), P(t, m.a)); vis(q("sesmt"), P(t, m.l));
    },
  };

  // ------------------------------------------------------------ 3.2 O que está errado nesta pilha?
  D.pilhaErrada = {
    svg: (u) => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <ellipse data-k="poca" cx="240" cy="${CHAO + 4}" rx="190" ry="10" fill="#5AA9E6" opacity=".6"/>
      ${[0, 1, 2, 3].map((l) => [0, 1, 2, 3].map((k) => B.perfilI(110 + k * 84, CHAO - 26 - l * 54, { emPe: false })).join("")).join("")}
      ${[0, 1, 2, 3].map((k) => `<path d="M${84 + k * 84} ${CHAO - 230}h52v8h-52z" fill="#5AA9E6" opacity=".7"/>`).join("")}
      <path d="M520 ${CHAO}v-240M505 ${CHAO}h30M505 ${CHAO - 240}h30" stroke="${C.cinza}" stroke-width="3"/>${rotulo("", 545, CHAO - 120, "2,4 m", { tam: 26, cor: C.cinza })}
      ${num("e1", 80, CHAO - 20, 1)}${num("e2", 470, CHAO - 150, 2)}${num("e3", 600, CHAO - 240, 3)}
      ${rotulo("t1", 20, CHAO - 270, "1 · direto no chão", { cor: C.vermelho })}${rotulo("t2", 470, 230, "alma deitada: junta água", { anc: "middle", cor: C.vermelho })}${rotulo("t3", 625, CHAO - 232, "acima de 2 m", { cor: C.vermelho })}
      <g data-k="certo" transform="translate(600 0)">${caibro(0, CHAO, 200)}${[0, 1, 2].map((k) => B.perfilI(35 + k * 66, CHAO - 45, {})).join("")}${ok("", 100, CHAO - 120, 26)}</g>`,
    quadro(raiz, t, m, c, q) {
      ["e1", "t1"].forEach((k) => vis(q(k), P(t, m.r1))); ["e2", "t2"].forEach((k) => vis(q(k), P(t, m.r2))); ["e3", "t3"].forEach((k) => vis(q(k), P(t, m.r3) * (1 - P(t, m.r4))));
      vis(q("certo"), P(t, m.r4));
    },
  };

  // ------------------------------------------------------------ 3.3 Equipamentos de içamento (silhuetas)
  const silhueta = {
    g: `<rect x="-90" y="-60" width="180" height="34" rx="6" fill="${C.amarelo}"/>${[-60, 0, 60].map((x) => `<circle cx="${x}" cy="-18" r="16" fill="#2B2F45"/>`).join("")}<rect x="-30" y="-92" width="60" height="34" rx="4" fill="${C.amarelo}"/><path d="M0 -80l120 -110" stroke="${C.amarelo}" stroke-width="14" stroke-linecap="round"/><path d="M120 -190v80" stroke="${C.cabo}" stroke-width="3"/>`,
    m: `<rect x="-100" y="-58" width="200" height="22" fill="#5C6380"/><rect x="40" y="-96" width="62" height="56" rx="6" fill="${C.azul}"/>${[-70, -30, 70].map((x) => `<circle cx="${x}" cy="-18" r="16" fill="#2B2F45"/>`).join("")}<path d="M0 -60l-30 -90l-80 20" stroke="${C.amarelo}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M-110 -130v50" stroke="${C.cabo}" stroke-width="3"/>`,
    r: `<path d="M-14 0v-240h28v240" fill="none" stroke="${C.amarelo}" stroke-width="6"/><path d="M-14 -40l28 -30M-14 -100l28 -30M-14 -160l28 -30" stroke="${C.amarelo}" stroke-width="3"/><path d="M-60 -240h220" stroke="${C.amarelo}" stroke-width="10"/><path d="M130 -240v90" stroke="${C.cabo}" stroke-width="3"/><rect x="-70" y="-252" width="30" height="30" fill="${C.cinza}"/>`,
    t: `<rect x="-80" y="-56" width="160" height="34" rx="8" fill="${C.ambar}"/>${[-50, 50].map((x) => `<circle cx="${x}" cy="-18" r="20" fill="#2B2F45"/>`).join("")}<rect x="-20" y="-96" width="50" height="42" rx="4" fill="${C.ambar}"/><path d="M-60 -50l170 -80" stroke="${C.ambar}" stroke-width="14" stroke-linecap="round"/><path d="M110 -130h30M110 -130v-14" stroke="${C.cabo}" stroke-width="5"/>`,
  };
  D.equipamentos = {
    svg: () => [["g", "Guindaste", 150, 300], ["m", "Guindauto (munck)", 560, 300], ["r", "Grua", 150, 540], ["t", "Manipulador telescópico", 560, 540]]
      .map(([k, nome, x, y]) => `<g data-k="${k}" transform="translate(${x} ${y - 30})">${silhueta[k]}${rotulo("", 0, 26, nome, { anc: "middle", tam: 22 })}</g>`).join(""),
    quadro(raiz, t, m, c, q) { ["g", "m", "r", "t"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 3.3 O raio muda a capacidade
  const TAB = [["menor", 1], ["", .78], ["", .6], ["", .46], ["maior", .35]];
  D.raio = {
    svg: (u) => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      ${B.guindaste("gr", 170, CHAO, { comp: 430 })}
      <g data-k="peca"><line x1="60" y1="-34" x2="15" y2="0" stroke="${C.ambar}" stroke-width="6"/><line x1="60" y1="-34" x2="105" y2="0" stroke="${C.ambar}" stroke-width="6"/>${viga("", 0, 0, 120, 26)}</g>
      <g data-k="raio"><line data-k="rl" stroke="${C.vermelho}" stroke-width="4"/><line data-k="r0" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="6 6"/><line data-k="r1" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="6 6"/>${rotulo("rt", 0, 0, "raio", { anc: "middle", cor: C.vermelho, tam: 26 })}</g>
      <g data-k="tab" transform="translate(560 40)"><rect width="250" height="250" rx="8" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${rotulo("", 125, 30, "Tabela de carga", { anc: "middle", tam: 20 })}
        ${rotulo("", 18, 58, "raio", { tam: 16, cor: C.cinza })}${rotulo("", 110, 58, "capacidade", { tam: 16, cor: C.cinza })}
        ${TAB.map(([r, f], i) => `<g transform="translate(0 ${74 + i * 32})"><rect data-k="hl${i}" x="6" y="-4" width="238" height="28" rx="4" fill="#FCE4E6" opacity="0"/>${rotulo("", 18, 18, r || "·", { tam: 16, cor: C.cinza })}<rect x="110" y="2" width="${120 * f}" height="16" rx="3" fill="${C.azul}"/></g>`).join("")}
        ${rotulo("", 125, 238, "valores: tabela do fabricante", { anc: "middle", tam: 14, cor: C.cinza })}</g>`,
    quadro(raiz, t, m, c, q) {
      const ang = lerp(68, 34, P(t, m.l, 3));
      const ponta = CHAO - 106 - 430 * Math.sin(rad(ang));
      const pt = B.poseGuindaste(q, "gr", 170, CHAO, ang, 430, 300 - ponta);   // carga sempre na mesma altura
      pos(q("peca"), pt.x - 60, pt.y + 34);
      vis(q("raio"), P(t, m.r));
      const yr = CHAO + 16, xc = 170;
      const set = (k, a) => Object.entries(a).forEach(([n, v]) => q(k).setAttribute(n, v));
      set("rl", { x1: xc, y1: yr, x2: pt.x, y2: yr }); set("r0", { x1: xc, y1: CHAO - 106, x2: xc, y2: yr + 8 }); set("r1", { x1: pt.x, y1: pt.y, x2: pt.x, y2: yr + 8 });
      q("rt").setAttribute("x", pt.x + 16); q("rt").setAttribute("y", yr + 8); q("rt").setAttribute("text-anchor", "start");
      vis(q("tab"), P(t, m.c - .4));
      const linha = Math.round(lerp(0, 4, P(t, m.l, 3)));
      TAB.forEach((_, i) => vis(q(`hl${i}`), t > m.c - .4 && i === linha ? 1 : 0));
    },
  };

  // ------------------------------------------------------------ 3.3 O plano responde a 5 perguntas
  D.plano = {
    svg: () => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <rect x="0" y="${CHAO}" width="820" height="40" fill="#D8C7A5" opacity=".6"/>
      ${B.guindaste("gp", 200, CHAO, { comp: 420 })}
      <g data-k="peca"><line x1="0" y1="-60" x2="-50" y2="0" stroke="${C.ambar}" stroke-width="7"/><line x1="0" y1="-60" x2="50" y2="0" stroke="${C.ambar}" stroke-width="7"/>${viga("", -90, 0, 180, 28)}</g>
      ${num("q1", 0, 0, 1)}${num("q2", 0, 0, 2)}${num("q3", 0, 0, 3)}${num("q4", 0, 0, 4)}${num("q5", 70, CHAO - 50, 5)}
      <line data-k="raioL" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="8 6"/>`,
    quadro(raiz, t, m, c, q) {
      const pt = B.poseGuindaste(q, "gp", 200, CHAO, 52, 420, 120);
      pos(q("peca"), pt.x, pt.y + 54);
      pos(q("q1"), pt.x + 120, pt.y + 70); pos(q("q2"), (200 + pt.x) / 2, CHAO - 14); pos(q("q3"), 200 + 150, CHAO - 106 - 190); pos(q("q4"), pt.x - 70, pt.y + 26);
      ["q1", "q2", "q3", "q4", "q5"].forEach((k) => vis(q(k), P(t, m[k])));
      const r = q("raioL"); r.setAttribute("x1", 200); r.setAttribute("x2", pt.x); r.setAttribute("y1", CHAO - 14); r.setAttribute("y2", CHAO - 14); vis(r, P(t, m.q2));
    },
  };

  // ------------------------------------------------------------ 3.3 Taxa de utilização (medidor sem limites inventados)
  D.taxa = {
    svg: () => `<g transform="translate(410 380)">
      <path d="M-260 0a260 260 0 0 1 520 0" fill="none" stroke="#E3E5EE" stroke-width="44"/>
      <path data-k="arcoT" d="M-260 0a260 260 0 0 1 520 0" fill="none" stroke="${C.azul}" stroke-width="44" stroke-dasharray="817" stroke-dashoffset="817"/>
      ${rotulo("", -260, 52, "0%", { anc: "middle", tam: 26, cor: C.cinza })}${rotulo("", 260, 52, "100%", { anc: "middle", tam: 26, cor: C.cinza })}
      <g data-k="ponteiro"><line x1="0" y1="0" x2="-220" y2="0" stroke="${C.escuro}" stroke-width="8" stroke-linecap="round"/><circle r="16" fill="${C.escuro}"/></g>
      <text data-k="pct" y="-120" text-anchor="middle" font-family="Chakra Petch" font-weight="700" font-size="84" fill="${C.escuro}"></text>
      ${rotulo("form", 0, 120, "carga total ÷ capacidade no raio", { anc: "middle", tam: 28 })}
      ${rotulo("crit", 0, 166, "mais perto de 100% = mais crítico", { anc: "middle", tam: 26, cor: C.vermelho })}</g>`,
    quadro(raiz, t, m, c, q) {
      const v = .75 * P(t, m.e, 2.2);
      q("arcoT").setAttribute("stroke-dashoffset", 817 * (1 - v)); q("arcoT").setAttribute("stroke", v > .7 ? C.ambar : C.azul);
      q("ponteiro").setAttribute("transform", `rotate(${180 * v})`);
      q("pct").textContent = `${Math.round(v * 100)}%`; vis(q("pct"), P(t, m.e));
      vis(q("form"), P(t, m.f)); vis(q("crit"), P(t, m.c));
    },
  };

  // ------------------------------------------------------------ 3.3 Erro: guindaste mais longe que o plano
  D.erroRaio = {
    svg: () => `<line x1="0" y1="${CHAO}" x2="820" y2="${CHAO}" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="plan" opacity=".35">${B.guindaste("gf", 260, CHAO, { comp: 420 })}</g>
      ${B.guindaste("gr", 260, CHAO, { comp: 420 })}
      <g data-k="peca">${viga("", -70, 0, 140, 26)}</g>
      ${rotulo("lp", 260, 110, "posição do plano", { anc: "middle", tam: 20, cor: C.cinza })}
      <g data-k="barra" transform="translate(560 60)"><rect width="240" height="110" rx="8" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${rotulo("", 16, 32, "capacidade na tabela", { tam: 18, cor: C.cinza })}<rect data-k="cap" x="16" y="52" height="28" rx="4" fill="${C.azul}"/></g>
      <g data-k="pare" transform="translate(680 300)"><polygon points="-30,-72 30,-72 72,-30 72,30 30,72 -30,72 -72,30 -72,-30" fill="${C.vermelho}" stroke="#fff" stroke-width="6"/>${rotulo("", 0, 12, "PARE", { anc: "middle", cor: "#fff", tam: 36 })}</g>`,
    quadro(raiz, t, m, c, q) {
      B.poseGuindaste(q, "gf", 260, CHAO, 56, 420, 0);
      const d = P(t, m.e, 2.4), x = lerp(260, 120, d);
      q("gr").setAttribute("transform", `translate(${x} ${CHAO})`);
      const ang = lerp(56, 38, d), ponta = CHAO - 106 - 420 * Math.sin(rad(ang));
      const pt = B.poseGuindaste(q, "gr", x, CHAO, ang, 420, 330 - ponta);
      pos(q("peca"), pt.x, pt.y + 4);
      vis(q("plan"), d > .05 ? .35 : 0); vis(q("lp"), d > .3 ? 1 : 0);
      const w = lerp(200, 110, P(t, m.c, 1.2)); q("cap").setAttribute("width", w); q("cap").setAttribute("fill", t > m.c + .6 ? C.vermelho : C.azul);
      vis(q("pare"), P(t, m.k, .4));
    },
  };

  // ------------------------------------------------------------ 3.5 Acessórios
  const ICO = {
    cinta: `<path d="M-20 -60v120h40v-120" fill="none" stroke="#E8C21E" stroke-width="16"/><rect x="-18" y="-10" width="36" height="22" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>`,
    cabo: `<path d="M-6 -70c-30 30 30 50 0 80s30 50 0 70" fill="none" stroke="#8890A8" stroke-width="12"/><path d="M-6 -70c-30 30 30 50 0 80s30 50 0 70" fill="none" stroke="#5B6178" stroke-width="3" stroke-dasharray="6 6"/>`,
    corrente: [0, 1, 2, 3].map((i) => `<rect x="-14" y="${-70 + i * 34}" width="28" height="44" rx="14" fill="none" stroke="#5B6178" stroke-width="7" transform="rotate(${i % 2 ? 0 : 0})"/>`).join("") + `<rect x="14" y="44" width="34" height="24" rx="3" fill="${C.amarelo}" stroke="${C.escuro}" stroke-width="2"/>`,
    manilha: `<path d="M-30 30v-50a30 30 0 0 1 60 0v50" fill="none" stroke="#5B6178" stroke-width="14"/><rect x="-46" y="26" width="92" height="14" rx="6" fill="${C.cabo}"/><circle cx="-46" cy="33" r="10" fill="${C.cabo}"/>`,
    gancho: `<rect x="-20" y="-80" width="40" height="34" rx="6" fill="${C.cabo}"/><path d="M0 -46v40a34 34 0 1 1 -34 34" fill="none" stroke="${C.cabo}" stroke-width="12" stroke-linecap="round"/><path d="M-34 28l26 -30" stroke="${C.amarelo}" stroke-width="5"/>`,
    balancim: `<rect x="-90" y="-10" width="180" height="20" rx="4" fill="${C.cabo}"/><path d="M0 -70l-80 60M0 -70l80 60" stroke="${C.cabo}" stroke-width="5"/><path d="M-80 10v50M80 10v50" stroke="#E8C21E" stroke-width="8"/>`,
  };
  const grade6 = (lista) => lista.map(([k, nome, i], n) => { const x = 210 + (n % 3) * 380, y = 140 + Math.floor(n / 3) * 270;
    return `<g data-k="${k}" transform="translate(${x} ${y})"><g transform="scale(1.35)">${ICO[i]}</g>${rotulo("", 0, 148, nome, { anc: "middle", tam: 28 })}</g>`; }).join("");
  D.acessorios = {
    largo: true,
    svg: () => grade6([["c", "Cinta de poliéster", "cinta"], ["a", "Cabo de aço", "cabo"], ["r", "Corrente", "corrente"], ["m", "Manilha", "manilha"], ["g", "Gancho com trava", "gancho"], ["b", "Balancim", "balancim"]]),
    quadro(raiz, t, m, c, q) { ["c", "a", "r", "m", "g", "b"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  D.eloFraco = {
    svg: () => `<g transform="translate(250 0)">
      <line x1="0" y1="0" x2="0" y2="90" stroke="${C.cabo}" stroke-width="5"/>
      <g transform="translate(0 150) scale(.8)">${ICO.gancho}</g>
      <g transform="translate(0 270) scale(.7)">${ICO.manilha}</g>
      <path d="M-40 300v130h80v-130" fill="none" stroke="#E8C21E" stroke-width="14"/>
      ${viga("", -170, 430, 340, 34)}</g>
      ${[["gancho", 150, .95], ["manilha", 270, .55], ["cinta", 360, .8]].map(([n, y, f]) => `<g data-k="b-${n}" transform="translate(400 ${y})">${rotulo("", 0, -10, n, { tam: 22 })}<rect y="0" width="${300 * f}" height="26" rx="4" fill="${n === "manilha" ? C.vermelho : C.azul}"/></g>`).join("")}
      <line data-k="limite" x1="${400 + 300 * .55}" y1="110" x2="${400 + 300 * .55}" y2="420" stroke="${C.vermelho}" stroke-width="4" stroke-dasharray="10 8"/>
      ${rotulo("limTxt", 400 + 300 * .55 + 12, 450, "limite do conjunto", { cor: C.vermelho })}
      ${rotulo("etq", 400, 80, "capacidade marcada em cada peça", { tam: 22, cor: C.cinza })}`,
    quadro(raiz, t, m, c, q) {
      vis(q("etq"), P(t, m.i)); ["gancho", "manilha", "cinta"].forEach((n, i) => vis(q(`b-${n}`), P(t, m.f + i * .3)));
      vis(q("limite"), P(t, m.e)); vis(q("limTxt"), P(t, m.e + .3));
    },
  };

  D.cintaUso = {
    largo: true,
    svg: () => [["v", "Vertical", "100%", `<path d="M0 -150v150" stroke="#E8C21E" stroke-width="16"/>`],
      ["e", "Enforcada", "≈ 80%", `<path d="M0 -150v120" stroke="#E8C21E" stroke-width="16"/><path d="M-50 -30q50 -30 50 0q0 30 -50 0" fill="none" stroke="#E8C21E" stroke-width="12"/>`],
      ["k", "Cesto vertical", "200%", `<path d="M-40 -150v150M40 -150v150" stroke="#E8C21E" stroke-width="16"/><path d="M-40 0q40 30 80 0" fill="none" stroke="#E8C21E" stroke-width="16"/>`]]
      .map(([k, nome, pct, d], i) => `<g data-k="${k}" transform="translate(${250 + i * 340} 330)">${d}<rect x="-70" y="${k === "k" ? 10 : -6}" width="140" height="40" rx="4" fill="${C.aco}"/>
        ${rotulo("", 0, 100, nome, { anc: "middle", tam: 26 })}<text x="0" y="160" text-anchor="middle" font-family="Chakra Petch" font-weight="700" font-size="54" fill="${C.azul}">${pct}</text></g>`).join("")
      + `<g data-k="cor" transform="translate(590 50)"><rect x="-300" y="-36" width="600" height="72" rx="10" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>
        ${["#7B4BA6", "#2E9E4F", "#E8C21E", "#8C8F99", "#D13542", "#7A4A28", "#2E5FB3", "#E8761E"].map((c2, i) => `<rect x="${-280 + i * 48}" y="-18" width="38" height="36" rx="4" fill="${c2}"/>`).join("")}
        ${rotulo("", 120, 8, "a etiqueta manda", { tam: 26, cor: C.vermelho })}</g>
      ${xis("sem", 1060, 220, 30)}${rotulo("semTxt", 1050, 280, "sem etiqueta: fora", { anc: "middle", cor: C.vermelho, tam: 24 })}`,
    quadro(raiz, t, m, c, q) {
      vis(q("cor"), P(t, m.cor)); ["v", "e", "k"].forEach((k) => vis(q(k), P(t, m[k])));
      vis(q("sem"), P(t, m.s)); vis(q("semTxt"), P(t, m.s));
    },
  };

  const defeito = (k, x, y, icone, txt, marca) => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="-150" y="-118" width="300" height="236" rx="10" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>
    <g transform="translate(0 -14)"><g>${ICO[icone]}</g><g data-k="${k}-x">${marca}</g></g>${rotulo("", 0, 100, txt, { anc: "middle", tam: 24, cor: C.vermelho })}</g>`;
  D.defeitos = {
    largo: true,
    svg: () => [
      defeito("c", 210, 135, "cinta", "corte · etiqueta ilegível", `<path d="M-30 -30l26 10M-28 -14l26 10" stroke="${C.vermelho}" stroke-width="5"/><circle cx="-16" cy="-18" r="34" fill="none" stroke="${C.vermelho}" stroke-width="4"/>`),
      defeito("a", 590, 135, "cabo", "gaiola de passarinho", `<ellipse cx="4" cy="0" rx="26" ry="14" fill="none" stroke="${C.vermelho}" stroke-width="4"/><circle cx="4" cy="0" r="40" fill="none" stroke="${C.vermelho}" stroke-width="4"/>`),
      defeito("r", 970, 135, "corrente", "elo alongado", `<rect x="-14" y="-36" width="28" height="70" rx="14" fill="none" stroke="${C.vermelho}" stroke-width="6"/>`),
      defeito("m", 400, 395, "manilha", "pino trocado", `<rect x="-50" y="24" width="100" height="18" rx="6" fill="${C.vermelho}"/>`),
      defeito("g", 780, 395, "gancho", "aberto · sem trava", `<circle cx="-30" cy="20" r="34" fill="none" stroke="${C.vermelho}" stroke-width="4"/><path d="M-50 0l40 40M-10 0l-40 40" stroke="${C.vermelho}" stroke-width="4" opacity=".6"/>`),
    ].join("") + `<g data-k="inut" transform="translate(590 270) rotate(-6)"><rect x="-230" y="-40" width="460" height="76" rx="8" fill="#fff" stroke="${C.vermelho}" stroke-width="6"/>${rotulo("", 0, 12, "REPROVADO: INUTILIZAR", { anc: "middle", cor: C.vermelho, tam: 32 })}</g>`,
    quadro(raiz, t, m, c, q) {
      ["c", "a", "r", "m", "g"].forEach((k) => { vis(q(k), P(t, m[k])); vis(q(`${k}-x`), P(t, m[k] + 1) * (.6 + .4 * Math.abs(Math.sin(t * 4)))); });
      vis(q("inut"), P(t, m.x, .4));
    },
  };

  D.galvanizado = {
    largo: true,
    svg: () => `<g transform="translate(330 -20)">${rotulo("", 0, 90, "cabo direto na peça", { anc: "middle", cor: C.vermelho })}
        <path d="M0 140l-90 200M0 140l90 200" stroke="#8890A8" stroke-width="10"/>${viga("", -170, 340, 340, 40, { cor: "#B9C0CF" })}${rotulo("", 0, 420, "galvanizada", { anc: "middle", tam: 22, cor: C.cinza })}${xis("x", 0, 500, 32)}</g>
      <g data-k="certo" transform="translate(850 -20)">${rotulo("", 0, 90, "cinta + proteção de quina", { anc: "middle", cor: C.verde })}
        <path d="M0 140l-90 200M0 140l90 200" stroke="#E8C21E" stroke-width="14"/>${viga("", -170, 340, 340, 40, { cor: "#B9C0CF" })}
        <rect x="-104" y="330" width="28" height="22" fill="#222"/><rect x="76" y="330" width="28" height="22" fill="#222"/>${ok("v", 0, 500, 32)}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("x"), P(t, m.e + .8)); vis(q("certo"), P(t, m.k)); },
  };

  // ------------------------------------------------------------ 3.6 Sequência de montagem (galpão em perspectiva)
  const PROF = { dx: 90, dy: -50 };   // deslocamento entre pórticos
  const pt3 = (x, y, k) => [x + k * PROF.dx, y + k * PROF.dy];
  const portico = (k, cor = C.aco) => { const [x0, y0] = pt3(140, CHAO, k), [x1] = pt3(420, CHAO, k);
    return `<g data-k="p${k}"><rect x="${x0 - 9}" y="${y0 - 260}" width="18" height="260" fill="${cor}"/><rect x="${x1 - 9}" y="${y0 - 260}" width="18" height="260" fill="${cor}"/>
      <path d="M${x0 - 9} ${y0 - 260}L${(x0 + x1) / 2} ${y0 - 330}L${x1 + 9} ${y0 - 260}" fill="none" stroke="${cor}" stroke-width="16" stroke-linejoin="round"/></g>`; };
  const base = (k) => { const [x0, y0] = pt3(140, CHAO, k), [x1] = pt3(420, CHAO, k); return `<g data-k="b${k}"><rect x="${x0 - 28}" y="${y0 - 6}" width="56" height="12" fill="#A8AEC2"/><rect x="${x1 - 28}" y="${y0 - 6}" width="56" height="12" fill="#A8AEC2"/></g>`; };
  const estai = (k) => { const [x0, y0] = pt3(140, CHAO, k), [x1] = pt3(420, CHAO, k);
    return `<g data-k="e${k}"><line x1="${x0}" y1="${y0 - 240}" x2="${x0 - 110}" y2="${y0 + 10}" stroke="${C.vermelho}" stroke-width="3"/><line x1="${x1}" y1="${y0 - 240}" x2="${x1 + 110}" y2="${y0 + 10}" stroke="${C.vermelho}" stroke-width="3"/></g>`; };
  const vao = (k, kk) => { const a = pt3(140, CHAO - 250, k), b = pt3(140, CHAO - 250, kk), a2 = pt3(420, CHAO - 250, k), b2 = pt3(420, CHAO - 250, kk), c0 = pt3(140, CHAO, k), c1 = pt3(140, CHAO, kk);
    return `<g data-k="v${k}"><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.azul}" stroke-width="10"/><line x1="${a2[0]}" y1="${a2[1]}" x2="${b2[0]}" y2="${b2[1]}" stroke="${C.azul}" stroke-width="10"/>
      ${k === 0 ? `<line x1="${a[0]}" y1="${a[1]}" x2="${c1[0]}" y2="${c1[1] - 10}" stroke="${C.vermelho}" stroke-width="5"/><line x1="${b[0]}" y1="${b[1]}" x2="${c0[0]}" y2="${c0[1] - 10}" stroke="${C.vermelho}" stroke-width="5"/>` : ""}</g>`; };
  const tercas = () => { let g = ""; for (let i = 1; i <= 4; i++) { const f = i / 5, xa = 140 + (280 / 2) * f, ya = CHAO - 260 - 70 * f, xb = 420 - (280 / 2) * f;
      const A = pt3(xa, ya, 0), B2 = pt3(xa, ya, 3), A2 = pt3(xb, ya, 0), B3 = pt3(xb, ya, 3);
      g += `<line x1="${A[0]}" y1="${A[1]}" x2="${B2[0]}" y2="${B2[1]}" stroke="${C.ambar}" stroke-width="5"/><line x1="${A2[0]}" y1="${A2[1]}" x2="${B3[0]}" y2="${B3[1]}" stroke="${C.ambar}" stroke-width="5"/>`; }
    return `<g data-k="tercas">${g}</g>`; };
  D.sequencia = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      ${[3, 2, 1, 0].map(base).join("")}${[3, 2, 1, 0].map((k) => portico(k)).join("")}${[1, 0].map(estai).join("")}
      ${vao(0, 1)}${vao(1, 2)}${vao(2, 3)}${tercas()}
      <g data-k="graute">${[0, 1, 2, 3].map((k) => { const [x0, y0] = pt3(140, CHAO, k), [x1] = pt3(420, CHAO, k); return `<rect x="${x0 - 30}" y="${y0 - 2}" width="60" height="10" fill="#9E9E9E"/><rect x="${x1 - 30}" y="${y0 - 2}" width="60" height="10" fill="#9E9E9E"/>`; }).join("")}
        ${rotulo("", 560, CHAO - 20, "graute por último", { cor: C.cinza, tam: 22 })}</g>
      ${rotulo("vaoTxt", 120, CHAO - 410, "1º vão travado", { cor: C.vermelho, tam: 26 })}`,
    quadro(raiz, t, m, c, q) {
      [0, 1, 2, 3].forEach((k) => vis(q(`b${k}`), P(t, m.b + k * .2)));
      vis(q("p0"), P(t, m.p)); vis(q("p1"), P(t, m.p + .5)); vis(q("e0"), P(t, m.p + 1) * (1 - P(t, m.s))); vis(q("e1"), P(t, m.p + 1.3) * (1 - P(t, m.s)));
      vis(q("v0"), P(t, m.v)); vis(q("vaoTxt"), P(t, m.v + .4));
      vis(q("p2"), P(t, m.a)); vis(q("v1"), P(t, m.a + .5)); vis(q("p3"), P(t, m.a + 1)); vis(q("v2"), P(t, m.a + 1.5));
      vis(q("tercas"), P(t, m.s)); vis(q("graute"), P(t, m.g));
    },
  };

  // ------------------------------------------------------------ 3.6 Estais e vento
  D.estais = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <g transform="translate(260 0)">${rotulo("", 0, 70, "frente", { anc: "middle", tam: 22, cor: C.cinza })}<rect x="-12" y="${CHAO - 360}" width="24" height="360" fill="${C.aco}"/>
        <g data-k="ef"><line x1="0" y1="${CHAO - 330}" x2="-170" y2="${CHAO}" stroke="${C.vermelho}" stroke-width="4"/><line x1="0" y1="${CHAO - 330}" x2="170" y2="${CHAO}" stroke="${C.vermelho}" stroke-width="4"/></g></g>
      <g transform="translate(600 0)">${rotulo("", 0, 70, "lado", { anc: "middle", tam: 22, cor: C.cinza })}<rect x="-12" y="${CHAO - 360}" width="24" height="360" fill="${C.aco}"/>
        <g data-k="el"><line x1="0" y1="${CHAO - 330}" x2="-150" y2="${CHAO}" stroke="${C.vermelho}" stroke-width="4"/><line x1="0" y1="${CHAO - 330}" x2="150" y2="${CHAO}" stroke="${C.vermelho}" stroke-width="4"/></g></g>
      <g data-k="vento">${[0, 1, 2].map((i) => `<path data-k="w${i}" d="M0 0h120" stroke="#5AA9E6" stroke-width="6" stroke-linecap="round" marker-end="url(#pa-${u})"/>`).join("")}
        ${rotulo("", 40, 140, "vento", { cor: "#2E7DBA", tam: 26 })}</g>
      ${rotulo("dir", 430, 140, "estais em duas direções", { anc: "middle", cor: C.vermelho, tam: 26 })}`,
    quadro(raiz, t, m, c, q) {
      vis(q("ef"), P(t, m.e)); vis(q("el"), P(t, m.e + .8)); vis(q("dir"), P(t, m.e + 1.4));
      vis(q("vento"), P(t, m.n));
      [0, 1, 2].forEach((i) => pos(q(`w${i}`), 20 + ((t * 120 + i * 90) % 260), 190 + i * 60));
    },
  };

  // ------------------------------------------------------------ 3.6 Soltar a manilha sem subir no pilar
  D.soltarPilar = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <rect x="250" y="${CHAO - 8}" width="100" height="10" fill="#A8AEC2"/>
      <path d="M268 ${CHAO - 8}v-24M332 ${CHAO - 8}v-24" stroke="${C.cabo}" stroke-width="5"/>
      <g data-k="pilar"><rect x="-14" y="-360" width="28" height="360" fill="${C.aco}"/><rect x="-46" y="-8" width="92" height="10" fill="${C.acoE}"/><circle cx="0" cy="-340" r="6" fill="#fff"/>
        <g data-k="manilha"><path d="M-14 -340v-30a14 14 0 0 1 28 0v30" fill="none" stroke="${C.cabo}" stroke-width="7"/><line x1="0" y1="-384" x2="0" y2="-800" stroke="${C.cabo}" stroke-width="4"/></g>
        <g data-k="porcas"><rect x="-38" y="-18" width="16" height="10" fill="${C.escuro}"/><rect x="22" y="-18" width="16" height="10" fill="${C.escuro}"/></g></g>
      <g data-k="estais"><line x1="300" y1="${CHAO - 320}" x2="100" y2="${CHAO}" stroke="${C.vermelho}" stroke-width="3"/><line x1="300" y1="${CHAO - 320}" x2="500" y2="${CHAO}" stroke="${C.vermelho}" stroke-width="3"/></g>
      ${pessoa("guia", 640, CHAO, { pose: "guia", colete: C.verde })}
      <path data-k="corda" fill="none" stroke="${C.madeiraE}" stroke-width="4"/>
      <path data-k="cordaPino" fill="none" stroke="${C.azul}" stroke-width="4"/>
      ${rotulo("pinoTxt", 520, 170, "corda no pino", { cor: C.azul, tam: 22 })}
      <g data-k="sobe">${pessoa("", 330, CHAO - 180, { pose: "carrega", colete: C.vermelho, esc: .8 })}${xis("", 380, CHAO - 260, 26)}</g>`,
    quadro(raiz, t, m, c, q) {
      const desce = P(t, m.i + .5, 3), y = lerp(CHAO - 120, CHAO, desce);
      const solta = P(t, m.s + 1, 1.2);
      pos(q("pilar"), 300, y - 8 * desce);
      q("manilha").setAttribute("transform", `translate(0 ${-solta * 60})`); vis(q("manilha"), 1 - solta * .6);
      vis(q("porcas"), P(t, m.a + .8)); vis(q("estais"), P(t, m.e));
      vis(q("guia"), P(t, m.g) * (1 - P(t, m.s + 2))); vis(q("corda"), P(t, m.g) * (1 - P(t, m.a + 1)));
      q("corda").setAttribute("d", `M300 ${y - 200} Q 480 ${y - 60} 612 ${CHAO - 70}`);
      vis(q("cordaPino"), P(t, m.s)); vis(q("pinoTxt"), P(t, m.s) * (1 - P(t, m.x)));
      q("cordaPino").setAttribute("d", `M300 ${y - 8 - 340 - solta * 60} Q 520 ${CHAO - 200} 612 ${CHAO - 70}`);
      vis(q("sobe"), P(t, m.x));
    },
  };

  // ------------------------------------------------------------ 3.6 Soltar o gancho da viga
  D.ganchoViga = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <rect x="120" y="${CHAO - 400}" width="30" height="400" fill="${C.aco}"/><rect x="670" y="${CHAO - 400}" width="30" height="400" fill="${C.aco}"/>
      <rect x="150" y="${CHAO - 400}" width="16" height="70" fill="${C.acoE}"/><rect x="654" y="${CHAO - 400}" width="16" height="70" fill="${C.acoE}"/>
      ${viga("", 166, CHAO - 396, 488, 40)}
      ${[0, 1, 2].map((i) => `<g data-k="pe${i}"><circle cx="158" cy="${CHAO - 386 + i * 22}" r="6" fill="${C.escuro}"/><circle cx="662" cy="${CHAO - 386 + i * 22}" r="6" fill="${C.escuro}"/></g>`).join("")}
      <g transform="translate(410 ${CHAO - 470})">${gancho("")}</g>
      <line data-k="cabo1" x1="410" y1="${CHAO - 470 + 9}" x2="300" y2="${CHAO - 398}" stroke="${C.ambar}" stroke-width="8"/><line data-k="cabo2" x1="410" y1="${CHAO - 470 + 9}" x2="520" y2="${CHAO - 398}" stroke="${C.ambar}" stroke-width="8"/>
      ${rotulo("tens", 440, CHAO - 500, "cabo tensionado até liberar", { tam: 22, cor: C.azul })}
      ${rotulo("plano", 410, CHAO - 300, "parafusos conforme o plano de montagem", { anc: "middle", tam: 24, cor: C.vermelho })}`,
    quadro(raiz, t, m, c, q) {
      [0, 1, 2].forEach((i) => vis(q(`pe${i}`), P(t, m.c + i * .5)));
      vis(q("plano"), P(t, m.p + .5)); vis(q("tens"), P(t, m.g));
    },
  };

  // ------------------------------------------------------------ 3.6 Condições de parada
  const ICP = {
    v: `<path d="M-60 -20h80a20 20 0 1 0 -20 -20M-60 10h110a20 20 0 1 1 -20 20M-60 40h60" fill="none" stroke="#2E7DBA" stroke-width="9" stroke-linecap="round"/>`,
    c: `<path d="M-60 0a40 40 0 0 1 40 -50a50 50 0 0 1 90 20a30 30 0 0 1 0 60h-110a30 30 0 0 1 -20 -30z" fill="#9AA0B8"/>${[-40, 0, 40].map((x) => `<path d="M${x} 50l-10 30" stroke="#2E7DBA" stroke-width="6" stroke-linecap="round"/>`).join("")}`,
    r: `<path d="M-60 0a40 40 0 0 1 40 -50a50 50 0 0 1 90 20a30 30 0 0 1 0 60h-110a30 30 0 0 1 -20 -30z" fill="#6E7799"/><path d="M0 30l-20 40h18l-10 40l34 -52h-18l14 -28z" fill="${C.amarelo}"/>`,
    l: `<circle cx="0" cy="0" r="40" fill="${C.ambar}"/><rect x="-80" y="0" width="160" height="60" fill="#F5F6FA"/><path d="M-80 0h160" stroke="${C.escuro}" stroke-width="5"/><path d="M0 -60v-16M-50 -40l-12 -12M50 -40l12 -12" stroke="${C.ambar}" stroke-width="6"/>`,
    f: `${pessoa("", -30, 60, { esc: .55 })}${pessoa("", 30, -20, { esc: .55, colete: C.azul })}<path d="M-10 -20h80" stroke="${C.aco}" stroke-width="10"/>`,
  };
  D.parada = {
    largo: true,
    svg: () => [["v", "vento acima do limite do plano"], ["c", "chuva"], ["r", "descarga atmosférica próxima"], ["l", "fim da luz sem iluminação"], ["f", "equipe acima ou abaixo"]]
      .map(([k, txt], i) => { const x = i < 3 ? 210 + i * 380 : 400 + (i - 3) * 380, y = i < 3 ? 140 : 390;
        return `<g data-k="${k}" transform="translate(${x} ${y})"><circle r="100" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>${ICP[k]}${rotulo("", 0, 132, txt, { anc: "middle", tam: 20 })}</g>`; }).join("")
      + `<g data-k="todos" transform="translate(1060 390)"><polygon points="-40,-96 40,-96 96,-40 96,40 40,96 -40,96 -96,40 -96,-40" fill="${C.vermelho}" stroke="#fff" stroke-width="6"/>${rotulo("", 0, -6, "QUALQUER", { anc: "middle", cor: "#fff", tam: 22 })}${rotulo("", 0, 22, "UM PODE", { anc: "middle", cor: "#fff", tam: 22 })}${rotulo("", 0, 50, "PARAR", { anc: "middle", cor: "#fff", tam: 22 })}</g>`,
    quadro(raiz, t, m, c, q) { ["v", "c", "r", "l", "f"].forEach((k) => vis(q(k), P(t, m[k]))); vis(q("todos"), P(t, m.q)); },
  };
})();
