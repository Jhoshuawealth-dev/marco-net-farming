import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, CheckCircle, Clock, Trophy, Target } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function Learn() {
  const courses = [
    {
      id: 1,
      title: "Farming Fundamentals",
      description: "Learn the basics of virtual farming and crop management.",
      lessons: 8,
      duration: "2 hours",
      progress: 75,
      level: "Beginner",
      rewards: "50 ZC + Certificate",
      completed: false
    },
    {
      id: 2,
      title: "Investment Strategies",
      description: "Master the art of profitable investment decisions.",
      lessons: 12,
      duration: "4 hours",
      progress: 33,
      level: "Intermediate",
      rewards: "100 ZC + Certificate",
      completed: false
    },
    {
      id: 3,
      title: "Cryptocurrency Basics",
      description: "Understanding digital currencies and blockchain technology.",
      lessons: 6,
      duration: "1.5 hours",
      progress: 100,
      level: "Beginner",
      rewards: "75 ZC + Certificate",
      completed: true
    }
  ];

  const achievements = [
    { name: "First Course Completed", icon: "🎓", unlocked: true },
    { name: "Knowledge Seeker", icon: "📚", unlocked: true },
    { name: "Investment Expert", icon: "💰", unlocked: false },
    { name: "Master Farmer", icon: "🌾", unlocked: false }
  ];

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
              <div className="text-2xl font-bold text-success">1</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center border-warning/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-warning">2</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center border-accent/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-accent">225</div>
              <div className="text-sm text-muted-foreground">ZC Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Course */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0 shadow-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">🌟 Featured Course</CardTitle>
                <p className="opacity-90">Advanced Trading Techniques</p>
              </div>
              <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                New
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm opacity-90">
                Master advanced trading strategies and maximize your investment returns.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  15 lessons
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  6 hours
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  200 ZC
                </div>
              </div>
              <Button variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30">
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Courses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Courses</h3>
          
          {courses.map((course) => (
            <Card key={course.id} className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {course.completed && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={course.level === 'Beginner' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-accent text-accent">
                        {course.rewards}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    {course.completed ? 'Review' : 'Continue'}
                  </Button>
                  <Button variant="outline">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Learning Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border
                    ${achievement.unlocked 
                      ? 'border-success/50 bg-success/5' 
                      : 'border-muted bg-muted/5'
                    }
                  `}
                >
                  <div className={`text-2xl ${!achievement.unlocked ? 'grayscale opacity-50' : ''}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <div className={`font-medium ${!achievement.unlocked ? 'text-muted-foreground' : ''}`}>
                      {achievement.name}
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="h-4 w-4 text-success mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Goals */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Learning Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Complete 3 lessons this week</span>
                <span className="font-semibold">2/3</span>
              </div>
              <Progress value={67} className="h-2 bg-white/20" />
              <div className="text-sm opacity-90">
                🎯 Reward: 25 ZC bonus for achieving your goal!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}