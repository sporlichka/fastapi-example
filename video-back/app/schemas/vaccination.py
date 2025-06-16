import uuid
from datetime import date, datetime
from pydantic import BaseModel
from typing import Optional

class VaccinationBase(BaseModel):
    date: date
    notes: Optional[str] = None

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationOut(VaccinationBase):
    id: uuid.UUID
    pet_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True 