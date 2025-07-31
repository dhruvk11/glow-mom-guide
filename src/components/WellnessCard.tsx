import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WellnessCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "sleep" | "mood" | "task";
  className?: string;
}

export function WellnessCard({ 
  title, 
  icon, 
  children, 
  variant = "default", 
  className 
}: WellnessCardProps) {
  const variantStyles = {
    default: "bg-card",
    sleep: "bg-gradient-sleep text-white",
    mood: "bg-mood-card",
    task: "bg-task-card"
  };

  return (
    <div className={cn(
      "rounded-2xl p-6 shadow-soft transition-all duration-200 hover:shadow-medium",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className={cn(
            "p-2 rounded-xl",
            variant === "sleep" ? "bg-white/20" : "bg-primary/10"
          )}>
            {icon}
          </div>
        )}
        <h3 className={cn(
          "text-lg font-semibold",
          variant === "sleep" ? "text-white" : "text-card-foreground"
        )}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}