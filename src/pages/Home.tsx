import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, Users, User, Loader2, RefreshCw, DollarSign, Trophy, Coins } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useUserData } from "@/hooks/useUserData";
import { useInvestmentStats } from "@/hooks/useInvestmentStats";
import { useSocialStats } from "@/hooks/useSocialStats";
import { useTodayProfit } from "@/hooks/useTodayProfit";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { userData, loading } = useUserData();
  const { stats: investmentStats } = useInvestmentStats();
  const { stats: socialStats } = useSocialStats();
  const { profit: todayProfit } = useTodayProfit();
  const { convertFromUSD } = useCurrencyRates();
  const [showLocalCurrency, setShowLocalCurrency] = useState(false);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const walletBalanceDisplay = showLocalCurrency && userData?.currencyCode !== 'USD'
    ? convertFromUSD(userData?.walletBalance || 0, userData?.currencyCode || 'USD')
    : userData?.walletBalance || 0;

  const currencySymbol = showLocalCurrency ? userData?.currencyCode : 'USD';
  const zcToUSD = 0.01; // 1 ZC = $0.01 USD
  const zcValueUSD = (userData?.zukaBalance || 0) * zcToUSD;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Personalized Welcome Banner */}
        <Card className="bg-gradient-primary border-0 shadow-glow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarFallback className="text-2xl bg-white/10 text-white font-bold">
                  {userData?.fullName?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome back, {userData?.fullName || 'User'}!
                </h2>
                <p className="text-white/80">Ready to grow your digital farm today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Balance Card with Currency Toggle */}
        <Card 
          className="bg-gradient-secondary text-secondary-foreground border-0 shadow-glow cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setShowLocalCurrency(!showLocalCurrency)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wallet Balance</span>
              <RefreshCw className="h-5 w-5 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {currencySymbol} {walletBalanceDisplay.toFixed(2)}
            </div>
            <p className="text-sm opacity-90">
              Tap to toggle • {showLocalCurrency ? 'Local Currency' : 'USD'}
            </p>
          </CardContent>
        </Card>

        {/* ZukaCoin Balance */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              ZukaCoin Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {userData?.zukaBalance?.toFixed(2) || '0.00'} ZC
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ≈ ${zcValueUSD.toFixed(4)} USD
                </p>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-primary text-white"
              onClick={() => navigate('/crypto')}
            >
              Mine More ZC
            </Button>
          </CardContent>
        </Card>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Total Mined
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {userData?.zukaBalance?.toFixed(2) || '0'} ZC
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {investmentStats.activeCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${investmentStats.totalProfit.toFixed(2)} profit
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Social Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {socialStats.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +{socialStats.todayPoints} today
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Today's Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {todayProfit} ZC
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${(todayProfit * zcToUSD).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline"
              className="h-auto py-4"
              onClick={() => navigate('/profile')}
            >
              <div className="text-center">
                <User className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Profile</div>
              </div>
            </Button>
            <Button 
              className="h-auto py-4 bg-gradient-secondary text-secondary-foreground"
              onClick={() => navigate('/investment')}
            >
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Investment</div>
              </div>
            </Button>
            <Button 
              className="h-auto py-4 bg-primary text-primary-foreground"
              onClick={() => navigate('/social')}
            >
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Social</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
