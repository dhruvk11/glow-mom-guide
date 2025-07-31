import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Bed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sleepQualities = [
  { value: "restful", label: "Restful", color: "success" },
  { value: "tossed", label: "Tossed & Turned", color: "warning" },
  { value: "insomnia", label: "Insomnia", color: "destructive" },
];

const sleepPositions = [
  { value: "left", label: "Left Side", recommended: true },
  { value: "right", label: "Right Side", recommended: false },
  { value: "back", label: "Back", recommended: false },
  { value: "stomach", label: "Stomach", recommended: false },
];

const getSleepAdvice = (hours: number, quality: string, position: string) => {
  if (hours < 4) {
    return "4h sleep disrupts glucose metabolism and raises blood pressure. Try a 20-min nap today.";
  }
  if (hours < 7) {
    return "You're halfway there. Sleep hygiene (no screens after 9pm) can help.";
  }
  if (hours >= 7 && hours <= 9) {
    return position === "left" 
      ? "Perfect rest and position! This improves immunity and supports fetal brain growth."
      : "Great sleep duration! Left-side posture improves placenta and kidney function.";
  }
  if (hours > 9) {
    return "Oversleeping may signal stress. Would you like to try journaling or a walk today?";
  }
  
  if (position === "stomach") {
    return "Stomach sleeping isn't recommended. Try the 'pillow wedge' for left-side comfort.";
  }
  if (position === "left") {
    return "You're crushing it! Left-side posture improves placenta and kidney function.";
  }
  
  return "Thank you for tracking your sleep. Consistent logging helps identify patterns.";
};

export function SleepTracker() {
  const [hours, setHours] = useState([7]);
  const [quality, setQuality] = useState("");
  const [position, setPosition] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!quality || !position) return;
    
    const advice = getSleepAdvice(hours[0], quality, position);
    
    toast({
      title: "Sleep logged! 🌙",
      description: advice,
      duration: 6000,
    });

    // Reset form
    setHours([7]);
    setQuality("");
    setPosition("");
  };

  const getSleepRating = (hours: number) => {
    if (hours < 5) return { color: "text-destructive", icon: "😴" };
    if (hours < 7) return { color: "text-warning", icon: "😪" };
    if (hours <= 9) return { color: "text-success", icon: "😊" };
    return { color: "text-warning", icon: "😴" };
  };

  const rating = getSleepRating(hours[0]);

  return (
    <Card className="p-6 space-y-6 bg-gradient-sleep text-white">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/20">
          <Moon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Sleep Tracker</h3>
          <p className="text-sm text-white/80">
            Track your rest with medical insights
          </p>
        </div>
      </div>

      {/* Hours Slept */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-white">Hours Slept</Label>
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${rating.color}`}>{rating.icon}</span>
            <span className="text-xl font-semibold">{hours[0]}h</span>
          </div>
        </div>
        <Slider
          value={hours}
          onValueChange={setHours}
          max={12}
          min={0}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/60">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-3">
        <Label className="text-white">Sleep Quality</Label>
        <div className="grid grid-cols-1 gap-2">
          {sleepQualities.map((qual) => (
            <button
              key={qual.value}
              onClick={() => setQuality(qual.value)}
              className={`
                p-3 rounded-xl text-left transition-all duration-200
                ${quality === qual.value 
                  ? 'bg-white/30 ring-2 ring-white/50' 
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
            >
              <span className="font-medium">{qual.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sleep Position */}
      <div className="space-y-3">
        <Label className="text-white">Sleep Position</Label>
        <div className="grid grid-cols-2 gap-2">
          {sleepPositions.map((pos) => (
            <button
              key={pos.value}
              onClick={() => setPosition(pos.value)}
              className={`
                p-3 rounded-xl text-left transition-all duration-200 relative
                ${position === pos.value 
                  ? 'bg-white/30 ring-2 ring-white/50' 
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{pos.label}</span>
                {pos.recommended && (
                  <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-xs">
                    Best
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      {quality && position && (
        <Button 
          onClick={handleSubmit}
          className="w-full bg-white text-sleep-primary hover:bg-white/90"
        >
          <Bed className="w-4 h-4 mr-2" />
          Log Sleep Entry
        </Button>
      )}
    </Card>
  );
}