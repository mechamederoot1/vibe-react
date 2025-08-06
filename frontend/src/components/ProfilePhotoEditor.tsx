import React, { useState, useRef, useCallback } from 'react';

interface ProfilePhotoEditorProps {
  currentPhoto?: string;
  onSave: (croppedImage: string) => Promise<void>;
  onClose: () => void;
  type: 'avatar' | 'cover';
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ProfilePhotoEditor: React.FC<ProfilePhotoEditorProps> = ({
  currentPhoto,
  onSave,
  onClose,
  type
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(currentPhoto || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAvatar = type === 'avatar';
  const cropAspectRatio = isAvatar ? 1 : 16 / 9; // 1:1 for avatar, 16:9 for cover

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 10MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setError('');
      // Reset crop area when new image is loaded
      setTimeout(() => {
        if (imageRef.current) {
          const img = imageRef.current;
          const containerWidth = img.offsetWidth;
          const containerHeight = img.offsetHeight;
          
          let cropWidth, cropHeight;
          if (isAvatar) {
            const size = Math.min(containerWidth, containerHeight) * 0.8;
            cropWidth = cropHeight = size;
          } else {
            cropWidth = containerWidth * 0.8;
            cropHeight = cropWidth / cropAspectRatio;
            if (cropHeight > containerHeight * 0.8) {
              cropHeight = containerHeight * 0.8;
              cropWidth = cropHeight * cropAspectRatio;
            }
          }

          setCropArea({
            x: (containerWidth - cropWidth) / 2,
            y: (containerHeight - cropHeight) / 2,
            width: cropWidth,
            height: cropHeight
          });
        }
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const containerWidth = imageRef.current.offsetWidth;
    const containerHeight = imageRef.current.offsetHeight;

    if (isDragging) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      setCropArea(prev => {
        const newX = Math.max(0, Math.min(containerWidth - prev.width, prev.x + deltaX));
        const newY = Math.max(0, Math.min(containerHeight - prev.height, prev.y + deltaY));
        return { ...prev, x: newX, y: newY };
      });

      setDragStart({ x, y });
    } else if (isResizing) {
      setCropArea(prev => {
        let newWidth = Math.max(50, x - prev.x);
        let newHeight = isAvatar ? newWidth : newWidth / cropAspectRatio;

        // Ensure crop area doesn't exceed container bounds
        newWidth = Math.min(newWidth, containerWidth - prev.x);
        newHeight = Math.min(newHeight, containerHeight - prev.y);

        // Maintain aspect ratio
        if (isAvatar) {
          const size = Math.min(newWidth, newHeight);
          newWidth = newHeight = size;
        } else {
          if (newHeight * cropAspectRatio > newWidth) {
            newHeight = newWidth / cropAspectRatio;
          } else {
            newWidth = newHeight * cropAspectRatio;
          }
        }

        return { ...prev, width: newWidth, height: newHeight };
      });
    }
  }, [isDragging, isResizing, dragStart, cropAspectRatio, isAvatar]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const cropImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!imageRef.current || !canvasRef.current) {
        reject(new Error('Image or canvas not available'));
        return;
      }

      const image = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Calculate scaling factors
      const scaleX = image.naturalWidth / image.offsetWidth;
      const scaleY = image.naturalHeight / image.offsetHeight;

      // Set canvas size for output
      const outputSize = isAvatar ? 400 : 1200;
      canvas.width = outputSize;
      canvas.height = isAvatar ? outputSize : outputSize / cropAspectRatio;

      // Draw cropped image
      ctx.drawImage(
        image,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleSave = async () => {
    if (!imagePreview) {
      setError('Selecione uma imagem primeiro');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const croppedImage = await cropImage();
      await onSave(croppedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar imagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {isAvatar ? 'Editar foto do perfil' : 'Editar foto de capa'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* File Upload */}
          {!imagePreview && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 mb-4">
                Selecione uma {isAvatar ? 'foto de perfil' : 'foto de capa'}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Escolher arquivo
              </button>
            </div>
          )}

          {/* Image Editor */}
          {imagePreview && (
            <div className="space-y-4">
              <div 
                ref={containerRef}
                className="relative bg-gray-100 rounded-lg overflow-hidden"
                style={{ aspectRatio: isAvatar ? '1' : '16/9', maxHeight: '300px' }}
              >
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Crop overlay */}
                <div
                  className="absolute border-2 border-white shadow-lg cursor-move"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                    borderRadius: isAvatar ? '50%' : '8px'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'drag')}
                >
                  {/* Resize handle */}
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-white border border-gray-300 cursor-se-resize"
                    style={{
                      transform: 'translate(50%, 50%)',
                      borderRadius: isAvatar ? '50%' : '2px'
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, 'resize');
                    }}
                  />
                </div>

                {/* Dark overlay */}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"
                  style={{
                    clipPath: isAvatar 
                      ? `circle(${cropArea.width/2}px at ${cropArea.x + cropArea.width/2}px ${cropArea.y + cropArea.height/2}px)`
                      : `polygon(0 0, ${cropArea.x}px 0, ${cropArea.x}px ${cropArea.y}px, ${cropArea.x + cropArea.width}px ${cropArea.y}px, ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px, ${cropArea.x}px ${cropArea.y + cropArea.height}px, ${cropArea.x}px 100%, 0 100%)`
                  }}
                />
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Arraste para posicionar • Redimensione usando o canto</p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Escolher outra imagem
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!imagePreview || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePhotoEditor;
