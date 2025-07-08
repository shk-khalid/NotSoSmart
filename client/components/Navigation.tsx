'use client';

import React, { useState } from 'react';
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
  Plus,
  MessageSquare,
  Menu,
  LogOut,
  Settings,
  Home,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import CheckLogo from '@/public/logo.png';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/tasks/create', label: 'Tasks',    icon: Plus },
  { href: '/context',     label: 'Context',  icon: MessageSquare },
];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const baseBtnClasses = 'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-warm-beige/50 transition-colors';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      router.replace('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const renderNavItem = (item: typeof NAV_ITEMS[0], onClick?: () => void) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href);
    return (
      <button
        key={item.href}
        onClick={onClick ?? (() => router.push(item.href))}
        className={cn(
          baseBtnClasses,
          isActive && 'bg-warm-beige text-deep-plum'
        )}
      >
        <item.icon className="h-5 w-5 text-rich-mauve" />
        <span className="text-sm font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center shadow-sm">
            <Image src={CheckLogo} alt="Logo" width={16} height={16} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-deep-plum">Smart Todo AI</span>
            <span className="text-xs font-light text-rich-mauve">Your Smart Todo Assistant</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:space-x-1">
          {NAV_ITEMS.map(item => renderNavItem(item))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">

          {/* Online Badge */}
          <Badge
            variant="outline"
            className="hidden md:flex items-center gap-1 text-xs border-green-200 text-green-700 bg-green-50"
          >
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </Badge>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={baseBtnClasses}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center text-white font-medium">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col items-start truncate">
                    <span className="text-sm font-medium text-deep-plum">{user?.username}</span>
                    <span className="text-xs text-rich-mauve">{user?.email}</span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-rich-mauve" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border-warm-beige shadow-lg">
              {/* Profile Preview */}
              <div className="p-3 border-b border-warm-beige flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-full flex items-center justify-center text-white font-medium">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-medium text-deep-plum">{user?.username}</span>
                  <span className="text-sm text-rich-mauve truncate">{user?.email}</span>
                </div>
              </div>

              {/* Menu Actions */}
              {NAV_ITEMS.concat([
                { href: '/settings', label: 'Settings', icon: Settings },
              ]).map(item => (
                <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-rich-mauve" />
                    <span className="text-deep-plum">{item.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-warm-beige" />

              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className={baseBtnClasses + ' lg:hidden p-2'}>
                <Menu className="h-5 w-5 text-rich-mauve" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-white border-warm-beige">
              <div className="space-y-1">
                {NAV_ITEMS.map(item =>
                  renderNavItem(item, () => {
                    setMobileOpen(false);
                    router.push(item.href);
                  })
                )}
              </div>
              <div className="mt-4 border-t border-warm-beige pt-4 space-y-1">
                <button
                  onClick={() => { setMobileOpen(false); router.push('/settings'); }}
                  className={baseBtnClasses}
                >
                  <Settings className="h-5 w-5 text-rich-mauve" /> Settings
                </button>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className={baseBtnClasses + ' text-red-600 hover:bg-red-50'}
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
