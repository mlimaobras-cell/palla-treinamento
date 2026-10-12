// Ilustrações do Módulo 1 (fundamentos de estruturas metálicas). Conteúdo: Caderno do Módulo 1.
(function () {
  const { C, pessoa, viga, caibro, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 515;

  // ------------------------------------------------------------ galpão em perspectiva com elementos destacáveis
  const DX = 105, DY = -52, X0 = 110, X1 = 410, H = 250, CUM = 70;
  const p3 = (x, y, k) => [x + k * DX, y + k * DY];
  const L = (a, b, w, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
  const topoE = (k) => p3(X0, CHAO - H, k), topoD = (k) => p3(X1, CHAO - H, k), cume = (k) => p3((X0 + X1) / 2, CHAO - H - CUM, k);
  const ptTelhado = (f, lado, k) => { const a = lado ? topoD(k) : topoE(k), c = cume(k); return [lerp(a[0], c[0], f), lerp(a[1], c[1], f)]; };
  function galpaoSvg() {
    const g = [];
    // fundação recortada e chumbadores (pilar da frente, esquerda)
    g.push(`<g data-k="chumb" class="el"><rect x="${X0 - 40}" y="${CHAO}" width="80" height="50" fill="#C9CCD6"/><line x1="${X0 - 14}" y1="${CHAO - 6}" x2="${X0 - 14}" y2="${CHAO + 40}" stroke-width="5"/><line x1="${X0 + 14}" y1="${CHAO - 6}" x2="${X0 + 14}" y2="${CHAO + 40}" stroke-width="5"/></g>`);
    g.push(`<g data-k="base" class="el">${[0, 1, 2, 3].map((k) => { const a = p3(X0, CHAO, k), b = p3(X1, CHAO, k); return `<rect x="${a[0] - 24}" y="${a[1] - 7}" width="48" height="9" stroke="none" class="pre"/><rect x="${b[0] - 24}" y="${b[1] - 7}" width="48" height="9" stroke="none" class="pre"/>`; }).join("")}</g>`);
    g.push(`<g data-k="long" class="el">${[0.33, 0.66].map((f) => { const a = p3(X0, CHAO - H * f, 0), b = p3(X0, CHAO - H * f, 3); return L(a, b, 5); }).join("")}</g>`);
    g.push(`<g data-k="cvl" class="el">${L(p3(X0, CHAO - H, 0), p3(X0, CHAO - 10, 1), 4)}${L(p3(X0, CHAO - 10, 0), p3(X0, CHAO - H, 1), 4)}</g>`);
    g.push(`<g data-k="pilar" class="el">${[3, 2, 1, 0].map((k) => L(p3(X0, CHAO, k), topoE(k), 14) + L(p3(X1, CHAO, k), topoD(k), 14)).join("")}</g>`);
    g.push(`<g data-k="viga" class="el">${[3, 2, 1, 0].map((k) => `<path d="M${topoE(k)}L${cume(k)}L${topoD(k)}" fill="none" stroke-width="12" stroke-linejoin="round"/>`).join("")}</g>`);
    g.push(`<g data-k="terca" class="el">${[.2, .45, .7, .92].flatMap((f) => [0, 1].map((ld) => L(ptTelhado(f, ld, 0), ptTelhado(f, ld, 3), 5))).join("")}</g>`);
    g.push(`<g data-k="tir" class="el">${[0, 1, 2].map((k) => { const a = ptTelhado(.2, 0, k + .5), b = ptTelhado(.92, 0, k + .5); return L(a, b, 2.5, 'stroke-dasharray="6 4"'); }).join("")}</g>`);
    g.push(`<g data-k="cvt" class="el">${L(ptTelhado(.05, 1, 0), ptTelhado(.95, 1, 1), 4)}${L(ptTelhado(.95, 1, 0), ptTelhado(.05, 1, 1), 4)}</g>`);
    g.push(`<g data-k="mao" class="el">${[1, 2].map((k) => { const a = ptTelhado(.45, 1, k), b = [a[0] + 6, a[1] + 34]; return L(a, b, 5); }).join("")}</g>`);
    return `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>${g.join("")}`;
  }
  const ORDEM = ["chumb", "base", "pilar", "viga", "terca", "long", "cvl", "cvt", "tir", "mao"];
  function galpaoQuadro(q, t, m, mapa) {
    // mapa: elemento → marca em que aparece; destaque vermelho até a próxima marca
    const tempos = ORDEM.map((k) => m[mapa[k]] ?? -1);
    ORDEM.forEach((k, i) => {
      const el = q(k), ini = tempos[i];
      if (!el) return;
      const fim = Math.min(...tempos.filter((x) => x > ini), 1e9);
      const ativo = ini >= 0 && t >= ini && t < fim && t - ini < 7;
      vis(el, ini < 0 ? 1 : P(t, ini));
      const cor = ativo ? C.vermelho : C.aco;
      el.setAttribute("stroke", cor); el.querySelectorAll(".pre").forEach((r) => r.setAttribute("fill", cor));
    });
  }
  D.galpaoElementos = {
    svg: () => galpaoSvg(),
    quadro(raiz, t, m, c, q) {
      galpaoQuadro(q, t, m, { chumb: "ch", base: "ba", pilar: "pi", viga: "vi", terca: "te", long: "lo", cvl: "co", cvt: "co", tir: "ti", mao: "mf" });
    },
  };

  // ------------------------------------------------------------ por que construir em aço
  D.porqueAco = {
    svg: (u) => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>
      <g data-k="fab"><path d="M30 ${CHAO}v-150l60 -40v40l60 -40v40l60 -40v190z" fill="#8A93B8"/><rect x="60" y="${CHAO - 70}" width="50" height="70" fill="#5C6380"/>${rotulo("", 130, CHAO + 34, "fábrica", { anc: "middle", tam: 24 })}</g>
      <g data-k="peca"><rect x="0" y="0" width="140" height="18" rx="2" fill="${C.aco}"/></g>
      <g data-k="obra">${[0, 1].map((k) => `<path d="M${480 + k * 120} ${CHAO}v-200l90 -40l90 40v200" fill="none" stroke="${C.aco}" stroke-width="10" stroke-linejoin="round"/>`).join("")}${rotulo("", 620, CHAO + 34, "obra", { anc: "middle", tam: 24 })}</g>
      <path data-k="seta" d="M240 ${CHAO - 120}h200" stroke="${C.azul}" stroke-width="5" stroke-dasharray="12 8" marker-end="url(#pa-${u})"/>
      <g data-k="mont">${pessoa("", 760, CHAO, { pose: "aponta", flip: true })}${rotulo("", 690, 120, "a vantagem só aparece", { anc: "middle", tam: 22, cor: C.vermelho })}${rotulo("", 690, 150, "com montagem bem feita", { anc: "middle", tam: 22, cor: C.vermelho })}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("fab"), P(t, m.f)); vis(q("seta"), P(t, m.r));
      const p = P(t, m.r, 2.4), x = lerp(220, 450, p); pos(q("peca"), x, CHAO - 140); vis(q("peca"), P(t, m.r) * (1 - P(t, m.r + 2.4, .4)));
      vis(q("obra"), P(t, m.r + 1)); vis(q("mont"), P(t, m.e));
    },
  };

  // ------------------------------------------------------------ tipos de estrutura (largo)
  const TIPO = {
    g: `<path d="M-120 0v-150l120 -50l120 50v150" fill="none" stroke="${C.aco}" stroke-width="12" stroke-linejoin="round"/>`,
    t: `<path d="M-140 -120h280M-140 -120l140 -70l140 70" fill="none" stroke="${C.aco}" stroke-width="8"/>${[-100, -60, -20, 20, 60, 100].map((x) => `<path d="M${x} -120l${x < 0 ? 20 : -20} ${-(140 - Math.abs(x)) / 2}" stroke="${C.aco}" stroke-width="4"/>`).join("")}<path d="M-140 0v-120M140 0v-120" stroke="${C.aco}" stroke-width="12"/>`,
    e: `${[0, 1, 2].map((n) => `<rect x="-120" y="${-70 - n * 70}" width="240" height="10" fill="${C.aco}"/><path d="M-120 ${-60 - n * 70}h240" stroke="#9AA0B8" stroke-width="6" stroke-dasharray="8 4"/>`).join("")}<path d="M-110 0v-210M0 0v-210M110 0v-210" stroke="${C.aco}" stroke-width="12"/>`,
    s: `<path d="M-150 -90h300" stroke="${C.aco}" stroke-width="10"/><path d="M-150 -60h300" stroke="${C.aco}" stroke-width="6"/>${[-130, -70, -10, 50, 110].map((x) => `<path d="M${x} -90l30 30M${x + 30} -90l-30 30" stroke="${C.aco}" stroke-width="3"/>`).join("")}<path d="M-120 0v-60M120 0v-60" stroke="${C.aco}" stroke-width="12"/>`,
  };
  D.tipos = {
    largo: true,
    svg: () => [["g", "Galpão em pórtico", "indústria, logística"], ["t", "Cobertura treliçada", "grandes vãos, ginásios"], ["e", "Edifício e mezanino", "steel deck com conectores"], ["s", "Estruturas especiais", "passarelas, pipe racks"]]
      .map(([k, nome, onde], i) => `<g data-k="${k}" transform="translate(${160 + i * 290} 380)">${TIPO[k]}<path d="M-150 0h300" stroke="${C.chao}" stroke-width="3"/>${rotulo("", 0, 46, nome, { anc: "middle", tam: 26 })}${rotulo("", 0, 80, onde, { anc: "middle", tam: 21, cor: C.cinza })}</g>`).join(""),
    quadro(raiz, t, m, c, q) { ["g", "t", "e", "s"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 1.2 estrutura incompleta × contraventada
  D.incompleta = {
    largo: true,
    svg: (u) => `<path d="M0 ${CHAO - 60}h1180" stroke="${C.chao}" stroke-width="3"/>
      <g transform="translate(300 0)">${rotulo("", 0, 70, "montagem incompleta", { anc: "middle", cor: C.vermelho, tam: 26 })}<g data-k="solto"><path d="M-130 ${CHAO - 60}v-280M130 ${CHAO - 60}v-280" stroke="${C.aco}" stroke-width="14"/></g></g>
      <g transform="translate(860 0)">${rotulo("", 0, 70, "com contraventamento provisório", { anc: "middle", cor: C.verde, tam: 26 })}
        <path d="M-130 ${CHAO - 60}v-280M130 ${CHAO - 60}v-280M-130 ${CHAO - 340}h260" stroke="${C.aco}" stroke-width="14"/>
        <path d="M-130 ${CHAO - 340}l-140 280M130 ${CHAO - 340}l140 280" stroke="${C.vermelho}" stroke-width="4"/>${ok("", 0, CHAO - 200, 30)}</g>
      <g data-k="vento">${[0, 1, 2].map((i) => `<path data-k="w${i}" d="M0 0h110" stroke="#5AA9E6" stroke-width="6" stroke-linecap="round" marker-end="url(#pa-${u})"/>`).join("")}</g>
      <g data-k="nbr" transform="translate(590 520)"><rect x="-300" y="-30" width="600" height="56" rx="8" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${rotulo("", 0, 8, "NBR 8800, 12.3.2: provisório sempre que necessário", { anc: "middle", tam: 22 })}</g>`,
    quadro(raiz, t, m, c, q) {
      const balanco = t > m.v ? Math.sin((t - m.v) * 2.4) * 8 * P(t, m.v) : 0;
      q("solto").setAttribute("transform", `translate(0 ${CHAO - 60}) skewX(${balanco}) translate(0 ${-(CHAO - 60)})`);
      vis(q("vento"), P(t, m.v)); [0, 1, 2].forEach((i) => pos(q(`w${i}`), 40 + ((t * 140 + i * 110) % 300), 220 + i * 60));
      vis(q("nbr"), P(t, m.n));
    },
  };

  const REGRA = {
    p: `<path d="M0 60v-150" stroke="${C.aco}" stroke-width="14"/><path d="M0 -80l-70 140M0 -80l70 140" stroke="${C.vermelho}" stroke-width="4"/>`,
    v: `<path d="M-70 60v-130M70 60v-130M-70 -70h140" stroke="${C.aco}" stroke-width="12"/><path d="M-70 -70l140 130M70 -70l-140 130" stroke="${C.vermelho}" stroke-width="5"/>`,
    a: `<path d="M-80 60v-110M80 60v-110M-90 -50h180" stroke="${C.aco}" stroke-width="12"/>${[0, 1, 2].map((i) => `<rect x="-60" y="${-74 - i * 16}" width="120" height="14" fill="${C.ambar}"/>`).join("")}${xis("", 90, -110, 22)}`,
    r: `<rect x="-70" y="-90" width="140" height="150" rx="8" fill="#fff" stroke="${C.escuro}" stroke-width="3"/><path d="M-50 -50h100M-50 -20h100M-50 10h60" stroke="#D9DCE8" stroke-width="6"/><path d="M-30 40c10 -14 20 6 30 -4s16 -10 24 0" fill="none" stroke="${C.azul}" stroke-width="4"/>`,
  };
  D.regrasEstab = {
    largo: true,
    svg: () => [["p", "Nunca pilar solto sem estaiar"], ["v", "Primeiro vão contraventado antes de avançar"], ["a", "Sem material acumulado na estrutura incompleta"], ["r", "Retirar o provisório só com autorização"]]
      .map(([k, txt], i) => `<g data-k="${k}" transform="translate(${160 + i * 290} 280)"><rect x="-135" y="-150" width="270" height="330" rx="12" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>${REGRA[k]}
        <foreignObject x="-125" y="96" width="250" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 22px 'IBM Plex Sans';text-align:center;color:${C.escuro};line-height:1.2">${txt}</div></foreignObject></g>`).join(""),
    quadro(raiz, t, m, c, q) { ["p", "v", "a", "r"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };

  // ------------------------------------------------------------ 1.3 perfis (largo)
  const secao = {
    W: `<path d="M-50 -70h100v12h-44v116h44v12h-100v-12h44v-116h-44z" fill="${C.aco}"/>`,
    U: `<path d="M-30 -70h60v12h-46v116h46v12h-60z" fill="${C.aco}"/>`,
    L: `<path d="M-40 -60h14v106h66v14h-80z" fill="${C.aco}"/>`,
    S: `<g fill="${C.aco}"><rect x="-55" y="-74" width="110" height="14"/><rect x="-55" y="60" width="110" height="14"/><rect x="-6" y="-60" width="12" height="120"/></g><path d="M-6 -60l-7 7M6 -60l7 7M-6 60l-7 -7M6 60l7 -7" stroke="${C.vermelho}" stroke-width="5"/>`,
    Ue: `<path d="M30 -60v-12h-56v144h56v-12" fill="none" stroke="${C.aco}" stroke-width="5"/><path d="M30 -72v14M30 72v-14" stroke="${C.aco}" stroke-width="5"/>`,
    Z: `<path d="M50 -60v-12h-50v144h-50v-12" fill="none" stroke="${C.aco}" stroke-width="5"/>`,
  };
  D.perfis = {
    largo: true,
    svg: () => [["l", "Laminados", "saem prontos da usina", ["W", "U", "L"]], ["s", "Soldados", "chapas soldadas em fábrica (CS, VS, CVS)", ["S"]], ["f", "Formados a frio", "chapa fina dobrada · amassam fácil", ["Ue", "Z"]]]
      .map(([k, nome, txt, lista], i) => `<g data-k="${k}" transform="translate(${200 + i * 390} 250)"><rect x="-180" y="-160" width="360" height="380" rx="12" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>
        ${rotulo("", 0, -118, nome, { anc: "middle", tam: 30 })}${lista.map((s, j) => `<g transform="translate(${(j - (lista.length - 1) / 2) * 110} 30) scale(.9)">${secao[s]}</g>`).join("")}
        <foreignObject x="-165" y="130" width="330" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 22px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${txt}</div></foreignObject></g>`).join(""),
    quadro(raiz, t, m, c, q) { ["l", "s", "f"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.nomePerfil = {
    svg: (u) => `<g transform="translate(60 70)"><rect x="0" y="0" width="260" height="62" rx="8" fill="${C.escuro}"/>${rotulo("", 130, 42, "W 310 × 32,7", { anc: "middle", cor: "#fff", tam: 30 })}</g>
      <g transform="translate(180 290) scale(1.6)">${secao.W}</g>
      <g data-k="alt"><path d="M290 175v230M276 175h28M276 405h28" stroke="${C.vermelho}" stroke-width="4"/>${rotulo("", 310, 286, "310 mm", { cor: C.vermelho, tam: 28 })}${rotulo("", 310, 314, "altura nominal", { cor: C.cinza, tam: 19 })}</g>
      <g data-k="kg"><rect x="60" y="440" width="300" height="26" rx="3" fill="${C.aco}"/><path d="M60 482h300M60 472v20M360 472v20" stroke="${C.azul}" stroke-width="3"/>${rotulo("", 210, 514, "1 metro = 32,7 kg", { anc: "middle", cor: C.azul, tam: 24 })}</g>
      <g data-k="outros" transform="translate(470 200)">${rotulo("", 0, 0, "CS 300 × 62", { tam: 26 })}${rotulo("", 0, 30, "coluna soldada", { tam: 19, cor: C.cinza })}${rotulo("", 0, 54, "300 mm · 62 kg/m", { tam: 19, cor: C.cinza })}
        ${rotulo("", 0, 130, "Ue 150×60×20×2,25", { tam: 24 })}${rotulo("", 0, 160, "altura · aba", { tam: 19, cor: C.cinza })}${rotulo("", 0, 184, "enrijecedor · espessura (mm)", { tam: 19, cor: C.cinza })}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("alt"), P(t, m.a)); vis(q("kg"), P(t, m.k)); vis(q("outros"), P(t, m.o)); },
  };
  D.acos = {
    svg: (u) => `<g transform="translate(60 70)"><path d="M0 0v380h700" fill="none" stroke="${C.escuro}" stroke-width="3"/>${rotulo("", 10, -10, "tensão", { tam: 20, cor: C.cinza })}${rotulo("", 700, 410, "deformação", { anc: "end", tam: 20, cor: C.cinza })}
        <path data-k="curva" d="M0 380L120 170L150 165L230 162Q400 40 560 70L640 110" fill="none" stroke="${C.azul}" stroke-width="6" stroke-dasharray="1000" stroke-dashoffset="1000"/>
        <g data-k="esc"><circle cx="120" cy="170" r="10" fill="${C.ambar}"/>${rotulo("", 136, 210, "escoamento: deforma", { tam: 22, cor: C.ambar })}${rotulo("", 136, 236, "e não volta", { tam: 22, cor: C.ambar })}</g>
        <g data-k="rup"><path d="M640 110l14 -14M640 110l14 14" stroke="${C.vermelho}" stroke-width="5"/>${rotulo("", 560, 40, "resistência: rompe", { anc: "middle", tam: 22, cor: C.vermelho })}</g></g>
      <g data-k="cert" transform="translate(410 545)"><rect x="-330" y="-30" width="660" height="58" rx="8" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${rotulo("", 0, 8, "certificado sempre · aço não se troca sem o projeto", { anc: "middle", tam: 22, cor: C.vermelho })}</g>`,
    quadro(raiz, t, m, c, q) {
      q("curva").setAttribute("stroke-dashoffset", 1000 * (1 - P(t, m.e - .4, 2.4)));
      vis(q("esc"), P(t, m.e + .6)); vis(q("rup"), P(t, m.r)); vis(q("cert"), P(t, m.c));
    },
  };

  // ------------------------------------------------------------ 1.4 esforços (largo, 5 quadros animados)
  D.esforcos = {
    largo: true,
    svg: (u) => {
      const cx = (i) => 130 + i * 230, card = (k, i, nome, ex, corpo) => `<g data-k="${k}" transform="translate(${cx(i)} 270)"><rect x="-108" y="-190" width="216" height="400" rx="12" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>${rotulo("", 0, -150, nome, { anc: "middle", tam: 26 })}${corpo}
        <foreignObject x="-100" y="120" width="200" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 19px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.2">${ex}</div></foreignObject></g>`;
      return card("tr", 0, "Tração", "puxa: tirante, diagonal", `<rect data-k="trb" x="-14" y="-90" width="28" height="160" fill="${C.aco}"/><path d="M0 -96v-34" stroke="${C.vermelho}" stroke-width="5" marker-end="url(#pv-${u})"/><path d="M0 76v34" stroke="${C.vermelho}" stroke-width="5" marker-end="url(#pv-${u})"/>`)
        + card("co", 1, "Compressão", "empurra: pilar · risco de flambagem", `<path data-k="cob" d="M0 -100Q0 -10 0 80" fill="none" stroke="${C.aco}" stroke-width="22"/><path d="M0 -130v24M0 110v-24" stroke="${C.vermelho}" stroke-width="5"/>`)
        + card("fl", 2, "Flexão", "dobra: viga e terça no vão", `<path data-k="flb" d="M-90 -10Q0 -10 90 -10" fill="none" stroke="${C.aco}" stroke-width="22"/><path d="M-90 30l-10 20h20zM90 30l-10 20h20z" fill="${C.cinza}"/><path d="M0 -80v40" stroke="${C.vermelho}" stroke-width="5"/>`)
        + card("ci", 3, "Cisalhamento", "corta: parafuso, alma no apoio", `<rect data-k="cia" x="-80" y="-50" width="80" height="24" fill="${C.aco}"/><rect data-k="cib" x="0" y="-26" width="80" height="24" fill="${C.acoE}"/><rect x="-8" y="-66" width="16" height="80" fill="${C.escuro}"/>`)
        + card("to", 4, "Torção", "gira: carga fora do eixo", `<g data-k="tob"><rect x="-80" y="-30" width="160" height="40" fill="${C.aco}"/><path d="M-80 -30l20 -14h160l-20 14" fill="#9AA0B8"/></g><path d="M60 -80a30 16 0 1 1 -10 -20" fill="none" stroke="${C.vermelho}" stroke-width="5"/>`);
    },
    quadro(raiz, t, m, c, q) {
      ["tr", "co", "fl", "ci", "to"].forEach((k) => vis(q(k), P(t, m[k])));
      const s = (k) => Math.max(0, Math.sin((t - m[k]) * 3)) * P(t, m[k] + .3);
      q("trb").setAttribute("transform", `scale(1 ${1 + .12 * s("tr")})`);
      q("cob").setAttribute("d", `M0 -100Q${46 * s("co")} -10 0 80`);
      q("flb").setAttribute("d", `M-90 -10Q0 ${-10 + 50 * s("fl")} 90 -10`);
      q("cia").setAttribute("transform", `translate(${-18 * s("ci")} 0)`); q("cib").setAttribute("transform", `translate(${18 * s("ci")} 0)`);
      q("tob").setAttribute("transform", `rotate(${16 * s("to")})`);
    },
  };

  D.furoProibido = {
    svg: () => `${viga("", 60, 260, 600, 60)}<circle data-k="furo" cx="360" cy="290" r="18" fill="#F5F6FA" stroke="${C.vermelho}" stroke-width="4"/>
      <g data-k="maq"><rect x="330" y="120" width="60" height="110" rx="8" fill="${C.cabo}"/><rect x="354" y="230" width="12" height="40" fill="#9AA0B8"/></g>
      ${xis("x", 470, 170, 30)}${rotulo("tx", 360, 400, "muda a forma como a peça resiste", { anc: "middle", cor: C.vermelho, tam: 26 })}
      <g data-k="eng" transform="translate(360 500)"><rect x="-280" y="-34" width="560" height="64" rx="8" fill="#fff" stroke="${C.verde}" stroke-width="3"/>${rotulo("", 0, 8, "furo, corte ou solda: só com autorização da engenharia", { anc: "middle", tam: 22, cor: C.verde })}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("maq"), P(t, m.f) * (1 - P(t, m.e))); vis(q("furo"), P(t, m.f + 1)); vis(q("x"), P(t, m.r)); vis(q("tx"), P(t, m.r)); vis(q("eng"), P(t, m.e)); },
  };

  D.ligacoes = {
    largo: true,
    svg: () => `<g data-k="par" transform="translate(300 260)"><rect x="-220" y="-180" width="440" height="400" rx="12" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>${rotulo("", 0, -136, "Parafusada", { anc: "middle", tam: 30 })}
        <rect x="-150" y="-40" width="300" height="26" fill="${C.aco}"/><rect x="-150" y="-14" width="300" height="26" fill="${C.acoE}"/>${[-90, -30, 30, 90].map((x) => `<rect x="${x - 8}" y="-62" width="16" height="96" fill="${C.escuro}"/><rect x="${x - 16}" y="-70" width="32" height="12" rx="2" fill="${C.escuro}"/><rect x="${x - 16}" y="30" width="32" height="12" rx="2" fill="${C.escuro}"/>`).join("")}
        ${rotulo("", 0, 110, "a mais usada na obra", { anc: "middle", tam: 22, cor: C.cinza })}${rotulo("", 0, 145, "Módulo 4", { anc: "middle", tam: 22, cor: C.azul })}</g>
      <g data-k="sol" transform="translate(880 260)"><rect x="-220" y="-180" width="440" height="400" rx="12" fill="#fff" stroke="#D9DCE8" stroke-width="2"/>${rotulo("", 0, -136, "Soldada", { anc: "middle", tam: 30 })}
        <rect x="-150" y="-20" width="140" height="30" fill="${C.aco}"/><rect x="10" y="-20" width="140" height="30" fill="${C.aco}"/><path d="M-10 -20l10 -12l10 12z" fill="${C.ambar}"/><rect x="-10" y="-20" width="20" height="30" fill="${C.ambar}"/>
        ${rotulo("", 0, 80, "principalmente em fábrica", { anc: "middle", tam: 22, cor: C.cinza })}${rotulo("", 0, 110, "na obra: só onde o projeto prevê,", { anc: "middle", tam: 20, cor: C.cinza })}${rotulo("", 0, 136, "soldador qualificado", { anc: "middle", tam: 20, cor: C.cinza })}${rotulo("", 0, 172, "Módulo 5", { anc: "middle", tam: 22, cor: C.azul })}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("par"), P(t, m.p)); vis(q("sol"), P(t, m.s)); },
  };

  D.caminho = {
    largo: true,
    svg: (u) => [["pr", "Projeto"], ["fa", "Fabricação"], ["pi", "Pintura"], ["ex", "Expedição"], ["mo", "Montagem"], ["db", "Data book"]]
      .map(([k, nome], i) => `<g data-k="${k}" transform="translate(${110 + i * 192} 230)"><rect x="-82" y="-60" width="164" height="120" rx="12" fill="${k === "mo" ? C.vermelho : C.azul}"/>
        ${rotulo("", 0, 10, nome, { anc: "middle", cor: "#fff", tam: 24 })}${i < 5 ? `<path d="M88 0h24" stroke="${C.escuro}" stroke-width="5" marker-end="url(#pe-${u})"/>` : ""}</g>`).join("")
      + `<g data-k="sa">${rotulo("", 494, 330, "jateamento, em geral Sa 2½", { anc: "middle", tam: 20, cor: C.cinza })}</g>
      <g data-k="pit" transform="translate(590 450)"><rect x="-420" y="-40" width="840" height="76" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="3"/>${rotulo("", 0, 10, "PIT: cada etapa tem inspeção e registro", { anc: "middle", tam: 28 })}</g>`,
    quadro(raiz, t, m, c, q) { ["pr", "fa", "pi", "ex", "mo", "db"].forEach((k) => vis(q(k), P(t, m[k]))); vis(q("sa"), P(t, m.pi + .5)); vis(q("pit"), P(t, m.pt)); },
  };

  D.corrosao = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/>${caibro(120, CHAO, 60)}${caibro(480, CHAO, 60)}
      ${viga("", 80, CHAO - 14 - 50, 520, 50)}
      <g data-k="risco"><path d="M300 ${CHAO - 50}l60 -8l40 6" fill="none" stroke="#B5651D" stroke-width="6"/><circle cx="350" cy="${CHAO - 46}" r="44" fill="none" stroke="${C.vermelho}" stroke-width="4"/></g>
      <g data-k="ret"><rect x="300" y="${CHAO - 64}" width="100" height="30" rx="4" fill="${C.aco}" opacity=".95"/>${pessoa("", 440, CHAO, { pose: "aponta", esc: .9 })}${rotulo("", 350, CHAO - 150, "registrar e retocar", { anc: "middle", cor: C.verde })}</g>
      <g data-k="zn" transform="translate(410 130)"><rect x="-300" y="-40" width="600" height="70" rx="8" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${rotulo("", 0, 4, "pintura ou galvanização (zinco)", { anc: "middle", tam: 24 })}</g>
      <g data-k="cuid" transform="translate(410 230)">${rotulo("", 0, 0, "cinta de poliéster · calço de madeira · nunca arrastar", { anc: "middle", tam: 22, cor: C.cinza })}</g>`,
    quadro(raiz, t, m, c, q) { vis(q("zn"), P(t, m.z)); vis(q("risco"), P(t, m.a) * (1 - P(t, m.r + 1))); vis(q("ret"), P(t, m.r)); vis(q("cuid"), P(t, m.c)); },
  };
})();
