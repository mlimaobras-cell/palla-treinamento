// Ilustrações do Módulo 8 (cobertura e fechamento). Conteúdo: Caderno do Módulo 8 (revisão 2).
// Valores do caderno vêm de instruções de trabalho de referência: o vídeo os apresenta como referência e remete ao projeto e ao fabricante.
(function () {
  const { C, pessoa, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 500, LP = "#D9DCE8", TELHA = "#8FA3BF", MANTA = "#E8C24A", MAST = "#3A3F55";
  const T = (x, y, txt, tam = 20, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;
  const caixa = (k, x, y, w, h, titulo, corpo, sub = "", cor = null) => `<g data-k="${k}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${cor ?? LP}" stroke-width="${cor ? 4 : 2}"/>
    ${T(0, 38, titulo, 22, cor ?? C.escuro, "middle", 700)}${corpo}${sub ? `<foreignObject x="${-w / 2 + 10}" y="${h - 86}" width="${w - 20}" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="font:500 17px 'IBM Plex Sans';text-align:center;color:${C.cinza};line-height:1.25">${sub}</div></foreignObject>` : ""}</g>`;
  const trapezio = (x, y, w, n, cor = TELHA) => { let d = `M${x} ${y}`; const p = w / n; for (let i = 0; i < n; i++) d += `l${p * .2} -18h${p * .3}l${p * .2} 18h${p * .3}`; return `<path d="${d}v10h${-w}z" fill="${cor}" stroke="#6E7F9A" stroke-width="1.5"/>`; };
  const terca = (x, y) => `<path d="M${x - 20} ${y}h40v8h-34v40h34v8h-40z" fill="${C.aco}"/>`;

  // ------------------------------------------------------------ 8.1 camadas, manta e telha
  D.camadas = {
    svg: () => `<g transform="translate(0 0)">${[160, 410, 660].map((x) => terca(x, 300)).join("")}<g data-k="te">${T(410, 400, "terças", 18, C.cinza, "middle", 700)}</g>
      <rect data-k="ma" x="60" y="282" width="700" height="18" fill="${MANTA}"/>
      <g data-k="tl">${trapezio(60, 282, 700, 10)}</g>
      <g data-k="ar"><path d="M760 282h30v-60h-40" fill="none" stroke="${C.escuro}" stroke-width="6"/><path d="M30 290h40v40q-20 20 -40 0z" fill="#6E7799"/></g>
      ${[["te", 360, "1. terça (estrutura secundária)"], ["ma", 300, "2. manta termoacústica"], ["tl", 250, "3. telha"], ["ar", 200, "4. arremates: calha, rufo, cumeeira"]].map(([k, y, txt]) => `<g data-k="L${k}">${T(410, y - 120, txt, 20, C.escuro, "middle", 700)}</g>`).join("")}
      <g data-k="es" transform="translate(410 470)"><rect x="-380" y="-36" width="760" height="72" rx="10" fill="${C.vermelho}"/>${T(0, -6, "cobertura só com a estrutura alinhada, aprumada e com torque", 19, "#fff", "middle", 700)}${T(0, 22, "terça desalinhada vira telha ondulada e vazamento", 17, "#fff", "middle", 600)}</g></g>`,
    quadro(raiz, t, m, c, q) {
      ["te", "ma", "tl", "ar"].forEach((k) => { vis(q(k), P(t, m[k])); const ks = ["te", "ma", "tl", "ar"]; const nx = ks.map((kk) => m[kk] ?? 99).filter((x) => x > (m[k] ?? 99)); const fim = Math.min(...nx, 1e9); vis(q(`L${k}`), P(t, m[k]) * (t > 50 ? 0 : 1 - P(t, fim - .2, .3))); });
      vis(q("es"), P(t, m.es));
    },
  };
  D.manta = {
    svg: () => `<g transform="translate(60 80)"><rect width="700" height="360" fill="#EEF0F6"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M0 ${30 + i * 75}h700" stroke="${C.aco}" stroke-width="8"/>`).join("")}
        ${[0, 1, 2].map((i) => `<rect data-k="r${i}" x="${20 + i * 220}" y="0" width="230" height="360" fill="${MANTA}" opacity=".85"/>`).join("")}
        <g data-k="em">${[1, 2].map((i) => `<path d="M${20 + i * 220} 0v360" stroke="#B8902A" stroke-width="10"/>${[0, 1, 2, 3, 4, 5, 6].map((j) => `<path d="M${14 + i * 220} ${20 + j * 52}h12" stroke="${C.escuro}" stroke-width="3"/>`).join("")}`).join("")}</g>
        <g data-k="oi"><path d="M0 0v360" stroke="${C.vermelho}" stroke-width="20" opacity=".55"/>${T(30, 390, "beiral do oitão: faixa de manta (referência: mín. 150 mm)", 17, C.vermelho, "start", 700)}</g>
        <path data-k="lv" d="M0 180h700" stroke="${C.azul}" stroke-width="4" stroke-dasharray="12 6"/></g>
      <g data-k="lvT">${T(410, 60, "linha de vida móvel · pisar só sobre a terça", 19, C.azul, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      [0, 1, 2].forEach((i) => { const el = q(`r${i}`); el.setAttribute("height", 360 * P(t, m.l + i * .6, 1.2)); });
      vis(q("em"), P(t, m.e)); vis(q("oi"), P(t, m.o)); vis(q("lv"), P(t, m.lv)); vis(q("lvT"), P(t, m.lv));
    },
  };
  D.gabarito = {
    svg: () => `<g transform="translate(60 120)"><rect width="700" height="260" fill="#EEF0F6"/><path d="M0 -20v300" stroke="${C.verde}" stroke-width="3" stroke-dasharray="10 6"/>${T(6, -28, "referência (linha de zenital)", 16, C.verde, "start", 700)}
        ${[0, 1, 2, 3, 4, 5].map((i) => `<rect data-k="c${i}" x="${i * 110}" y="20" width="104" height="220" fill="${TELHA}" stroke="#6E7F9A" stroke-width="2"/><rect data-k="e${i}" x="${i * 110 + i * 8}" y="20" width="104" height="220" fill="none" stroke="${C.vermelho}" stroke-width="3" stroke-dasharray="6 4"/>`).join("")}
        <g data-k="mk"><path d="M0 0h104" stroke="${C.ambar}" stroke-width="6"/>${T(52, -8, "1ª telha", 16, C.ambar, "middle", 700)}</g></g>
      <g data-k="erT">${T(410, 450, "erro na 1ª marcação se soma a cada módulo", 20, C.vermelho, "middle", 700)}</g>
      <g data-k="okT">${T(410, 490, "mesma referência para todas as águas", 20, C.verde, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      vis(q("mk"), P(t, m.m));
      [0, 1, 2, 3, 4, 5].forEach((i) => { vis(q(`c${i}`), P(t, m.r + i * .3)); vis(q(`e${i}`), P(t, m.er + i * .3) * (1 - P(t, m.er + 4))); });
      vis(q("erT"), P(t, m.er)); vis(q("okT"), P(t, m.r));
    },
  };
  D.zipagem = {
    svg: () => `<g transform="translate(60 120)"><rect width="440" height="240" fill="${TELHA}"/><path d="M220 0v240" stroke="#6E7F9A" stroke-width="6"/><path data-k="cost" d="M220 0v0" stroke="${C.verde}" stroke-width="8"/>
        <g data-k="zip"><rect x="-30" y="-30" width="60" height="60" rx="8" fill="${C.ambar}"/><rect x="-10" y="-50" width="20" height="24" fill="${C.escuro}"/></g>
        <g data-k="pd">${[0, 240].map((y) => `<circle cx="220" cy="${y}" r="14" fill="none" stroke="${C.vermelho}" stroke-width="4"/>`).join("")}${T(220, 270, "pré-dobra no início e no fim", 16, C.vermelho, "middle", 700)}</g></g>
      <g data-k="pf" transform="translate(560 120)"><rect width="220" height="120" rx="10" fill="${C.escuro}"/>${T(110, 34, "perfiladeira", 18, "#fff", "middle", 700)}<rect x="20" y="56" width="180" height="40" rx="4" fill="${TELHA}"/>
        <rect y="150" width="220" height="140" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(110, 186, "a cada 2 telhas:", 18, C.azul, "middle", 700)}${T(110, 214, "medidas, aspecto,", 17, C.escuro, "middle")}${T(110, 238, "quantidade", 17, C.escuro, "middle")}<text data-k="cnt" x="110" y="272" font-size="20" font-weight="700" fill="${C.azul}" text-anchor="middle">telha 0</text></g>`,
    quadro(raiz, t, m, c, q) {
      const p = P(t, m.z, 3); q("zip").setAttribute("transform", `translate(220 ${lerp(0, 240, p)})`); vis(q("zip"), P(t, m.z) * (1 - P(t, m.z + 3.4)));
      q("cost").setAttribute("d", `M220 0v${240 * p}`); vis(q("pd"), P(t, m.pd)); vis(q("pf"), P(t, m.pf));
      q("cnt").textContent = `telha ${Math.floor(6 * P(t, m.pf + .5, 3))}${Math.floor(6 * P(t, m.pf + .5, 3)) % 2 === 0 && t > m.pf + .6 ? " · medir" : ""}`;
    },
  };
  D.pisarManta = {
    svg: () => `<g transform="translate(0 40)"><rect x="40" y="330" width="740" height="16" fill="${MANTA}"/>${[120, 420, 720].map((x) => terca(x, 346)).join("")}
      <g data-k="e"><g transform="translate(270 330)">${pessoa("", 0, 40, { pose: "neutro", esc: .9 })}</g><path d="M230 370q40 30 80 0" fill="none" stroke="${C.vermelho}" stroke-width="4"/>${xis("", 330, 160, 24)}${T(270, 120, "manta não sustenta peso", 20, C.vermelho, "middle", 700)}</g>
      <g data-k="k"><g transform="translate(560 330)">${pessoa("", 0, 0, { pose: "neutro", esc: .9 })}</g><path d="M400 180h400" stroke="${C.azul}" stroke-width="4" stroke-dasharray="10 6"/>${ok("", 640, 140, 22)}${T(580, 120, "sobre a terça, conectado", 20, C.verde, "middle", 700)}</g></g>`,
    quadro(raiz, t, m, c, q) { vis(q("e"), P(t, m.e)); vis(q("k"), P(t, m.k)); },
  };

  // ------------------------------------------------------------ 8.2 calha, rufo, fechamento
  D.calha = {
    svg: () => `<g transform="translate(410 260)"><path d="M-320 -60h640" stroke="${TELHA}" stroke-width="16"/><path d="M-300 -40v120h600v-120" fill="#C8CDD8" stroke="#6E7799" stroke-width="6"/>
        <path d="M-8 -40v120M8 -40v120" stroke="#6E7799" stroke-width="3"/>
        <g data-k="mt"><path d="M-20 -36v112M20 -36v112" stroke="${MAST}" stroke-width="6" stroke-dasharray="2 4"/>${T(0, 118, "duas linhas de mastic na emenda", 18, MAST, "middle", 700)}</g>
        <g data-k="rb">${[-30, -10, 10, 30, 50, 70].map((y) => `<circle cx="0" cy="${y - 20}" r="5" fill="${C.escuro}"/>`).join("")}<path d="M60 -50v20M54 -50h12M54 -30h12" stroke="${C.vermelho}" stroke-width="2"/>${T(76, -36, "rebite hermético a cada 40 mm (ref.)", 16, C.vermelho, "start", 700)}</g>
        <g data-k="sp">${[-220, 220].map((x) => `<path d="M${x} -60v-20h30v20" fill="none" stroke="${C.ambar}" stroke-width="6"/>`).join("")}${T(-220, -96, "suporte nos pontos do projeto", 16, C.ambar, "middle", 700)}</g></g>
      <g data-k="lv" transform="translate(410 470)">${T(0, 0, "borda: linha de vida obrigatória · fotos da vedação no diário", 19, C.azul, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["mt", "rb", "sp", "lv"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.rufo = {
    svg: () => `<rect x="80" y="160" width="40" height="340" fill="${C.aco}"/><path d="M120 200l600 80" stroke="${TELHA}" stroke-width="18"/><path d="M120 214l600 80" stroke="${MANTA}" stroke-width="8"/>
      <path d="M60 150h80l40 50" fill="none" stroke="${C.escuro}" stroke-width="8"/><path d="M60 150v120" stroke="${C.escuro}" stroke-width="8"/>
      <g data-k="tr"><rect x="430" y="70" width="320" height="90" rx="10" fill="#fff" stroke="${C.escuro}" stroke-width="2"/><path d="M460 120h130M560 112h140" stroke="${C.escuro}" stroke-width="10"/><path d="M560 104v24M590 104v24" stroke="${C.vermelho}" stroke-width="2"/>${T(590, 98, "transpasse vedado (ref.: 100 mm)", 16, C.vermelho, "middle", 700)}${T(590, 150, "fita mastic + selante", 15, C.cinza, "middle")}</g>
      <g data-k="fi">${[0, 1, 2].map((i) => `<circle cx="100" cy="${200 + i * 100}" r="6" fill="${C.ambar}"/>`).join("")}${T(160, 400, "fixação nos pontos do projeto", 17, C.ambar, "start", 700)}</g>
      <g data-k="ma">${T(400, 360, "antes: esticar a manta e encaixar os perfis", 18, C.escuro, "start", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["tr", "fi", "ma"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.pemt = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><rect x="60" y="70" width="700" height="14" fill="${C.aco}"/>${T(410, 60, "terça", 15, C.cinza, "middle")}
      <g data-k="pl"><rect x="140" y="${CHAO - 30}" width="220" height="26" rx="4" fill="${C.ambar}"/><circle cx="170" cy="${CHAO - 2}" r="10" fill="${C.escuro}"/><circle cx="330" cy="${CHAO - 2}" r="10" fill="${C.escuro}"/>
        <path d="M160 ${CHAO - 30}L340 ${CHAO - 230}M340 ${CHAO - 30}L160 ${CHAO - 230}" stroke="${C.cinza}" stroke-width="7"/><rect x="130" y="${CHAO - 250}" width="240" height="20" fill="${C.ambar}"/><path d="M130 ${CHAO - 250}v-60h240v60M130 ${CHAO - 290}h240" fill="none" stroke="${C.ambar}" stroke-width="5"/>${pessoa("", 220, CHAO - 250, { esc: .8 })}</g>
      <g data-k="ta"><path d="M220 ${CHAO - 300}L300 ${CHAO - 250}" stroke="${C.vermelho}" stroke-width="4"/><circle cx="300" cy="${CHAO - 252}" r="6" fill="${C.vermelho}"/>${T(20, CHAO - 210, "talabarte na", 16, C.vermelho, "start", 700)}${T(20, CHAO - 188, "ancoragem da", 16, C.vermelho, "start", 700)}${T(20, CHAO - 166, "plataforma", 16, C.vermelho, "start", 700)}</g>
      <g data-k="mo"><path d="M560 84v60" stroke="${C.cabo}" stroke-width="3"/><circle cx="560" cy="150" r="12" fill="none" stroke="${C.escuro}" stroke-width="4"/><path d="M560 162v40" stroke="${C.cabo}" stroke-width="3"/><rect data-k="tel" x="520" y="200" width="80" height="200" fill="${TELHA}" stroke="#6E7F9A" stroke-width="2"/>${T(600, 148, "moitão (pintura protegida)", 15, C.escuro, "start", 700)}</g>
      <g data-k="ni"><path d="M490 ${CHAO}h140" stroke="${C.vermelho}" stroke-width="5"/>${T(560, CHAO + 30, "ninguém na projeção", 17, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["pl", "ta", "mo", "ni"].forEach((k) => vis(q(k), P(t, m[k]))); q("tel").setAttribute("transform", `translate(0 ${-60 * P(t, m.mo + .5, 2)})`); },
  };

  // ------------------------------------------------------------ 8.3 riscos, deck e inspeção
  const ICOR = {
    t: `${[-60, 0, 60].map((x) => `<path d="M${x - 50} 20h100" stroke="${C.aco}" stroke-width="10"/>`).join("").slice(0, 0)}<path d="M-110 20h220" stroke="${C.aco}" stroke-width="12"/><rect x="-110" y="0" width="220" height="18" fill="${MANTA}" opacity=".6"/>${pessoa("", 0, 4, { esc: .55 })}`,
    b: `<rect x="-100" y="-10" width="200" height="60" fill="${TELHA}"/><rect x="-30" y="0" width="60" height="40" fill="#BFE0F5"/><path d="M-40 -10v-30h80v30" fill="none" stroke="${C.ambar}" stroke-width="6"/>`,
    lv: `<path d="M-100 -10h200" stroke="${C.azul}" stroke-width="5"/><path d="M-100 -30v40M100 -30v40" stroke="${C.escuro}" stroke-width="8"/>${trapezio(-100, 50, 60, 2)}`,
    v: `${trapezio(-60, 20, 120, 4)}${[0, 1, 2].map((i) => `<path d="M-110 ${-40 + i * 20}h60" stroke="#5AA9E6" stroke-width="5" stroke-linecap="round"/>`).join("")}<path d="M40 0l30 -40" stroke="${C.vermelho}" stroke-width="4"/>`,
  };
  D.riscosTelhado = {
    largo: true,
    svg: () => [["t", "Só sobre terça", "ou passarela; nunca na telha, na manta ou no zenital"], ["b", "Bordas protegidas", "bordas e zenitais protegidos antes de começar"], ["lv", "Linha de vida antes", "projetada e instalada antes da 1ª telha"], ["v", "Vento: efeito vela", "telhas e sobras amarradas"]]
      .map(([k, nome, sub], i) => caixa(k, 160 + i * 287, 40, 270, 400, nome, `<g transform="translate(0 180)">${ICOR[k]}</g>`, sub)).join("")
      + `<g data-k="ex" transform="translate(590 490)">${T(0, 0, "corte de telha: proteção facial e respiratória · sol: hidratação e pausas", 20, C.escuro, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["t", "b", "lv", "v", "ex"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.deck = {
    svg: () => `<rect x="60" y="300" width="560" height="30" fill="${C.aco}"/>${T(340, 360, "viga: topo limpo, seco, sem pintura no pino", 16, C.cinza, "middle")}
      <g data-k="fx"><path d="M60 300l30 -30h50l30 30h50l30 -30h50l30 30h50l30 -30h50l30 30h50l30 -30h50l30 30" fill="#B8BFCC" stroke="#8C93AA" stroke-width="2"/></g>
      <g data-k="pi">${[95, 255, 415, 575].map((x) => `<rect x="${x - 6 + 20}" y="248" width="12" height="52" fill="${C.cinza}"/><rect x="${x - 12 + 20}" y="240" width="24" height="10" rx="2" fill="${C.cinza}"/>`).join("")}${T(340, 220, "pinos nas ondas baixas, depois do deck", 17, C.escuro, "middle", 700)}</g>
      <g data-k="es" transform="translate(690 160)"><g transform="rotate(-8)"><rect x="-70" y="-20" width="140" height="40" fill="#B8BFCC"/><path d="M-80 -30h160v14h-160z" fill="${C.azul}" opacity=".7"/></g>${T(0, 60, "fardos: secos, inclinados,", 15, C.escuro, "middle", 700)}${T(0, 80, "sobre berços, com lona", 15, C.escuro, "middle", 700)}</g>
      <g data-k="nd" transform="translate(340 450)"><rect x="-300" y="-36" width="600" height="72" rx="10" fill="${C.vermelho}"/>${T(0, -6, "fim do dia: nenhum painel solto", 19, "#fff", "middle", 700)}${T(0, 22, "nada estocado sobre o deck", 18, "#fff", "middle", 600)}</g>`,
    quadro(raiz, t, m, c, q) { ["es", "fx", "pi", "nd"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.inspecaoCob = {
    svg: () => `${trapezio(60, 260, 460, 7)}${[110, 250, 390].map((x) => `<circle cx="${x}" cy="244" r="6" fill="${C.escuro}"/>`).join("")}
      <g data-k="ar" transform="translate(250 130)"><circle r="60" fill="#fff" stroke="${C.escuro}" stroke-width="3"/><rect x="-26" y="-6" width="52" height="12" rx="6" fill="#222"/><rect x="-14" y="-24" width="28" height="18" fill="${C.cinza}"/>${T(0, 86, "arruela de neoprene em cada autobrocante", 16, C.escuro, "middle", 700)}<path d="M0 60L0 110" stroke="${C.escuro}" stroke-width="2"/></g>
      <g data-k="li">${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${380 + i * 14}" cy="${232 + (i % 2) * 6}" r="2.5" fill="#9A6A3A"/>`).join("")}<g transform="translate(470 210) rotate(30)"><rect x="-4" y="-70" width="8" height="70" fill="#8A5A2A"/><rect x="-24" y="0" width="48" height="16" rx="3" fill="${C.ambar}"/></g>${T(420, 330, "limalha varrida a cada trecho", 17, C.escuro, "middle", 700)}</g>
      <g data-k="rt" transform="translate(680 230)"><rect x="-90" y="-80" width="180" height="160" rx="10" fill="#fff" stroke="${C.verde}" stroke-width="3"/><rect x="-30" y="-56" width="60" height="70" rx="8" fill="${C.escuro}"/><rect x="-20" y="-46" width="40" height="22" rx="3" fill="#9FE0A0"/>${T(0, 40, "retoque medido", 16, C.escuro, "middle", 700)}${T(0, 62, "verde no projeto", 16, C.verde, "middle", 700)}</g>
      <g data-k="ab" transform="translate(410 450)">${T(0, 0, "fotos e registro no diário", 20, C.azul, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["ar", "li", "rt", "ab"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
})();
