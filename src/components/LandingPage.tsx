import { ArrowRight, Handshake, Leaf, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LandingPage() {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Handshake className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">TruequeAndo</span>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-orange-600">Trueque</span>Ando
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Intercambia productos, servicios y habilidades en tu comunidad sin usar dinero
            </p>
            <button
              onClick={() => setCurrentPage('signup')}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <span>Empieza a Truequear</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una plataforma simple y segura para intercambiar lo que tienes por lo que necesitas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Únete a la Comunidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Regístrate y forma parte de una red de intercambio local en Ayacucho
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Publica e Intercambia</h3>
              <p className="text-gray-600 leading-relaxed">
                Ofrece productos, servicios o conocimientos y encuentra lo que necesitas
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Economía Sostenible</h3>
              <p className="text-gray-600 leading-relaxed">
                Contribuye a una economía circular y sostenible en tu comunidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Únete a cientos de personas que ya están intercambiando en Ayacucho
          </p>
          <button
            onClick={() => setCurrentPage('signup')}
            className="bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Crear Cuenta Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Handshake className="h-6 w-6 text-orange-400" />
            <span className="text-xl font-bold">TruequeAndo</span>
          </div>
          <p className="text-gray-400">
            Fortaleciendo la economía local de Ayacucho a través del intercambio
          </p>
        </div>
      </footer>
    </div>
  );
}