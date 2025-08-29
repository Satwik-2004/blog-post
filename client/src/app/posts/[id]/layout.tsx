import { Metadata } from 'next';
import { postsAPI } from '@/lib/api';

interface PostLayoutProps {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // This would work in a real server environment
    // For client-side, we'll use a more basic approach
    return {
      title: 'Post Details',
      description: 'Read this amazing blog post',
    };
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found',
    };
  }
}

export default function PostLayout({ children }: PostLayoutProps) {
  return <>{children}</>;
}