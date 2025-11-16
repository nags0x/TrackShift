import { useState, useEffect } from "react";
import LapTimer from "@/components/dashboard/LapTimer";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import CircularGauge from "@/components/dashboard/CircularGauge";
import BrakeThrottleBars from "@/components/dashboard/BrakeThrottleBars";
import SteeringWheel from "@/components/dashboard/SteeringWheel";
import TireFuelPanel from "@/components/dashboard/TireFuelPanel";
import HaasLogo from "@/components/dashboard/HaasLogo";
import { ClientServer } from "@/server/client-server";
import { data, useUserData } from "@/store/userData.store";
import  VibrationLogMonitor  from "@/components/dashboard/Logs";


const Index = () => {
  // Simulated telemetry data with realistic racing values
  const telemetry = useUserData((state)=>state.Data);
  const setTelemetry = useUserData((state)=>state.setData)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // const newTelemetry:data = generateTelemetry()
    // setTelemetry(newTelemetry)
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
              delta={telemetry.LapDelta}
              bestLap="06:43.305"
              lastLap="06:44.453"
            />
          </div>
          
          <div className="flex justify-center order-first md:order-none">
            <HaasLogo />
          </div>
          
          <div className="flex justify-end md:justify-end">
            <WeatherWidget
              condition={telemetry.WeatherCondition}
              temperature={telemetry.WeatherTemp}
              windSpeed={telemetry.WeatherWind}
            />
          </div>
        </header>

        {/* Main Gauges Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center">
          {/* Speedometer */}
          <CircularGauge
            value={telemetry.Speed}
            max={400}
            unit="km/h"
            label="speed"
            redZone={300}
            glowColor="hsl(var(--racing-blue))"
            showGear
            gear={telemetry.nGear}
          />

          {/* Brake & Throttle */}
            <BrakeThrottleBars
              brake={telemetry.Brake}
              throttle={telemetry.Throttle}
            />

          {/* Tachometer */}
          <CircularGauge
            value={telemetry.RPM}
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
          <SteeringWheel rotation={telemetry.Rotation} />

        {/*Logs*/}
        <VibrationLogMonitor/>

          {/* Tire & Fuel Panel */}
          <TireFuelPanel
            tireTemps={telemetry.Tiretemps}
            fuel={telemetry.Fuel}
            maxFuel={100}
          />
        </section>
      </div>
    </div>
  );
};

export default Index;