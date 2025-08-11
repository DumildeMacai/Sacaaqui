// src/app/api/atms/[id]/route.ts
import { getAtmById } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

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
