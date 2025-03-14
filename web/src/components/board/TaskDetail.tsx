'use client';

import { Task, Priority, Status } from '@/types/task';
import { format } from 'date-fns';
import { useState } from 'react';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetail({ task, onClose }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const getPriorityColor = (priority: Priority) => {
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

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 0:
        return 'bg-gray-100 text-gray-800';
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="text-xl font-semibold w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  defaultValue={task.title}
                />
              ) : (
                <h2 className="text-xl font-semibold">{task.title}</h2>
              )}
              <div className="flex space-x-2 mt-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Assigned To</p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-2">
                  {task.assignedTo.firstName.charAt(0)}
                  {task.assignedTo.lastName.charAt(0)}
                </div>
                <span>{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Due Date</p>
              {isEditing ? (
                <input
                  type="date"
                  className="border rounded p-1 text-sm w-full"
                  defaultValue={format(new Date(task.dueDate), 'yyyy-MM-dd')}
                />
              ) : (
                <p>{format(new Date(task.dueDate), 'MMMM d, yyyy')}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            {isEditing ? (
              <textarea
                className="w-full border rounded p-2 text-sm min-h-[100px]"
                defaultValue={task.description}
              ></textarea>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{task.description}</p>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <div className="flex flex-wrap gap-1">
              {task.categories.map((category) => (
                <span 
                  key={category.id} 
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                >
                  {category.name}
                </span>
              ))}
              {isEditing && (
                <button className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                  + Add
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Attachments</p>
            <div className="space-y-2">
              {task.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center p-2 border rounded">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm">{attachment.name}</span>
                </div>
              ))}
              {isEditing && (
                <button className="flex items-center p-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Attachment
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Activity</p>
            <div className="space-y-3">
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3"></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">John Doe</span> moved this task from <span className="font-medium">Todo</span> to <span className="font-medium">In Progress</span>
                  </p>
                  <p className="text-xs text-gray-500">Yesterday at 2:30 PM</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3"></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Jane Smith</span> added a comment: &quot;Let&apos;s try to finish this by Friday.&quot;
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Add Comment</p>
            <div className="flex">
              <textarea
                className="flex-grow border rounded-l p-2 text-sm"
                placeholder="Write a comment..."
              ></textarea>
              <button className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 