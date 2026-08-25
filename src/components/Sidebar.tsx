"use client";

import React from "react";
import { useSeep } from "@/context/SeepContext";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onAddClientClick: () => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  onAddClientClick,
}: SidebarProps) {
  const {
    calendarConnected,
    clients,
    events,
    invoicedHours,
    setActiveClientId,
    userProfile,
  } = useSeep();

  const CURRENT_WEEK = "2026-08-24";

  // Compute total leak
  const calculateTotalLeak = () => {
    let sum = 0;
    clients.forEach((client) => {
      const clientEvents = events.filter((evt) => evt.clientId === client.id && evt.billable);
      const calendarHours = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);
      const invoiceRecord = invoicedHours.find(
        (inv) => inv.clientId === client.id && inv.weekStart === CURRENT_WEEK
      );
      const invoiced = invoiceRecord ? invoiceRecord.hours : 0;
      const leakHours = Math.max(0, calendarHours - invoiced);
      sum += leakHours * client.rate;
    });
    return sum;
  };

  const totalLeak = calculateTotalLeak();
  
  const formattedTotalLeak = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalLeak);

  const primaryMenuItems = [
    { id: "overview", label: "overview", iconClass: "fa-solid fa-table-cells-large" },
    { id: "leaks", label: "leaks", iconClass: "fa-solid fa-triangle-exclamation" },
    { id: "clients", label: "clients", iconClass: "fa-solid fa-users" },
    { id: "activity", label: "activity", iconClass: "fa-solid fa-clock" },
    { id: "reports", label: "reports", iconClass: "fa-solid fa-file-invoice" },
  ];

  const secondaryMenuItems = [
    { id: "integrations", label: "integrations", iconClass: "fa-solid fa-plug" },
    { id: "billing", label: "billing", iconClass: "fa-solid fa-credit-card" },
    { id: "settings", label: "settings", iconClass: "fa-solid fa-gear" },
    { id: "help", label: "help", iconClass: "fa-solid fa-circle-question" },
  ];

  return (
    <aside className="w-[240px] h-full bg-[#fafafa] border-r border-[#e0e0e0] px-3 py-4 flex flex-col justify-between z-10 shrink-0 select-none">
      <div className="flex flex-col gap-4">
        
        {/* Brand Logomark */}
        <div 
          onClick={() => {
            setActiveClientId(null);
            setActiveSection("overview");
          }}
          className="flex items-center gap-2.5 text-[#0a0a0a] cursor-pointer hover:opacity-80 transition-opacity px-2 py-1"
        >
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center text-white shrink-0">
            <i className="fa-solid fa-droplet text-[10px] text-white"></i>
          </div>
          <span className="font-black text-lg tracking-tighter font-sans select-none">seep</span>
          <span className="text-[7px] font-mono text-[#8e8e93] border border-[#e0e0e0] px-1.5 py-0.5 rounded select-none ml-auto">v1.0</span>
        </div>

        {/* User Account Details */}
        <div className="flex items-center gap-3 bg-white border border-[#e0e0e0] rounded-lg px-3 py-2.5 mx-0.5">
          <div className="w-8 h-8 bg-[#0a0a0a] text-white rounded-lg flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
            {userProfile.name.slice(0, 2)}
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <span className="text-[11px] font-bold text-[#0a0a0a] tracking-tight truncate">{userProfile.name}</span>
            <span className="text-[9px] text-[#8e8e93] font-medium">${userProfile.billingRate}/hr</span>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full shrink-0 ${
            userProfile.tier === "pro" 
              ? "bg-[#0a0a0a] text-white" 
              : "bg-[#f2f2f2] text-[#8e8e93]"
          }`}>
            {userProfile.tier}
          </span>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex flex-col gap-0.5 px-0.5">
          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8e8e93] px-2.5 mb-1">menu</span>
          {primaryMenuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveClientId(null);
                  setActiveSection(item.id);
                }}
                className={`group flex items-center gap-3 px-2.5 py-2 text-xs font-semibold tracking-tight transition-all text-left rounded-lg ${
                  isActive 
                    ? "text-[#0a0a0a] bg-white border border-[#e0e0e0] shadow-sm" 
                    : "text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-white/60"
                }`}
              >
                <i className={`${item.iconClass} text-[13px] w-4 text-center transition-colors ${
                  isActive ? "text-[#0a0a0a]" : "text-[#8e8e93] group-hover:text-[#0a0a0a]"
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Secondary Navigation Menu & Upsell Card at bottom */}
      <div className="flex flex-col gap-3 mt-auto">
        
        {/* Secondary Navigation */}
        <nav className="flex flex-col gap-0.5 px-0.5">
          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8e8e93] px-2.5 mb-1">system</span>
          {secondaryMenuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveClientId(null);
                  setActiveSection(item.id);
                }}
                className={`group flex items-center gap-3 px-2.5 py-2 text-[11px] font-semibold tracking-tight transition-all text-left rounded-lg ${
                  isActive 
                    ? "text-[#0a0a0a] bg-white border border-[#e0e0e0] shadow-sm" 
                    : "text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-white/60"
                }`}
              >
                <i className={`${item.iconClass} text-[12px] w-4 text-center transition-colors ${
                  isActive ? "text-[#0a0a0a]" : "text-[#8e8e93] group-hover:text-[#0a0a0a]"
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade Pro Upsell Card (Only show if tier is free) */}
        {userProfile.tier === "free" && (
          <div className="bg-[#0a0a0a] rounded-lg p-4 text-left relative overflow-hidden mx-0.5">
            <div className="absolute inset-0 shimmer-border pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">go pro</span>
              <p className="text-[10px] text-white/60 leading-relaxed mb-3">
                unlock unlimited syncs, team dashboards, and advanced leak detection.
              </p>
              <button 
                onClick={() => setActiveSection("billing")}
                className="w-full py-2 bg-white text-[#0a0a0a] text-[9px] font-black uppercase tracking-wider rounded-md hover:bg-white/90 transition-colors cursor-pointer"
              >
                upgrade to pro
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
