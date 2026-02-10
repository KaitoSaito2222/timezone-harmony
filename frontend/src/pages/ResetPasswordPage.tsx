import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { updatePassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Check if this is a valid password reset session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidToken(!!session);

      if (!session) {
        toast.error('Invalid or expired reset link');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
    };

    checkSession();
  }, [navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      await updatePassword(data.password);
      setIsSuccess(true);
      toast.success('Password updated successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <PageContainer centered>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Verifying reset link...</p>
        </div>
      </PageContainer>
    );
  }

  if (!isValidToken) {
    return null;
  }

  if (isSuccess) {
    return (
      <PageContainer centered>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Password Updated!</CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully updated. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer centered>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                {...register('password')}
                type="password"
                id="password"
                placeholder="••••••••"
                autoFocus
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
