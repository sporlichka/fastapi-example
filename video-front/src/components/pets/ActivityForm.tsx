import React, { useState, useEffect } from 'react';
import { getActivityTypes } from '../../api';

interface ActivityType {
  id: string;
  name: string;
}

interface ActivityFormProps {
  onSave: (activity: { activity_type_id: string; notes?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSave, onCancel, loading }) => {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [activityTypeId, setActivityTypeId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getActivityTypes()
      .then(types => setActivityTypes(types))
      .catch(() => setError('Failed to load activity types'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTypeId) {
      setError('Please select an activity type');
      return;
    }
    onSave({ activity_type_id: activityTypeId, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
      {error && <div className="text-red-500 bg-red-50 p-2 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Activity Type</label>
        <select
          value={activityTypeId}
          onChange={e => setActivityTypeId(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        >
          <option value="">Select activity type...</option>
          {activityTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
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

export default ActivityForm; 