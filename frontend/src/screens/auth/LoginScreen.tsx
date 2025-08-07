import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginData } from '../../types/auth';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container bg-white">
      <div className="flex flex-col h-full">
        {/* Header with large logo */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Vibe
              </h1>
              <p className="text-gray-600 text-base">
                Conecte-se com seus amigos
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Telefone, nome de usuário ou email"
                  className="ig-input"
                  required
                />

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Senha"
                  className="ig-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.email.trim() || !formData.password.trim()}
                className="ig-button ig-button-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>

              {/* Forgot password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex-none px-8 pb-8">
          {/* Sign up */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-blue-500 font-semibold hover:text-blue-600"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* Footer links */}
          <div className="text-center mt-8 space-y-2">
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <button>Sobre</button>
              <button>Ajuda</button>
              <button>Imprensa</button>
              <button>API</button>
              <button>Carreiras</button>
            </div>
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <button>Privacidade</button>
              <button>Termos</button>
              <button>Localizações</button>
              <button>Idioma</button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              © 2025 Vibe Social Network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
