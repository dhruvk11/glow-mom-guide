import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Pill, FileText, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function AddTask() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleModuleClick = (module: typeof taskModules[0]) => {
    setSelectedModule(module.id);
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      navigate(module.route);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/trackers")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-card-foreground">Add New Task</h1>
              <p className="text-sm text-muted-foreground">Choose a wellness category</p>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            Track Your Wellness Journey
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose from our specialized tracking modules designed for pregnancy and motherhood wellness
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {taskModules.map((module) => {
            const IconComponent = module.icon;
            const isSelected = selectedModule === module.id;
            
            return (
              <Card
                key={module.id}
                className={`
                  relative p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2
                  ${isSelected ? 'scale-95 shadow-inner' : 'hover:scale-105'}
                  ${module.borderColor} bg-gradient-to-br ${module.color}
                `}
                onClick={() => handleModuleClick(module)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-2xl bg-white/80 shadow-sm
                    ${isSelected ? 'scale-90' : ''}
                    transition-transform duration-200
                  `}>
                    <IconComponent className={`w-6 h-6 ${module.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 text-lg">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full" />
                <div className="absolute bottom-4 right-6 w-1 h-1 bg-white/40 rounded-full" />
              </Card>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
          <h3 className="font-semibold text-card-foreground mb-4 text-center">
            🌟 Your Wellness Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Appointments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-xs text-muted-foreground">Vitamins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-xs text-muted-foreground">Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-xs text-muted-foreground">Reminders</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Track consistently for better health insights and medical benefits
          </p>
        </div>
      </div>
    </div>
  );
}