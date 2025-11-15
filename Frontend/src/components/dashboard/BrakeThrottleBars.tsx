import { useUserData } from "@/store/userData.store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Brake_Button from "./brake_button";
interface BrakeThrottleBarsProps {
  brake: boolean;
  throttle: number;
}

const BrakeThrottleBars = ({ brake, throttle }: BrakeThrottleBarsProps) => {


  return (
    <div className="flex gap-10 items-end justify-center h-64">
      {/* Brake */}
      <div className="flex flex-col items-center gap-3">
  
          {/* Glass effect background */}
       
          
          {/* Brake bar with gradient */}
          <div  className="w-full h-full">
          <Brake_Button />
          </div>
            


        <div className="text-base font-bold text-primary font-mono uppercase tracking-wider" style={{ textShadow: "0 0 10px hsl(var(--racing-red) / 0.3)" }}>Brake</div>
        <div className="text-3xl font-bold text-foreground font-mono tracking-tighter">{brake}</div>
      </div>

      {/* Throttle */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-20 h-52 bg-racing-panel/50 rounded-xl border border-racing-border/50 overflow-hidden backdrop-blur-sm">
          {/* Glass effect background */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent" />
          
          {/* Throttle bar with gradient */}
          <motion.div
            className="absolute bottom-0 w-full"
            initial={{ height: 0 }}
            animate={{ height: `${throttle}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-racing-blue-dark via-accent to-racing-blue-light" />
            <div className="absolute inset-0 bg-gradient-to-t from-racing-blue-dark via-accent to-racing-blue-light blur-xl opacity-50" />
          </motion.div>
          
          {/* Scale markers */}
          {[0, 25, 50, 75, 100].map((mark) => (
            <div
              key={mark}
              className="absolute w-full border-t border-racing-border/30"
              style={{ bottom: `${mark}%` }}
            >
              <span className="absolute -left-9 -translate-y-1/2 text-xs text-muted-foreground/60 font-mono">
                {mark}
              </span>
            </div>
          ))}
        </div>
        <div className="text-base font-bold text-accent font-mono uppercase tracking-wider" style={{ textShadow: "0 0 10px hsl(var(--racing-blue) / 0.3)" }}>Throttle</div>
        <div className="text-3xl font-bold text-foreground font-mono tracking-tighter">{throttle}<span className="text-lg text-muted-foreground">%</span></div>
      </div>
    </div>
  );
};

export default BrakeThrottleBars;
