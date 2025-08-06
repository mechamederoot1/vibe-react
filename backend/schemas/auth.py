from pydantic import BaseModel, EmailStr, validator
from datetime import date
from typing import Optional

class UserRegisterStep1(BaseModel):
    first_name: str
    last_name: str
    
    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Nome deve ter pelo menos 2 caracteres')
        return v.strip().title()

class UserRegisterStep2(BaseModel):
    email: EmailStr
    
class UserRegisterStep3(BaseModel):
    gender: str
    birth_date: date
    
    @validator('gender')
    def validate_gender(cls, v):
        if v not in ['masculino', 'feminino', 'outro']:
            raise ValueError('Gênero deve ser: masculino, feminino ou outro')
        return v
    
    @validator('birth_date')
    def validate_birth_date(cls, v):
        from datetime import date, timedelta
        today = date.today()
        min_age_date = today - timedelta(days=13*365)
        if v > min_age_date:
            raise ValueError('Você deve ter pelo menos 13 anos')
        return v

class UserRegisterStep4(BaseModel):
    password: str
    confirm_password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Senha deve ter pelo menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('Senha deve ter pelo menos uma letra maiúscula')
        if not any(c.islower() for c in v):
            raise ValueError('Senha deve ter pelo menos uma letra minúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('Senha deve ter pelo menos um número')
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Senhas não coincidem')
        return v

class UserRegisterFinal(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    gender: str
    birth_date: date
    password: str
    terms_accepted: bool
    
    @validator('terms_accepted')
    def validate_terms(cls, v):
        if not v:
            raise ValueError('Você deve aceitar os termos de uso')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    gender: str
    birth_date: date
    avatar_url: Optional[str] = None
    cover_photo_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
