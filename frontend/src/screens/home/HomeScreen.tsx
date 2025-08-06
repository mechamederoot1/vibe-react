import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import VibeButton from '../../components/VibeButton';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex-none bg-vibe-light px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-vibe-blue-dark">
            Olá, {user?.first_name}!
          </h1>
          <VibeButton onClick={logout} variant="outline" size="small">
            Sair
          </VibeButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-vibe-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-vibe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Feed em desenvolvimento
          </h2>
          <p className="text-gray-600">
            O feed com posts e depoimentos estará disponível em breve!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
