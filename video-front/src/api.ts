const baseURL = '/api/';

function getToken() {
  return localStorage.getItem('token');
}

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${baseURL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name: email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${baseURL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export async function getTasks() {
  const res = await fetch(`${baseURL}/tasks/`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(text: string) {
  const res = await fetch(`${baseURL}/tasks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id: string, updates: { text?: string; is_completed?: boolean }) {
  const res = await fetch(`${baseURL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetch(`${baseURL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return true;
}

// PETS
export async function getPets() {
  const res = await fetch(`${baseURL}/pets/`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch pets');
  const data = await res.json();
  // Map backend 'id' to frontend 'pet_id'
  return data.map((pet: any) => ({
    pet_id: pet.id,
    name: pet.name,
    species: pet.species,
    age: pet.date_of_birth ? new Date().getFullYear() - new Date(pet.date_of_birth).getFullYear() : 0,
    breed: pet.breed,
    // add other fields if needed
  }));
}

export async function getPet(pet_id: string) {
  const res = await fetch(`${baseURL}/pets/${pet_id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch pet');
  const pet = await res.json();
  return {
    pet_id: pet.id,
    name: pet.name,
    species: pet.species,
    age: pet.date_of_birth ? new Date().getFullYear() - new Date(pet.date_of_birth).getFullYear() : 0,
    breed: pet.breed,
    // add other fields if needed
  };
}

export async function createPet(pet: { name: string; species: string; age: number; breed: string }) {
  const today = new Date();
  const birthYear = today.getFullYear() - pet.age;
  const date_of_birth = `${birthYear}-01-01`;
  const form = new FormData();
  form.append('name', pet.name);
  form.append('species', pet.species);
  form.append('breed', pet.breed);
  form.append('date_of_birth', date_of_birth);
  form.append('weight', '1.0');
  // No avatar upload for now
  const headers = authHeader() as HeadersInit;
  const res = await fetch(`${baseURL}/pets/`, {
    method: 'POST',
    headers,
    body: form,
  });
  if (!res.ok) throw new Error('Failed to create pet');
  return res.json();
}

export async function updatePet(pet_id: string, updates: Partial<{ name: string; species: string; age: number; breed: string }>) {
  // Use FormData to match backend expectations
  const form = new FormData();
  if (updates.name) form.append('name', updates.name);
  if (updates.species) form.append('species', updates.species);
  if (updates.breed) form.append('breed', updates.breed);
  if (updates.age !== undefined) {
    const today = new Date();
    const birthYear = today.getFullYear() - updates.age;
    form.append('date_of_birth', `${birthYear}-01-01`);
  }
  form.append('weight', '1.0');
  const headers = authHeader() as HeadersInit;
  const res = await fetch(`${baseURL}/pets/${pet_id}`, {
    method: 'PUT',
    headers,
    body: form,
  });
  if (!res.ok) throw new Error('Failed to update pet');
  return res.json();
}

export async function deletePet(pet_id: string) {
  const res = await fetch(`${baseURL}/pets/${pet_id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete pet');
  return true;
}

// ACTIVITIES
export async function getPetActivities(pet_id: string) {
  // Fetch logs and types in parallel
  const [logsRes, typesRes] = await Promise.all([
    fetch(`${baseURL}/activities/log/${pet_id}`, { headers: { ...authHeader() } }),
    fetch(`${baseURL}/activities/types`, { headers: { ...authHeader() } })
  ]);
  if (!logsRes.ok) throw new Error('Failed to fetch activities');
  if (!typesRes.ok) throw new Error('Failed to fetch activity types');
  const logs = await logsRes.json();
  const types = await typesRes.json();
  // Map type id to name
  const typeMap: Record<string, string> = {};
  types.forEach((t: any) => { typeMap[t.id] = t.name; });
  // Map logs to Activity interface
  return logs.map((log: any) => ({
    activity_id: log.id,
    name: typeMap[log.activity_type_id] || 'Unknown',
    notes: log.notes,
    completed: log.completed,
    timestamp: log.timestamp,
  }));
}

export async function getActivityTypes() {
  const res = await fetch(`${baseURL}/activities/types`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch activity types');
  return res.json();
}

export async function createPetActivity(pet_id: string, activity: { activity_type_id: string; notes?: string }) {
  const res = await fetch(`${baseURL}/activities/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({
      pet_id,
      activity_type_id: activity.activity_type_id,
      completed: false,
      notes: activity.notes || '',
    }),
  });
  if (!res.ok) throw new Error('Failed to create activity');
  return res.json();
}

export async function deletePetActivity(activity_id: string) {
  const res = await fetch(`${baseURL}/activities/log/${activity_id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete activity');
  return true;
}

// VACCINATIONS
export async function getPetVaccinations(pet_id: string) {
  const res = await fetch(`${baseURL}/vaccinations/${pet_id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch vaccinations');
  const data = await res.json();
  return data.map((vac: any) => ({
    vaccination_id: vac.id,
    date: vac.date,
    notes: vac.notes,
    created_at: vac.created_at,
  }));
}

export async function createPetVaccination(pet_id: string, vaccination: { date: string; notes?: string }) {
  const res = await fetch(`${baseURL}/vaccinations/${pet_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({
      date: vaccination.date,
      notes: vaccination.notes || '',
    }),
  });
  if (!res.ok) throw new Error('Failed to create vaccination');
  return res.json();
}

export async function deletePetVaccination(vaccination_id: string) {
  const res = await fetch(`${baseURL}/vaccinations/delete/${vaccination_id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete vaccination');
  return true;
} 