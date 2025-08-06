import React, { useState } from 'react';
import { Story } from '../services/storyService';
import { User } from '../types/auth';
import CreateStoryModal from './CreateStoryModal';

interface InstagramStoriesBarProps {
  stories: Story[];
  onNewStory: (content: string) => Promise<void>;
  currentUser: User | null;
}

const InstagramStoriesBar: React.FC<InstagramStoriesBarProps> = ({ 
  stories, 
  onNewStory, 
  currentUser 
}) => {
  const [showCreateStory, setShowCreateStory] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours === 1) return '1h';
    if (diffInHours < 24) return `${diffInHours}h`;
    return '1d';
  };

  const handleCreateStory = async (content: string) => {
    try {
      await onNewStory(content);
      setShowCreateStory(false);
    } catch (error) {
      console.error('Erro ao criar story:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="px-4 py-3">
        <div className="flex space-x-4 overflow-x-auto custom-scrollbar">
          {/* Your Story */}
          <button
            onClick={() => setShowCreateStory(true)}
            className="flex-shrink-0 flex flex-col items-center space-y-1"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt="Seu story"
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
              {/* Plus icon */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-gray-900 font-medium max-w-[64px] truncate">
              Seu story
            </span>
          </button>

          {/* Friends' Stories */}
          {stories.map((story) => (
            <button
              key={story.id}
              className="flex-shrink-0 flex flex-col items-center space-y-1"
            >
              <div className="story-ring rounded-full">
                <div className="w-16 h-16 rounded-full bg-white p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    {story.author_avatar ? (
                      <img
                        src={story.author_avatar}
                        alt={story.author_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {story.author_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-900 font-medium max-w-[64px] truncate">
                {story.author_name.split(' ')[0]}
              </span>
            </button>
          ))}

          {/* Empty state if no stories */}
          {stories.length === 0 && (
            <div className="flex items-center justify-center w-full py-8">
              <p className="text-gray-500 text-sm">Nenhum story ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateStory && (
        <CreateStoryModal
          onClose={() => setShowCreateStory(false)}
          onSubmit={handleCreateStory}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default InstagramStoriesBar;
