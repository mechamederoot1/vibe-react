import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService, UserProfile } from '../../services/userService';
import { postService, Post, Testimonial } from '../../services/postService';
import VibeButton from '../../components/VibeButton';
import PostCard from '../../components/PostCard';
import TestimonialCard from '../../components/TestimonialCard';
import TestimonialComposer from '../../components/TestimonialComposer';

const ProfileScreen: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'testimonials'>('posts');
  const [showTestimonialComposer, setShowTestimonialComposer] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const profileUserId = userId ? parseInt(userId) : currentUser?.id || 0;
  const isOwnProfile = profileUserId === currentUser?.id;

  useEffect(() => {
    loadProfile();
  }, [profileUserId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileData, userPosts, userTestimonials] = await Promise.all([
        isOwnProfile
          ? userService.getMyProfile()
          : userService.getUserProfile(profileUserId),
        postService.getUserPosts(profileUserId),
        postService.getUserTestimonials(profileUserId)
      ]);

      setProfile(profileData);
      setPosts(userPosts);
      setTestimonials(userTestimonials);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
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

  const handleNewTestimonial = async (content: string, styling: any) => {
    try {
      const testimonial = await postService.createTestimonial({
        content,
        target_user_id: profileUserId,
        ...styling
      });
      setTestimonials([testimonial, ...testimonials]);
      setShowTestimonialComposer(false);
    } catch (error) {
      console.error('Erro ao criar depoimento:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-vibe-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vibe-blue border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-vibe-blue-dark font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Usuário não encontrado</h2>
          <Link to="/" className="text-vibe-blue-dark hover:underline">
            Voltar ao feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex-none bg-white px-6 py-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-vibe-blue-dark">
              {isOwnProfile ? 'Meu Perfil' : 'Perfil'}
            </h1>
          </div>

          {isOwnProfile && (
            <VibeButton onClick={() => setShowEditProfile(true)} variant="outline" size="small">
              Editar
            </VibeButton>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-vibe-light to-vibe-blue relative">
          {profile.cover_photo_url && (
            <img
              src={profile.cover_photo_url}
              alt="Foto de capa"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white px-6 pb-6 -mt-16 relative">
          {/* Avatar */}
          <div className="flex items-end space-x-4">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-vibe-blue rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 pt-16">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    {profile.first_name} {profile.last_name}
                    {profile.is_verified && (
                      <svg className="w-6 h-6 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-gray-700 mt-2">{profile.bio}</p>
                  )}
                </div>

                {!isOwnProfile && (
                  <VibeButton
                    onClick={() => setShowTestimonialComposer(true)}
                    size="small"
                  >
                    💝 Depoimento
                  </VibeButton>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-vibe-blue-dark">{profile.posts_count}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-vibe-blue-dark">{profile.testimonials_count}</div>
                  <div className="text-sm text-gray-600">Depoimentos</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-vibe-blue-dark border-b-2 border-vibe-blue-dark bg-vibe-light'
                  : 'text-gray-600 hover:text-vibe-blue-dark'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Posts ({posts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'testimonials'
                  ? 'text-vibe-blue-dark border-b-2 border-vibe-blue-dark bg-vibe-light'
                  : 'text-gray-600 hover:text-vibe-blue-dark'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Depoimentos ({testimonials.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'posts' ? (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-vibe-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-vibe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isOwnProfile ? 'Você ainda não fez nenhum post' : 'Nenhum post ainda'}
                  </h3>
                  <p className="text-gray-600">
                    {isOwnProfile ? 'Compartilhe seus pensamentos com o mundo!' : 'Ainda não há posts para mostrar.'}
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUser?.id || 0}
                    onDelete={handleDeletePost}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-vibe-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-vibe-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isOwnProfile ? 'Você ainda não recebeu depoimentos' : 'Nenhum depoimento ainda'}
                  </h3>
                  <p className="text-gray-600">
                    {isOwnProfile
                      ? 'Depoimentos de amigos aparecerão aqui!'
                      : 'Seja o primeiro a deixar um depoimento especial!'
                    }
                  </p>
                  {!isOwnProfile && (
                    <VibeButton
                      onClick={() => setShowTestimonialComposer(true)}
                      className="mt-4"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Deixar depoimento</span>
                      </div>
                    </VibeButton>
                  )}
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Testimonial Composer Modal */}
      {showTestimonialComposer && (
        <TestimonialComposer
          targetUser={profile}
          onClose={() => setShowTestimonialComposer(false)}
          onSubmit={handleNewTestimonial}
        />
      )}
    </div>
  );
};

export default ProfileScreen;
