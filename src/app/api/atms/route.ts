// src/app/api/atms/route.ts
import { getAtms } from '@/lib/firebase-admin';
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
