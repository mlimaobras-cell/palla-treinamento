import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Cartao, Entrada } from "@/components/ui";
import { CampoSenha } from "@/components/campo-senha";
import { fmtDataHora } from "@/lib/formato";
import { exigirColaborador } from "@/lib/sessao";
import { montarTermo } from "@/lib/servicos/admissao";
import { assinarTermoAcao } from "../../acoes";

export const metadata = { title: "Termo" };

export default async function Termo({ params, searchParams }: { params: Promise<{ modeloId: string }>; searchParams: Promise<{ assinado?: string }> }) {
  const a = await exigirColaborador();
  const { modeloId } = await params;
  const { assinado } = await searchParams;
  const modelo = await db.query.modelosTermo.findFirst({ where: eq(schema.modelosTermo.id, modeloId) });
  if (!modelo) notFound();
  const ja = await db.query.assinaturasTermo.findFirst({
    where: and(eq(schema.assinaturasTermo.colaboradorId, a.colaboradorId!), eq(schema.assinaturasTermo.modeloId, modeloId), isNull(schema.assinaturasTermo.invalidadoEm)),
    orderBy: desc(schema.assinaturasTermo.assinadoEm),
  });
  if (!ja && (modelo.status !== "APROVADO" || !modelo.ativo)) notFound();
  const { texto, bloqueio } = ja ? { texto: ja.textoFinal, bloqueio: null } : await montarTermo(modelo, a.colaboradorId!);

  return (
    <div className="space-y-4">
      <Link href="/colaborador/documentos" className="text-sm font-medium text-palla-azul">← Meus documentos</Link>
      <h1 className="text-xl font-semibold text-palla-azul-escuro">{modelo.titulo}</h1>
      {assinado && <Aviso tom="sucesso">Termo assinado. Uma cópia fica guardada na plataforma e a equipe pode imprimir para você.</Aviso>}
      <Cartao>
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-tinta">{texto}</div>
        <p className="mt-4 border-t border-linha pt-3 text-xs text-tinta-suave">Base: {modelo.base}</p>
      </Cartao>
      {ja ? (
        <Cartao titulo="Assinatura registrada">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-tinta-suave">Assinado em</dt><dd>{fmtDataHora(ja.assinadoEm)}</dd></div>
            <div><dt className="text-xs text-tinta-suave">Código</dt><dd className="font-mono">{ja.codigo}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-tinta-suave">Impressão digital do texto (SHA-256)</dt><dd className="break-all font-mono text-xs">{ja.hashSha256}</dd></div>
          </dl>
        </Cartao>
      ) : bloqueio ? (
        <Aviso tom="alerta">{bloqueio} A Segurança do Trabalho vai liberar este termo.</Aviso>
      ) : (
        <Cartao titulo="Assinar">
          <Formulario acao={assinarTermoAcao.bind(null, modeloId)} rotulo="Assinar termo" className="space-y-4">
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="aceite" value="1" required className="mt-1 h-5 w-5" /> <span>Li (ou ouvi a leitura de) todo o texto acima, entendi e concordo.</span></label>
            <Campo rotulo="Seu nome completo" ajuda="Igual ao do cadastro."><Entrada name="nome" autoComplete="name" required /></Campo>
            <Campo rotulo="Sua senha da plataforma" ajuda="A senha confirma que é você quem está assinando."><CampoSenha name="senha" autoComplete="current-password" /></Campo>
            <p className="text-xs text-tinta-suave">Ficam registrados: data e hora, o aparelho e o endereço de internet usados, e o texto exatamente como você leu. Dúvidas sobre o texto? Fale com o RH ou com a Segurança do Trabalho antes de assinar.</p>
          </Formulario>
        </Cartao>
      )}
    </div>
  );
}
