"use client";

import React from "react";
import ClientCard from "./ClientCard";

interface DashboardViewProps {
  realtimeLeak: string;
  onViewChange: (view: string) => void;
  onInvoiceLeak: (name: string, amount: string) => void;
  zenithActive: number;
  zenithLeak: number;
}

export default function DashboardView({
  realtimeLeak,
  onViewChange,
  onInvoiceLeak,
  zenithActive,
  zenithLeak,
}: DashboardViewProps) {
  const formattedZenithLeak = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(zenithLeak);

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto">
      {/* Leak Hero Statement */}
      <div className="flex flex-col items-start mb-16">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93] mb-3">
          Total unbilled revenue this week
        </div>
        <div className="text-[8rem] font-bold leading-[0.9] tracking-tighter text-[#0A0A0A] mb-4">
          {realtimeLeak}
        </div>
        <div className="text-sm font-medium text-[#555555]">
          Across 3 active clients • Updated real-time
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
        {/* Main Panel */}
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#555555]">Critical Leak Sources</h2>
            <button 
              onClick={() => onViewChange("cards")}
              className="text-xs font-medium text-[#0A0A0A] border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
            >
              View All Clients
            </button>
          </div>

          {/* Client Scorecards */}
          <div className="flex flex-col gap-6">
            <ClientCard
              name="Acme Corporation"
              project="Enterprise Design Systems"
              rate={150}
              trackedHours={30.0}
              activeHours={31.5}
              onInvoice={onInvoiceLeak}
              leaks={[
                { description: "Out-of-scope Slack strategy session", hours: 0.8, day: "Tuesday" },
                { description: "Unsaved Figma file iterations", hours: 0.7, day: "Thursday" },
              ]}
            />

            <ClientCard
              name="Zenith Agency"
              project="Webflow Development"
              rate={125}
              trackedHours={12.0}
              activeHours={zenithActive}
              onInvoice={onInvoiceLeak}
              leaks={[
                { description: "Untracked email technical support", hours: zenithActive - 12.0, day: "Wednesday" },
              ]}
            />
          </div>
        </div>

        {/* Sidebar Breakdown */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#555555]">Leak Categories</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Category: Communication */}
              <div className="flex justify-between items-center p-4 border border-black/5 rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#FAFAFA] border border-[#E0E0E0] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#0A0A0A]">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-[#0A0A0A]">Communication</span>
                    <span className="text-[10px] text-[#555555]">Slack, Email, Calls</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-right">$145.00</span>
              </div>

              {/* Category: Revisions */}
              <div className="flex justify-between items-center p-4 border border-black/5 rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#FAFAFA] border border-[#E0E0E0] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#0A0A0A]">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-[#0A0A0A]">Revisions</span>
                    <span className="text-[10px] text-[#555555]">Figma, GitHub edits</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-right">$110.00</span>
              </div>

              {/* Category: Client Drift */}
              <div className="flex justify-between items-center p-4 border border-black/5 rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#FAFAFA] border border-[#E0E0E0] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#0A0A0A]">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-[#0A0A0A]">Client Drift</span>
                    <span className="text-[10px] text-[#555555]">Out-of-hours requests</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-right">{formattedZenithLeak}</span>
              </div>
            </div>
          </div>

          {/* Premium observer card info */}
          <div className="glass-panel rounded-lg p-6">
            <h3 className="text-sm font-bold text-[#0A0A0A] mb-2">Precision Tracking</h3>
            <p className="text-xs text-[#555555] font-normal leading-relaxed mb-4">
              Seep runs in the background. It measures active application focus against your client contract specifications to catch unpaid micro-tasks.
            </p>
            <div className="text-[10px] font-semibold text-[#0A0A0A] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full"></span>
              Local daemon: Connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
