import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { Formulario } from "@/components/formulario";
import { Campo, Cartao, Entrada, TituloPagina, Vazio } from "@/components/ui";
import { exigirEquipe } from "@/lib/sessao";
import { checklistEmissao } from "@/lib/servicos/certificacao";
import { aprovarAcao } from "../acoes";

export const metadata = { title: "Aprovações" };

export default async function Aprovacoes() {
  const a = await exigirEquipe("capacitacao.aprovar");
  const pendentes = await db.query.matriculas.findMany({
    where: eq(schema.matriculas.status, "AGUARDANDO_APROVACAO"),
    with: { curso: true, colaborador: { with: { obra: true } }, praticas: true },
  });
  const minhas = pendentes.filter((m) => !m.curso.responsavelTecnicoId || m.curso.responsavelTecnicoId === a.id);
  const listas = await Promise.all(minhas.map(async (m) => ({ m, ck: await checklistEmissao(m.id) })));

  return (
    <>
      <TituloPagina titulo="Aprovação de capacitações" subtitulo="O certificado integral só é emitido com todos os requisitos comprovados e sua aprovação." />
      {listas.length === 0 ? <Vazio>Nada aguardando sua aprovação.</Vazio> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {listas.map(({ m, ck }) => {
            const ok = ck.every((i) => i.ok);
            const local = m.praticas.at(-1)?.local ?? (m.curso.modalidade === "EAD" ? "Plataforma Grupo Palla | Treinamento e Integração (EAD)" : "");
            return (
              <Cartao key={m.id} titulo={`${m.colaborador.nome}`} acao={<span className="text-xs text-tinta-suave">{m.colaborador.obra?.codigo}</span>}>
                <p className="text-sm font-medium">{m.curso.codigo} · {m.curso.titulo}</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {ck.map((i) => (
                    <li key={i.item} className="flex gap-2">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${i.ok ? "bg-emerald-500 text-white" : "bg-red-100 text-red-700"}`}>{i.ok ? "✓" : "!"}</span>
                      <span>{i.item}{i.detalhe && <span className="block text-xs text-tinta-suave">{i.detalhe}</span>}</span>
                    </li>
                  ))}
                </ul>
                {ok ? (
                  <Formulario acao={aprovarAcao.bind(null, m.id)} rotulo="Aprovar e emitir certificado" className="mt-4 space-y-3 border-t border-linha pt-4">
                    <Campo rotulo="Local ou modalidade de realização"><Entrada name="local" defaultValue={local} required /></Campo>
                    <label className="flex gap-2 text-sm"><input type="checkbox" name="confirmo" className="mt-1" /> Conferi os registros e aprovo a capacitação. Minha aprovação fica registrada com meu login.</label>
                  </Formulario>
                ) : <p className="mt-4 border-t border-linha pt-3 text-sm text-red-700">Há requisitos pendentes. A emissão está bloqueada.</p>}
              </Cartao>
            );
          })}
        </div>
      )}
    </>
  );
}
