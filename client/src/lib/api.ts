import axios, { AxiosResponse, AxiosError } from 'axios';
import { AuthResponse, PostsResponse, Post } from '@/types';
import { LoginFormData, RegisterFormData, PostFormData } from '@/lib/validations';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Enhanced response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as any)?.message || 'An error occurred';
    
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    } else {
      switch (error.response.status) {
        case 401:
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('Access denied');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 422:
          toast.error('Validation failed. Please check your input.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },
};

// Posts API calls
export const postsAPI = {
  getAllPosts: async (page = 1, limit = 10, search = ''): Promise<PostsResponse> => {
    const response: AxiosResponse<PostsResponse> = await api.get('/posts', {
      params: { page, limit, search: search.trim() },
    });
    return response.data;
  },

  getPostById: async (id: string): Promise<{ post: Post }> => {
    const response: AxiosResponse<{ post: Post }> = await api.get(`/posts/${id}`);
    return response.data;
  },

 createPost: async (data: PostFormData): Promise<{ post: Post; message: string }> => {
    const response: AxiosResponse<{ post: Post; message: string }> = await api.post('/posts', data);
    return response.data;
  },

  updatePost: async (id: string, data: Partial<PostFormData>): Promise<{ post: Post; message: string }> => {
    const response: AxiosResponse<{ post: Post; message: string }> = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/posts/${id}`);
    return response.data;
  },

  getUserPosts: async (page = 1, limit = 10): Promise<PostsResponse> => {
    const response: AxiosResponse<PostsResponse> = await api.get('/posts/user/me', {
      params: { page, limit },
    });
    return response.data;
  },
};

export default api;