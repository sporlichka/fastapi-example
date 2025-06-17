import React, { useState } from 'react';

interface VaccinationFormProps {
  onSave: (vaccination: { date: string; notes?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({ onSave, onCancel, loading }) => {
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ date, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={loading}>Save</button>
        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
    </form>
  );
};

export default VaccinationForm; 