export type Report = {
  userId: string;
  status: 'com_dinheiro' | 'sem_dinheiro';
  timestamp: string;
  userName?: string; 
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
  details?: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    reputation: number;
};
