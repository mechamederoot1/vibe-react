from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.story import StoryCreate, StoryResponse
from services.story_service import StoryService
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

@router.post("/", response_model=StoryResponse, status_code=status.HTTP_201_CREATED)
async def create_story(
    story_data: StoryCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new story"""
    story = StoryService.create_story(db, story_data, current_user_id)

    # Get story with author info
    stories = StoryService.get_user_stories(db, current_user_id, skip=0, limit=1)
    if stories:
        return stories[0]

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Erro ao criar story"
    )

@router.get("/active", response_model=List[StoryResponse])
async def get_active_stories(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all active stories"""
    stories = StoryService.get_active_stories(db, skip, limit)
    return stories

@router.get("/user/{user_id}", response_model=List[StoryResponse])
async def get_user_stories(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get stories by specific user"""
    stories = StoryService.get_user_stories(db, user_id, skip, limit)
    return stories

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_story(
    story_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Deactivate a story"""
    success = StoryService.deactivate_story(db, story_id, current_user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story não encontrado ou você não tem permissão"
        )
    return
