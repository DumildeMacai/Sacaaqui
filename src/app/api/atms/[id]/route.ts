
// src/app/api/atms/[id]/route.ts
import { getAtmById, updateAtm } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
import type { Atm } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'ATM ID is required' }, { status: 400 });
    }
    const atm = await getAtmById(id);
    if (!atm) {
      return NextResponse.json({ error: 'ATM not found' }, { status: 404 });
    }
    return NextResponse.json(atm);
  } catch (error) {
    console.error(`Error fetching ATM ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'ATM ID is required' }, { status: 400 });
    }

    const body: Partial<Omit<Atm, 'id'>> = await request.json();

    // Validação robusta dos dados recebidos
    if (!body.name || !body.address || !body.location || typeof body.location.lat !== 'number' || typeof body.location.lng !== 'number') {
        return NextResponse.json({ error: 'Missing or invalid required ATM fields: name, address, location (lat, lng).' }, { status: 400 });
    }
    
    // Assegura que `details` é uma string, mesmo que não seja fornecido
    const atmData: Partial<Omit<Atm, 'id'>> = {
        name: body.name,
        address: body.address,
        location: body.location,
        details: body.details || '',
    };

    // A função updateAtm já lida com o lastUpdate
    await updateAtm(id, atmData);

    return NextResponse.json({ message: 'ATM updated successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error updating ATM ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
