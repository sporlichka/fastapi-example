import React, { useState, useEffect } from 'react';
import PetCard from '../components/pets/PetCard';
import type { Pet } from '../components/pets/PetCard';
import PetForm from '../components/pets/PetForm';
import PetDetail from '../components/pets/PetDetail';
import { getPets, createPet, updatePet, deletePet } from '../api';

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const fetchPets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPets();
      setPets(data);
    } catch (err) {
      setError('Failed to load pets');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAdd = () => {
    setEditingPet(null);
    setShowForm(true);
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleDelete = async (pet_id: string | undefined) => {
    if (!pet_id) {
      setError('Invalid pet ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await deletePet(pet_id);
      await fetchPets();
      if (selectedPet?.pet_id === pet_id) setSelectedPet(null);
    } catch {
      setError('Failed to delete pet');
    }
    setLoading(false);
  };

  const handleSave = async (pet: Omit<Pet, 'pet_id'> & { breed: string }) => {
    setLoading(true);
    setError('');
    try {
      if (editingPet) {
        await updatePet(editingPet.pet_id, pet);
        fetchPets();
        setShowForm(false);
        setEditingPet(null);
      } else {
        const created = await createPet(pet);
        await fetchPets();
        // Find the new pet by name/species/breed (since backend returns all pets)
        const newPet = (await getPets()).find(
          (p: Pet) => p.name === pet.name && p.species === pet.species && p.breed === pet.breed
        );
        if (newPet) {
          setEditingPet(newPet);
          setShowForm(true);
          setSelectedPet(null);
        } else {
          setShowForm(false);
          setEditingPet(null);
        }
      }
    } catch {
      setError('Failed to save pet');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Pet</button>
        </div>
        {error && <div className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</div>}
        {showForm && (
          <PetForm
            initialPet={editingPet || undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingPet(null); }}
            loading={loading}
          />
        )}
        {selectedPet ? (
          <PetDetail pet={selectedPet} onBack={() => setSelectedPet(null)} />
        ) : loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-4">
            {pets.map(pet => (
              <PetCard
                key={pet.pet_id}
                pet={pet}
                onSelect={() => setSelectedPet(pet)}
                onEdit={() => handleEdit(pet)}
                onDelete={() => handleDelete(pet.pet_id)}
              />
            ))}
            {pets.length === 0 && (
              <div className="text-center text-gray-500 py-8">No pets yet. Add one above!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage; 