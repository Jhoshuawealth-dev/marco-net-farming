import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, Coins, TrendingUp, Users, Pickaxe, DollarSign, User } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useUserData } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { userData, loading } = useUserData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  const walletBalance = userData?.walletBalance || 0;
  const zukaBalance = userData?.zukaBalance || 0;
  const currency = userData?.currencyCode || "USD";
  const zukaToUsd = (zukaBalance / 1000) * 1.5; // 1000 ZC = $1.5 USD

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Marco-net Farming
          </h1>
          <p className="text-muted-foreground">Your Digital Farming Empire</p>
        </div>

        {/* Main Wallet Card */}
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Balance
              </span>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {currency}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              ${walletBalance.toLocaleString()}
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Click to toggle currency
            </p>
          </CardContent>
        </Card>

        {/* ZukaCoin Balance */}
        <Card className="border-accent/50 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-accent">
              <Coins className="h-5 w-5" />
              ZukaCoin Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-accent">
                  {zukaBalance.toLocaleString()} ZC
                </div>
                <p className="text-sm text-muted-foreground">
                  ≈ ${zukaToUsd.toFixed(2)} USD
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  1000 ZC = $1.5 USD
                </p>
              </div>
              <Button 
                size="sm" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/crypto')}
              >
                <Pickaxe className="h-4 w-4 mr-1" />
                Mine More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-success/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-success">
                <Pickaxe className="h-4 w-4" />
                Total Mined
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{zukaBalance.toFixed(2)} ZC</div>
            </CardContent>
          </Card>

          <Card className="border-warning/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-warning">
                <TrendingUp className="h-4 w-4" />
                Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">0 Active</div>
            </CardContent>
          </Card>

          <Card className="border-info/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-info">
                <Users className="h-4 w-4" />
                Social Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="border-secondary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-secondary">
                <DollarSign className="h-4 w-4" />
                Today's Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-success">$0.00</div>
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