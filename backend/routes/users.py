from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.user import UserUpdate, UserProfileResponse
from services.user_service import UserService
from services.auth_service import AuthService
from utils.auth import verify_token
from typing import List

router = APIRouter()
security = HTTPBearer()

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user ID"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        email = verify_token(credentials.credentials, credentials_exception)
        user = AuthService.get_user_by_email(db, email)
        if user is None:
            raise credentials_exception
        return user.id
    except Exception:
        raise credentials_exception

@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get current user profile"""
    profile = UserService.get_user_profile(db, current_user_id)
    return profile

@router.put("/me", response_model=UserProfileResponse)
async def update_my_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Update current user profile"""
    UserService.update_user_profile(db, current_user_id, user_data)
    profile = UserService.get_user_profile(db, current_user_id)
    return profile

@router.get("/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get specific user profile"""
    profile = UserService.get_user_profile(db, user_id)
    return profile

@router.get("/search", response_model=List[dict])
async def search_users(
    q: str = Query(..., min_length=2, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Search users"""
    users = UserService.search_users(db, q, skip, limit)
    return users
