// API Response Types (matching backend)
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  imageURL?: string;
  content: string;
  username: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// API Error Type
export interface ApiError {
  message: string;
  details?: string;
}

// UI State Types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  hasResults: boolean;
}