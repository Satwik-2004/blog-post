'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              An unexpected error occurred. This has been logged and we'll look into it.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}