'use client';

export default function FilterBar({ priority, status, onPriorityChange, onStatusChange }) {
  return (
    <div className="filter-row">
      <select value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="All">All Statuses</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  );
}
