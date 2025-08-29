
'use server';

interface GeocodeResult {
    success: boolean;
    lat?: number;
    lng?: number; // Manter 'lng' para consistência interna, apesar da API retornar 'lon'
    error?: string;
}

export async function geocodeAddressAction(address: string): Promise<GeocodeResult> {
    const apiKey = process.env.LOCATIONIQ_API_KEY;

    if (!apiKey) {
        console.error("LocationIQ API key is not configured.");
        return { success: false, error: 'A chave da API do LocationIQ não está configurada no servidor.' };
    }

    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data && data.length > 0) {
            const location = data[0];
            return {
                success: true,
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon), // A API retorna 'lon', mapeamos para 'lng'
            };
        } else {
            const errorMessage = data.error || `Falha ao geocodificar o endereço. Resposta da API: ${response.statusText}`;
            console.error('LocationIQ API Error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    } catch (error) {
        console.error('Error fetching from LocationIQ API:', error);
        return { success: false, error: 'Ocorreu um erro de rede ao tentar contatar a API de Geocodificação.' };
    }
}
