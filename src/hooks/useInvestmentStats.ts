import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InvestmentStats {
  totalInvested: number;
  currentValue: number;
  totalProfit: number;
  activeCount: number;
}

export const useInvestmentStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<InvestmentStats>({
    totalInvested: 0,
    currentValue: 0,
    totalProfit: 0,
    activeCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('investment_records')
          .select('profit, status')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const activeInvestments = data.filter(inv => inv.status === 'active');
          const totalProfit = data.reduce((sum, inv) => sum + Number(inv.profit || 0), 0);
          
          setStats({
            totalInvested: activeInvestments.length * 100, // Assuming base investment amount
            currentValue: activeInvestments.length * 100 + totalProfit,
            totalProfit: totalProfit,
            activeCount: activeInvestments.length
          });
        }
      } catch (error) {
        console.error('Error fetching investment stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};
