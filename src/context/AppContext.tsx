import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { CreateOffer } from './components/CreateOffer';
import { BrowseOffers } from './components/BrowseOffers';
import { OfferDetail } from './components/OfferDetail';

function AppRouter() {
  const { currentPage, currentUser } = useApp();

  // Si el usuario no está logueado, redirige solo a login/signup/landing
  if (!currentUser) {
    switch (currentPage) {
      case 'signup':
        return <AuthForm mode="signup" />;
      case 'login':
        return <AuthForm mode="login" />;
      default:
        return <LandingPage />;
    }
  }

  // Si está logueado, puede acceder al resto
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard />;
    case 'create-offer':
      return <CreateOffer />;
    case 'browse-offers':
      return <BrowseOffers />;
    case 'offer-detail':
      return <OfferDetail />;
    default:
      return <Dashboard />; // Redirige a dashboard si ya está logueado
  }
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
