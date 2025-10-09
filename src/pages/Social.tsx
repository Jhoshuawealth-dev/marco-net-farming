import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Trophy, Users, ThumbsUp, Gift, Plus, Megaphone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  content: string;
  media_url: string | null;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string;
  };
}

interface Ad {
  id: string;
  caption: string;
  media_url: string | null;
  budget: number;
  spent: number;
  status: string;
  user_id: string;
  profiles?: {
    display_name: string;
  };
}

export default function Social() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [feedItems, setFeedItems] = useState<(Post | Ad & { isAd: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [dailyLimits, setDailyLimits] = useState({ posts: 0, likes: 0, comments: 0 });
  const [trackedAds, setTrackedAds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
    fetchAds();
    fetchDailyLimits();

    // Subscribe to real-time updates for approved posts
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `user_id=eq.${user?.id}`
        },
        (payload: any) => {
          console.log('Post change detected:', payload);
          
          // Show notification if user's post was just approved
          if (payload.new?.approval_status === 'approved' && payload.old?.approval_status === 'pending') {
            toast({
              title: "🎉 Post Approved!",
              description: "Your post has been approved and is now visible to everyone. You earned 50 ZC!",
              duration: 5000
            });
          }
          
          fetchPosts(); // Refresh posts when a post is approved
        }
      )
      .subscribe();

    // Subscribe to real-time updates for approved ads
    const adsChannel = supabase
      .channel('ads-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'adverts',
          filter: `user_id=eq.${user?.id}`
        },
        (payload: any) => {
          console.log('Ad change detected:', payload);
          
          // Show notification if user's ad was just approved
          if (payload.new?.approval_status === 'approved' && payload.old?.approval_status === 'pending') {
            toast({
              title: "🎉 Ad Approved!",
              description: "Your advertisement has been approved and is now showing in the feed!",
              duration: 5000
            });
          }
          
          fetchAds(); // Refresh ads when an ad is approved
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(adsChannel);
    };
  }, []);

  const fetchDailyLimits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('daily_limits' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('limit_date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const limitData = data as any;
        setDailyLimits({
          posts: limitData.posts_created || 0,
          likes: limitData.likes_given || 0,
          comments: limitData.comments_given || 0
        });
      }
    } catch (error) {
      console.error('Error fetching daily limits:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts' as any)
        .select(`
          id,
          content,
          media_url,
          created_at,
          user_id,
          approval_status,
          profiles:user_id (display_name)
        `)
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as unknown as Post[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('adverts' as any)
        .select(`
          id,
          caption,
          media_url,
          budget,
          spent,
          status,
          user_id,
          profiles:user_id (display_name)
        `)
        .eq('status', 'active')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds((data as unknown as Ad[]) || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  // Combine posts and ads for feed display (Facebook-style)
  useEffect(() => {
    const filterAdsWithDailyLimit = async () => {
      const combinedFeed = [];
      let adIndex = 0;
      
      // PHASE 4 FIX: Filter ads that haven't reached daily limit
      const adsToShow: (Ad & { isAd: boolean })[] = [];
      
      for (const ad of ads) {
        try {
          const { data, error } = await supabase.rpc('can_show_ad_today', { ad_uuid: ad.id });
          
          if (!error && data === true) {
            // Only add ads that can still be shown today (under 5 impressions)
            for (let i = 0; i < 5; i++) {
              adsToShow.push({ ...ad, isAd: true });
            }
          }
        } catch (error) {
          console.error('Error checking ad limit:', error);
        }
      }
    
      // Mix posts and ads - insert an ad every 3-4 posts
      for (let i = 0; i < posts.length; i++) {
        combinedFeed.push(posts[i]);
        
        // Insert ad after every 3 posts, but only if we have ads to show
        if ((i + 1) % 3 === 0 && adIndex < adsToShow.length) {
          combinedFeed.push(adsToShow[adIndex]);
          adIndex++;
        }
      }
      
      // Add remaining ads at the end if any
      while (adIndex < adsToShow.length) {
        combinedFeed.push(adsToShow[adIndex]);
        adIndex++;
      }
      
      setFeedItems(combinedFeed);
      setLoading(false);
    };
    
    filterAdsWithDailyLimit();
  }, [posts, ads]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    if (dailyLimits.posts >= 2) {
      toast({
        title: "Daily Limit Reached",
        description: "You can only create 2 posts per day.",
        variant: "destructive"
      });
      return;
    }

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('posts' as any)
        .insert({
          user_id: user.id,
          content: newPost,
          approval_status: 'pending'
        });

      if (error) throw error;

      // Increment daily limit
      await supabase.rpc('increment_daily_limit', { limit_type: 'post' });

      toast({
        title: "Post Submitted!",
        description: "Your post is pending admin approval. You'll earn 50 ZC once approved. Typical approval time: 24-48 hours."
      });

      setNewPost('');
      setDailyLimits(prev => ({ ...prev, posts: prev.posts + 1 }));
      await fetchPosts();
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

  const handleEngagement = async (postId: string, type: 'like' | 'comment' | 'share', postOwnerId: string) => {
    if (!user) return;

    // Check if user is engaging with their own post
    if (postOwnerId === user.id) {
      toast({
        title: "Not Allowed",
        description: "You cannot engage with your own posts.",
        variant: "destructive"
      });
      return;
    }

    // Check daily limits for likes and comments
    if (type === 'like' && dailyLimits.likes >= 10) {
      toast({
        title: "Daily Limit Reached",
        description: "You can only like 10 posts per day.",
        variant: "destructive"
      });
      return;
    }

    if (type === 'comment' && dailyLimits.comments >= 10) {
      toast({
        title: "Daily Limit Reached",
        description: "You can only comment on 10 posts per day.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('social_engagement' as any)
        .insert({
          post_id: postId,
          user_id: user.id,
          engagement_type: type
        });

      if (error) {
        // Check if already engaged (duplicate key error)
        if (error.code === '23505') {
          toast({
            title: "Already Engaged",
            description: `You've already ${type}d this post!`,
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      // Increment daily limit for likes and comments
      if (type === 'like' || type === 'comment') {
        await supabase.rpc('increment_daily_limit', { limit_type: type });
        setDailyLimits(prev => ({
          ...prev,
          [type === 'like' ? 'likes' : 'comments']: prev[type === 'like' ? 'likes' : 'comments'] + 1
        }));
      }

      // Reward is automatically added by database trigger
      const reward = type === 'like' ? 20 : type === 'comment' ? 20 : 100;
      toast({
        title: "Reward Earned!",
        description: `You earned ${reward} ZC for ${type}!`
      });

      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error recording engagement:', error);
      toast({
        title: "Error",
        description: "Failed to record engagement",
        variant: "destructive"
      });
    }
  };

  const trackAdImpression = async (adId: string) => {
    if (!user) return;
    
    // Prevent duplicate impressions in the same session
    if (trackedAds.has(adId)) return;

    try {
      // Increment the ad daily impression count
      await supabase.rpc('increment_ad_impression', { ad_uuid: adId });
      
      // Also track individual user impression
      await supabase
        .from('ad_impressions' as any)
        .insert({
          ad_id: adId,
          user_id: user.id,
          impression_type: 'view'
        });
      
      // Mark this ad as tracked in this session
      setTrackedAds(prev => new Set([...prev, adId]));
    } catch (error) {
      console.error('Error tracking ad impression:', error);
    }
  };

  const renderFeedItem = (item: any, index: number) => {
    const isAd = 'isAd' in item;
    
    if (isAd) {
      // PHASE 4 FIX: Track impression only if not already tracked AND check daily limit
      if (!trackedAds.has(item.id)) {
        // Check if this ad can be shown today before tracking
        supabase.rpc('can_show_ad_today', { ad_uuid: item.id }).then(({ data, error }) => {
          if (error) {
            console.error('Error checking ad daily limit:', error);
            return;
          }
          
          // Only track if the ad hasn't reached its daily limit
          if (data === true) {
            trackAdImpression(item.id);
          }
        });
      }
      
      return (
        <Card key={`ad-${item.id}`} className="shadow-md border-2 border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-full">
                  <Megaphone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.profiles?.display_name || 'Sponsor'}</div>
                    <Badge variant="secondary" className="text-xs">Sponsored</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Promoted Content
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm leading-relaxed">{item.caption}</p>
            {item.media_url && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={item.media_url} 
                  alt="Ad content" 
                  className="w-full h-auto max-h-64 object-cover"
                />
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Budget: ${item.budget} • Spent: ${item.spent}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={item.id} className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {item.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.profiles?.display_name || 'Anonymous'}</div>
                  {item.user_id === user?.id && (
                    <Badge variant={item.approval_status === 'approved' ? 'default' : 'secondary'}>
                      {item.approval_status === 'approved' ? 'Approved' : 'Pending'}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm leading-relaxed">{item.content}</p>
          
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-red-500"
                onClick={() => handleEngagement(item.id, 'like', item.user_id)}
              >
                <Heart className="h-4 w-4 mr-1" />
                Like (+20 ZC)
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-blue-500"
                onClick={() => handleEngagement(item.id, 'comment', item.user_id)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Comment (+20 ZC)
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-green-500"
                onClick={() => handleEngagement(item.id, 'share', item.user_id)}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share (+100 ZC)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Social Feed</h1>
            <p className="text-muted-foreground">Connect, share, and earn rewards</p>
          </div>
        </div>

        {/* Daily Limits Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">{dailyLimits.posts}/2</div>
              <div className="text-sm text-muted-foreground">Posts Today</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-lg font-bold">{dailyLimits.likes}/10</div>
              <div className="text-sm text-muted-foreground">Likes Given</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-lg font-bold">{dailyLimits.comments}/10</div>
              <div className="text-sm text-muted-foreground">Comments Given</div>
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
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Posts today: {dailyLimits.posts}/2 • Earn 50 ZC per approved post
              </div>
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim() || isPosting || dailyLimits.posts >= 2}
                className="w-auto"
              >
                {isPosting ? "Posting..." : "Share Post"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Feed</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : feedItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No approved posts yet. Create a post and wait for admin approval!</p>
              </CardContent>
            </Card>
          ) : (
            feedItems.map((item, index) => renderFeedItem(item, index))
          )}
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              How to Earn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">• Create posts: 50 ZC (pending approval)</div>
              <div className="text-sm">• Like posts: 20 ZC (max 10/day)</div>
              <div className="text-sm">• Comment: 20 ZC (max 10/day)</div>
              <div className="text-sm">• Share posts: 100 ZC (unlimited)</div>
              <p className="text-xs opacity-90 mt-4">All posts require admin approval before appearing in the feed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}