
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import PublicHome from '@/components/home/PublicHome';

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <PublicHome />;
};

export default Home;
