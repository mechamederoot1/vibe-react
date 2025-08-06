from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class StoryCreate(BaseModel):
    content: str
    media_url: Optional[str] = None
    
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Conteúdo do story não pode estar vazio')
        if len(v) > 500:
            raise ValueError('Story muito longo (máximo 500 caracteres)')
        return v.strip()

class StoryResponse(BaseModel):
    id: int
    content: str
    author_id: int
    author_name: str
    author_avatar: Optional[str]
    media_url: Optional[str]
    is_active: bool
    created_at: str
    expires_at: str
    
    class Config:
        from_attributes = True
