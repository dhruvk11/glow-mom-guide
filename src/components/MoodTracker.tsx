import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Baby, Bed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { emoji: "😍", label: "Happy", value: "happy", color: "mood-happy" },
  { emoji: "😊", label: "Content", value: "content", color: "mood-content" },
  { emoji: "😐", label: "Neutral", value: "neutral", color: "mood-neutral" },
  { emoji: "😢", label: "Sad", value: "sad", color: "mood-sad" },
  { emoji: "😠", label: "Angry", value: "angry", color: "mood-angry" },
];

const reasonTags = [
  { label: "Partner", icon: Heart },
  { label: "Body Changes", icon: Baby },
  { label: "Hormonal", icon: Users },
  { label: "Sleep", icon: Bed },
];

const getMoodAdvice = (mood: string, reason?: string) => {
  const adviceMap = {
    happy: "Great! Positive emotions support oxytocin and lower cortisol. Keep it up with light movement.",
    content: "Wonderful! This balanced mood supports both your well-being and baby's development.",
    neutral: "Flat mood could indicate overwhelm. Want a resource on prenatal anxiety?",
    sad: "Persistent sadness could be hormonal or emotional. Consider 5-7 minutes of mindful breathing.",
    angry: reason === "Partner" 
      ? "Relationship strain is common. Try gratitude journaling or a 1-on-1 with your partner."
      : "It's normal to feel frustrated. Take deep breaths and consider gentle movement to release tension."
  };
  return adviceMap[mood as keyof typeof adviceMap] || "Thank you for tracking your mood. This helps you stay aware of your emotional patterns.";
};

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    const advice = getMoodAdvice(selectedMood, selectedReasons[0]);
    
    toast({
      title: "Mood logged! 💚",
      description: advice,
      duration: 6000,
    });

    // Reset form
    setSelectedMood("");
    setSelectedReasons([]);
    setNotes("");
  };

  return (
    <Card className="p-6 space-y-6 bg-mood-card">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          How are you feeling today?
        </h3>
        <p className="text-sm text-muted-foreground">
          Track your emotional wellness with evidence-based insights
        </p>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`
              p-3 sm:p-4 rounded-xl text-center transition-all duration-200 min-h-[80px] touch-manipulation
              ${selectedMood === mood.value 
                ? 'ring-2 ring-primary shadow-medium scale-105' 
                : 'hover:scale-105 hover:shadow-soft active:scale-95'
              }
              bg-white border border-border
            `}
          >
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{mood.emoji}</div>
            <div className="text-xs font-medium text-card-foreground">
              {mood.label}
            </div>
          </button>
        ))}
      </div>

      {/* Reason Tags */}
      {selectedMood && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <p className="text-sm font-medium text-card-foreground">
            What might be contributing? (Optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {reasonTags.map((tag) => (
              <Badge
                key={tag.label}
                variant={selectedReasons.includes(tag.label) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleReason(tag.label)}
              >
                <tag.icon className="w-3 h-3 mr-1" />
                {tag.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {selectedMood && (
        <div className="space-y-2 animate-in fade-in duration-500">
          <label className="text-sm font-medium text-card-foreground">
            Additional notes (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling today? Any specific thoughts or concerns..."
            className="min-h-[80px] bg-white"
          />
        </div>
      )}

      {/* Submit Button */}
      {selectedMood && (
        <Button 
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Log Mood Entry
        </Button>
      )}
    </Card>
  );
}