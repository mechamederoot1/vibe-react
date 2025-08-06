#!/usr/bin/env python3
"""
Database migration script for Vibe Social Network
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from database.database import create_tables, engine
from models import User, Post, Story, Testimonial
import sqlite3

def check_database_exists():
    """Check if database file exists"""
    db_path = "backend/vibe.db"
    return os.path.exists(db_path)

def create_database():
    """Create all database tables"""
    print("🗃️  Creating database tables...")
    try:
        create_tables()
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

def show_table_info():
    """Show information about database tables"""
    try:
        conn = sqlite3.connect("backend/vibe.db")
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\n📊 Database Tables:")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  - {table_name}: {count} records")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error reading database: {e}")

def main():
    print("🚀 Vibe Database Migration Tool")
    print("=" * 40)
    
    if not check_database_exists():
        print("📝 Database doesn't exist. Creating new database...")
        if create_database():
            show_table_info()
        else:
            sys.exit(1)
    else:
        print("📋 Database already exists.")
        show_table_info()
        
        # Ask if user wants to recreate
        response = input("\n🔄 Do you want to recreate the database? (y/N): ")
        if response.lower() in ['y', 'yes']:
            # Remove existing database
            os.remove("backend/vibe.db")
            print("🗑️  Removed existing database.")
            
            if create_database():
                show_table_info()
            else:
                sys.exit(1)
    
    print("\n✨ Migration complete!")

if __name__ == "__main__":
    main()
