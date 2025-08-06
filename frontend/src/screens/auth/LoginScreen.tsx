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
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-xs text-gray-500 font-semibold">OU</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social login */}
          <button className="w-full flex items-center justify-center py-3 mb-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors rounded-lg">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

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
