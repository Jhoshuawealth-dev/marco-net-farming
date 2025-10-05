import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, CheckCircle, Clock, Trophy, Target } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Learn() {
  // Real courses will be fetched from database
  const courses: any[] = [];
  const achievements: any[] = [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Learn Hub
          </h1>
          <p className="text-muted-foreground">Expand your knowledge and earn rewards</p>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-success/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-success">0</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center border-warning/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-warning">0</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center border-accent/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-sm text-muted-foreground">ZC Earned</div>
            </CardContent>
          </Card>
        </div>


        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Courses Available Yet</h3>
              <p className="text-muted-foreground">
                Educational courses will be added soon. Check back later to start learning and earning rewards!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}