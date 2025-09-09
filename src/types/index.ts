
export type Report = {
  userId: string;
  status: 'com_dinheiro' | 'sem_dinheiro';
  timestamp: string;
  userName?: string; 
  userReputation?: number;
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
  viewCount?: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    phoneNumber: string;
    reputation: number;
};

export type Suggestion = {
    id: string;
    name: string;
    address: string;
    details?: string;
    userId: string;
    userName: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

export type Notification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string; // ISO string
    type: 'suggestion_approved' | 'suggestion_rejected' | 'generic';
};

