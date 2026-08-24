"use client";

import React, { useState } from "react";
import { useSeep, UserProfile } from "@/context/SeepContext";

export default function SettingsView() {
  const {
    userProfile,
    updateUserProfile,
    simulateErrors,
    setSimulateErrors,
    resetApp,
  } = useSeep();

  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profileRate, setProfileRate] = useState(String(userProfile.billingRate));
  const [profileCurrency, setProfileCurrency] = useState(userProfile.billingCurrency);
  const [profileStructure, setProfileStructure] = useState(userProfile.billingStructure);
  const [profileAudience, setProfileAudience] = useState(userProfile.audienceType);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName.toLowerCase(),
      email: profileEmail.toLowerCase(),
      billingRate: parseFloat(profileRate) || 75,
      billingCurrency: profileCurrency,
      billingStructure: profileStructure as any,
      audienceType: profileAudience as any,
    });
    alert("settings updated successfully.");
  };

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a] text-left">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-1">preferences</span>
        <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a]">account settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        
        {/* Left Form: Profile settings */}
        <form onSubmit={handleProfileSave} className="glass-panel p-6 rounded-lg flex flex-col gap-6 w-full">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">freelancer billing profile</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">freelancer name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-xs outline-none focus:border-black font-sans"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">email address</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-xs outline-none focus:border-black font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">standard rate</label>
              <input
                type="number"
                required
                value={profileRate}
                onChange={(e) => setProfileRate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-xs outline-none focus:border-black font-sans"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">currency</label>
              <select
                value={profileCurrency}
                onChange={(e) => setProfileCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-xs outline-none focus:border-black font-sans font-bold text-[#555555]"
              >
                <option value="usd">usd</option>
                <option value="eur">eur</option>
                <option value="gbp">gbp</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">billing method</label>
              <select
                value={profileStructure}
                onChange={(e) => setProfileStructure(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-xs outline-none focus:border-black font-sans font-bold text-[#555555]"
              >
                <option value="hourly">hourly rate</option>
                <option value="retainer">retainer cap</option>
                <option value="project">project scope</option>
                <option value="mixed">mixed billing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">primary client types</label>
            <select
              value={profileAudience}
              onChange={(e) => setProfileAudience(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-xs outline-none focus:border-black font-sans font-bold text-[#555555]"
            >
              <option value="clients">individual clients</option>
              <option value="agencies">agencies</option>
              <option value="startups">startups</option>
              <option value="companies">large companies</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded self-start hover:bg-black/85 transition-colors"
          >
            save billing profile
          </button>
        </form>

        {/* Right Columns: Operations (simulated errors / wipe DB) */}
        <div className="flex flex-col gap-6 w-full">
          <div className="glass-panel p-5 rounded-lg text-left flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <i className="fa-solid fa-gear text-[18px]"></i>
              developer diagnostics
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={simulateErrors} 
                    onChange={(e) => setSimulateErrors(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#e8e8e8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0a0a0a]"></div>
                  <span className="ml-3 text-xs font-semibold text-[#0a0a0a]">simulate sync failure</span>
                </label>
                <p className="text-[10px] text-[#8e8e93] mt-1">
                  toggles error dialogs on updates to check optimistic UI rollback logic.
                </p>
              </div>

              <div className="border-t border-black/5 pt-4">
                <button
                  type="button"
                  onClick={resetApp}
                  className="w-full py-2 bg-[#a94442]/10 border border-[#a94442]/20 text-[#a94442] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#a94442]/25 transition-colors"
                >
                  wipe localStorage database
                </button>
                <p className="text-[10px] text-[#8e8e93] mt-2">
                  clears onboarding credentials and redirects to step 1.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
