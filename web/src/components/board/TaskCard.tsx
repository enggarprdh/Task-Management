'use client';

import { Task } from '@/types/task';
import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, index, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 2:
        return 'bg-red-100 text-red-800';
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 0:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow mb-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onClick(task)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
            
            {task.assignedTo && (
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-1">
                  {task.assignedTo.firstName.charAt(0)}
                  {task.assignedTo.lastName.charAt(0)}
                </div>
                <span>{task.assignedTo.firstName}</span>
              </div>
            )}
          </div>
          
          {task.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.categories.slice(0, 2).map((category) => (
                <span 
                  key={category.id} 
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                >
                  {category.name}
                </span>
              ))}
              {task.categories.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                  +{task.categories.length - 2}
                </span>
              )}
            </div>
          )}
          
          <div className="mt-2 flex justify-between items-center">
            {task.attachments?.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path>
                </svg>
                <span>{task.attachments.length}</span>
              </div>
            )}
            
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
              </svg>
              <span>3</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
} 