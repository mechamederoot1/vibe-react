import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postService, Post } from '../../services/postService';
import { storyService, Story } from '../../services/storyService';
import VibeButton from '../../components/VibeButton';
import PostCard from '../../components/PostCard';
import PostComposer from '../../components/PostComposer';
import StoriesBar from '../../components/StoriesBar';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeedData();
    setRefreshing(false);
  };

  const handleNewPost = async (content: string, postType: string) => {
    try {
      const newPost = await postService.createPost({
        content,
        post_type: postType
      });
      setPosts([newPost, ...posts]);
      setShowComposer(false);
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

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-vibe-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vibe-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-vibe-blue-dark font-medium">Carregando feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex-none bg-white px-6 py-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-vibe-blue-dark">
            Feed
          </h1>
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="w-8 h-8 bg-vibe-blue rounded-full flex items-center justify-center"
            >
              <span className="text-sm font-bold text-white">
                {user?.first_name?.charAt(0)}
              </span>
            </Link>
            <VibeButton onClick={logout} variant="outline" size="small">
              Sair
            </VibeButton>
          </div>
        </div>
      </div>

      {/* Stories */}
      {stories.length > 0 && (
        <div className="flex-none bg-white border-b">
          <StoriesBar stories={stories} onNewStory={handleNewStory} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* New Post Button */}
        <div className="bg-white border-b p-4">
          <VibeButton
            onClick={() => setShowComposer(true)}
            className="w-full"
            variant="outline"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            O que você está pensando?
          </VibeButton>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4 p-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-vibe-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-vibe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Nenhum post ainda
              </h2>
              <p className="text-gray-600 mb-4">
                Seja o primeiro a compartilhar algo!
              </p>
              <VibeButton onClick={() => setShowComposer(true)}>
                Criar primeiro post
              </VibeButton>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id || 0}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </div>

        {/* Pull to refresh indicator */}
        {refreshing && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-vibe-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>

      {/* Post Composer Modal */}
      {showComposer && (
        <PostComposer
          onClose={() => setShowComposer(false)}
          onSubmit={handleNewPost}
        />
      )}
    </div>
  );
};

export default HomeScreen;
