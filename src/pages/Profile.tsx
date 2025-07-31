import { useState } from "react";
import { WellnessCard } from "@/components/WellnessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Bell, Heart, TrendingUp, Baby } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    name: "Sarah Johnson",
    dueDate: "2024-09-15",
    currentWeek: 24,
    language: "English"
  });

  const [notifications, setNotifications] = useState({
    moodReminders: true,
    sleepTracking: true,
    taskAlerts: true,
    weeklyInsights: true
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile updated! ✨",
      description: "Your preferences have been saved successfully.",
      duration: 3000,
    });
  };

  const calculateDaysLeft = () => {
    const today = new Date();
    const due = new Date(userInfo.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getWeekDescription = (week: number) => {
    if (week < 13) return "First Trimester";
    if (week < 28) return "Second Trimester";
    return "Third Trimester";
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your pregnancy journey and wellness preferences
          </p>
        </div>

        {/* Pregnancy Overview */}
        <WellnessCard
          title="Pregnancy Journey"
          icon={<Baby className="w-5 h-5 text-primary" />}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-primary mb-1">
                {userInfo.currentWeek}
              </div>
              <div className="text-sm text-muted-foreground">
                Weeks Pregnant
              </div>
              <Badge variant="outline" className="mt-2 bg-primary/10 text-primary border-primary/20">
                {getWeekDescription(userInfo.currentWeek)}
              </Badge>
            </div>
            
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-task-primary mb-1">
                {calculateDaysLeft()}
              </div>
              <div className="text-sm text-muted-foreground">
                Days Until Due Date
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {userInfo.dueDate}
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-mood-content mb-1">
                75%
              </div>
              <div className="text-sm text-muted-foreground">
                Journey Complete
              </div>
              <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
                On Track
              </Badge>
            </div>
          </div>
        </WellnessCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Personal Information
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={userInfo.dueDate}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                <Input
                  id="language"
                  value={userInfo.language}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Notification Preferences
              </h3>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-card-foreground">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {key === 'moodReminders' && 'Daily reminders to log your mood'}
                      {key === 'sleepTracking' && 'Gentle sleep tracking notifications'}
                      {key === 'taskAlerts' && 'Reminders for wellness tasks'}
                      {key === 'weeklyInsights' && 'Weekly progress and insights'}
                    </div>
                  </div>
                  <Button
                    variant={value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                  >
                    {value ? "On" : "Off"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Wellness Stats */}
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Wellness Journey Stats
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-mood-content mb-1">142</div>
              <div className="text-sm text-muted-foreground">Mood Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sleep-primary mb-1">89</div>
              <div className="text-sm text-muted-foreground">Sleep Logs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-task-primary mb-1">78%</div>
              <div className="text-sm text-muted-foreground">Task Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="mt-8 flex justify-center md:justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto px-8">
            <Heart className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 bg-muted/30 border border-border rounded-xl p-6">
          <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Data Privacy & Security
          </h3>
          <p className="text-sm text-muted-foreground">
            Your wellness data is stored locally and encrypted for privacy. We never share personal 
            health information without your explicit consent. All tracking features are designed to 
            supplement, not replace, professional medical care.
          </p>
        </div>
      </div>
    </div>
  );
}