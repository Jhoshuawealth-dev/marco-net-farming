import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pickaxe, Zap, Clock, TrendingUp, Coins, Award } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useMining } from "@/hooks/useMining";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface MiningRecord {
  id: string;
  mined_amount: number;
  date_mined: string;
  created_at: string;
}

export default function Crypto() {
  const { user } = useAuth();
  const { isMining, miningProgress, startMining } = useMining();
  const [dailyMined, setDailyMined] = useState(0);
  const [miningHistory, setMiningHistory] = useState<MiningRecord[]>([]);

  useEffect(() => {
    if (!user) return;

    // Fetch today's mining total
    const fetchDailyMined = async () => {
      const { data, error } = await supabase
        .from('mining_records')
        .select('mined_amount')
        .eq('user_id', user.id)
        .eq('date_mined', new Date().toISOString().split('T')[0]);

      if (!error && data) {
        const total = data.reduce((sum, record) => sum + record.mined_amount, 0);
        setDailyMined(total);
      }
    };

    // Fetch mining history (last 10 sessions)
    const fetchMiningHistory = async () => {
      const { data, error } = await supabase
        .from('mining_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setMiningHistory(data);
      }
    };

    fetchDailyMined();
    fetchMiningHistory();

    // Subscribe to new mining records
    const channel = supabase
      .channel('mining-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mining_records',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          fetchDailyMined();
          fetchMiningHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Coins className="h-7 w-7 text-accent" />
            ZukaCoin Mining
          </h1>
          <p className="text-muted-foreground">Simulate farming activities to earn ZukaCoins</p>
        </div>

        {/* Mining Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-accent/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-accent">Today's Mining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{dailyMined.toFixed(1)} ZC</div>
              <p className="text-xs text-muted-foreground">Start mining to earn</p>
            </CardContent>
          </Card>
          
          <Card className="border-secondary/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-secondary">Mining Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">2.5 ZC/min</div>
              <p className="text-xs text-muted-foreground">Current rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Mining Interface */}
        <Card className="bg-gradient-dark border-accent/30 shadow-glow">
          <CardHeader>
            <CardTitle className="text-center text-accent">Mining Simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-accent/30 animate-pulse delay-75" />
                <div className="absolute inset-4 rounded-full bg-accent/40 animate-pulse delay-150" />
                <div className="absolute inset-8 rounded-full bg-accent flex items-center justify-center">
                  <Pickaxe className={`h-8 w-8 text-white ${isMining ? 'animate-bounce' : ''}`} />
                </div>
              </div>
              
              {isMining && (
                <div className="space-y-3">
                  <Progress value={miningProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">Mining in progress... {miningProgress}%</p>
                </div>
              )}
            </div>

            <Button 
              onClick={startMining}
              disabled={isMining}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg"
            >
              {isMining ? (
                <>
                  <Zap className="h-5 w-5 mr-2 animate-pulse" />
                  Mining...
                </>
              ) : (
                <>
                  <Pickaxe className="h-5 w-5 mr-2" />
                  Start Mining Session
                </>
              )}
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">5 min</div>
                <div className="text-xs text-muted-foreground">Session</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">+2.5 ZC</div>
                <div className="text-xs text-muted-foreground">Per session</div>
              </div>
              <div className="text-center">
                <Award className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-sm font-medium">Level 1</div>
                <div className="text-xs text-muted-foreground">Miner rank</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mining History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Mining Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {miningHistory.length > 0 ? (
              <div className="space-y-3">
                {miningHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-accent/20">
                        <Coins className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium">+{record.mined_amount.toFixed(2)} ZC</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(record.created_at), 'MMM dd, yyyy - HH:mm')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-accent/20 text-accent border-0">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Your mining history will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}