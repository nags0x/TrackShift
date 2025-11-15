import { useState, useEffect } from "react";
import LapTimer from "@/components/dashboard/LapTimer";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import CircularGauge from "@/components/dashboard/CircularGauge";
import BrakeThrottleBars from "@/components/dashboard/BrakeThrottleBars";
import SteeringWheel from "@/components/dashboard/SteeringWheel";
import TrackMap from "@/components/dashboard/TrackMap";
import TireFuelPanel from "@/components/dashboard/TireFuelPanel";
import HaasLogo from "@/components/dashboard/HaasLogo";
import { ClientServer } from "@/server/client-server";
import { data, useUserData } from "@/store/userData.store";


let speed = 0;
let rpm = 900;
let gear = 1;
let steering = 0;
let fuel = 10;

function generateTelemetry(): data {

  // --- SPEED SIMULATION ---
  const accel = Math.random() * 3;         // 0–3 m/s²
  const brakeForce = Math.random() > 0.9 ? Math.random() * 6 : 0;  

  speed += accel - brakeForce;
  speed = Math.max(0, Math.min(320, speed)); // typical car top speed
    
  // --- RPM SIMULATION ---
  rpm = (gear * 1000) + (speed * 30) + (Math.random() * 200 - 100);
  rpm = Math.max(800, Math.min(9000, rpm));

  // --- GEAR SHIFTING ---
  if (rpm > 8200 && gear < 7) gear++;
  if (rpm < 1500 && gear > 1) gear--;

  // --- STEERING ---
  steering += (Math.random() - 0.5) * 8;  // smoother
  steering = Math.max(-270, Math.min(270, steering));

  // --- BRAKE / THROTTLE ---
  const throttle = Number(Math.max(0, Math.min(100, 50 + (Math.random() - 0.5) * 40)).toFixed(2));
  const brake = brakeForce > 0 ? Number((brakeForce * 20).toFixed(2)) : Number((Math.random() * 5).toFixed(2));

  // --- FUEL USE ---
  fuel -= 0.002;
  if (fuel < 0) fuel = 10;

  // --- TIRE TEMPS ---
  const baseTire = 80 + speed * 0.1;
  const tireTemps = {
    fl: baseTire + Math.random() * 5 - 2,
    fr: baseTire + Math.random() * 5 - 2,
    rl: baseTire + Math.random() * 5 - 2,
    rr: baseTire + Math.random() * 5 - 2,
  };

  // --- TRACK POSITION ---
  const trackPosition = (speed / 3200) % 1;

  return {
    speed,
    rpm,
    brake,
    throttle,
    steering,
    gear,
    fuel,
    tireTemps,
    trackPosition,
  };
}

const Index = () => {
  // Simulated telemetry data with realistic racing values
  const telemetry = useUserData((state)=>state.Data);
  const setTelemetry = useUserData((state)=>state.setData)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newTelemetry:data = generateTelemetry()
    setTelemetry(newTelemetry)
    },100)

    const client = () =>{
      const clientInstance = ClientServer.getInstance()
    }

    client()

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen max-h-screen bg-racing-bg text-foreground p-4 md:p-8">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 bg-gradient-radial from-racing-red/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <header className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 pb-3 border-b border-racing-border/50">
          <div className="flex justify-start md:justify-start">
            <LapTimer
              currentLap="02:36.937"
              delta="+0.087"
              bestLap="06:43.305"
              lastLap="06:44.453"
            />
          </div>
          
          <div className="flex justify-center order-first md:order-none">
            <HaasLogo />
          </div>
          
          <div className="flex justify-end md:justify-end">
            <WeatherWidget
              condition="Variably cloudy"
              temperature="24°C"
              windSpeed="10-15 mph"
            />
          </div>
        </header>

        {/* Main Gauges Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center">
          {/* Speedometer */}
          <CircularGauge
            value={telemetry.speed}
            max={400}
            unit="km/h"
            label="speed"
            redZone={300}
            glowColor="hsl(var(--racing-blue))"
            showGear
            gear={telemetry.gear}
          />

          {/* Brake & Throttle */}
            <BrakeThrottleBars
              brake={telemetry.brake}
              throttle={telemetry.throttle}
            />

          {/* Tachometer */}
          <CircularGauge
            value={telemetry.rpm}
            max={9000}
            unit="rpm"
            label="rpm"
            redZone={8000}
            glowColor="hsl(var(--racing-blue))"
          />
        </section>

        {/* Bottom Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Steering Wheel */}
          <SteeringWheel rotation={telemetry.steering} />

          {/* Track Map */}
          <TrackMap
            trackName="Nürburgring"
            location="Germany"
            position={telemetry.trackPosition}
          />

          {/* Tire & Fuel Panel */}
          <TireFuelPanel
            tireTemps={telemetry.tireTemps}
            fuel={telemetry.fuel}
            maxFuel={100}
          />
        </section>
      </div>
    </div>
  );
};

export default Index;