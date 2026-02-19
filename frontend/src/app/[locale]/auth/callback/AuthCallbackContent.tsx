'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/PageContainer';

export function AuthCallbackContent() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasShownToast = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          router.replace('/login');
          return;
        }

        if (session) {
          if (!hasShownToast.current) {
            hasShownToast.current = true;
            toast.success(t('toastWelcomeBack'));
          }
          router.replace('/');
        } else {
          router.replace('/login');
        }
      } catch {
        router.replace('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, t]);

  if (!isChecking) {
    return null;
  }

  return (
    <PageContainer centered>
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">{t('completingAuth')}</p>
      </div>
    </PageContainer>
  );
}
