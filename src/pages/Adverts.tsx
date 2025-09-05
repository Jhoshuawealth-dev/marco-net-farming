import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, Eye, Play, Pause, Trash2, Plus, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/hooks/useUserData";

interface Ad {
  id: string;
  caption: string;
  media_url: string;
  budget: number;
  spent: number;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export default function Adverts() {
  const { user } = useAuth();
  const { userData } = useUserData();
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newAd, setNewAd] = useState({
    caption: '',
    media_url: '',
    budget: '',
    duration_days: '7'
  });

  useEffect(() => {
    fetchUserAds();
  }, [user]);

  const fetchUserAds = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('adverts' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds((data as unknown as Ad[]) || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async () => {
    if (!newAd.caption.trim() || !newAd.budget || !user) return;

    const budget = parseFloat(newAd.budget);
    if (budget <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Budget must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (!userData || userData.walletBalance < budget) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least $${budget} in your wallet to create this ad.`,
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(newAd.duration_days));

      const { error } = await supabase
        .from('adverts' as any)
        .insert({
          user_id: user.id,
          caption: newAd.caption,
          media_url: newAd.media_url || null,
          budget: budget,
          end_date: endDate.toISOString()
        });

      if (error) throw error;

      toast({
        title: "Ad Created!",
        description: `Your ad has been submitted for review. Budget of $${budget} deducted from wallet.`
      });

      setNewAd({ caption: '', media_url: '', budget: '', duration_days: '7' });
      setShowCreateForm(false);
      fetchUserAds();
    } catch (error: any) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'paused': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <TrendingUp className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Advert Manager</h1>
            <p className="text-muted-foreground">Create and manage your advertising campaigns</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Ad
          </Button>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">${userData?.walletBalance || 0}</div>
                <div className="text-sm text-muted-foreground">Available Balance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Ad Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Advertisement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="caption">Ad Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write your ad copy here..."
                  value={newAd.caption}
                  onChange={(e) => setNewAd({ ...newAd, caption: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="media_url">Media URL (Optional)</Label>
                <Input
                  id="media_url"
                  placeholder="https://example.com/image.jpg"
                  value={newAd.media_url}
                  onChange={(e) => setNewAd({ ...newAd, media_url: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="50.00"
                    value={newAd.budget}
                    onChange={(e) => setNewAd({ ...newAd, budget: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={newAd.duration_days} onValueChange={(value) => setNewAd({ ...newAd, duration_days: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">1 Week</SelectItem>
                      <SelectItem value="14">2 Weeks</SelectItem>
                      <SelectItem value="30">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAd}
                  disabled={!newAd.caption.trim() || !newAd.budget || isCreating}
                >
                  {isCreating ? "Creating..." : "Create Ad"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ads List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Advertisements</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : ads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No ads created yet. Create your first ad to reach more users!</p>
              </CardContent>
            </Card>
          ) : (
            ads.map((ad) => (
              <Card key={ad.id} className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getStatusColor(ad.status)} text-white`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(ad.status)}
                            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ad.caption}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Budget</div>
                      <div className="text-muted-foreground">${ad.budget}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Spent</div>
                      <div className="text-muted-foreground">${ad.spent}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Remaining</div>
                      <div className="text-muted-foreground">${(ad.budget - ad.spent).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Created: {new Date(ad.created_at).toLocaleDateString()}
                    {ad.end_date && (
                      <span className="ml-4">
                        Ends: {new Date(ad.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}