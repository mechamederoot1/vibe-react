import React, { useState } from 'react';
import { Post } from '../services/postService';

interface InstagramPostCardProps {
  post: Post;
  currentUserId: number;
  onDelete: (postId: number) => void;
}

const InstagramPostCard: React.FC<InstagramPostCardProps> = ({ 
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
  const isLongCaption = post.content.length > 125;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
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
    : post.content.substring(0, 125) + '...';

  return (
    <article className="feed-post">
      {/* Header */}
      <header className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {post.author_name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-gray-900">
              {post.author_name}
            </span>
            {post.post_type === 'testimonial' && (
              <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-full">
                depoimento
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors relative"
        >
          <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
              {isOwner ? (
                <>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors text-sm"
                  >
                    Excluir
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                    Editar
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                    Denunciar
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                    Deixar de seguir
                  </button>
                </>
              )}
            </div>
          )}
        </button>
      </header>

      {/* Content Image Placeholder (for future media posts) */}
      <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center p-8">
          {post.post_type === 'testimonial' ? (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
              <div className="text-2xl mb-2">💝</div>
              <p className="text-gray-800 font-medium text-lg leading-relaxed">
                "{displayCaption}"
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {displayCaption}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`p-1 transition-colors ${liked ? 'text-red-500' : 'text-gray-900 hover:text-gray-600'}`}
            >
              {liked ? (
                <svg className="w-6 h-6 like-animation" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              )}
            </button>
            
            <button className="p-1 text-gray-900 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>
            
            <button className="p-1 text-gray-900 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => setSaved(!saved)}
            className={`p-1 transition-colors ${saved ? 'text-gray-900' : 'text-gray-900 hover:text-gray-600'}`}
          >
            {saved ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <button className="text-sm font-semibold text-gray-900">
            {likesCount} curtidas
          </button>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold text-gray-900 mr-2">{post.author_name}</span>
          <span className="text-gray-900">
            {displayCaption}
            {isLongCaption && !showFullCaption && (
              <button
                onClick={() => setShowFullCaption(true)}
                className="text-gray-500 ml-1"
              >
                mais
              </button>
            )}
          </span>
        </div>

        {/* Comments */}
        <button className="text-sm text-gray-500 mt-1 block">
          Ver todos os {Math.floor(Math.random() * 20) + 1} comentários
        </button>

        {/* Time */}
        <time className="text-xs text-gray-400 uppercase tracking-wide block mt-1">
          {formatDate(post.created_at)}
        </time>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </article>
  );
};

export default InstagramPostCard;
