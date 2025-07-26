import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Offer, User } from '../types';

interface AppContextType {
  currentUser: User | null;
  offers: Offer[];
  selectedOffer: Offer | null;
  currentPage: string;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchOffers: () => void;
  addOffer: (offer: Omit<Offer, 'id' | 'userId' | 'username' | 'createdAt'>) => void;
  updateOffer: (offer: Offer) => void;
  getAverageRating: (offerId: string) => Promise<number>;
  setSelectedOffer: (offer: Offer | null) => void;
  setCurrentPage: (page: string) => void;
  isSubmitting: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchUser();
    fetchOffers();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (user && user.id) {
      const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !userError) {
        setCurrentUser(data);
      }
    }
  };

  const fetchOffers = async () => {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        id, user_id, title, description, category, location, image_url, whatsapp, exchange_value, created_at, is_active,
        users ( name )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error al obtener ofertas:', error.message);
      return;
    }

    if (data) {
      setOffers(
        data.map((o: any) => ({
          id: o.id,
          userId: o.user_id,
          username: o.users?.name || 'Sin nombre',
          title: o.title,
          description: o.description,
          category: o.category,
          location: o.location,
          imageUrl: o.image_url,
          whatsappNumber: o.whatsapp,
          exchangeValue: o.exchange_value,
          createdAt: o.created_at,
          isActive: o.is_active ?? true
        }))
      );
    }
  };

  const getAverageRating = async (offerId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('offer_id', offerId);

    if (error || !data) return 0;

    const ratings = data.map(r => r.rating);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return avg;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        alert('Correo y contraseña requeridos.');
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Error en login:', error.message);
        alert('Credenciales inválidas o usuario no registrado.');
        return false;
      }

      if (data.user) {
        setCurrentUser({
          id: data.user.id,
          name: '',
          email: data.user.email!,
          password: '',
          points: 0,
          reputation: 0,
          createdAt: new Date().toISOString()
        });
        await fetchUser();
        await fetchOffers();
        return true;
      }

      return false;
    } catch (err) {
      console.error('⚠️ Error inesperado en login:', err);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!email || !password || !name) {
      alert('Todos los campos son requeridos.');
      return false;
    }

    if (isSubmitting) {
      console.warn('⏳ Registro ya en curso, espera...');
      return false;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('❌ Error en signup:', error.message);
        alert(`Error al registrar: ${error.message}`);
        return false;
      }

      if (data.user) {
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          name,
          email
        });

        if (insertError) {
          console.error('❌ Error insertando en tabla users:', insertError.message);
          alert('No se pudo guardar datos del usuario en la base.');
          return false;
        }

        await fetchUser();
        await fetchOffers();
        return true;
      }

      return false;
    } catch (err) {
      console.error('⚠️ Error inesperado en signup:', err);
      alert('Error inesperado durante el registro.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setOffers([]);
    setSelectedOffer(null);
    setCurrentPage('login');
  };

  const addOffer = async (
    offerData: Omit<Offer, 'id' | 'userId' | 'username' | 'createdAt'>
  ) => {
    if (!currentUser) {
      console.warn('❌ No hay usuario autenticado');
      return;
    }

    const { data, error } = await supabase.from('offers').insert([{
      user_id: currentUser.id,
      title: offerData.title,
      description: offerData.description,
      category: offerData.category,
      location: offerData.location,
      image_url: offerData.imageUrl,
      whatsapp: offerData.whatsappNumber,
      exchange_value: offerData.exchangeValue,
      created_at: new Date().toISOString(),
      is_active: true
    }]).select();

    if (error) {
      console.error('❌ Error al insertar la oferta:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.error('❌ Supabase insertó pero no devolvió datos.');
      return;
    }

    const o = data[0];
    const newOffer: Offer = {
      id: o.id,
      userId: o.user_id,
      username: currentUser.name,
      title: o.title,
      description: o.description,
      category: o.category,
      location: o.location,
      imageUrl: o.image_url,
      whatsappNumber: o.whatsapp,
      exchangeValue: o.exchange_value,
      createdAt: o.created_at,
      isActive: o.is_active ?? true
    };

    setOffers(prev => [newOffer, ...prev]);
    setSelectedOffer(newOffer);
    setCurrentPage('offer-detail');
    console.log('✅ Oferta insertada correctamente');
  };

  const updateOffer = async (offer: Offer) => {
    console.log('✏️ Actualizando oferta con ID:', offer.id);

    const { data, error } = await supabase
      .from('offers')
      .update({
        title: offer.title,
        description: offer.description,
        category: offer.category,
        location: offer.location,
        image_url: offer.imageUrl,
        whatsapp: offer.whatsappNumber,
        exchange_value: offer.exchangeValue,
        is_active: offer.isActive
      })
      .eq('id', offer.id)
      .eq('user_id', offer.userId)
      .select();

    if (error) {
      console.error('❌ Error al actualizar la oferta:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Supabase actualizó pero no devolvió datos');
      return;
    }

    const updated = data[0];
    const updatedOffer: Offer = {
      id: updated.id,
      userId: updated.user_id,
      username: offer.username,
      title: updated.title,
      description: updated.description,
      category: updated.category,
      location: updated.location,
      imageUrl: updated.image_url,
      whatsappNumber: updated.whatsapp,
      exchangeValue: updated.exchange_value,
      createdAt: updated.created_at,
      isActive: updated.is_active ?? true
    };

    setOffers(prev => prev.map(o => (o.id === updatedOffer.id ? updatedOffer : o)));
    setSelectedOffer(updatedOffer);
    setCurrentPage('offer-detail');
    console.log('✅ Oferta actualizada');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        offers,
        selectedOffer,
        currentPage,
        login,
        signup,
        logout,
        fetchOffers,
        addOffer,
        updateOffer,
        getAverageRating,
        setSelectedOffer,
        setCurrentPage,
        isSubmitting
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};
