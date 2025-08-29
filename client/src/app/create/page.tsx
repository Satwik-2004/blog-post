'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostFormData } from '@/lib/validations';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import PostForm from '@/components/forms/PostForm';
import toast from 'react-hot-toast';

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (data: PostFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await postsAPI.createPost(data);
      
      toast.success('Post created successfully!');
      router.push(`/posts/${response.post._id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      title="Create New Post"
      submitText="Publish Post"
    />
  );
}