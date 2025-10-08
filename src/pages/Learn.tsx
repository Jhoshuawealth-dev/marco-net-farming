import { useState, useEffect } from "react";
import { BookOpen, Trophy, Clock, PlayCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  video_url: string;
  reward: number;
}

interface CourseProgress {
  course_id: string;
  completed: boolean;
}

export default function Learn() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    if (user) fetchProgress();
  }, [user]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const fetchProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data || []);
    }
  };

  const completedCount = progress.filter(p => p.completed).length;
  const inProgressCount = progress.filter(p => !p.completed).length;
  const totalEarned = progress
    .filter(p => p.completed)
    .reduce((sum, p) => {
      const course = courses.find(c => c.id === p.course_id);
      return sum + (course?.reward || 0);
    }, 0);

  const handleStartCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start courses",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('course_progress')
      .insert({
        user_id: user.id,
        course_id: courseId,
        completed: false
      });

    if (error && error.code !== '23505') {
      console.error('Error starting course:', error);
      toast({
        title: "Error",
        description: "Failed to start course",
        variant: "destructive"
      });
    } else {
      await fetchProgress();
      toast({
        title: "Course Started!",
        description: "Good luck with your learning journey!"
      });
    }
  };

  const handleCompleteCourse = async (courseId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('course_progress')
      .update({ completed: true })
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error completing course:', error);
      toast({
        title: "Error",
        description: "Failed to mark course as complete",
        variant: "destructive"
      });
    } else {
      await fetchProgress();
      const course = courses.find(c => c.id === courseId);
      toast({
        title: "Course Completed!",
        description: `You earned ${course?.reward || 0} ZC!`
      });
    }
  };

  const isCourseCompleted = (courseId: string) => {
    return progress.some(p => p.course_id === courseId && p.completed);
  };

  const isCourseInProgress = (courseId: string) => {
    return progress.some(p => p.course_id === courseId && !p.completed);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Learn Hub
          </h1>
          <p className="text-muted-foreground">Complete courses to earn ZukaCoins</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center border-success/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-success">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center border-warning/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-warning">{inProgressCount}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center border-accent/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">{totalEarned}</div>
              <div className="text-sm text-muted-foreground">ZC Earned</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Courses Available Yet</h3>
                <p className="text-muted-foreground">
                  Educational courses will be added soon. Check back later to start learning and earning rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{course.reward} ZC</span>
                        </div>
                        {isCourseCompleted(course.id) ? (
                          <Button variant="secondary" disabled>
                            <Trophy className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        ) : isCourseInProgress(course.id) ? (
                          <Button onClick={() => handleCompleteCourse(course.id)}>
                            Mark Complete
                          </Button>
                        ) : (
                          <Button onClick={() => handleStartCourse(course.id)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start Course
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
