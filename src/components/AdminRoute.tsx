import { Navigate } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAdminRole();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in or not admin, redirect to admin auth
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
