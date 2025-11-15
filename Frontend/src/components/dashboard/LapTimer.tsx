import { motion } from "framer-motion";

interface LapTimerProps {
  currentLap: string;
  delta: number,
  bestLap: string;
  lastLap: string;
}

const LapTimer = ({ currentLap, delta, bestLap, lastLap }: LapTimerProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-foreground font-mono tracking-tighter"
          style={{
            textShadow: "0 0 30px hsl(var(--racing-blue) / 0.3), 0 2px 4px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {currentLap}
        </motion.h1>
        <motion.div 
          className="relative bg-gradient-to-r from-primary to-racing-red-dark px-3 py-1 rounded-full overflow-hidden"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
          <span className="relative text-foreground font-bold text-sm font-mono tracking-wide" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{delta}</span>
        </motion.div>
      </div>
      <div className="flex gap-4 text-xs font-mono">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">Best</span>
          <span className="text-foreground text-sm font-bold tracking-tight">{bestLap}</span>
        </div>
        <div className="w-px bg-racing-border/50" />
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">Last</span>
          <span className="text-foreground text-sm font-bold tracking-tight">{lastLap}</span>
        </div>
      </div>
    </div>
  );
};

export default LapTimer;
