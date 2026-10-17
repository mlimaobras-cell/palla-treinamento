import "server-only";
import webpush from "web-push";
import { eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";

/** Perfis da equipe que podem receber o aviso de login de colaborador. */
export const PERFIS_AVISO = ["ADMIN", "RH", "SST"] as const;

export const chavePublicaPush = () => process.env.VAPID_PUBLIC_KEY ?? "";
const configurado = () => !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

function preparar() {
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:suporte@palla.ind.br", process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
}

export async function inscrever(usuarioId: string, sub: { endpoint: string; keys: { p256dh: string; auth: string } }, aparelho: string) {
  await db.insert(schema.inscricoesPush)
    .values({ usuarioId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth, aparelho: aparelho.slice(0, 200) })
    .onConflictDoUpdate({ target: schema.inscricoesPush.endpoint, set: { usuarioId, p256dh: sub.keys.p256dh, auth: sub.keys.auth, aparelho: aparelho.slice(0, 200) } });
}

export async function desinscrever(usuarioId: string, endpoint: string) {
  const s = await db.query.inscricoesPush.findFirst({ where: eq(schema.inscricoesPush.endpoint, endpoint) });
  if (s && s.usuarioId === usuarioId) await db.delete(schema.inscricoesPush).where(eq(schema.inscricoesPush.id, s.id));
}

type Mensagem = { titulo: string; corpo: string; url: string; tag?: string };

/** Envia a mensagem para todos os aparelhos inscritos dos perfis indicados. Nunca derruba o fluxo de quem chamou. */
export async function notificarEquipe(msg: Mensagem, perfis: readonly string[] = PERFIS_AVISO) {
  if (!configurado()) return 0;
  try {
    preparar();
    const usuarios = await db.query.usuarios.findMany({ where: (u, { and, eq: igual }) => and(inArray(u.perfil, perfis as never[]), igual(u.ativo, true)) });
    if (!usuarios.length) return 0;
    const subs = await db.query.inscricoesPush.findMany({ where: inArray(schema.inscricoesPush.usuarioId, usuarios.map((u) => u.id)) });
    const corpo = JSON.stringify(msg);
    const envios = subs.map((s) =>
      webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, corpo, { TTL: 3600, timeout: 4000 })
        .then(() => 1)
        .catch(async (e: { statusCode?: number }) => {
          // Aparelho desinstalou ou revogou a permissão: remove a inscrição.
          if (e.statusCode === 404 || e.statusCode === 410) await db.delete(schema.inscricoesPush).where(eq(schema.inscricoesPush.id, s.id));
          return 0;
        }));
    const r = await Promise.race([Promise.all(envios), new Promise<number[]>((ok) => setTimeout(() => ok([]), 5000))]);
    return r.reduce((a, b) => a + b, 0);
  } catch {
    return 0;
  }
}

/** Aviso de login: só para colaboradores (não avisa quando alguém da equipe entra). */
export async function avisarLogin(u: { id: string; nome: string; perfil: string; colaboradorId: string | null }, como = "entrou na plataforma") {
  if (u.perfil !== "COLABORADOR") return;
  const c = u.colaboradorId ? await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, u.colaboradorId), with: { funcao: true, obra: true } }) : null;
  const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  const detalhe = [c?.funcao?.nome, c?.obra?.nome].filter(Boolean).join(" · ");
  await notificarEquipe({
    titulo: `${u.nome} ${como}`,
    corpo: `${hora}${detalhe ? ` · ${detalhe}` : ""}`,
    url: c ? `/admin/colaboradores/${c.id}` : "/admin/acessos",
    tag: `login-${u.id}`,
  });
}
