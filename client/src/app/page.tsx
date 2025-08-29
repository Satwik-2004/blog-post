'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Calendar, User, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import { Post, PostsResponse } from '@/types';
import { postsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const fetchPosts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      const response: PostsResponse = await postsAPI.getAllPosts(page, 10, search);
      setPosts(response.posts);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchPosts(1, searchQuery);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      await fetchPosts(newPage, searchQuery);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength).trim() + '...';
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => fetchPosts()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Share Your Stories
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing stories, thoughts, and insights from our community of writers.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/register">
                    <PenTool className="mr-2 h-4 w-4" />
                    Start Writing
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
          ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms or browse all posts.'
                  : 'Be the first to share your story with the community!'}
              </p>
              {searchQuery ? (
                <Button onClick={() => { setSearchQuery(''); fetchPosts(); }}>
                  Clear Search
                </Button>
              ) : isAuthenticated ? (
                <Button asChild>
                  <Link href="/create">
                    <PenTool className="mr-2 h-4 w-4" />
                    Write Your First Post
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <Card key={post._id} className="hover:shadow-lg transition-shadow">
                  {post.imageURL && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={post.imageURL}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {post.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.username}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                    
                    <Link href={`/posts/${post._id}`}>
                      <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {truncateContent(post.content)}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/posts/${post._id}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardFooter>
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
                      className={pageNum === currentPage ? "" : ""}
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