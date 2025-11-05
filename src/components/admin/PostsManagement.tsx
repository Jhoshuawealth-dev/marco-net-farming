import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Image, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Post {
  id: string;
  content: string;
  media_url: string | null;
  approval_status: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
  };
}

const PostsManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (postsData) {
        const postsWithProfiles = await Promise.all(
          postsData.map(async (post) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', post.user_id)
              .single();

            return {
              ...post,
              profiles: profileData || { display_name: 'Unknown User' }
            };
          })
        );
        setPosts(postsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ approval_status: 'approved' })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Post approved successfully',
      });
    } catch (error) {
      console.error('Error approving post:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve post',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ approval_status: 'rejected' })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Post rejected',
      });
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject post',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const pendingPosts = posts.filter(p => p.approval_status === 'pending');
  const approvedPosts = posts.filter(p => p.approval_status === 'approved');
  const rejectedPosts = posts.filter(p => p.approval_status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedPosts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Review and moderate user posts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No posts found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.profiles.display_name}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex items-center gap-2">
                        {post.media_url && <Image className="h-4 w-4" />}
                        <p className="truncate">{post.content || 'Media only'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.approval_status === 'approved'
                            ? 'default'
                            : post.approval_status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {post.approval_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {post.approval_status !== 'approved' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(post.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {post.approval_status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(post.id)}
                          >
                            Reject
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default PostsManagement;
