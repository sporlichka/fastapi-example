import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.crud import activity as activity_crud
from app.crud import pet as pet_crud
from app.schemas.activity import (
    ActivityTypeCreate, ActivityTypeOut,
    ActivityLogCreate, ActivityLogUpdate, ActivityLogOut
)
from app.database import get_db, SessionLocal
from app.api.endpoints.auth import get_current_user
from app.schemas.user import User

router = APIRouter()

DEFAULT_ACTIVITIES = ["Feeding", "Drinking", "Walking", "Training", "Bathing"]

@router.on_event("startup")
async def add_default_activities():
    db = SessionLocal()
    try:
        for name in DEFAULT_ACTIVITIES:
            exists = db.query(activity_crud.ActivityType).filter_by(name=name, is_default=True).first()
            if not exists:
                activity_crud.create_activity_type(db, name=name, is_default=True)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error creating default activities: {e}")
    finally:
        db.close()

@router.get("/types", response_model=List[ActivityTypeOut])
def get_activity_types(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return activity_crud.get_activity_types(db, owner_id=current_user.id)

@router.post("/types", response_model=ActivityTypeOut, status_code=status.HTTP_201_CREATED)
def create_activity_type(activity_type: ActivityTypeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return activity_crud.create_activity_type(db, name=activity_type.name, is_default=False, owner_id=current_user.id)

@router.post("/log", response_model=ActivityLogOut, status_code=status.HTTP_201_CREATED)
def create_activity_log(log: ActivityLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = pet_crud.get_pet(db, log.pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    return activity_crud.create_activity_log(db, log)

@router.get("/log/{pet_id}", response_model=List[ActivityLogOut])
def get_activity_logs_by_pet(pet_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = pet_crud.get_pet(db, pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    return activity_crud.get_activity_logs_by_pet(db, pet_id)

@router.put("/log/{log_id}", response_model=ActivityLogOut)
def update_activity_log(log_id: uuid.UUID, log: ActivityLogUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_log = db.query(activity_crud.ActivityLog).filter_by(id=log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Activity log not found")
    pet = pet_crud.get_pet(db, db_log.pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return activity_crud.update_activity_log(db, log_id, log)

@router.delete("/log/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity_log(log_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_log = db.query(activity_crud.ActivityLog).filter_by(id=log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Activity log not found")
    pet = pet_crud.get_pet(db, db_log.pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    activity_crud.delete_activity_log(db, log_id)
    return None 