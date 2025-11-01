import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsModerator(false);
        setLoading(false);
        return;
      }

      try {
        const { data: adminCheck, error: adminError } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });

        if (adminError) {
          console.error('Error checking admin role:', adminError);
        } else {
          setIsAdmin(adminCheck || false);
        }

        const { data: modCheck, error: modError } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'moderator' });

        if (modError) {
          console.error('Error checking moderator role:', modError);
        } else {
          setIsModerator(modCheck || false);
        }
      } catch (error) {
        console.error('Error checking roles:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return { isAdmin, isModerator, loading };
};
