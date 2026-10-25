import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Cartao, Entrada, Selecao, Selo, Tabela, TituloPagina, Vazio } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { TIPO_EXAME } from "@/lib/servicos/pcmso";
import { STATUS_PROGRAMA } from "@/lib/servicos/pgr";
import { excluirExameAcao, registrarPcmsoAcao, salvarExameAcao } from "../acoes";

export const metadata = { title: "PCMSO" };

export default async function Pcmso() {
  const a = await exigirEquipe("sst.ver");
  const editar = pode(a, "sst.editar");
  const [pcmsos, obras, pgrs, funcoes] = await Promise.all([
    db.query.pcmsos.findMany({ with: { obra: true, pgr: true, exames: { with: { ghe: true, funcao: true } } }, orderBy: desc(schema.pcmsos.criadoEm) }),
    db.query.obras.findMany({ orderBy: (o, { asc }) => asc(o.codigo) }),
    db.query.pgrs.findMany({ where: (p, { inArray }) => inArray(p.status, ["APROVADO", "EM_REVISAO"]), with: { ghes: true } }),
    db.query.funcoes.findMany({ orderBy: (f, { asc }) => asc(f.ordem) }),
  ]);
  return (
    <>
      <TituloPagina titulo="PCMSO — Programa de Controle Médico de Saúde Ocupacional" subtitulo="Registro do programa elaborado pelo médico do trabalho e da matriz de exames por GHE ou função." />
      <div className="mb-5"><Aviso tom="info">
        O PCMSO é elaborado pelo <strong>médico do trabalho</strong> com base nos riscos do PGR (NR-7). Aqui você anexa o documento assinado e <strong>transcreve</strong> os exames e periodicidades que ele definiu — a plataforma usa esses dados para sugerir a data do próximo periódico ao conferir cada ASO.
        Prontuários e resultados de exames <strong>não</strong> são guardados aqui: ficam sob a guarda do médico (NR-7; dado de saúde, LGPD art. 11).
      </Aviso></div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {pcmsos.length === 0 && <Vazio>Nenhum PCMSO registrado.</Vazio>}
          {pcmsos.map((p) => {
            const ghes = pgrs.find((g) => g.id === p.pgrId)?.ghes ?? pgrs.flatMap((g) => g.ghes);
            return (
              <Cartao key={p.id} titulo={<>{p.titulo} <span className="text-xs font-normal text-tinta-suave">v{p.versao} · {p.obra ? `Obra ${p.obra.codigo}` : "Empresa"}</span></>} acao={<Selo cor={STATUS_PROGRAMA[p.status].cor}>{p.status === "APROVADO" ? "Vigente" : STATUS_PROGRAMA[p.status].rotulo}</Selo>}>
                <p className="text-sm">Médico responsável: {p.medicoNome} · CRM {p.medicoCrm}{p.clinica && ` · ${p.clinica}`}</p>
                <p className="text-xs text-tinta-suave">Vigência desde {fmtData(p.vigenciaInicio)} · relatório analítico anual até {fmtData(p.proximoRelatorioAnual)}{p.pgr && ` · base: ${p.pgr.titulo} v${p.pgr.versao}`}</p>
                {p.arquivoPath && <a href={`/api/sst/arquivo/pcmso/${p.id}`} target="_blank" className="mt-1 inline-block text-xs font-semibold text-palla-azul">PDF assinado</a>}
                <div className="mt-3">
                  {p.exames.length === 0 ? <p className="text-sm text-tinta-suave">Nenhum exame transcrito.</p> : (
                    <Tabela cabecalho={["GHE / função", "Exame", "Quando", "Periodicidade", ""]}>
                      {p.exames.map((e) => (
                        <tr key={e.id}>
                          <td className="px-5 py-2 text-xs">{e.ghe ? `${e.ghe.codigo} · ${e.ghe.nome}` : e.funcao?.nome}</td>
                          <td className="px-5">{e.exame}{e.observacao && <span className="block text-xs text-tinta-suave">{e.observacao}</span>}</td>
                          <td className="px-5 text-xs">{e.momentos.map((m) => TIPO_EXAME[m]).join(", ")}</td>
                          <td className="px-5 text-xs">{e.periodicidadeMeses ? `${e.periodicidadeMeses} meses` : "—"}</td>
                          <td className="px-5">{editar && p.status === "APROVADO" && <Formulario acao={excluirExameAcao.bind(null, p.id, e.id)} rotulo="Excluir" variante="secundario" className=""><span /></Formulario>}</td>
                        </tr>
                      ))}
                    </Tabela>
                  )}
                </div>
                {editar && p.status === "APROVADO" && (
                  <details className="mt-3 text-sm"><summary className="cursor-pointer font-semibold text-palla-azul">Transcrever exame do PCMSO</summary>
                    <Formulario acao={salvarExameAcao.bind(null, p.id)} rotulo="Incluir" className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir>
                      <Campo rotulo="Para"><Selecao name="alvo" required>
                        {ghes.length > 0 && <optgroup label="GHE do PGR">{ghes.map((g) => <option key={g.id} value={`ghe:${g.id}`}>{g.codigo} · {g.nome}</option>)}</optgroup>}
                        <optgroup label="Função">{funcoes.map((f) => <option key={f.id} value={`funcao:${f.id}`}>{f.nome}</option>)}</optgroup>
                      </Selecao></Campo>
                      <Campo rotulo="Exame (como está no PCMSO)"><Entrada name="exame" placeholder="Ex.: Exame clínico; audiometria" required /></Campo>
                      <fieldset className="text-sm sm:col-span-2"><legend className="mb-1 font-medium">Em quais exames ocupacionais</legend>
                        <div className="flex flex-wrap gap-3">{Object.entries(TIPO_EXAME).map(([k, v]) => <label key={k} className="flex items-center gap-1.5"><input type="checkbox" name="momento" value={k} /> {v}</label>)}</div>
                      </fieldset>
                      <Campo rotulo="Periodicidade do periódico (meses)" ajuda="Exatamente como definida pelo médico."><Entrada type="number" name="periodicidadeMeses" min={1} max={60} /></Campo>
                      <Campo rotulo="Observação"><Entrada name="observacao" /></Campo>
                    </Formulario>
                  </details>
                )}
              </Cartao>
            );
          })}
        </div>
        {editar && (
          <Cartao titulo="Registrar PCMSO recebido">
            <Formulario acao={registrarPcmsoAcao} rotulo="Registrar" limparAoConcluir>
              <Campo rotulo="Título"><Entrada name="titulo" placeholder="PCMSO 2026–2027" required /></Campo>
              <Campo rotulo="Local"><Selecao name="obraId"><option value="">Empresa (todas as obras sem PCMSO próprio)</option>{obras.map((o) => <option key={o.id} value={o.id}>Obra {o.codigo}</option>)}</Selecao></Campo>
              <Campo rotulo="PGR de base"><Selecao name="pgrId"><option value="">—</option>{pgrs.map((g) => <option key={g.id} value={g.id}>{g.titulo} v{g.versao}</option>)}</Selecao></Campo>
              <Campo rotulo="Médico do trabalho responsável"><Entrada name="medicoNome" required /></Campo>
              <div className="grid gap-2 sm:grid-cols-2">
                <Campo rotulo="CRM"><Entrada name="medicoCrm" placeholder="CRM-UF 00000" required /></Campo>
                <Campo rotulo="Clínica"><Entrada name="clinica" /></Campo>
              </div>
              <Campo rotulo="Início da vigência"><Entrada type="date" name="vigenciaInicio" required /></Campo>
              <Campo rotulo="PDF assinado pelo médico"><Entrada type="file" name="arquivo" accept="application/pdf" required /></Campo>
              <p className="text-xs text-tinta-suave">A versão anterior do mesmo local passa a histórico e sua matriz de exames é copiada para conferência.</p>
            </Formulario>
          </Cartao>
        )}
      </div>
    </>
  );
}
