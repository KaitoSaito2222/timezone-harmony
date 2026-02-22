'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';
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
import { PageContainer } from '@/components/layout/PageContainer';

export function RegisterPageContent() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');

  const registerSchema = z
    .object({
      displayName: z.string().min(2, tv('nameMinLength')),
      email: z.string().email(tv('invalidEmail')),
      password: z.string().min(6, tv('passwordMinLength')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tv('passwordsMustMatch'),
      path: ['confirmPassword'],
    });
  type RegisterForm = z.infer<typeof registerSchema>;

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { register: registerUser, resendConfirmationEmail } = useAuthStore();

  useEffect(() => {
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.displayName);
      setRegisteredEmail(data.email);
      startCooldown(30);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || t('toastRegistrationFailed'));
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    setIsResending(true);
    try {
      await resendConfirmationEmail(registeredEmail);
      toast.success(t('toastConfirmationSent'));
      startCooldown(30);
    } catch (error: unknown) {
      const err = error as { message?: string };
      const match = err.message?.match(/after (\d+) seconds/);
      if (match) {
        startCooldown(parseInt(match[1]) + 1);
      }
      toast.error(err.message || t('toastConfirmationFailed'));
    } finally {
      setIsResending(false);
    }
  };

  if (registeredEmail) {
    return (
      <PageContainer centered>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {t('checkEmailTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('registerCheckEmailDesc', { email: registeredEmail })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={handleResend} variant="outline" className="w-full" disabled={isResending || cooldown > 0}>
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isResending
                ? t('sending')
                : cooldown > 0
                  ? `${t('resendConfirmation')} (${cooldown}s)`
                  : t('resendConfirmation')}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">{t('backToLogin')}</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer centered>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('registerTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('registerDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('displayName')}</Label>
              <Input
                {...register('displayName')}
                type="text"
                id="displayName"
                placeholder={t('displayNamePlaceholder')}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">
                  {errors.displayName.message}
                </p>
              )}
            </div>

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
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                {...register('confirmPassword')}
                type="password"
                id="confirmPassword"
                placeholder={t('passwordPlaceholder')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('creatingAccount') : t('register')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t('signIn')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
