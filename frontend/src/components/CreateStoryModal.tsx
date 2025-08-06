import React, { useState } from 'react';
import { User } from '../types/auth';

interface CreateStoryModalProps {
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  currentUser: User | null;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ 
  onClose, 
  onSubmit, 
  currentUser 
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('gradient1');

  const backgrounds = {
    gradient1: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    gradient2: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    gradient3: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
    gradient4: 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500',
    gradient5: 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500',
    solid1: 'bg-black',
    solid2: 'bg-white',
    solid3: 'bg-red-500',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Digite algo para seu story');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(content.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar story');
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 500 - content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-sm h-full max-h-[600px] relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publicando...' : 'Compartilhar'}
            </button>
          </div>
        </div>

        {/* Story Preview */}
        <div className={`w-full h-full rounded-2xl overflow-hidden ${backgrounds[selectedBackground]} relative`}>
          {/* User info */}
          <div className="absolute top-16 left-4 right-4 flex items-center space-x-2 z-10">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-white text-sm font-medium">
              {currentUser?.first_name} {currentUser?.last_name}
            </span>
            <span className="text-white text-xs opacity-75">agora</span>
          </div>

          {/* Content Area */}
          <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2">
            {content ? (
              <div className="text-center">
                <p className="text-white text-xl font-medium leading-relaxed text-center break-words">
                  {content}
                </p>
              </div>
            ) : (
              <div className="text-center text-white opacity-50">
                <p className="text-lg">Toque para adicionar texto</p>
              </div>
            )}
          </div>

          {/* Input overlay (hidden) */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite seu story..."
            maxLength={500}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none focus:outline-none cursor-text"
            style={{ caretColor: 'white' }}
          />
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 space-y-4">
          {error && (
            <div className="bg-red-500 text-white text-center p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Background Colors */}
          <div className="flex justify-center space-x-2">
            {Object.entries(backgrounds).map(([key, className]) => (
              <button
                key={key}
                onClick={() => setSelectedBackground(key)}
                className={`w-8 h-8 rounded-full ${className} ${
                  selectedBackground === key ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                }`}
              />
            ))}
          </div>

          {/* Character count */}
          <div className="text-center">
            <span className="text-white text-xs opacity-75">
              {remainingChars} caracteres restantes
            </span>
          </div>

          {/* Additional tools */}
          <div className="flex justify-center space-x-6">
            <button className="p-3 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button className="p-3 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </button>
            
            <button className="p-3 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M7 4l-2 14h14L17 4M7 4h10m-5 4v8" />
              </svg>
            </button>
          </div>

          {/* Story info */}
          <div className="text-center">
            <p className="text-white text-xs opacity-75">
              ⏰ Seu story ficará visível por 24 horas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
