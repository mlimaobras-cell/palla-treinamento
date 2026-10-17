import { NextResponse } from "next/server";
import { obterAtor } from "@/lib/sessao";
import { PERFIS_AVISO } from "@/lib/servicos/avisos";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import webpush from "web-push";

/** Aviso de teste só para os aparelhos de quem pediu. */
export async function POST() {
  const a = await obterAtor();
  if (!a || !(PERFIS_AVISO as readonly string[]).includes(a.perfil)) return NextResponse.json({ erro: "Sem permissão." }, { status: 403 });
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return NextResponse.json({ erro: "Avisos não configurados no servidor." }, { status: 500 });
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:suporte@palla.ind.br", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const subs = await db.query.inscricoesPush.findMany({ where: eq(schema.inscricoesPush.usuarioId, a.id) });
  const corpo = JSON.stringify({ titulo: "Teste: Maria (exemplo) entrou na plataforma", corpo: "Assim chega o aviso quando um colaborador fizer login.", url: "/admin/acessos", tag: "teste" });
  const r = await Promise.all(subs.map((s) => webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, corpo, { TTL: 600 }).then(() => 1, () => 0)));
  return NextResponse.json({ enviados: r.reduce((x: number, y: number) => x + y, 0) });
}
