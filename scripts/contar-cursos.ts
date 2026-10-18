// Contagem de aulas, vídeos e questões por curso (conferência rápida). Uso: npx tsx scripts/contar-cursos.ts
import "../db/carregar-env";
import { db, encerrarDb } from "../db";
(async () => {
  const cs = await db.query.cursos.findMany({ orderBy: (c, { asc }) => asc(c.ordem), with: { capitulos: { with: { aulas: true } }, questoes: true } });
  for (const c of cs) {
    const a = c.capitulos.flatMap((k) => k.aulas);
    console.log(`${c.codigo.padEnd(10)} aulas ${String(a.length).padStart(2)}  vídeos ${String(a.filter((x) => x.videoUrl).length).padStart(2)}  questões ${String(c.questoes.length).padStart(2)}  ${c.statusConteudo}`);
  }
  await encerrarDb();
})();
