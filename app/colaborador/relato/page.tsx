import { Formulario } from "@/components/formulario";
import { AreaTexto, Aviso, Campo, Cartao, Entrada, Selecao, Selo } from "@/components/ui";
import { fmtData } from "@/lib/formato";
import { exigirColaborador } from "@/lib/sessao";
import { CATEGORIA_RELATO, consultarRelato, DIAS_APURACAO, STATUS_RELATO } from "@/lib/servicos/psicossocial";
import { enviarRelatoAcao } from "../acoes";

export const metadata = { title: "Canal de relato" };

export default async function Relato({ searchParams }: { searchParams: Promise<{ protocolo?: string; novo?: string }> }) {
  await exigirColaborador();
  const sp = await searchParams;
  const consulta = sp.protocolo ? await consultarRelato(sp.protocolo) : null;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-palla-azul-escuro">Canal de relato</h1>
      {sp.novo && consulta && (
        <Aviso tom="sucesso">Relato recebido. <strong>Anote o protocolo: <span className="font-mono">{consulta.protocolo}</span></strong>. Com ele você acompanha a resposta aqui mesmo. Prazo de apuração: até {fmtData(consulta.prazoApuracao)}.</Aviso>
      )}
      {consulta && !sp.novo && (
        <Cartao titulo={`Protocolo ${consulta.protocolo}`} acao={<Selo cor={STATUS_RELATO[consulta.status].cor}>{STATUS_RELATO[consulta.status].rotulo}</Selo>}>
          <p className="text-sm text-tinta-suave">Recebido em {fmtData(consulta.criadoEm)} · prazo {fmtData(consulta.prazoApuracao)}</p>
          <p className="mt-2 text-sm">{consulta.resposta ?? "Ainda sem devolutiva. Volte a consultar mais tarde."}</p>
        </Cartao>
      )}
      {sp.protocolo && !consulta && <Aviso tom="erro">Protocolo não encontrado. Confira as letras e os números.</Aviso>}

      <Cartao titulo="Fazer um relato">
        <p className="mb-3 text-sm text-tinta-suave">Use para assédio, humilhação, ameaça, discriminação, pressão ou jornada excessiva, problemas no alojamento ou conflitos. Quem lê é só o RH. Ninguém pode ser punido por relatar de boa-fé. Para risco de acidente agora, pare a atividade e avise a liderança ou a Segurança do Trabalho (direito de recusa).</p>
        <Formulario acao={enviarRelatoAcao} rotulo="Enviar relato" className="space-y-4">
          <Campo rotulo="Assunto"><Selecao name="categoria" required defaultValue=""><option value="" disabled>Escolha</option>{Object.entries(CATEGORIA_RELATO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Selecao></Campo>
          <Campo rotulo="O que aconteceu" ajuda="O que, onde, quando e quem viu. Escreva com suas palavras."><AreaTexto name="descricao" rows={6} required minLength={20} /></Campo>
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="identificar" value="1" className="mt-1 h-5 w-5" /><span>Quero me identificar (o RH pode me procurar). <span className="text-tinta-suave">Sem marcar, o relato é anônimo: não guardamos seu nome nem o horário.</span></span></label>
          <p className="text-xs text-tinta-suave">Você recebe um protocolo para acompanhar. Prazo de apuração: até {DIAS_APURACAO} dias.</p>
        </Formulario>
      </Cartao>

      <Cartao titulo="Acompanhar um relato">
        <form className="flex gap-2"><Entrada name="protocolo" placeholder="REL-XXXXXXXX" className="font-mono uppercase" required /><button className="rounded-lg bg-palla-azul px-4 text-sm font-semibold text-white">Consultar</button></form>
      </Cartao>
    </div>
  );
}
