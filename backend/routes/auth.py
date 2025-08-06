from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.auth import (
    UserRegisterFinal, UserLogin, Token, UserResponse,
    UserRegisterStep1, UserRegisterStep2, UserRegisterStep3, UserRegisterStep4
)
from services.auth_service import AuthService
from utils.auth import verify_token

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegisterFinal,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        # Register user
        user = AuthService.register_user(db, user_data)
        
        # Create token
        access_token = AuthService.create_user_token(user)
        
        # Format user response
        user_response = UserResponse(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            gender=user.gender,
            birth_date=user.birth_date,
            avatar_url=user.avatar_url,
            cover_photo_url=user.cover_photo_url,
            bio=user.bio,
            created_at=user.created_at.isoformat()
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Login user"""
    try:
        # Authenticate user
        user = AuthService.authenticate_user(
            db, 
            user_credentials.email, 
            user_credentials.password
        )
        
        # Create token
        access_token = AuthService.create_user_token(user)
        
        # Format user response
        user_response = UserResponse(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            gender=user.gender,
            birth_date=user.birth_date,
            avatar_url=user.avatar_url,
            cover_photo_url=user.cover_photo_url,
            bio=user.bio,
            created_at=user.created_at.isoformat()
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@router.post("/validate-step1")
async def validate_step1(data: UserRegisterStep1):
    """Validate registration step 1 - Names"""
    return {"message": "Nomes válidos", "data": data}

@router.post("/validate-step2")
async def validate_step2(data: UserRegisterStep2, db: Session = Depends(get_db)):
    """Validate registration step 2 - Email"""
    # Check if email already exists
    existing_user = AuthService.get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já está em uso"
        )
    return {"message": "Email válido", "data": data}

@router.post("/validate-step3")
async def validate_step3(data: UserRegisterStep3):
    """Validate registration step 3 - Gender and Birth Date"""
    print(f"DEBUG - Dados recebidos no step 3: {data}")
    return {"message": "Dados válidos", "data": data}

@router.post("/validate-step4")
async def validate_step4(data: UserRegisterStep4):
    """Validate registration step 4 - Password"""
    return {"message": "Senha válida", "data": data}

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify token
        email = verify_token(credentials.credentials, credentials_exception)
        
        # Get user
        user = AuthService.get_user_by_email(db, email)
        if user is None:
            raise credentials_exception
        
        return UserResponse(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            gender=user.gender,
            birth_date=user.birth_date,
            avatar_url=user.avatar_url,
            cover_photo_url=user.cover_photo_url,
            bio=user.bio,
            created_at=user.created_at.isoformat()
        )
    
    except HTTPException:
        raise
    except Exception:
        raise credentials_exception
