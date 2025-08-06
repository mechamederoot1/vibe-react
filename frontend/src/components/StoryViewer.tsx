import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Story } from '../services/storyService';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  currentUser: any;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  currentUser
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
  const progressInterval = useRef<number | null>(null);
  const hideControlsTimeout = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds

  // Auto-advance to next story
  useEffect(() => {
    if (!isPlaying) return;

    progressInterval.current = window.setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (STORY_DURATION / 100));
        if (newProgress >= 100) {
          handleNextStory();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPlaying]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      hideControlsTimeout.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (hideControlsTimeout.current) {
        window.clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [showControls]);

  // Video handling
  useEffect(() => {
    if (videoRef.current && currentStory?.media_type === 'video') {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  const handleNextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePreviousStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    // Swipe detection (horizontal swipes should be longer than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe left - next story
        handleNextStory();
      } else {
        // Swipe right - previous story
        handlePreviousStory();
      }
    } else {
      // Tap - show/hide controls
      setShowControls(!showControls);
    }

    setTouchStart(null);
  };

  const handleScreenTap = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const tapX = e.clientX - rect.left;
    const screenWidth = rect.width;

    if (tapX < screenWidth / 3) {
      // Left third - previous story
      handlePreviousStory();
    } else if (tapX > (screenWidth * 2) / 3) {
      // Right third - next story
      handleNextStory();
    } else {
      // Middle - toggle controls
      setShowControls(!showControls);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours === 1) return '1h';
    if (diffInHours < 24) return `${diffInHours}h`;
    return '1d';
  };

  const getBackgroundContent = () => {
    // Check if story has media
    if (currentStory.media_url) {
      if (currentStory.media_type === 'video') {
        return (
          <video
            ref={videoRef}
            src={currentStory.media_url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onClick={handlePlayPause}
          />
        );
      } else {
        return (
          <img
            src={currentStory.media_url}
            alt="Story"
            className="w-full h-full object-cover"
          />
        );
      }
    }

    // Text-only story with background
    return (
      <div 
        className={`w-full h-full flex items-center justify-center ${
          currentStory.background_color || 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}
        style={{
          backgroundColor: currentStory.background_color,
          background: currentStory.background_gradient || currentStory.background_color
        }}
      >
        <div className="text-center px-8">
          <p 
            className="text-white text-2xl font-bold leading-relaxed break-words"
            style={{
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
              fontSize: currentStory.font_size ? `${currentStory.font_size}px` : '32px',
              color: currentStory.text_color || '#ffffff'
            }}
          >
            {currentStory.content}
          </p>
        </div>
      </div>
    );
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black w-screen h-screen">
      {/* Story Content */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleScreenTap}
        style={{
          width: '100vw',
          height: '100vh',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        {getBackgroundContent()}

        {/* Text overlay for media stories */}
        {currentStory.media_url && currentStory.content && (
          <div className="absolute inset-x-4 bottom-20 text-center">
            <p className="text-white text-lg font-medium leading-relaxed break-words"
               style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Progress Bars */}
        <div className="absolute top-2 left-2 right-2 flex space-x-1 z-20">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-black bg-opacity-30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: index < currentIndex ? '100%' : 
                         index === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header with user info and controls */}
        {showControls && (
          <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white ring-opacity-50">
                {currentStory.author_avatar ? (
                  <img
                    src={currentStory.author_avatar}
                    alt={currentStory.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {currentStory.author_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  {currentStory.author_name}
                </h3>
                <p className="text-white text-xs opacity-75" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  {formatTimeAgo(currentStory.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Play/Pause button for videos */}
              {currentStory.media_type === 'video' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                  className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              )}

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Navigation hints (only shown on first load) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left tap area hint */}
          <div className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-start pl-4">
            {showControls && currentIndex > 0 && (
              <div className="text-white opacity-50" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            )}
          </div>

          {/* Right tap area hint */}
          <div className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-end pr-4">
            {showControls && currentIndex < stories.length - 1 && (
              <div className="text-white opacity-50" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Bottom actions */}
        {showControls && (
          <div className="absolute bottom-8 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              
              <button className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
              </button>

              <button className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
