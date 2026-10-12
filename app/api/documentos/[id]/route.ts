import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { auditar } from "@/lib/auditoria";
import { pode } from "@/lib/permissoes";
import { obterAtor } from "@/lib/sessao";
import { lerArquivo } from "@/lib/servicos/documentos";

const TIPOS: Record<string, string> = { ".pdf": "application/pdf", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

/** Download de documento com controle de acesso e registro (ASO é dado sensível). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await obterAtor();
  if (!a) return new Response("Não autenticado", { status: 401 });
  const d = await db.query.documentos.findFirst({ where: eq(schema.documentos.id, id) });
  if (!d?.arquivoPath) return new Response("Não encontrado", { status: 404 });
  const dono = a.perfil === "COLABORADOR" && d.colaboradorId === a.colaboradorId;
  if (!dono && !pode(a, "documento.ver")) return new Response("Sem permissão", { status: 403 });
  await auditar(a, "documento.acessado", "documento", id, { tipo: d.tipo, colaboradorId: d.colaboradorId });
  const bytes = await lerArquivo(d.arquivoPath);
  const ext = d.arquivoPath.slice(d.arquivoPath.lastIndexOf("."));
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": TIPOS[ext] ?? "application/octet-stream", "Content-Disposition": "inline", "Cache-Control": "private, no-store" },
  });
}
