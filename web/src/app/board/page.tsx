'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import KanbanBoard from '@/components/board/KanbanBoard';
import MainLayout from '@/components/shared/Layout/MainLayout';
import { tasksAPI, usersAPI } from '@/lib/api';
import { BoardState, Task, Priority, PRIORITY, Status } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/Card';
import SearchForm, { SearchParams } from '@/components/shared/forms/SearchForm';
import Modal from '@/components/shared/ui/Modal';
import TaskForm from '@/components/shared/forms/TaskForm';
import Button from '@/components/shared/ui/Button';

export default function BoardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [boardState, setBoardState] = useState<BoardState>({
    columns: {
      todo: {
        id: 'todo',
        title: 'Todo',
        tasks: [],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        tasks: [],
      },
      done: {
        id: 'done',
        title: 'Done',
        tasks: [],
      },
    },
  });

  // Fetch tasks
  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksAPI.getAllTasks,
  });

  // Fetch users
  const { data: users, isLoading: isUsersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: usersAPI.getAllUsers,
  });

  // Mock categories for the form
  const mockCategories = [
    { id: '1', name: 'Frontend', description: 'Frontend tasks' },
    { id: '2', name: 'Backend', description: 'Backend tasks' },
    { id: '3', name: 'Design', description: 'Design tasks' },
    { id: '4', name: 'Bug', description: 'Bug fixes' },
  ];

  // Update board state when tasks are loaded
  useEffect(() => {
    if (tasks?.data) {
      const newBoardState: BoardState = {
        columns: {
          todo: {
            id: 'todo',
            title: 'Todo',
            tasks: tasks.data.filter((task: Task) => task.status === 0),
          },
          inProgress: {
            id: 'inProgress',
            title: 'In Progress',
            tasks: tasks.data.filter((task: Task) => task.status === 1),
          },
          done: {
            id: 'done',
            title: 'Done',
            tasks: tasks.data.filter((task: Task) => task.status === 2),
          },
        },
      };
      setBoardState(newBoardState);
    }
  }, [tasks]);

  const queryClient = useQueryClient();

  const handleTaskMove = async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string
  ) => {
    try {
      // Konversi column ID ke status enum
      const getTaskStatus = (columnId: string): Status => {
        switch (columnId) {
          case 'todo':
            return 0;
          case 'inProgress':
            return 1;
          case 'done':
            return 2;
          default:
            return 0;
        }
      };
      const getTaskDetail = (taskId:string): Task | undefined => {
        const obj = boardState.columns[sourceColumnId];
        if (obj) {
          return obj.tasks.find((task: Task) => task.id === taskId);
        }
        return undefined;
      };

      // Persiapkan data untuk update
      const taskUpdate = getTaskDetail(taskId);
      const updateData: Partial<Task> = {
        ...taskUpdate,
        status: getTaskStatus(destinationColumnId)
      };

      // Panggil API untuk update task
      await tasksAPI.updateTask(taskId, updateData);
      
      // Refresh data dengan invalidate query cache
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      console.error('Error updating task status:', error);
      // Tambahkan handling error sesuai kebutuhan
    }
  };

  const handleSearch = (params: SearchParams) => {
    console.log('Search params:', params);
    
    // Example of how you might use params to filter tasks
    if (tasks?.data && params.query) {
      const filteredTasks = tasks.data.filter((task: Task) => 
        task.title.toLowerCase().includes(params.query.toLowerCase()) ||
        task.description.toLowerCase().includes(params.query.toLowerCase())
      );
      console.log('Filtered tasks:', filteredTasks);
    }
  };

  // Add a helper function to convert priority string to Priority type
  const getPriorityValue = (priority: string): Priority => {
    switch (priority) {
      case 'Low':
        return PRIORITY.LOW;
      case 'Medium':
        return PRIORITY.MEDIUM;
      case 'High':
        return PRIORITY.HIGH;
      default:
        return PRIORITY.LOW;
    }
  };

  const handleCreateTask = async (data: TaskFormValues) => {
    try {
      // Convert the form data to the format expected by the API
      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: getPriorityValue(data.priority), // Convert string priority to numeric value
        assignedToId: data.assignedToId,
        // The status is set to Todo by default on the server
        // Categories will be handled separately by the backend
        categoryIds: data.categoryIds
      };
      
      // Call the API to create the task
      const response = await tasksAPI.createTask(taskData);
      
      // Close the modal
      setIsCreateModalOpen(false);
      
      // Refresh the task list by invalidating the query cache
      // This will trigger a refetch of the tasks
      // You might need to add a queryClient if not already available
      // queryClient.invalidateQueries(['tasks']);
      
      // For now, just log the response
      console.log('Task created successfully:', response.data);
      
      // Reload the page to see the new task (temporary solution)
      window.location.reload();
    } catch (error) {
      console.error('Error creating task:', error);
      // You might want to show an error message to the user
    }
  };

  // Define the type for form values
  type TaskFormValues = {
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Todo' | 'InProgress' | 'Done';
    assignedToId: string;
    categoryIds: string[];
  };

  // Check if data is loading
  const isLoading = isTasksLoading || isUsersLoading;
  const error = tasksError || usersError;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading data</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Task
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchForm onSearch={handleSearch} />
          </CardContent>
        </Card>

        <KanbanBoard
          boardState={boardState}
          onTaskMove={handleTaskMove}
        />

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Task"
          size="lg"
        >
          <TaskForm
            users={users?.data || []}
            categories={mockCategories}
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      </div>
    </MainLayout>
  );
} 