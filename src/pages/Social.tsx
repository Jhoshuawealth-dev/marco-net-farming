import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Trophy, Users, ThumbsUp, Gift, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Social() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_url,
          created_at,
          user_id,
          profiles:user_id (display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost
        });

      if (error) throw error;

      toast({
        title: "Post Created!",
        description: "Your post has been shared with the community."
      });

      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleEngagement = async (postId: string, type: 'like' | 'comment' | 'share') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_engagement')
        .insert({
          post_id: postId,
          user_id: user.id,
          type: type
        });

      if (error) throw error;

      toast({
        title: "Reward Earned!",
        description: `You earned ${type === 'like' ? '50' : type === 'comment' ? '20' : '100'} credits for ${type}!`
      });
    } catch (error) {
      console.error('Error recording engagement:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Social Hub</h1>
            <p className="text-muted-foreground">Connect, Share, Earn Rewards</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">0</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-lg font-bold">0</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <div className="text-lg font-bold">0</div>
              <div className="text-sm text-muted-foreground">Reward Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Post */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Share Something
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind about farming?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleCreatePost}
              disabled={!newPost.trim() || isPosting}
              className="w-full"
            >
              {isPosting ? "Posting..." : "Share Post"}
            </Button>
          </CardContent>
        </Card>

        {/* Community Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Community Feed</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{post.profiles?.display_name || 'Anonymous'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-red-500"
                        onClick={() => handleEngagement(post.id, 'like')}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Like (+50)
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-blue-500"
                        onClick={() => handleEngagement(post.id, 'comment')}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Comment (+20)
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-green-500"
                        onClick={() => handleEngagement(post.id, 'share')}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share (+100)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Community Challenges */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Weekly Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-semibold">Share Your Best Investment Tip</div>
              <p className="text-sm opacity-90">Post your most valuable investment advice and earn up to 100 ZukaCoins!</p>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm">Ends in 3 days</div>
                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Participate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}