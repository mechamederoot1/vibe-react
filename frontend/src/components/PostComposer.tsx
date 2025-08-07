import React, { useState } from 'react';
import VibeButton from './VibeButton';

interface PostComposerProps {
  onClose: () => void;
  onSubmit: (content: string, postType: string) => Promise<void>;
}

const PostComposer: React.FC<PostComposerProps> = ({ onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Digite algo para postar');
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

  const maxLength = postType === 'testimonial' ? 1000 : 5000;
  const remainingChars = maxLength - content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-lg w-full max-w-md h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-vibe-blue-dark">
            {postType === 'testimonial' ? 'Novo Depoimento' : 'Novo Post'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="flex border-b">
          <button
            onClick={() => setPostType('text')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              postType === 'text'
                ? 'text-vibe-blue-dark border-b-2 border-vibe-blue-dark bg-vibe-light'
                : 'text-gray-600 hover:text-vibe-blue-dark'
            }`}
          >
            📝 Post Normal
          </button>
          <button
            onClick={() => setPostType('testimonial')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              postType === 'testimonial'
                ? 'text-vibe-blue-dark border-b-2 border-vibe-blue-dark bg-vibe-light'
                : 'text-gray-600 hover:text-vibe-blue-dark'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Depoimento</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 p-4">
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
              className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
              maxLength={maxLength}
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                {remainingChars} caracteres restantes
              </span>
            </div>

            {postType === 'testimonial' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Depoimentos são uma forma especial de demonstrar 
                  carinho e reconhecimento por alguém. Seja autêntico e positivo!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex space-x-3">
              <VibeButton
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </VibeButton>
              <VibeButton
                type="submit"
                loading={loading}
                className="flex-1"
                disabled={!content.trim() || loading}
              >
                {loading ? 'Publicando...' : 'Publicar'}
              </VibeButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostComposer;
