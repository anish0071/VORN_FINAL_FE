
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { SignIn } from './pages/SignIn';
import { ComplianceProvider } from './lib/ComplianceContext';
import { CardSwipeTransition } from './components/CardSwipeTransition';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/auth/signin');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      // Trigger the Card Swipe
      setIsTransitioning(true);
      
      // Delay the actual route swap until the card is at the center (0.5s into 1s animation)
      setTimeout(() => {
        setCurrentHash(window.location.hash || '#/');
      }, 500);

      // Reset transition state after full animation completion
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && currentHash !== '#/auth/signin') {
      window.location.hash = '#/auth/signin';
    } else if (isAuthenticated && currentHash === '#/auth/signin') {
      window.location.hash = '#/';
    }
  }, [isAuthenticated, currentHash]);

  const handleLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      window.location.hash = '#/';
    }, 500);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const handleLogout = () => { 
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(false); 
      window.location.hash = '#/auth/signin'; 
    }, 500);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const renderPage = () => {
    if (currentHash === '#/auth/signin') return <SignIn onLogin={handleLogin} />;
    if (!isAuthenticated) return null;
    if (currentHash.startsWith('#/results/')) {
      const fileId = currentHash.split('#/results/')[1];
      return <Results fileId={fileId} />;
    }
    return <Home />;
  };

  return (
    <ComplianceProvider>
      <div className="min-h-screen bg-white text-visa-blue overflow-x-hidden relative">
        <CardSwipeTransition isTriggered={isTransitioning} />
        
        {isAuthenticated && currentHash !== '#/auth/signin' && (
          <div className={isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
            <Header onLogout={handleLogout} />
          </div>
        )}

        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          {renderPage()}
        </div>
      </div>
    </ComplianceProvider>
  );
};

export default App;
