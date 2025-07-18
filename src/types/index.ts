export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  points: number;
  reputation: number;
  createdAt: string;
}

export interface Offer {
  id: string;
  userId: string;
  userName: string;
  title: string;
  category: 'producto' | 'servicio' | 'conocimiento';
  description: string;
  location: string;
  imageUrl: string;
  exchangeValue: string;
  whatsappNumber: string;
  createdAt: string;
  isActive: boolean;
}

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  offers: Offer[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addOffer: (offer: Omit<Offer, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer | null) => void;
}
export interface AppContextType {
  currentUser: User | null;
  users: User[];
  offers: Offer[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addOffer: (offer: Omit<Offer, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
  updateOffer: (offer: Offer) => void; // 👈 Agregado
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer | null) => void;
}
