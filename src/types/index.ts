export type Report = {
  userId: string;
  status: 'com_dinheiro' | 'sem_dinheiro';
  timestamp: string;
  userName?: string; // Adicionado para consistência
};

export type Atm = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  status: 'com_dinheiro' | 'sem_dinheiro' | 'desconhecido';
  lastUpdate: string;
  reports: Report[];
};
