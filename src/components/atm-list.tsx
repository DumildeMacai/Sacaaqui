"use client";

import { mockAtms } from '@/lib/mock-data';
import { AtmCard } from './atm-card';
import type { Atm } from '@/types';
import React from 'react';

export function AtmList() {
    const [atms, setAtms] = React.useState<Atm[]>(mockAtms);

    const handleStatusUpdate = (atmId: string, status: 'com_dinheiro' | 'sem_dinheiro') => {
        setAtms(currentAtms =>
            currentAtms.map(atm =>
                atm.id === atmId
                    ? {
                        ...atm,
                        status,
                        lastUpdate: new Date().toISOString(),
                        reports: [
                            { userId: 'currentUser', status, timestamp: new Date().toISOString() },
                            ...atm.reports,
                        ],
                      }
                    : atm
            )
        );
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {atms.map(atm => (
                <AtmCard key={atm.id} atm={atm} onStatusUpdate={handleStatusUpdate} />
            ))}
        </div>
    );
}
