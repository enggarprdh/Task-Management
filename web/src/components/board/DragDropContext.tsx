'use client';

import { ReactNode } from 'react';
import { DragDropContext as DndContext, DropResult } from '@hello-pangea/dnd';

interface DragDropContextProps {
  children: ReactNode;
  onDragEnd: (result: DropResult) => void;
}

export default function DragDropContext({ children, onDragEnd }: DragDropContextProps) {
  return (
    <DndContext onDragEnd={onDragEnd}>
      {children}
    </DndContext>
  );
} 