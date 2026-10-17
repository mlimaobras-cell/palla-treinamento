import { NextResponse, type NextRequest } from "next/server";
import { obterAtor } from "@/lib/sessao";
import { desinscrever, inscrever, PERFIS_AVISO } from "@/lib/servicos/avisos";
import { auditar } from "@/lib/auditoria";

/** Inscreve (POST) ou remove (DELETE) este aparelho para receber os avisos da equipe. */
export async function POST(req: NextRequest) {
  const a = await obterAtor();
  if (!a || !(PERFIS_AVISO as readonly string[]).includes(a.perfil)) return NextResponse.json({ erro: "Sem permissão." }, { status: 403 });
  const b = await req.json().catch(() => null);
  if (!b?.endpoint || !b?.keys?.p256dh || !b?.keys?.auth || !/^https:\/\//.test(b.endpoint)) return NextResponse.json({ erro: "Inscrição inválida." }, { status: 400 });
  await inscrever(a.id, b, req.headers.get("user-agent") ?? "");
  await auditar(a, "push.inscrever", "usuario", a.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const a = await obterAtor();
  if (!a) return NextResponse.json({ erro: "Sem sessão." }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (b?.endpoint) await desinscrever(a.id, String(b.endpoint));
  await auditar(a, "push.desinscrever", "usuario", a.id);
  return NextResponse.json({ ok: true });
}
