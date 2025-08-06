import React from 'react';
import { Testimonial } from '../services/postService';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
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

  const cardStyle = {
    backgroundColor: testimonial.background_color,
    color: testimonial.text_color,
    fontFamily: testimonial.font_family,
    fontSize: `${testimonial.font_size}px`,
    textShadow: testimonial.text_shadow || 'none',
    background: testimonial.background_gradient || testimonial.background_color,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-vibe-blue rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {testimonial.author_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{testimonial.author_name}</h4>
              <span className="text-pink-500">💝</span>
              <span className="text-gray-600">→</span>
              <h4 className="font-semibold text-gray-900">{testimonial.target_user_name}</h4>
            </div>
            <p className="text-sm text-gray-500">{formatDate(testimonial.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Testimonial Content */}
      <div className="p-6">
        <div
          className="rounded-lg p-6 min-h-[120px] flex items-center justify-center text-center shadow-inner"
          style={cardStyle}
        >
          <p className="leading-relaxed whitespace-pre-wrap">
            "{testimonial.content}"
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">Curtir</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-vibe-blue-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm">Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
