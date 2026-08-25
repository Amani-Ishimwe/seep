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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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



  if (showLanding) {
    return <LandingPage onLaunchApp={() => setShowLanding(false)} />;
  }



  // Onboarding Flow Check
  if (!onboarded) {
    return <Onboarding />;
  }

  const activeClient = clients.find((c) => c.id === activeClientId);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#fafafa] font-sans relative text-lowercase">
      {/* Subtle ambient texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. Sidebar Navigation — drawer on mobile */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={(s) => { setActiveSection(s); setSidebarOpen(false); }}
        onAddClientClick={() => { setShowAddClientModal(true); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content panel */}
      <div className="flex-grow h-full flex flex-col overflow-hidden">
        
        {/* 2. Top Bar */}
        <header className="h-[52px] border-b border-[#e0e0e0] px-4 md:px-6 flex items-center justify-between z-10 shrink-0 bg-white/80 backdrop-blur-sm select-none">
          <div className="flex items-center gap-2 text-left">
            {/* Mobile hamburger */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-[#f2f2f2] transition-all mr-1"
            >
              <i className="fa-solid fa-bars text-[14px]"></i>
            </button>
            <i className={`text-[12px] text-[#8e8e93] hidden sm:block ${
              activeSection === "overview" ? "fa-solid fa-table-cells-large" :
              activeSection === "leaks" ? "fa-solid fa-triangle-exclamation" :
              activeSection === "clients" ? "fa-solid fa-users" :
              activeSection === "activity" ? "fa-solid fa-clock" :
              activeSection === "reports" ? "fa-solid fa-file-invoice" :
              activeSection === "integrations" ? "fa-solid fa-plug" :
              activeSection === "billing" ? "fa-solid fa-credit-card" :
              activeSection === "settings" ? "fa-solid fa-gear" :
              "fa-solid fa-circle-question"
            }`}></i>
            <h2 className="font-bold text-sm text-[#0a0a0a]">
              {activeClientId 
                ? <><span className="text-[#8e8e93] hidden sm:inline">clients /</span> {activeClient?.name}</>
                : activeSection}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Search — hidden on very small screens */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 md:w-44 pl-8 pr-4 py-1.5 bg-[#fafafa] border border-[#e0e0e0] rounded-lg text-xs outline-none focus:border-[#0a0a0a] focus:bg-white transition-all focus:w-56 font-sans"
              />
              <i className="fa-solid fa-magnifying-glass text-[11px] text-[#8e8e93] absolute left-2.5 top-2.5"></i>
            </div>

            {/* Icon Cluster */}
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={() => setActiveSection("settings")} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-[#f2f2f2] transition-all">
                <i className="fa-solid fa-gear text-[14px]"></i>
              </button>
              <button onClick={() => alert("no new alerts.")} className="relative w-8 h-8 rounded-lg flex items-center justify-center text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-[#f2f2f2] transition-all">
                <i className="fa-solid fa-bell text-[14px]"></i>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0a0a0a] rounded-full animate-notif-pulse"></span>
              </button>
              <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center text-[9px] font-bold uppercase cursor-pointer hover:bg-black/80 transition-colors">
                {userProfile?.name?.slice(0, 2) || "U"}
              </div>
            </div>
          </div>
        </header>


        {/* 3. Main Router viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 z-10 relative">
          
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
