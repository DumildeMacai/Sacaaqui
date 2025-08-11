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
        
        // Basic validation
        if (!atmData.name || !atmData.address || !atmData.location) {
            return NextResponse.json({ error: 'Missing required ATM fields' }, { status: 400 });
        }

        const newAtmId = await addAtm(atmData);
        return NextResponse.json({ id: newAtmId }, { status: 201 });
    } catch (error) {
        console.error('Error adding ATM:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
