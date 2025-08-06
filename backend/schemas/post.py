from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class PostCreate(BaseModel):
    content: str
    post_type: str = "text"  # text, testimonial
    
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Conteúdo não pode estar vazio')
        if len(v) > 5000:
            raise ValueError('Conteúdo muito longo (máximo 5000 caracteres)')
        return v.strip()
    
    @validator('post_type')
    def validate_post_type(cls, v):
        if v not in ['text', 'testimonial']:
            raise ValueError('Tipo de post deve ser: text ou testimonial')
        return v

class PostResponse(BaseModel):
    id: int
    content: str
    post_type: str
    author_id: int
    author_name: str
    author_avatar: Optional[str]
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

class TestimonialCreate(BaseModel):
    content: str
    target_user_id: int
    text_color: str = "#000000"
    background_color: str = "#FFFFFF"
    font_family: str = "system-ui"
    font_size: int = 16
    text_shadow: Optional[str] = None
    background_gradient: Optional[str] = None
    
    @validator('content')
    def validate_content(cls, v):
        if len(v.strip()) < 1:
            raise ValueError('Conteúdo do depoimento não pode estar vazio')
        if len(v) > 1000:
            raise ValueError('Depoimento muito longo (máximo 1000 caracteres)')
        return v.strip()

class TestimonialResponse(BaseModel):
    id: int
    content: str
    author_id: int
    target_user_id: int
    author_name: str
    target_user_name: str
    text_color: str
    background_color: str
    font_family: str
    font_size: int
    text_shadow: Optional[str]
    background_gradient: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True
