import { useState, useEffect } from "react";
import { WellnessCard } from "@/components/WellnessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { User, Calendar, Bell, Heart, TrendingUp, Baby, Settings, Shield, Edit3, Activity, Brain, Moon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    dueDate: "2024-09-15",
    currentWeek: 24,
    language: "English",
    timezone: "America/New_York"
  });

  const [notifications, setNotifications] = useState({
    moodReminders: true,
    sleepReminders: true,
    taskAlerts: true,
    weeklyEmailSummary: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [updateInfoOpen, setUpdateInfoOpen] = useState(false);

  const { user, loading } = useAuth();
  const { toast } = useToast();

  // Mock wellness stats - in real app, fetch from Supabase
  const [wellnessStats, setWellnessStats] = useState({
    moodEntries: 142,
    sleepLogs: 89,
    taskCompletionRate: 78,
    currentStreak: 12
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated! ✨",
      description: "Your preferences have been saved successfully.",
      duration: 3000,
    });
  };

  const handleUpdateInfo = () => {
    setUpdateInfoOpen(false);
    toast({
      title: "Pregnancy info updated! 🌸",
      description: "Your due date and trimester have been updated.",
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

  const calculateProgressPercentage = () => {
    return Math.round((userInfo.currentWeek / 40) * 100);
  };

  // Show auth modal if user is not logged in
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-card-foreground mb-2">
            Welcome to Your Wellness Journey
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign in or create an account to start tracking your pregnancy wellness
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              className="w-full"
            >
              Create Account
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </Card>
        
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    );
  }

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

        {/* 1. Pregnancy Overview - Enhanced Top Card */}
        <Card className="mb-6 bg-gradient-wellness border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/20">
                  <Baby className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Pregnancy Journey</h2>
                  <p className="text-white/80 text-sm">{getWeekDescription(userInfo.currentWeek)}</p>
                </div>
              </div>
              
              <Dialog open={updateInfoOpen} onOpenChange={setUpdateInfoOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Pregnancy Information</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="updateDueDate">Due Date</Label>
                      <Input
                        id="updateDueDate"
                        type="date"
                        value={userInfo.dueDate}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleUpdateInfo} className="w-full">
                      Update Information
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="text-4xl font-bold text-white mb-2">
                  {userInfo.currentWeek}
                </div>
                <div className="text-white/80 text-sm mb-3">
                  Weeks Pregnant
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Week {userInfo.currentWeek}
                </Badge>
              </div>
              
              <div className="text-center md:text-left">
                <div className="text-4xl font-bold text-white mb-2">
                  {calculateDaysLeft()}
                </div>
                <div className="text-white/80 text-sm mb-3">
                  Days Until Due Date
                </div>
                <div className="text-xs text-white/70">
                  {new Date(userInfo.dueDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <div className="text-4xl font-bold text-white mb-2">
                  {calculateProgressPercentage()}%
                </div>
                <div className="text-white/80 text-sm mb-3">
                  Journey Complete
                </div>
                <Progress 
                  value={calculateProgressPercentage()} 
                  className="h-2 bg-white/20"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Personal Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Personal Information
              </h3>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Info
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Full Name</Label>
              {isEditing ? (
                <Input
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md text-sm">{userInfo.name}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md text-sm">{userInfo.email}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Due Date</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={userInfo.dueDate}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md text-sm">
                  {new Date(userInfo.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Language</Label>
              {isEditing ? (
                <Select value={userInfo.language} onValueChange={(value) => setUserInfo(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md text-sm">{userInfo.language}</div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Timezone</Label>
              {isEditing ? (
                <Select value={userInfo.timezone} onValueChange={(value) => setUserInfo(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md text-sm">
                  {userInfo.timezone.replace('America/', '').replace('_', ' ')}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 3. Wellness Tracker Summary */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Wellness Tracker Summary
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-mood-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-mood-content" />
                <span className="text-sm font-medium text-muted-foreground">Mood Entries</span>
              </div>
              <div className="text-2xl font-bold text-mood-content">{wellnessStats.moodEntries}</div>
            </div>

            <div className="p-4 bg-sleep-light border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Moon className="w-5 h-5 text-sleep-primary" />
                <span className="text-sm font-medium text-muted-foreground">Sleep Logs</span>
              </div>
              <div className="text-2xl font-bold text-sleep-primary">{wellnessStats.sleepLogs}</div>
            </div>

            <div className="p-4 bg-task-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-task-primary" />
                <span className="text-sm font-medium text-muted-foreground">Task Rate</span>
              </div>
              <div className="text-2xl font-bold text-task-primary">{wellnessStats.taskCompletionRate}%</div>
            </div>

            <div className="p-4 bg-gradient-wellness border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white/80">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-white">{wellnessStats.currentStreak} days</div>
            </div>
          </div>
        </Card>

        {/* 4. Notification Settings */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Notification Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <div className="font-medium">Mood Reminder</div>
                <div className="text-sm text-muted-foreground">Sent at 8 PM daily</div>
              </div>
              <Switch
                checked={notifications.moodReminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, moodReminders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <div className="font-medium">Sleep Reminder</div>
                <div className="text-sm text-muted-foreground">Gentle bedtime reminder at 9 PM</div>
              </div>
              <Switch
                checked={notifications.sleepReminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, sleepReminders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <div className="font-medium">Wellness Task Alerts</div>
                <div className="text-sm text-muted-foreground">Daily task reminders at 10 AM</div>
              </div>
              <Switch
                checked={notifications.taskAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, taskAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <div className="font-medium">Weekly Summary Emails</div>
                <div className="text-sm text-muted-foreground">Progress insights every Sunday</div>
              </div>
              <Switch
                checked={notifications.weeklyEmailSummary}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, weeklyEmailSummary: checked }))
                }
              />
            </div>
          </div>
        </Card>

        {/* 5. Privacy & Security Footer */}
        <Card className="p-6 bg-muted/30 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Data Privacy & Security
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your wellness data is encrypted and stored securely. We never share personal 
              health information without your explicit consent. All tracking features are designed to 
              supplement, not replace, professional medical care.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                ✓ End-to-end encryption
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                ✓ HIPAA compliant
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                ✓ No data sharing
              </Badge>
            </div>
            
            <Button variant="link" className="h-auto p-0 text-sm text-primary">
              View Privacy Policy →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}