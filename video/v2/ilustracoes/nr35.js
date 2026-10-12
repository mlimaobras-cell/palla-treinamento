// Ilustrações do vídeo de apoio da NR-35. Conteúdo: db/conteudo/nr35.ts (NR-35 com a Portaria MTE nº 1.259/2026) e Caderno do Instrutor NR-35.
// Material de apoio: não substitui o treinamento presencial (35.4.5).
(function () {
  const { C, pessoa, ok, xis, num, rotulo, vis, pos, lerp, pisca } = B;
  const D = window.DESENHOS;
  const P = (t, ini, dur = .6) => prog(t, ini ?? 99, dur);
  const CHAO = 500, LP = "#D9DCE8";
  const T = (x, y, txt, tam = 20, cor = C.escuro, anc = "start", peso = 600) => `<text x="${x}" y="${y}" font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;

  D.autorizacao = {
    svg: (u) => `${[["c", "capacitado", "treinamento presencial"], ["s", "saúde avaliada", "NR-07"], ["a", "considerado apto", "pela organização"]].map(([k, nome, sub], i) => `<g data-k="${k}" transform="translate(${130 + i * 190} 150)"><circle r="56" fill="${C.azul}"/>${ok("", 0, 0, 26)}${T(0, 96, nome, 20, C.escuro, "middle", 700)}${T(0, 120, sub, 16, C.cinza, "middle")}</g>`).join("")}
      <g data-k="au" transform="translate(320 380)"><path d="M-40 -110v40M150 -110v40M-230 -110v40" stroke="${C.escuro}" stroke-width="3"/><path d="M-230 -70h380" stroke="${C.escuro}" stroke-width="3"/><path d="M-40 -70v24" stroke="${C.escuro}" stroke-width="3" marker-end="url(#pe-${u})"/>
        <rect x="-210" y="-40" width="340" height="100" rx="12" fill="${C.verde}"/>${T(-40, 2, "AUTORIZAÇÃO FORMAL", 22, "#fff", "middle", 700)}${T(-40, 32, "da organização (35.4.1)", 17, "#fff", "middle", 600)}</g>
      <g data-k="ce" transform="translate(690 420)"><rect x="-100" y="-70" width="200" height="140" rx="8" fill="#fff" stroke="${C.escuro}" stroke-width="2"/>${T(0, -30, "certificado", 20, C.azul, "middle", 700)}${T(0, 0, "de treinamento", 16, C.cinza, "middle")}<path d="M-120 -90L120 90" stroke="${C.vermelho}" stroke-width="5"/>${T(0, 110, "certificado ≠ autorização", 18, C.vermelho, "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["c", "s", "a", "au", "ce"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  D.rotinaPt = {
    svg: (u) => `<g data-k="r" transform="translate(200 150)"><rect x="-170" y="-70" width="340" height="140" rx="12" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -30, "rotina", 24, C.azul, "middle", 700)}${T(0, 4, "análise de risco no", 18, C.escuro, "middle")}${T(0, 28, "procedimento operacional", 18, C.escuro, "middle")}</g>
      <g data-k="n" transform="translate(600 150)"><rect x="-190" y="-70" width="380" height="140" rx="12" fill="#fff" stroke="${C.vermelho}" stroke-width="3"/>${T(0, -30, "não rotina", 24, C.vermelho, "middle", 700)}${T(0, 4, "PT aprovada antes de começar", 18, C.escuro, "middle")}${T(0, 28, "vale para a atividade e o turno", 18, C.escuro, "middle")}</g>
      <g data-k="ci" transform="translate(410 380)"><rect x="-380" y="-90" width="760" height="190" rx="12" fill="${C.escuro}"/>${T(0, -50, "condição impeditiva: não começa, ou para", 23, "#fff", "middle", 700)}
        ${["vento acima do plano", "chuva", "descarga atmosférica", "ancoragem não liberada", "equipamento reprovado", "mal-estar"].map((s, i) => `${T(-340 + (i % 3) * 250, 0 + Math.floor(i / 3) * 50, `• ${s}`, 18, "#C9CCE0", "start", 600)}`).join("")}</g>`,
    quadro(raiz, t, m, c, q) { ["r", "n", "ci"].forEach((k) => vis(q(k), P(t, m[k]))); },
  };
  // fator de queda e zona livre: dois cenários lado a lado
  D.zonaLivre = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="4"/><rect x="0" y="${CHAO - 230}" width="820" height="16" fill="${C.aco}"/>${T(20, CHAO - 240, "4 m", 18, C.cinza)}
      ${[["b", 230, CHAO - 214, "ancorado no pé", C.vermelho], ["a", 600, CHAO - 380, "ancorado acima da cabeça", C.verde]].map(([k, x, ay, nome, cor]) => `<g data-k="${k}"><circle cx="${x}" cy="${ay}" r="9" fill="${C.escuro}"/>${k === "a" ? `<path d="M${x} ${ay}v-30" stroke="${C.escuro}" stroke-width="6"/>` : ""}
        <g data-k="${k}P">${pessoa("", 0, 0, { esc: .85 })}</g><path data-k="${k}L" stroke="${C.ambar}" stroke-width="5"/>${T(x, 60, nome, 20, cor, "middle", 700)}</g>`).join("")}
      <g data-k="bx">${xis("", 330, CHAO - 40, 22)}${T(330, CHAO + 34, "bate no chão", 18, C.vermelho, "middle", 700)}</g>
      <g data-k="ax">${ok("", 700, CHAO - 120, 22)}${T(700, CHAO + 34, "para antes do solo", 18, C.verde, "middle", 700)}</g>
      <g data-k="z" transform="translate(24 130)">${T(0, 0, "fator de queda e zona livre", 19, C.escuro, "start", 700)}${T(0, 26, "entram na análise de risco", 19, C.escuro, "start", 700)}</g>`,
    quadro(raiz, t, m, c, q) {
      const qb = P(t, m.b + .8, .9), qa = P(t, m.a + .8, .9);
      const yb = lerp(CHAO - 230, CHAO, qb), ya = lerp(CHAO - 230, CHAO - 120, qa);
      q("bP").setAttribute("transform", `translate(280 ${yb})`); q("aP").setAttribute("transform", `translate(640 ${ya})`);
      q("bL").setAttribute("d", `M230 ${CHAO - 214}L280 ${yb - 70}`); q("aL").setAttribute("d", `M600 ${CHAO - 380}L640 ${ya - 70}`);
      vis(q("b"), P(t, m.b)); vis(q("a"), P(t, m.a)); vis(q("bx"), P(t, m.b + 1.8)); vis(q("ax"), P(t, m.a + 1.8)); vis(q("z"), P(t, m.z));
    },
  };
  D.inspecaoSpiq = {
    svg: () => `<g transform="translate(220 ${CHAO}) scale(1.8)">${pessoa("", 0, 0, { pose: "neutro" })}<path d="M-14 -88l14 20l14 -20M-12 -58h24M-12 -58l-6 24M12 -58l6 24" fill="none" stroke="${C.ambar}" stroke-width="4"/></g>
      ${[["fi", 270, 300, "fitas: corte, queimadura, desfiamento"], ["co", 240, 360, "costuras soltas ou rompidas"], ["fv", 200, 400, "fivelas e conectores: trinca, trava"], ["et", 250, 330, "etiqueta legível"]].map(([k, x, y, txt], i) => `<g data-k="${k}"><circle cx="${x}" cy="${y}" r="6" fill="${C.azul}"/><path d="M${x} ${y}L460 ${120 + i * 60}" stroke="${C.azul}" stroke-width="2"/>${T(470, 126 + i * 60, txt, 18, C.escuro, "start", 700)}</g>`).join("")}
      <g data-k="pe" transform="translate(620 380)">${T(0, 0, "rotineira: antes de cada uso", 18, C.azul, "middle", 700)}${T(0, 26, "periódica: no mínimo a cada 12 meses", 18, C.azul, "middle", 700)}</g>
      <g data-k="d" transform="translate(620 460)"><rect x="-190" y="-30" width="380" height="60" rx="10" fill="${C.vermelho}"/>${T(0, 8, "absorvedor aberto ou defeito: descartar", 18, "#fff", "middle", 700)}</g>`,
    quadro(raiz, t, m, c, q) { ["fi", "co", "fv", "et"].forEach((k, i) => vis(q(k), P(t, m.r + i * .5))); vis(q("pe"), P(t, m.pe)); vis(q("d"), P(t, m.d)); },
  };
  D.resgate = {
    svg: () => `<path d="M0 ${CHAO}h820" stroke="${C.chao}" stroke-width="3"/><rect x="40" y="120" width="440" height="16" fill="${C.aco}"/><circle cx="220" cy="128" r="8" fill="${C.escuro}"/>
      <path d="M220 128L240 250" stroke="${C.ambar}" stroke-width="5"/><g transform="translate(240 330) rotate(8)">${pessoa("", 0, 0, { esc: .9 })}</g>
      <g data-k="tm" transform="translate(110 260)"><circle r="44" fill="#fff" stroke="${C.vermelho}" stroke-width="5"/><path d="M0 0V-30" stroke="${C.vermelho}" stroke-width="5" stroke-linecap="round"/><path data-k="pt" d="M0 0H22" stroke="${C.vermelho}" stroke-width="5" stroke-linecap="round"/>${T(0, 72, "suspensão: o menor", 16, C.vermelho, "middle", 700)}${T(0, 92, "tempo possível", 16, C.vermelho, "middle", 700)}</g>
      <g data-k="eq">${pessoa("", 560, CHAO, { colete: C.vermelho })}${pessoa("", 620, CHAO, { colete: C.vermelho, flip: true })}<rect x="660" y="${CHAO - 50}" width="70" height="50" rx="6" fill="${C.vermelho}"/>${T(695, CHAO - 18, "kit", 16, "#fff", "middle", 700)}${T(620, CHAO + 34, "equipe treinada + kit posicionado", 17, C.escuro, "middle", 700)}</g>
      <g data-k="pl" transform="translate(620 140)"><rect x="-170" y="-50" width="340" height="110" rx="10" fill="#fff" stroke="${C.azul}" stroke-width="3"/>${T(0, -16, "plano de resgate antes:", 19, C.azul, "middle", 700)}${T(0, 12, "procedimento, equipe,", 17, C.escuro, "middle")}${T(0, 36, "tempo e equipamentos", 17, C.escuro, "middle")}</g>
      <g data-k="ni" transform="translate(410 ${CHAO + 34})"></g>`,
    quadro(raiz, t, m, c, q) { vis(q("tm"), P(t, m.s)); q("pt").setAttribute("transform", `rotate(${360 * ((t * .25) % 1)})`); vis(q("pl"), P(t, m.pl)); vis(q("eq"), P(t, m.eq)); },
  };
})();
