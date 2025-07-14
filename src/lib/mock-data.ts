import type { Atm } from '@/types';

export const mockAtms: Atm[] = [
  {
    id: 'atm_id_1',
    name: 'Caixa do BCI - Mutamba',
    location: { lat: -8.8157, lng: 13.2306 },
    address: 'Largo da Mutamba, Luanda, Angola',
    status: 'com_dinheiro',
    lastUpdate: '2025-07-15T09:00:00Z',
    reports: [
      { userId: 'user123', status: 'com_dinheiro', timestamp: '2025-07-15T08:55:00Z' },
      { userId: 'user456', status: 'com_dinheiro', timestamp: '2025-07-15T08:30:00Z' },
      { userId: 'user789', status: 'sem_dinheiro', timestamp: '2025-07-14T18:00:00Z' },
    ],
  },
  {
    id: 'atm_id_2',
    name: 'Caixa do BAI - Aeroporto',
    location: { lat: -8.8583, lng: 13.2792 },
    address: 'Aeroporto 4 de Fevereiro, Luanda, Angola',
    status: 'sem_dinheiro',
    lastUpdate: '2025-07-15T10:15:00Z',
    reports: [
      { userId: 'userABC', status: 'sem_dinheiro', timestamp: '2025-07-15T10:15:00Z' },
      { userId: 'userDEF', status: 'sem_dinheiro', timestamp: '2025-07-15T09:45:00Z' },
    ],
  },
  {
    id: 'atm_id_3',
    name: 'Caixa Atlantico - Belas Shopping',
    location: { lat: -8.9015, lng: 13.2033 },
    address: 'Av. Luanda Sul, Belas, Angola',
    status: 'desconhecido',
    lastUpdate: '2025-07-14T11:00:00Z',
    reports: [
        { userId: 'userXYZ', status: 'com_dinheiro', timestamp: '2025-07-14T10:00:00Z' },
    ],
  },
];
