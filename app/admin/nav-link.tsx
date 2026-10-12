"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const p = usePathname();
  const ativo = href === "/admin" ? p === "/admin" : p.startsWith(href);
  return (
    <Link href={href} aria-current={ativo ? "page" : undefined}
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${ativo ? "bg-white/12 text-white shadow-[inset_3px_0_0_var(--color-palla-vermelho)]" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
      {children}
    </Link>
  );
}
