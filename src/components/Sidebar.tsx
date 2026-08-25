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
    <aside className="w-[240px] h-full bg-[#ffffff]/90 backdrop-blur-md border-r border-[#e0e0e0] p-4 flex flex-col justify-between z-10 shrink-0 select-none text-lowercase">
      <div className="flex flex-col gap-5">
        
        {/* Brand Logomark */}
        <div 
          onClick={() => {
            setActiveClientId(null);
            setActiveSection("overview");
          }}
          className="flex items-center gap-2.5 text-[#0a0a0a] cursor-pointer hover:opacity-85 transition-opacity py-2 relative"
        >
          <div className="w-6.5 h-6.5 bg-black flex items-center justify-center text-white shrink-0">
            <i className="fa-solid fa-droplet text-[11px] text-white"></i>
          </div>
          <span className="font-black text-xl tracking-tighter font-sans select-none">seep</span>
          <span className="text-[8px] font-mono text-black/40 border border-black/10 px-1 py-0.2 select-none self-start mt-0.5 ml-1">v1.0</span>
        </div>

        {/* User Account Details */}
        <div className="flex items-center justify-between border-y border-black/5 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">
              {userProfile.name.slice(0, 2)}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-black tracking-tight">{userProfile.name}</span>
              <span className="text-[9px] text-[#8e8e93] font-medium tracking-tight">target: ${userProfile.billingRate}/hr</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded ${
            userProfile.tier === "pro" 
              ? "bg-black text-white" 
              : "bg-[#f2f2f2] text-[#8e8e93]"
          }`}>
            {userProfile.tier}
          </span>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex flex-col gap-0.5">
          {primaryMenuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveClientId(null);
                  setActiveSection(item.id);
                }}
                className={`group relative flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-wide transition-all text-left ${
                  isActive 
                    ? "text-black bg-black/[0.03]" 
                    : "text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-black/[0.01]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-black"></span>
                )}
                <i className={`${item.iconClass} text-[15px] transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-black" : "text-[#8e8e93] group-hover:text-black"
                }`} />
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Secondary Navigation Menu & Upsell Card at bottom */}
      <div className="flex flex-col gap-4 mt-auto">
        
        {/* Secondary Navigation */}
        <nav className="flex flex-col gap-0.5 pt-3 border-t border-black/5">
          {secondaryMenuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveClientId(null);
                  setActiveSection(item.id);
                }}
                className={`group relative flex items-center gap-3 px-3 py-2 text-[11px] font-bold tracking-wide transition-all text-left ${
                  isActive 
                    ? "text-black bg-black/[0.03]" 
                    : "text-[#8e8e93] hover:text-[#0a0a0a] hover:bg-black/[0.01]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-black"></span>
                )}
                <i className={`${item.iconClass} text-[13px] transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-black" : "text-[#8e8e93] group-hover:text-black"
                }`} />
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Upgrade Pro Upsell Card (Only show if tier is free) */}
        {userProfile.tier === "free" && (
          <div className="bg-[#0a0a0a] p-4 text-left shadow-sm relative overflow-hidden border border-white/5 mt-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-1">upgrade options</span>
              <p className="text-[10px] text-[#e0e0e0] leading-relaxed mb-3 font-sans">
                sync limit is active. unlock pro to sync unlimited tracker daemons.
              </p>
              <button 
                onClick={() => setActiveSection("billing")}
                className="w-full py-2 bg-white text-black text-[9px] font-black uppercase tracking-wider hover:bg-[#f2f2f2] transition-colors"
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
