import uuid
from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional

class PetBase(BaseModel):
    name: str
    breed: str
    date_of_birth: date
    weight: float
    species: str = "dog"
    avatar: Optional[str] = None

class PetCreate(PetBase):
    pass

class PetUpdate(BaseModel):
    name: Optional[str] = None
    breed: Optional[str] = None
    date_of_birth: Optional[date] = None
    weight: Optional[float] = None
    species: Optional[str] = None
    avatar: Optional[str] = None

class PetOut(PetBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 