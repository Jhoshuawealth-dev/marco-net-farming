import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, DollarSign, CheckCircle, XCircle, Trash2, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  email: string;
  full_name: string;
  country: string;
  wallet_balance: number;
  zuka_balance: number;
  verification_status: string;
  created_at: string;
}

const UsersManagementAdvanced = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogType, setDialogType] = useState<'balance' | 'verification' | 'delete' | 'role' | null>(null);
  const [walletChange, setWalletChange] = useState('0');
  const [zukaChange, setZukaChange] = useState('0');
  const [reason, setReason] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [roleToAssign, setRoleToAssign] = useState<'admin' | 'moderator' | 'user'>('user');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
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

  const handleUpdateBalance = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc('admin_update_user_balance', {
        _user_id: selectedUser.id,
        _wallet_change: parseFloat(walletChange),
        _zuka_change: parseFloat(zukaChange),
        _reason: reason,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User balance updated successfully',
      });

      fetchUsers();
      closeDialog();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateVerification = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc('admin_update_verification_status', {
        _user_id: selectedUser.id,
        _status: verificationStatus,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Verification status updated successfully',
      });

      fetchUsers();
      closeDialog();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        _user_id: selectedUser.id,
        _reason: reason,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      fetchUsers();
      closeDialog();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: roleToAssign,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Role ${roleToAssign} assigned successfully`,
      });

      closeDialog();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedUser(null);
    setWalletChange('0');
    setZukaChange('0');
    setReason('');
    setVerificationStatus('');
  };

  const openDialog = (user: User, type: typeof dialogType) => {
    setSelectedUser(user);
    setDialogType(type);
    if (type === 'verification') {
      setVerificationStatus(user.verification_status);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <CardTitle>Advanced User Management</CardTitle>
          <CardDescription>Full control over user accounts, balances, and permissions</CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Wallet Balance</TableHead>
                <TableHead>Zuka Balance</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>${user.wallet_balance.toFixed(2)}</TableCell>
                  <TableCell>{user.zuka_balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={user.verification_status === 'verified' ? 'default' : 'secondary'}>
                      {user.verification_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDialog(user, 'balance')}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Edit Balance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(user, 'verification')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Change Verification
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(user, 'role')}>
                          <Shield className="h-4 w-4 mr-2" />
                          Assign Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(user, 'delete')} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Balance Dialog */}
      <Dialog open={dialogType === 'balance'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Balance</DialogTitle>
            <DialogDescription>
              Modify wallet and Zuka balance for {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Wallet Change (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={walletChange}
                onChange={(e) => setWalletChange(e.target.value)}
                placeholder="Enter amount (positive to add, negative to subtract)"
              />
            </div>
            <div>
              <Label>Zuka Change</Label>
              <Input
                type="number"
                step="0.01"
                value={zukaChange}
                onChange={(e) => setZukaChange(e.target.value)}
                placeholder="Enter amount (positive to add, negative to subtract)"
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for balance change"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleUpdateBalance}>Update Balance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={dialogType === 'verification'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Verification Status</DialogTitle>
            <DialogDescription>
              Change verification status for {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Verification Status</Label>
            <Select value={verificationStatus} onValueChange={setVerificationStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleUpdateVerification}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Assignment Dialog */}
      <Dialog open={dialogType === 'role'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Role</Label>
            <Select value={roleToAssign} onValueChange={(value: any) => setRoleToAssign(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleAssignRole}>Assign Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.full_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Reason for Deletion</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for deletion"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersManagementAdvanced;
