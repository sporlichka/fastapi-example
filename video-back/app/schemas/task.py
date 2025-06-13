import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class TaskBase(BaseModel):
    text: str = Field(...)
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    text: str | None = None
    is_completed: bool | None = None

class TaskOut(TaskBase):
    task_id: uuid.UUID
    created_at: datetime
    owner_id: uuid.UUID

    class Config:
        from_attributes = True 