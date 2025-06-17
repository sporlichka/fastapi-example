import React from 'react';

export interface Vaccination {
  vaccination_id: string;
  date: string;
  notes?: string;
  created_at?: string;
}

interface VaccinationTimelineProps {
  vaccinations: Vaccination[];
  onDelete?: (vaccination_id: string) => void;
}

const VaccinationTimeline: React.FC<VaccinationTimelineProps> = ({ vaccinations, onDelete }) => (
  <div className="space-y-2">
    {vaccinations.length === 0 ? (
      <div className="text-gray-500">No vaccinations yet.</div>
    ) : (
      vaccinations.map(vac => (
        <div key={vac.vaccination_id} className="p-2 border rounded bg-green-50 flex justify-between items-center">
          <div>
            <div className="font-medium">Date: {vac.date}</div>
            {vac.notes && <div className="text-xs text-gray-500">Notes: {vac.notes}</div>}
            {vac.created_at && <div className="text-xs text-gray-400">Added: {new Date(vac.created_at).toLocaleString()}</div>}
          </div>
          {onDelete && (
            <button onClick={() => onDelete(vac.vaccination_id)} className="text-xs text-red-500 hover:underline ml-4">Delete</button>
          )}
        </div>
      ))
    )}
  </div>
);

export default VaccinationTimeline; 