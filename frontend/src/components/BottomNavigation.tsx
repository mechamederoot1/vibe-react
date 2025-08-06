import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavigationProps {
  currentTab: 'home' | 'search' | 'create' | 'activity' | 'profile';
  onCreatePost: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onCreatePost }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (tab: string) => {
    if (tab === 'home') return location.pathname === '/';
    if (tab === 'profile') return location.pathname === '/profile';
    return false;
  };

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around sticky bottom-0 z-50">
      {/* Home */}
      <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        {isActive('home') ? (
          <svg className="nav-icon nav-icon-active" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"/>
          </svg>
        ) : (
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        )}
      </Link>

      {/* Search */}
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>

      {/* Create Post */}
      <button 
        onClick={onCreatePost}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
        </svg>
      </button>

      {/* Activity/Notifications */}
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        {/* Notification dot */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
      </button>

      {/* Profile */}
      <Link to="/profile" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
        <div className={`w-7 h-7 rounded-full border-2 ${isActive('profile') ? 'border-black' : 'border-gray-300'} overflow-hidden`}>
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
