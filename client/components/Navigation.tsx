'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  CheckSquare,
  Plus,
  MessageSquare,
  Menu,
  User,
  LogOut,
  Settings,
  Home,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import CheckLogo from '@/public/logo.png';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  if (!isAuthenticated) return null;

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      desc: 'View all tasks',
      isActive: pathname === '/dashboard'
    },
    { 
      href: '/tasks/create', 
      label: 'Create Task', 
      icon: Plus, 
      desc: 'Add new task',
      isActive: pathname === '/tasks/create' || pathname.startsWith('/tasks/edit')
    },
    { 
      href: '/context', 
      label: 'Context', 
      icon: MessageSquare, 
      desc: 'Manage context entries',
      isActive: pathname === '/context'
    },
  ];

  const NavLink = ({ href, label, icon: Icon, desc, isActive, mobile = false }: any) => {
    if (mobile) {
      return (
        <button
          onClick={() => handleNavigation(href)}
          className={cn(
            "flex flex-col items-center text-center gap-2 p-4 w-full rounded-xl transition-all duration-200",
            isActive 
              ? "bg-gradient-to-r from-rich-mauve/20 to-deep-plum/20 border border-rich-mauve/30" 
              : "hover:bg-warm-beige/50"
          )}
        >
          <Icon className={cn(
            "h-6 w-6 transition-colors", 
            isActive ? "text-deep-plum" : "text-rich-mauve"
          )} />
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-medium transition-colors", 
              isActive ? "text-deep-plum" : "text-gray-700"
            )}>
              {label}
            </span>
            <span className="text-xs text-gray-500">{desc}</span>
          </div>
        </button>
      );
    }

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center px-4 py-2 gap-3 rounded-lg transition-all duration-200 hover:bg-gray-50",
          isActive && "bg-gradient-to-r from-rich-mauve/10 to-deep-plum/10 ring-1 ring-rich-mauve/20"
        )}
      >
        <Icon className={cn(
          "h-5 w-5 transition-colors", 
          isActive ? "text-deep-plum" : "text-rich-mauve"
        )} />
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-medium transition-colors", 
            isActive ? "text-deep-plum" : "text-gray-700"
          )}>
            {label}
          </span>
          <span className="text-xs text-gray-500">{desc}</span>
        </div>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center shadow-sm">
            <Image src={CheckLogo} alt="Logo" width={16} height={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-deep-plum">Smart Todo AI</span>
            <span className="text-xs font-light text-rich-mauve">Your Smart Todo Assistant</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex lg:space-x-2">
          {navItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className="hidden md:flex items-center gap-1 text-xs border-green-200 text-green-700 bg-green-50"
          >
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </Badge>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-3 py-2 h-auto border-warm-beige hover:bg-warm-beige/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-deep-plum">{user?.username}</span>
                    <span className="text-xs text-rich-mauve truncate max-w-32">{user?.email}</span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-rich-mauve" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 bg-white border-warm-beige shadow-xl rounded-xl"
            >
              <div className="px-4 py-4 border-b border-warm-beige">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-semibold text-deep-plum">{user?.username}</p>
                    <p className="text-sm text-rich-mauve truncate">{user?.email}</p>
                    <Badge variant="outline" className="mt-1 w-fit text-xs border-green-200 text-green-700 bg-green-50">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <DropdownMenuItem 
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-warm-beige/50 rounded-lg mx-2"
                >
                  <Home className="h-4 w-4 text-rich-mauve" />
                  <span className="text-deep-plum font-medium">Dashboard</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => router.push('/settings')}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-warm-beige/50 rounded-lg mx-2"
                >
                  <Settings className="h-4 w-4 text-rich-mauve" />
                  <span className="text-deep-plum font-medium">Settings</span>
                </DropdownMenuItem>
              </div>
              
              <DropdownMenuSeparator className="bg-warm-beige mx-2" />
              
              <div className="py-2">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg mx-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="lg:hidden p-2 border-warm-beige hover:bg-warm-beige/50"
              >
                <Menu className="h-5 w-5 text-rich-mauve" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gradient-to-br from-cream-blush to-warm-beige border-warm-beige">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center gap-3 pb-6 border-b border-warm-beige">
                  <div className="h-12 w-12 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-semibold text-deep-plum">{user?.username}</p>
                    <p className="text-sm text-rich-mauve truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 py-6">
                  <div className="space-y-3">
                    {navItems.map(item => (
                      <NavLink key={item.href} {...item} mobile />
                    ))}
                  </div>
                </div>

                {/* Mobile Footer */}
                <div className="border-t border-warm-beige pt-4 space-y-3">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-white/50 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-rich-mauve" />
                    <span className="text-deep-plum font-medium">Settings</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}