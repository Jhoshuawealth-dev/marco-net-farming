import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  created_by: string;
}

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    if (user) fetchRegistrations();
  }, [user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const fetchRegistrations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching registrations:', error);
    } else {
      setRegistrations(data?.map(r => r.event_id) || []);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to register for events",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('event_registrations')
      .insert({
        user_id: user.id,
        event_id: eventId
      });

    if (error) {
      console.error('Error registering:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive"
      });
    } else {
      await fetchRegistrations();
      toast({
        title: "Registration Successful!",
        description: "You're registered for this event"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Event Zone
          </h1>
          <p className="text-muted-foreground">Participate in events and earn exclusive rewards</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-primary/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-primary">{registrations.length}</div>
              <div className="text-sm text-muted-foreground">Events Joined</div>
            </CardContent>
          </Card>
          <Card className="text-center border-secondary/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-secondary">0</div>
              <div className="text-sm text-muted-foreground">ZC Earned</div>
            </CardContent>
          </Card>
          <Card className="text-center border-accent/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Events Scheduled</h3>
                <p className="text-muted-foreground">
                  Community events will be announced soon. Stay tuned for exciting competitions and learning opportunities!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(event.event_date).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        {registrations.includes(event.id) ? (
                          <Button variant="secondary" disabled>
                            <Users className="h-4 w-4 mr-2" />
                            Registered
                          </Button>
                        ) : (
                          <Button onClick={() => handleRegister(event.id)}>
                            Register Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
