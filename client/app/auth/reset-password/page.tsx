"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { resetPassword, loading: authLoading, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword({ email: email.trim() });
      setIsSubmitted(true);
      toast.success('Check your inbox for reset instructions');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center p-4">
        <Card ref={cardRef} className="w-full max-w-md bg-white/90 border-warm-beige shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-cream-blush" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-deep-plum">NotSoSmart</h1>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-deep-plum">Check Your Email</CardTitle>
            <CardDescription className="text-rich-mauve">
              We've sent password reset instructions to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-rich-mauve">
              <p>Didn't receive the email? Check your spam folder or try again.</p>
            </div>
            
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full border-warm-beige text-rich-mauve hover:bg-warm-beige"
            >
              Try Different Email
            </Button>

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-rich-mauve hover:text-soft-mauve flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-blush via-warm-beige to-dusty-rose flex items-center justify-center p-4">
      <Card ref={cardRef} className="w-full max-w-md bg-white/90 border-warm-beige shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-rich-mauve to-deep-plum rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-cream-blush" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-deep-plum">NotSoSmart</h1>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-deep-plum">Reset Password</CardTitle>
          <CardDescription className="text-rich-mauve">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-deep-plum">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-rich-mauve" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-rich-mauve hover:text-soft-mauve flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}