from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    username = Column(String(30), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    gender = Column(String(20), nullable=False)  # masculino, feminino, outro
    birth_date = Column(Date, nullable=False)
    avatar_url = Column(String(255), nullable=True)
    cover_photo_url = Column(String(255), nullable=True)
    bio = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    posts = relationship("Post", back_populates="author")
    stories = relationship("Story", back_populates="author")
    testimonials_given = relationship("Testimonial", foreign_keys="Testimonial.author_id", back_populates="author")
    testimonials_received = relationship("Testimonial", foreign_keys="Testimonial.target_user_id", back_populates="target_user")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.full_name}')>"
