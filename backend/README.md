# Vibe Backend API

FastAPI backend for the Vibe social network.

## Quick Start

### Option 1: Using run.py (Recommended)
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Option 2: Using uvicorn directly
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Using python main.py
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## API Documentation

Once running, visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Database

The SQLite database (`vibe.db`) is automatically created on first run.

## Features

- ✅ User registration and authentication
- ✅ JWT token-based security
- ✅ Password hashing with bcrypt
- ✅ Multi-step registration validation
- ✅ CORS enabled for frontend
- ✅ Automatic database table creation
- ✅ Modern FastAPI with lifespan events
