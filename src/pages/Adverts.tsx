import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, DollarSign, TrendingUp, Play, Star } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Adverts() {
  const ads = [
    {
      id: 1,
      title: "Premium Farming Tools",
      description: "Upgrade your virtual farm with advanced tools and equipment.",
      company: "AgriTech Solutions",
      reward: 5,
      duration: "30 seconds",
      type: "video",
      rating: 4.8,
      category: "Farming"
    },
    {
      id: 2,
      title: "Investment Masterclass",
      description: "Learn professional investment strategies from market experts.",
      company: "WealthBuilder Academy",
      reward: 8,
      duration: "45 seconds",
      type: "video",
      rating: 4.9,
      category: "Education"
    },
    {
      id: 3,
      title: "Crypto Trading Platform",
      description: "Trade cryptocurrencies with zero fees for your first month.",
      company: "CryptoExchange Pro",
      reward: 12,
      duration: "60 seconds",
      type: "interactive",
      rating: 4.7,
      category: "Crypto"
    },
    {
      id: 4,
      title: "Smart Agriculture App",
      description: "Monitor your real farm with IoT sensors and AI analytics.",
      company: "SmartFarm Tech",
      reward: 6,
      duration: "25 seconds",
      type: "banner",
      rating: 4.6,
      category: "Technology"
    }
  ];

  const todayEarnings = 45;
  const totalEarnings = 1280;
  const adsWatched = 12;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Eye className="h-7 w-7 text-secondary" />
            Advert Zone
          </h1>
          <p className="text-muted-foreground">Watch ads and earn ZukaCoins</p>
        </div>

        {/* Earnings Overview */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0 shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">{todayEarnings} ZC</div>
                <div className="text-sm opacity-90">Earned Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{adsWatched}</div>
                <div className="text-sm opacity-90">Ads Watched</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalEarnings}</div>
                <div className="text-sm opacity-90">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Bonus */}
        <Card className="border-success/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold">Daily Ad Bonus</div>
                  <div className="text-sm text-muted-foreground">Watch 15 ads for extra 20 ZC</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-success">{adsWatched}/15</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Ads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Advertisements</h3>
            <Badge variant="secondary">{ads.length} Available</Badge>
          </div>
          
          {ads.map((ad) => (
            <Card key={ad.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{ad.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {ad.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{ad.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">+{ad.reward} ZC</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {ad.rating}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ad.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{ad.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{ad.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-success">+{ad.reward} ZC</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Advertisement
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ad Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              This Week's Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary">89</div>
                <div className="text-sm text-muted-foreground">Ads Watched</div>
                <div className="text-xs text-success mt-1">+23% from last week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">267 ZC</div>
                <div className="text-sm text-muted-foreground">ZC Earned</div>
                <div className="text-xs text-success mt-1">+15% from last week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">4.8⭐</div>
                <div className="text-sm text-muted-foreground">Avg Rating Given</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-info">12</div>
                <div className="text-sm text-muted-foreground">Streak Days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Ad Program */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Premium Ad Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-semibold mb-2">Unlock Higher Earning Ads</div>
                <div className="text-sm opacity-90">
                  Join our premium program to access exclusive high-value advertisements and earn up to 50 ZC per ad.
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  ✨ Up to 50 ZC per ad<br/>
                  🎯 Targeted relevant content<br/>
                  ⚡ Priority access to new ads
                </div>
                <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}