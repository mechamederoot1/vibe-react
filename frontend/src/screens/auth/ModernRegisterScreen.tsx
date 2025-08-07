import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData, RegisterStep1, RegisterStep2, RegisterStep3, RegisterStep4 } from '../../types/auth';
import { authService } from '../../services/authService';
import TermsModal from '../../components/TermsModal';

const ModernRegisterScreen: React.FC = () => {
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
          console.log('DEBUG - Enviando dados step3:', step3Data);
          if (!step3Data.gender || !step3Data.birth_date) {
            throw new Error('Preencha todos os campos obrigatórios');
          }
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-none px-6 py-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          {currentStep > 1 ? (
            <button
              onClick={goBack}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-12 h-12"></div>
          )}

          <div className="text-center">
            <h1 className="text-3xl font-light text-blue-500 tracking-wider">
              vibe
            </h1>
            <div className="w-12 h-0.5 bg-blue-500 mx-auto mt-1 rounded-full"></div>
          </div>

          <div className="w-12 h-12"></div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <p className="text-center text-base text-gray-600 font-medium">
          Etapa {currentStep} de 5
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 animate-fade-in">
              <p className="text-red-600 text-base text-center">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
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
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none px-6 py-6 bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-base text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:text-blue-600 text-lg"
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

// Modern Step Components
const Step1: React.FC<{
  data: RegisterStep1;
  onChange: (data: RegisterStep1) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Como você se chama?
      </h2>
      <p className="text-gray-600 text-lg">
        Vamos começar com seu nome
      </p>
    </div>

    <div className="space-y-6">
      <input
        type="text"
        value={data.first_name}
        onChange={(e) => onChange({ ...data, first_name: e.target.value })}
        placeholder="Nome"
        className="ig-input text-lg py-4"
        required
      />

      <input
        type="text"
        value={data.last_name}
        onChange={(e) => onChange({ ...data, last_name: e.target.value })}
        placeholder="Sobrenome"
        className="ig-input text-lg py-4"
        required
      />
    </div>

    <button
      onClick={onNext}
      disabled={!data.first_name.trim() || !data.last_name.trim() || loading}
      className="ig-button ig-button-primary w-full py-4 text-lg font-semibold disabled:opacity-50"
    >
      {loading ? 'Validando...' : 'Continuar'}
    </button>
  </div>
);

const Step2: React.FC<{
  data: RegisterStep2;
  onChange: (data: RegisterStep2) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Qual seu e-mail?
      </h2>
      <p className="text-gray-600 text-lg">
        Usaremos para entrar em contato e para login
      </p>
    </div>

    <input
      type="email"
      value={data.email}
      onChange={(e) => onChange({ ...data, email: e.target.value })}
      placeholder="seu@email.com"
      className="ig-input text-lg py-4"
      required
    />

    <button
      onClick={onNext}
      disabled={!data.email.trim() || loading}
      className="ig-button ig-button-primary w-full py-4 text-lg font-semibold disabled:opacity-50"
    >
      {loading ? 'Verificando...' : 'Continuar'}
    </button>
  </div>
);

const Step3: React.FC<{
  data: RegisterStep3;
  onChange: (data: RegisterStep3) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Sobre você
      </h2>
      <p className="text-gray-600">
        Precisamos de algumas informações básicas
      </p>
    </div>

    <div className="space-y-4">
      <select
        value={data.gender}
        onChange={(e) => onChange({ ...data, gender: e.target.value })}
        className="ig-input appearance-none"
        required
      >
        <option value="">Selecione seu gênero</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="outro">Outro</option>
      </select>
      
      <input
        type="date"
        value={data.birth_date}
        onChange={(e) => onChange({ ...data, birth_date: e.target.value })}
        className="ig-input"
        required
      />
    </div>

    <button
      onClick={onNext}
      disabled={!data.gender || !data.birth_date || loading}
      className="ig-button ig-button-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
    >
      {loading ? 'Validando...' : 'Continuar'}
    </button>
  </div>
);

const Step4: React.FC<{
  data: RegisterStep4;
  onChange: (data: RegisterStep4) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ data, onChange, onNext, loading }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Crie sua senha
      </h2>
      <p className="text-gray-600">
        Escolha uma senha forte para proteger sua conta
      </p>
    </div>

    <div className="space-y-4">
      <input
        type="password"
        value={data.password}
        onChange={(e) => onChange({ ...data, password: e.target.value })}
        placeholder="Senha"
        className="ig-input"
        required
      />
      
      <input
        type="password"
        value={data.confirm_password}
        onChange={(e) => onChange({ ...data, confirm_password: e.target.value })}
        placeholder="Confirme a senha"
        className="ig-input"
        required
      />
    </div>

    <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
      <p className="font-medium mb-2">A senha deve ter:</p>
      <ul className="space-y-1">
        <li>• Pelo menos 8 caracteres</li>
        <li>• Uma letra maiúscula</li>
        <li>• Uma letra minúscula</li>
        <li>• Um número</li>
      </ul>
    </div>

    <button
      onClick={onNext}
      disabled={!data.password || !data.confirm_password || loading}
      className="ig-button ig-button-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
    >
      {loading ? 'Validando...' : 'Continuar'}
    </button>
  </div>
);

const Step5: React.FC<{
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  onShowTerms: () => void;
  onFinish: () => void;
  loading: boolean;
}> = ({ termsAccepted, onTermsChange, onShowTerms, onFinish, loading }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Quase pronto!
      </h2>
      <p className="text-gray-600">
        Aceite nossos termos para finalizar
      </p>
    </div>

    <div className="bg-gray-50 rounded-lg p-4">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          Eu aceito os{' '}
          <button
            onClick={onShowTerms}
            className="text-blue-500 underline hover:text-blue-600"
          >
            Termos de Uso e Política de Privacidade
          </button>{' '}
          do Vibe
        </span>
      </label>
    </div>

    <button
      onClick={onFinish}
      disabled={!termsAccepted || loading}
      className="ig-button ig-button-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Criando conta...
        </div>
      ) : (
        'Criar conta'
      )}
    </button>

    <div className="text-center">
      <p className="text-xs text-gray-500">
        Ao criar uma conta, você concorda em seguir nossas diretrizes da comunidade
      </p>
    </div>
  </div>
);

export default ModernRegisterScreen;
