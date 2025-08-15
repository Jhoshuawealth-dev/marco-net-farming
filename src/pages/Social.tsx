import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Plus, Users, Trophy } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Social() {
  const posts = [
    {
      id: 1,
      user: "FarmKing",
      avatar: "👨‍🌾",
      content: "Just harvested my first virtual tomatoes! 🍅 Earned 25 ZukaCoins from this week's farming simulation.",
      likes: 42,
      comments: 8,
      shares: 3,
      time: "2h ago",
      rewards: 15
    },
    {
      id: 2,
      user: "CryptoFarmer",
      avatar: "👩‍🌾",
      content: "My investment portfolio is looking green! 📈 Up 12% this month thanks to the community tips.",
      likes: 28,
      comments: 5,
      shares: 7,
      time: "4h ago",
      rewards: 22
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Social Hub</h1>
            <p className="text-muted-foreground">Connect, Share, Earn Rewards</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-lg font-bold">3,892</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <div className="text-lg font-bold">127</div>
              <div className="text-sm text-muted-foreground">Reward Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Community Feed</h3>
          
          {posts.map((post) => (
            <Card key={post.id} className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{post.user}</div>
                      <div className="text-sm text-muted-foreground">{post.time}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    +{post.rewards} ZC
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm leading-relaxed">{post.content}</p>
                
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                      <Share2 className="h-4 w-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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