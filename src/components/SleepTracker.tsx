import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SleepScroller } from "./SleepScroller";

const sleepTips = [
  "Try sleeping on your left side to improve blood flow to your baby. Use pillows for support!",
  "Avoid screens 1 hour before bed to improve melatonin production.",
  "Drink water but stop at least 2 hours before sleep to avoid waking up often.",
  "Maintain a consistent sleep schedule even on weekends.",
  "Keep your bedroom cool and dark for better sleep quality.",
  "Light prenatal yoga or stretching can help prepare your body for rest."
];

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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { toast } = useToast();

  // Rotate tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % sleepTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const handleSave = () => {
    toast({
      title: "Sleep logged! 🌙",
      description: `${sleepDuration.hours}h ${sleepDuration.minutes}m sleep recorded successfully.`,
      duration: 4000,
    });

    // Reset form
    setBedtime(22.5);
    setWaketime(7.5);
  };

  const recentSleepData = [
    { date: "Aug 5", duration: "7h 45m" },
    { date: "Aug 4", duration: "6h 30m" },
    { date: "Aug 3", duration: "8h 10m" },
    { date: "Aug 2", duration: "7h 20m" },
    { date: "Aug 1", duration: "6h 45m" },
  ];

  return (
    <div className="space-y-6">
      {/* Sleep Tips Box */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 p-4 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">
              Sleep Tip
            </h3>
            <p className="text-purple-700 text-sm leading-relaxed">
              {sleepTips[currentTipIndex]}
            </p>
          </div>
        </div>
      </Card>

      {/* Sleep Scroller Component */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <SleepScroller
          bedtime={bedtime}
          waketime={waketime}
          onBedtimeChange={setBedtime}
          onWaketimeChange={setWaketime}
        />
      </Card>

      {/* Recent Sleep Data */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Sleep Data</h3>
        <div className="space-y-3">
          {recentSleepData.map((entry, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-600 text-sm">{entry.date}</span>
              <span className="font-medium text-gray-900">{entry.duration}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-98"
      >
        Log Sleep Entry
      </Button>
    </div>
  );
}