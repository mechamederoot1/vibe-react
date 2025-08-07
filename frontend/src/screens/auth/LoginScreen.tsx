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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo with custom Vibe icon */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            {/* Vibe Logo SVG */}
            <svg width="60" height="60" viewBox="0 0 60 60" className="mr-3">
              <defs>
                <linearGradient id="vibeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="25%" stopColor="#1d4ed8" />
                  <stop offset="50%" stopColor="#1e40af" />
                  <stop offset="75%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
              </defs>
              {/* Outer circle */}
              <circle cx="30" cy="30" r="28" fill="url(#vibeGradient)" />
              {/* Inner design - stylized "V" */}
              <path d="M18 20 L30 40 L42 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Three dots representing connection */}
              <circle cx="15" cy="45" r="2" fill="white" />
              <circle cx="30" cy="45" r="2" fill="white" />
              <circle cx="45" cy="45" r="2" fill="white" />
            </svg>
            <h1 className="text-5xl font-bold text-gradient">
              Vibe
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Conecte-se com seus amigos
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
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

          {/* Sign up */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
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
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
