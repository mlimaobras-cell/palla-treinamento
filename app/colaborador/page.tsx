import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Aviso, Cartao, LinkBotao, Progresso, Selo, Semaforo, Vazio } from "@/components/ui";
import { CLASSIFICACAO, fmtData, fmtHoras, MODALIDADE, STATUS_MATRICULA } from "@/lib/formato";
import { exigirColaborador } from "@/lib/sessao";
import { atualizarVencidos, certificadosDoColaborador } from "@/lib/servicos/certificacao";
import { avaliarColaborador } from "@/lib/servicos/conformidade";
import { registrarCienciaAcao } from "./acoes";

export const metadata = { title: "Minha trilha" };

export default async function PainelColaborador() {
  const a = await exigirColaborador();
  await atualizarVencidos();
  const { colaborador: c, itens, semaforo } = await avaliarColaborador(a.colaboradorId!);
  const funcao = await db.query.funcoes.findFirst({ where: eq(schema.funcoes.id, c.funcaoId) });
  const matriculas = await db.query.matriculas.findMany({
    where: eq(schema.matriculas.colaboradorId, c.id),
    with: { curso: { with: { capitulos: { with: { aulas: true } } } }, progresso: true },
  });
  const ativas = matriculas.filter((m) => m.status !== "CANCELADA").sort((x, y) => x.curso.ordem - y.curso.ordem);
  const exigidas = ativas.filter((m) => m.classificacao !== "RECOMENDADO");
  const recomendadas = ativas.filter((m) => m.classificacao === "RECOMENDADO");
  const certs = await certificadosDoColaborador(c.id);

  const pct = (m: (typeof ativas)[number]) => {
    if (m.status === "CAPACITADO") return 100;
    const aulas = m.curso.capitulos.flatMap((x) => x.aulas);
    if (!aulas.length) return ["AGUARDANDO_APROVACAO"].includes(m.status) ? 90 : 0;
    const feitas = aulas.filter((au) => m.progresso.some((p) => p.aulaId === au.id && p.concluidaEm)).length;
    const base = (feitas / aulas.length) * 80;
    return m.teoriaConcluidaEm ? 85 + (m.status === "AGUARDANDO_APROVACAO" ? 10 : 0) : base;
  };
  const integracao = ativas.find((m) => m.curso.codigo === "INT-01" || m.curso.codigo === "INT-02");
  const ultimo = await db.query.progressoAulas.findFirst({
    where: (p, { inArray }) => inArray(p.matriculaId, ativas.map((m) => m.id).concat("—")),
    orderBy: desc(schema.progressoAulas.ultimoAcessoEm),
  });
  const continuar = ultimo && ativas.find((m) => m.id === ultimo.matriculaId && ["EM_ANDAMENTO", "MATRICULADO"].includes(m.status));
  const pendPratica = ativas.filter((m) => m.status === "PENDENTE_PRATICA" || (m.curso.modalidade === "PRESENCIAL" && ["MATRICULADO", "EM_ANDAMENTO"].includes(m.status)));
  const pendAvaliacao = ativas.filter((m) => {
    const aulas = m.curso.capitulos.flatMap((x) => x.aulas);
    return m.status === "EM_ANDAMENTO" && aulas.length > 0 && aulas.every((au) => m.progresso.some((p) => p.aulaId === au.id && p.concluidaEm));
  });

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl bg-palla-azul-escuro text-white">
        <div className="relative p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Bem-vindo à Palla Construções</p>
          <h1 className="mt-1 text-2xl font-semibold">{c.nome}</h1>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-white/60">Função</dt><dd className="font-medium">{funcao?.nome}</dd></div>
            <div><dt className="text-white/60">Obra</dt><dd className="font-medium">{c.obra?.nome ?? "A definir"}</dd></div>
          </dl>
          {integracao && <div className="mt-5 [&_*]:!text-white/90"><Progresso valor={pct(integracao)} rotulo="Progresso da integração" /></div>}
          <div className="absolute bottom-0 left-0 h-1.5 w-32 bg-palla-vermelho" aria-hidden />
        </div>
      </section>

      {continuar && ultimo && (
        <LinkBotao href={`/colaborador/curso/${continuar.id}/aula/${ultimo.aulaId}`} className="w-full py-3">Continuar de onde parei: {continuar.curso.titulo}</LinkBotao>
      )}

      <Cartao titulo="Situação da documentação" acao={<Semaforo valor={semaforo} />}>
        <ul className="divide-y divide-linha text-sm">
          {itens.filter((i) => i.situacao !== "OK").slice(0, 6).map((i) => (
            <li key={i.descricao} className="flex items-start justify-between gap-3 py-2">
              <span>{i.descricao}<span className="block text-xs text-tinta-suave">{i.detalhe}</span></span>
              <Selo cor={i.situacao === "IMPEDITIVO" ? "vermelho" : "amarelo"}>{i.situacao === "IMPEDITIVO" ? "Impede" : "Pendente"}</Selo>
            </li>
          ))}
          {itens.every((i) => i.situacao === "OK") && <li className="py-2 text-emerald-800">Tudo conferido. A liberação final é feita pelo responsável da obra.</li>}
        </ul>
        <p className="mt-3 text-xs text-tinta-suave">Concluir cursos não libera o acesso à obra automaticamente: a liberação depende de todos os requisitos e da aprovação de um responsável.</p>
      </Cartao>

      {(pendAvaliacao.length > 0 || pendPratica.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {pendAvaliacao.length > 0 && <Aviso tom="info"><strong>Avaliações liberadas:</strong> {pendAvaliacao.map((m) => m.curso.titulo).join(", ")}.</Aviso>}
          {pendPratica.length > 0 && <Aviso tom="alerta"><strong>Etapas presenciais pendentes:</strong> {pendPratica.map((m) => m.curso.titulo).join(", ")}. A SST vai agendar com você.</Aviso>}
        </div>
      )}

      <Cartao titulo={`Cursos obrigatórios da função (${exigidas.length})`}>
        <ul className="space-y-3">
          {exigidas.map((m) => (
            <li key={m.id}>
              <Link href={`/colaborador/curso/${m.id}`} className="block rounded-xl border border-linha p-4 transition hover:border-palla-azul/50 hover:bg-palla-azul-claro/40">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-palla-azul-escuro">{m.curso.titulo}</p>
                    <p className="mt-0.5 text-xs text-tinta-suave">{m.curso.codigo} · {fmtHoras(m.curso.cargaHoraria)} · {MODALIDADE[m.curso.modalidade]} · {CLASSIFICACAO[m.classificacao]}</p>
                  </div>
                  <Selo cor={STATUS_MATRICULA[m.status].cor}>{STATUS_MATRICULA[m.status].rotulo}</Selo>
                </div>
                <div className="mt-3"><Progresso valor={pct(m)} /></div>
              </Link>
            </li>
          ))}
        </ul>
      </Cartao>

      {recomendadas.length > 0 && (
        <Cartao titulo="Cursos recomendados">
          <ul className="grid gap-2 sm:grid-cols-2">
            {recomendadas.map((m) => (
              <li key={m.id}><Link href={`/colaborador/curso/${m.id}`} className="block rounded-lg border border-linha p-3 text-sm hover:border-palla-azul/50"><span className="font-medium">{m.curso.titulo}</span><span className="block text-xs text-tinta-suave">{STATUS_MATRICULA[m.status].rotulo}</span></Link></li>
            ))}
          </ul>
        </Cartao>
      )}

      <Cartao titulo="Meus certificados e comprovantes">
        {certs.length === 0 ? <Vazio>Os certificados aparecem aqui depois da aprovação do responsável técnico.</Vazio> : (
          <ul className="divide-y divide-linha">
            {certs.map((ce) => (
              <li key={ce.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{ce.dadosSnapshot.cursoTitulo}</p>
                  <p className="text-xs text-tinta-suave">
                    {ce.tipo === "INTEGRAL" ? "Certificado" : "Comprovante de etapa"} {ce.numero} · {fmtData(ce.emitidoEm)}
                    {ce.validoAte && ` · válido até ${fmtData(ce.validoAte)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {ce.status !== "VALIDO" && <Selo cor="vermelho">{ce.status === "CANCELADO" ? "Cancelado" : "Substituído"}</Selo>}
                  {ce.tipo === "INTEGRAL" && ce.status === "VALIDO" && !ce.cienciaTrabalhadorEm && (
                    <form action={registrarCienciaAcao.bind(null, ce.id)}><button className="rounded-lg px-3 py-2 text-xs font-semibold text-palla-azul ring-1 ring-inset ring-linha hover:bg-slate-50">Confirmar recebimento</button></form>
                  )}
                  <a href={`/api/certificados/${ce.id}/pdf`} className="rounded-lg bg-palla-azul px-3 py-2 text-xs font-semibold text-white hover:bg-palla-azul-escuro">Baixar PDF</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Cartao>
    </div>
  );
}
