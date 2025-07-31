import { WellnessCard } from "@/components/WellnessCard";
import { Heart, Moon, CheckSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  // Simulate today's data (in real app, this would come from localStorage/API)
  const todayStats = {
    mood: { logged: true, value: "😊 Content" },
    sleep: { logged: true, hours: 7.5, quality: "Restful" },
    tasks: { completed: 5, total: 7 },
    streak: 12
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-wellness text-white p-6 md:p-8 rounded-b-3xl mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getWelcomeMessage()}! ✨
          </h1>
          <p className="text-white/90 mb-4">
            Track your wellness journey with evidence-based insights
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {todayStats.streak} day streak 🔥
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Week 24
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Today's Snapshot */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Today's Wellness Snapshot
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mood Card */}
            <WellnessCard
              title="Mood"
              icon={<Heart className="w-5 h-5 text-primary" />}
              variant="mood"
            >
              {todayStats.mood.logged ? (
                <div className="space-y-2">
                  <div className="text-2xl font-semibold">
                    {todayStats.mood.value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Positive emotions support healthy development
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground">Not tracked yet today</p>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/trackers")}
                    className="w-full"
                  >
                    Log Mood
                  </Button>
                </div>
              )}
            </WellnessCard>

            {/* Sleep Card */}
            <WellnessCard
              title="Sleep"
              icon={<Moon className="w-5 h-5 text-white" />}
              variant="sleep"
            >
              {todayStats.sleep.logged ? (
                <div className="space-y-2">
                  <div className="text-2xl font-semibold text-white">
                    {todayStats.sleep.hours}h
                  </div>
                  <p className="text-sm text-white/80">
                    {todayStats.sleep.quality} • Great for baby's growth
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white/80">Not tracked yet</p>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/trackers")}
                    className="w-full bg-white text-sleep-primary hover:bg-white/90"
                  >
                    Log Sleep
                  </Button>
                </div>
              )}
            </WellnessCard>

            {/* Tasks Card */}
            <WellnessCard
              title="Daily Tasks"
              icon={<CheckSquare className="w-5 h-5 text-task-primary" />}
              variant="task"
              className="md:col-span-2 lg:col-span-1"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-task-primary">
                    {todayStats.tasks.completed}/{todayStats.tasks.total}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((todayStats.tasks.completed / todayStats.tasks.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-task-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(todayStats.tasks.completed / todayStats.tasks.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep up the great wellness routine!
                </p>
              </div>
            </WellnessCard>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate("/trackers")}
              className="h-auto p-6 justify-start space-x-4 bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10"
              variant="outline"
            >
              <TrendingUp className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Track Wellness</div>
                <div className="text-sm opacity-80">Log mood, sleep & tasks</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => navigate("/library")}
              className="h-auto p-6 justify-start space-x-4 bg-secondary text-secondary-foreground hover:bg-secondary/80"
              variant="outline"
            >
              <Heart className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Wellness Library</div>
                <div className="text-sm opacity-80">Articles & resources</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Weekly Insight */}
        <WellnessCard
          title="This Week's Insight"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          className="mb-6"
        >
          <div className="space-y-3">
            <p className="text-card-foreground">
              Your consistent tracking shows excellent wellness habits! You've maintained a 
              {todayStats.streak}-day streak with balanced mood patterns and healthy sleep.
            </p>
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <p className="text-sm text-success font-medium">
                💡 Medical Insight: Regular sleep (7-9 hours) and positive mood tracking 
                support optimal fetal brain development and reduce pregnancy complications.
              </p>
            </div>
          </div>
        </WellnessCard>
      </div>
    </div>
  );
}