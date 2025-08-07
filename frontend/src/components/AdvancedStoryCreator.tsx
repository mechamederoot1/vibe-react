import React, { useState, useRef, useCallback } from 'react';
import { User } from '../types/auth';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  isBold: boolean;
  isUnderlined: boolean;
  isItalic: boolean;
  rotation: number;
}

interface AdvancedStoryCreatorProps {
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  currentUser: User | null;
}

const AdvancedStoryCreator: React.FC<AdvancedStoryCreatorProps> = ({ 
  onClose, 
  onSubmit, 
  currentUser 
}) => {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState('gradient1');
  const [customBgColor, setCustomBgColor] = useState('#FF6B6B');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'background' | 'text' | 'style'>('text');
  
  const storyCanvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ isDragging: boolean; elementId: string | null; offset: { x: number; y: number } }>({
    isDragging: false,
    elementId: null,
    offset: { x: 0, y: 0 }
  });

  // Predefined backgrounds
  const backgrounds = {
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
    solid9: 'bg-gray-800',
    solid10: 'bg-gray-200',
  };

  const fonts = [
    'Inter', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 
    'Courier New', 'Verdana', 'Impact', 'Comic Sans MS', 'Trebuchet MS'
  ];

  const textColors = [
    '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A'
  ];

  const bgColors = [
    'transparent', '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', 
    '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  // Add new text element
  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'Digite aqui',
      x: 200,
      y: 300,
      fontSize: 24,
      fontFamily: 'Inter',
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      isBold: false,
      isUnderlined: false,
      isItalic: false,
      rotation: 0
    };
    
    setTextElements(prev => [...prev, newElement]);
    setSelectedElementId(newElement.id);
    setActiveTab('text');
  };

  // Update selected element
  const updateSelectedElement = (updates: Partial<TextElement>) => {
    if (!selectedElementId) return;
    
    setTextElements(prev => 
      prev.map(el => 
        el.id === selectedElementId ? { ...el, ...updates } : el
      )
    );
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    
    setTextElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  // Get selected element
  const selectedElement = textElements.find(el => el.id === selectedElementId);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = textElements.find(el => el.id === elementId);
    if (!element) return;

    const rect = storyCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = {
      isDragging: true,
      elementId,
      offset: {
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y
      }
    };

    setSelectedElementId(elementId);
  };

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.isDragging || !dragRef.current.elementId) return;

    const rect = storyCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragRef.current.offset.x;
    const newY = e.clientY - rect.top - dragRef.current.offset.y;

    // Keep element within bounds
    const boundedX = Math.max(0, Math.min(newX, rect.width - 100));
    const boundedY = Math.max(60, Math.min(newY, rect.height - 100));

    setTextElements(prev => 
      prev.map(el => 
        el.id === dragRef.current.elementId 
          ? { ...el, x: boundedX, y: boundedY }
          : el
      )
    );
  }, []);

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    dragRef.current.isDragging = false;
    dragRef.current.elementId = null;
  }, []);

  // Add event listeners for dragging
  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle submit
  const handleSubmit = async () => {
    if (textElements.length === 0) {
      setError('Adicione pelo menos um texto ao seu story');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a simple text representation for now
      // In a real implementation, you'd save the full layout data
      const content = textElements.map(el => el.text).join(' ');
      await onSubmit(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar story');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundStyle = () => {
    if (selectedBackground === 'custom') {
      return { backgroundColor: customBgColor };
    }
    return {};
  };

  const getBackgroundClass = () => {
    if (selectedBackground === 'custom') {
      return '';
    }
    return backgrounds[selectedBackground as keyof typeof backgrounds] || backgrounds.gradient1;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex z-50">
      {/* Story Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          {/* Story Preview Container */}
          <div 
            ref={storyCanvasRef}
            className={`w-80 h-[600px] rounded-2xl overflow-hidden relative cursor-pointer ${getBackgroundClass()}`}
            style={getBackgroundStyle()}
            onClick={(e) => {
              // Add text when clicking on empty area
              if (e.target === e.currentTarget) {
                const rect = storyCanvasRef.current?.getBoundingClientRect();
                if (rect) {
                  const newElement: TextElement = {
                    id: Date.now().toString(),
                    text: 'Digite aqui',
                    x: e.clientX - rect.left - 50,
                    y: e.clientY - rect.top - 12,
                    fontSize: 24,
                    fontFamily: 'Inter',
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    isBold: false,
                    isUnderlined: false,
                    isItalic: false,
                    rotation: 0
                  };
                  setTextElements(prev => [...prev, newElement]);
                  setSelectedElementId(newElement.id);
                }
              }
            }}
          >
            {/* User Info */}
            <div className="absolute top-4 left-4 right-4 flex items-center space-x-2 z-10">
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

            {/* Text Elements */}
            {textElements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move select-none ${
                  selectedElementId === element.id ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  fontSize: element.fontSize,
                  fontFamily: element.fontFamily,
                  color: element.color,
                  backgroundColor: element.backgroundColor === 'transparent' ? 'transparent' : element.backgroundColor,
                  fontWeight: element.isBold ? 'bold' : 'normal',
                  textDecoration: element.isUnderlined ? 'underline' : 'none',
                  fontStyle: element.isItalic ? 'italic' : 'normal',
                  transform: `rotate(${element.rotation}deg)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  padding: element.backgroundColor !== 'transparent' ? '4px 8px' : '0',
                  borderRadius: element.backgroundColor !== 'transparent' ? '4px' : '0',
                  whiteSpace: 'nowrap',
                  maxWidth: '280px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElementId(element.id);
                }}
              >
                {element.text}
              </div>
            ))}

            {/* Empty state */}
            {textElements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white opacity-60">
                  <p className="text-lg mb-2">Toque para adicionar texto</p>
                  <p className="text-sm">ou use os controles ao lado</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">Editor de Story</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'text', label: 'Texto', icon: 'T' },
            { id: 'style', label: 'Estilo', icon: '🎨' },
            { id: 'background', label: 'Fundo', icon: '🌈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Text Controls */}
          {activeTab === 'text' && (
            <>
              <div className="space-y-3">
                <button
                  onClick={addTextElement}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  + Adicionar Texto
                </button>

                {selectedElement && (
                  <>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Texto</label>
                      <textarea
                        value={selectedElement.text}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Digite seu texto aqui..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Fonte</label>
                      <select
                        value={selectedElement.fontFamily}
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {fonts.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={deleteSelectedElement}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      🗑️ Deletar Texto
                    </button>
                  </>
                )}

                {!selectedElement && textElements.length > 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <p>Selecione um texto para editar</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Style Controls */}
          {activeTab === 'style' && selectedElement && (
            <>
              <div className="space-y-4">
                {/* Font Size Slider */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Tamanho da Fonte ({selectedElement.fontSize}px)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={selectedElement.fontSize}
                    onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Cor do Texto</label>
                  <div className="grid grid-cols-5 gap-2">
                    {textColors.map(color => (
                      <button
                        key={color}
                        onClick={() => updateSelectedElement({ color })}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-lg border-2 ${
                          selectedElement.color === color ? 'border-white' : 'border-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => updateSelectedElement({ color: e.target.value })}
                    className="w-full h-10 mt-2 rounded-lg border border-gray-600"
                  />
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Fundo do Texto</label>
                  <div className="grid grid-cols-5 gap-2">
                    {bgColors.map(color => (
                      <button
                        key={color}
                        onClick={() => updateSelectedElement({ backgroundColor: color })}
                        style={{ 
                          backgroundColor: color === 'transparent' ? 'transparent' : color,
                          border: color === 'transparent' ? '2px dashed #9CA3AF' : 'none'
                        }}
                        className={`w-10 h-10 rounded-lg border-2 ${
                          selectedElement.backgroundColor === color ? 'border-white' : 'border-gray-600'
                        }`}
                      >
                        {color === 'transparent' && <span className="text-gray-400 text-xs">∅</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Style Toggles */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Estilo</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateSelectedElement({ isBold: !selectedElement.isBold })}
                      className={`py-2 px-4 rounded-lg font-bold transition-colors ${
                        selectedElement.isBold ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => updateSelectedElement({ isItalic: !selectedElement.isItalic })}
                      className={`py-2 px-4 rounded-lg italic transition-colors ${
                        selectedElement.isItalic ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      I
                    </button>
                    <button
                      onClick={() => updateSelectedElement({ isUnderlined: !selectedElement.isUnderlined })}
                      className={`py-2 px-4 rounded-lg underline transition-colors ${
                        selectedElement.isUnderlined ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      U
                    </button>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Rotação ({selectedElement.rotation}°)
                  </label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={selectedElement.rotation}
                    onChange={(e) => updateSelectedElement({ rotation: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}

          {/* Background Controls */}
          {activeTab === 'background' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-3">Fundos Predefinidos</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(backgrounds).map(([key, className]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedBackground(key)}
                        className={`w-16 h-16 rounded-lg ${className} ${
                          selectedBackground === key ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-3">Cor Personalizada</label>
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => {
                      setCustomBgColor(e.target.value);
                      setSelectedBackground('custom');
                    }}
                    className="w-full h-12 rounded-lg border border-gray-600"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          {error && (
            <div className="bg-red-600 text-white text-center p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={textElements.length === 0 || loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Publicando...' : '📱 Compartilhar Story'}
          </button>
          
          <p className="text-gray-400 text-xs text-center mt-2">
            ⏰ Seu story ficará visível por 24 horas
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStoryCreator;
