"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, User, Mail, Lock, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 border-warm-beige shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-cream-blush" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-deep-plum">NotSoSmart</h1>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-deep-plum">Create Account</CardTitle>
          <CardDescription className="text-rich-mauve">
            Join NotSoSmart to manage your tasks intelligently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-deep-plum">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-rich-mauve" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="pl-10 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-deep-plum">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-rich-mauve" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="pl-10 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-deep-plum">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-rich-mauve" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="pl-10 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve"
                  required
                  minLength={6}
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-deep-plum">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-rich-mauve" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="pl-10 border-warm-beige focus:border-rich-mauve focus:ring-rich-mauve"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rich-mauve to-deep-plum hover:from-deep-plum hover:to-rich-mauve text-cream-blush"
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
              <span className="text-rich-mauve">Already have an account? </span>
              <Link href="/auth/login" className="text-deep-plum hover:text-soft-mauve font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}