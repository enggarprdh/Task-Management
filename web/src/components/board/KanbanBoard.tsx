'use client';

import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import { BoardState, Task, Status } from '@/types/task';
import TaskDetail from './TaskDetail';

interface KanbanBoardProps {
  initialBoardState: BoardState;
  onTaskMove: (taskId: string, sourceColumnId: string, destinationColumnId: string, newIndex: number) => void;
}

export default function KanbanBoard({ initialBoardState, onTaskMove }: KanbanBoardProps) {
  const [boardState, setBoardState] = useState<BoardState>(initialBoardState);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item is dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const sourceColumn = boardState.columns[source.droppableId];
    const destinationColumn = boardState.columns[destination.droppableId];
    
    // If moving within the same column
    if (sourceColumn.id === destinationColumn.id) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);

      const newColumn = {
        ...sourceColumn,
        tasks: newTasks,
      };

      const newState = {
        ...boardState,
        columns: {
          ...boardState.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoardState(newState);
      onTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
      return;
    }

    // Moving from one column to another
    const sourceTasks = Array.from(sourceColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    
    // Update the task status based on the destination column
    const getNewStatus = (columnId: string): Status => {
      switch (columnId) {
        case 'todo':
          return 'Todo';
        case 'inProgress':
          return 'InProgress';
        case 'done':
          return 'Done';
        default:
          return 'Todo';
      }
    };
    
    const updatedTask = {
      ...movedTask,
      status: getNewStatus(destination.droppableId),
    };
    
    const destinationTasks = Array.from(destinationColumn.tasks);
    destinationTasks.splice(destination.index, 0, updatedTask);

    const newState = {
      ...boardState,
      columns: {
        ...boardState.columns,
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

  return (
    <div className="flex flex-col h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-2">
          {Object.values(boardState.columns).map((column) => (
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