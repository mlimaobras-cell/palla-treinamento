import Link from "next/link";
import { Formulario } from "@/components/formulario";
import { Campo, Cartao, Entrada, Selecao, Selo } from "@/components/ui";
import { fmtData, fmtDataHora } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { dossieAdmissional, termosDoColaborador } from "@/lib/servicos/admissao";
import { conferirItemAcao, enviarItemEquipeAcao, invalidarAssinaturaAcao, salvarContratoAcao } from "../../sst/acoes";

const SIT: Record<string, { rotulo: string; cor: string }> = {
  ENTREGUE: { rotulo: "Conferido", cor: "verde" }, EM_CONFERENCIA: { rotulo: "A conferir", cor: "amarelo" },
  REJEITADO: { rotulo: "Rejeitado", cor: "vermelho" }, FALTA: { rotulo: "Falta", cor: "cinza" }, VENCIDO: { rotulo: "Vencido", cor: "vermelho" },
};

/** Cartão "Admissão": dossiê de documentos, termos assinados e contrato de experiência. */
export async function CartaoAdmissao({ colaboradorId }: { colaboradorId: string }) {
  const a = await exigirEquipe("colaborador.ver");
  if (!pode(a, "sst.ver")) return null;
  const gerir = pode(a, "admissao.gerir");
  const [d, termos] = await Promise.all([dossieAdmissional(colaboradorId), termosDoColaborador(colaboradorId)]);
  const c = d.colaborador;
  const itensEquipe = d.linhas.filter((l) => l.situacao === "FALTA" || l.situacao === "REJEITADO" || l.situacao === "VENCIDO");
  return (
    <Cartao titulo="Admissão" acao={<Selo cor={d.pendentes ? "amarelo" : "verde"}>{d.entregues}/{d.total} obrigatórios</Selo>}>
      <ul className="divide-y divide-linha text-sm">
        {d.linhas.map(({ item, doc, situacao }) => (
          <li key={item.id} className="py-2">
            <div className="flex items-start justify-between gap-2">
              <span>{item.nome}{!item.obrigatorio && <span className="text-xs text-tinta-suave"> (se aplicável)</span>}
                <span className="block text-xs text-tinta-suave">{item.quemEnvia === "EQUIPE" ? "Registrado pelo RH" : "Enviado pelo colaborador"}{doc && ` · ${fmtData(doc.enviadoEm)}`}{doc?.validoAte && ` · válido até ${fmtData(doc.validoAte)}`}{doc?.observacao && ` · ${doc.observacao}`}</span>
              </span>
              <Selo cor={SIT[situacao].cor}>{SIT[situacao].rotulo}</Selo>
            </div>
            {doc?.arquivoPath && (gerir || !item.sensivel) && <a href={`/api/documentos/${doc.id}`} target="_blank" className="text-xs font-semibold text-palla-azul">Abrir (acesso registrado)</a>}
            {doc && situacao === "EM_CONFERENCIA" && gerir && (
              <Formulario acao={conferirItemAcao.bind(null, doc.id, colaboradorId)} rotulo="Registrar" variante="secundario" className="mt-2 flex flex-wrap items-end gap-2">
                <Selecao name="decisao" className="w-auto"><option value="aprovar">Conferido</option><option value="rejeitar">Rejeitar</option></Selecao>
                <div className="min-w-40 flex-1"><Entrada name="observacao" placeholder="Observação (ex.: foto ilegível)" /></div>
              </Formulario>
            )}
          </li>
        ))}
      </ul>
      {gerir && itensEquipe.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold text-palla-azul">Registrar documento de admissão</summary>
          <Formulario acao={enviarItemEquipeAcao.bind(null, colaboradorId)} rotulo="Registrar" className="mt-3 space-y-3" limparAoConcluir>
            <Campo rotulo="Item"><Selecao name="itemId">{itensEquipe.map((l) => <option key={l.item.id} value={l.item.id}>{l.item.nome}</option>)}</Selecao></Campo>
            <div className="grid gap-2 sm:grid-cols-2">
              <Campo rotulo="Válido até (se tiver validade)"><Entrada type="date" name="validoAte" /></Campo>
              <Campo rotulo="Arquivo"><Entrada type="file" name="arquivo" accept="application/pdf,image/*" required /></Campo>
            </div>
            <p className="text-xs text-tinta-suave">O que a equipe registra já entra como conferido, em nome de quem registrou.</p>
          </Formulario>
        </details>
      )}

      <h3 className="mt-5 border-t border-linha pt-4 text-sm font-semibold text-palla-azul-escuro">Termos</h3>
      {termos.length === 0 ? <p className="mt-1 text-sm text-tinta-suave">Nenhum modelo de termo aprovado. <Link href="/admin/sst/termos" className="text-palla-azul">Revisar modelos</Link></p> : (
        <ul className="mt-1 divide-y divide-linha text-sm">
          {termos.map((t) => (
            <li key={t.modelo.id} className="py-2">
              <div className="flex items-start justify-between gap-2">
                <span>{t.modelo.titulo} <span className="text-xs text-tinta-suave">v{t.modelo.versao}</span>
                  {t.assinatura && <span className="block text-xs text-tinta-suave">Assinado {fmtDataHora(t.assinatura.assinadoEm)} · código {t.assinatura.codigo} · <Link href={`/imprimir/termo/${t.assinatura.id}`} className="text-palla-azul">ver termo</Link></span>}
                </span>
                <Selo cor={t.situacao === "ASSINADO" ? "verde" : "amarelo"}>{t.situacao === "ASSINADO" ? "Assinado" : t.situacao === "NOVA_VERSAO" ? "Nova versão" : "Pendente"}</Selo>
              </div>
              {t.assinatura && gerir && (
                <details className="mt-1"><summary className="cursor-pointer text-xs text-tinta-suave">Invalidar assinatura</summary>
                  <Formulario acao={invalidarAssinaturaAcao.bind(null, t.assinatura.id, colaboradorId)} rotulo="Invalidar" variante="perigo" className="mt-2 flex gap-2"><Entrada name="motivo" placeholder="Motivo" required /></Formulario>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}

      {gerir && (
        <Formulario acao={salvarContratoAcao.bind(null, colaboradorId)} rotulo="Salvar contrato" variante="secundario" className="mt-5 space-y-3 border-t border-linha pt-4">
          <h3 className="text-sm font-semibold text-palla-azul-escuro">Contrato</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            <Campo rotulo="Admissão"><Entrada type="date" name="dataAdmissao" defaultValue={c.dataAdmissao?.toISOString().slice(0, 10)} /></Campo>
            <Campo rotulo="Experiência (dias)"><Entrada type="number" min={1} max={90} name="experienciaDias" defaultValue={c.experienciaDias ?? ""} placeholder="ex.: 45" /></Campo>
            <Campo rotulo="Prorrogação (dias)"><Entrada type="number" min={1} max={89} name="experienciaProrrogacaoDias" defaultValue={c.experienciaProrrogacaoDias ?? ""} placeholder="ex.: 45" /></Campo>
          </div>
          <p className="text-xs text-tinta-suave">Total máximo de 90 dias, com uma prorrogação (CLT, arts. 445 e 451). Os vencimentos entram nos alertas.</p>
        </Formulario>
      )}
    </Cartao>
  );
}
