import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';import { FcGoogle } from 'react-icons/fc';import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, resendConfirmationEmail } = useAuthStore();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setShowResendButton(false);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      // 認証状態がonAuthStateChangeで更新されるので、少し待ってから遷移
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (error: unknown) {
      const err = error as { message?: string };
      const errorMessage = err.message || 'Login failed';

      // Check if it's an email confirmation error
      if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
        toast.error('Please confirm your email address before logging in');
        setShowResendButton(true);
      } else {
        toast.error(errorMessage);
      }
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResendingEmail(true);
    try {
      await resendConfirmationEmail(email);
      toast.success('Confirmation email sent! Please check your inbox.');
      setShowResendButton(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Failed to resend confirmation email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <PageContainer centered>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                type="email"
                id="email"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register('password')}
                type="password"
                id="password"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            {showResendButton && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendConfirmation}
                disabled={isResendingEmail}
              >
                {isResendingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isResendingEmail ? 'Sending...' : 'Resend Confirmation Email'}
              </Button>
            )}
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Login with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up with email
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
