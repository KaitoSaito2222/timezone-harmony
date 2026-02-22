'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout/PageContainer';

export function LoginPageContent() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');

  const loginSchema = z.object({
    email: z.string().email(tv('invalidEmail')),
    password: z.string().min(6, tv('passwordMinLength')),
  });
  type LoginForm = z.infer<typeof loginSchema>;

  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated, resendConfirmationEmail } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setShowResendButton(false);
    try {
      await login(data.email, data.password);
      toast.success(t('toastWelcomeBack'));
      setTimeout(() => {
        router.push('/');
      }, 100);
    } catch (error: unknown) {
      const err = error as { message?: string };
      const errorMessage = err.message || t('loginFailed');
      if (
        errorMessage.includes('Email not confirmed') ||
        errorMessage.includes('email_not_confirmed')
      ) {
        toast.error(t('toastConfirmEmailFirst'));
        setShowResendButton(true);
      } else {
        toast.error(errorMessage);
      }
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error(t('toastEnterEmail'));
      return;
    }
    setIsResendingEmail(true);
    try {
      await resendConfirmationEmail(email);
      toast.success(t('toastConfirmationSent'));
      setShowResendButton(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || t('toastConfirmationFailed'));
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || t('toastGoogleFailed'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <PageContainer centered>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('loginTitle')}</CardTitle>
          <CardDescription className="text-center">
            {t('loginDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                {...register('email')}
                type="email"
                id="email"
                placeholder={t('emailPlaceholder')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                {...register('password')}
                type="password"
                id="password"
                placeholder={t('passwordPlaceholder')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('loggingIn') : t('login')}
            </Button>

            {showResendButton && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendConfirmation}
                disabled={isResendingEmail}
              >
                {isResendingEmail && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isResendingEmail ? t('sending') : t('resendConfirmation')}
              </Button>
            )}
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              {t('orContinueWith')}
            </span>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isGoogleLoading || isLoading}>
            {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FcGoogle className="mr-2 h-5 w-5" />}
            {t('loginWithGoogle')}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t('noAccount')}{' '}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              {t('signUpWithEmail')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
