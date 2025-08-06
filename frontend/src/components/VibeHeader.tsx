import React from 'react';
import { Link } from 'react-router-dom';

interface InstagramHeaderProps {
  onCreatePost: () => void;
}

const InstagramHeader: React.FC<InstagramHeaderProps> = ({ onCreatePost }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-gradient">Vibe</span>
        </h1>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-5">
        {/* Add Post */}
        <button
          onClick={onCreatePost}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Heart/Likes */}
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Messages */}
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default InstagramHeader;
