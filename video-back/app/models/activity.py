import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class ActivityType(Base):
    __tablename__ = "activity_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    is_default = Column(Boolean, default=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # null for default

    activities = relationship("ActivityLog", back_populates="activity_type")
    owner = relationship("User", back_populates="activity_types", foreign_keys=[owner_id])

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    pet_id = Column(UUID(as_uuid=True), ForeignKey("pets.id"), nullable=False)
    activity_type_id = Column(UUID(as_uuid=True), ForeignKey("activity_types.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    pet = relationship("Pet", back_populates="activities")
    activity_type = relationship("ActivityType", back_populates="activities") 