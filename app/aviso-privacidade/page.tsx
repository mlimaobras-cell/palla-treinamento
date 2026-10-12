import { CabecalhoPublico } from "@/components/marca";
import { Aviso } from "@/components/ui";
import { VERSAO_AVISO_PRIVACIDADE } from "@/lib/servicos/cadastro";

export const metadata = { title: "Aviso de privacidade" };

export default function AvisoPrivacidade() {
  return (
    <>
      <CabecalhoPublico />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-palla-azul-escuro">Aviso de privacidade</h1>
        <p className="mt-1 text-sm text-tinta-suave">Versão {VERSAO_AVISO_PRIVACIDADE}</p>
        <div className="mt-4"><Aviso tom="alerta">Minuta para revisão do jurídico e do encarregado de dados antes do uso oficial.</Aviso></div>
        <div className="mt-6 space-y-5 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-semibold text-palla-azul-escuro">Quem trata seus dados</h2>
            <p>Palla Construções, empresa do Grupo Palla. Encarregado de dados: [A PREENCHER: nome e contato].</p>
          </section>
          <section>
            <h2 className="font-semibold text-palla-azul-escuro">Quais dados e para quê</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Identificação e contato (nome, CPF, data de nascimento, celular, e-mail): cadastro, emissão de certificados e comunicação.</li>
              <li>Função, obra e empresa: definição dos treinamentos obrigatórios e controle de acesso às obras.</li>
              <li>Participação, tempo, respostas e notas: comprovação da capacitação, exigida pela NR-1 e pelas NR específicas.</li>
              <li>ASO e aptidões: dado de saúde (dado sensível), usado somente para verificar aptidão para atividades que a exigem.</li>
              <li>Fichas de EPI, autorizações e documentos da contratante: cumprimento de obrigações legais e contratuais.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-semibold text-palla-azul-escuro">Bases legais</h2>
            <p>Cumprimento de obrigação legal ou regulatória (LGPD, art. 7º, II, e art. 11, II, a), execução do contrato de trabalho (art. 7º, V) e tutela da saúde (art. 11, II, f). [Revisar com o jurídico.]</p>
          </section>
          <section>
            <h2 className="font-semibold text-palla-azul-escuro">Segurança e acesso</h2>
            <p>O CPF é guardado criptografado. Documentos de saúde só são acessados por perfis autorizados, e todo acesso fica registrado. A página pública de verificação de certificados não mostra CPF.</p>
          </section>
          <section>
            <h2 className="font-semibold text-palla-azul-escuro">Por quanto tempo</h2>
            <p>Registros de capacitação são mantidos por no mínimo 2 anos após o fim da validade do curso (NR-1, Anexo II, 4.7.1), além dos prazos trabalhistas e previdenciários aplicáveis. [Definir tabela de retenção com o jurídico.]</p>
          </section>
          <section>
            <h2 className="font-semibold text-palla-azul-escuro">Seus direitos</h2>
            <p>Você pode pedir confirmação, acesso, correção e informações sobre o compartilhamento dos seus dados pelo contato do encarregado.</p>
          </section>
        </div>
      </main>
    </>
  );
}
