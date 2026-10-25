import { db } from "@/db";
import { Formulario } from "@/components/formulario";
import { AreaTexto, Aviso, Campo, Cartao, Entrada, Selecao, Selo, Tabela, TituloPagina } from "@/components/ui";
import { fmtData, ORIGEM } from "@/lib/formato";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { alternarItemAdmissionalAcao, aprovarModeloAcao, criarItemAdmissionalAcao, editarModeloAcao } from "../acoes";

export const metadata = { title: "Termos e admissão" };

const ST: Record<string, { rotulo: string; cor: string }> = {
  RASCUNHO: { rotulo: "Rascunho", cor: "cinza" }, EM_REVISAO: { rotulo: "Em revisão", cor: "amarelo" }, APROVADO: { rotulo: "Aprovado", cor: "verde" },
};

export default async function Termos() {
  const a = await exigirEquipe("sst.ver");
  const [modelos, itens] = await Promise.all([
    db.query.modelosTermo.findMany({ orderBy: (m, { asc, desc }) => [asc(m.ordem), desc(m.versao)], with: { assinaturas: { columns: { id: true } } } }),
    db.query.itensAdmissionais.findMany({ orderBy: (i, { asc }) => asc(i.ordem) }),
  ]);
  const editarSst = pode(a, "sst.editar"), gerirRh = pode(a, "admissao.gerir");
  return (
    <>
      <TituloPagina titulo="Termos e documentos de admissão" subtitulo="Modelos que o colaborador assina na plataforma e a lista de documentos que o RH pede." />
      <div className="mb-5"><Aviso tom="alerta">
        A assinatura na plataforma é eletrônica (login individual, senha no momento da assinatura, texto congelado com hash, data, hora e IP). <strong>Não é assinatura com certificado ICP-Brasil.</strong>
        A NR-1 (1.6.2) admite documentos das NR em meio digital com certificado ICP-Brasil; até o jurídico definir o modelo, guarde também a via em papel dos documentos de NR que exigirem assinatura do trabalhador.
        Só modelos <strong>aprovados</strong> aparecem para o colaborador.
      </Aviso></div>

      <div className="space-y-4">
        {modelos.map((m) => (
          <Cartao key={m.id} titulo={<>{m.titulo} <span className="text-xs font-normal text-tinta-suave">· {m.codigo} v{m.versao}</span></>} acao={<Selo cor={ST[m.status].cor}>{ST[m.status].rotulo}</Selo>}>
            <p className="mb-2 text-xs text-tinta-suave">Base: {m.base} · {ORIGEM[m.origem]} · {m.naAdmissao ? "obrigatório na admissão" : "opcional"} · {m.assinaturas.length} assinatura(s){m.aprovadoEm && ` · aprovado em ${fmtData(m.aprovadoEm)}`}</p>
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-palla-azul">{editarSst ? "Ver e editar o texto" : "Ver o texto"}</summary>
              {editarSst ? (
                <Formulario acao={editarModeloAcao.bind(null, m.id)} rotulo={m.status === "APROVADO" ? "Criar nova versão com este texto" : "Salvar texto"} variante="secundario" className="mt-3 space-y-3">
                  <Campo rotulo="Título"><Entrada name="titulo" defaultValue={m.titulo} /></Campo>
                  <Campo rotulo="Texto" ajuda="Marcadores: {{nome}} {{cpf}} {{funcao}} {{obra}} {{empresa}} {{data}} {{riscos}} {{epis}} — riscos e EPIs saem do GHE da função no PGR aprovado."><AreaTexto name="texto" rows={14} defaultValue={m.texto} className="font-mono text-[13px]" /></Campo>
                </Formulario>
              ) : <pre className="mt-3 whitespace-pre-wrap text-sm">{m.texto}</pre>}
            </details>
            {editarSst && m.status !== "APROVADO" && (
              <Formulario acao={aprovarModeloAcao.bind(null, m.id)} rotulo="Aprovar este modelo" className="mt-3"><p className="text-xs text-tinta-suave">Ao aprovar, o texto fica congelado e é oferecido para assinatura. Revise com o jurídico os modelos marcados como "pendente de validação técnica".</p></Formulario>
            )}
          </Cartao>
        ))}
      </div>

      <Cartao titulo="Lista de documentos de admissão" className="mt-6">
        <Tabela cabecalho={["Documento", "Base", "Quem envia", "Situação", ""]}>
          {itens.map((i) => (
            <tr key={i.id} className={i.ativo ? "" : "opacity-50"}>
              <td className="px-5 py-2.5"><span className="font-medium">{i.nome}</span>{i.sensivel && <Selo cor="vermelho">dado sensível</Selo>}{i.exigeValidade && <span className="ml-1 text-xs text-tinta-suave">(com validade)</span>}{i.funcoesCodigos && <span className="block text-xs text-tinta-suave">Só para: {i.funcoesCodigos.join(", ")}</span>}</td>
              <td className="px-5 text-xs">{i.base}<span className="block text-tinta-suave">{ORIGEM[i.origem]}</span></td>
              <td className="px-5 text-xs">{i.quemEnvia === "EQUIPE" ? "RH" : "Colaborador"}</td>
              <td className="px-5 text-xs">{!i.ativo ? "Desativado" : i.obrigatorio ? "Obrigatório" : "Se aplicável"}</td>
              <td className="px-5">{gerirRh && (
                <Formulario acao={alternarItemAdmissionalAcao.bind(null, i.id)} rotulo="Salvar" variante="secundario" className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1"><input type="checkbox" name="ativo" value="1" defaultChecked={i.ativo} /> ativo</label>
                  <label className="flex items-center gap-1"><input type="checkbox" name="obrigatorio" value="1" defaultChecked={i.obrigatorio} /> obrigatório</label>
                </Formulario>
              )}</td>
            </tr>
          ))}
        </Tabela>
        {gerirRh && (
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer font-semibold text-palla-azul">Incluir documento na lista</summary>
            <Formulario acao={criarItemAdmissionalAcao} rotulo="Incluir" className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir>
              <Campo rotulo="Nome"><Entrada name="nome" required /></Campo>
              <Campo rotulo="Código (opcional)"><Entrada name="codigo" /></Campo>
              <Campo rotulo="Base" ajuda="Lei/artigo ou 'critério interno'."><Entrada name="base" required /></Campo>
              <Campo rotulo="Origem"><Selecao name="origem"><option value="EMPREGADOR">Critério interno</option><option value="LEGAL">Exigência legal</option><option value="A_VALIDAR">A validar</option></Selecao></Campo>
              <Campo rotulo="Orientação ao colaborador"><Entrada name="orientacao" /></Campo>
              <Campo rotulo="Quem envia"><Selecao name="quemEnvia"><option value="COLABORADOR">Colaborador</option><option value="EQUIPE">RH</option></Selecao></Campo>
              <div className="flex flex-wrap gap-4 text-sm sm:col-span-2">
                <label className="flex items-center gap-2"><input type="checkbox" name="obrigatorio" value="1" defaultChecked /> Obrigatório</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="exigeValidade" value="1" /> Tem validade</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="sensivel" value="1" /> Dado sensível (só RH abre)</label>
              </div>
            </Formulario>
          </details>
        )}
      </Cartao>
    </>
  );
}
