"use client";

import React from "react";

interface LandingHeroViewProps {
  realtimeLeak: string;
  onStartTracking: () => void;
}

export default function LandingHeroView({ realtimeLeak, onStartTracking }: LandingHeroViewProps) {
  return (
    <div className="flex flex-col items-center text-center py-10 pb-20 select-none max-w-5xl mx-auto">
      {/* Badge */}
      <div className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 border border-[#E0E0E0] rounded-full bg-[#FFFFFF] mb-8 text-[#555555]">
        Introducing Seep 1.0
      </div>
      
      {/* Title */}
      <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-tighter text-[#0A0A0A] mb-6 max-w-[800px]">
        The money you don't know you're losing.
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg text-[#555555] font-normal leading-relaxed max-w-[600px] mb-10">
        Seep automatically detects unbilled hours freelancers lose to silent client drift, out-of-scope messaging, and unsaved revisions — showing you the leak in real time.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={onStartTracking}
          className="px-6 py-3 font-medium text-sm bg-[#0A0A0A] text-white border border-[#0A0A0A] rounded-lg hover:bg-[#222222] transition-colors"
        >
          Start Tracking Free
        </button>
        <button 
          onClick={() => alert("Launching live workspace demo...")}
          className="px-6 py-3 font-medium text-sm bg-white text-[#0A0A0A] border border-[#E0E0E0] rounded-lg hover:bg-[#F2F2F2] hover:border-[#0A0A0A] transition-all"
        >
          See How It Works
        </button>
      </div>

      {/* Leak Metaphor Panel */}
      <div className="w-full max-w-[700px] mt-16 relative">
        <div className="glass-panel rounded-lg p-10 flex flex-col items-center overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">
            Current Simulated Leakage
          </div>
          
          <div className="text-6xl font-bold tracking-tighter text-[#0A0A0A] mb-8">
            {realtimeLeak}
          </div>
          
          {/* Interactive SVG Flow Simulation */}
          <div className="w-full h-[200px] flex items-center justify-center relative">
            <svg className="w-[400px] h-[180px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="400" y2="140" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" strokeDasharray="4 4" />
              
              {/* Left container: Tracked Hours */}
              <rect x="60" y="20" width="80" height="120" rx="6" stroke="#0A0A0A" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="100" y="85" fontFamily="Inter" fontSize="11" fontWeight="700" fill="#0A0A0A" textAnchor="middle">BILLABLE</text>
              
              {/* Connection flow conduit */}
              <path d="M140 80h120" stroke="#0A0A0A" strokeWidth="1.5" className="animate-flow" />
              
              {/* Right container: Leaked Hours */}
              <rect x="260" y="20" width="80" height="120" rx="6" stroke="#0A0A0A" strokeWidth="1.5" />
              
              {/* Fluid leak fill in right container */}
              <path d="M261 95 Q 300 90 339 95 L 339 139 L 261 139 Z" fill="#F2F2F2" stroke="#0A0A0A" strokeWidth="1" />
              <text x="300" y="60" fontFamily="Inter" fontSize="11" fontWeight="700" fill="#0A0A0A" textAnchor="middle">UNBILLED</text>
              
              {/* Drip animation */}
              <circle cx="200" cy="80" r="3" fill="#0A0A0A" className="animate-drip" />
            </svg>
          </div>

          <p className="text-sm text-[#555555] font-normal leading-relaxed max-w-[480px] mt-4">
            As unrecorded client communications and Figma review sessions occur, time silently seeps into your unbilled reservoir, alerting you in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
