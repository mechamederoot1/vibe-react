# Vibe Social Network

Uma rede social moderna que combina o melhor do Instagram, Facebook e Orkut.

## Estrutura do Projeto

```
vibe/
├── frontend/          # React Native/Web app
├── backend/           # FastAPI backend
├── shared/            # Arquivos compartilhados
└── scripts/           # Scripts de manutenção e testes
```

## Características

- **Frontend**: React Native com TypeScript e Tailwind CSS
- **Backend**: FastAPI com SQLite
- **Design**: Moderno, cores branco e azul claro
- **Mobile-first**: Otimizado para smartphones

## Como executar

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
