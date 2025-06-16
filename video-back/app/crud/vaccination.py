import uuid
from sqlalchemy.orm import Session
from app.models.vaccination import Vaccination
from app.schemas.vaccination import VaccinationCreate
from typing import List, Optional

def create_vaccination(db: Session, pet_id: uuid.UUID, vaccination: VaccinationCreate) -> Vaccination:
    db_vacc = Vaccination(**vaccination.model_dump(), pet_id=pet_id)
    db.add(db_vacc)
    db.commit()
    db.refresh(db_vacc)
    return db_vacc

def get_vaccinations_by_pet(db: Session, pet_id: uuid.UUID) -> List[Vaccination]:
    return db.query(Vaccination).filter(Vaccination.pet_id == pet_id).all()

def get_vaccination(db: Session, vaccination_id: uuid.UUID) -> Optional[Vaccination]:
    return db.query(Vaccination).filter(Vaccination.id == vaccination_id).first()

def delete_vaccination(db: Session, vaccination_id: uuid.UUID) -> bool:
    db_vacc = get_vaccination(db, vaccination_id)
    if not db_vacc:
        return False
    db.delete(db_vacc)
    db.commit()
    return True 