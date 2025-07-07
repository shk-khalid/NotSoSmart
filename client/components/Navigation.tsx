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
  Settings
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
      router.replace('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/dashboard',    label: 'Dashboard',   icon: CheckSquare,    desc: 'View all tasks'         },
    { href: '/tasks/create', label: 'Create Task', icon: Plus,           desc: 'Add new task'           },
    { href: '/context',      label: 'Context',     icon: MessageSquare, desc: 'Manage context entries' },
  ];

  const NavLink = ({ href, label, icon: Icon, desc, mobile }: any) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => mobile && setMobileOpen(false)}
        className={cn(
          "flex items-center",
          mobile
            ? "flex-col text-center gap-1 p-3"
            : "px-3 py-2 gap-2 rounded-md hover:bg-gray-100",
          active && "bg-indigo-50 ring-1 ring-indigo-200"
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "text-indigo-600" : "text-gray-500")} />
        <div className="flex flex-col">
          <span className={cn("text-sm font-medium", active ? "text-indigo-700" : "text-gray-700")}>
            {label}
          </span>
          {!mobile && <span className="text-xs text-gray-500">{desc}</span>}
        </div>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
            <Image src={CheckLogo} alt="Logo" width={16} height={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-deep-plum">Smart Todo AI</span>
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
        <div className="flex items-center space-x-2">
          {/* <Badge variant="outline" className="hidden md:flex items-center gap-1 text-xs border-gray-300 text-green-600">
            <span className="h-2 w-2 bg-green-500 rounded-full block" />
            Online
          </Badge> */}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="p-1">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                <p className="font-medium text-gray-800 truncate">{user?.username}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="lg:hidden p-1">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mt-8 space-y-1">
                {navItems.map(item => (
                  <NavLink key={item.href} {...item} mobile />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
