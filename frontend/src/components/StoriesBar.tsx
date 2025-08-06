import React, { useState } from 'react';
import { Story } from '../services/storyService';

interface StoriesBarProps {
  stories: Story[];
  onNewStory: (content: string) => Promise<void>;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ stories, onNewStory }) => {
  const [showStoryComposer, setShowStoryComposer] = useState(false);
  const [storyContent, setStoryContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyContent.trim()) return;

    setLoading(true);
    try {
      await onNewStory(storyContent.trim());
      setStoryContent('');
      setShowStoryComposer(false);
    } catch (error) {
      console.error('Erro ao criar story:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours === 1) return '1h';
    return `${diffInHours}h`;
  };

  return (
    <div className="p-4">
      <div className="flex space-x-3 overflow-x-auto">
        {/* Add Story Button */}
        <button
          onClick={() => setShowStoryComposer(true)}
          className="flex-shrink-0 flex flex-col items-center space-y-2"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-vibe-blue to-vibe-blue-dark rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Seu story</span>
        </button>

        {/* Stories */}
        {stories.map((story) => (
          <button
            key={story.id}
            className="flex-shrink-0 flex flex-col items-center space-y-2"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  {story.author_avatar ? (
                    <img
                      src={story.author_avatar}
                      alt={story.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-vibe-blue-dark font-bold">
                      {story.author_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-700 font-medium block truncate max-w-[60px]">
                {story.author_name.split(' ')[0]}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(story.created_at)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Story Composer Modal */}
      {showStoryComposer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-vibe-blue-dark">Novo Story</h3>
              <button
                onClick={() => setShowStoryComposer(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="p-4">
              <textarea
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Compartilhe um momento..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center mt-2 mb-4">
                <span className="text-sm text-gray-500">
                  {500 - storyContent.length} caracteres restantes
                </span>
                <span className="text-xs text-gray-400">
                  ⏰ Expira em 24h
                </span>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStoryComposer(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!storyContent.trim() || loading}
                  className="flex-1 py-2 px-4 bg-vibe-blue-dark text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesBar;
