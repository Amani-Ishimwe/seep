"use client";

import React, { useState } from "react";

export default function OnboardingView() {
  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<number>(0);
  const [toolsConnected, setToolsConnected] = useState({
    slack: false,
    figma: false,
    github: false,
  });

  const nextStep = (targetStep: number) => {
    setStep(targetStep);
  };

  const toggleTool = (tool: "slack" | "figma" | "github") => {
    setToolsConnected((prev) => ({
      ...prev,
      [tool]: !prev[tool],
    }));
  };

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-4">
      {/* Title */}
      <div className="flex flex-col gap-2 mb-10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93]">Setup Flow</div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">Interactive Onboarding</h1>
      </div>

      {/* Onboarding Card */}
      <div className="glass-panel rounded-lg max-w-[580px] mx-auto p-10 w-full">
        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute top-4 left-0 right-0 h-[1px] bg-[#E0E0E0] z-0"></div>
          
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold z-10 bg-white transition-all ${
            step === 1 ? "bg-black text-white border-black" : step > 1 ? "bg-[#F2F2F2] text-[#555555] border-[#E0E0E0]" : "border-[#E0E0E0] text-[#8E8E93]"
          }`}>
            1
          </div>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold z-10 bg-white transition-all ${
            step === 2 ? "bg-black text-white border-black" : step > 2 ? "bg-[#F2F2F2] text-[#555555] border-[#E0E0E0]" : "border-[#E0E0E0] text-[#8E8E93]"
          }`}>
            2
          </div>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold z-10 bg-white transition-all ${
            step === 3 ? "bg-black text-white border-black" : "border-[#E0E0E0] text-[#8E8E93]"
          }`}>
            3
          </div>
        </div>

        {/* Step 1 View */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold tracking-tight text-[#0A0A0A] mb-3">How should Seep look for leaks?</h3>
            <p className="text-sm text-[#555555] font-normal leading-relaxed mb-8">Select how the tracker monitors your unbilled client activity.</p>
            
            <div className="flex flex-col gap-3 mb-8">
              <div 
                onClick={() => setSelectedMode(0)}
                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMode === 0 
                    ? "border-[#0A0A0A] bg-[#F2F2F2]" 
                    : "border-[#E0E0E0] bg-white hover:bg-[#FAFAFA] hover:border-[#0A0A0A]"
                }`}
              >
                <div className="w-[18px] h-[18px] rounded-full border border-[#E0E0E0] flex items-center justify-center mt-1 shrink-0">
                  {selectedMode === 0 && <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></div>}
                </div>
                <div className="text-left">
                  <strong className="text-sm font-semibold text-[#0A0A0A]">Silent Background Observer (Recommended)</strong>
                  <p className="text-[11px] text-[#555555] font-normal mt-1 leading-normal">
                    Runs in your OS system tray. Automatically measures document focus, file saves, and idle time without manual logs.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setSelectedMode(1)}
                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMode === 1 
                    ? "border-[#0A0A0A] bg-[#F2F2F2]" 
                    : "border-[#E0E0E0] bg-white hover:bg-[#FAFAFA] hover:border-[#0A0A0A]"
                }`}
              >
                <div className="w-[18px] h-[18px] rounded-full border border-[#E0E0E0] flex items-center justify-center mt-1 shrink-0">
                  {selectedMode === 1 && <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></div>}
                </div>
                <div className="text-left">
                  <strong className="text-sm font-semibold text-[#0A0A0A]">Calendar & Active API Sync</strong>
                  <p className="text-[11px] text-[#555555] font-normal mt-1 leading-normal">
                    Audits meeting calendars and revision APIs (like Figma and GitHub commits) relative to your manual tracking logs.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-[#E0E0E0] pt-6">
              <span></span>
              <button 
                onClick={() => nextStep(2)}
                className="px-5 py-2.5 font-semibold text-xs bg-[#0A0A0A] text-white rounded-md hover:bg-[#222222] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2 View */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold tracking-tight text-[#0A0A0A] mb-3">Link your work channels</h3>
            <p className="text-sm text-[#555555] font-normal leading-relaxed mb-8">
              Seep compares active background timestamps on these feeds against your billing logs to identify unbilled drift.
            </p>
            
            <div className="flex flex-col gap-3 mb-8">
              <div 
                onClick={() => toggleTool("slack")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  toolsConnected.slack 
                    ? "border-[#0A0A0A] bg-[#F2F2F2]" 
                    : "border-[#E0E0E0] bg-white hover:bg-[#FAFAFA]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[18px] h-[18px] rounded-full border border-[#E0E0E0] flex items-center justify-center">
                    {toolsConnected.slack && <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></div>}
                  </div>
                  <span className="text-sm font-medium">Slack Workspaces</span>
                </div>
                <span className="text-xs text-[#8E8E93]">{toolsConnected.slack ? "Connected" : "Disconnect"}</span>
              </div>

              <div 
                onClick={() => toggleTool("figma")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  toolsConnected.figma 
                    ? "border-[#0A0A0A] bg-[#F2F2F2]" 
                    : "border-[#E0E0E0] bg-white hover:bg-[#FAFAFA]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[18px] h-[18px] rounded-full border border-[#E0E0E0] flex items-center justify-center">
                    {toolsConnected.figma && <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></div>}
                  </div>
                  <span className="text-sm font-medium">Figma Enterprise</span>
                </div>
                <span className="text-xs text-[#8E8E93]">{toolsConnected.figma ? "Connected" : "Disconnect"}</span>
              </div>

              <div 
                onClick={() => toggleTool("github")}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  toolsConnected.github 
                    ? "border-[#0A0A0A] bg-[#F2F2F2]" 
                    : "border-[#E0E0E0] bg-white hover:bg-[#FAFAFA]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[18px] h-[18px] rounded-full border border-[#E0E0E0] flex items-center justify-center">
                    {toolsConnected.github && <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></div>}
                  </div>
                  <span className="text-sm font-medium">GitHub Repositories</span>
                </div>
                <span className="text-xs text-[#8E8E93]">{toolsConnected.github ? "Connected" : "Disconnect"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-[#E0E0E0] pt-6">
              <button 
                onClick={() => nextStep(1)}
                className="px-5 py-2.5 font-semibold text-xs bg-white text-[#0A0A0A] border border-[#E0E0E0] rounded-md hover:bg-[#F2F2F2] transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => nextStep(3)}
                className="px-5 py-2.5 font-semibold text-xs bg-[#0A0A0A] text-white rounded-md hover:bg-[#222222] transition-colors"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}

        {/* Step 3 View (Pulsing Empty State Scanner) */}
        {step === 3 && (
          <div className="animate-fade-in text-center flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full border border-[#E0E0E0] bg-white/60 backdrop-blur-md flex items-center justify-center mb-6 relative">
              {/* Scan rings */}
              <div className="absolute top-0 left-0 w-full h-full border-2 border-black rounded-full animate-scan"></div>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#0A0A0A]">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">Seep is Observing</h3>
            <p className="text-xs text-[#555555] font-normal leading-relaxed max-w-[320px] mb-8">
              The silent background daemon is monitoring local window activities. As you open Slack, Figma files, or write commits, unbilled leaks will appear on the dashboard.
            </p>

            <div className="flex flex-col gap-1 items-center border border-black/5 rounded-lg py-3 px-6 bg-[#FAFAFA] mb-8">
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#8E8E93]">Observation State</span>
              <span className="text-sm font-bold text-[#0A0A0A] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                Perfect Sync ($0.00 leak)
              </span>
            </div>
            
            <button 
              onClick={() => {
                setStep(1);
                setSelectedMode(0);
                setToolsConnected({ slack: false, figma: false, github: false });
              }}
              className="px-4 py-2 font-semibold text-[10px] bg-white text-[#0A0A0A] border border-[#E0E0E0] rounded-md hover:bg-[#F2F2F2] hover:border-black transition-all"
            >
              Reset Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
