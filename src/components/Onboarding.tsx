"use client";

import React, { useState } from "react";
import { useSeep } from "@/context/SeepContext";

export default function Onboarding() {
  const {
    onboardingStep,
    setOnboardingStep,
    connectCalendar,
    updateUserProfile,
    completeOnboarding,
    calendarConnected,
  } = useSeep();

  const [oauthSimulating, setOauthSimulating] = useState(false);

  // Step variables
  const [rateVal, setRateVal] = useState("75");
  const [currencyVal, setCurrencyVal] = useState("usd");
  const [structureVal, setStructureVal] = useState<"hourly" | "retainer" | "project" | "mixed">("hourly");
  const [audienceVal, setAudienceVal] = useState<"clients" | "agencies" | "startups" | "companies" | "other">("clients");

  const handleNextStep = () => {
    setOnboardingStep(onboardingStep + 1);
  };

  const handlePrevStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleSaveRateAndNext = () => {
    updateUserProfile({
      billingRate: parseFloat(rateVal) || 75,
      billingCurrency: currencyVal,
    });
    handleNextStep();
  };

  const handleSaveStructureAndNext = (struct: "hourly" | "retainer" | "project" | "mixed") => {
    updateUserProfile({ billingStructure: struct });
    setStructureVal(struct);
    handleNextStep();
  };

  const handleSaveAudienceAndNext = (aud: "clients" | "agencies" | "startups" | "companies" | "other") => {
    updateUserProfile({ audienceType: aud as any });
    setAudienceVal(aud as any);
    handleNextStep();
  };

  const handleConnectCalendar = async () => {
    setOauthSimulating(true);
    setTimeout(async () => {
      await connectCalendar();
      setOauthSimulating(false);
      handleNextStep();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-6 select-none relative w-full text-lowercase text-black">
      {/* Ambient background element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[300px] h-[300px] rounded-full top-[20%] right-[15%] bg-radial from-[#e8e8e8]/50 to-transparent opacity-30 border border-[#e0e0e0]/20 animate-float-slow"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bottom-[10%] left-[10%] bg-radial from-[#f2f2f2]/60 to-transparent opacity-30 border border-[#e0e0e0]/20 animate-float-slower"></div>
      </div>

      <div className="glass-panel w-full max-w-[480px] p-8 rounded-lg relative z-10 bg-white">
        
        {/* Step Indicator */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-grow rounded-full transition-all duration-300 ${
                onboardingStep >= s ? "bg-black" : "bg-black/10"
              }`}
            ></div>
          ))}
        </div>

        {/* Step 1: Welcome Screen */}
        {onboardingStep === 1 && (
          <div className="flex flex-col items-start text-left animate-fade-in">
            <i className="fa-solid fa-droplet text-[44px] text-black mb-4"></i>
            <h1 className="text-2xl font-black tracking-tight text-[#0a0a0a] mb-2 font-sans">
              let's find your hidden billable time
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed mb-8">
              seep checks active calendar alignments, emails, and channels to track unbilled leak hours. find out how much you are leaving on the table.
            </p>
            <button
              onClick={handleNextStep}
              className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
            >
              get started
            </button>
          </div>
        )}

        {/* Step 2: Billing rate setup */}
        {onboardingStep === 2 && (
          <div className="flex flex-col items-start text-left animate-fade-in w-full">
            <h1 className="text-xl font-black tracking-tight text-[#0a0a0a] mb-2 font-sans">
              what do you charge?
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              we use your base hourly rate to estimate the financial value of unbilled leaks.
            </p>

            <div className="flex gap-4 w-full mb-8">
              <div className="flex-1">
                <label className="block text-[9px] font-bold text-[#8e8e93] uppercase tracking-wider mb-1.5">hourly rate</label>
                <input
                  type="number"
                  required
                  value={rateVal}
                  onChange={(e) => setRateVal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-sm outline-none focus:border-black transition-all font-sans"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-[#8e8e93] uppercase tracking-wider mb-1.5">currency</label>
                <select
                  value={currencyVal}
                  onChange={(e) => setCurrencyVal(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#e0e0e0] rounded text-sm outline-none focus:border-black font-sans font-bold text-[#555555]"
                >
                  <option value="usd">usd</option>
                  <option value="eur">eur</option>
                  <option value="gbp">gbp</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between w-full gap-4">
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#8e8e93] text-xs font-bold uppercase tracking-wider rounded hover:border-black hover:text-black transition-colors"
              >
                back
              </button>
              <button
                type="button"
                onClick={handleSaveRateAndNext}
                className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
              >
                continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Billing method */}
        {onboardingStep === 3 && (
          <div className="flex flex-col items-start text-left animate-fade-in w-full">
            <h1 className="text-xl font-black tracking-tight text-[#0a0a0a] mb-2 font-sans">
              how do you usually bill?
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              select your primary contracting arrangement structure.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              {[
                { id: "hourly", label: "hourly", desc: "fixed hourly billing rate" },
                { id: "retainer", label: "retainer", desc: "monthly cap allowance hours" },
                { id: "project", label: "project", desc: "fixed-scope project milestones" },
                { id: "mixed", label: "mixed", desc: "variable mixed arrangement structures" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSaveStructureAndNext(item.id as any)}
                  className="glass-panel p-4 rounded-lg text-left hover:border-black transition-all flex flex-col justify-between"
                >
                  <span className="font-bold text-xs text-black block mb-1">{item.label}</span>
                  <span className="text-[10px] text-[#8e8e93] leading-snug">{item.desc}</span>
                </button>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handlePrevStep}
              className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#8e8e93] text-xs font-bold uppercase tracking-wider rounded hover:border-black hover:text-black transition-colors"
            >
              back
            </button>
          </div>
        )}

        {/* Step 4: Audience Target */}
        {onboardingStep === 4 && (
          <div className="flex flex-col items-start text-left animate-fade-in w-full">
            <h1 className="text-xl font-black tracking-tight text-[#0a0a0a] mb-2 font-sans">
              who do you work with?
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              we calibrate our leak parameters based on your primary clientele.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              {[
                { id: "clients", label: "direct clients", desc: "contracting direct with clients" },
                { id: "agencies", label: "agencies", desc: "outsourced agency assignments" },
                { id: "startups", label: "startups", desc: "rapid growth business products" },
                { id: "companies", label: "large companies", desc: "corporate structures & groups" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSaveAudienceAndNext(item.id as any)}
                  className="glass-panel p-4 rounded-lg text-left hover:border-black transition-all flex flex-col justify-between"
                >
                  <span className="font-bold text-xs text-black block mb-1">{item.label}</span>
                  <span className="text-[10px] text-[#8e8e93] leading-snug">{item.desc}</span>
                </button>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handlePrevStep}
              className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#8e8e93] text-xs font-bold uppercase tracking-wider rounded hover:border-black hover:text-black transition-colors"
            >
              back
            </button>
          </div>
        )}

        {/* Step 5: Connect Calendar */}
        {onboardingStep === 5 && (
          <div className="flex flex-col items-start text-left animate-fade-in w-full">
            <h1 className="text-xl font-black tracking-tight text-[#0a0a0a] mb-2 font-sans">
              connect calendar
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              seep uses your calendar logs to parse client meeting coordinates and durations. you control access and can disconnect anytime.
            </p>

            {oauthSimulating ? (
              <div className="w-full flex flex-col items-center py-8 border border-black/5 rounded-lg bg-[#ffffff]/80 backdrop-blur-md mb-8">
                <i className="fa-solid fa-satellite-dish text-[32px] text-black animate-pulse mb-3"></i>
                <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-wider">authorizing google workspace...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full mb-8">
                <button
                  onClick={handleConnectCalendar}
                  className="w-full py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-google text-[16px] text-white"></i>
                  connect google calendar
                </button>
                <button
                  onClick={handleNextStep}
                  className="w-full py-3 bg-white text-black border border-[#e0e0e0] text-xs font-bold uppercase tracking-wider rounded hover:bg-[#f2f2f2]/40 transition-colors"
                >
                  i'll do this later
                </button>
              </div>
            )}

            <button 
              type="button" 
              onClick={handlePrevStep}
              className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#8e8e93] text-xs font-bold uppercase tracking-wider rounded hover:border-black hover:text-black transition-colors"
            >
              back
            </button>
          </div>
        )}

        {/* Step 6: Initial Insight Scanner Empty State */}
        {onboardingStep === 6 && (
          <div className="flex flex-col items-center text-center animate-fade-in py-4">
            <div className="w-20 h-20 rounded-full border border-[#e0e0e0] bg-white/60 backdrop-blur-md flex items-center justify-center mb-6 relative">
              <div className="absolute top-0 left-0 w-full h-full border-2 border-black rounded-full animate-scan"></div>
              <i className="fa-solid fa-satellite-dish text-[32px] text-black"></i>
            </div>

            <h1 className="text-xl font-black tracking-tight text-[#0a0a0a] mb-2 font-sans">
              seep is ready to find your first leak
            </h1>
            <p className="text-xs text-[#555555] leading-relaxed max-w-[320px] mb-8">
              connect your calendar or add activity logs manually. seep will start looking for work that may have gone unbilled.
            </p>

            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={completeOnboarding}
                className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
              >
                go to dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
