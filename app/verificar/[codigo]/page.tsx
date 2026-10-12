import Link from "next/link";
import { CabecalhoPublico } from "@/components/marca";
import { Aviso } from "@/components/ui";
import { fmtData, fmtHoras, MODALIDADE, nomeAbreviado } from "@/lib/formato";
import { verificarPublico } from "@/lib/servicos/certificacao";

export const metadata = { title: "Verificação de certificado", robots: { index: false } };

export default async function Resultado({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const r = await verificarPublico(codigo);
  const c = r?.c;
  const d = c?.dadosSnapshot;
  const status = c && {
    VALIDO: { t: c.tipo === "INTEGRAL" ? "Certificado autêntico e válido" : "Comprovante de etapa autêntico", tom: "sucesso" as const },
    CANCELADO: { t: "Documento CANCELADO", tom: "erro" as const },
    SUBSTITUIDO: { t: "Documento SUBSTITUÍDO por nova emissão", tom: "alerta" as const },
  }[c.status];
  const vencido = c?.validoAte && c.validoAte < new Date();
  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-palla-azul-escuro">Verificação de autenticidade</h1>
        <p className="mt-1 font-mono text-sm text-tinta-suave">Código {codigo.toUpperCase()}</p>
        {!c || !d || !status ? (
          <div className="mt-6"><Aviso tom="erro">Nenhum documento encontrado com este código. Confira a digitação.</Aviso></div>
        ) : (
          <div className="mt-6 space-y-4">
            <Aviso tom={vencido && c.status === "VALIDO" ? "alerta" : status.tom}>
              <strong>{status.t}{vencido && c.status === "VALIDO" ? " — prazo de validade encerrado" : ""}</strong>
              {c.tipo === "COMPROVANTE_ETAPA" && <span className="block">Comprova apenas a etapa teórica. Não é certificado de capacitação.</span>}
              {c.motivoStatus && c.status !== "VALIDO" && <span className="block">Motivo: {c.motivoStatus}</span>}
              {r.substituto && <span className="block">Documento atual: <Link className="font-semibold underline" href={`/verificar/${r.substituto.codigoVerificacao}`}>{r.substituto.numero}</Link></span>}
            </Aviso>
            <dl className="grid gap-x-6 gap-y-4 rounded-xl border border-linha bg-white p-5 sm:grid-cols-2">
              {[
                ["Número", c.numero],
                ["Participante", nomeAbreviado(d.colaboradorNome)],
                ["Treinamento", d.cursoTitulo],
                ["Carga horária", fmtHoras(d.cargaHoraria)],
                ["Modalidade", MODALIDADE[d.modalidade]],
                ["Conclusão", fmtData(c.dataConclusao)],
                ["Validade", c.validoAte ? `até ${fmtData(c.validoAte)}` : "Sem prazo fixo na norma"],
                ["Empresa emissora", d.empresa.nome],
                ["Referência", d.normaReferencia],
                ["Emitido em", fmtData(c.emitidoEm)],
              ].map(([k, v]) => (
                <div key={k}><dt className="text-xs uppercase tracking-wide text-tinta-suave">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
              ))}
            </dl>
            <p className="text-xs text-tinta-suave">Por proteção de dados, esta página não exibe CPF nem o nome completo do participante.</p>
          </div>
        )}
      </main>
    </>
  );
}
