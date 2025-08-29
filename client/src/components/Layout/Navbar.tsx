'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PenTool, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">BlogApp</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button asChild>
                  <Link href="/create">
                    <PenTool className="h-4 w-4 mr-2" />
                    Write
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-posts" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Posts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 py-3 space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                      <PenTool className="h-4 w-4 mr-2" />
                      Write
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/my-posts" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      My Posts
                    </Link>
                  </Button>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Signed in as {user?.username}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}