import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { obterAtor } from "@/lib/sessao";
import { lerArquivo } from "@/lib/servicos/documentos";

/** Logotipo de empresa parceira (usado nos documentos impressos; acesso só para quem está logado). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await obterAtor())) return new Response("Não autenticado", { status: 401 });
  const p = await db.query.parceiros.findFirst({ where: eq(schema.parceiros.id, id) });
  if (!p?.logoPath) return new Response("Não encontrado", { status: 404 });
  return new Response(new Uint8Array(await lerArquivo(p.logoPath)), { headers: { "Content-Type": p.logoTipo ?? "image/png", "Cache-Control": "private, max-age=300" } });
}
