import { redirect } from "next/navigation";
import { obterAtor } from "@/lib/sessao";

export default async function Inicio() {
  const a = await obterAtor();
  if (!a) redirect("/login");
  redirect(a.perfil === "COLABORADOR" ? "/colaborador" : "/admin");
}
