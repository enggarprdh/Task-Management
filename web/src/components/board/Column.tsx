'use client';

import { Column as ColumnType, Task } from '@/types/task';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onTaskClick: (task: Task) => void;
}

export default function Column({ column, onTaskClick }: ColumnProps) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow-sm w-80 flex-shrink-0">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700">{column.title}</h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
          {column.tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[calc(100vh-200px)]"
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      <button
        className="mt-2 w-full flex items-center justify-center p-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Task
      </button>
    </div>
  );
} 