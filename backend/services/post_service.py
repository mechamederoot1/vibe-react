from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from fastapi import HTTPException, status
from models.post import Post
from models.user import User
from models.testimonial import Testimonial
from schemas.post import PostCreate, TestimonialCreate
from typing import List

class PostService:
    @staticmethod
    def create_post(db: Session, post_data: PostCreate, author_id: int) -> Post:
        """Create a new post"""
        new_post = Post(
            content=post_data.content,
            post_type=post_data.post_type,
            author_id=author_id
        )
        
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        
        return new_post
    
    @staticmethod
    def get_feed_posts(db: Session, skip: int = 0, limit: int = 20) -> List[dict]:
        """Get feed posts with author information"""
        posts = db.query(Post).options(
            joinedload(Post.author)
        ).order_by(desc(Post.created_at)).offset(skip).limit(limit).all()
        
        feed_posts = []
        for post in posts:
            feed_posts.append({
                'id': post.id,
                'content': post.content,
                'post_type': post.post_type,
                'author_id': post.author_id,
                'author_name': f"{post.author.first_name} {post.author.last_name}",
                'author_avatar': post.author.avatar_url,
                'created_at': post.created_at.isoformat(),
                'updated_at': post.updated_at.isoformat()
            })
        
        return feed_posts
    
    @staticmethod
    def get_user_posts(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> List[dict]:
        """Get posts by a specific user"""
        posts = db.query(Post).options(
            joinedload(Post.author)
        ).filter(
            Post.author_id == user_id
        ).order_by(desc(Post.created_at)).offset(skip).limit(limit).all()
        
        user_posts = []
        for post in posts:
            user_posts.append({
                'id': post.id,
                'content': post.content,
                'post_type': post.post_type,
                'author_id': post.author_id,
                'author_name': f"{post.author.first_name} {post.author.last_name}",
                'author_avatar': post.author.avatar_url,
                'created_at': post.created_at.isoformat(),
                'updated_at': post.updated_at.isoformat()
            })
        
        return user_posts
    
    @staticmethod
    def delete_post(db: Session, post_id: int, user_id: int) -> bool:
        """Delete a post (only by the author)"""
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.author_id == user_id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post não encontrado ou você não tem permissão"
            )
        
        db.delete(post)
        db.commit()
        return True

class TestimonialService:
    @staticmethod
    def create_testimonial(db: Session, testimonial_data: TestimonialCreate, author_id: int) -> Testimonial:
        """Create a new testimonial"""
        # Check if target user exists
        target_user = db.query(User).filter(User.id == testimonial_data.target_user_id).first()
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário destinatário não encontrado"
            )
        
        new_testimonial = Testimonial(
            content=testimonial_data.content,
            author_id=author_id,
            target_user_id=testimonial_data.target_user_id,
            text_color=testimonial_data.text_color,
            background_color=testimonial_data.background_color,
            font_family=testimonial_data.font_family,
            font_size=testimonial_data.font_size,
            text_shadow=testimonial_data.text_shadow,
            background_gradient=testimonial_data.background_gradient
        )
        
        db.add(new_testimonial)
        db.commit()
        db.refresh(new_testimonial)
        
        return new_testimonial
    
    @staticmethod
    def get_user_testimonials(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> List[dict]:
        """Get testimonials received by a user"""
        testimonials = db.query(Testimonial).options(
            joinedload(Testimonial.author),
            joinedload(Testimonial.target_user)
        ).filter(
            Testimonial.target_user_id == user_id
        ).order_by(desc(Testimonial.created_at)).offset(skip).limit(limit).all()
        
        user_testimonials = []
        for testimonial in testimonials:
            user_testimonials.append({
                'id': testimonial.id,
                'content': testimonial.content,
                'author_id': testimonial.author_id,
                'target_user_id': testimonial.target_user_id,
                'author_name': f"{testimonial.author.first_name} {testimonial.author.last_name}",
                'target_user_name': f"{testimonial.target_user.first_name} {testimonial.target_user.last_name}",
                'text_color': testimonial.text_color,
                'background_color': testimonial.background_color,
                'font_family': testimonial.font_family,
                'font_size': testimonial.font_size,
                'text_shadow': testimonial.text_shadow,
                'background_gradient': testimonial.background_gradient,
                'created_at': testimonial.created_at.isoformat()
            })
        
        return user_testimonials
