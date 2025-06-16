import uuid
from sqlalchemy.orm import Session
from app.models.activity import ActivityType, ActivityLog
from app.schemas.activity import ActivityTypeCreate, ActivityLogCreate, ActivityLogUpdate
from typing import List, Optional

def create_activity_type(db: Session, name: str, is_default: bool, owner_id: Optional[uuid.UUID] = None) -> ActivityType:
    db_type = ActivityType(name=name, is_default=is_default, owner_id=owner_id)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

def get_activity_types(db: Session, owner_id: Optional[uuid.UUID] = None) -> List[ActivityType]:
    # Return all default types and user-defined types for this user
    query = db.query(ActivityType).filter(
        (ActivityType.is_default == True) | (ActivityType.owner_id == owner_id)
    )
    return query.all()

def get_activity_type_by_id(db: Session, type_id: uuid.UUID) -> Optional[ActivityType]:
    return db.query(ActivityType).filter(ActivityType.id == type_id).first()

def create_activity_log(db: Session, log: ActivityLogCreate) -> ActivityLog:
    db_log = ActivityLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_activity_logs_by_pet(db: Session, pet_id: uuid.UUID) -> List[ActivityLog]:
    return db.query(ActivityLog).filter(ActivityLog.pet_id == pet_id).all()

def update_activity_log(db: Session, log_id: uuid.UUID, log: ActivityLogUpdate) -> Optional[ActivityLog]:
    db_log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    if not db_log:
        return None
    update_data = log.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_log, field, value)
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_activity_log(db: Session, log_id: uuid.UUID) -> bool:
    db_log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    if not db_log:
        return False
    db.delete(db_log)
    db.commit()
    return True 