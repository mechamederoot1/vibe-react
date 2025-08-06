import React, { useState, useMemo } from 'react';
import { Story } from '../services/storyService';
import { User } from '../types/auth';
import EnhancedCreateStoryModal from './EnhancedCreateStoryModal';
import StoryViewer from './StoryViewer';

interface GroupedVibeStoriesBarProps {
  stories: Story[];
  onNewStory: (content: string, mediaFile?: File, background?: string) => Promise<void>;
  currentUser: User | null;
}

interface GroupedStory {
  userId: number;
  userName: string;
  userAvatar?: string;
  stories: Story[];
  latestStory: Story;
  hasUnread: boolean;
}

const GroupedVibeStoriesBar: React.FC<GroupedVibeStoriesBarProps> = ({ 
  stories, 
  onNewStory, 
  currentUser 
}) => {
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<GroupedStory | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [viewerStories, setViewerStories] = useState<Story[]>([]);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);

  // Group stories by user
  const groupedStories = useMemo(() => {
    const groups: { [key: number]: GroupedStory } = {};
    
    stories.forEach(story => {
      if (!groups[story.author_id]) {
        groups[story.author_id] = {
          userId: story.author_id,
          userName: story.author_name,
          userAvatar: story.author_avatar,
          stories: [],
          latestStory: story,
          hasUnread: true // For now, assume all are unread
        };
      }
      
      groups[story.author_id].stories.push(story);
      
      // Update latest story if this one is newer
      if (new Date(story.created_at) > new Date(groups[story.author_id].latestStory.created_at)) {
        groups[story.author_id].latestStory = story;
      }
    });

    // Sort by latest story time
    return Object.values(groups).sort((a, b) => 
      new Date(b.latestStory.created_at).getTime() - new Date(a.latestStory.created_at).getTime()
    );
  }, [stories]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours === 1) return '1h';
    if (diffInHours < 24) return `${diffInHours}h`;
    return '1d';
  };

  const handleCreateStory = async (content: string, mediaFile?: File, background?: string) => {
    try {
      await onNewStory(content, mediaFile, background);
      setShowCreateStory(false);
    } catch (error) {
      console.error('Erro ao criar story:', error);
      throw error;
    }
  };

  const handleStoryGroupClick = (group: GroupedStory) => {
    setViewerStories(group.stories);
    setInitialStoryIndex(0);
    setShowStoryViewer(true);

    // Mark stories as read (optional)
    groupedStories.forEach(g => {
      if (g.userId === group.userId) {
        g.hasUnread = false;
      }
    });
  };

  return (
    <>
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex space-x-4 overflow-x-auto custom-scrollbar">
          {/* Your Story */}
          <button
            onClick={() => setShowCreateStory(true)}
            className="flex-shrink-0 flex flex-col items-center space-y-1 group"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-blue-200 overflow-hidden bg-blue-50 group-hover:border-blue-400 transition-colors">
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt="Seu story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {/* Plus icon */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white group-hover:bg-blue-600 transition-colors">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium max-w-[64px] truncate">
              Seu story
            </span>
          </button>

          {/* Grouped Stories */}
          {groupedStories.map((group) => (
            <button
              key={group.userId}
              onClick={() => handleStoryGroupClick(group)}
              className="flex-shrink-0 flex flex-col items-center space-y-1 group"
            >
              <div className="relative">
                {/* Story ring with gradient for unread */}
                <div className={`rounded-full p-0.5 ${
                  group.hasUnread 
                    ? 'bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600' 
                    : 'border-2 border-gray-300'
                }`}>
                  <div className="w-16 h-16 rounded-full bg-white p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                      {group.userAvatar ? (
                        <img
                          src={group.userAvatar}
                          alt={group.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {group.userName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Story count indicator */}
                {group.stories.length > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-xs font-bold">
                      {group.stories.length}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <span className="text-xs text-gray-900 font-medium max-w-[64px] truncate block">
                  {group.userName.split(' ')[0]}
                </span>
                <span className="text-xs text-gray-500 max-w-[64px] truncate block">
                  {formatTimeAgo(group.latestStory.created_at)}
                </span>
              </div>
            </button>
          ))}

          {/* Empty state if no stories */}
          {groupedStories.length === 0 && (
            <div className="flex items-center justify-center w-full py-8">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <p className="text-gray-400 text-sm">Nenhum story ainda</p>
                <p className="text-gray-400 text-xs">Seja o primeiro a compartilhar!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Create Story Modal */}
      {showCreateStory && (
        <EnhancedCreateStoryModal
          onClose={() => setShowCreateStory(false)}
          onSubmit={handleCreateStory}
          currentUser={currentUser}
        />
      )}

      {/* Story Viewer */}
      {showStoryViewer && (
        <StoryViewer
          stories={viewerStories}
          initialStoryIndex={initialStoryIndex}
          onClose={() => setShowStoryViewer(false)}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default GroupedVibeStoriesBar;
