
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Atm } from '@/types';
import 'leaflet/dist/leaflet.css';

const createIcon = (color: string, checked: boolean = false) => {
    const checkmark = checked ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check">
            <path d="M20 6 9 17l-5-5"/>
        </svg>
    ` : '';

    return L.divIcon({
        html: `
            <div style="background-color: ${color};" class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                ${checkmark}
            </div>
            <div style="border-top-color: ${color};" class="w-0 h-0 border-t-8 border-l-4 border-r-4 border-l-transparent border-r-transparent absolute left-1/2 -translate-x-1/2 bottom-[-8px]"></div>
        `,
        className: 'bg-transparent border-none',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
    });
};

const greenIcon = createIcon('#22c55e');
const redIcon = createIcon('#ef4444');
const greyIcon = createIcon('#6b7280');

const selectedGreenIcon = createIcon('#16a34a', true);
const selectedRedIcon = createIcon('#dc2626', true);
const selectedGreyIcon = createIcon('#4b5563', true);


const getIcon = (status: Atm['status'], isSelected: boolean) => {
    switch (status) {
        case 'com_dinheiro': return isSelected ? selectedGreenIcon : greenIcon;
        case 'sem_dinheiro': return isSelected ? selectedRedIcon : redIcon;
        case 'desconhecido':
        default: return isSelected ? selectedGreyIcon : greyIcon;
    }
};

interface AtmMapProps {
  atms: Atm[];
  onMarkerClick: (atmId: string) => void;
  selectedAtmId: string | null;
}

export default function AtmMap({ atms, onMarkerClick, selectedAtmId }: AtmMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerLayer = useRef<L.LayerGroup | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                center: [-8.8368, 13.2343],
                zoom: 13,
                zoomControl: false, // Disable default zoom control
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
            
            L.control.zoom({ position: 'topleft' }).addTo(mapInstance.current);

            markerLayer.current = L.layerGroup().addTo(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update markers when atms array changes
    useEffect(() => {
        if (!markerLayer.current) return;
        
        const existingMarkers = markersRef.current;
        const newMarkers = new Map<string, L.Marker>();

        atms.forEach(atm => {
            const isSelected = selectedAtmId === atm.id;
            if (existingMarkers.has(atm.id)) {
                const marker = existingMarkers.get(atm.id)!;
                marker.setLatLng([atm.location.lat, atm.location.lng]);
                marker.setIcon(getIcon(atm.status, isSelected));
                newMarkers.set(atm.id, marker);
                existingMarkers.delete(atm.id);
            } else {
                const marker = L.marker([atm.location.lat, atm.location.lng], { 
                    icon: getIcon(atm.status, isSelected) 
                })
                .on('click', () => onMarkerClick(atm.id));
                markerLayer.current?.addLayer(marker);
                newMarkers.set(atm.id, marker);
            }
        });

        // Remove old markers
        existingMarkers.forEach(marker => marker.remove());
        markersRef.current = newMarkers;

    }, [atms, onMarkerClick, selectedAtmId]);


    // Fly to selected ATM
    useEffect(() => {
        if (selectedAtmId && mapInstance.current) {
            const atm = atms.find(a => a.id === selectedAtmId);
            if (atm) {
                mapInstance.current.flyTo([atm.location.lat, atm.location.lng], 15);
            }
        }
    }, [selectedAtmId, atms]);

    return <div ref={mapRef} className="absolute inset-0 z-0" />;
}
