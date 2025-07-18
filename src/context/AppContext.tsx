import { createContext, ReactNode, useContext, useState } from 'react';
import { AppContextType, Offer, User } from '../types';


const AppContext = createContext<AppContextType | undefined>(undefined);
//Datos de Pruebas iniciales
const mockUsers: User[] = [
  {
    id: '1',
    name: 'José A. Quispe',
    email: 'jose@gmail.com',
    password: 'admin123',
    points: 150,
    reputation: 4.8,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Tais Oscorima',
    email: 'tais@gmail.com',
    password: '123456',
    points: 200,
    reputation: 4.5,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Luis A. De La Cruz',
    email: 'luisdgjun55@gmail.com',
    password: 'admin123',
    points: 150,
    reputation: 4.8,
    createdAt: '2024-01-15'
  }
];

const mockOffers: Offer[] = [
  {
    id: '1',
    userId: '1',
    userName: 'José A. Quispe',
    title: 'Clases de Quechua para Principiantes',
    category: 'conocimiento',
    description: 'Enseño el idioma quechua desde nivel básico. Incluye conversación, gramática y cultura andina.',
    location: 'Centro de Ayacucho',
    imageUrl: 'https://educaperu.org/wp-content/uploads/2022/09/QUECHUA-WEB.jpg',
    whatsappNumber: '+51 915 238 259',
    exchangeValue: 'S/. 40 por sesión o intercambio por clases de computación',
    createdAt: '2024-01-20',
    isActive: true
  },
  {
    id: '2',
    userId: '2',
    userName: 'Tais Oscorima',
    title: 'Tejidos Artesanales de Ayacucho',
    category: 'producto',
    description: 'Hermosos tejidos hechos a mano con lana de oveja y alpaca 100% natural. Incluye chompas, bufandas y gorros.',
    location: 'San Juan Bautista',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/10/28/23/31/fabrics-4585895_1280.jpg',
    whatsappNumber: '+51 977 117 936',
    exchangeValue: 'Entre S/. 80-120 según el producto',
    createdAt: '2024-01-18',
    isActive: true
  },
  {
    id: '3',
    userId: '3',
    userName: 'Luis A. De La Cruz',
    title: 'Reparación de Computadoras',
    category: 'servicio',
    description: 'Servicio técnico especializado en reparación de laptops y computadoras de escritorio. Diagnóstico gratuito.',
    location: 'Huamanga',
    imageUrl: 'https://media-lim1-1.cdn.whatsapp.net/v/t61.24694-24/404848781_390677396642394_3032769372981746677_n.jpg?ccb=11-4&oh=01_Q5Aa1wFoy1-6MTPY1je8gm1GIqp_LiAdVHPTwWg8G1TgUIWfdQ&oe=685950E2&_nc_sid=5e03e0&_nc_cat=109',
    whatsappNumber: '+51 930 401 372',
    exchangeValue: 'S/. 60 o intercambio por productos electrónicos',
    createdAt: '2024-01-16',
    isActive: true
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      points: 100,
      reputation: 5.0,
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('dashboard');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const addOffer = (offerData: Omit<Offer, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
    if (!currentUser) return;
    const newOffer: Offer = {
      ...offerData,
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setOffers([newOffer, ...offers]);
    setCurrentPage('dashboard');
  };

  const updateOffer = (updatedOffer: Offer) => {
    setOffers(prevOffers =>
      prevOffers.map(o => (o.id === updatedOffer.id ? { ...updatedOffer } : o))
    );
    setSelectedOffer(null);
   // setCurrentPage('dashboard');
    setCurrentPage('browse-offers');
  };

  const value: AppContextType = {
    currentUser,
    users,
    offers,
    login,
    signup,
    logout,
    addOffer,
    updateOffer,
    currentPage,
    setCurrentPage,
    selectedOffer,
    setSelectedOffer
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
