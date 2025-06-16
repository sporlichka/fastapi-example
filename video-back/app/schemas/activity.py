import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class ActivityTypeBase(BaseModel):
    name: str
    is_default: bool = False

class ActivityTypeCreate(ActivityTypeBase):
    pass

class ActivityTypeOut(ActivityTypeBase):
    id: uuid.UUID
    owner_id: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True

class ActivityLogBase(BaseModel):
    pet_id: uuid.UUID
    activity_type_id: uuid.UUID
    completed: bool = False
    notes: Optional[str] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogUpdate(BaseModel):
    completed: Optional[bool] = None
    notes: Optional[str] = None

class ActivityLogOut(ActivityLogBase):
    id: uuid.UUID
    timestamp: datetime

    class Config:
        from_attributes = True 