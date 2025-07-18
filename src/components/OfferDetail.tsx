import { ArrowLeft, Calendar, DollarSign, MapPin, MessageCircle, Pencil, Phone, Share2, Star, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function OfferDetail() {
  const { selectedOffer, setCurrentPage, users, currentUser } = useApp();

  if (!selectedOffer) {
    setCurrentPage('browse-offers');
    return null;
  }

  const offerAuthor = users.find(user => user.id === selectedOffer.userId);

  const categoryColors = {
    producto: 'bg-blue-100 text-blue-800',
    servicio: 'bg-green-100 text-green-800',
    conocimiento: 'bg-purple-100 text-purple-800'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `¡Hola! Vi tu oferta "${selectedOffer.title}" en Trueque Digital y me interesa hacer un intercambio. ¿Podríamos coordinar los detalles?`
    );
    const phoneNumber = selectedOffer.whatsappNumber.replace(/\s+/g, '').replace(/^\+/, '');
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const isOwnOffer = currentUser?.id === selectedOffer.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => setCurrentPage('browse-offers')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver a Ofertas
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Share2 className="h-5 w-5 mr-2" />
              Compartir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* Image */}
          <div className="aspect-video bg-gray-200">
            {selectedOffer.imageUrl ? (
              <img
                src={selectedOffer.imageUrl}
                alt={selectedOffer.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 text-lg">Sin imagen disponible</div>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Category and Exchange Value */}
            <div className="flex items-start justify-between mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${categoryColors[selectedOffer.category]}`}>
                {selectedOffer.category.charAt(0).toUpperCase() + selectedOffer.category.slice(1)}
              </span>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Acepta a cambio:</div>
                <div className="text-orange-600 font-bold text-lg">
                  {selectedOffer.exchangeValue}
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedOffer.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {selectedOffer.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Publicado el {formatDate(selectedOffer.createdAt)}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {selectedOffer.whatsappNumber}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedOffer.description}
              </p>
            </div>

            {/* Exchange Details */}
            <div className="mb-8 bg-orange-50 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-5 w-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Detalles del Intercambio</h3>
              </div>
              <p className="text-gray-700 text-lg font-medium">
                {selectedOffer.exchangeValue}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Contacta al oferente para coordinar los detalles del intercambio
              </p>
            </div>

            {/* Author Info */}
            {offerAuthor && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre el oferente</h3>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {offerAuthor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{offerAuthor.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {offerAuthor.reputation} estrellas • {offerAuthor.points} puntos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Button for other users */}
            {!isOwnOffer && (
              <div className="border-t pt-8">
                <button 
                  onClick={handleWhatsAppContact}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contactar vía WhatsApp</span>
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Inicia una conversación para coordinar el intercambio
                </p>
              </div>
            )}

            {/* Own Offer Info & Edit Button */}
            {isOwnOffer && (
              <div className="border-t pt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Esta es tu oferta</h3>
                  <p className="text-blue-700 mb-3">
                    Los interesados podrán contactarte directamente a través de WhatsApp
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-blue-800">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{selectedOffer.whatsappNumber}</span>
                  </div>
                </div>

                {/* Botón Editar Oferta */}
                <div className="mt-6 flex justify-center">
                  <button
  onClick={() => {
    // Asegura que la oferta actual se envíe al formulario de edición
   setCurrentPage('create-offer');   //Paso 1: ir a la pantalla de edición
   // setCurrentPage('create');   //Paso 1: ir a la pantalla de edición
    setSelectedOffer(selectedOffer);  //Paso 2: establecer la oferta actual
  }}
  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow flex items-center space-x-2"
>
  <Pencil className="h-5 w-5" />
  <span>Editar Oferta</span>
</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
