import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useMining = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);

  const startMining = async () => {
    if (!user || isMining) return;

    setIsMining(true);
    setMiningProgress(0);

    const miningDuration = 10000; // 10 seconds
    const interval = setInterval(() => {
      setMiningProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          completeMining();
          return 100;
        }
        return newProgress;
      });
    }, miningDuration / 10);
  };

  const completeMining = async () => {
    if (!user) return;

    try {
      const minedAmount = Math.random() * 10 + 5; // Random amount between 5-15 ZC

      const { error } = await supabase
        .from('mining_records')
        .insert({
          user_id: user.id,
          mined_amount: minedAmount
        });

      if (error) throw error;

      toast({
        title: "Mining Complete!",
        description: `You mined ${minedAmount.toFixed(2)} ZukaCoin!`
      });

      setIsMining(false);
      setMiningProgress(0);
    } catch (error) {
      console.error('Error completing mining:', error);
      toast({
        title: "Mining Error",
        description: "Failed to complete mining. Please try again.",
        variant: "destructive"
      });
      setIsMining(false);
      setMiningProgress(0);
    }
  };

  return {
    isMining,
    miningProgress,
    startMining
  };
};