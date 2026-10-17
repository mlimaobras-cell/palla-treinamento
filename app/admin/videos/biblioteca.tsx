"use client";
import { useState } from "react";

export type CursoVideos = { id: string; codigo: string; titulo: string; videos: { id: string; titulo: string; url: string; legenda: string | null; capa: string | null; duracao: number }[] };
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

export function Biblioteca({ cursos }: { cursos: CursoVideos[] }) {
  const [atual, setAtual] = useState(cursos[0].videos[0]);
  const [aberto, setAberto] = useState(cursos[0].id);
  const [escolheu, setEscolheu] = useState(false);
  const curso = cursos.find((c) => c.videos.some((v) => v.id === atual.id))!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="overflow-hidden rounded-xl bg-black shadow-sm">
          <video key={atual.id} src={atual.url} poster={atual.capa ?? undefined} controls playsInline preload="metadata" autoPlay={escolheu} className="aspect-video w-full">
            {atual.legenda && <track kind="subtitles" srcLang="pt-BR" label="Português" src={atual.legenda} />}
          </video>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-tinta-suave">{curso.codigo} · {curso.titulo}</p>
            <h2 className="text-lg font-semibold text-palla-azul-escuro">{atual.titulo}</h2>
          </div>
          <a href={atual.url} download className="rounded-lg px-3 py-2 text-sm font-semibold text-palla-azul ring-1 ring-inset ring-linha hover:bg-slate-50">Baixar vídeo</a>
        </div>
      </div>
      <div className="space-y-3">
        {cursos.map((c) => (
          <section key={c.id} className="overflow-hidden rounded-xl border border-linha bg-white">
            <button type="button" onClick={() => setAberto(aberto === c.id ? "" : c.id)} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50" aria-expanded={aberto === c.id}>
              <span><span className="block font-mono text-xs text-tinta-suave">{c.codigo}</span><span className="text-sm font-semibold">{c.titulo}</span></span>
              <span className="shrink-0 text-xs text-tinta-suave">{c.videos.length} vídeo{c.videos.length > 1 ? "s" : ""} {aberto === c.id ? "▴" : "▾"}</span>
            </button>
            {aberto === c.id && (
              <ol className="border-t border-linha">
                {c.videos.map((v, i) => (
                  <li key={v.id}>
                    <button type="button" onClick={() => { setAtual(v); setEscolheu(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 ${v.id === atual.id ? "bg-palla-azul-claro font-semibold text-palla-azul-escuro" : ""}`}>
                      <span className="w-5 text-xs text-tinta-suave">{i + 1}</span>
                      <span className="flex-1">{v.titulo}</span>
                      <span className="text-xs text-tinta-suave">{mmss(v.duracao)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
