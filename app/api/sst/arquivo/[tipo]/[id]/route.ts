import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { pode } from "@/lib/permissoes";
import { obterAtor } from "@/lib/sessao";
import { lerArquivo } from "@/lib/servicos/documentos";

/** PDF assinado do PGR ou do PCMSO (acesso da equipe com sst.ver, registrado na auditoria). */
export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = await params;
  const a = await obterAtor();
  if (!a) return new Response("Não autenticado", { status: 401 });
  if (!pode(a, "sst.ver")) return new Response("Sem permissão", { status: 403 });
  const caminho = tipo === "pgr"
    ? (await db.query.pgrs.findFirst({ where: eq(schema.pgrs.id, id) }))?.arquivoAssinadoPath
    : tipo === "pcmso" ? (await db.query.pcmsos.findFirst({ where: eq(schema.pcmsos.id, id) }))?.arquivoPath : null;
  if (!caminho) return new Response("Não encontrado", { status: 404 });
  await auditar(a, `${tipo}.arquivo_acessado`, tipo, id, {});
  return new Response(new Uint8Array(await lerArquivo(caminho)), { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline", "Cache-Control": "private, no-store" } });
}
