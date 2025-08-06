from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User
from schemas.auth import UserRegisterFinal, UserLogin
from utils.auth import get_password_hash, verify_password, create_access_token
from datetime import timedelta

class AuthService:
    @staticmethod
    def register_user(db: Session, user_data: UserRegisterFinal) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já está em uso"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)

        # Convert birth_date string to date object if needed
        from datetime import datetime
        if isinstance(user_data.birth_date, str):
            birth_date = datetime.strptime(user_data.birth_date, '%Y-%m-%d').date()
        else:
            birth_date = user_data.birth_date

        new_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            password_hash=hashed_password,
            gender=user_data.gender,
            birth_date=birth_date,
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate user login"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Conta desativada"
            )
        
        return user
    
    @staticmethod
    def create_user_token(user: User) -> str:
        """Create access token for user"""
        access_token_expires = timedelta(minutes=30 * 24 * 60)  # 30 days
        access_token = create_access_token(
            data={"sub": user.email}, 
            expires_delta=access_token_expires
        )
        return access_token
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
