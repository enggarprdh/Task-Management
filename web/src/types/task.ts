export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Todo' | 'InProgress' | 'Done';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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