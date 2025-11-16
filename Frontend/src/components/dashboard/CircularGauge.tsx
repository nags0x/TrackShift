import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularGaugeProps {
  value: number;
  max: number;
  unit: string;
  label?: string;
  redZone?: number;
  glowColor?: string;
  showGear?: boolean;
  gear?: number;
}

const CircularGauge = ({
  value,
  max,
  unit,
  label,
  redZone = max,
  glowColor = "hsl(var(--racing-blue))",
  showGear = false,
  gear = 0,
}: CircularGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const diff = value - prev;
        if (Math.abs(diff) < 1) return value;
        return prev + diff * 0.1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [value]);

  const percentage = (displayValue / max) * 100;
  const angle = (percentage / 100) * 270 - 135;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (percentage / 100) * (270 / 360) * circumference;

  const isInRedZone = displayValue >= redZone;

  return (
    <div className="relative w-72 h-72 md:w-80 md:h-80">
      {/* Outer glow ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-[135deg]">
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isInRedZone ? "hsl(var(--racing-red))" : glowColor} stopOpacity="1" />
            <stop offset="100%" stopColor={isInRedZone ? "hsl(var(--racing-red-dark))" : "hsl(var(--racing-blue-dark))"} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Background arc - multiple layers for depth */}
        <circle
          cx="160"
          cy="160"
          r="145"
          fill="none"
          stroke="hsl(var(--racing-border) / 0.3)"
          strokeWidth="1"
          strokeDasharray={`${(270 / 360) * circumference} ${circumference}`}
        />
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="hsl(var(--racing-border))"
          strokeWidth="2"
          strokeDasharray={`${(270 / 360) * circumference} ${circumference}`}
        />
        {/* Progress arc with gradient */}
        <motion.circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke={`url(#gradient-${label})`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Glass morphism background */}
        <div className="absolute w-56 h-56 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10" />
        
        {/* Dotted pattern background */}
        <div className="absolute w-48 h-48 rounded-full bg-[radial-gradient(circle,_hsl(var(--racing-border))_1px,_transparent_1px)] bg-[length:8px_8px] opacity-20" />
        
        <motion.div
          className="text-7xl font-bold text-foreground font-mono z-10 tracking-tighter"
          style={{
            textShadow: isInRedZone 
              ? "0 0 20px hsl(var(--racing-red) / 0.5), 0 0 40px hsl(var(--racing-red) / 0.3)"
              : "0 0 20px hsl(var(--racing-blue) / 0.3)",
          }}
          animate={isInRedZone ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3, repeat: isInRedZone ? Infinity : 0 }}
        >
          {Math.round(displayValue).toLocaleString()}
        </motion.div>
        <div className="text-lg text-muted-foreground/80 font-mono z-10 tracking-wide uppercase">{unit}</div>
      </div>

      {/* Gear indicator */}
      {showGear && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="relative w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center bg-racing-panel shadow-[0_0_30px_hsl(var(--racing-red)/0.3)]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
            <span className="text-3xl font-bold text-primary font-mono z-10" style={{ textShadow: "0 0 10px hsl(var(--racing-red) / 0.5)" }}>{gear}</span>
          </div>
        </div>
      )}

      {/* Needle */}
      <motion.div
        className="absolute top-1/2 left-1/2 origin-left w-32 h-1.5"
        style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
        animate={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 50, damping: 10 }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-racing-red-glow to-racing-red rounded-full blur-sm opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-racing-red-glow to-racing-red rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default CircularGauge;
