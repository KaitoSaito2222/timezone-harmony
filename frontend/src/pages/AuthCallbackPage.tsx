import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const hasShownToast = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          navigate('/login', { replace: true });
          return;
        }

        if (session) {
          // Show success toast only once
          if (!hasShownToast.current) {
            hasShownToast.current = true;
            toast.success('Welcome back!');
          }
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch  {
        navigate('/login', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isChecking) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
