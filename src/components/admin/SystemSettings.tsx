import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CurrencyRate {
  id: string;
  currency_code: string;
  rate_to_usd: number;
  updated_at: string;
}

const SystemSettings = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<CurrencyRate | null>(null);
  const [formData, setFormData] = useState({
    currency_code: '',
    rate_to_usd: '1.0',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .order('currency_code');

      if (error) throw error;
      setRates(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingRate) {
        const { error } = await supabase
          .from('currency_rates')
          .update({
            rate_to_usd: parseFloat(formData.rate_to_usd),
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRate.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Exchange rate updated successfully' });
      } else {
        const { error } = await supabase
          .from('currency_rates')
          .insert({
            currency_code: formData.currency_code.toUpperCase(),
            rate_to_usd: parseFloat(formData.rate_to_usd),
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Exchange rate added successfully' });
      }

      fetchRates();
      closeDialog();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exchange rate?')) return;

    try {
      const { error } = await supabase
        .from('currency_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Exchange rate deleted successfully' });
      fetchRates();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (rate: CurrencyRate) => {
    setEditingRate(rate);
    setFormData({
      currency_code: rate.currency_code,
      rate_to_usd: rate.rate_to_usd.toString(),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRate(null);
    setFormData({
      currency_code: '',
      rate_to_usd: '1.0',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency Exchange Rates
              </CardTitle>
              <CardDescription>Manage currency conversion rates to USD</CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency Code</TableHead>
                <TableHead>Rate to USD</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-bold">{rate.currency_code}</TableCell>
                  <TableCell>{rate.rate_to_usd.toFixed(4)}</TableCell>
                  <TableCell>{new Date(rate.updated_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(rate)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(rate.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRate ? 'Edit Exchange Rate' : 'Add Exchange Rate'}</DialogTitle>
            <DialogDescription>
              {editingRate ? 'Update currency exchange rate' : 'Add a new currency exchange rate'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Currency Code</Label>
              <Input
                value={formData.currency_code}
                onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
                placeholder="USD, EUR, GBP, etc."
                disabled={!!editingRate}
                maxLength={3}
              />
            </div>
            <div>
              <Label>Rate to USD</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.rate_to_usd}
                onChange={(e) => setFormData({ ...formData, rate_to_usd: e.target.value })}
                placeholder="1.0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingRate ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SystemSettings;
