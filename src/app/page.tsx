"use client";

import React, { useState } from "react";
import { useSeep, Client } from "@/context/SeepContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ClientDetail from "@/components/ClientDetail";
import Onboarding from "@/components/Onboarding";
import LandingPage from "@/components/LandingPage";

// View imports
import LeaksView from "@/components/views/LeaksView";
import ClientsView from "@/components/views/ClientsView";
import ActivityView from "@/components/views/ActivityView";
import ReportsView from "@/components/views/ReportsView";
import IntegrationsView from "@/components/views/IntegrationsView";
import BillingView from "@/components/views/BillingView";
import SettingsView from "@/components/views/SettingsView";

export default function Page() {
  const {
    onboarded,
    clients,
    events,
    invoicedHours,
    isLoading,
    activeClientId,
    setActiveClientId,
    activeSection,
    setActiveSection,
    searchQuery,
    setSearchQuery,
    addClient,
    userProfile,
    syncErrorMessage,
  } = useSeep();

  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Add Client Modal states
  const [newClientName, setNewClientName] = useState("");
  const [newClientRate, setNewClientRate] = useState("75");
  const [newRetainerCap, setNewRetainerCap] = useState("");

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;
    
    const rateVal = parseFloat(newClientRate) || 75;
    const capVal = newRetainerCap ? parseFloat(newRetainerCap) : null;
    
    await addClient(newClientName, rateVal, capVal);
    
    setNewClientName("");
    setNewClientRate("75");
    setNewRetainerCap("");
    setShowAddClientModal(false);
  };

  // Skeleton Loader (Pulsing panels)
  if (isLoading) {
    return (
      <div className="flex w-full h-screen bg-[#fafafa] overflow-hidden select-none text-lowercase">
        {/* Skeleton Sidebar */}
        <div className="w-[240px] h-full bg-[#ffffff] border-r border-[#e0e0e0] p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="w-20 h-6 bg-[#e8e8e8] animate-pulse rounded mb-12"></div>
            <div className="flex flex-col gap-4">
              <div className="w-full h-9 bg-[#e8e8e8] animate-pulse rounded"></div>
              <div className="w-full h-9 bg-[#e8e8e8] animate-pulse rounded"></div>
              <div className="w-full h-9 bg-[#e8e8e8] animate-pulse rounded"></div>
            </div>
          </div>
          <div className="w-full h-24 bg-[#e8e8e8] animate-pulse rounded-lg"></div>
        </div>
        {/* Skeleton Content */}
        <div className="flex-1 p-16 flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-32 h-3 bg-[#e8e8e8] animate-pulse rounded"></div>
            <div className="w-80 h-20 bg-[#e8e8e8] animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[220px] bg-[#e8e8e8] animate-pulse rounded-lg"></div>
            <div className="h-[220px] bg-[#e8e8e8] animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return <LandingPage onLaunchApp={() => setShowLanding(false)} />;
  }

  // Intercept marketing site toggle from sidebar
  if (activeSection === "marketing") {
    setTimeout(() => {
      setActiveSection("overview");
      setShowLanding(true);
    }, 0);
    return null;
  }

  // Onboarding Flow Check
  if (!onboarded) {
    return <Onboarding />;
  }

  const activeClient = clients.find((c) => c.id === activeClientId);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#fafafa] font-sans relative text-lowercase">
      {/* Ambient background grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[80px] h-[80px] bg-transparent opacity-8 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:20px_20px] inset-0"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full top-[15%] right-[10%] bg-radial from-[#e8e8e8]/40 to-transparent opacity-25 border border-[#e0e0e0]/30 animate-float-slow"></div>
        <div className="absolute w-[450px] h-[450px] rounded-[38%_62%_63%_37%_/_41%_44%_56%_59%] bottom-[10%] left-[5%] bg-radial from-[#f2f2f2]/60 to-transparent opacity-25 border border-[#e0e0e0]/30 animate-float-slower"></div>
      </div>

      {/* 1. Persistent Left Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onAddClientClick={() => setShowAddClientModal(true)}
      />

      {/* Content panel */}
      <div className="flex-grow h-full flex flex-col overflow-hidden">
        
        {/* 2. Persistent Top Bar */}
        <header className="h-[52px] border-b border-[#e0e0e0] px-6 flex items-center justify-between z-10 shrink-0 bg-white select-none">
          <div className="text-left font-bold text-[#0a0a0a]">
            <h2>
              {activeClientId 
                ? `client / ${activeClient?.name}`
                : activeSection}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Pill */}
            <div className="relative">
              <input
                type="text"
                placeholder="search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-8 pr-4 py-1.5 bg-[#f2f2f2]/60 border border-[#e0e0e0] rounded-full text-xs outline-none focus:border-black transition-all focus:w-60 font-sans"
              />
              <i className="fa-solid fa-magnifying-glass text-[14px] text-[#8e8e93] absolute left-3 top-2.5"></i>
            </div>

            {/* Icon Cluster */}
            <div className="flex items-center gap-4 text-[#8e8e93]">
              <button onClick={() => setActiveSection("settings")} className="hover:text-black transition-colors">
                <i className="fa-solid fa-gear text-[18px]"></i>
              </button>
              <button onClick={() => alert("no new alerts.")} className="relative hover:text-black transition-colors">
                <i className="fa-solid fa-bell text-[18px]"></i>
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-black rounded-full"></span>
              </button>
              <div className="w-6 h-6 rounded-full bg-[#f2f2f2] border border-black/10 flex items-center justify-center">
                <i className="fa-solid fa-circle-user text-[16px] text-black"></i>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Main Router viewport */}
        <div className="flex-1 overflow-y-auto p-6 z-10 relative">
          
          {syncErrorMessage && (
            <div className="fixed top-6 right-6 z-50 glass-panel rounded-md px-5 py-3 border-black text-xs font-semibold text-black animate-fade-in flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
              <span>{syncErrorMessage}</span>
            </div>
          )}

          {activeClientId !== null && activeClient ? (
            <ClientDetail client={activeClient} />
          ) : activeSection === "overview" || activeSection === "dashboard" ? (
            <Dashboard />
          ) : activeSection === "leaks" ? (
            <LeaksView />
          ) : activeSection === "clients" ? (
            <ClientsView onAddClientClick={() => setShowAddClientModal(true)} />
          ) : activeSection === "activity" ? (
            <ActivityView />
          ) : activeSection === "reports" ? (
            <ReportsView />
          ) : activeSection === "integrations" ? (
            <IntegrationsView />
          ) : activeSection === "billing" ? (
            <BillingView />
          ) : activeSection === "settings" ? (
            <SettingsView />
          ) : activeSection === "help" ? (
            <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-left text-lowercase">
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-1">documentation</span>
                <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a]">seep support guides</h1>
              </div>

              <div className="glass-panel p-6 rounded-lg flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-2">how seep detects leakage</h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    seep runs query heuristics over connected calendar tools. it analyzes participants list filters and meeting titles to verify unbilled drift against invoiced logs.
                  </p>
                </div>
                
                <div className="border-t border-black/5 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-2">what is an effective hourly rate?</h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    your effective rate is calculated as: (total invoiced income) divided by (actual hours worked). if you work unbilled revisions, this rate drops below your target threshold.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

        </div>
      </div>

      {/* Add Client Glass Modal Overlay */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/15 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in select-none">
          <div className="glass-panel w-full max-w-[460px] p-8 rounded-lg text-left relative bg-white">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAddClientModal(false)}
              className="absolute top-6 right-6 text-[#8e8e93] hover:text-black transition-colors"
            >
              <i className="fa-solid fa-xmark text-[16px] text-black"></i>
            </button>

            <h3 className="text-xl font-bold tracking-tight text-[#0a0a0a] mb-2 flex items-center gap-2">
              <i className="fa-solid fa-circle-plus text-[22px]"></i>
              add a client
            </h3>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              input new client parameters. we will match matching calendar events dynamically.
            </p>

            <form onSubmit={handleAddClientSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1.5">
                  client name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. zenith agency"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-sm outline-none focus:border-black transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1.5">
                    hourly rate (usd)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="75"
                    value={newClientRate}
                    onChange={(e) => setNewClientRate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-sm outline-none focus:border-black transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1.5">
                    hour cap (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="none"
                    value={newRetainerCap}
                    onChange={(e) => setNewRetainerCap(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-sm outline-none focus:border-black transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded mt-4 hover:bg-black/85 transition-colors"
              >
                create client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
