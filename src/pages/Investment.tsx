import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Plus, Target } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Investment() {
  const investments = [
    {
      id: 1,
      name: "Virtual Farm Portfolio",
      type: "Virtual",
      invested: 500,
      current: 672,
      profit: 172,
      profitPercent: 34.4,
      status: "active"
    },
    {
      id: 2,
      name: "Real Estate Fund",
      type: "Real",
      invested: 1000,
      current: 1120,
      profit: 120,
      profitPercent: 12.0,
      status: "active"
    },
    {
      id: 3,
      name: "Crypto Farming Pool",
      type: "Virtual",
      invested: 250,
      current: 285,
      profit: 35,
      profitPercent: 14.0,
      status: "active"
    }
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.current, 0);
  const totalProfit = totalCurrent - totalInvested;
  const totalProfitPercent = ((totalProfit / totalInvested) * 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Investment Hub</h1>
            <p className="text-muted-foreground">Virtual & Real Investment Tracking</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>

        {/* Portfolio Overview */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm opacity-90 mb-1">Total Invested</div>
                <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Current Value</div>
                <div className="text-2xl font-bold">${totalCurrent.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Total Profit</div>
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold text-green-300">
                    +${totalProfit.toLocaleString()}
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 border-green-400 text-green-300">
                    +{totalProfitPercent.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Active Investments</div>
                <div className="text-xl font-bold">{investments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Categories */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-success/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-success flex items-center gap-2">
                <Target className="h-4 w-4" />
                Virtual Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">$957</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-success" />
                +21.7% return
              </div>
            </CardContent>
          </Card>

          <Card className="border-info/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-info flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Real Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">$1,120</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-success" />
                +12.0% return
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Investments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Investments</h3>
          
          {investments.map((investment) => (
            <Card key={investment.id} className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{investment.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={investment.type === 'Virtual' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {investment.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-success text-success">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {investment.profit > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`font-semibold ${investment.profit > 0 ? 'text-success' : 'text-destructive'}`}>
                        {investment.profit > 0 ? '+' : ''}${investment.profit}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {investment.profitPercent > 0 ? '+' : ''}{investment.profitPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Invested</div>
                    <div className="font-semibold">${investment.invested}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Value</div>
                    <div className="font-semibold">${investment.current}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Opportunities */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle>New Investment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Green Energy Portfolio</div>
                  <div className="text-sm opacity-90">Expected return: 15-25%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Min. Investment</div>
                  <div className="font-semibold">$100</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}