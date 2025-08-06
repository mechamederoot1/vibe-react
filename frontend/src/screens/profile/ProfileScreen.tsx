import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex-none bg-vibe-light px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-vibe-blue-dark">
          Perfil
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-vibe-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {user?.first_name} {user?.last_name}
          </h2>
          <p className="text-gray-600 mb-4">
            {user?.email}
          </p>
          <p className="text-sm text-gray-500">
            Membro desde {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Página de perfil em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
