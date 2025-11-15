import { Cloud, Thermometer, Wind } from "lucide-react";

interface WeatherWidgetProps {
  condition: string;
  temperature: number;
  windSpeed: number;
}

const WeatherWidget = ({ condition, temperature, windSpeed }: WeatherWidgetProps) => {
  return (
    <div className="flex flex-col gap-1.5 items-end">
      <div className="flex items-center gap-2">
        <span className="text-foreground text-xs font-mono">{condition}</span>
        <Cloud className="w-4 h-4 text-racing-blue" style={{ filter: "drop-shadow(0 0 4px hsl(var(--racing-blue) / 0.3))" }} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-foreground font-bold text-base font-mono tracking-tight" style={{ textShadow: "0 0 10px hsl(var(--racing-red) / 0.2)" }}>{temperature}</span>
        <Thermometer className="w-4 h-4 text-primary" style={{ filter: "drop-shadow(0 0 4px hsl(var(--racing-red) / 0.3))" }} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-foreground text-xs font-mono">{windSpeed}</span>
        <Wind className="w-4 h-4 text-muted-foreground/80" />
      </div>
    </div>
  );
};

export default WeatherWidget;
