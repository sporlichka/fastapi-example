import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.crud import vaccination as vaccination_crud
from app.crud import pet as pet_crud
from app.schemas.vaccination import VaccinationCreate, VaccinationOut
from app.database import get_db
from app.api.endpoints.auth import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.post("/{pet_id}", response_model=VaccinationOut, status_code=status.HTTP_201_CREATED)
def add_vaccination(pet_id: uuid.UUID, vaccination: VaccinationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = pet_crud.get_pet(db, pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    return vaccination_crud.create_vaccination(db, pet_id, vaccination)

@router.get("/{pet_id}", response_model=List[VaccinationOut])
def get_vaccinations_by_pet(pet_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = pet_crud.get_pet(db, pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    return vaccination_crud.get_vaccinations_by_pet(db, pet_id)

@router.delete("/delete/{vaccination_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vaccination(vaccination_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vacc = vaccination_crud.get_vaccination(db, vaccination_id)
    if not vacc:
        raise HTTPException(status_code=404, detail="Vaccination not found")
    pet = pet_crud.get_pet(db, vacc.pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    vaccination_crud.delete_vaccination(db, vaccination_id)
    return None 