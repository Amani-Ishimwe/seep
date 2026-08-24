"use client";

import React from "react";
import { useSeep } from "@/context/SeepContext";

export default function BillingView() {
  const { userProfile, updateUserProfile } = useSeep();

  const handleSwitchTier = (tier: "free" | "pro") => {
    updateUserProfile({ tier });
    alert(`switched plan to ${tier}`);
  };

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a] text-left">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-1">subscription plans</span>
        <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a]">seep billing center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <div className={`glass-panel p-8 rounded-lg flex flex-col justify-between ${userProfile.tier === "free" ? "border-black" : ""}`}>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-black">free plan</h3>
                <span className="text-xs text-[#8e8e93]">try seep features</span>
              </div>
              <span className="text-2xl font-black text-black">$0</span>
            </div>

            <ul className="flex flex-col gap-3 text-xs text-[#555555] mb-8">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-black"></i>
                basic unbilled leak detection
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-black"></i>
                manual activity logging fallback
              </li>
              <li className="flex items-center gap-2 text-[#8e8e93]">
                <i className="fa-solid fa-xmark text-[#8e8e93]"></i>
                limited leak analysis history
              </li>
              <li className="flex items-center gap-2 text-[#8e8e93]">
                <i className="fa-solid fa-xmark text-[#8e8e93]"></i>
                no ai scope adjustment drafting
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSwitchTier("free")}
            disabled={userProfile.tier === "free"}
            className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${
              userProfile.tier === "free"
                ? "bg-[#f2f2f2] text-[#8e8e93] border-[#e0e0e0] cursor-default"
                : "bg-white text-black border-[#e0e0e0] hover:border-black"
            }`}
          >
            {userProfile.tier === "free" ? "active subscription" : "downgrade to free"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`glass-panel p-8 rounded-lg flex flex-col justify-between relative overflow-hidden ${userProfile.tier === "pro" ? "border-black" : ""}`}>
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-[#0a0a0a] text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl">
            recommended
          </div>

          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-black">pro freelancer</h3>
                <span className="text-xs text-[#8e8e93]">automated income recovery</span>
              </div>
              <span className="text-2xl font-black text-black">$29<span className="text-xs text-[#8e8e93]">/mo</span></span>
            </div>

            <ul className="flex flex-col gap-3 text-xs text-[#555555] mb-8">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-black"></i>
                automated calendar leak scanners
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-black"></i>
                unlimited active client profiles
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-black"></i>
                ai scope creep adjustment drafts
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-black"></i>
                weekly leakage summary reports
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSwitchTier("pro")}
            disabled={userProfile.tier === "pro"}
            className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
              userProfile.tier === "pro"
                ? "bg-[#f2f2f2] text-[#8e8e93] border border-[#e0e0e0] cursor-default"
                : "bg-black text-white hover:bg-black/85"
            }`}
          >
            {userProfile.tier === "pro" ? "active subscription" : "upgrade to pro ($29)"}
          </button>
        </div>
      </div>

    </div>
  );
}
