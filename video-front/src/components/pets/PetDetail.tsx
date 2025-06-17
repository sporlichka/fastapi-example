import React, { useEffect, useState } from 'react';
import type { Pet } from './PetCard';
import ActivityList from './ActivityList';
import type { Activity } from './ActivityList';
import ActivityForm from './ActivityForm';
import VaccinationTimeline from './VaccinationTimeline';
import type { Vaccination } from './VaccinationTimeline';
import VaccinationForm from './VaccinationForm';
import {
  getPetActivities,
  createPetActivity,
  deletePetActivity,
  getPetVaccinations,
  createPetVaccination,
  deletePetVaccination,
} from '../../api';

interface PetDetailProps {
  pet: Pet;
  onBack: () => void;
}

const PetDetail: React.FC<PetDetailProps> = ({ pet, onBack }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const [acts, vacs] = await Promise.all([
        getPetActivities(pet.pet_id),
        getPetVaccinations(pet.pet_id),
      ]);
      setActivities(acts);
      setVaccinations(vacs);
    } catch {
      setError('Failed to load details');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, [pet.pet_id]);

  const handleAddActivity = async (activity: { activity_type_id: string; notes?: string }) => {
    setLoading(true);
    setError('');
    try {
      await createPetActivity(pet.pet_id, activity);
      fetchDetails();
      setShowActivityForm(false);
    } catch {
      setError('Failed to add activity');
    }
    setLoading(false);
  };

  const handleDeleteActivity = async (activity_id: string) => {
    setLoading(true);
    setError('');
    try {
      await deletePetActivity(activity_id);
      fetchDetails();
    } catch {
      setError('Failed to delete activity');
    }
    setLoading(false);
  };

  const handleAddVaccination = async (vaccination: { date: string; notes?: string }) => {
    setLoading(true);
    setError('');
    try {
      await createPetVaccination(pet.pet_id, vaccination);
      fetchDetails();
      setShowVaccinationForm(false);
    } catch {
      setError('Failed to add vaccination');
    }
    setLoading(false);
  };

  const handleDeleteVaccination = async (vaccination_id: string) => {
    setLoading(true);
    setError('');
    try {
      await deletePetVaccination(vaccination_id);
      fetchDetails();
    } catch {
      setError('Failed to delete vaccination');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">&larr; Back to pets</button>
      <h2 className="text-2xl font-bold mb-2">{pet.name}</h2>
      <p className="text-gray-700 mb-2">Species: {pet.species}</p>
      <p className="text-gray-700 mb-4">Age: {pet.age} years</p>
      {error && <div className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Activities</h3>
              <button onClick={() => setShowActivityForm(v => !v)} className="text-blue-500 hover:underline text-sm">{showActivityForm ? 'Cancel' : 'Add Activity'}</button>
            </div>
            {showActivityForm && (
              <ActivityForm onSave={handleAddActivity} onCancel={() => setShowActivityForm(false)} loading={loading} />
            )}
            <ActivityList activities={activities} onDelete={handleDeleteActivity} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Vaccinations</h3>
              <button onClick={() => setShowVaccinationForm(v => !v)} className="text-blue-500 hover:underline text-sm">{showVaccinationForm ? 'Cancel' : 'Add Vaccination'}</button>
            </div>
            {showVaccinationForm && (
              <VaccinationForm onSave={handleAddVaccination} onCancel={() => setShowVaccinationForm(false)} loading={loading} />
            )}
            <VaccinationTimeline vaccinations={vaccinations} onDelete={handleDeleteVaccination} />
          </div>
        </>
      )}
    </div>
  );
};

export default PetDetail; 