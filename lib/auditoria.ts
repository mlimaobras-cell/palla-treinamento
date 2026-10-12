import { db, schema } from "@/db";
import type { Ator } from "./permissoes";

/** Registro de auditoria: só inclusão. Chamado em toda ação sensível. */
export async function auditar(
  ator: Pick<Ator, "id" | "nome"> | null,
  acao: string,
  entidade: string,
  entidadeId?: string | null,
  detalhes?: Record<string, unknown>,
) {
  await db.insert(schema.auditoria).values({
    usuarioId: ator?.id ?? null,
    usuarioNome: ator?.nome ?? "sistema",
    acao,
    entidade,
    entidadeId: entidadeId ?? null,
    detalhes: detalhes ?? null,
  });
}
