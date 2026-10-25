/* eslint-disable @next/next/no-img-element */
import { Marca } from "./marca";

/** Cabeçalho dos documentos impressos: logotipo da Palla e, quando houver, o da empresa parceira (consultoria ou clínica). */
export function CabecalhoDocumento({ parceiro, papel, extra }: {
  parceiro?: { id: string; nome: string; logoPath: string | null } | null; papel?: string; extra?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-6 border-b-2 border-palla-azul pb-3">
      <div className="flex items-center gap-5">
        <Marca className="h-10" />
        {parceiro && (
          <div className="flex items-center gap-3 border-l border-linha pl-5">
            {parceiro.logoPath ? <img src={`/api/sst/logo/${parceiro.id}`} alt={parceiro.nome} className="max-h-10 max-w-40 object-contain" /> : null}
            <div className="text-[10px] leading-tight text-tinta-suave">{papel && <span className="block uppercase tracking-wide">{papel}</span>}<span className="font-semibold text-palla-azul-escuro">{parceiro.nome}</span></div>
          </div>
        )}
      </div>
      <div className="text-right text-xs text-tinta-suave">
        <p className="font-semibold text-palla-azul">{process.env.EMPRESA_NOME ?? "Palla Construções"}</p>
        {process.env.EMPRESA_CNPJ && <p>CNPJ {process.env.EMPRESA_CNPJ}</p>}
        {extra}
      </div>
    </header>
  );
}
