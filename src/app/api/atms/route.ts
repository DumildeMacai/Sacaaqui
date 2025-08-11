import { getAtms, addAtm } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const atms = await getAtms();
    return NextResponse.json(atms);
  } catch (error) {
    console.error('Error fetching ATMs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const atmData = await request.json();
        
        // Validação completa para garantir que todos os campos obrigatórios estão presentes
        if (!atmData.name || !atmData.address || !atmData.location || typeof atmData.location.lat !== 'number' || typeof atmData.location.lng !== 'number') {
            return NextResponse.json({ error: 'Missing or invalid required ATM fields' }, { status: 400 });
        }

        // Passa apenas os campos esperados para a função addAtm
        const newAtmPayload = {
            name: atmData.name,
            address: atmData.address,
            location: atmData.location,
            details: atmData.details || '', // Garante que details seja uma string
        };

        const newAtmId = await addAtm(newAtmPayload);
        
        return NextResponse.json({ id: newAtmId, message: 'ATM added successfully' }, { status: 201 });

    } catch (error) {
        console.error('Error adding ATM:', error);
        // Retorna uma mensagem de erro mais específica se possível
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
