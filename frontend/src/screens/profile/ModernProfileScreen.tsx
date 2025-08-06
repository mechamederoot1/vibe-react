import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService, UserProfile } from '../../services/userService';
import { postService, Post, Testimonial } from '../../services/postService';
import BottomNavigation from '../../components/BottomNavigation';
import CreatePostModal from '../../components/CreatePostModal';
import TestimonialComposer from '../../components/TestimonialComposer';
import ProfilePhotoEditor from '../../components/ProfilePhotoEditor';

const ModernProfileScreen: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grid' | 'testimonials'>('grid');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showTestimonialComposer, setShowTestimonialComposer] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);

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

  const handleSaveAvatar = async (croppedImage: string) => {
    try {
      // TODO: Implement API call to save avatar
      console.log('Saving avatar:', croppedImage);

      // For now, just update the profile locally
      if (profile) {
        setProfile({ ...profile, avatar_url: croppedImage });
      }

      setShowAvatarEditor(false);
    } catch (error) {
      console.error('Erro ao salvar avatar:', error);
      throw error;
    }
  };

  const handleSaveCover = async (croppedImage: string) => {
    try {
      // TODO: Implement API call to save cover photo
      console.log('Saving cover photo:', croppedImage);

      // For now, just update the profile locally
      if (profile) {
        setProfile({ ...profile, cover_photo_url: croppedImage });
      }

      setShowCoverEditor(false);
    } catch (error) {
      console.error('Erro ao salvar capa:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-gray-600 text-sm">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mobile-container">
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Usuário não encontrado</h2>
            <Link to="/" className="text-blue-500 hover:underline">
              Voltar ao feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">
            {profile.first_name.toLowerCase()}{profile.last_name.toLowerCase()}
          </h1>
          {profile.is_verified && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Cover Photo */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
          {profile?.cover_photo_url ? (
            <img
              src={profile.cover_photo_url}
              alt="Foto de capa"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Edit cover button */}
          {isOwnProfile && (
            <button
              onClick={() => setShowCoverEditor(true)}
              className="absolute bottom-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 py-6 -mt-10 relative">
          <div className="flex items-center space-x-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Edit avatar button */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarEditor(true)}
                  className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{profile.posts_count}</div>
                  <div className="text-xs text-gray-600">publicações</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.floor(Math.random() * 500) + 100}
                  </div>
                  <div className="text-xs text-gray-600">seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.floor(Math.random() * 300) + 50}
                  </div>
                  <div className="text-xs text-gray-600">seguindo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900">
              {profile.first_name} {profile.last_name}
            </h2>
            {profile.bio && (
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {isOwnProfile ? (
              <div className="flex space-x-2">
                <button className="flex-1 ig-button ig-button-secondary py-2 text-sm font-semibold">
                  Editar perfil
                </button>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 ig-button ig-button-secondary py-2 text-sm font-semibold"
                >
                  Nova publicação
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button className="flex-1 ig-button ig-button-follow py-2 text-sm font-semibold">
                  Seguir
                </button>
                <button className="flex-1 ig-button ig-button-secondary py-2 text-sm font-semibold">
                  Mensagem
                </button>
                <button
                  onClick={() => setShowTestimonialComposer(true)}
                  className="px-4 ig-button ig-button-secondary py-2 text-sm font-semibold flex items-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stories Highlights */}
        <div className="px-4 pb-4">
          <div className="flex space-x-4 overflow-x-auto custom-scrollbar">
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs text-gray-600">Novo</span>
            </div>
          </div>
        </div>

        {/* Tabs with outline icons */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex-1 py-4 flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === 'grid'
                  ? 'border-t-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <span className="text-xs font-medium">POSTS</span>
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex-1 py-4 flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === 'testimonials'
                  ? 'border-t-2 border-pink-500 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span className="text-xs font-medium">DEPOIMENTOS</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="pb-16">
          {activeTab === 'grid' ? (
            <div className="profile-grid">
              {posts.length === 0 ? (
                <div className="col-span-3 py-16 text-center">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    {isOwnProfile ? 'Compartilhe fotos' : 'Nenhuma publicação ainda'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isOwnProfile 
                      ? 'Quando você compartilhar fotos e vídeos, eles aparecerão no seu perfil.'
                      : 'Quando eles compartilharem fotos e vídeos, você poderá vê-las aqui.'
                    }
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="mt-4 text-blue-500 font-semibold text-sm"
                    >
                      Compartilhar sua primeira foto
                    </button>
                  )}
                </div>
              ) : (
                posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      {post.post_type === 'testimonial' ? (
                        <div className="text-center p-4">
                          <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                          <p className="text-xs text-gray-600 leading-tight line-clamp-3">
                            {post.content}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          <p className="text-xs text-gray-600 leading-tight line-clamp-3">
                            {post.content}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-sm font-semibold">
                            {Math.floor(Math.random() * 100) + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-sm font-semibold">
                            {Math.floor(Math.random() * 20) + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="px-4 py-6 space-y-4">
              {testimonials.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    {isOwnProfile ? 'Nenhum depoimento ainda' : 'Deixe um depoimento'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {isOwnProfile 
                      ? 'Depoimentos de amigos aparecerão aqui'
                      : 'Seja o primeiro a deixar um depoimento especial!'
                    }
                  </p>
                  {!isOwnProfile && (
                    <button
                      onClick={() => setShowTestimonialComposer(true)}
                      className="ig-button ig-button-primary text-sm px-6 py-2 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      <span>Deixar depoimento</span>
                    </button>
                  )}
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 modern-shadow"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {testimonial.author_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {testimonial.author_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div
                      className="rounded-lg p-4 text-center"
                      style={{
                        backgroundColor: testimonial.background_color,
                        color: testimonial.text_color,
                        fontFamily: testimonial.font_family,
                        fontSize: `${testimonial.font_size}px`,
                        background: testimonial.background_gradient || testimonial.background_color,
                      }}
                    >
                      <p className="leading-relaxed">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentTab="profile" onCreatePost={() => setShowCreatePost(true)} />

      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleNewPost}
          currentUser={currentUser}
        />
      )}

      {showTestimonialComposer && (
        <TestimonialComposer
          targetUser={profile}
          onClose={() => setShowTestimonialComposer(false)}
          onSubmit={handleNewTestimonial}
        />
      )}

      {/* Avatar Editor */}
      {showAvatarEditor && (
        <ProfilePhotoEditor
          currentPhoto={profile?.avatar_url}
          onSave={handleSaveAvatar}
          onClose={() => setShowAvatarEditor(false)}
          type="avatar"
        />
      )}

      {/* Cover Photo Editor */}
      {showCoverEditor && (
        <ProfilePhotoEditor
          currentPhoto={profile?.cover_photo_url}
          onSave={handleSaveCover}
          onClose={() => setShowCoverEditor(false)}
          type="cover"
        />
      )}
    </div>
  );
};

export default ModernProfileScreen;
