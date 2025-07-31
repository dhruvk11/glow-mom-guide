import { useState, useRef, useEffect, useCallback } from "react";

interface CircularTimeSliderProps {
  bedtime: number; // hours in 24h format (e.g., 22.5 for 10:30 PM)
  waketime: number; // hours in 24h format (e.g., 7.25 for 7:15 AM)
  onBedtimeChange: (time: number) => void;
  onWaketimeChange: (time: number) => void;
}

export function CircularTimeSlider({ 
  bedtime, 
  waketime, 
  onBedtimeChange, 
  onWaketimeChange 
}: CircularTimeSliderProps) {
  const [isDragging, setIsDragging] = useState<'bedtime' | 'waketime' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const radius = 100;
  const center = 120;
  const strokeWidth = 8;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateSleepDuration = () => {
    let duration = waketime - bedtime;
    if (duration < 0) duration += 24; // Handle overnight sleep
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return { hours, minutes, total: duration };
  };

  const angleToTime = (angle: number) => {
    // Convert angle to 24-hour time (0 degrees = 12 AM)
    const normalizedAngle = (angle + 90) % 360; // Offset by 90 degrees so 12 is at top
    return (normalizedAngle / 360) * 24;
  };

  const timeToAngle = (time: number) => {
    // Convert 24-hour time to angle (12 AM = -90 degrees from top)
    return (time / 24) * 360 - 90;
  };

  const getPointOnCircle = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  const handleMouseDown = (type: 'bedtime' | 'waketime') => {
    setIsDragging(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const time = angleToTime(angle);

    if (isDragging === 'bedtime') {
      onBedtimeChange(time);
    } else {
      onWaketimeChange(time);
    }
  }, [isDragging, onBedtimeChange, onWaketimeChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const bedtimePoint = getPointOnCircle(timeToAngle(bedtime));
  const waketimePoint = getPointOnCircle(timeToAngle(waketime));
  const sleepDuration = calculateSleepDuration();

  // Create arc path for sleep duration
  const createArcPath = () => {
    const startAngle = timeToAngle(bedtime);
    const endAngle = timeToAngle(waketime);
    const largeArcFlag = sleepDuration.total > 12 ? 1 : 0;
    
    const start = getPointOnCircle(startAngle);
    const end = getPointOnCircle(endAngle);
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg
          ref={svgRef}
          width="240"
          height="240"
          className="transform -rotate-90"
        >
          {/* Clock face background */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(var(--sleep-muted))"
            strokeWidth={strokeWidth}
          />
          
          {/* Hour markers */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * 360 - 90;
            const point = getPointOnCircle(angle);
            const isMainHour = i % 6 === 0;
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={isMainHour ? 3 : 1.5}
                fill={isMainHour ? "hsl(var(--sleep-primary))" : "hsl(var(--sleep-muted))"}
              />
            );
          })}
          
          {/* Sleep duration arc */}
          <path
            d={createArcPath()}
            fill="none"
            stroke="hsl(var(--sleep-primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="opacity-80"
          />
          
          {/* Bedtime handle */}
          <g transform={`translate(${bedtimePoint.x}, ${bedtimePoint.y})`}>
            <circle
              r="12"
              fill="hsl(var(--sleep-moon))"
              stroke="white"
              strokeWidth="3"
              className="cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={() => handleMouseDown('bedtime')}
            />
            <text
              className="text-xs font-medium fill-white text-center"
              textAnchor="middle"
              dominantBaseline="central"
            >
              🌙
            </text>
          </g>
          
          {/* Wake time handle */}
          <g transform={`translate(${waketimePoint.x}, ${waketimePoint.y})`}>
            <circle
              r="12"
              fill="hsl(var(--sleep-accent))"
              stroke="white"
              strokeWidth="3"
              className="cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={() => handleMouseDown('waketime')}
            />
            <text
              className="text-xs font-medium fill-white text-center"
              textAnchor="middle"
              dominantBaseline="central"
            >
              ☀️
            </text>
          </g>
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-sleep-primary">
            {sleepDuration.hours}h {sleepDuration.minutes}m
          </div>
          <div className="text-xs text-sleep-secondary">sleep duration</div>
        </div>
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between w-full max-w-xs text-sm">
        <div className="text-center">
          <div className="text-sleep-moon font-medium">🌙 Bedtime</div>
          <div className="text-sleep-secondary">{formatTime(bedtime)}</div>
        </div>
        <div className="text-center">
          <div className="text-sleep-accent font-medium">☀️ Wake Up</div>
          <div className="text-sleep-secondary">{formatTime(waketime)}</div>
        </div>
      </div>
    </div>
  );
}