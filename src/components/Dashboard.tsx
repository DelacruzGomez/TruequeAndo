import { Coins, LogOut, MapPin, Plus, Search, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';

import { getAverageRatingByUserId } from '../utils/ratingUtils';


export function Dashboard() {
  const { currentUser, logout, setCurrentPage, offers, getAverageRatingByUserId } = useApp();
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (currentUser) {
        const avg = await getAverageRatingByUserId(currentUser.id);
        setUserRating(avg);
      }
    };
    fetchUserRating();
  }, [currentUser]);

  if (!currentUser) return null;

  const userOffers = offers.filter(offer => offer.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">TruequeAndo</h1>
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                ¡Hola, {currentUser.name}!
              </h2>
              <p className="text-orange-100 text-lg">
                Bienvenido de vuelta a tu espacio de intercambio
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="h-5 w-5" />
                <span className="font-semibold">Puntos Trueque</span>
              </div>
              <div className="text-3xl font-bold">{currentUser.points}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userOffers.length}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Mis Ofertas</h3>
            <p className="text-gray-600 text-sm">Publicaciones activas</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{userRating.toFixed(1)}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Reputación</h3>
            <p className="text-gray-600 text-sm">Calificación promedio</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">3</span>
            </div>
            <h3 className="font-semibold text-gray-900">Intercambios</h3>
            <p className="text-gray-600 text-sm">Completados este mes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setCurrentPage('create-offer')}
            className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-md transition-all transform hover:scale-[1.02] text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-4 rounded-xl group-hover:bg-orange-200 transition-colors">
                <Plus className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Publicar Oferta</h3>
                <p className="text-gray-600">
                  Comparte un producto, servicio o conocimiento con la comunidad
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('browse-offers')}
            className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-md transition-all transform hover:scale-[1.02] text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Buscar Trueque</h3>
                <p className="text-gray-600">
                  Explora ofertas disponibles en tu comunidad
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
