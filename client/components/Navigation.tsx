"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckSquare, Plus, MessageSquare, Menu, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    {
      href: '/dashboard',
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

  const NavLink = ({ href, label, icon: Icon, description, mobile = false }: any) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/80 hover:shadow-md",
        pathname === href && "bg-white shadow-md ring-1 ring-soft-mauve",
        mobile && "flex-col text-center gap-1 p-3"
      )}
      onClick={() => mobile && setIsOpen(false)}
    >
      <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", pathname === href && "text-rich-mauve")} />
      <div className={cn("flex flex-col", mobile && "items-center")}>
        <span className={cn("font-medium text-sm sm:text-base", pathname === href && "text-deep-plum")}>
          {label}
        </span>
        <span className="text-xs text-rich-mauve hidden sm:block">{description}</span>
      </div>
    </Link>
  );

  return (
    <nav ref={navRef} className="bg-white/90 backdrop-blur-sm border-b border-warm-beige sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div ref={logoRef} className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-cream-blush" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-deep-plum">NotSoSmart</h1>
                <p className="text-xs text-rich-mauve">Smart Todo List</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-deep-plum">NotSoSmart</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden md:flex items-center gap-1 text-xs border-soft-mauve text-rich-mauve">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              Online
            </Badge>
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-soft-mauve hover:bg-warm-beige">
                  <User className="h-4 w-4 text-rich-mauve" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-warm-beige">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-deep-plum">{user?.username}</p>
                  <p className="text-xs text-rich-mauve">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-warm-beige" />
                <DropdownMenuItem className="text-deep-plum hover:bg-cream-blush">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-warm-beige" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden h-8 w-8 p-0 border-soft-mauve hover:bg-warm-beige">
                  <Menu className="h-4 w-4 text-rich-mauve" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-72 bg-white border-warm-beige">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} mobile />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}