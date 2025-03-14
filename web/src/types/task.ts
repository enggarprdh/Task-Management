// Constants for database values
export const STATUS = {
  ALL:-1,
  TODO: 0,
  IN_PROGRESS: 1,
  DONE: 2,
} as const;

export const PRIORITY = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
} as const;

// Types for form values
export type StatusString = 'Todo' | 'InProgress' | 'Done';
export type PriorityString = 'Low' | 'Medium' | 'High';

// Types for database/API values
export type Status = typeof STATUS[keyof typeof STATUS];
export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password:string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  assignedTo: User;
  categories: Category[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface BoardState {
  columns: {
    [key: string]: Column;
  };
} 