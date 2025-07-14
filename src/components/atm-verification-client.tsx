"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, BrainCircuit, ShieldCheck, HelpCircle } from 'lucide-react';
import type { Atm } from '@/types';
import { verifyAtmStatusAction } from '@/actions/verify-status';
import type { VerifyAtmStatusOutput } from '@/ai/flows/verify-atm-status';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';


export function AtmVerificationClient({ atm }: { atm: Atm }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerifyAtmStatusOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVerification = async () => {
        setLoading(true);
        setError(null);
        try {
            const verificationResult = await verifyAtmStatusAction({
                atmId: atm.id,
                reports: atm.reports,
            });
            setResult(verificationResult);
        } catch (e) {
            setError('Falha ao verificar o status. Tente novamente.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    const StatusIcon = ({status}: {status: string}) => {
        switch (status) {
            case 'com_dinheiro':
                return <ShieldCheck className="h-5 w-5 text-accent" />;
            case 'sem_dinheiro':
                return <ShieldCheck className="h-5 w-5 text-destructive" />;
            default:
                return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
        }
    }

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    Verificação com IA
                </CardTitle>
                <CardDescription>
                    Use nossa IA para analisar os relatos e obter um status verificado.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleVerification} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Verificar Status
                </Button>

                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

                {result && (
                     <Alert className="mt-4">
                        <StatusIcon status={result.verifiedStatus} />
                        <AlertTitle className="capitalize">
                            Status Verificado: {result.verifiedStatus.replace('_', ' ')}
                        </AlertTitle>
                        <AlertDescription className="space-y-2">
                           <p>{result.reasoning}</p>
                           <p>
                             Confiança: <Badge variant="secondary">{Math.round(result.confidenceScore * 100)}%</Badge>
                           </p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
