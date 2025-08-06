import React from 'react';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-vibe-blue-dark">
            Termos de Uso e Privacidade
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-vibe-blue-dark mb-3">
                Termos de Uso
              </h3>
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  Ao usar a plataforma Vibe, você concorda com estes termos de uso. 
                  Se não concordar, não use nossos serviços.
                </p>
                <p>
                  <strong>Uso Aceitável:</strong> Você concorda em não postar conteúdo 
                  ilegal, abusivo ou ofensivo, não assediar outros usuários e não 
                  tentar acessar contas de terceiros.
                </p>
                <p>
                  <strong>Conta de Usuário:</strong> Você deve ter pelo menos 13 anos, 
                  fornecer informações verdadeiras e manter sua senha segura.
                </p>
                <p>
                  <strong>Conteúdo:</strong> Você mantém os direitos sobre seu conteúdo, 
                  mas nos concede licença para usá-lo na plataforma.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-vibe-blue-dark mb-3">
                Política de Privacidade
              </h3>
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  <strong>Informações Coletadas:</strong> Coletamos nome, e-mail, 
                  data de nascimento, gênero, conteúdo que você publica e informações 
                  de uso da plataforma.
                </p>
                <p>
                  <strong>Uso das Informações:</strong> Usamos suas informações para 
                  fornecer nossos serviços, personalizar sua experiência e garantir 
                  a segurança da plataforma.
                </p>
                <p>
                  <strong>Compartilhamento:</strong> Não vendemos suas informações pessoais. 
                  Compartilhamos apenas com seu consentimento ou para cumprir obrigações legais.
                </p>
                <p>
                  <strong>Segurança:</strong> Implementamos medidas de segurança apropriadas 
                  para proteger suas informações, incluindo criptografia e acesso restrito.
                </p>
                <p>
                  <strong>Seus Direitos:</strong> Você pode acessar, corrigir ou excluir 
                  suas informações pessoais a qualquer momento.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-vibe-blue-dark mb-3">
                Contato
              </h3>
              <div className="text-sm text-gray-700">
                <p>
                  Para questões sobre estes termos ou privacidade, entre em contato:
                </p>
                <p className="mt-2">
                  E-mail: legal@vibe.social<br />
                  Privacidade: privacy@vibe.social
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full bg-vibe-blue-dark text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
