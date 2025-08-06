from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from models.user import User
from models.post import Post
from models.testimonial import Testimonial
from schemas.user import UserUpdate
from typing import Optional

class UserService:
    @staticmethod
    def get_user_profile(db: Session, user_id: int) -> dict:
        """Get complete user profile with stats"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        # Get post count
        posts_count = db.query(func.count(Post.id)).filter(Post.author_id == user_id).scalar()
        
        # Get testimonials received count
        testimonials_count = db.query(func.count(Testimonial.id)).filter(
            Testimonial.target_user_id == user_id
        ).scalar()
        
        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'gender': user.gender,
            'birth_date': user.birth_date,
            'avatar_url': user.avatar_url,
            'cover_photo_url': user.cover_photo_url,
            'bio': user.bio,
            'is_verified': user.is_verified,
            'created_at': user.created_at.isoformat(),
            'posts_count': posts_count,
            'testimonials_count': testimonials_count
        }
    
    @staticmethod
    def update_user_profile(db: Session, user_id: int, user_data: UserUpdate) -> User:
        """Update user profile"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        # Update only provided fields
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def search_users(db: Session, query: str, skip: int = 0, limit: int = 20) -> list:
        """Search users by name or email"""
        users = db.query(User).filter(
            db.or_(
                User.first_name.ilike(f"%{query}%"),
                User.last_name.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%")
            )
        ).offset(skip).limit(limit).all()
        
        return [
            {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'avatar_url': user.avatar_url,
                'is_verified': user.is_verified
            }
            for user in users
        ]
