'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  Eye, 
  PenTool, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Post, PostsResponse } from '@/types';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const fetchUserPosts = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response: PostsResponse = await postsAPI.getUserPosts(page, 10);
      setPosts(response.posts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch your posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      setDeletingId(postId);
      await postsAPI.deletePost(postId);
      
      // Remove post from local state
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
      
      // If no posts left on current page and not on first page, go to previous page
      if (posts.length === 1 && currentPage > 1) {
        fetchUserPosts(currentPage - 1);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete post';
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      await fetchUserPosts(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength).trim() + '...';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => fetchUserPosts()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
            <p className="text-gray-600 mt-2">
              Manage your published articles and drafts
            </p>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <PenTool className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : posts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start sharing your thoughts and stories with the world!
              </p>
              <Button asChild size="lg">
                <Link href="/create">
                  <PenTool className="mr-2 h-4 w-4" />
                  Write Your First Post
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {posts.map((post) => (
                <Card key={post._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link href={`/posts/${post._id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors mb-2">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {formatDate(post.createdAt)}
                          </div>
                          {post.updatedAt !== post.createdAt && (
                            <div className="flex items-center gap-1">
                              <Edit className="h-3 w-3" />
                              Updated {formatDate(post.updatedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/posts/${post._id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        
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
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(post._id)}
                                disabled={deletingId === post._id}
                              >
                                {deletingId === post._id ? 'Deleting...' : 'Delete Post'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">
                      {truncateContent(post.content)}
                    </p>
                    
                    {post.imageURL && (
                      <div className="mt-4">
                        <Badge variant="secondary" className="text-xs">
                          Has featured image
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}