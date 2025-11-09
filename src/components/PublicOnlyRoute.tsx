import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicOnlyRoute = ({ children, redirectTo = '/' }: PublicOnlyRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is already logged in, redirect them away from auth pages
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
