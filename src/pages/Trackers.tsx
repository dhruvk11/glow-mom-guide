import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Moon, CheckSquare, Plus, ListTodo, Calendar, Pill, FileText, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MoodTracker } from "@/components/MoodTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { TaskTracker } from "@/components/TaskTracker";

const taskModules = [
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    description: "Schedule and track medical appointments",
    icon: Calendar,
    color: "from-red-100 to-red-200",
    iconColor: "text-red-600",
    borderColor: "border-red-200",
    route: "/add-task/doctor-appointment"
  },
  {
    id: "vitamin-supplement",
    title: "Vitamin / Supplement",
    description: "Track your daily vitamins and supplements",
    icon: Pill,
    color: "from-green-100 to-green-200",
    iconColor: "text-green-600", 
    borderColor: "border-green-200",
    route: "/add-task/vitamin-supplement"
  },
  {
    id: "medical-test",
    title: "Medical Test",
    description: "Log medical tests and results",
    icon: FileText,
    color: "from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    route: "/add-task/medical-test"
  },
  {
    id: "personal-reminder",
    title: "Personal Reminder",
    description: "Set personal wellness reminders",
    icon: Bell,
    color: "from-purple-100 to-purple-200",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
    route: "/add-task/personal-reminder"
  }
];

export default function Trackers() {
  const [activeTab, setActiveTab] = useState("mood");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleModuleClick = (module: typeof taskModules[0]) => {
    setSelectedModule(module.id);
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      navigate(module.route);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
              Wellness Trackers
            </h1>
            <p className="text-muted-foreground">
              Monitor your mood, sleep, and daily wellness activities with medical insights
            </p>
          </div>
          <Button onClick={() => navigate("/my-tasks")} variant="outline">
            <ListTodo className="w-4 h-4 mr-2" />
            My Tasks
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-secondary/50">
            <TabsTrigger 
              value="mood" 
              className="flex items-center gap-2 py-3 data-[state=active]:bg-mood-card data-[state=active]:text-primary"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sleep"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-sleep-muted data-[state=active]:text-sleep-primary"
            >
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-task-card data-[state=active]:text-task-primary"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="mood" className="mt-0">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    🧠 Mood Tracker
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Track your emotional wellness with evidence-based insights
                  </p>
                </div>
                <MoodTracker />
              </div>
            </TabsContent>

            <TabsContent value="sleep" className="mt-0">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    🛌 Sleep Tracker
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Monitor your rest patterns for optimal pregnancy health
                  </p>
                </div>
                <SleepTracker />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    ✨ Wellness Trackers
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose from our specialized tracking modules designed for pregnancy and motherhood wellness
                  </p>
                </div>

                {/* 4-Box Wellness Module Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {taskModules.map((module) => {
                    const IconComponent = module.icon;
                    const isSelected = selectedModule === module.id;
                    
                    return (
                      <Card
                        key={module.id}
                        className={`
                          relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2
                          ${isSelected ? 'scale-95 shadow-inner' : 'hover:scale-105'}
                          ${module.borderColor} bg-gradient-to-br ${module.color}
                        `}
                        onClick={() => handleModuleClick(module)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`
                            flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 shadow-sm
                            ${isSelected ? 'scale-90' : ''}
                            transition-transform duration-200
                          `}>
                            <IconComponent className={`w-5 h-5 ${module.iconColor}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-3 right-3 w-2 h-2 bg-white/60 rounded-full" />
                        <div className="absolute bottom-3 right-4 w-1 h-1 bg-white/40 rounded-full" />
                      </Card>
                    );
                  })}
                </div>

                {/* Add Task Button */}
                <div className="text-center pt-4">
                  <Button onClick={() => navigate("/add-task")} size="lg" className="animate-fade-in">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Daily Wellness Tasks */}
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      📋 Daily Wellness Tasks
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Complete evidence-based activities for pregnancy health
                    </p>
                  </div>
                  <TaskTracker />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-wellness/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="font-semibold text-card-foreground mb-3">
            💡 Tracking Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Track consistently for the most accurate insights and medical benefits
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              All feedback is based on current pregnancy research and clinical guidelines
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use notes in mood tracking to identify patterns and triggers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Left-side sleeping and 7-9 hours are optimal for fetal development
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}