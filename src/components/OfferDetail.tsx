import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Share2,
  Star,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function OfferDetail() {
  const {
    selectedOffer,
    setCurrentPage,
    currentUser,
    setSelectedOffer,
    fetchOffers
  } = useApp();

  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState<string>('');

  if (!selectedOffer) {
    setCurrentPage('browse-offers');
    return null;
  }

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
      `¡Hola! Vi tu oferta "${selectedOffer.title}" en TruequeAndo y me interesa hacer un intercambio. ¿Podríamos coordinar los detalles?`
    );
    const phoneNumber = selectedOffer.whatsappNumber.replace(/\s+/g, '').replace(/^\+/, '');
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const fetchRatings = async () => {
    const { data } = await supabase
      .from('ratings')
      .select('rating')
      .eq('offer_id', selectedOffer.id);

    if (data) {
      const ratings = data.map(r => r.rating);
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      setAverageRating(avg);
      setRatingCount(ratings.length);
    }

    if (currentUser) {
      const { data: myRating } = await supabase
        .from('ratings')
        .select('rating')
        .eq('offer_id', selectedOffer.id)
        .eq('user_id', currentUser.id)
        .single();

      if (myRating) {
        setUserRating(myRating.rating);
      }
    }
  };

  const fetchAuthorName = async () => {
    const { data } = await supabase
      .from('users')
      .select('name')
      .eq('id', selectedOffer.userId)
      .single();

    if (data?.name) setAuthorName(data.name);
  };

  const submitRating = async (value: number) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('ratings')
      .upsert({
        offer_id: selectedOffer.id,
        user_id: currentUser.id,
        rating: value
      });

    if (!error) {
      setUserRating(value);
      fetchRatings();
    }
  };

  const markAsCompleted = async () => {
    const { error } = await supabase
      .from('offers')
      .update({ is_active: false })
      .eq('id', selectedOffer.id);

    if (!error) {
      alert('✅ Oferta marcada como completada');
      fetchOffers();
      setCurrentPage('dashboard');
    }
  };

  const deleteOffer = async () => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', selectedOffer.id);

    if (!error) {
      alert('🗑️ Oferta eliminada exitosamente');
      fetchOffers();
      setCurrentPage('dashboard');
    }
  };

  useEffect(() => {
    fetchRatings();
    fetchAuthorName();
  }, [selectedOffer?.id, currentUser?.id]);

  const isOwnOffer = currentUser?.id === selectedOffer.userId;

  return (
    <div className="min-h-screen bg-gray-50">
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
          {!selectedOffer.isActive && (
            <div className="bg-red-100 text-red-800 text-center py-3 font-semibold">
              Oferta no disponible
            </div>
          )}

          <div className="aspect-video bg-gray-200">
            {selectedOffer.imageUrl ? (
              <img
                src={selectedOffer.imageUrl}
                alt={selectedOffer.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 text-lg">Sin imagen disponible</div>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${categoryColors[selectedOffer.category]}`}>
                {selectedOffer.category}
              </span>
              <div className="text-right">
                <p className="text-sm text-gray-600">Acepta a cambio:</p>
                <p className="text-orange-600 font-bold text-lg">{selectedOffer.exchangeValue}</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedOffer.title}</h1>

            {!selectedOffer.isActive && (
              <p className="text-sm font-semibold text-red-600 mb-4">Esta oferta ya fue completada</p>
            )}

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

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedOffer.description}
              </p>
            </div>

            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre el oferente</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-600 text-white flex items-center justify-center rounded-full font-semibold text-lg">
                  {authorName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{authorName || 'Usuario sin nombre'}</p>
                  <p className="text-sm text-gray-500">
                    ⭐ {averageRating.toFixed(1)} estrellas • {ratingCount} votos
                  </p>
                </div>
              </div>

              {!isOwnOffer && currentUser && (
                <div className="mt-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => submitRating(star)}
                      className={`h-6 w-6 cursor-pointer ${
                        userRating && star <= userRating ? 'text-yellow-500' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                      fill={userRating && star <= userRating ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {userRating ? `Tu calificación: ${userRating}` : 'Haz clic para calificar'}
                  </span>
                </div>
              )}
            </div>

            {!isOwnOffer && selectedOffer.isActive && (
              <div className="border-t pt-8">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar vía WhatsApp
                </button>
              </div>
            )}

            {isOwnOffer && (
              <div className="border-t pt-8">
                {selectedOffer.isActive ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <h3 className="font-semibold text-blue-900 mb-2">Esta es tu oferta</h3>
                    <p className="text-blue-700 mb-3">
                      Los interesados podrán contactarte directamente por WhatsApp
                    </p>
                    <div className="text-blue-800 font-medium">{selectedOffer.whatsappNumber}</div>
                  </div>
                ) : (
                  <p className="text-red-600 font-semibold text-center">Oferta inactiva</p>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  {selectedOffer.isActive && (
                    <button
                      onClick={() => {
                        setCurrentPage('create-offer');
                        setSelectedOffer(selectedOffer);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                      <Pencil className="h-5 w-5" />
                      Editar Oferta
                    </button>
                  )}

                  {selectedOffer.isActive && (
                    <button
                      onClick={markAsCompleted}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Marcar como Trueque Completado
                    </button>
                  )}

                  <button
                    onClick={deleteOffer}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
                  >
                    <Trash2 className="h-5 w-5" />
                    Eliminar Oferta
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
