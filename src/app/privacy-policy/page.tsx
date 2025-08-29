
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MacaiLogo } from '@/components/logo';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <MacaiLogo />
            </div>
            <CardTitle className="text-2xl font-headline">Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            
            <p>A sua privacidade é importante para nós. É política do Macai ATM Locator respeitar a sua privacidade em relação a qualquer informação sua que possamos recolher na nossa aplicação.</p>

            <h3 className="font-semibold text-lg text-foreground">1. Informações que recolhemos</h3>
            <p>Recolhemos informações que você nos fornece diretamente, como quando cria uma conta. As informações que recolhemos incluem:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nome</li>
              <li>Endereço de e-mail</li>
              <li>Data de Nascimento</li>
              <li>Número de telefone</li>
            </ul>
            <p>Também recolhemos informações que você gera ao usar a aplicação, como os relatórios de status dos ATMs.</p>


            <h3 className="font-semibold text-lg text-foreground">2. Como usamos as suas informações</h3>
            <p>Usamos as informações que recolhemos para:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Fornecer, operar e manter a nossa aplicação.</li>
              <li>Melhorar, personalizar e expandir a nossa aplicação.</li>
              <li>Calcular e gerir a sua pontuação de reputação com base na precisão dos seus relatórios.</li>
              <li>Comunicar consigo, seja diretamente ou através de um dos nossos parceiros, incluindo para atendimento ao cliente, para lhe fornecer atualizações e outras informações relacionadas à aplicação.</li>
            </ul>

            <h3 className="font-semibold text-lg text-foreground">3. Partilha de informações</h3>
            <p>Não partilhamos as suas informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>

            <h3 className="font-semibold text-lg text-foreground">4. Segurança</h3>
            <p>A segurança dos seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrónico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger os seus Dados Pessoais, não podemos garantir a sua segurança absoluta.</p>

            <h3 className="font-semibold text-lg text-foreground">5. Contacte-nos</h3>
            <p>Se tiver alguma dúvida sobre esta Política de Privacidade, pode contactar-nos através do e-mail: dumildemacai@gmail.com</p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
