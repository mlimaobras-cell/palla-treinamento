/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { db } from "@/db";
import { Formulario } from "@/components/formulario";
import { Aviso, Campo, Cartao, Entrada, Selecao, Selo, TituloPagina, Vazio } from "@/components/ui";
import { pode } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { registroCompleto, TIPO_PARCEIRO, TIPO_SIGNATARIO } from "@/lib/servicos/parceiros";
import { salvarParceiroAcao, salvarSignatarioAcao } from "../acoes";

export const metadata = { title: "Quem assina e empresas parceiras" };

type Parceiro = Awaited<ReturnType<typeof db.query.parceiros.findMany>>[number];
type Signatario = Awaited<ReturnType<typeof db.query.signatarios.findMany>>[number];

export default async function Responsaveis() {
  const a = await exigirEquipe("sst.ver");
  const editar = pode(a, "sst.editar");
  const [parceiros, signatarios] = await Promise.all([
    db.query.parceiros.findMany({ orderBy: (p, { asc }) => asc(p.nome) }),
    db.query.signatarios.findMany({ orderBy: (s, { asc }) => [asc(s.tipo), asc(s.nome)] }),
  ]);
  return (
    <>
      <Link href="/admin/sst" className="text-sm font-medium text-palla-azul">← Saúde e Segurança</Link>
      <div className="mt-2"><TituloPagina titulo="Quem assina e empresas parceiras" subtitulo="Cadastre aqui o engenheiro ou técnico que assina o PGR, o médico do trabalho do PCMSO e o responsável pela empresa. O logotipo da consultoria ou da clínica entra nos documentos ao lado do logotipo da Palla." /></div>
      <div className="mb-5"><Aviso tom="info">Os dados são copiados para o documento no momento da aprovação. Se o profissional mudar depois, o PGR e o PCMSO já aprovados continuam com os dados de quem realmente assinou.</Aviso></div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Cartao titulo="Quem assina">
          {signatarios.length === 0 ? <Vazio>Ninguém cadastrado ainda.</Vazio> : (
            <ul className="space-y-3">
              {signatarios.map((s) => (
                <li key={s.id} className={`rounded-lg border border-linha p-3 text-sm ${s.ativo ? "" : "opacity-60"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span><span className="font-medium">{s.nome}</span><span className="block text-xs text-tinta-suave">{s.qualificacao}{registroCompleto(s) && ` · ${registroCompleto(s)}`}{s.cargo && ` · ${s.cargo}`}{s.parceiroId && ` · ${parceiros.find((p) => p.id === s.parceiroId)?.nome ?? ""}`}</span></span>
                    <Selo cor={s.tipo === "MEDICO_TRABALHO" ? "verde" : s.tipo === "PROFISSIONAL_SST" ? "azul" : "cinza"}>{s.tipo === "MEDICO_TRABALHO" ? "PCMSO" : s.tipo === "PROFISSIONAL_SST" ? "PGR" : "Empresa"}</Selo>
                  </div>
                  {editar && <details className="mt-2"><summary className="cursor-pointer text-xs font-semibold text-palla-azul">Editar</summary><FormSignatario s={s} parceiros={parceiros} /></details>}
                </li>
              ))}
            </ul>
          )}
          {editar && <details className="mt-4 text-sm" open={signatarios.length === 0}><summary className="cursor-pointer font-semibold text-palla-azul">Cadastrar quem assina</summary><FormSignatario parceiros={parceiros} /></details>}
        </Cartao>

        <Cartao titulo="Empresas parceiras (logotipo nos documentos)">
          {parceiros.length === 0 ? <Vazio>Nenhuma empresa cadastrada.</Vazio> : (
            <ul className="space-y-3">
              {parceiros.map((p) => (
                <li key={p.id} className={`rounded-lg border border-linha p-3 text-sm ${p.ativo ? "" : "opacity-60"}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-28 shrink-0 items-center justify-center rounded border border-linha bg-white p-1">
                      {p.logoPath ? <img src={`/api/sst/logo/${p.id}`} alt={`Logotipo ${p.nome}`} className="max-h-12 max-w-full object-contain" /> : <span className="text-[11px] text-tinta-suave">sem logotipo</span>}
                    </div>
                    <span><span className="font-medium">{p.nome}</span><span className="block text-xs text-tinta-suave">{TIPO_PARCEIRO[p.tipo]}{p.cnpj && ` · CNPJ ${p.cnpj}`}{p.contato && ` · ${p.contato}`}</span></span>
                  </div>
                  {editar && <details className="mt-2"><summary className="cursor-pointer text-xs font-semibold text-palla-azul">Editar ou trocar logotipo</summary><FormParceiro p={p} /></details>}
                </li>
              ))}
            </ul>
          )}
          {editar && <details className="mt-4 text-sm" open={parceiros.length === 0}><summary className="cursor-pointer font-semibold text-palla-azul">Cadastrar empresa</summary><FormParceiro /></details>}
        </Cartao>
      </div>
    </>
  );
}

function FormSignatario({ s, parceiros }: { s?: Signatario; parceiros: Parceiro[] }) {
  return (
    <Formulario acao={salvarSignatarioAcao.bind(null, s?.id ?? null)} rotulo={s ? "Salvar" : "Cadastrar"} variante={s ? "secundario" : "primario"} className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir={!s}>
      <div className="sm:col-span-2"><Campo rotulo="Assina como"><Selecao name="tipo" defaultValue={s?.tipo ?? "PROFISSIONAL_SST"}>{Object.entries(TIPO_SIGNATARIO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo></div>
      <div className="sm:col-span-2"><Campo rotulo="Nome completo"><Entrada name="nome" defaultValue={s?.nome} required /></Campo></div>
      <Campo rotulo="Qualificação" ajuda="Ex.: Engenheiro de Segurança do Trabalho; Médico do Trabalho; Diretor."><Entrada name="qualificacao" defaultValue={s?.qualificacao} required /></Campo>
      <Campo rotulo="Cargo (opcional)"><Entrada name="cargo" defaultValue={s?.cargo ?? ""} /></Campo>
      <div className="grid grid-cols-[1fr_70px] gap-2">
        <Campo rotulo="Conselho / órgão"><Entrada name="conselho" defaultValue={s?.conselho ?? ""} placeholder="CREA, CRM, MTE" /></Campo>
        <Campo rotulo="UF"><Entrada name="uf" defaultValue={s?.uf ?? ""} maxLength={2} placeholder="SP" /></Campo>
      </div>
      <Campo rotulo="Número do registro" ajuda="Obrigatório para quem assina PGR ou PCMSO."><Entrada name="registro" defaultValue={s?.registro} /></Campo>
      <Campo rotulo="Empresa (opcional)"><Selecao name="parceiroId" defaultValue={s?.parceiroId ?? ""}><option value="">Palla / autônomo</option>{parceiros.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}</Selecao></Campo>
      <Campo rotulo="E-mail"><Entrada type="email" name="email" defaultValue={s?.email ?? ""} /></Campo>
      <Campo rotulo="Telefone"><Entrada name="telefone" defaultValue={s?.telefone ?? ""} /></Campo>
      {s && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="ativo" value="1" defaultChecked={s.ativo} /> Ativo</label>}
    </Formulario>
  );
}

function FormParceiro({ p }: { p?: Parceiro }) {
  return (
    <Formulario acao={salvarParceiroAcao.bind(null, p?.id ?? null)} rotulo={p ? "Salvar" : "Cadastrar"} variante={p ? "secundario" : "primario"} className="mt-3 grid gap-3 sm:grid-cols-2" limparAoConcluir={!p}>
      <div className="sm:col-span-2"><Campo rotulo="Nome da empresa"><Entrada name="nome" defaultValue={p?.nome} required /></Campo></div>
      <Campo rotulo="Tipo"><Selecao name="tipo" defaultValue={p?.tipo ?? "SEGURANCA"}>{Object.entries(TIPO_PARCEIRO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
      <Campo rotulo="CNPJ (opcional)"><Entrada name="cnpj" defaultValue={p?.cnpj ?? ""} /></Campo>
      <div className="sm:col-span-2"><Campo rotulo="Contato (opcional)"><Entrada name="contato" defaultValue={p?.contato ?? ""} placeholder="Telefone, e-mail ou responsável" /></Campo></div>
      <div className="sm:col-span-2"><Campo rotulo={p?.logoPath ? "Trocar logotipo" : "Logotipo"} ajuda="PNG com fundo transparente fica melhor. Até 2 MB."><Entrada type="file" name="logo" accept="image/png,image/jpeg,image/webp" /></Campo></div>
      {p && (
        <div className="flex flex-wrap gap-4 text-sm sm:col-span-2">
          <label className="flex items-center gap-2"><input type="checkbox" name="ativo" value="1" defaultChecked={p.ativo} /> Ativa</label>
          {p.logoPath && <label className="flex items-center gap-2"><input type="checkbox" name="removerLogo" value="1" /> Remover logotipo</label>}
        </div>
      )}
    </Formulario>
  );
}
