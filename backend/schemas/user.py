from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import date

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_photo_url: Optional[str] = None
    
    @validator('bio')
    def validate_bio(cls, v):
        if v and len(v) > 500:
            raise ValueError('Bio muito longa (máximo 500 caracteres)')
        return v

class UserProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    gender: str
    birth_date: date
    avatar_url: Optional[str] = None
    cover_photo_url: Optional[str] = None
    bio: Optional[str] = None
    is_verified: bool
    created_at: str
    posts_count: int = 0
    testimonials_count: int = 0
    
    class Config:
        from_attributes = True
