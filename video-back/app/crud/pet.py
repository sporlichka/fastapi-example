import uuid
from sqlalchemy.orm import Session
from app.models.pet import Pet
from app.schemas.pet import PetCreate, PetUpdate
from typing import List, Optional

def create_pet(db: Session, owner_id: uuid.UUID, pet: PetCreate) -> Pet:
    db_pet = Pet(**pet.model_dump(), owner_id=owner_id)
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet

def get_pet(db: Session, pet_id: uuid.UUID) -> Optional[Pet]:
    return db.query(Pet).filter(Pet.id == pet_id).first()

def get_pets_by_owner(db: Session, owner_id: uuid.UUID) -> List[Pet]:
    return db.query(Pet).filter(Pet.owner_id == owner_id).all()

def update_pet(db: Session, pet_id: uuid.UUID, pet: PetUpdate) -> Optional[Pet]:
    db_pet = get_pet(db, pet_id)
    if not db_pet:
        return None
    update_data = pet.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_pet, field, value)
    db.commit()
    db.refresh(db_pet)
    return db_pet

def delete_pet(db: Session, pet_id: uuid.UUID) -> bool:
    db_pet = get_pet(db, pet_id)
    if not db_pet:
        return False
    db.delete(db_pet)
    db.commit()
    return True 