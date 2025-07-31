import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Calendar, Dumbbell, Droplets, CheckCircle2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  name: string;
  iconName: string; // Store icon name as string
  completed: boolean;
  category: "supplement" | "appointment" | "exercise" | "hydration";
}

const defaultTasks: Omit<Task, "completed">[] = [
  { id: "folic-acid", name: "Folic Acid", iconName: "Pill", category: "supplement" },
  { id: "iron", name: "Iron Supplement", iconName: "Pill", category: "supplement" },
  { id: "calcium", name: "Calcium/Vitamin D", iconName: "Pill", category: "supplement" },
  { id: "ob-visit", name: "OB-GYN Visit", iconName: "Calendar", category: "appointment" },
  { id: "walk", name: "Daily Walk (30 mins)", iconName: "Dumbbell", category: "exercise" },
  { id: "kegels", name: "Kegel Exercises", iconName: "Dumbbell", category: "exercise" },
  { id: "hydration", name: "Hydration (8 glasses)", iconName: "Droplets", category: "hydration" },
];

// Icon mapping
const iconMap = {
  Pill,
  Calendar,
  Dumbbell,
  Droplets,
  CheckCircle2,
  AlertTriangle,
} as const;

const taskAdvice = {
  "folic-acid": {
    completed: "Great! Folic acid reduces risk of birth defects by up to 70%.",
    missed: "Missing folic acid increases neural tube defect risks. Start again tomorrow."
  },
  "iron": {
    completed: "Nice work. You're supporting baby's oxygen needs and your energy.",
    missed: "Skipping iron can lead to anemia & fatigue. Consider pairing with Vitamin C tomorrow."
  },
  "calcium": {
    completed: "Perfect! You're building strong bones and lowering preeclampsia risk.",
    missed: "Calcium is key for baby's bones and teeth. Skipping regularly can impact growth."
  },
  "ob-visit": {
    completed: "You're staying on track. Ask about glucose and weight tracking this trimester.",
    missed: "Missed appointments delay vital checks on fetal development."
  },
  "kegels": {
    completed: "Excellent! Consistency helps avoid incontinence and supports smooth delivery.",
    missed: "Kegels strengthen pelvic muscles. Skipping them may increase postpartum recovery time."
  },
  "walk": {
    completed: "Amazing! Light exercise improves circulation and reduces pregnancy discomfort.",
    missed: "Daily movement helps with energy and prepares your body for delivery."
  },
  "hydration": {
    completed: "Hydrated! Helps prevent UTIs and supports healthy amniotic fluid levels.",
    missed: "Dehydration may cause headaches or even preterm contractions."
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    supplement: "task-primary",
    appointment: "task-secondary", 
    exercise: "primary",
    hydration: "accent"
  };
  return colors[category as keyof typeof colors] || "muted";
};

export function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize tasks from localStorage or defaults
    const savedTasks = localStorage.getItem("pregnancy-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const initialTasks = defaultTasks.map(task => ({ ...task, completed: false }));
      setTasks(initialTasks);
      localStorage.setItem("pregnancy-tasks", JSON.stringify(initialTasks));
    }
  }, []);

  const toggleTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem("pregnancy-tasks", JSON.stringify(updated));
      
      const task = updated.find(t => t.id === taskId);
      if (task) {
        const advice = taskAdvice[taskId as keyof typeof taskAdvice];
        const message = task.completed ? advice.completed : advice.missed;
        
        toast({
          title: task.completed ? `✅ ${task.name} completed!` : `⚠️ ${task.name} marked incomplete`,
          description: message,
          duration: 5000,
        });
      }
      
      return updated;
    });
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <Card className="p-6 space-y-6 bg-gradient-task">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Daily Wellness Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Evidence-based pregnancy care activities
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-task-primary">{completedCount}/{tasks.length}</div>
          <div className="text-xs text-muted-foreground">{completionRate}% complete</div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-task-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`
              flex items-center gap-3 p-4 rounded-xl bg-white shadow-soft transition-all duration-200
              ${task.completed ? 'opacity-75 bg-success/5' : 'hover:shadow-medium'}
            `}
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="h-5 w-5"
            />
            
            <div className={`p-2 rounded-lg bg-${getCategoryColor(task.category)}/10`}>
              {(() => {
                const IconComponent = iconMap[task.iconName as keyof typeof iconMap];
                return IconComponent ? <IconComponent className={`w-4 h-4 text-${getCategoryColor(task.category)}`} /> : null;
              })()}
            </div>
            
            <div className="flex-1">
              <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
                {task.name}
              </div>
            </div>
            
            {task.completed && (
              <CheckCircle2 className="w-5 h-5 text-success" />
            )}
          </div>
        ))}
      </div>

      {/* Encouragement */}
      {completionRate === 100 && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
          <div className="text-success font-semibold mb-1">🎉 Perfect Day!</div>
          <div className="text-sm text-success/80">
            Your consistency is building a resilient you and baby. Bravo!
          </div>
        </div>
      )}
      
      {completionRate < 50 && tasks.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-center">
          <div className="text-warning font-semibold mb-1">💪 Keep Going!</div>
          <div className="text-sm text-warning/80">
            Small steps lead to big health benefits for you and baby.
          </div>
        </div>
      )}
    </Card>
  );
}