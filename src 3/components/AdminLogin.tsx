import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminLoginProps {
  onLoginSuccess: (accessToken: string) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        return;
      }

      if (data.session?.access_token) {
        toast.success('🔐 Welcome back, admin!');
        onLoginSuccess(data.session.access_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d2c193b9/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        toast.error(`Signup failed: ${error}`);
        return;
      }

      toast.success('✅ Admin account created! Logging in...');
      
      // Auto-login after signup
      setTimeout(() => {
        handleLogin(e);
      }, 1000);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-2 border-border shadow-2xl relative z-10">
        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-secondary lime-glow mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1582769923195-c6e60dc1d8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Lime"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 
              className="text-3xl font-black text-center"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              THE <span className="text-secondary">LIMELIGHT</span> POST
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Lock className="size-4 text-secondary" />
              <p className="text-sm text-muted-foreground">Admin Access</p>
            </div>
          </div>

          {/* Login Form */}
          {!showSignup ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wide">
                  Email
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@limelightpost.com"
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wide">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  'LOGIN'
                )}
              </Button>

              <div className="text-center pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="text-sm text-secondary hover:underline"
                >
                  First time? Create admin account →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name" className="text-sm font-bold uppercase tracking-wide">
                  Your Name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Andrew"
                  className="mt-2 bg-background/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-sm font-bold uppercase tracking-wide">
                  Email
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="andrew@limelightpost.com"
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-sm font-bold uppercase tracking-wide">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-background/50"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  'CREATE ADMIN ACCOUNT'
                )}
              </Button>

              <div className="text-center pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="text-sm text-secondary hover:underline"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          )}

          {/* Footer Note */}
          <div className="mt-6 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-center text-muted-foreground">
              🔒 Secure admin access for The Limelight Post
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
