import React, { useState } from 'react';
import type { Pet } from './PetCard';

interface PetFormProps {
  initialPet?: Partial<Pet>;
  onSave: (pet: Omit<Pet, 'pet_id'> & { breed: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PetForm: React.FC<PetFormProps> = ({ initialPet = {}, onSave, onCancel, loading }) => {
  const [name, setName] = useState(initialPet.name || '');
  const [species, setSpecies] = useState(initialPet.species || '');
  const [age, setAge] = useState(initialPet.age || 0);
  const [breed, setBreed] = useState((initialPet as any).breed || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, species, age, breed });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Species</label>
        <input
          type="text"
          value={species}
          onChange={e => setSpecies(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Breed</label>
        <input
          type="text"
          value={breed}
          onChange={e => setBreed(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mt-1"
          min={0}
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={loading}>Save</button>
        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
    </form>
  );
};

export default PetForm; 