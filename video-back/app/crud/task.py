import uuid
from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

def create_task(db: Session, owner_id: uuid.UUID, task: TaskCreate) -> Task:
    db_task = Task(
        text=task.text,
        owner_id=owner_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks_by_owner(db: Session, owner_id: uuid.UUID):
    return db.query(Task).filter(Task.owner_id == owner_id).all()

def get_task(db: Session, task_id: uuid.UUID) -> Task | None:
    return db.query(Task).filter(Task.task_id == task_id).first()

def update_task(db: Session, task_id: uuid.UUID, task_update: TaskUpdate) -> Task | None:
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: uuid.UUID) -> bool:
    db_task = get_task(db, task_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True 