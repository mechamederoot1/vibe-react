import React, { useState } from 'react';
import { User } from '../types/auth';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (content: string, postType: string) => Promise<void>;
  currentUser: User | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  onClose, 
  onSubmit, 
  currentUser 
}) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Digite algo para compartilhar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(content.trim(), postType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const maxLength = postType === 'testimonial' ? 1000 : 2200;
  const remainingChars = maxLength - content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col modern-shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            Nova publicação
          </h2>
          
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="ig-button ig-button-primary text-sm px-4 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publicando...' : 'Compartilhar'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* User info */}
          <div className="flex items-center space-x-3 p-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {currentUser?.first_name} {currentUser?.last_name}
              </p>
            </div>
          </div>

          {/* Post type selector */}
          <div className="px-4 mb-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPostType('text')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  postType === 'text'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Post
              </button>
              <button
                onClick={() => setPostType('testimonial')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  postType === 'testimonial'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                💝 Depoimento
              </button>
            </div>
          </div>

          {/* Text area */}
          <div className="px-4 pb-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === 'testimonial'
                  ? 'Escreva um depoimento especial para alguém...'
                  : 'O que você está pensando?'
              }
              className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              maxLength={maxLength}
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                {remainingChars} caracteres restantes
              </span>
            </div>

            {postType === 'testimonial' && (
              <div className="mt-4 p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">💝</span>
                  <span className="text-sm font-medium text-pink-800">Depoimento</span>
                </div>
                <p className="text-sm text-pink-700">
                  Depoimentos são uma forma especial de demonstrar carinho e reconhecimento. 
                  Seja autêntico e positivo!
                </p>
              </div>
            )}
          </div>

          {/* Additional options */}
          <div className="px-4 pb-4 space-y-3">
            <button className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Adicionar foto/vídeo</span>
              </div>
              <span className="text-xs text-gray-400">Em breve</span>
            </button>

            <button className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Adicionar localização</span>
              </div>
              <span className="text-xs text-gray-400">Em breve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
