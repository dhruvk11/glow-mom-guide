import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sleepQualityOptions = [
  { value: 'poor', emoji: '😩', label: 'Poor' },
  { value: 'fair', emoji: '🥱', label: 'Fair' },
  { value: 'good', emoji: '😴', label: 'Good' },
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'excellent', emoji: '🌟', label: 'Excellent' }
];

const sleepDisruptors = [
  'Bathroom trips',
  'Nightmares', 
  'Anxiety',
  'Body discomfort',
  'Loud noises',
  'Other'
];

const getSleepAdvice = (hours: number) => {
  if (hours < 6) {
    return "Less than 6 hours of sleep can increase stress and impact recovery.";
  }
  if (hours >= 6 && hours <= 8) {
    return "Good! You're getting enough rest.";
  }
  if (hours > 9) {
    return "Oversleeping can sometimes be linked to fatigue. Balance is key.";
  }
  return "Good! You're getting enough rest.";
};

const getQualityAdvice = (quality: string) => {
  const advice = {
    poor: "Consider improving your wind-down routine. Try less screen time before bed.",
    fair: "Try consistent bedtime to help improve quality.",
    good: "Good! Keep maintaining your sleep hygiene.",
    great: "Excellent! Keep up the healthy sleep habits.",
    excellent: "Fantastic! Quality sleep is a great foundation for health."
  };
  return advice[quality as keyof typeof advice] || "";
};

export function SleepTracker() {
  const [bedtime, setBedtime] = useState(22.5); // 10:30 PM
  const [waketime, setWaketime] = useState(7.5); // 7:30 AM
  const [quality, setQuality] = useState('');
  const [disruptors, setDisruptors] = useState<string[]>([]);
  const [otherDisruptor, setOtherDisruptor] = useState('');
  const { toast } = useToast();

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateSleepDuration = () => {
    let duration = waketime - bedtime;
    if (duration < 0) duration += 24;
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return { hours, minutes, total: duration };
  };

  const sleepDuration = calculateSleepDuration();

  const handleTimeChange = (type: 'bedtime' | 'waketime', value: number) => {
    if (type === 'bedtime') {
      setBedtime(value);
    } else {
      setWaketime(value);
    }
  };

  const toggleDisruptor = (disruptor: string) => {
    setDisruptors(prev => 
      prev.includes(disruptor) 
        ? prev.filter(d => d !== disruptor)
        : [...prev, disruptor]
    );
  };

  const handleSave = () => {
    if (!quality) {
      toast({
        title: "Please select sleep quality",
        description: "We need to know how well you slept to provide better insights.",
        variant: "destructive"
      });
      return;
    }

    const advice = getQualityAdvice(quality);
    toast({
      title: "Sleep logged! 🌙",
      description: `${sleepDuration.hours}h ${sleepDuration.minutes}m sleep. ${advice}`,
      duration: 6000,
    });

    // Reset form
    setBedtime(22.5);
    setWaketime(7.5);
    setQuality('');
    setDisruptors([]);
    setOtherDisruptor('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4C5CDB] to-[#6C5DD3] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <ArrowLeft className="w-6 h-6" />
        <TrendingUp className="w-6 h-6 p-1 bg-white/20 rounded-full" />
      </div>

      <div className="px-6 pb-6">
        <h1 className="text-3xl font-bold mb-2">Sleep Tracker</h1>
        <p className="text-white/80 text-lg">Track your rest for better wellness</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Sleep Tip Banner */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🌙</div>
            <div>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                Sleep Tip
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Try sleeping on your left side to improve blood flow to your baby. Use pillows for support!
              </p>
            </div>
          </div>
        </Card>

        {/* Sleep Times */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Sleep Times</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <Moon className="w-5 h-5" />
                <span className="font-medium">Bedtime</span>
              </div>
              <input
                type="time"
                value={`${Math.floor(bedtime).toString().padStart(2, '0')}:${Math.round((bedtime - Math.floor(bedtime)) * 60).toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  handleTimeChange('bedtime', hours + minutes / 60);
                }}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-lg font-medium placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <Sun className="w-5 h-5" />
                <span className="font-medium">Wake Time</span>
              </div>
              <input
                type="time"
                value={`${Math.floor(waketime).toString().padStart(2, '0')}:${Math.round((waketime - Math.floor(waketime)) * 60).toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  handleTimeChange('waketime', hours + minutes / 60);
                }}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-lg font-medium placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          {/* Sleep Duration Display */}
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-white mb-1">
              You slept for {sleepDuration.hours}h {sleepDuration.minutes}m
            </div>
            <div className="text-white/70 text-sm">
              {getSleepAdvice(sleepDuration.total)}
            </div>
          </div>
        </Card>

        {/* Sleep Quality */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">How was your sleep quality?</h2>
          
          <div className="grid grid-cols-5 gap-3">
            {sleepQualityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setQuality(option.value)}
                className={`
                  p-4 rounded-2xl text-center transition-all duration-200
                  ${quality === option.value 
                    ? 'bg-white/30 border-2 border-white scale-105' 
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                  }
                `}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-white text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Sleep Disruptors */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">What disrupted your sleep?</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {sleepDisruptors.map((disruptor) => (
              <button
                key={disruptor}
                onClick={() => toggleDisruptor(disruptor)}
                className={`
                  p-4 rounded-xl text-left transition-all duration-200 border
                  ${disruptors.includes(disruptor)
                    ? 'bg-white/30 border-white text-white' 
                    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                  }
                `}
              >
                <span className="font-medium">{disruptor}</span>
              </button>
            ))}
          </div>

          {disruptors.includes('Other') && (
            <input
              type="text"
              placeholder="Describe what disrupted your sleep..."
              value={otherDisruptor}
              onChange={(e) => setOtherDisruptor(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          )}
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-white text-[#6C5DD3] hover:bg-white/90 py-6 text-lg font-semibold rounded-2xl mb-8"
        >
          Save Sleep Log
        </Button>
      </div>
    </div>
  );
}