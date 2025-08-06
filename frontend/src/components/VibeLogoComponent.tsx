import React from 'react';

interface VibeLogoComponentProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const VibeLogoComponent: React.FC<VibeLogoComponentProps> = ({
  size = 'medium',
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-24 h-8',
    medium: 'w-32 h-10',
    large: 'w-40 h-12',
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg 
        className={sizeClasses[size]} 
        viewBox="0 0 120 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="2"/>
        
        {/* V letter with modern styling */}
        <path d="M12 12 L20 28 L28 12" stroke="#1976D2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* Text "Vibe" */}
        <text x="45" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="600" fill="#1976D2">Vibe</text>
        <text x="45" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" fontWeight="400" fill="#90CAF9">social network</text>
      </svg>
    </div>
  );
};

export default VibeLogoComponent;
