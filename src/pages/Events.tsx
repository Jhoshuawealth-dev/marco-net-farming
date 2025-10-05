import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Events() {
  // Real events will be fetched from database
  const events: any[] = [];

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
              <div className="text-2xl font-bold text-primary">0</div>
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

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Events Scheduled</h3>
              <p className="text-muted-foreground">
                Community events will be announced soon. Stay tuned for exciting competitions and learning opportunities!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
