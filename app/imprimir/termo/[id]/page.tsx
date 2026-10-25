import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Marca } from "@/components/marca";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { auditar } from "@/lib/auditoria";
import { fmtDataHora } from "@/lib/formato";
import { obterAtor } from "@/lib/sessao";
import { pode } from "@/lib/permissoes";

export const metadata = { title: "Termo assinado" };

/** Via impressa de um termo assinado na plataforma (equipe com sst.ver ou o próprio colaborador). */
export default async function TermoImpresso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await obterAtor();
  if (!a) notFound();
  const t = await db.query.assinaturasTermo.findFirst({ where: eq(schema.assinaturasTermo.id, id), with: { modelo: true, colaborador: true } });
  if (!t) notFound();
  const dono = a.perfil === "COLABORADOR" && a.colaboradorId === t.colaboradorId;
  if (!dono && !pode(a, "sst.ver")) notFound();
  await auditar(a, "termo.impresso", "assinatura_termo", id, {});
  return (
    <div className="mx-auto max-w-[780px] bg-white p-8 text-[13px] text-tinta print:p-0">
      <style>{`@page { size: A4; margin: 15mm } @media print { html, body { background: #fff !important } .nao-imprimir { display: none } }`}</style>
      <div className="nao-imprimir mb-5 flex items-center justify-between rounded-lg border border-linha bg-slate-50 p-3">
        <Link href={dono ? "/colaborador/documentos" : `/admin/colaboradores/${t.colaboradorId}`} className="text-sm font-medium text-palla-azul">← Voltar</Link>
        <BotaoImprimir />
      </div>
      <header className="flex items-start justify-between border-b-2 border-palla-azul pb-3">
        <Marca className="h-10" />
        <div className="text-right text-xs text-tinta-suave"><p className="font-semibold text-palla-azul">{process.env.EMPRESA_NOME ?? "Palla Construções"}</p>{process.env.EMPRESA_CNPJ && <p>CNPJ {process.env.EMPRESA_CNPJ}</p>}</div>
      </header>
      <h1 className="mt-5 text-center text-base font-bold uppercase text-palla-azul">{t.titulo}</h1>
      <p className="text-center text-xs text-tinta-suave">Modelo {t.modelo.codigo}, versão {t.modelo.versao}</p>
      {t.invalidadoEm && <p className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-center text-xs font-semibold text-red-800">ASSINATURA INVALIDADA em {fmtDataHora(t.invalidadoEm)}: {t.motivoInvalidacao}</p>}
      <div className="mt-5 whitespace-pre-wrap leading-relaxed">{t.textoFinal}</div>
      <section className="mt-8 rounded border border-linha p-3 text-xs">
        <p className="font-semibold text-palla-azul">Registro da assinatura eletrônica</p>
        <p>Assinado por {t.colaborador.nome} (nome digitado: “{t.nomeDigitado}”), com login individual e confirmação de senha, em {fmtDataHora(t.assinadoEm)}.</p>
        <p>Código: <span className="font-mono">{t.codigo}</span> · IP: {t.ip ?? "não informado"}</p>
        <p className="break-all">SHA-256 do texto e dos dados da assinatura: <span className="font-mono">{t.hashSha256}</span></p>
        <p className="mt-1 text-tinta-suave">Assinatura eletrônica registrada na plataforma Grupo Palla | Treinamento e Integração (não é assinatura com certificado ICP-Brasil).</p>
      </section>
    </div>
  );
}
