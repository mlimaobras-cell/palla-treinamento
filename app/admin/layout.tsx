import Link from "next/link";
import { Marca } from "@/components/marca";
import { NOME_PERFIL, pode, type Permissao } from "@/lib/permissoes";
import { exigirEquipe } from "@/lib/sessao";
import { sair } from "@/app/login/acoes";
import { NavLink } from "./nav-link";
import { InstalarApp } from "@/components/app-pwa";

const MENU: { href: string; rotulo: string; p: Permissao }[] = [
  { href: "/admin", rotulo: "Painel", p: "painel.ver" },
  { href: "/admin/colaboradores", rotulo: "Colaboradores", p: "colaborador.ver" },
  { href: "/admin/obras", rotulo: "Obras e convites", p: "obra.gerir" },
  { href: "/admin/matriz", rotulo: "Matriz por função", p: "curso.ver" },
  { href: "/admin/cursos", rotulo: "Cursos", p: "curso.ver" },
  { href: "/admin/videos", rotulo: "Vídeos", p: "curso.ver" },
  { href: "/admin/resultados", rotulo: "Resultados das provas", p: "colaborador.ver" },
  { href: "/admin/praticas", rotulo: "Atividades práticas", p: "pratica.registrar" },
  { href: "/admin/aprovacoes", rotulo: "Aprovações", p: "capacitacao.aprovar" },
  { href: "/admin/certificados", rotulo: "Certificados", p: "colaborador.ver" },
  { href: "/admin/sst", rotulo: "Saúde e Segurança", p: "sst.ver" },
  { href: "/admin/prazos", rotulo: "Prazos e alertas", p: "prazo.ver" },
  { href: "/admin/acessos", rotulo: "Acessos e avisos", p: "colaborador.ver" },
  { href: "/admin/auditoria", rotulo: "Auditoria", p: "auditoria.ver" },
];

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const a = await exigirEquipe();
  const itens = MENU.filter((m) => pode(a, m.p));
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="bg-palla-azul-escuro text-white lg:sticky lg:top-0 lg:h-dvh">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/admin"><Marca branco className="h-9" /></Link>
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 lg:mt-3 lg:block">Treinamento e Integração</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {itens.map((m) => <NavLink key={m.href} href={m.href}>{m.rotulo}</NavLink>)}
        </nav>
        <div className="hidden border-t border-white/10 px-5 py-4 text-sm lg:absolute lg:bottom-0 lg:block lg:w-full">
          <p className="truncate font-medium">{a.nome}</p>
          <p className="text-xs text-white/60">{NOME_PERFIL[a.perfil]}</p>
          <InstalarApp claro className="mt-2" />
          <div className="mt-2 flex gap-4"><Link href="/conta/senha" className="text-xs font-semibold text-white/70 hover:text-white">Trocar senha</Link><form action={sair}><button className="text-xs font-semibold text-white/70 hover:text-white">Sair</button></form></div>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-3 border-b border-linha bg-white px-4 py-2 text-sm lg:hidden">
          <span className="truncate text-tinta-suave">{a.nome} · {NOME_PERFIL[a.perfil]}</span>
          <InstalarApp />
          <Link href="/conta/senha" className="font-medium text-palla-azul">Senha</Link>
          <form action={sair}><button className="font-semibold text-palla-vermelho">Sair</button></form>
        </div>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
