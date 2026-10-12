import { auditar } from "@/lib/auditoria";
import { pode } from "@/lib/permissoes";
import { obterAtor } from "@/lib/sessao";
import { pdfDoCertificado } from "@/lib/servicos/certificacao";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await obterAtor();
  if (!a) return new Response("Não autenticado", { status: 401 });
  try {
    const { cert, pdf } = await pdfDoCertificado(id);
    const dono = a.perfil === "COLABORADOR" && cert.matricula.colaboradorId === a.colaboradorId;
    if (!dono && !pode(a, "colaborador.ver")) return new Response("Sem permissão", { status: 403 });
    await auditar(a, "certificado.download", "certificado", id, {});
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${cert.numero}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}
