
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MacaiLogo } from '@/components/logo';

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
              <MacaiLogo />
            </div>
            <CardTitle className="text-2xl font-headline">Instruções para Eliminação de Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
             <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>

            <p>No Macai ATM Locator, respeitamos o seu direito à privacidade e o controlo sobre os seus dados pessoais. Se desejar eliminar a sua conta e os dados associados, siga as instruções abaixo.</p>

            <h3 className="font-semibold text-lg text-foreground">Como solicitar a eliminação dos seus dados</h3>
            <p>Para solicitar a eliminação permanente da sua conta e de todos os seus dados pessoais associados à nossa aplicação, por favor, envie um e-mail para o nosso endereço de suporte:</p>
            
            <p className="text-center font-semibold text-lg text-primary">
                dumildemacai@gmail.com
            </p>

            <p>No seu e-mail, por favor, inclua as seguintes informações para que possamos verificar a sua identidade e processar o seu pedido:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Assunto do E-mail:</strong> "Pedido de Eliminação de Dados"</li>
              <li><strong>Corpo do E-mail:</strong> Inclua o endereço de e-mail associado à sua conta no Macai ATM Locator.</li>
            </ul>

            <h3 className="font-semibold text-lg text-foreground">O que acontece depois de enviar o pedido?</h3>
            <p>Após recebermos o seu pedido, a nossa equipa irá verificar as informações e proceder à eliminação da sua conta e de todos os seus dados associados, incluindo o seu perfil, histórico de relatórios e pontuação de reputação. Este processo será concluído num prazo de 30 dias.</p>
            <p>Ser-lhe-á enviada uma confirmação por e-mail assim que os seus dados tiverem sido eliminados com sucesso.</p>

            <h3 className="font-semibold text-lg text-foreground">Que dados são eliminados?</h3>
            <p>A eliminação da sua conta removerá permanentemente todos os dados de identificação pessoal da nossa base de dados, incluindo o seu nome, e-mail, data de nascimento e número de telefone. Relatórios anónimos ou estatísticas agregadas que não o identifiquem pessoalmente poderão ser mantidos.</p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
