import React, { useState, useRef, useCallback } from 'react';

interface StoryTextEditorProps {
  onTextChange: (text: string, position: { x: number; y: number }, fontSize: number, color: string) => void;
  containerWidth: number;
  containerHeight: number;
}

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  isSelected: boolean;
  isEditing: boolean;
}

const StoryTextEditor: React.FC<StoryTextEditorProps> = ({
  onTextChange,
  containerWidth,
  containerHeight
}) => {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#90EE90'
  ];

  const addTextElement = useCallback((x: number, y: number) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newElement: TextElement = {
      id: newId,
      text: '',
      x: Math.max(20, Math.min(x, containerWidth - 100)),
      y: Math.max(20, Math.min(y, containerHeight - 50)),
      fontSize: 24,
      color: '#FFFFFF',
      isSelected: true,
      isEditing: true
    };

    setTextElements(prev => [
      ...prev.map(el => ({ ...el, isSelected: false, isEditing: false })),
      newElement
    ]);
    setSelectedId(newId);
    setShowToolbar(true);

    // Focus input after element is created
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [containerWidth, containerHeight]);

  const updateTextElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  }, []);

  const deleteTextElement = useCallback((id: string) => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setShowToolbar(false);
    }
  }, [selectedId]);

  const selectTextElement = useCallback((id: string) => {
    setTextElements(prev => prev.map(el => ({
      ...el,
      isSelected: el.id === id,
      isEditing: false
    })));
    setSelectedId(id);
    setShowToolbar(true);
  }, []);

  const startEditing = useCallback((id: string) => {
    setTextElements(prev => prev.map(el => ({
      ...el,
      isEditing: el.id === id,
      isSelected: el.id === id
    })));
    setSelectedId(id);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const finishEditing = useCallback(() => {
    setTextElements(prev => prev.map(el => ({ ...el, isEditing: false })));
    setShowToolbar(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = textElements.find(el => el.id === id);
    if (!element) return;

    selectTextElement(id);
    setIsDragging(true);
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y
      });
    }
  }, [textElements, selectTextElement]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedId) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(e.clientX - rect.left - dragStart.x, containerWidth - 100));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragStart.y, containerHeight - 50));

    updateTextElement(selectedId, { x, y });
  }, [isDragging, selectedId, dragStart, containerWidth, containerHeight, updateTextElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      finishEditing();
    }
  }, [finishEditing]);

  const selectedElement = selectedId ? textElements.find(el => el.id === selectedId) : null;

  return (
    <>
      {/* Text Elements */}
      <div 
        ref={containerRef}
        className="absolute inset-0 z-10"
        onClick={handleContainerClick}
      >
        {textElements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move select-none ${
              element.isSelected ? 'ring-2 ring-white ring-opacity-50' : ''
            }`}
            style={{
              left: element.x,
              top: element.y,
              fontSize: element.fontSize,
              color: element.color,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontWeight: 'bold',
              maxWidth: containerWidth - element.x - 20
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => startEditing(element.id)}
          >
            {element.isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={element.text}
                onChange={(e) => updateTextElement(element.id, { text: e.target.value })}
                onBlur={finishEditing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    finishEditing();
                  }
                }}
                className="bg-transparent border-none outline-none text-current placeholder-current placeholder-opacity-50"
                style={{
                  fontSize: element.fontSize,
                  color: element.color,
                  width: Math.max(100, element.text.length * (element.fontSize * 0.6)),
                  fontWeight: 'bold'
                }}
                placeholder="Digite aqui..."
                autoFocus
              />
            ) : (
              <span className="whitespace-nowrap">
                {element.text || 'Toque para editar'}
              </span>
            )}
            
            {/* Selection handles */}
            {element.isSelected && !element.isEditing && (
              <>
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTextElement(element.id);
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
                >
                  ×
                </button>
                
                {/* Scale handle */}
                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 cursor-nw-resize"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: Implement scaling
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Text Button */}
      <button
        onClick={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            addTextElement(
              containerWidth / 2 - 50,
              containerHeight / 2 - 25
            );
          }
        }}
        className="absolute bottom-4 left-4 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all z-20"
      >
        <span className="text-xl font-bold">T</span>
      </button>

      {/* Toolbar */}
      {showToolbar && selectedElement && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 rounded-full px-4 py-2 z-30">
          <div className="flex items-center space-x-4">
            {/* Font Size */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateTextElement(selectedElement.id, { 
                  fontSize: Math.max(12, selectedElement.fontSize - 2) 
                })}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30"
              >
                <span className="text-xs">A-</span>
              </button>
              <span className="text-white text-xs w-8 text-center">
                {selectedElement.fontSize}
              </span>
              <button
                onClick={() => updateTextElement(selectedElement.id, { 
                  fontSize: Math.min(48, selectedElement.fontSize + 2) 
                })}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30"
              >
                <span className="text-xs">A+</span>
              </button>
            </div>

            {/* Color Picker */}
            <div className="flex space-x-1">
              {colors.slice(0, 6).map((color) => (
                <button
                  key={color}
                  onClick={() => updateTextElement(selectedElement.id, { color })}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedElement.color === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Done button */}
            <button
              onClick={finishEditing}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryTextEditor;
