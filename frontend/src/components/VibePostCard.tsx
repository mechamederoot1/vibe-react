import React, { useState } from 'react';
import { Post } from '../services/postService';

interface VibePostCardProps {
  post: Post;
  currentUserId: number;
  onDelete: (postId: number) => void;
}

const VibePostCard: React.FC<VibePostCardProps> = ({ 
  post, 
  currentUserId, 
  onDelete 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 100) + 5);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const isOwner = post.author_id === currentUserId;
  const isLongCaption = post.content.length > 200;

  // Generate username from name (temporary until backend is updated)
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '').slice(0, 15);
  };

  const formatLocalTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} d`;
    
    // Show full date and time in user's local timezone
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleDelete = async () => {
    if (window.confirm('Excluir esta publicação?')) {
      try {
        await onDelete(post.id);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  };

  const displayCaption = showFullCaption || !isLongCaption 
    ? post.content 
    : post.content.substring(0, 200) + '...';

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Header - Facebook style */}
      <header className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {post.author_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            
            {/* User info */}
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">
                  {post.author_name}
                </h3>
                {post.post_type === 'testimonial' && (
                  <span className="text-xs bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                    💝 depoimento
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>@{generateUsername(post.author_name)}</span>
                <span>•</span>
                <time>{formatLocalTime(post.created_at)}</time>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Menu button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                {isOwner ? (
                  <>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>Excluir</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span>Editar</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <span>Denunciar</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
                      </svg>
                      <span>Deixar de seguir</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Content - Unique Vibe style */}
      <div className="px-4 pb-3">
        <div className="text-gray-900 text-[15px] leading-relaxed">
          {post.post_type === 'testimonial' ? (
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-xl p-6 border-l-4 border-pink-400 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-2xl opacity-30">💝</div>
              <div className="relative">
                <svg className="w-6 h-6 text-pink-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
                <p className="text-gray-800 font-medium italic">
                  "{displayCaption}"
                </p>
                {isLongCaption && !showFullCaption && (
                  <button
                    onClick={() => setShowFullCaption(true)}
                    className="text-pink-600 font-semibold text-sm mt-2 hover:text-pink-700"
                  >
                    Ver mais
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="whitespace-pre-wrap">
                {displayCaption}
                {isLongCaption && !showFullCaption && (
                  <button
                    onClick={() => setShowFullCaption(true)}
                    className="text-blue-600 font-semibold ml-1 hover:text-blue-700"
                  >
                    Ver mais
                  </button>
                )}
              </p>
              
              {/* Text post visual representation */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                  </svg>
                  <span className="text-sm font-medium">Publicação de texto</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions - Facebook style */}
      <div className="border-t border-gray-100 px-4 py-2">
        {/* Reaction counts */}
        <div className="flex items-center justify-between py-2 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:underline">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                  </svg>
                </div>
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <span>{likesCount}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <button className="hover:underline">
              {Math.floor(Math.random() * 15) + 1} comentários
            </button>
            <button className="hover:underline">
              {Math.floor(Math.random() * 5) + 1} compartilhamentos
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex border-t border-gray-100 pt-1">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors ${
              liked ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={liked ? 0 : 2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
            </svg>
            <span className="font-medium text-sm">Curtir</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span className="font-medium text-sm">Comentar</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            <span className="font-medium text-sm">Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </article>
  );
};

export default VibePostCard;
