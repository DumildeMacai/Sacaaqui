// src/app/api/atms/[id]/route.ts
import { db } from '@/firebase/init';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import type { Atm } from '@/types';

// Helper to convert Firestore Timestamps to ISO strings safely
const convertTimestampToString = (timestamp: any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date(0).toISOString();
};


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'ATM ID is required' }, { status: 400 });
    }
    
    const atmRef = doc(db, 'atms', id);
    const atmDoc = await getDoc(atmRef);

    if (!atmDoc.exists()) {
      return NextResponse.json({ error: 'ATM not found' }, { status: 404 });
    }

    const data = atmDoc.data();
    const reports = (data.reports || []).map((report: any) => ({
      ...report,
      timestamp: convertTimestampToString(report.timestamp),
    }));

    const atm: Atm = {
        id: atmDoc.id,
        name: data.name || '',
        address: data.address || '',
        location: data.location || { lat: 0, lng: 0 },
        status: data.status || 'desconhecido',
        details: data.details || '',
        lastUpdate: convertTimestampToString(data.lastUpdate),
        reports: reports,
    };

    return NextResponse.json(atm);
  } catch (error) {
    console.error(`Error fetching ATM ${params.id} with Firestore Client:`, error);
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

    if (!body.name || !body.address || !body.location || typeof body.location.lat !== 'number' || typeof body.location.lng !== 'number') {
        return NextResponse.json({ error: 'Missing or invalid required ATM fields: name, address, location (lat, lng).' }, { status: 400 });
    }
    
    const atmRef = doc(db, 'atms', id);

    const updateData = {
        ...body,
        lastUpdate: serverTimestamp(),
    };

    await updateDoc(atmRef, updateData);

    return NextResponse.json({ message: 'ATM updated successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Error updating ATM ${params.id} with Firestore Client:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
