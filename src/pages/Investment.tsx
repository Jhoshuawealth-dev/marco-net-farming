import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, PieChart, Plus, DollarSign, Clock, Target, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useInvestmentStats } from "@/hooks/useInvestmentStats";

interface Investment {
  id: string;
  investment_name: string;
  profit: number;
  status: string;
  created_at: string;
}

export default function Investment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { stats, loading: statsLoading } = useInvestmentStats();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [investmentName, setInvestmentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, [user]);

  const fetchInvestments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('investment_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments((data as Investment[]) || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestment = async () => {
    if (!investmentName.trim() || !user) return;

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('investment_records')
        .insert({
          user_id: user.id,
          investment_name: investmentName,
          profit: 0,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Investment Created!",
        description: `Your investment "${investmentName}" has been created successfully.`
      });

      setInvestmentName('');
      setIsDialogOpen(false);
      await fetchInvestments();
    } catch (error) {
      console.error('Error creating investment:', error);
      toast({
        title: "Error",
        description: "Failed to create investment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Investment Hub</h1>
            <p className="text-muted-foreground">Virtual & Real Investment Tracking</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Investment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Investment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="investment-name">Investment Name</Label>
                  <Input
                    id="investment-name"
                    placeholder="e.g., Tech Stocks, Real Estate Fund"
                    value={investmentName}
                    onChange={(e) => setInvestmentName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateInvestment}
                  disabled={!investmentName.trim() || isCreating}
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Investment'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                <div className="text-2xl font-bold">${stats.totalInvested.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Current Value</div>
                <div className="text-2xl font-bold">${stats.currentValue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Total Profit</div>
                <div className="text-xl font-bold text-success">${stats.totalProfit.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Active Investments</div>
                <div className="text-xl font-bold">{stats.activeCount}</div>
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
            {investments.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Active Investments</h3>
                <p className="text-muted-foreground mb-6">
                  Start investing to track your portfolio and earn returns!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((investment) => (
                  <Card key={investment.id} className="border-accent/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{investment.investment_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date(investment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-success">
                            +${Number(investment.profit).toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground">Profit</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium capitalize">{investment.status}</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          65% to maturity
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
