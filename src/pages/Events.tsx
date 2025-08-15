import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Gift, Star } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Events() {
  const events = [
    {
      id: 1,
      title: "Virtual Farming Championship",
      description: "Compete with farmers worldwide in our monthly farming simulation tournament.",
      date: "2024-02-15",
      time: "18:00 UTC",
      participants: 1247,
      rewards: "500 ZC + Exclusive NFT",
      status: "upcoming",
      category: "Competition"
    },
    {
      id: 2,
      title: "Investment Masterclass",
      description: "Learn advanced investment strategies from our expert panel.",
      date: "2024-02-12",
      time: "20:00 UTC",
      participants: 856,
      rewards: "Certificate + 50 ZC",
      status: "live",
      category: "Education"
    },
    {
      id: 3,
      title: "Community Harvest Festival",
      description: "Celebrate the season with special rewards and community activities.",
      date: "2024-02-20",
      time: "All Day",
      participants: 2341,
      rewards: "200 ZC + Special Items",
      status: "upcoming",
      category: "Festival"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Event Zone
          </h1>
          <p className="text-muted-foreground">Participate in events and earn exclusive rewards</p>
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-primary/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Events Joined</div>
            </CardContent>
          </Card>
          <Card className="text-center border-secondary/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-secondary">850</div>
              <div className="text-sm text-muted-foreground">ZC Earned</div>
            </CardContent>
          </Card>
          <Card className="text-center border-accent/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">3</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
        </div>

        {/* Live Event Banner */}
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                LIVE NOW
              </Badge>
            </div>
            <h3 className="text-xl font-bold mb-2">Investment Masterclass</h3>
            <p className="opacity-90 mb-4">Join now and learn from the experts!</p>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Join Event
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          
          {events.map((event) => (
            <Card key={event.id} className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge 
                        variant={event.status === 'live' ? 'destructive' : 'secondary'}
                        className={event.status === 'live' ? 'bg-red-500 animate-pulse' : ''}
                      >
                        {event.status === 'live' ? 'LIVE' : 'UPCOMING'}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className="text-success font-medium">{event.rewards}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className={`flex-1 ${event.status === 'live' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                  >
                    {event.status === 'live' ? 'Join Now' : 'Register'}
                  </Button>
                  <Button variant="outline" size="default">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Event Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Calendar header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <div 
                  key={day} 
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer
                    ${[12, 15, 20].includes(day) 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'hover:bg-muted'
                    }
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}