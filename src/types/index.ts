export type Report = {
  userId: string;
  status: 'com_dinheiro' | 'sem_dinheiro';
  timestamp: string;
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
