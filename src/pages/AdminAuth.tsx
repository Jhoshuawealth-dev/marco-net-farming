import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Admin Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .rpc('has_role', { _user_id: authData.user.id, _role: 'admin' });

        if (roleError) throw roleError;

        if (!roleData) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges. Please use the regular user login.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate('/admin');
      } else {
        // Admin Registration
        // Verify admin code (you can change this to your secret code)
        if (adminCode !== 'MARCONET-ADMIN-2025') {
          toast({
            title: "Invalid Admin Code",
            description: "Please enter a valid admin registration code.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              full_name: fullName,
              user_type: 'admin'
            }
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create user profile for admin
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email,
              full_name: fullName,
              country: 'Admin',
              currency_code: 'USD',
            });

          if (userError && userError.code !== '23505') { // Ignore duplicate key errors
            throw userError;
          }

          // Assign admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: 'admin',
            });

          if (roleError && roleError.code !== '23505') { // Ignore duplicate key errors
            throw roleError;
          }

          toast({
            title: "Success",
            description: "Admin account created successfully! Please login.",
          });
          
          // Switch to login tab
          setIsLogin(true);
          setEmail(email);
          setPassword('');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Admin {isLogin ? 'Login' : 'Registration'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your admin credentials to access the dashboard'
              : 'Create a new admin account with registration code'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLogin && (
            <Alert className="mb-4 border-primary/20 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                Admin accounts are separate from regular user accounts and require a registration code.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Admin Registration Code</Label>
                  <Input
                    id="adminCode"
                    type="password"
                    placeholder="Enter admin registration code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact system administrator for the registration code
                  </p>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? 'Login' : 'Create Admin Account'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin 
                  ? "Don't have an admin account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Regular User?</span>
              </div>
            </div>
            
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                Go to User Login
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
