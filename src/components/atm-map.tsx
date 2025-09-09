
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import type { Atm } from '@/types';
import { Button } from './ui/button';
import Link from 'next/link';

// Custom icon for the markers
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});


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
    const defaultPosition: LatLngExpression = [-8.8368, 13.2343]; // Luanda, Angola

    return (
        <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {atms.map((atm) => (
                <Marker 
                    key={atm.id} 
                    position={[atm.location.lat, atm.location.lng]}
                    icon={getIcon(atm.status)}
                >
                    <Popup>
                        <div className="space-y-2">
                             <h3 className="font-bold">{atm.name}</h3>
                             <p className="text-sm">{atm.address}</p>
                             <p className="text-xs capitalize">Status: <span className="font-semibold">{atm.status.replace('_', ' ')}</span></p>
                             <Button asChild size="sm" className="w-full">
                                <Link href={`/dashboard/atm/${atm.id}`}>Ver Detalhes</Link>
                             </Button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
