/* eslint-disable @next/next/no-img-element */
export function Marca({ branco = false, className = "h-9" }: { branco?: boolean; className?: string }) {
  return <img src={branco ? "/logo-palla-branco.png" : "/logo-palla.png"} alt="Palla Construções" className={`${className} w-auto`} />;
}

export function CabecalhoPublico() {
  return (
    <header className="border-b border-linha bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Marca className="h-8" />
        <span className="text-right text-xs font-semibold uppercase tracking-wider text-palla-azul-escuro">
          Grupo Palla<br /><span className="font-normal normal-case tracking-normal text-tinta-suave">Treinamento e Integração</span>
        </span>
      </div>
    </header>
  );
}
