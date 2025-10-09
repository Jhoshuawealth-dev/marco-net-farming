import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SocialStats {
  totalPoints: number;
  todayPoints: number;
}

export const useSocialStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SocialStats>({
    totalPoints: 0,
    todayPoints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all social engagements
        const { data, error } = await supabase
          .from('social_engagement')
          .select('engagement_type, created_at')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const today = new Date().toISOString().split('T')[0];
          let totalPoints = 0;
          let todayPoints = 0;

          data.forEach(engagement => {
            const points = engagement.engagement_type === 'share' ? 100 : 20;
            totalPoints += points;
            
            const engagementDate = new Date(engagement.created_at).toISOString().split('T')[0];
            if (engagementDate === today) {
              todayPoints += points;
            }
          });

          setStats({ totalPoints, todayPoints });
        }
      } catch (error) {
        console.error('Error fetching social stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};
