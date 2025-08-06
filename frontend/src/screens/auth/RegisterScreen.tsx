import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData, RegisterStep1, RegisterStep2, RegisterStep3, RegisterStep4 } from '../../types/auth';
import { authService } from '../../services/authService';
import VibeButton from '../../components/VibeButton';
import VibeInput from '../../components/VibeInput';
import VibeLogoComponent from '../../components/VibeLogoComponent';
import TermsModal from '../../components/TermsModal';

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  
  const [step1Data, setStep1Data] = useState<RegisterStep1>({
    first_name: '',
    last_name: '',
  });
  
  const [step2Data, setStep2Data] = useState<RegisterStep2>({
    email: '',
  });
  
  const [step3Data, setStep3Data] = useState<RegisterStep3>({
    gender: '',
    birth_date: '',
  });
  
  const [step4Data, setStep4Data] = useState<RegisterStep4>({
    password: '',
    confirm_password: '',
  });
  
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateAndProceed = async (step: number) => {
    setLoading(true);
    setError('');

    try {
      switch (step) {
        case 1:
          await authService.validateStep1(step1Data);
          setCurrentStep(2);
          break;
        case 2:
          await authService.validateStep2(step2Data);
          setCurrentStep(3);
          break;
        case 3:
          await authService.validateStep3(step3Data);
          setCurrentStep(4);
          break;
        case 4:
          await authService.validateStep4(step4Data);
          setCurrentStep(5);
          break;
        case 5:
          if (!termsAccepted) {
            setError('Você deve aceitar os termos de uso');
            return;
          }
          
          const registerData: RegisterData = {
            ...step1Data,
            ...step2Data,
            ...step3Data,
            password: step4Data.password,
            terms_accepted: termsAccepted,
          };
          
          await register(registerData);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na validação');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const progressPercentage = ((currentStep - 1) / 4) * 100;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-vibe-light to-white flex flex-col">
      {/* Environment indicator */}
      {window.location.hostname.includes('fly.dev') && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                🚀 <strong>Demo Mode:</strong> Usando dados simulados para demonstração
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-none pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-6">
          {currentStep > 1 && (
            <button
              onClick={goBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <VibeLogoComponent size="medium" />
          
          <div className="w-10"></div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-vibe-blue-dark h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-center text-sm text-gray-600">
          Etapa {currentStep} de 5
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {currentStep === 1 && (
          <Step1 
            data={step1Data}
            onChange={setStep1Data}
            onNext={() => validateAndProceed(1)}
            loading={loading}
          />
        )}

        {currentStep === 2 && (
          <Step2
            data={step2Data}
            onChange={setStep2Data}
            onNext={() => validateAndProceed(2)}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <Step3
            data={step3Data}
            onChange={setStep3Data}
            onNext={() => validateAndProceed(3)}
            loading={loading}
          />
        )}

        {currentStep === 4 && (
          <Step4
            data={step4Data}
            onChange={setStep4Data}
            onNext={() => validateAndProceed(4)}
            loading={loading}
          />
        )}

        {currentStep === 5 && (
          <Step5
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
            onShowTerms={() => setShowTerms(true)}
            onFinish={() => validateAndProceed(5)}
            loading={loading}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-vibe-blue-dark font-semibold hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <TermsModal onClose={() => setShowTerms(false)} />
      )}
    </div>
  );
};

// Step Components
const Step1: React.FC<{
  data: RegisterStep1;
  onChange: (data: RegisterStep1) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div>
    <h2 className="text-2xl font-bold text-vibe-blue-dark mb-2">
      Como você se chama?
    </h2>
    <p className="text-gray-600 mb-6">
      Vamos começar com seu nome
    </p>

    <div className="space-y-4">
      <VibeInput
        type="text"
        value={data.first_name}
        onChange={(value) => onChange({ ...data, first_name: value })}
        placeholder="Nome"
        required
      />
      
      <VibeInput
        type="text"
        value={data.last_name}
        onChange={(value) => onChange({ ...data, last_name: value })}
        placeholder="Sobrenome"
        required
      />
    </div>

    <VibeButton
      onClick={onNext}
      loading={loading}
      className="w-full mt-8"
      disabled={!data.first_name.trim() || !data.last_name.trim()}
    >
      Continuar
    </VibeButton>
  </div>
);

const Step2: React.FC<{
  data: RegisterStep2;
  onChange: (data: RegisterStep2) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div>
    <h2 className="text-2xl font-bold text-vibe-blue-dark mb-2">
      Qual seu e-mail?
    </h2>
    <p className="text-gray-600 mb-6">
      Usaremos para entrar em contato e para login
    </p>

    <VibeInput
      type="email"
      value={data.email}
      onChange={(value) => onChange({ ...data, email: value })}
      placeholder="seu@email.com"
      required
    />

    <VibeButton
      onClick={onNext}
      loading={loading}
      className="w-full mt-8"
      disabled={!data.email.trim()}
    >
      Continuar
    </VibeButton>
  </div>
);

const Step3: React.FC<{
  data: RegisterStep3;
  onChange: (data: RegisterStep3) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div>
    <h2 className="text-2xl font-bold text-vibe-blue-dark mb-2">
      Sobre você
    </h2>
    <p className="text-gray-600 mb-6">
      Precisamos de algumas informações básicas
    </p>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gênero
        </label>
        <select
          value={data.gender}
          onChange={(e) => onChange({ ...data, gender: e.target.value })}
          className="vibe-input"
          required
        >
          <option value="">Selecione...</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      
      <VibeInput
        type="date"
        value={data.birth_date}
        onChange={(value) => onChange({ ...data, birth_date: value })}
        label="Data de nascimento"
        required
      />
    </div>

    <VibeButton
      onClick={onNext}
      loading={loading}
      className="w-full mt-8"
      disabled={!data.gender || !data.birth_date}
    >
      Continuar
    </VibeButton>
  </div>
);

const Step4: React.FC<{
  data: RegisterStep4;
  onChange: (data: RegisterStep4) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div>
    <h2 className="text-2xl font-bold text-vibe-blue-dark mb-2">
      Crie sua senha
    </h2>
    <p className="text-gray-600 mb-6">
      Escolha uma senha forte para proteger sua conta
    </p>

    <div className="space-y-4">
      <VibeInput
        type="password"
        value={data.password}
        onChange={(value) => onChange({ ...data, password: value })}
        placeholder="Senha"
        required
      />
      
      <VibeInput
        type="password"
        value={data.confirm_password}
        onChange={(value) => onChange({ ...data, confirm_password: value })}
        placeholder="Confirme a senha"
        required
      />
    </div>

    <div className="mt-4 text-xs text-gray-600">
      <p>A senha deve ter:</p>
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Pelo menos 8 caracteres</li>
        <li>Uma letra maiúscula</li>
        <li>Uma letra minúscula</li>
        <li>Um número</li>
      </ul>
    </div>

    <VibeButton
      onClick={onNext}
      loading={loading}
      className="w-full mt-8"
      disabled={!data.password || !data.confirm_password}
    >
      Continuar
    </VibeButton>
  </div>
);

const Step5: React.FC<{
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onShowTerms: () => void;
  onFinish: () => void;
  loading: boolean;
}> = ({ termsAccepted, onTermsChange, onShowTerms, onFinish, loading }) => (
  <div>
    <h2 className="text-2xl font-bold text-vibe-blue-dark mb-2">
      Quase pronto!
    </h2>
    <p className="text-gray-600 mb-6">
      Aceite nossos termos para finalizar
    </p>

    <div className="bg-vibe-light rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-1 w-4 h-4 text-vibe-blue-dark border-gray-300 rounded focus:ring-vibe-blue"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          Eu aceito os{' '}
          <button
            onClick={onShowTerms}
            className="text-vibe-blue-dark underline hover:text-blue-800"
          >
            Termos de Uso e Política de Privacidade
          </button>{' '}
          do Vibe
        </label>
      </div>
    </div>

    <VibeButton
      onClick={onFinish}
      loading={loading}
      className="w-full"
      disabled={!termsAccepted}
    >
      {loading ? 'Criando conta...' : 'Criar conta'}
    </VibeButton>
  </div>
);

export default RegisterScreen;
