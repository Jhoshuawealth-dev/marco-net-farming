import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pickaxe, Zap, Clock, TrendingUp, Coins, Award } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Crypto() {
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [dailyMined, setDailyMined] = useState(45.2);

  const startMining = () => {
    setIsMining(true);
    setMiningProgress(0);
    
    const interval = setInterval(() => {
      setMiningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMining(false);
          setDailyMined(prev => prev + 2.5);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
  };

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
              <p className="text-xs text-muted-foreground">+15% from yesterday</p>
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
                <div className="text-sm font-medium">Level 3</div>
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
            <div className="space-y-3">
              {[
                { time: "2 hours ago", amount: 2.5, duration: "5:00" },
                { time: "5 hours ago", amount: 2.5, duration: "5:00" },
                { time: "8 hours ago", amount: 2.5, duration: "5:00" }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">Mining Session</div>
                    <div className="text-sm text-muted-foreground">{session.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-accent">+{session.amount} ZC</div>
                    <div className="text-sm text-muted-foreground">{session.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0">
          <CardHeader>
            <CardTitle>Upgrade Your Mining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Premium Mining Tools</div>
                  <div className="text-sm opacity-90">Increase mining rate by 50%</div>
                </div>
                <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                  50 ZC
                </Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}