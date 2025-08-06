import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginData } from '../../types/auth';
import VibeButton from '../../components/VibeButton';
import VibeInput from '../../components/VibeInput';
import VibeLogoComponent from '../../components/VibeLogoComponent';

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
    <div className="h-screen w-full bg-gradient-to-br from-vibe-light to-white flex flex-col">
      {/* Header */}
      <div className="flex-none pt-16 pb-8 px-6 text-center">
        <VibeLogoComponent size="large" />
        <h1 className="text-2xl font-bold text-vibe-blue-dark mt-4 mb-2">
          Bem-vindo de volta!
        </h1>
        <p className="text-gray-600">
          Entre para se conectar com seus amigos
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <VibeInput
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <VibeInput
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <VibeButton
            type="submit"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </VibeButton>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-vibe-blue-dark font-semibold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Ao continuar, você concorda com nossos{' '}
              <button className="text-vibe-blue-dark underline">
                Termos de Uso
              </button>{' '}
              e{' '}
              <button className="text-vibe-blue-dark underline">
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
