import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Moon, Sun, Bed, ChevronDown, BarChart3, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CircularTimeSlider } from "./CircularTimeSlider";

const sleepPositions = [
  { 
    value: "left", 
    label: "Left Side", 
    icon: "🛌", 
    recommended: true,
    description: "Optimal for circulation"
  },
  { 
    value: "right", 
    label: "Right Side", 
    icon: "🛏️", 
    recommended: false,
    description: "Good alternative" 
  },
  { 
    value: "back", 
    label: "Back", 
    icon: "🛌", 
    recommended: false,
    description: "Avoid in late pregnancy"
  },
  { 
    value: "stomach", 
    label: "Stomach", 
    icon: "🛏️", 
    recommended: false,
    description: "Not recommended"
  },
];

const getSleepHoursAdvice = (hours: number) => {
  if (hours < 5) {
    return {
      message: "Sleeping less than 5 hours increases risk of gestational diabetes and preeclampsia.",
      type: "warning" as const
    };
  }
  if (hours < 7) {
    return {
      message: "Slightly below optimal. Try unwinding with a warm bath or prenatal yoga.",
      type: "info" as const
    };
  }
  if (hours >= 8) {
    return {
      message: "Great! Adequate sleep supports immune function and baby's brain development.",
      type: "success" as const
    };
  }
  return {
    message: "Good sleep duration. Consistency helps regulate your circadian rhythm.",
    type: "success" as const
  };
};

const getSleepQualityAdvice = (quality: number) => {
  if (quality < 40) {
    return {
      message: "Low quality sleep is linked to higher stress hormone levels. Consider using a white noise app.",
      type: "warning" as const
    };
  }
  if (quality < 70) {
    return {
      message: "Average sleep. Reduce caffeine and avoid screens before bedtime.",
      type: "info" as const
    };
  }
  return {
    message: "Excellent sleep! You're helping your body recover and your baby thrive.",
    type: "success" as const
  };
};

const getPositionAdvice = (position: string) => {
  if (position === "back" || position === "stomach") {
    return {
      message: "Sleeping on your back or stomach may reduce blood flow. Left side is highly recommended.",
      type: "warning" as const
    };
  }
  if (position === "left") {
    return {
      message: "Great choice! This position improves circulation and oxygen delivery to your baby.",
      type: "success" as const
    };
  }
  return {
    message: "Side sleeping is good. Left side position is preferred for optimal blood flow.",
    type: "info" as const
  };
};

const getQualityEmoji = (quality: number) => {
  if (quality < 20) return "😫";
  if (quality < 40) return "😴";
  if (quality < 60) return "😐";
  if (quality < 80) return "😊";
  return "😌";
};

// Mock weekly data
const weeklyData = [
  { day: "Sun", hours: 7.5, quality: 75 },
  { day: "Mon", hours: 6.8, quality: 65 },
  { day: "Tue", hours: 8.2, quality: 85 },
  { day: "Wed", hours: 7.1, quality: 70 },
  { day: "Thu", hours: 6.5, quality: 60 },
  { day: "Fri", hours: 7.8, quality: 80 },
  { day: "Sat", hours: 8.5, quality: 90 },
];

