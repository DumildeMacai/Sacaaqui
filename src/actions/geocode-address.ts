
'use server';

interface GeocodeResult {
    success: boolean;
    lat?: number;
    lng?: number;
    error?: string;
}

export async function geocodeAddressAction(address: string): Promise<GeocodeResult> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error("Google Maps API key is not configured.");
        return { success: false, error: 'A chave da API do Google Maps não está configurada no servidor.' };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return {
                success: true,
                lat: location.lat,
                lng: location.lng,
            };
        } else {
            console.error('Geocoding API Error:', data.status, data.error_message);
            let errorMessage = `Falha ao geocodificar o endereço. Status: ${data.status}.`;
            if (data.error_message) {
                 errorMessage += ` Detalhes: ${data.error_message}`;
            }
            return { success: false, error: errorMessage };
        }
    } catch (error) {
        console.error('Error fetching from Geocoding API:', error);
        return { success: false, error: 'Ocorreu um erro de rede ao tentar contatar a API de Geocodificação.' };
    }
}
