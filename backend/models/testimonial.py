from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Styling options
    text_color = Column(String(7), default="#000000")  # Hex color
    background_color = Column(String(7), default="#FFFFFF")  # Hex color
    font_family = Column(String(50), default="system-ui")
    font_size = Column(Integer, default=16)
    text_shadow = Column(String(100), nullable=True)  # CSS text-shadow value
    background_gradient = Column(String(255), nullable=True)  # CSS gradient
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    author = relationship("User", foreign_keys=[author_id], back_populates="testimonials_given")
    target_user = relationship("User", foreign_keys=[target_user_id], back_populates="testimonials_received")
    
    def __repr__(self):
        return f"<Testimonial(id={self.id}, author_id={self.author_id}, target_user_id={self.target_user_id})>"
