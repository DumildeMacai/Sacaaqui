// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import type { Atm } from '@/types';
import dotenv from 'dotenv';
import expand from 'dotenv-expand';

// Load and expand environment variables
const env = dotenv.config();
expand.expand(env);

// Explicitly type the service account credentials
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Ensure that Firebase is initialized only once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('CRITICAL: Error initializing Firebase Admin SDK:', error);
    // Throw an error to prevent the application from running with a misconfigured Firebase connection
    throw new Error('Firebase Admin initialization failed');
  }
}

const db = admin.firestore();

// Helper function to safely convert Firestore Timestamps to ISO strings
const convertTimestampToString = (timestamp: any): string => {
  if (timestamp instanceof admin.firestore.Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    // If it's already a string, assume it's in the correct format or a format that can be handled.
    // This handles data from mock sources or already converted data.
    return timestamp;
  }
  // Return a default or a well-known invalid format string for easy debugging.
  // Using the current time as a fallback can hide issues.
  return new Date().toISOString(); 
};

export async function getAtms(): Promise<Atm[]> {
  try {
    const atmsSnapshot = await db.collection('atms').get();
    if (atmsSnapshot.empty) {
      return [];
    }

    const atms = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure reports is always an array, and its timestamps are converted
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
      } as Atm;
    });
    return atms;
  } catch (error) {
    console.error("Error fetching ATMs from Firestore:", error);
    throw new Error('Failed to fetch ATMs from Firestore.');
  }
}

export async function getAtmById(id: string): Promise<Atm | null> {
  try {
    const atmDoc = await db.collection('atms').doc(id).get();
    if (!atmDoc.exists) {
      return null;
    }

    const data = atmDoc.data()!;
    const reports = (data.reports || []).map((report: any) => ({
        ...report,
        timestamp: convertTimestampToString(report.timestamp),
    }));

    return {
      id: atmDoc.id,
      name: data.name || '',
      address: data.address || '',
      location: data.location || { lat: 0, lng: 0 },
      status: data.status || 'desconhecido',
      details: data.details || '',
      lastUpdate: convertTimestampToString(data.lastUpdate),
      reports: reports,
    } as Atm;
  } catch (error) {
    console.error(`Error fetching ATM with id ${id}:`, error);
    throw new Error(`Failed to fetch ATM ${id} from Firestore.`);
  }
}

export async function addAtm(atmData: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'>): Promise<string> {
    const newAtmRef = db.collection('atms').doc();
    const newAtm = {
        ...atmData,
        status: 'desconhecido',
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
        reports: [], // Ensure reports is initialized as an empty array
        details: atmData.details || '',
    };
    await newAtmRef.set(newAtm);
    return newAtmRef.id;
}

export async function updateAtm(id: string, atmData: Partial<Omit<Atm, 'id'>>): Promise<void> {
    const atmRef = db.collection('atms').doc(id);
    const updateData = { ...atmData, lastUpdate: admin.firestore.FieldValue.serverTimestamp() };
    await atmRef.update(updateData);
}
