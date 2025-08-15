// src/app/api/atms/route.ts
import { db } from '@/firebase/init';
import { collection, getDocs, addDoc, serverTimestamp, query } from 'firebase/firestore';
import { NextResponse, type NextRequest } from 'next/server';
import type { Atm } from '@/types';

// Helper to convert Firestore Timestamps to ISO strings safely
const convertTimestampToString = (timestamp: any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  // Return a default or placeholder if the timestamp is invalid
  return new Date(0).toISOString(); 
};


export async function GET(request: NextRequest) {
  try {
    const q = query(collection(db, "atms"));
    const atmsSnapshot = await getDocs(q);
    
    if (atmsSnapshot.empty) {
      return NextResponse.json([]);
    }

    const atms: Atm[] = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      const reports = (data.reports || []).map((report: any) => ({
        ...report,
        timestamp: convertTimestampToString(report.timestamp),
      }));

      return {
        id: doc.id,
        name: data.name || '',
        address: data.address || '',
        location: data.location || { lat: 0, lng: 0 },
        status: data.status || 'desconhecido',
        details: data.details || '',
        lastUpdate: convertTimestampToString(data.lastUpdate),
        reports: reports,
      };
    });

    return NextResponse.json(atms);
  } catch (error) {
    console.error('Error fetching ATMs from Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'> = await request.json();

        if (!body.name || !body.address || !body.location || typeof body.location.lat !== 'number' || typeof body.location.lng !== 'number') {
            return NextResponse.json({ error: 'Missing or invalid required ATM fields: name, address, location (lat, lng).' }, { status: 400 });
        }
        
        const newAtmPayload = {
            ...body,
            status: 'desconhecido',
            lastUpdate: serverTimestamp(),
            reports: [],
            details: body.details || '',
        };

        const docRef = await addDoc(collection(db, 'atms'), newAtmPayload);
        
        return NextResponse.json({ id: docRef.id, message: 'ATM added successfully' }, { status: 201 });

    } catch (error) {
        console.error('Error adding ATM with Firestore Client:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}
