import Link from "next/link";
import { and, desc, eq, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Campo, Cartao, Entrada, LinkBotao, Selecao, Selo, Vazio } from "@/components/ui";
import { dossieAdmissional, termosDoColaborador } from "@/lib/servicos/admissao";
import { ddsParaConfirmar } from "@/lib/servicos/psicossocial";
import { fmtData, TIPO_DOC } from "@/lib/formato";
import { exigirColaborador } from "@/lib/sessao";
import { confirmarPresencaAcao, enviarDocumentoAcao, enviarItemAdmissionalAcao } from "../acoes";

const SIT: Record<string, { rotulo: string; cor: string }> = {
  ENTREGUE: { rotulo: "Conferido", cor: "verde" }, EM_CONFERENCIA: { rotulo: "Em conferência", cor: "amarelo" },
  REJEITADO: { rotulo: "Envie de novo", cor: "vermelho" }, FALTA: { rotulo: "Falta enviar", cor: "cinza" }, VENCIDO: { rotulo: "Vencido", cor: "vermelho" },
};

export const metadata = { title: "Meus documentos" };

export default async function Documentos() {
  const a = await exigirColaborador();
  const docs = await db.query.documentos.findMany({
    where: and(eq(schema.documentos.colaboradorId, a.colaboradorId!), ne(schema.documentos.tipo, "ADMISSIONAL")),
    orderBy: desc(schema.documentos.enviadoEm),
  });
  const [dossie, termos] = await Promise.all([dossieAdmissional(a.colaboradorId!), termosDoColaborador(a.colaboradorId!)]);
  const termosPend = termos.filter((t) => t.situacao !== "ASSINADO");
  const ddsPend = await ddsParaConfirmar(a.colaboradorId!);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-palla-azul-escuro">Meus documentos</h1>

      {ddsPend.length > 0 && (
        <Cartao titulo="DDS para confirmar presença">
          <ul className="divide-y divide-linha text-sm">
            {ddsPend.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <span><span className="font-medium">{d.tema}</span><span className="block text-xs text-tinta-suave">{fmtData(d.data)} · {d.conduzidoPor}</span></span>
                <Formulario acao={confirmarPresencaAcao.bind(null, d.id)} rotulo="Participei" className=""><span /></Formulario>
              </li>
            ))}
          </ul>
        </Cartao>
      )}

      {termos.length > 0 && (
        <Cartao titulo="Termos para assinar" acao={<Selo cor={termosPend.length ? "amarelo" : "verde"}>{termosPend.length ? `${termosPend.length} pendente(s)` : "Tudo assinado"}</Selo>}>
          <ul className="divide-y divide-linha text-sm">
            {termos.map((t) => (
              <li key={t.modelo.id} className="flex items-center justify-between gap-3 py-3">
                <span><span className="font-medium">{t.modelo.titulo}</span>
                  <span className="block text-xs text-tinta-suave">{t.situacao === "ASSINADO" ? `Assinado em ${fmtData(t.assinatura!.assinadoEm)} · código ${t.assinatura!.codigo}` : t.situacao === "NOVA_VERSAO" ? "O texto foi atualizado: leia e assine a nova versão" : t.modelo.naAdmissao ? "Obrigatório na admissão" : "Opcional"}</span>
                </span>
                {t.situacao === "ASSINADO"
                  ? <Link href={`/colaborador/termos/${t.modelo.id}`} className="text-sm font-semibold text-palla-azul">Ver</Link>
                  : <LinkBotao href={`/colaborador/termos/${t.modelo.id}`}>Ler e assinar</LinkBotao>}
              </li>
            ))}
          </ul>
        </Cartao>
      )}

      <Cartao titulo="Documentos da admissão" acao={<Selo cor={dossie.pendentes ? "amarelo" : "verde"}>{dossie.entregues}/{dossie.total} conferidos</Selo>}>
        <ul className="divide-y divide-linha text-sm">
          {dossie.linhas.map(({ item, doc, situacao }) => (
            <li key={item.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <span><span className="font-medium">{item.nome}</span>{!item.obrigatorio && <span className="text-xs text-tinta-suave"> (se tiver)</span>}
                  {item.orientacao && <span className="block text-xs text-tinta-suave">{item.orientacao}</span>}
                  {doc?.observacao && situacao === "REJEITADO" && <span className="block text-xs text-red-700">Motivo: {doc.observacao}</span>}
                </span>
                <Selo cor={SIT[situacao].cor}>{item.quemEnvia === "EQUIPE" && situacao === "FALTA" ? "O RH registra" : SIT[situacao].rotulo}</Selo>
              </div>
              {item.quemEnvia === "COLABORADOR" && (situacao === "FALTA" || situacao === "REJEITADO" || situacao === "VENCIDO") && (
                <Formulario acao={enviarItemAdmissionalAcao.bind(null, item.id)} rotulo="Enviar" variante="secundario" className="mt-2 flex flex-wrap items-end gap-2" limparAoConcluir>
                  <div className="min-w-48 flex-1"><Entrada name="arquivo" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" capture="environment" required /></div>
                  {item.exigeValidade && <div className="w-40"><Entrada name="validoAte" type="date" required aria-label="Validade" /></div>}
                </Formulario>
              )}
            </li>
          ))}
        </ul>
      </Cartao>
      <Cartao titulo="Outros documentos (ASO, certificados, cliente)">
        <Formulario acao={enviarDocumentoAcao} rotulo="Enviar" limparAoConcluir>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Tipo">
              <Selecao name="tipo" defaultValue="ASO">
                <option value="ASO">ASO (atestado de saúde ocupacional)</option>
                <option value="CERTIFICADO_EXTERNO">Certificado de outro curso</option>
                <option value="DOCUMENTO_CONTRATANTE">Documento pedido pelo cliente</option>
                <option value="OUTRO">Outro</option>
              </Selecao>
            </Campo>
            <Campo rotulo="Data de emissão"><Entrada name="emitidoEm" type="date" /></Campo>
          </div>
          <Campo rotulo="Descrição"><Entrada name="descricao" placeholder="Ex.: ASO admissional" /></Campo>
          <Campo rotulo="Arquivo" ajuda="PDF ou foto legível, até 10 MB."><Entrada name="arquivo" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" capture="environment" required /></Campo>
        </Formulario>
      </Cartao>
      <Cartao titulo="Enviados">
        {docs.length === 0 ? <Vazio>Nenhum documento enviado.</Vazio> : (
          <ul className="divide-y divide-linha text-sm">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <span><span className="font-medium">{TIPO_DOC[d.tipo]}</span> · {d.descricao}<span className="block text-xs text-tinta-suave">Enviado em {fmtData(d.enviadoEm)}{d.validoAte && ` · válido até ${fmtData(d.validoAte)}`}{d.observacao && ` · ${d.observacao}`}</span></span>
                <Selo cor={d.status === "CONFERIDO" ? "verde" : d.status === "REJEITADO" ? "vermelho" : "amarelo"}>{d.status === "CONFERIDO" ? "Conferido" : d.status === "REJEITADO" ? "Rejeitado" : "Em conferência"}</Selo>
              </li>
            ))}
          </ul>
        )}
      </Cartao>
    </div>
  );
}
