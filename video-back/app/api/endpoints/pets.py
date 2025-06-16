import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
from app.crud import pet as pet_crud
from app.schemas.pet import PetCreate, PetUpdate, PetOut
from app.database import get_db
from app.api.endpoints.auth import get_current_user
from app.schemas.user import User

router = APIRouter()

UPLOAD_DIR = "app/static/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=PetOut, status_code=status.HTTP_201_CREATED)
def create_pet(
    name: str = Form(...),
    breed: str = Form(...),
    date_of_birth: str = Form(...),
    weight: float = Form(...),
    species: str = Form("dog"),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    avatar_path = None
    if avatar:
        ext = os.path.splitext(avatar.filename)[1]
        avatar_filename = f"{uuid.uuid4()}{ext}"
        avatar_path = os.path.join(UPLOAD_DIR, avatar_filename)
        with open(avatar_path, "wb") as f:
            f.write(avatar.file.read())
    pet_in = PetCreate(
        name=name,
        breed=breed,
        date_of_birth=date_of_birth,
        weight=weight,
        species=species,
        avatar=avatar_path
    )
    return pet_crud.create_pet(db, owner_id=current_user.id, pet=pet_in)

@router.get("/", response_model=List[PetOut])
def get_pets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return pet_crud.get_pets_by_owner(db, owner_id=current_user.id)

@router.get("/{pet_id}", response_model=PetOut)
def get_pet(pet_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pet = pet_crud.get_pet(db, pet_id)
    if not pet or pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet

@router.put("/{pet_id}", response_model=PetOut)
def update_pet(pet_id: uuid.UUID, pet: PetUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_pet = pet_crud.get_pet(db, pet_id)
    if not db_pet or db_pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet_crud.update_pet(db, pet_id, pet)

@router.delete("/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pet(pet_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_pet = pet_crud.get_pet(db, pet_id)
    if not db_pet or db_pet.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Pet not found")
    pet_crud.delete_pet(db, pet_id)
    return None 