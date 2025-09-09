
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Atm } from '@/types';
import 'leaflet/dist/leaflet.css';

// Custom icons for different statuses
const comDinheiroIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const semDinheiroIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const desconhecidoIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getIcon = (status: Atm['status']) => {
    switch (status) {
        case 'com_dinheiro':
            return comDinheiroIcon;
        case 'sem_dinheiro':
            return semDinheiroIcon;
        case 'desconhecido':
        default:
            return desconhecidoIcon;
    }
};

interface AtmMapProps {
  atms: Atm[];
}

export default function AtmMap({ atms }: AtmMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        // Initialize map only if the ref is available and no map instance exists
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([-8.8368, 13.2343], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
        }

        // Add markers
        if (mapInstance.current) {
            // Clear existing markers before adding new ones
            mapInstance.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstance.current?.removeLayer(layer);
                }
            });
            
            atms.forEach(atm => {
                const popupContent = `
                    <div class="space-y-2">
                         <h3 class="font-bold">${atm.name}</h3>
                         <p class="text-sm">${atm.address}</p>
                         <p class="text-xs capitalize">Status: <span class="font-semibold">${atm.status.replace('_', ' ')}</span></p>
                         <a href="/dashboard/atm/${atm.id}" class="block w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 text-sm rounded-md py-1">Ver Detalhes</a>
                    </div>
                `;

                L.marker([atm.location.lat, atm.location.lng], { icon: getIcon(atm.status) })
                    .addTo(mapInstance.current!)
                    .bindPopup(popupContent);
            });
        }
        
        // Cleanup function to run when component unmounts
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [atms]);

    return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
