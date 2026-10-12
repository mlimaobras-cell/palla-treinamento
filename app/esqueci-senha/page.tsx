import Link from "next/link";
import { CabecalhoPublico } from "@/components/marca";

export const metadata = { title: "Esqueci minha senha" };

export default function EsqueciSenha() {
  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-md px-4 py-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-palla-vermelho">Esqueci minha senha</p>
        <h1 className="mt-1 text-2xl font-semibold text-palla-azul-escuro">Peça um link de nova senha</h1>
        <div className="mt-5 space-y-3 rounded-xl border border-linha bg-white p-5 text-[15px] text-tinta">
          <p>Fale com o <strong>RH</strong> ou com a <strong>Segurança do Trabalho</strong> da Palla e informe o seu nome completo.</p>
          <p>Eles geram um link pela plataforma e mandam para você, por exemplo pelo WhatsApp. Abra o link no celular e crie a nova senha.</p>
          <p className="text-sm text-tinta-suave">O link vale por 48 horas e só pode ser usado uma vez. Seu histórico de aulas e avaliações continua o mesmo.</p>
        </div>
        <p className="mt-6 text-sm"><Link href="/login" className="font-medium text-palla-azul hover:underline">← Voltar para o login</Link></p>
      </main>
    </>
  );
}
