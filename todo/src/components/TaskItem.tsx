import React from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface TaskItemProps {
  text: string;
  onDelete: () => void;
  isDragging?: boolean; // make optional for flexibility
}

const TaskItem: React.FC<TaskItemProps> = ({ text, onDelete, isDragging }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-md shadow-sm transition-transform duration-200
        ${isDragging ? "bg-indigo-100 scale-105 shadow-lg" : "bg-white"}
      `}
      aria-label={`task ${text}`}
    >
      <span className="text-gray-800 break-words">{text}</span>
      <button
        onClick={onDelete}
        aria-label="delete task"
        className="ml-4 rounded-full p-1 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
        title="Delete task"
      >
        <XCircleIcon className="h-6 w-6 text-red-500" />
      </button>
    </div>
  );
};

export default TaskItem;

