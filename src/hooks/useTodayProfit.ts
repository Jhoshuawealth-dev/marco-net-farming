import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTodayProfit = () => {
  const { user } = useAuth();
  const [profit, setProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayProfit = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        let totalProfit = 0;

        // Mining profit
        const { data: miningData } = await supabase
          .from('mining_records')
          .select('mined_amount')
          .eq('user_id', user.id)
          .eq('date_mined', today);

        if (miningData) {
          totalProfit += miningData.reduce((sum, record) => sum + Number(record.mined_amount || 0), 0);
        }

        // Social engagement profit (today)
        const { data: socialData } = await supabase
          .from('social_engagement')
          .select('engagement_type, created_at')
          .eq('user_id', user.id)
          .gte('created_at', `${today}T00:00:00`)
          .lte('created_at', `${today}T23:59:59`);

        if (socialData) {
          socialData.forEach(engagement => {
            totalProfit += engagement.engagement_type === 'share' ? 100 : 20;
          });
        }

        // Course completions (today)
        const { data: courseData } = await supabase
          .from('course_progress')
          .select('completed, created_at, courses(reward)')
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('created_at', `${today}T00:00:00`)
          .lte('created_at', `${today}T23:59:59`);

        if (courseData) {
          courseData.forEach((progress: any) => {
            totalProfit += Number(progress.courses?.reward || 0);
          });
        }

        setProfit(totalProfit);
      } catch (error) {
        console.error('Error fetching today profit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayProfit();
  }, [user]);

  return { profit, loading };
};
