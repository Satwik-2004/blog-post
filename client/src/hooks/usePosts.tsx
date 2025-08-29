import { useState, useEffect } from 'react';
import { Post, PostsResponse } from '@/types';
import { postsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export const usePosts = (initialPage = 1, initialSearch = '') => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [total, setTotal] = useState(0);

  const fetchPosts = async (page = currentPage, search = searchQuery) => {
    try {
      setLoading(true);
      setError('');
      
      const response: PostsResponse = await postsAPI.getAllPosts(page, 10, search);
      
      setPosts(response.posts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch posts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    await fetchPosts(1, query);
  };

  const changePage = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      await fetchPosts(page, searchQuery);
    }
  };

  const refetch = () => fetchPosts(currentPage, searchQuery);

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    total,
    searchPosts,
    changePage,
    refetch,
    setSearchQuery,
  };
};

export const useUserPosts = (initialPage = 1) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchUserPosts = async (page = currentPage) => {
    try {
      setLoading(true);
      setError('');
      
      const response: PostsResponse = await postsAPI.getUserPosts(page, 10);
      
      setPosts(response.posts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch your posts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePage = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      await fetchUserPosts(page);
    }
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
    setTotal(prev => prev - 1);
  };

  const refetch = () => fetchUserPosts(currentPage);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    changePage,
    refetch,
    deletePost,
  };
};