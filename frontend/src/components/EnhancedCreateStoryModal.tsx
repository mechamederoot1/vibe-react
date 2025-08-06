import React, { useState, useRef } from 'react';
import { User } from '../types/auth';

interface EnhancedCreateStoryModalProps {
  onClose: () => void;
  onSubmit: (content: string, mediaFile?: File, background?: string) => Promise<void>;
  currentUser: User | null;
}

const EnhancedCreateStoryModal: React.FC<EnhancedCreateStoryModalProps> = ({ 
  onClose, 
  onSubmit, 
  currentUser 
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('gradient1');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#FF6B6B');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const predefinedBackgrounds = {
    gradient1: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    gradient2: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    gradient3: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
    gradient4: 'bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500',
    gradient5: 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500',
    gradient6: 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500',
    gradient7: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600',
    gradient8: 'bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600',
    solid1: 'bg-black',
    solid2: 'bg-white',
    solid3: 'bg-red-500',
    solid4: 'bg-blue-500',
    solid5: 'bg-green-500',
    solid6: 'bg-purple-500',
    solid7: 'bg-pink-500',
    solid8: 'bg-yellow-500',
  };

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#2C3E50'
  ];

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Máximo ${type === 'video' ? '50MB' : '10MB'}`);
      return;
    }

    // Validate video duration if it's a video
    if (type === 'video') {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        if (videoElement.duration > 25) {
          setError('Vídeo deve ter no máximo 25 segundos');
          URL.revokeObjectURL(videoElement.src);
          return;
        }
        setMediaFile(file);
        setMediaPreview(videoElement.src);
        setMediaType('video');
        setError('');
      };
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setMediaFile(file);
        setMediaPreview(reader.result as string);
        setMediaType('image');
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaFile) {
      setError('Adicione texto ou mídia ao seu story');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const background = selectedBackground === 'custom' ? customColor : selectedBackground;
      await onSubmit(content.trim(), mediaFile || undefined, background);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar story');
    } finally {
      setLoading(false);
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const getBackgroundStyle = () => {
    if (selectedBackground === 'custom') {
      return { backgroundColor: customColor };
    }
    return {};
  };

  const getBackgroundClass = () => {
    if (selectedBackground === 'custom') {
      return '';
    }
    return predefinedBackgrounds[selectedBackground] || predefinedBackgrounds.gradient1;
  };

  const remainingChars = 500 - content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-sm h-full max-h-[700px] relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-2">
            {mediaFile && (
              <button
                onClick={clearMedia}
                className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition-colors"
              >
                Remover mídia
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={(!content.trim() && !mediaFile) || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publicando...' : 'Compartilhar'}
            </button>
          </div>
        </div>

        {/* Story Preview */}
        <div 
          className={`w-full h-full rounded-2xl overflow-hidden relative ${getBackgroundClass()}`}
          style={getBackgroundStyle()}
        >
          {/* Media Background */}
          {mediaFile && (
            <div className="absolute inset-0">
              {mediaType === 'image' ? (
                <img
                  src={mediaPreview}
                  alt="Story media"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={mediaPreview}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          )}

          {/* User info */}
          <div className="absolute top-16 left-4 right-4 flex items-center space-x-2 z-10">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-white text-sm font-medium drop-shadow-lg">
              {currentUser?.first_name} {currentUser?.last_name}
            </span>
            <span className="text-white text-xs opacity-75 drop-shadow-lg">agora</span>
          </div>

          {/* Content Area */}
          <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2">
            {content ? (
              <div className="text-center">
                <p className="text-white text-xl font-medium leading-relaxed text-center break-words drop-shadow-lg">
                  {content}
                </p>
              </div>
            ) : !mediaFile && (
              <div className="text-center text-white opacity-50">
                <p className="text-lg">Toque para adicionar texto</p>
              </div>
            )}
          </div>

          {/* Text input overlay */}
          {!mediaFile && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite seu story..."
              maxLength={500}
              className="absolute inset-0 w-full h-full bg-transparent text-transparent resize-none focus:outline-none cursor-text"
              style={{ caretColor: 'white' }}
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          {error && (
            <div className="bg-red-500 text-white text-center p-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Text input for media stories */}
          {mediaFile && (
            <div className="bg-black bg-opacity-50 rounded-lg p-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Adicione uma legenda..."
                maxLength={500}
                rows={2}
                className="w-full bg-transparent text-white placeholder-gray-300 resize-none focus:outline-none text-sm"
              />
              <div className="text-right mt-1">
                <span className="text-white text-xs opacity-75">
                  {remainingChars} caracteres
                </span>
              </div>
            </div>
          )}

          {/* Media Upload Buttons */}
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors"
              title="Adicionar foto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <button 
              onClick={() => videoInputRef.current?.click()}
              className="p-3 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors"
              title="Adicionar vídeo (max 25s)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <button 
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-3 rounded-full bg-black bg-opacity-30 text-white hover:bg-opacity-50 transition-colors"
              title="Selecionar cor"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 20v-2m8-10a4 4 0 014 4v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a4 4 0 014-4zm0-2V9m0 12v2" />
              </svg>
            </button>
          </div>

          {/* Color Selection */}
          {showColorPicker && (
            <div className="bg-black bg-opacity-50 rounded-lg p-3 space-y-3">
              {/* Predefined backgrounds */}
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(predefinedBackgrounds).map(([key, className]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedBackground(key);
                      setShowColorPicker(false);
                    }}
                    className={`w-8 h-8 rounded-full ${className} ${
                      selectedBackground === key ? 'ring-2 ring-white' : ''
                    }`}
                  />
                ))}
              </div>
              
              {/* Color picker */}
              <div className="space-y-2">
                <p className="text-white text-xs text-center">Cor personalizada</p>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setCustomColor(color);
                        setSelectedBackground('custom');
                        setShowColorPicker(false);
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 rounded-full ${
                        selectedBackground === 'custom' && customColor === color ? 'ring-2 ring-white' : ''
                      }`}
                    />
                  ))}
                </div>
                
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedBackground('custom');
                  }}
                  className="w-full h-8 rounded border-none bg-transparent"
                />
              </div>
            </div>
          )}

          {/* Story Duration Info */}
          <div className="text-center">
            <p className="text-white text-xs opacity-75">
              ⏰ Seu story ficará visível por 24 horas
            </p>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleMediaUpload(e, 'image')}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleMediaUpload(e, 'video')}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default EnhancedCreateStoryModal;
