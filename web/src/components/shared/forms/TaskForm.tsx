'use client';

import { Task, Status, Priority, STATUS, PRIORITY, User, Category } from '@/types/task';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Todo', 'InProgress', 'Done']),
  assignedToId: z.string().min(1, 'Assignee is required'),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// Helper function to convert numeric priority to string
const getPriorityString = (priority: Priority): 'Low' | 'Medium' | 'High' => {
  switch (priority) {
    case PRIORITY.LOW:
      return 'Low';
    case PRIORITY.MEDIUM:
      return 'Medium';
    case PRIORITY.HIGH:
      return 'High';
    default:
      return 'Low';
  }
};

const getStatusString = (status: Status): 'Todo' | 'InProgress' | 'Done' => {
  switch (status) {
    case STATUS.TODO:
      return 'Todo';
    case STATUS.IN_PROGRESS:
      return 'InProgress';
    case STATUS.DONE:
      return 'Done';
    default:
      return 'Todo';
  }
};

interface TaskFormProps {
  task?: Task;
  users: User[];
  categories: Category[];
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, users, categories, onSubmit, onCancel }: TaskFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    task ? task.categories.map(cat => cat.id) : []
  );

  const defaultValues: TaskFormValues = {
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task ? getPriorityString(task.priority) : 'Medium',
    status: task ? getStatusString(task.status) : 'Todo',
    assignedToId: task?.assignedTo?.id || '',
    categoryIds: selectedCategories,
  };

  const { register, handleSubmit, control, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          {...register('title')}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          {...register('description')}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            className={`w-full p-2 border rounded-md ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
            {...register('dueDate')}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <select
            id="assignedToId"
            className={`w-full p-2 border rounded-md ${errors.assignedToId ? 'border-red-500' : 'border-gray-300'}`}
            {...register('assignedToId')}
          >
            <option value="">Select Assignee</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          {errors.assignedToId && (
            <p className="mt-1 text-xs text-red-500">{errors.assignedToId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <div className="flex space-x-4">
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <>
                  {(['Low', 'Medium', 'High'] as const).map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="radio"
                        value={priority}
                        checked={field.value === priority}
                        onChange={() => field.onChange(priority)}
                        className="mr-1"
                      />
                      <span className="text-sm">{priority}</span>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.priority && (
            <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex space-x-4">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <>
                  {(['Todo', 'InProgress', 'Done'] as const).map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        value={status}
                        checked={field.value === status}
                        onChange={() => field.onChange(status)}
                        className="mr-1"
                      />
                      <span className="text-sm">{status === 'InProgress' ? 'In Progress' : status}</span>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.status && (
            <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          <Controller
            control={control}
            name="categoryIds"
            render={({ field }) => (
              <>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      selectedCategories.includes(category.id)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      value={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => {
                        handleCategoryToggle(category.id);
                        field.onChange(
                          selectedCategories.includes(category.id)
                            ? selectedCategories.filter(id => id !== category.id)
                            : [...selectedCategories, category.id]
                        );
                      }}
                    />
                    {category.name}
                  </label>
                ))}
              </>
            )}
          />
        </div>
        {errors.categoryIds && (
          <p className="mt-1 text-xs text-red-500">{errors.categoryIds.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
} 