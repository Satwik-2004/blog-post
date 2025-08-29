'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { Post } from '@/types';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>('');
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const fetchPost = async () => {
    
    try {
      setLoading(true);
      setError('');
      const response = await postsAPI.getPostById(params.id);
      setPost(response.post);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await postsAPI.deletePost(params.id);
      toast.success('Post deleted successfully');
      router.push('/my-posts');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete post';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOwner = post && user && post.userId === user.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-64 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertDescription>{error || 'Post not found'}</AlertDescription>
          </Alert>
          <div className="flex gap-2 mt-4">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          {/* Post Header */}
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {post.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.username}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/posts/${post._id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete Post'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {post.imageURL && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img
                  src={post.imageURL}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="prose prose-gray max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">
              Browse More Posts
            </Link>
          </Button>
          {isAuthenticated && !isOwner && (
            <Button asChild>
              <Link href="/create">
                Write Your Own Post
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}