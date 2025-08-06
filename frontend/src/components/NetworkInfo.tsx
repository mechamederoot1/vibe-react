import React, { useState } from 'react';

const NetworkInfo: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  // Try to determine the local IP from the current URL
  const currentHost = window.location.hostname;
  const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
  
  if (!isLocalhost) {
    // Already accessing via IP, no need to show info
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Informações de rede"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {showInfo && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">📱 Acesso pelo Celular</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 mb-2">
                Para acessar pelo celular na mesma rede Wi-Fi:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-2">1. Descubra seu IP:</p>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Windows: <code>ipconfig</code></li>
                  <li>• Mac/Linux: <code>ifconfig</code></li>
                  <li>• Ou vá em Configurações → Wi-Fi</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mt-3">
                <p className="font-medium text-blue-800 mb-2">2. Use esta URL no celular:</p>
                <p className="text-blue-700 text-xs font-mono">
                  http://[SEU_IP]:3000
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Exemplo: http://192.168.1.100:3000
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 mt-3">
                <p className="font-medium text-yellow-800 mb-1">⚠️ Certifique-se:</p>
                <ul className="text-yellow-700 text-xs space-y-1">
                  <li>• Backend rodando na porta 8000</li>
                  <li>• Mesma rede Wi-Fi</li>
                  <li>• Firewall não está bloqueando</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkInfo;
