import { Request, Response } from 'express';
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  imageURL?: string;
  content: string;
  username: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Make AuthRequest generic like Express Request
export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    userId: string;
    username: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreatePostRequest {
  title: string;
  imageURL?: string;
  content: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface PostsResponse {
  posts: IPost[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// API Response types for better type safety
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
}