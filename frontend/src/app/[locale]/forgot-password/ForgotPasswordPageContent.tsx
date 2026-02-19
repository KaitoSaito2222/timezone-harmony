'use client';

import { useState } from 'react';
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

export function ForgotPasswordPageContent() {
  const t = useTranslations('auth');
  const tv = useTranslations('validation');

  const forgotPasswordSchema = z.object({
    email: z.string().email(tv('invalidEmail')),
  });
  type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toast.success(t('toastResetEmailSent'));
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || t('toastResetEmailFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <PageContainer centered>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {t('checkEmailTitle')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('checkEmailDesc', { email: getValues('email') })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('checkEmailBody')}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              {t('tryAnotherEmail')}
            </Button>
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                {t('backToLogin')}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer centered>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('forgotPasswordTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('forgotPasswordDesc')}
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
                autoFocus
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('sending') : t('sendResetLink')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t('rememberPassword')}{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t('backToLogin')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
