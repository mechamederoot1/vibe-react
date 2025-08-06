import React, { useState } from 'react';
import { Post } from '../services/postService';

interface PostCardProps {
  post: Post;
  currentUserId: number;
  onDelete: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      setDeleting(true);
      try {
        await onDelete(post.id);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwner = post.author_id === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-vibe-blue rounded-full flex items-center justify-center">
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {post.author_name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.author_name}</h4>
            <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Menu */}
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  {deleting ? 'Excluindo...' : 'Excluir post'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        {post.post_type === 'testimonial' && (
          <div className="bg-gradient-to-r from-vibe-light to-blue-50 border-l-4 border-vibe-blue p-3 mb-3 rounded">
            <p className="text-sm font-medium text-vibe-blue-dark mb-1">
              💝 Depoimento
            </p>
          </div>
        )}
        
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
        <button className="flex items-center space-x-2 text-gray-500 hover:text-vibe-blue-dark transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-sm">Curtir</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-500 hover:text-vibe-blue-dark transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm">Comentar</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-500 hover:text-vibe-blue-dark transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className="text-sm">Compartilhar</span>
        </button>
      </div>
      
      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
