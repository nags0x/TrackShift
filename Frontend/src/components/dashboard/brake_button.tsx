import React, { useState } from "react";
import { useUserData } from "@/store/userData.store";
export default function Brake_Button() {

    const isBraking:boolean = useUserData((state)=>state.Data.Brake)

    console.log("core" , isBraking)
  return (
    <div className="flex  items-center justify-center min-h-60 p-4">
      <div className="text-center ">
        {/* Button Wrapper */}
        <div className="relative" >
          
          {/* Glow Ring */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl transition-all duration-300 ${
                isBraking
                ? "bg-red-600 opacity-60 scale-75"
                : "bg-green-500 opacity-40 scale-75"
            }`}
          />

          {/* MAIN BUTTON */}
          <div className="relative w-48 h-48 cursor-pointer group">

            {/* Outer Metal Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 shadow-xl" />

            {/* Inner Dark Ring */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-black to-gray-900 shadow-inner" />

            {/* LED Surface */}
            <div
              className={`absolute inset-6 rounded-full transition-all duration-300 ${
                isBraking
                  ? "bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5),0_0_30px_rgba(220,38,38,1),0_0_50px_rgba(220,38,38,0.6)]"
                  : "bg-gradient-to-br from-green-400 via-green-600 to-green-800 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(22,163,74,0.8)]"
              }`}
            >
              {/* Highlight */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-white to-transparent opacity-40 rounded-full blur-md" />

              {/* LED Texture */}
              <div className="absolute inset-4 rounded-full overflow-hidden opacity-30">
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full gap-1">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full ${
                        isBraking ? "bg-red-900" : "bg-green-900"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl">
                  {isBraking ? "🔴" : "🟢"}
                </div>
              </div>

              {/* Pulse Ring on Brake */}
              {isBraking && (
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-40 animate-ping" />
              )}
            </div>

            {/* Screws */}
            {[0, 90, 180, 270].map((rotation) => (
              <div
                key={rotation}
                className="absolute w-4 h-4 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full shadow-md"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-85px)`,
                }}
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-800 to-gray-900" />
                <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-gray-950 -translate-x-1/2 -translate-y-1/2" />
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
