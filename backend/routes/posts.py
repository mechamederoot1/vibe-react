from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.post import PostCreate, PostResponse, TestimonialCreate, TestimonialResponse
from services.post_service import PostService, TestimonialService
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

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new post"""
    post = PostService.create_post(db, post_data, current_user_id)

    # Get post with author info
    post_with_author = PostService.get_feed_posts(db, skip=0, limit=1)
    if post_with_author:
        return post_with_author[0]

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Erro ao criar post"
    )

@router.get("/feed", response_model=List[PostResponse])
async def get_feed(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get feed posts"""
    posts = PostService.get_feed_posts(db, skip, limit)
    return posts

@router.get("/user/{user_id}", response_model=List[PostResponse])
async def get_user_posts(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get posts by specific user"""
    posts = PostService.get_user_posts(db, user_id, skip, limit)
    return posts

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Delete a post"""
    PostService.delete_post(db, post_id, current_user_id)
    return

@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Create a new testimonial"""
    testimonial = TestimonialService.create_testimonial(db, testimonial_data, current_user_id)

    # Get testimonial with author info
    testimonials = TestimonialService.get_user_testimonials(db, testimonial.target_user_id, skip=0, limit=1)
    if testimonials:
        return testimonials[0]

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Erro ao criar depoimento"
    )

@router.get("/testimonials/{user_id}", response_model=List[TestimonialResponse])
async def get_user_testimonials(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get testimonials for a specific user"""
    testimonials = TestimonialService.get_user_testimonials(db, user_id, skip, limit)
    return testimonials
