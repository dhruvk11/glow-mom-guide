import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, CheckSquare } from "lucide-react";
import { MoodTracker } from "@/components/MoodTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { TaskTracker } from "@/components/TaskTracker";

export default function Trackers() {
  const [activeTab, setActiveTab] = useState("mood");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
            Wellness Trackers
          </h1>
          <p className="text-muted-foreground">
            Monitor your mood, sleep, and daily wellness activities with medical insights
          </p>
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
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-card-foreground mb-2">
                    📋 Daily Wellness Tasks
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complete evidence-based activities for pregnancy health
                  </p>
                </div>
                <TaskTracker />
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