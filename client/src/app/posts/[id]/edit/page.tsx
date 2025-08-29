'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostFormData } from '@/lib/validations';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import PostForm from '@/components/forms/PostForm';
import { Post } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [fetchError, setFetchError] = useState<string>('');
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const fetchPost = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const response = await postsAPI.getPostById(params.id);
      setPost(response.post);
      
      // Check if user is the owner
      if (user && response.post.userId !== user.id) {
        toast.error('You can only edit your own posts');
        router.push(`/posts/${params.id}`);
        return;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch post';
      setFetchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [params.id, user]);

  const handleSubmit = async (data: PostFormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await postsAPI.updatePost(params.id, data);
      
      toast.success('Post updated successfully!');
      router.push(`/posts/${params.id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="bg-white rounded-lg p-6">
            <Skeleton className="h-6 w-16 mb-4" />
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-6 w-20 mb-4" />
            <Skeleton className="h-32 w-full mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{fetchError || 'Post not found'}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={fetchPost} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push('/')} variant="default">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PostForm
      initialData={post}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      error={error}
      title="Edit Post"
      submitText="Update Post"
    />
  );
}