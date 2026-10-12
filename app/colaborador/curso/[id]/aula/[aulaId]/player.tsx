"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Aviso, Botao } from "@/components/ui";
import { concluirAulaAcao, pulsoAula } from "@/app/colaborador/acoes";

type AulaDados = {
  id: string; videoUrl: string | null; legendaUrl?: string | null; roteiro: string; narracao: string; textoApoio: string;
  exemplo: string | null; perguntaFixacao: string | null; resumo: string; duracaoMin: number;
};

const ABAS = [
  ["narracao", "Aula"],
  ["texto", "Material de leitura"],
  ["exemplo", "Situação real"],
  ["resumo", "Resumo"],
] as const;

/**
 * Ambiente de videoaula. Conta o tempo somente com a aba visível e envia pulsos de 30 s ao servidor,
 * que limita o tempo aceito por pulso. A aula só é concluída com o tempo mínimo cumprido.
 */
export function Player({ matriculaId, aula, segundosIniciais, segundosMinimos, concluida, proxima, anterior, apoio = false }: {
  matriculaId: string; aula: AulaDados; segundosIniciais: number; segundosMinimos: number;
  concluida: boolean; proxima: string | null; anterior: string | null;
  /** Material de apoio de curso presencial: sem contagem de tempo e sem conclusão (não é carga horária). */
  apoio?: boolean;
}) {
  const [seg, setSeg] = useState(segundosIniciais);
  const [aba, setAba] = useState<(typeof ABAS)[number][0]>("narracao");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, iniciar] = useTransition();
  const acumulado = useRef(0);

  useEffect(() => {
    if (concluida || apoio) return;
    const t = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setSeg((s) => s + 1);
      acumulado.current += 1;
      if (acumulado.current >= 30) {
        const enviar = acumulado.current;
        acumulado.current = 0;
        pulsoAula(matriculaId, aula.id, enviar).catch(() => setErro("Sem conexão: o tempo será enviado quando a conexão voltar."));
      }
    }, 1000);
    const sair = () => {
      if (acumulado.current > 0) pulsoAula(matriculaId, aula.id, acumulado.current).catch(() => {});
      acumulado.current = 0;
    };
    window.addEventListener("pagehide", sair);
    return () => { clearInterval(t); window.removeEventListener("pagehide", sair); sair(); };
  }, [concluida, apoio, matriculaId, aula.id]);

  const pct = Math.min(100, (seg / segundosMinimos) * 100);
  const pronto = concluida || seg >= segundosMinimos;
  const faltam = Math.max(0, Math.ceil((segundosMinimos - seg) / 60));

  function concluir() {
    setErro(null);
    iniciar(async () => {
      if (acumulado.current > 0) {
        await pulsoAula(matriculaId, aula.id, acumulado.current);
        acumulado.current = 0;
      }
      const r = await concluirAulaAcao(matriculaId, aula.id, proxima);
      if (r?.erro) setErro(r.erro);
    });
  }

  const conteudo = {
    narracao: aula.narracao,
    texto: aula.textoApoio,
    exemplo: [aula.exemplo, aula.perguntaFixacao && `Pergunta para pensar: ${aula.perguntaFixacao}`].filter(Boolean).join("\n\n") || "Sem situação real nesta aula.",
    resumo: aula.resumo,
  }[aba];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl bg-palla-azul-escuro">
        {aula.videoUrl ? (
          <video src={aula.videoUrl} controls playsInline preload="metadata" className="aspect-video w-full bg-black">{aula.legendaUrl && <track kind="subtitles" srcLang="pt-BR" label="Português" src={aula.legendaUrl} default />}</video>
        ) : (
          <div className="relative flex aspect-video flex-col justify-end p-5 text-white">
            <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,transparent_0_22px,rgba(255,255,255,.12)_22px_24px)]" aria-hidden />
            <p className="relative text-xs font-semibold uppercase tracking-widest text-white/60">Videoaula em produção</p>
            <p className="relative mt-1 max-w-md text-sm text-white/85">Enquanto o vídeo não é gravado, acompanhe a aula pelo texto narrado abaixo. Duração prevista: {aula.duracaoMin} min.</p>
            <div className="absolute bottom-0 left-0 h-1.5 w-28 bg-palla-vermelho" aria-hidden />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-linha bg-white">
        <div className="flex gap-1 overflow-x-auto border-b border-linha p-1.5" role="tablist">
          {ABAS.map(([k, r]) => (
            <button key={k} role="tab" aria-selected={aba === k} onClick={() => setAba(k)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${aba === k ? "bg-palla-azul-claro text-palla-azul" : "text-tinta-suave hover:bg-slate-50"}`}>{r}</button>
          ))}
        </div>
        <div className="prosa p-5 text-[15px]">{conteudo}</div>
        <details className="border-t border-linha px-5 py-3 text-sm text-tinta-suave">
          <summary className="cursor-pointer font-medium">Roteiro da videoaula</summary>
          <div className="prosa mt-2 text-xs">{aula.roteiro}</div>
        </details>
      </div>

      {apoio ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-linha bg-white px-4 py-3">
          {anterior ? <Link href={`/colaborador/curso/${matriculaId}/aula/${anterior}`} className="text-sm font-medium text-palla-azul">← Anterior</Link> : <span />}
          {proxima ? <Link href={`/colaborador/curso/${matriculaId}/aula/${proxima}`} className="rounded-lg bg-palla-azul px-4 py-2.5 text-sm font-semibold text-white">Próximo tema →</Link>
            : <Link href={`/colaborador/curso/${matriculaId}`} className="rounded-lg bg-palla-azul px-4 py-2.5 text-sm font-semibold text-white">Voltar ao curso</Link>}
        </div>
      ) : (
      <div className="sticky bottom-0 -mx-4 border-t border-linha bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-xl sm:border">
        <div className="mb-2 flex justify-between text-xs text-tinta-suave">
          <span>{concluida ? "Aula concluída" : pronto ? "Tempo mínimo cumprido" : `Participação: faltam cerca de ${faltam} min`}</span>
          <span>{Math.floor(seg / 60)} min</span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-palla-azul transition-all" style={{ width: `${concluida ? 100 : pct}%` }} /></div>
        {erro && <div className="mb-3"><Aviso tom="erro">{erro}</Aviso></div>}
        <div className="flex items-center justify-between gap-2">
          {anterior ? <Link href={`/colaborador/curso/${matriculaId}/aula/${anterior}`} className="text-sm font-medium text-palla-azul">← Anterior</Link> : <span />}
          {concluida ? (
            proxima ? <Link href={`/colaborador/curso/${matriculaId}/aula/${proxima}`} className="rounded-lg bg-palla-azul px-4 py-2.5 text-sm font-semibold text-white">Próxima aula →</Link>
              : <Link href={`/colaborador/curso/${matriculaId}`} className="rounded-lg bg-palla-azul px-4 py-2.5 text-sm font-semibold text-white">Voltar ao curso</Link>
          ) : (
            <Botao onClick={concluir} disabled={!pronto || enviando}>{enviando ? "Salvando…" : "Concluir aula"}</Botao>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
