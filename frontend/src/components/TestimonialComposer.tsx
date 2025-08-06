import React, { useState } from 'react';
import { UserProfile } from '../services/userService';
import VibeButton from './VibeButton';

interface TestimonialComposerProps {
  targetUser: UserProfile;
  onClose: () => void;
  onSubmit: (content: string, styling: TestimonialStyling) => Promise<void>;
}

interface TestimonialStyling {
  text_color: string;
  background_color: string;
  font_family: string;
  font_size: number;
  text_shadow?: string;
  background_gradient?: string;
}

const TestimonialComposer: React.FC<TestimonialComposerProps> = ({ 
  targetUser, 
  onClose, 
  onSubmit 
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [styling, setStyling] = useState<TestimonialStyling>({
    text_color: '#000000',
    background_color: '#FFFFFF',
    font_family: 'system-ui',
    font_size: 16,
    text_shadow: '',
    background_gradient: ''
  });

  const fontOptions = [
    { value: 'system-ui', label: 'Sistema' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times' },
    { value: 'Courier New, monospace', label: 'Courier' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans' },
    { value: 'Impact, fantasy', label: 'Impact' }
  ];

  const backgroundPresets = [
    { name: 'Branco', value: '#FFFFFF' },
    { name: 'Rosa', value: '#FCE7F3' },
    { name: 'Azul', value: '#DBEAFE' },
    { name: 'Verde', value: '#D1FAE5' },
    { name: 'Amarelo', value: '#FEF3C7' },
    { name: 'Roxo', value: '#E9D5FF' },
    { name: 'Cinza', value: '#F3F4F6' }
  ];

  const gradientPresets = [
    { name: 'Nenhum', value: '' },
    { name: 'Pôr do Sol', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Rosa Suave', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Oceano', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Floresta', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Dourado', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Digite o depoimento');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(content.trim(), styling);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar depoimento');
    } finally {
      setLoading(false);
    }
  };

  const previewStyle = {
    backgroundColor: styling.background_color,
    color: styling.text_color,
    fontFamily: styling.font_family,
    fontSize: `${styling.font_size}px`,
    textShadow: styling.text_shadow || 'none',
    background: styling.background_gradient || styling.background_color,
  };

  const remainingChars = 1000 - content.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-vibe-blue-dark">
              💝 Novo Depoimento
            </h2>
            <p className="text-gray-600">
              Para {targetUser.first_name} {targetUser.last_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu depoimento
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva algo especial sobre esta pessoa..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                  {remainingChars} caracteres restantes
                </span>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prévia
              </label>
              <div
                className="rounded-lg p-6 min-h-[120px] flex items-center justify-center text-center shadow-inner border-2 border-dashed border-gray-300"
                style={previewStyle}
              >
                <p className="leading-relaxed whitespace-pre-wrap">
                  {content || '"Seu depoimento aparecerá aqui..."'}
                </p>
              </div>
            </div>

            {/* Styling Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">🎨 Personalização</h3>
              
              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do texto
                  </label>
                  <input
                    type="color"
                    value={styling.text_color}
                    onChange={(e) => setStyling({...styling, text_color: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de fundo
                  </label>
                  <input
                    type="color"
                    value={styling.background_color}
                    onChange={(e) => setStyling({...styling, background_color: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Background Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cores pré-definidas
                </label>
                <div className="flex flex-wrap gap-2">
                  {backgroundPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setStyling({...styling, background_color: preset.value, background_gradient: ''})}
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: preset.value }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradientes
                </label>
                <div className="flex flex-wrap gap-2">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setStyling({...styling, background_gradient: preset.value})}
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      style={{ background: preset.value || '#f3f4f6' }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonte
                  </label>
                  <select
                    value={styling.font_family}
                    onChange={(e) => setStyling({...styling, font_family: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vibe-blue"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho ({styling.font_size}px)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={styling.font_size}
                    onChange={(e) => setStyling({...styling, font_size: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Text Shadow */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sombra do texto
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStyling({...styling, text_shadow: ''})}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Nenhuma
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyling({...styling, text_shadow: '1px 1px 2px rgba(0,0,0,0.3)'})}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Suave
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyling({...styling, text_shadow: '2px 2px 4px rgba(0,0,0,0.5)'})}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Forte
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <VibeButton
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </VibeButton>
              <VibeButton
                type="submit"
                loading={loading}
                className="flex-1"
                disabled={!content.trim() || loading}
              >
                {loading ? 'Criando...' : 'Criar Depoimento'}
              </VibeButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialComposer;
