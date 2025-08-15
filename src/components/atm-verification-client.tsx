
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, BrainCircuit, ShieldCheck, HelpCircle } from 'lucide-react';
import type { Atm, Report, User } from '@/types';
import { verifyAtmStatusAction } from '@/actions/verify-status';
import type { VerifyAtmStatusOutput } from '@/ai/flows/verify-atm-status';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { updateUserReputationAction } from '@/actions/update-reputation';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/init';


export function AtmVerificationClient({ atm }: { atm: Atm }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerifyAtmStatusOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleVerification = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        if (atm.reports.length === 0) {
            setError("Não há relatórios para verificar.");
            setLoading(false);
            return;
        }

        try {
            // Step 1: Fetch reputation for all users who reported
            const userIds = [...new Set(atm.reports.map(r => r.userId))];
            const userReputations = new Map<string, number>();

            // Fetch each user document to get their reputation
            for (const userId of userIds) {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    userReputations.set(userId, (userDoc.data() as User).reputation || 0);
                } else {
                    userReputations.set(userId, 0); // Default to 0 if user not found
                }
            }
            
            // Step 2: Augment reports with reputation
            const reportsWithReputation = atm.reports.map(report => ({
                ...report,
                userReputation: userReputations.get(report.userId) ?? 0,
            }));

            // Step 3: Verify the ATM's status
            const verificationResult = await verifyAtmStatusAction({
                atmId: atm.id,
                reports: reportsWithReputation,
            });
            setResult(verificationResult);

            // Step 4: If verification is successful and a conclusive status is found,
            // trigger the reputation update in the background.
            if (verificationResult && verificationResult.verifiedStatus !== 'desconhecido') {
                toast({
                    title: "Atualizando Reputação",
                    description: "A reputação dos utilizadores que reportaram está a ser ajustada com base na verificação."
                });
                
                // This is a fire-and-forget call. We don't need to await it.
                updateUserReputationAction({
                    verifiedStatus: verificationResult.verifiedStatus,
                    reports: atm.reports.map(r => ({ userId: r.userId, status: r.status })),
                });
            }

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
                <Button onClick={handleVerification} disabled={loading || atm.reports.length === 0} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {atm.reports.length === 0 ? "Sem relatórios para verificar" : "Verificar Status"}
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

