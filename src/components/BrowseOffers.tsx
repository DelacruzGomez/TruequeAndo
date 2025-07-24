import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Calendar, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Offer } from '../types';

export function BrowseOffers() {
  const { offers, setCurrentPage, setSelectedOffer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory && offer.isActive;
  });

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setCurrentPage('offer-detail');
  };

  const categoryColors = {
    producto: 'bg-blue-100 text-blue-800',
    servicio: 'bg-green-100 text-green-800',
    conocimiento: 'bg-purple-100 text-purple-800'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Explorar Ofertas</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Buscar por título o descripción..."
              />
            </div>
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
              >
                <option value="todas">Todas las categorías</option>
                <option value="producto">Productos</option>
                <option value="servicio">Servicios</option>
                <option value="conocimiento">Conocimientos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold">{filteredOffers.length}</span> ofertas
            {searchTerm && (
              <span> para "<span className="font-semibold">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron ofertas</h3>
            <p className="text-gray-600">Intenta cambiar los filtros o buscar con otros términos</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleOfferClick(offer)}
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
                  {offer.imageUrl ? (
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400">Sin imagen</div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[offer.category]}`}>
                      {offer.category.charAt(0).toUpperCase() + offer.category.slice(1)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {offer.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {offer.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {offer.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(offer.createdAt)}
                    </div>
                  </div>

                  {/* Exchange Value */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Acepta a cambio:</div>
                    <div className="text-orange-600 font-semibold text-sm line-clamp-2">
                      {offer.exchangeValue}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver más
                    </button>
                  </div>

                  {/* Author */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Por <span className="font-medium">{offer.username}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}