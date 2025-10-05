import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Investment() {
  // Real investments will be fetched from database
  const investments: any[] = [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Investment Hub</h1>
            <p className="text-muted-foreground">Virtual & Real Investment Tracking</p>
          </div>
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
                <div className="text-2xl font-bold">$0</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Current Value</div>
                <div className="text-2xl font-bold">$0</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Total Profit</div>
                <div className="text-xl font-bold">$0</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Active Investments</div>
                <div className="text-xl font-bold">0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Investments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Active Investments</h3>
              <p className="text-muted-foreground mb-6">
                Start investing to track your portfolio and earn returns!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
