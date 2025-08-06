#!/bin/bash

echo "🚀 Vibe Social Network - Project Setup"
echo "======================================"

# Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/maintenance/*.py
chmod +x scripts/tests/*.py

echo "🔧 Setting up Backend..."
echo "------------------------"

# Setup backend
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "📥 Installing backend dependencies..."
pip install -r requirements.txt

# Create database
echo "🗃️  Setting up database..."
python -c "from database.database import create_tables; create_tables(); print('✅ Database created successfully!')"

cd ..

echo ""
echo "🎨 Setting up Frontend..."
echo "-------------------------"

# Setup frontend
cd frontend

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "🧪 Running Tests..."
echo "-------------------"

# Run tests
python3 scripts/tests/run-tests.py

echo ""
echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the application:"
echo "   Backend:  ./scripts/start-backend.sh"
echo "   Frontend: ./scripts/start-frontend.sh"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
