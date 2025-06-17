import React from 'react';

export interface Activity {
  activity_id: string;
  name: string;
  notes?: string;
  completed?: boolean;
  timestamp?: string;
}

interface ActivityListProps {
  activities: Activity[];
  onDelete?: (activity_id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onDelete }) => (
  <div className="space-y-2">
    {activities.length === 0 ? (
      <div className="text-gray-500">No activities yet.</div>
    ) : (
      activities.map(activity => (
        <div key={activity.activity_id} className="p-2 border rounded bg-gray-50 flex justify-between items-center">
          <div>
            <div className="font-medium">{activity.name}</div>
            {activity.notes && <div className="text-xs text-gray-500">Notes: {activity.notes}</div>}
            {activity.timestamp && <div className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</div>}
          </div>
          {onDelete && (
            <button onClick={() => onDelete(activity.activity_id)} className="text-xs text-red-500 hover:underline ml-4">Delete</button>
          )}
        </div>
      ))
    )}
  </div>
);

export default ActivityList; 