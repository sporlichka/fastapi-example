import uuid
from sqlalchemy import Column, String, Date, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Pet(Base):
    __tablename__ = "pets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    breed = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    weight = Column(Float, nullable=False)
    species = Column(String, nullable=False, default="dog")
    avatar = Column(String, nullable=True)  # file path or URL
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="pets")
    vaccinations = relationship("Vaccination", back_populates="pet")
    activities = relationship("ActivityLog", back_populates="pet") 