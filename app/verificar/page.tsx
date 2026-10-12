import { redirect } from "next/navigation";
import { CabecalhoPublico } from "@/components/marca";
import { Botao, Campo, Entrada } from "@/components/ui";

export const metadata = { title: "Verificar certificado" };

async function buscar(f: FormData) {
  "use server";
  const c = String(f.get("codigo") ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (c) redirect(`/verificar/${c}`);
}

export default function Verificar() {
  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold text-palla-azul-escuro">Verificar certificado</h1>
        <p className="mt-2 text-sm text-tinta-suave">Digite o código de verificação impresso no certificado ou leia o QR Code.</p>
        <form action={buscar} className="mt-6 space-y-4 rounded-xl border border-linha bg-white p-5">
          <Campo rotulo="Código de verificação"><Entrada name="codigo" placeholder="Ex.: 7VL4D4GEWT" className="font-mono uppercase tracking-widest" required /></Campo>
          <Botao type="submit">Verificar</Botao>
        </form>
      </main>
    </>
  );
}
