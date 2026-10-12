import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Campo, Cartao, Entrada, Selecao, Selo, Vazio } from "@/components/ui";
import { fmtData, TIPO_DOC } from "@/lib/formato";
import { exigirColaborador } from "@/lib/sessao";
import { enviarDocumentoAcao } from "../acoes";

export const metadata = { title: "Meus documentos" };

export default async function Documentos() {
  const a = await exigirColaborador();
  const docs = await db.query.documentos.findMany({
    where: eq(schema.documentos.colaboradorId, a.colaboradorId!),
    orderBy: desc(schema.documentos.enviadoEm),
  });
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-palla-azul-escuro">Meus documentos</h1>
      <Cartao titulo="Enviar documento">
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
