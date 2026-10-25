/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { db, schema } from "@/db";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { exigirEquipe } from "@/lib/sessao";
import { auditar } from "@/lib/auditoria";
import { urlCracha } from "@/lib/servicos/cracha";
import { FotoCracha } from "./foto";

export const metadata = { title: "Crachá" };

/** Crachá CR80 vertical (54 × 85,6 mm), frente e verso lado a lado, com marcas de corte, numa folha A4. */
export default async function Cracha({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await exigirEquipe("colaborador.ver");
  const c = await db.query.colaboradores.findFirst({ where: eq(schema.colaboradores.id, id), with: { funcao: true, obra: true } });
  if (!c) notFound();
  if (a.perfil === "GESTOR_OBRA" && c.obra?.gestorId !== a.id) notFound();
  const url = urlCracha(id);
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 600, errorCorrectionLevel: "M", color: { dark: "#1C2552" } });
  await auditar(a, "CRACHA_GERADO", "colaborador", id);
  const nomes = c.nome.trim().split(/\s+/);
  const nomeCurto = nomes.length > 2 ? `${nomes[0]} ${nomes[nomes.length - 1]}` : c.nome;

  return (
    <div className="mx-auto max-w-[820px] bg-white p-8 text-tinta print:p-0">
      <style>{`
        @page { size: A4; margin: 15mm }
        @media print { html, body { background: #fff !important } .nao-imprimir { display: none } }
        .cartao { width: 54mm; height: 85.6mm; border-radius: 3mm; overflow: hidden; position: relative; outline: 0.2mm dashed #9aa1b8; outline-offset: 1.5mm;
          -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .foto-cracha { background: #eef0f6 center/cover no-repeat; }
      `}</style>

      <div className="nao-imprimir mb-6 rounded-lg border border-linha bg-slate-50 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Link href={`/admin/colaboradores/${id}`} className="text-sm font-medium text-palla-azul">← {c.nome}</Link>
          <BotaoImprimir />
        </div>
        <FotoCracha />
        <p className="text-xs text-tinta-suave">Imprima em tamanho real (100%, sem “ajustar à página”) e corte pela linha tracejada. O QR mostra à portaria os treinamentos válidos e se há liberação de acesso registrada, sempre atualizados.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-[12mm]">
        {/* Frente */}
        <div className="cartao flex flex-col bg-white shadow-sm print:shadow-none">
          <div className="flex h-[17mm] items-center justify-center bg-palla-azul-escuro px-[4mm]"><img src="/logo-palla-branco.png" alt="Palla Construções" className="h-[9mm] w-auto" /></div>
          <div className="h-[1.2mm] bg-palla-vermelho" />
          <div className="flex flex-1 flex-col items-center px-[4mm] pt-[4mm] text-center">
            <div className="foto-cracha h-[30mm] w-[23mm] rounded-[1.5mm] ring-1 ring-linha" />
            <p className="mt-[3mm] text-[11pt] font-bold leading-tight text-palla-azul-escuro">{nomeCurto}</p>
            <p className="mt-[1mm] text-[7.5pt] leading-tight text-tinta-suave">{c.nome !== nomeCurto ? c.nome : " "}</p>
          </div>
          <div className="mx-[3mm] mb-[3mm] rounded-[1.5mm] bg-palla-vermelho px-[2mm] py-[1.6mm] text-center text-[8pt] font-bold uppercase leading-tight text-white">{c.funcao.nome}</div>
        </div>

        {/* Verso */}
        <div className="cartao flex flex-col items-center bg-white px-[4mm] pt-[4mm] text-center shadow-sm print:shadow-none">
          <p className="text-[7pt] font-semibold uppercase tracking-[0.12em] text-palla-azul-escuro">Grupo Palla</p>
          <p className="text-[6.5pt] text-tinta-suave">Treinamento e Integração</p>
          <img src={qr} alt="QR Code do crachá" className="mt-[3mm] h-[36mm] w-[36mm]" />
          <p className="mt-[2mm] text-[7pt] font-semibold leading-snug text-tinta">Aponte a câmera para conferir treinamentos e liberação de acesso.</p>
          <div className="mt-auto mb-[3mm] w-full border-t border-linha pt-[1.5mm] text-[6.5pt] leading-snug text-tinta-suave">
            {c.obra ? <p className="font-semibold text-tinta">{c.obra.codigo} — {c.obra.nome}</p> : <p>&nbsp;</p>}
            <p>Uso pessoal e intransferível. Se encontrar, devolva à Palla Construções.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
