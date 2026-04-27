
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { BD_ALLOWED_PATH, getCurrentUserRoles, isBdUser } from '@/utils/authRoles';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const applySession = async (sessionUser: User | null) => {
      setUser(sessionUser);
      setRoles(sessionUser ? await getCurrentUserRoles() : []);
      setLoading(false);
    };

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await applySession(session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        applySession(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isBdUser(roles) && location.pathname !== BD_ALLOWED_PATH) {
    return <Navigate to={BD_ALLOWED_PATH} replace />;
  }

  return <>{children}</>;
}
