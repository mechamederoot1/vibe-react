import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postService, Post } from '../../services/postService';
import { storyService, Story } from '../../services/storyService';
import InstagramPostCard from '../../components/InstagramPostCard';
import InstagramStoriesBar from '../../components/InstagramStoriesBar';
import CreatePostModal from '../../components/CreatePostModal';
import InstagramHeader from '../../components/InstagramHeader';
import BottomNavigation from '../../components/BottomNavigation';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      setLoading(true);
      const [feedPosts, activeStories] = await Promise.all([
        postService.getFeed(),
        storyService.getActiveStories()
      ]);
      setPosts(feedPosts);
      setStories(activeStories);
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async (content: string, postType: string) => {
    try {
      const newPost = await postService.createPost({
        content,
        post_type: postType
      });
      setPosts([newPost, ...posts]);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  };

  const handleNewStory = async (content: string) => {
    try {
      const newStory = await storyService.createStory({ content });
      setStories([newStory, ...stories]);
    } catch (error) {
      console.error('Erro ao criar story:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeedData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-gray-600 text-sm">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col">
      {/* Instagram-style Header */}
      <InstagramHeader onCreatePost={() => setShowCreatePost(true)} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
        {/* Stories Section */}
        <div className="bg-white border-b border-gray-200">
          <InstagramStoriesBar
            stories={stories}
            onNewStory={handleNewStory}
            currentUser={user}
          />
        </div>

        {/* Feed */}
        <div className="pb-16">
          {posts.length === 0 ? (
            <div className="bg-white">
              <div className="text-center py-16 px-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-3">
                  Bem-vindo ao Vibe!
                </h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Quando você começar a seguir pessoas, verá suas fotos e vídeos aqui.
                </p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="ig-button ig-button-primary text-sm px-8 py-2"
                >
                  Compartilhar sua primeira foto
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <InstagramPostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id || 0}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

          {/* Load more posts area */}
          {posts.length > 0 && (
            <div className="bg-white py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Você chegou ao fim!</p>
              <p className="text-gray-400 text-xs mt-1">Siga mais pessoas para ver mais posts.</p>
            </div>
          )}
        </div>

        {/* Pull to refresh indicator */}
        {refreshing && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white rounded-full shadow-lg p-2">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentTab="home" onCreatePost={() => setShowCreatePost(true)} />

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleNewPost}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default HomeScreen;
