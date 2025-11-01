import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, DollarSign, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Ad {
  id: string;
  caption: string;
  budget: number;
  spent: number;
  status: string;
  approval_status: string;
  created_at: string;
  user_id: string;
}

const AdsManagement = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAds();
    
    const channel = supabase
      .channel('ads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'adverts' }, () => {
        fetchAds();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('adverts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch ads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      const { error } = await supabase
        .from('adverts')
        .update({ approval_status: 'approved', status: 'active' })
        .eq('id', adId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Ad approved successfully',
      });
    } catch (error) {
      console.error('Error approving ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve ad',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (adId: string) => {
    try {
      const { error } = await supabase
        .from('adverts')
        .update({ approval_status: 'rejected', status: 'rejected' })
        .eq('id', adId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Ad rejected',
      });
    } catch (error) {
      console.error('Error rejecting ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject ad',
        variant: 'destructive',
      });
    }
  };

  const totalBudget = ads.reduce((sum, ad) => sum + Number(ad.budget || 0), 0);
  const totalSpent = ads.reduce((sum, ad) => sum + Number(ad.spent || 0), 0);
  const activeAds = ads.filter(ad => ad.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
          <CardDescription>Review and manage ad campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading ads...</div>
          ) : ads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No ads found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caption</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="max-w-md truncate">{ad.caption || 'No caption'}</TableCell>
                    <TableCell>${Number(ad.budget || 0).toFixed(2)}</TableCell>
                    <TableCell>${Number(ad.spent || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ad.status === 'active'
                            ? 'default'
                            : ad.status === 'completed'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {ad.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ad.approval_status === 'approved'
                            ? 'default'
                            : ad.approval_status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {ad.approval_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ad.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {ad.approval_status !== 'approved' && (
                          <Button size="sm" variant="default" onClick={() => handleApprove(ad.id)}>
                            Approve
                          </Button>
                        )}
                        {ad.approval_status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(ad.id)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsManagement;
