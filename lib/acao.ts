import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import type { Estado } from "@/components/formulario";

/** Executa uma ação de servidor e converte erros em mensagem amigável. */
export async function executar(fn: () => Promise<string | void>, revalidar: string[] = []): Promise<Estado> {
  try {
    const ok = await fn();
    for (const p of revalidar) revalidatePath(p, "layout");
    return { ok: ok || "Salvo." };
  } catch (e) {
    if (e instanceof ZodError) return { erro: e.issues.map((i) => i.message).join(" ") };
    if (e && typeof e === "object" && "digest" in e && String((e as { digest: string }).digest).startsWith("NEXT_REDIRECT")) throw e;
    return { erro: (e as Error).message || "Não foi possível concluir." };
  }
}

export const txt = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
export const dataOuNull = (f: FormData, k: string) => (txt(f, k) ? new Date(`${txt(f, k)}T12:00:00`) : null);
