import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  walletBalance: number;
  zukaBalance: number;
  fullName: string;
  country: string;
  currencyCode: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('wallet_balance, zuka_balance, full_name, country, currency_code')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data) {
          setUserData({
            walletBalance: data.wallet_balance || 0,
            zukaBalance: data.zuka_balance || 0,
            fullName: data.full_name || '',
            country: data.country || '',
            currencyCode: data.currency_code || 'USD'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return { userData, loading };
};