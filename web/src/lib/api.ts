import axios from 'axios';
import { Task, User, Category } from '@/types/task';

//const API_URL = 'http://eng-taskmanagement.runasp.net';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5258'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData: Partial<User>) => api.post('/api/auth/register', userData),
  login: (credentials: { email: string; password: string }) => api.post('/api/auth/login', credentials),
  refreshToken: () => api.post('/api/auth/refresh-token'),
  logout: () => api.post('/api/auth/logout'),
};

// Tasks API
export const tasksAPI = {
  getAllTasks: () => api.get<Task[]>('/api/task'),
  getTaskById: (id: string) => api.get<Task>(`/api/task/${id}`),
  createTask: (task: Partial<Task>) => api.post<Task>('/api/task', task),
  updateTask: (id: string, task: Partial<Task>) => api.put<Task>(`/api/task/${id}`, task),
  deleteTask: (id: string) => api.delete(`/api/task/${id}`),
  getTasksByUser: (userId: string) => api.get<Task[]>(`/api/task/user/${userId}`),
  getTasksByCategory: (categoryId: string) => api.get<Task[]>(`/api/task/category/${categoryId}`),
};

// Categories API
export const categoriesAPI = {
  getAllCategories: () => api.get<Category[]>('/api/categories'),
  getCategoryById: (id: string) => api.get<Category>(`/api/categories/${id}`),
  createCategory: (category: Partial<Category>) => api.post<Category>('/api/categories', category),
  updateCategory: (id: string, category: Partial<Category>) => api.put<Category>(`/api/categories/${id}`, category),
  deleteCategory: (id: string) => api.delete(`/api/categories/${id}`),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get<User[]>('/api/user'),
  getUserById: (id: string) => api.get<User>(`/api/user/${id}`),
};

export default api; 