import "../db/carregar-env";
import { writeFileSync } from "node:fs";
import { db, encerrarDb } from "../db";
import { pdfDoCertificado } from "../lib/servicos/certificacao";
(async () => {
  const cs = await db.query.certificados.findMany();
  for (const c of cs) { const { pdf } = await pdfDoCertificado(c.id); writeFileSync(`saida-testes/${c.numero}.pdf`, pdf); }
  await encerrarDb();
})();
