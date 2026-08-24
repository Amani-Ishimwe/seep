"use client";

import React, { useState } from "react";

interface LeakLog {
  description: string;
  hours: number;
  day: string;
}

interface ClientCardProps {
  name: string;
  project: string;
  rate: number;
  trackedHours: number;
  activeHours: number;
  leaks: LeakLog[];
  onInvoice: (name: string, amount: string) => void;
}

export default function ClientCard({
  name,
  project,
  rate,
  trackedHours,
  activeHours,
  leaks,
  onInvoice,
}: ClientCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  
  const leakHours = Math.max(0, activeHours - trackedHours);
  const leakAmount = leakHours * rate;
  const formattedLeak = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(leakAmount);

  return (
    <div className="glass-panel rounded-lg p-6 flex flex-col gap-5 text-[#0A0A0A] select-none">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg tracking-tight">{name}</h3>
          <p className="text-sm text-[#555555] font-normal">{project}</p>
        </div>
        <div className="text-right">
          <div className={`font-bold text-xl tracking-tight ${leakAmount > 0 ? "text-[#0A0A0A]" : "text-opacity-30 text-[#0A0A0A]"}`}>
            {formattedLeak}
          </div>
          <div className="text-xs text-[#8E8E93] mt-0.5">
            {leakAmount > 0 ? "Unbilled leak" : "Perfect sync"}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex gap-6 border-y border-black/5 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-medium">Rate</span>
          <span className="text-sm font-semibold">${rate}/hr</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-medium">Tracked</span>
          <span className="text-sm font-semibold">{trackedHours.toFixed(1)} hrs</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider font-medium">Active</span>
          <span className="text-sm font-semibold">{activeHours.toFixed(1)} hrs</span>
        </div>
      </div>

      {/* Log Details Toggle */}
      {leaks.length > 0 && (
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setShowLogs(!showLogs)} 
            className="flex items-center justify-between text-xs text-[#555555] hover:text-black transition-colors py-1"
          >
            <span>{showLogs ? "Hide detailed leak logs" : "Show detailed leak logs"}</span>
            <svg 
              className={`w-3.5 h-3.5 transform transition-transform duration-300 ${showLogs ? "rotate-180" : ""}`} 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {showLogs && (
            <div className="text-xs text-[#555555] flex flex-col gap-2 mt-1 animate-fade-in">
              {leaks.map((leak, idx) => (
                <div key={idx} className="flex justify-between py-1.5 border-b border-dashed border-black/5 last:border-0">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#555555] rounded-full"></span>
                    {leak.description} ({leak.day})
                  </span>
                  <span className="font-semibold text-black">{leak.hours.toFixed(1)} hrs</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-2">
        {leakAmount > 0 ? (
          <button 
            onClick={() => onInvoice(name, formattedLeak)}
            className="px-4 py-2 text-xs font-semibold bg-[#0A0A0A] text-white border border-[#0A0A0A] rounded-md hover:bg-[#222222] hover:border-[#222222] transition-colors"
          >
            Invoice Leak
          </button>
        ) : (
          <button 
            disabled
            className="px-4 py-2 text-xs font-semibold bg-[#FFFFFF] text-[#8E8E93] border border-black/10 rounded-md opacity-50 cursor-not-allowed"
          >
            Invoiced
          </button>
        )}
        <button 
          onClick={() => alert(`Auditing background activities for ${name}...`)}
          className="px-4 py-2 text-xs font-semibold bg-[#FFFFFF] text-[#0A0A0A] border border-[#E0E0E0] rounded-md hover:bg-[#F2F2F2] hover:border-[#0A0A0A] transition-all"
        >
          Audit Log
        </button>
      </div>
    </div>
  );
}
