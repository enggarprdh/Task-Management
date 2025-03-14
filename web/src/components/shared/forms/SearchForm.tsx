'use client';

import { useState, FormEvent } from 'react';
import { Priority, Status, STATUS, PRIORITY } from '@/types/task';

interface SearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
}

export interface SearchParams {
  query: string;
  status?: Status;
  priority?: Priority;
  assignedToId?: string;
  categoryId?: string;
  dueDate?: string;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
  });
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleInputChange = (key: keyof SearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: (key === 'status' || key === 'priority') && value !== '' ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center mb-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search tasks..."
            value={searchParams.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Search
        </button>
        <button
          type="button"
          className="ml-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
          onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
        >
          {isAdvancedSearch ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {isAdvancedSearch && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full p-2 text-sm border border-gray-300 rounded-lg"
              value={searchParams.status ?? ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value=''>All Statuses</option>
              <option value={STATUS.TODO}>Todo</option>
              <option value={STATUS.IN_PROGRESS}>In Progress</option>
              <option value={STATUS.DONE}>Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              className="w-full p-2 text-sm border border-gray-300 rounded-lg"
              value={searchParams.priority ?? ''}
              onChange={(e) => handleInputChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value={PRIORITY.LOW}>Low</option>
              <option value={PRIORITY.MEDIUM}>Medium</option>
              <option value={PRIORITY.HIGH}>High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              className="w-full p-2 text-sm border border-gray-300 rounded-lg"
              value={searchParams.dueDate || ''}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
            />
          </div>
        </div>
      )}
    </form>
  );
} 