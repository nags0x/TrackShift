import { ClientServer } from "@/server/client-server";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

interface SteeringWheelProps {
  rotation: number; // -270 to +270
}

const SteeringWheel = ({ rotation }: SteeringWheelProps) => {

  return (
    <div className="relative bg-racing-panel/50  rounded-2xl p-4 border border-border backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="relative flex flex-col items-center gap-3">
        <div className="text-foreground text-sm font-mono uppercase tracking-wider font-bold mt-6">Wheel</div>
        <div className="text-muted-foreground/60 text-xs font-mono uppercase tracking-wide">Rotation</div>
        
        <div className="relative w-40 h-40">
          {/* Rotation scale */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <defs>
              <filter id="steering-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="hsl(var(--racing-border) / 0.3)"
              strokeWidth="1"
            />
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="hsl(var(--racing-border))"
              strokeWidth="2"
            />
            {/* Current position indicator */}
            <motion.circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="hsl(var(--racing-red))"
              strokeWidth="3"
              strokeDasharray="10 417"
              filter="url(#steering-glow)"
              initial={{ rotate: 0 }}
              animate={{ rotate: rotation }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{ transformOrigin: "center" }}
            />
          </svg>
          
          {/* Center steering wheel icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <Gauge className="w-16 h-16 text-primary" />
          </motion.div>
          
          {/* Angle display */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <div className="text-2xl font-bold text-foreground font-mono tracking-tighter" style={{ textShadow: "0 0 15px hsl(var(--racing-red) / 0.3)" }}>
              {Math.abs(Math.round(rotation))}°
            </div>
          </div>
        </div>
        
        {/* Direction markers */}
        <div className="flex gap-8 text-xs text-muted-foreground/60 font-mono">
          <span>-270°</span>
          <span className="text-muted-foreground">0°</span>
          <span>+270°</span>
        </div>
      </div>
    </div>
  );
};

export default SteeringWheel;
