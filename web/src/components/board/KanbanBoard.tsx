'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import { BoardState, Task, Status } from '@/types/task';
import TaskDetail from './TaskDetail';
import axios from 'axios';

interface KanbanBoardProps {
  boardState: BoardState;
  onTaskMove: (taskId: string, sourceColumnId: string, destinationColumnId: string, newIndex: number) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5258/api';

// Status enum values from API
const STATUS = {
  Todo: 0,
  InProgress: 1,
  Done: 2,
} as const;

export default function KanbanBoard({ boardState, onTaskMove }: KanbanBoardProps) {
  const [internalBoardState, setBoardState] = useState<BoardState>(boardState);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/task`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Group tasks by status
        const tasks = response.data;
        const groupedTasks = tasks.reduce((acc: BoardState, task: Task) => {
          const columnId = task.status === STATUS.Todo ? 'todo' 
            : task.status === STATUS.InProgress ? 'inProgress' 
            : 'done';
          if (acc.columns[columnId]) {
            acc.columns[columnId].tasks.push(task);
          }
          return acc;
        }, {
          columns: {
            todo: {
              id: 'todo',
              title: 'To Do',
              tasks: []
            },
            inProgress: {
              id: 'inProgress',
              title: 'In Progress',
              tasks: []
            },
            done: {
              id: 'done',
              title: 'Done',
              tasks: []
            }
          }
        });

        setBoardState(groupedTasks);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const sourceColumn = internalBoardState.columns[source.droppableId];
    const destinationColumn = internalBoardState.columns[destination.droppableId];
    
    if (sourceColumn.id === destinationColumn.id) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      const newColumn = {
        ...sourceColumn,
        tasks: newTasks,
      };

      const newState = {
        ...internalBoardState,
        columns: {
          ...internalBoardState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoardState(newState);
      onTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
      return;
    }

    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    const getNewStatus = (columnId: string): Status => {
      switch (columnId) {
        case 'todo':
          return STATUS.Todo;
        case 'inProgress':
          return STATUS.InProgress;
        case 'done':
          return STATUS.Done;
        default:
          return STATUS.Todo;
      }
    };
    
    const updatedTask = {
      ...movedTask,
      status: getNewStatus(destination.droppableId),
    };
    
    const destinationTasks = Array.from(destinationColumn.tasks);
    destinationTasks.splice(destination.index, 0, updatedTask);

    const newState = {
      ...internalBoardState,
      columns: {
        ...internalBoardState.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destinationColumn.id]: {
          ...destinationColumn,
          tasks: destinationTasks,
        },
      },
    };

    setBoardState(newState);
    onTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading tasks...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-2">
          {Object.values(internalBoardState.columns).map((column) => (
            <Column 
              key={column.id} 
              column={column} 
              onTaskClick={handleTaskClick} 
            />
          ))}
        </div>
      </DragDropContext>

      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          onClose={handleCloseTaskDetail} 
        />
      )}
    </div>
  );
} 