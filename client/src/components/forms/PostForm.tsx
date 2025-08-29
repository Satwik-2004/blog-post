'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { postSchema, PostFormData } from '@/lib/validations';
import { Post } from '@/types';

interface PostFormProps {
  initialData?: Post;
  onSubmit: (data: PostFormData) => Promise<void>;
  isLoading: boolean;
  error: string;
  title: string;
  submitText: string;
}

export default function PostForm({
  initialData,
  onSubmit,
  isLoading,
  error,
  title,
  submitText,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          imageURL: initialData.imageURL || '',
          content: initialData.content,
        }
      : {
          title: '',
          imageURL: '',
          content: '',
        },
  });

  const watchedContent = watch('content', '');
  const watchedTitle = watch('title', '');
  const watchedImageURL = watch('imageURL', '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter an engaging title for your post"
                  {...register('title')}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center">
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {watchedTitle.length}/120 characters
                  </p>
                </div>
              </div>

              {/* Image URL Field */}
              <div className="space-y-2">
                <Label htmlFor="imageURL">
                  Featured Image URL <span className="text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="imageURL"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  {...register('imageURL')}
                  disabled={isLoading}
                />
                {errors.imageURL && (
                  <p className="text-sm text-red-600">{errors.imageURL.message}</p>
                )}
                
                {/* Image Preview */}
                {watchedImageURL && !errors.imageURL && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                      <img
                        src={watchedImageURL}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here... (minimum 50 characters)"
                  rows={12}
                  {...register('content')}
                  disabled={isLoading}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {watchedContent.length} characters
                    {watchedContent.length >= 50 && (
                      <span className="text-green-600 ml-1">✓</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Saving...' : submitText}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}