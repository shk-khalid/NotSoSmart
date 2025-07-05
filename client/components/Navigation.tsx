"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CheckSquare, Plus, MessageSquare, Menu, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { authService } from '@/utils/auth';

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user info
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (navRef.current && logoRef.current) {
      gsap.fromTo(navRef.current, 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
      
      gsap.fromTo(logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
      );
    }
  }, []);

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: CheckSquare,
      description: 'View all tasks',
    },
    {
      href: '/tasks/create',
      label: 'Create Task',
      icon: Plus,
      description: 'Add new task',
    },
    {
      href: '/context',
      label: 'Context',
      icon: MessageSquare,
      description: 'Manage context entries',
    },
  ];

  const handleLogout = () => {
    authService.logout();
  };

  const NavLink = ({ href, label, icon: Icon, description, mobile = false }: any) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md",
        pathname === href && "bg-white shadow-md ring-1 ring-blue-200",
        mobile && "flex-col text-center gap-1 p-3"
      )}
      onClick={() => mobile && setIsOpen(false)}
    >
      <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", pathname === href && "text-blue-600")} />
      <div className={cn("flex flex-col", mobile && "items-center")}>
        <span className={cn("font-medium text-sm sm:text-base", pathname === href && "text-blue-900")}>
          {label}
        </span>
        <span className="text-xs text-gray-500 hidden sm:block">{description}</span>
      </div>
    </Link>
  );

  return (
    <nav ref={navRef} className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div ref={logoRef} className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">NotSoSmart</h1>
                <p className="text-xs text-gray-500">Smart Todo List</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">NotSoSmart</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* User Menu & Mobile Navigation */}
          <div className="flex items-center gap-2">
            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 hidden lg:block">
                  {user.username}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <Badge variant="outline" className="hidden md:flex items-center gap-1 text-xs">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              Online
            </Badge>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {/* User Info in Mobile */}
                  {user && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} mobile />
                  ))}
                  
                  {/* Logout Button in Mobile */}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2 justify-center"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}