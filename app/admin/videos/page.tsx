import { db } from "@/db";
import { TituloPagina, Vazio } from "@/components/ui";
import { exigirEquipe } from "@/lib/sessao";
import { Biblioteca, type CursoVideos } from "./biblioteca";

export const metadata = { title: "Vídeos" };

/** Biblioteca de vídeos para a equipe: assistir livremente (sem as travas da aula), conferir legenda e duração. */
export default async function Videos() {
  await exigirEquipe("curso.ver");
  const cursos = await db.query.cursos.findMany({
    orderBy: (c, { asc }) => asc(c.ordem),
    with: { capitulos: { orderBy: (k, { asc }) => asc(k.ordem), with: { aulas: { orderBy: (a, { asc }) => asc(a.ordem) } } } },
  });
  const lista: CursoVideos[] = cursos
    .map((c) => ({
      id: c.id, codigo: c.codigo, titulo: c.titulo,
      videos: c.capitulos.flatMap((k) => k.aulas).filter((a) => a.videoUrl).map((a) => ({
        id: a.id, titulo: a.titulo, url: a.videoUrl!, legenda: a.legendaUrl, capa: a.posterUrl, duracao: a.duracaoSeg ?? a.duracaoMin * 60,
      })),
    }))
    .filter((c) => c.videos.length);
  const total = lista.reduce((s, c) => s + c.videos.length, 0);
  const min = Math.round(lista.reduce((s, c) => s + c.videos.reduce((x, v) => x + v.duracao, 0), 0) / 60);
  return (
    <>
      <TituloPagina titulo="Vídeos" subtitulo={`${total} vídeos · cerca de ${min} minutos. Aqui a equipe assiste livremente; para o colaborador o vídeo continua com as travas da aula.`} />
      {lista.length ? <Biblioteca cursos={lista} /> : <Vazio>Nenhum vídeo publicado.</Vazio>}
    </>
  );
}
