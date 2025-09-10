
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Atm } from '@/types';
import 'leaflet/dist/leaflet.css';

const createIcon = (color: string, isSelected: boolean = false) => {
    const scale = isSelected ? 1.5 : 1;
    const shadow = isSelected ? 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))';

    return L.divIcon({
        html: `
            <div style="background-color: ${color}; transform: scale(${scale}); filter: ${shadow};" class="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200">
                <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
        `,
        className: 'bg-transparent border-none',
        iconSize: [24 * scale, 24 * scale],
        iconAnchor: [12 * scale, 12 * scale],
    });
};

const userIcon = L.divIcon({
    html: `
        <div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
    `,
    className: 'bg-transparent border-none',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

const greenIcon = createIcon('#10B981'); // green-500
const redIcon = createIcon('#EF4444'); // red-500
const greyIcon = createIcon('#6B7280'); // gray-500

const selectedGreenIcon = createIcon('#10B981', true);
const selectedRedIcon = createIcon('#EF4444', true);
const selectedGreyIcon = createIcon('#6B7280', true);


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
  userLocation: {lat: number, lng: number} | null;
}

export default function AtmMap({ atms, onMarkerClick, selectedAtmId, userLocation }: AtmMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerLayer = useRef<L.LayerGroup | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);
    const markersRef = useRef<Map<string, L.Marker>>(new Map());

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                center: [-8.8368, 13.2343],
                zoom: 13,
                zoomControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
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

    useEffect(() => {
        if (!markerLayer.current || !mapInstance.current) return;
        
        const existingMarkers = markersRef.current;
        const newMarkers = new Map<string, L.Marker>();

        atms.forEach(atm => {
            const isSelected = selectedAtmId === atm.id;
            if (existingMarkers.has(atm.id)) {
                const marker = existingMarkers.get(atm.id)!;
                marker.setLatLng([atm.location.lat, atm.location.lng]);
                marker.setIcon(getIcon(atm.status, isSelected));
                if (isSelected) {
                    marker.setZIndexOffset(1000);
                } else {
                    marker.setZIndexOffset(0);
                }
                newMarkers.set(atm.id, marker);
                existingMarkers.delete(atm.id);
            } else {
                const marker = L.marker([atm.location.lat, atm.location.lng], { 
                    icon: getIcon(atm.status, isSelected),
                    zIndexOffset: isSelected ? 1000 : 0
                })
                .on('click', () => onMarkerClick(atm.id));
                markerLayer.current?.addLayer(marker);
                newMarkers.set(atm.id, marker);
            }
        });

        existingMarkers.forEach(marker => marker.remove());
        markersRef.current = newMarkers;

    }, [atms, onMarkerClick, selectedAtmId]);


    useEffect(() => {
        if (selectedAtmId && mapInstance.current) {
            const atm = atms.find(a => a.id === selectedAtmId);
            if (atm) {
                mapInstance.current.flyTo([atm.location.lat, atm.location.lng], 15);
            }
        }
    }, [selectedAtmId, atms]);

     useEffect(() => {
        if (userLocation && mapInstance.current) {
            const userLatLng = L.latLng(userLocation.lat, userLocation.lng);
            if (userMarkerRef.current) {
                userMarkerRef.current.setLatLng(userLatLng);
            } else {
                userMarkerRef.current = L.marker(userLatLng, {
                    icon: userIcon,
                    zIndexOffset: 2000 // Ensure user marker is always on top
                }).addTo(mapInstance.current);
            }
            mapInstance.current.flyTo(userLatLng, 14);
        }
    }, [userLocation]);

    return <div ref={mapRef} className="h-full w-full rounded-2xl" />;
}
