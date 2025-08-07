# Vibe Social Network - React Native App

Uma rede social moderna desenvolvida em React Native com TypeScript.

## 📱 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Login e cadastro
- **Feed de Posts**: Visualização e criação de posts
- **Sistema de Stories**: Criador avançado com editor de texto
- **Perfil de Usuário**: Visualização e edição básica
- **Navegação Nativa**: Stack e Tab navigators
- **Design Responsivo**: Otimizado para smartphones

### 🎨 Editor de Stories Avançado
- **Interface Split-Screen**: Preview + painel de controles
- **Editor de Texto Completo**:
  - Múltiplos textos independentes
  - Arrastar e soltar para posicionar
  - Slider de tamanho da fonte (12-72px)
  - 5 fontes diferentes
  - Cores de texto personalizáveis
  - Fundo do texto (transparente ou colorido)
  - Formatação: Negrito, Itálico, Sublinhado
- **Backgrounds Personalizáveis**:
  - 5 gradientes predefinidos
  - 5 cores sólidas
  - Cor personalizada
- **Interface Nativa**: Componentes otimizados para mobile

### 🔄 Em Desenvolvimento
- Câmera nativa para stories
- Sistema de curtidas e comentários
- Notificações push
- Upload de imagens

## 🚀 Instalação

### Pré-requisitos
- Node.js 16+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### 1. Instalar Dependências
```bash
# Instalar dependências do app
cd mobile
npm install

# Para iOS, instalar pods
cd ios && pod install && cd ..
```

### 2. Configurar Backend
```bash
# Instalar dependências do backend
cd backend
pip install -r requirements.txt

# Iniciar servidor backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Executar o App

#### Android
```bash
cd mobile
npx react-native run-android
```

#### iOS
```bash
cd mobile
npx react-native run-ios
```

### 4. Iniciar Metro Bundler
```bash
cd mobile
npx react-native start
```

## 🔧 Configuração

### API Configuration
Edite `mobile/src/services/api.ts` e configure o IP do seu backend:

```typescript
const API_BASE_URL = 'http://SEU_IP:8000/api';
```

### Android Network Configuration
Para desenvolvimento, adicione no `android/app/src/main/AndroidManifest.xml`:

```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

## 📂 Estrutura do Projeto

```
mobile/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── AdvancedStoryCreator.tsx   # Editor avançado de stories
│   │   ├── PostCard.tsx               # Card de post
│   │   └── StoriesBar.tsx             # Barra de stories
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.tsx           # Contexto de autenticação
│   ├── navigation/         # Navegação
│   │   ├── AppNavigator.tsx          # Navegador principal
│   │   ├── AuthStackNavigator.tsx    # Stack de autenticação
│   │   └── MainTabNavigator.tsx      # Tabs principais
│   ├── screens/           # Telas
│   │   ├── auth/         # Telas de autenticação
│   │   ├── home/         # Tela inicial
│   │   └── profile/      # Telas de perfil
│   ├── services/         # Serviços API
│   ├── styles/           # Estilos e temas
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Utilitários
├── android/              # Código Android nativo
├── ios/                  # Código iOS nativo
└── package.json
```

## 🎨 Design System

### Cores
- **Primary**: #3B82F6 (Azul Vibe)
- **Surface**: #FFFFFF (Branco)
- **Background**: #F9FAFB (Cinza claro)
- **Text**: #111827 (Preto)

### Tipografia
- **Fonte**: Inter (system fallback)
- **Tamanhos**: 12px (caption) a 32px (h1)

### Componentes
- Cards com shadow nativo
- Botões com estados interativos
- Inputs com focus states
- Avatares circulares

## 🔐 Autenticação

O app usa JWT tokens armazenados com AsyncStorage:
- Login automático na inicialização
- Refresh do usuário quando necessário
- Logout com limpeza de dados

## 📱 Stories System

### Funcionalidades Avançadas
- **Multi-touch**: Seleção de textos independentes
- **Drag & Drop**: Posicionamento livre de elementos
- **Real-time Preview**: Visualização em tempo real
- **Responsive Design**: Adaptado para diferentes tamanhos de tela

### Controles
1. **Aba Texto**: Adicionar, editar e deletar textos
2. **Aba Estilo**: Formatação completa (fonte, cor, tamanho, estilo)
3. **Aba Fundo**: Seleção de backgrounds

## 🛠️ Desenvolvimento

### Scripts Principais
```bash
# Executar no Android
npm run android

# Executar no iOS  
npm run ios

# Iniciar Metro
npm start

# Instalar pods (iOS)
npm run pod-install
```

### Debugging
- **Flipper**: Debugging avançado
- **React DevTools**: Debug de componentes
- **Network Inspector**: Monitoramento de API calls

## 🚀 Deploy

### Android
```bash
# Gerar APK de release
cd android
./gradlew assembleRelease
```

### iOS
```bash
# Abrir no Xcode para archive
open ios/VibeApp.xcworkspace
```

## 📄 Licença

ISC License - Vibe Team

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Vibe Social Network** - Conectando pessoas através de tecnologia moderna! 🚀📱