export function SleepTracker() {
  const [bedtime, setBedtime] = useState(22.5); // 10:30 PM
  const [waketime, setWaketime] = useState(7.25); // 7:15 AM
  const [quality, setQuality] = useState([75]);
  const [position, setPosition] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryView, setSummaryView] = useState<"weekly" | "monthly">("weekly");
  const { toast } = useToast();

  const calculateSleepDuration = () => {
    let duration = waketime - bedtime;
    if (duration < 0) duration += 24;
    return duration;
  };

  const sleepHours = calculateSleepDuration();
  const hoursAdvice = getSleepHoursAdvice(sleepHours);
  const qualityAdvice = getSleepQualityAdvice(quality[0]);
  const positionAdvice = position ? getPositionAdvice(position) : null;

  const handleSubmit = () => {
    if (!position) return;
    
    toast({
      title: "Sleep logged! 🌙",
      description: `${sleepHours.toFixed(1)}h sleep with ${quality[0]}% quality. ${hoursAdvice.message}`,
      duration: 6000,
    });

    // Reset form
    setBedtime(22.5);
    setWaketime(7.25);
    setQuality([75]);
    setPosition("");
  };

  const avgSleepHours = weeklyData.reduce((sum, day) => sum + day.hours, 0) / weeklyData.length;
  const avgQuality = weeklyData.reduce((sum, day) => sum + day.quality, 0) / weeklyData.length;

  return (
    <div className="space-y-6">
      {/* Main Sleep Tracker Card */}
      <Card className="relative overflow-hidden bg-gradient-sleep">
        <div className="absolute inset-0 bg-gradient-to-b from-sleep-dark/20 to-transparent" />
        <div className="relative p-6 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-white/20">
              <Moon className="w-6 h-6 text-sleep-moon" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Sleep Schedule</h3>
              <p className="text-sm text-white/80">
                Set your bedtime and wake time
              </p>
            </div>
          </div>

          {/* Circular Time Slider */}
          <div className="mb-6">
            <CircularTimeSlider
              bedtime={bedtime}
              waketime={waketime}
              onBedtimeChange={setBedtime}
              onWaketimeChange={setWaketime}
            />
          </div>

          {/* Sleep Duration Feedback */}
          <div className={`p-4 rounded-xl mb-4 ${
            hoursAdvice.type === 'success' ? 'bg-green-500/20 border border-green-400/30' :
            hoursAdvice.type === 'warning' ? 'bg-red-500/20 border border-red-400/30' :
            'bg-blue-500/20 border border-blue-400/30'
          }`}>
            <p className="text-sm font-medium">
              🛌 You slept {sleepHours.toFixed(1)} hours — {hoursAdvice.message}
            </p>
          </div>
        </div>
      </Card>

      {/* Sleep Quality Card */}
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sleep-primary font-semibold">Sleep Quality</Label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getQualityEmoji(quality[0])}</span>
              <span className="text-xl font-semibold text-sleep-primary">{quality[0]}%</span>
            </div>
          </div>
          
          <div className="px-2">
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>😫 Tired</span>
              <span>😐 Average</span>
              <span>😌 Refreshed</span>
            </div>
          </div>

          {/* Quality Feedback */}
          <div className={`p-3 rounded-lg ${
            qualityAdvice.type === 'success' ? 'bg-green-50 border border-green-200' :
            qualityAdvice.type === 'warning' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <p className="text-sm text-card-foreground">{qualityAdvice.message}</p>
          </div>
        </div>
      </Card>

      {/* Sleep Position Card */}
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <Label className="text-sleep-primary font-semibold">Sleep Position</Label>
          <div className="grid grid-cols-2 gap-3">
            {sleepPositions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`
                  p-4 rounded-xl text-left transition-all duration-200 border-2
                  ${position === pos.value 
                    ? 'border-sleep-primary bg-sleep-light shadow-md' 
                    : 'border-border bg-card hover:border-sleep-primary/50'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{pos.icon}</span>
                  {pos.recommended && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Best
                    </Badge>
                  )}
                </div>
                <div className="font-medium text-card-foreground">{pos.label}</div>
                <div className="text-xs text-muted-foreground">{pos.description}</div>
              </button>
            ))}
          </div>

          {/* Position Feedback */}
          {positionAdvice && (
            <div className={`p-3 rounded-lg ${
              positionAdvice.type === 'success' ? 'bg-green-50 border border-green-200' :
              positionAdvice.type === 'warning' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className="text-sm text-card-foreground">🛏️ {positionAdvice.message}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Sleep Summary */}
      <Card className="p-6 bg-white">
        <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sleep-primary" />
                <span className="font-semibold text-sleep-primary">🗓️ Sleep Summary</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={summaryView === "weekly" ? "default" : "outline"}
                  onClick={() => setSummaryView("weekly")}
                  className="text-xs"
                >
                  Weekly
                </Button>
                <Button
                  size="sm"
                  variant={summaryView === "monthly" ? "default" : "outline"}
                  onClick={() => setSummaryView("monthly")}
                  className="text-xs"
                >
                  Monthly
                </Button>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium text-sleep-primary">
                  Avg: {avgSleepHours.toFixed(1)} hrs
                </div>
                <div className="text-muted-foreground">
                  Quality: {avgQuality.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Simple bar chart */}
            <div className="space-y-2">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="text-xs w-8 text-muted-foreground">{day.day}</span>
                  <div className="flex-1 bg-sleep-muted rounded-full h-3 relative">
                    <div 
                      className="bg-sleep-primary rounded-full h-3 transition-all duration-300"
                      style={{ width: `${(day.hours / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs w-12 text-right text-sleep-primary font-medium">
                    {day.hours}h
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-sleep-light/50 rounded-lg p-3">
              <p className="text-sm text-sleep-primary font-medium">
                💡 Your average sleep improved by 45 min this week — great trend!
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Submit Button */}
      {position && (
        <Button 
          onClick={handleSubmit}
          className="w-full bg-sleep-primary hover:bg-sleep-primary/90 text-white py-6"
        >
          <Bed className="w-5 h-5 mr-2" />
          Log Sleep Entry
        </Button>
      )}

      {/* Sleep Tip Footer */}
      <div className="bg-sleep-light/30 border border-sleep-primary/20 rounded-xl p-4">
        <h3 className="font-semibold text-sleep-primary mb-2 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Sleep Tip
        </h3>
        <p className="text-sm text-sleep-secondary">
          During pregnancy, your body needs extra rest. Stick to a consistent bedtime and create a calming sleep space.
        </p>
      </div>
    </div>
  );
}