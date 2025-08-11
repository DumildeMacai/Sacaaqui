import { getAtms, addAtm } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
import type { Atm } from '@/types';

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
        const body: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'> = await request.json();

        // Validação básica para garantir que os campos essenciais existem
        if (!body.name || !body.address || !body.location || typeof body.location.lat !== 'number' || typeof body.location.lng !== 'number') {
            return NextResponse.json({ error: 'Missing or invalid required ATM fields: name, address, location (lat, lng).' }, { status: 400 });
        }
        
        // A função addAtm já define os valores padrão (status, lastUpdate, reports)
        const newAtmId = await addAtm(body);
        
        return NextResponse.json({ id: newAtmId, message: 'ATM added successfully' }, { status: 201 });

    } catch (error) {
        console.error('Error adding ATM:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}
