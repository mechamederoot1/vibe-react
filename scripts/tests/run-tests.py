#!/usr/bin/env python3
"""
Test runner for Vibe Social Network
"""

import sys
import os
import subprocess
import json

def run_backend_tests():
    """Run backend API tests"""
    print("🧪 Running Backend Tests...")
    print("-" * 30)
    
    # Change to backend directory
    os.chdir('backend')
    
    try:
        # Test database creation
        print("📊 Testing database creation...")
        result = subprocess.run([
            sys.executable, '-c', 
            'from database.database import create_tables; create_tables(); print("✅ Database creation: PASS")'
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ Database creation: FAIL")
            print(result.stderr)
            return False
        else:
            print(result.stdout.strip())
        
        # Test model imports
        print("📦 Testing model imports...")
        result = subprocess.run([
            sys.executable, '-c', 
            'from models import User, Post, Story, Testimonial; print("✅ Model imports: PASS")'
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ Model imports: FAIL")
            print(result.stderr)
            return False
        else:
            print(result.stdout.strip())
        
        # Test FastAPI import
        print("🚀 Testing FastAPI import...")
        result = subprocess.run([
            sys.executable, '-c', 
            'from main import app; print("✅ FastAPI import: PASS")'
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ FastAPI import: FAIL")
            print(result.stderr)
            return False
        else:
            print(result.stdout.strip())
        
        return True
        
    except Exception as e:
        print(f"❌ Backend tests failed: {e}")
        return False
    
    finally:
        os.chdir('..')

def run_frontend_tests():
    """Run frontend tests"""
    print("\n🎨 Running Frontend Tests...")
    print("-" * 30)
    
    # Change to frontend directory
    if os.path.exists('frontend'):
        os.chdir('frontend')
        
        try:
            # Check if package.json exists
            if os.path.exists('package.json'):
                print("📦 Testing package.json...")
                with open('package.json', 'r') as f:
                    package_data = json.load(f)
                    print(f"✅ Package name: {package_data.get('name', 'unknown')}")
                    print(f"✅ Package version: {package_data.get('version', 'unknown')}")
            
            # Check TypeScript config
            if os.path.exists('tsconfig.json'):
                print("📝 Testing TypeScript config...")
                print("✅ TypeScript config: PASS")
            
            # Check if main source files exist
            required_files = [
                'src/index.tsx',
                'src/App.tsx',
                'src/screens/auth/LoginScreen.tsx',
                'src/screens/auth/RegisterScreen.tsx'
            ]
            
            print("📁 Testing source files...")
            for file in required_files:
                if os.path.exists(file):
                    print(f"✅ {file}: EXISTS")
                else:
                    print(f"❌ {file}: MISSING")
                    return False
            
            return True
            
        except Exception as e:
            print(f"❌ Frontend tests failed: {e}")
            return False
        
        finally:
            os.chdir('..')
    else:
        print("❌ Frontend directory not found")
        return False

def main():
    print("🚀 Vibe Social Network - Test Suite")
    print("=" * 40)
    
    backend_success = run_backend_tests()
    frontend_success = run_frontend_tests()
    
    print("\n📋 Test Summary:")
    print("-" * 20)
    print(f"Backend Tests: {'✅ PASS' if backend_success else '❌ FAIL'}")
    print(f"Frontend Tests: {'✅ PASS' if frontend_success else '❌ FAIL'}")
    
    if backend_success and frontend_success:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print("\n💥 Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
