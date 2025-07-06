"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, User, Mail, Lock, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading: authLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      
      toast.success('Registration successful! Please log in.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pale-oat via-dusty-blush to-rose-fog flex items-center justify-center p-4">
      <Card ref={cardRef} className="w-full max-w-md bg-white/90 border-dusty-blush">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-plum-twilight to-deep-mauve rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-pale-oat" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-deep-mauve">NotSoSmart</h1>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-deep-mauve">Create Account</CardTitle>
          <CardDescription className="text-mist-gray">
            Join NotSoSmart to manage your tasks intelligently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-deep-mauve">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-mist-gray" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="pl-10 border-dusty-blush focus:border-plum-twilight focus:ring-plum-twilight"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-deep-mauve">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-mist-gray" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="pl-10 border-dusty-blush focus:border-plum-twilight focus:ring-plum-twilight"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-deep-mauve">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-mist-gray" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="pl-10 border-dusty-blush focus:border-plum-twilight focus:ring-plum-twilight"
                  required
                  minLength={6}
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-deep-mauve">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-mist-gray" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="pl-10 border-dusty-blush focus:border-plum-twilight focus:ring-plum-twilight"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-plum-twilight to-deep-mauve hover:from-deep-mauve hover:to-plum-twilight text-pale-oat"
              disabled={isLoading || authLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-mist-gray">Already have an account? </span>
              <Link href="/auth/login" className="text-plum-twilight hover:text-ash-lilac font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}