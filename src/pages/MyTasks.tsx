import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Pill, FileText, Bell, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Task {
  id: string;
  type: 'doctor-appointment' | 'vitamin-supplement' | 'medical-test' | 'personal-reminder';
  title: string;
  date?: string;
  time?: string;
  status: 'pending' | 'completed' | 'missed';
  data: Record<string, any>;
  createdAt: string;
}

const taskTypeConfig = {
  'doctor-appointment': {
    icon: Calendar,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Doctor Appointment'
  },
  'vitamin-supplement': {
    icon: Pill,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Vitamin/Supplement'
  },
  'medical-test': {
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Medical Test'
  },
  'personal-reminder': {
    icon: Bell,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Personal Reminder'
  }
};

export default function MyTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('wellness-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('wellness-tasks', JSON.stringify(updatedTasks));
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed' as Task['status']
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('wellness-tasks', JSON.stringify(updatedTasks));
  };

  const getFilteredTasks = () => {
    if (activeTab === "all") return tasks;
    return tasks.filter(task => task.type === activeTab);
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-800">Missed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const config = taskTypeConfig[task.type];
    const IconComponent = config.icon;

    return (
      <Card className={`p-4 border-l-4 ${config.borderColor} hover:shadow-md transition-all duration-200`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <IconComponent className={`w-5 h-5 ${config.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-card-foreground truncate">
                  {task.title}
                </h3>
                {getStatusBadge(task.status)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {config.label}
              </p>
              
              {task.date && (
                <p className="text-sm text-muted-foreground">
                  📅 {format(new Date(task.date), 'MMM dd, yyyy')}
                  {task.time && ` at ${task.time}`}
                </p>
              )}
              
              {task.data.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {task.data.notes}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleTaskStatus(task.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              ✓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTask(task.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const filteredTasks = getFilteredTasks();

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
              <h1 className="text-xl font-semibold text-card-foreground">My Tasks</h1>
              <p className="text-sm text-muted-foreground">Manage your wellness activities</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/add-task")}
              className="hover:bg-primary/10"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {tasks.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => t.status === 'missed').length}
            </div>
            <div className="text-sm text-muted-foreground">Missed</div>
          </Card>
        </div>

        {/* Task Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-secondary/50 mb-6">
            <TabsTrigger value="all" className="py-2">
              All
            </TabsTrigger>
            <TabsTrigger value="doctor-appointment" className="py-2">
              <Calendar className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="vitamin-supplement" className="py-2">
              <Pill className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="medical-test" className="py-2">
              <FileText className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="personal-reminder" className="py-2">
              <Bell className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  No tasks yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your wellness journey by adding your first task
                </p>
                <Button onClick={() => navigate("/add-task")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Task
                </Button>
              </Card>
            ) : (
              filteredTasks
                .sort((a, b) => {
                  // Sort by date if available, then by creation date
                  if (a.date && b.date) {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                  }
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </Tabs>

        {/* Add Task FAB for Mobile */}
        <div className="fixed bottom-24 right-4 md:hidden">
          <Button
            onClick={() => navigate("/add-task")}
            className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}