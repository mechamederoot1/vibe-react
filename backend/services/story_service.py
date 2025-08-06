from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, and_
from datetime import datetime
from models.story import Story
from schemas.story import StoryCreate
from typing import List

class StoryService:
    @staticmethod
    def create_story(db: Session, story_data: StoryCreate, author_id: int) -> Story:
        """Create a new story"""
        new_story = Story(
            content=story_data.content,
            author_id=author_id,
            media_url=story_data.media_url
        )
        
        db.add(new_story)
        db.commit()
        db.refresh(new_story)
        
        return new_story
    
    @staticmethod
    def get_active_stories(db: Session, skip: int = 0, limit: int = 50) -> List[dict]:
        """Get all active (non-expired) stories"""
        current_time = datetime.utcnow()
        
        stories = db.query(Story).options(
            joinedload(Story.author)
        ).filter(
            and_(
                Story.is_active == True,
                Story.expires_at > current_time
            )
        ).order_by(desc(Story.created_at)).offset(skip).limit(limit).all()
        
        active_stories = []
        for story in stories:
            active_stories.append({
                'id': story.id,
                'content': story.content,
                'author_id': story.author_id,
                'author_name': f"{story.author.first_name} {story.author.last_name}",
                'author_avatar': story.author.avatar_url,
                'media_url': story.media_url,
                'is_active': story.is_active,
                'created_at': story.created_at.isoformat(),
                'expires_at': story.expires_at.isoformat()
            })
        
        return active_stories
    
    @staticmethod
    def get_user_stories(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> List[dict]:
        """Get stories by a specific user (including expired ones)"""
        stories = db.query(Story).options(
            joinedload(Story.author)
        ).filter(
            Story.author_id == user_id
        ).order_by(desc(Story.created_at)).offset(skip).limit(limit).all()
        
        user_stories = []
        for story in stories:
            user_stories.append({
                'id': story.id,
                'content': story.content,
                'author_id': story.author_id,
                'author_name': f"{story.author.first_name} {story.author.last_name}",
                'author_avatar': story.author.avatar_url,
                'media_url': story.media_url,
                'is_active': story.is_active,
                'created_at': story.created_at.isoformat(),
                'expires_at': story.expires_at.isoformat()
            })
        
        return user_stories
    
    @staticmethod
    def deactivate_story(db: Session, story_id: int, user_id: int) -> bool:
        """Deactivate a story (only by the author)"""
        story = db.query(Story).filter(
            Story.id == story_id,
            Story.author_id == user_id
        ).first()
        
        if not story:
            return False
        
        story.is_active = False
        db.commit()
        return True
