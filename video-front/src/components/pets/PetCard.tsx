import React from 'react';

export interface Pet {
  pet_id: string;
  name: string;
  species: string;
  age: number;
  breed: string;
}

interface PetCardProps {
  pet: Pet;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onSelect, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100 hover:shadow-lg transition-all">
    <div className="flex justify-between items-center">
      <div onClick={onSelect} className="cursor-pointer flex-1">
        <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
        <p className="text-gray-600">{pet.species} • {pet.breed} • {pet.age} years old</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">Edit</button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">Delete</button>
      </div>
    </div>
  </div>
);

export default PetCard; 