"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Estado } from "@/components/formulario";
import { executar, txt, dataOuNull } from "@/lib/acao";
import { exigirColaborador } from "@/lib/sessao";
import { concluirAula, enviarAvaliacao, iniciarAvaliacao, iniciarDiagnostica, registrarTempo } from "@/lib/servicos/aprendizagem";
import { emitirComprovanteEtapa, registrarCiencia } from "@/lib/servicos/certificacao";
import { enviarDocumento } from "@/lib/servicos/documentos";

export async function pulsoAula(matriculaId: string, aulaId: string, segundos: number, posicao?: number) {
  const a = await exigirColaborador();
  await registrarTempo(a, matriculaId, aulaId, segundos, posicao);
}

export async function concluirAulaAcao(matriculaId: string, aulaId: string, proxima: string | null): Promise<{ erro?: string }> {
  const a = await exigirColaborador();
  try {
    await concluirAula(a, matriculaId, aulaId);
  } catch (e) {
    return { erro: (e as Error).message };
  }
  revalidatePath(`/colaborador/curso/${matriculaId}`);
  redirect(proxima ? `/colaborador/curso/${matriculaId}/aula/${proxima}` : `/colaborador/curso/${matriculaId}`);
}

export async function iniciarAvaliacaoAcao(matriculaId: string): Promise<Estado> {
  const a = await exigirColaborador();
  try {
    await iniciarAvaliacao(a, matriculaId, (await headers()).get("user-agent") ?? undefined);
  } catch (e) {
    return { erro: (e as Error).message };
  }
  redirect(`/colaborador/curso/${matriculaId}/avaliacao`);
}

export async function iniciarDiagnosticaAcao(matriculaId: string): Promise<Estado> {
  const a = await exigirColaborador();
  try {
    await iniciarDiagnostica(a, matriculaId, (await headers()).get("user-agent") ?? undefined);
  } catch (e) {
    return { erro: (e as Error).message };
  }
  redirect(`/colaborador/curso/${matriculaId}/avaliacao`);
}

export async function enviarAvaliacaoAcao(matriculaId: string, tentativaId: string, _: Estado, f: FormData): Promise<Estado> {
  const a = await exigirColaborador();
  const marcadas: Record<string, string | null> = {};
  for (const [k, v] of f.entries()) if (k.startsWith("q_")) marcadas[k.slice(2)] = String(v);
  try {
    await enviarAvaliacao(a, tentativaId, marcadas);
  } catch (e) {
    return { erro: (e as Error).message };
  }
  redirect(`/colaborador/curso/${matriculaId}/avaliacao?resultado=${tentativaId}`);
}

export async function comprovanteAcao(matriculaId: string): Promise<Estado> {
  const a = await exigirColaborador();
  return executar(async () => {
    await emitirComprovanteEtapa(a, matriculaId);
    return "Comprovante de etapa emitido. Ele está na sua página inicial.";
  }, ["/colaborador"]);
}

export async function registrarCienciaAcao(certId: string) {
  const a = await exigirColaborador();
  await registrarCiencia(a, certId);
  revalidatePath("/colaborador");
}

export async function enviarDocumentoAcao(_: Estado, f: FormData): Promise<Estado> {
  const a = await exigirColaborador();
  return executar(async () => {
    const arq = f.get("arquivo");
    if (!(arq instanceof File) || arq.size === 0) throw new Error("Selecione o arquivo.");
    const tipo = txt(f, "tipo") as "ASO" | "FICHA_EPI" | "DOCUMENTO_CONTRATANTE" | "CERTIFICADO_EXTERNO" | "OUTRO";
    await enviarDocumento(a, {
      colaboradorId: a.colaboradorId!, tipo, descricao: txt(f, "descricao") || tipo,
      emitidoEm: dataOuNull(f, "emitidoEm"),
      arquivo: { nome: arq.name, tipo: arq.type, bytes: Buffer.from(await arq.arrayBuffer()) },
    });
    return "Documento enviado. A Segurança do Trabalho vai conferir.";
  }, ["/colaborador"]);
}
