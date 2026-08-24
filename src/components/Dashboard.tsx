"use client";

import React, { useState } from "react";
import { useSeep } from "@/context/SeepContext";
import AnimatedNumber from "./AnimatedNumber";

export default function Dashboard() {
  const {
    clients,
    events,
    invoicedHours,
    recoveredThisMonth,
    setActiveClientId,
    setActiveSection,
    userProfile,
  } = useSeep();

  const CURRENT_WEEK = "2026-08-24";

  // Reusable Currency formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. Calculations for clients leakage
  const clientStats = clients.map((c) => {
    const clientEvents = events.filter((evt) => evt.clientId === c.id && evt.billable && evt.status !== "recovered");
    const duration = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);
    const invoiceRecord = invoicedHours.find(
      (inv) => inv.clientId === c.id && inv.weekStart === CURRENT_WEEK
    );
    const invoiced = invoiceRecord ? invoiceRecord.hours : 0;
    const leakHours = Math.max(0, duration - invoiced);
    const leakAmount = leakHours * c.rate;

    // Gather leak reasons
    const reasons: string[] = [];
    const calls = clientEvents.filter((e) => e.title.includes("sync") || e.title.includes("kickoff") || e.title.includes("meeting")).length;
    const reviews = clientEvents.filter((e) => e.title.includes("figma") || e.title.includes("review") || e.title.includes("design")).length;
    const support = clientEvents.filter((e) => e.title.includes("slack") || e.title.includes("email") || e.title.includes("response")).length;

    if (calls > 0) reasons.push(`${calls} client call${calls > 1 ? "s" : ""}`);
    if (reviews > 0) reasons.push(`${reviews} revision request${reviews > 1 ? "s" : ""}`);
    if (support > 0) reasons.push(`${support} channel correspondence${support > 1 ? "s" : ""}`);
    if (reasons.length === 0 && duration > 0) reasons.push("untracked scope creep events");

    return {
      client: c,
      duration,
      invoiced,
      leakHours,
      leakAmount,
      reasons,
    };
  });

  const totalLeak = clientStats.reduce((acc, curr) => acc + curr.leakAmount, 0);
  const totalUnbilledHours = clientStats.reduce((acc, curr) => acc + curr.leakHours, 0);
  const clientsAtRisk = clientStats.filter((c) => c.leakAmount > 0).length;

  // Effective hourly rate
  const totalWorked = clientStats.reduce((acc, curr) => acc + curr.duration, 0);
  const totalInvoiced = clientStats.reduce((acc, curr) => acc + curr.invoiced, 0);
  const targetRate = userProfile.billingRate;
  const effectiveRate = totalWorked > 0 ? (totalInvoiced * targetRate) / totalWorked : 61;

  // Ranked client list
  const rankedLeakingClients = [...clientStats]
    .filter((c) => c.leakAmount > 0)
    .sort((a, b) => b.leakAmount - a.leakAmount);

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a] gap-5">
      
      {/* Date header greeting */}
      <div className="flex justify-between items-center pb-3 border-b border-black/5">
        <div className="text-left">
          <h1 className="text-xl font-black tracking-tight">good morning, {userProfile.name}</h1>
          <p className="text-[11px] text-[#8e8e93] mt-0.5 font-sans">here's where your billable time went this week.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-white border border-[#e0e0e0] rounded-md text-[10px] font-bold text-[#555555]">
            august 24 - august 30, 2026
          </span>
          <button 
            onClick={() => alert("no new notifications.")} 
            className="w-8 h-8 rounded-md bg-white border border-[#e0e0e0] flex items-center justify-center text-[#8e8e93] hover:text-black transition-colors"
          >
            <i className="fa-solid fa-bell text-[16px]"></i>
          </button>
        </div>
      </div>

      {/* 2-Column Dashboard Grid: Hero card on left, secondary stats on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Hero Financial Leak Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a0a0a] text-white rounded-lg p-5 flex flex-col justify-between min-h-[190px] shadow-sm relative overflow-hidden text-left">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none"></div>
          
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93]">potentially unbilled</span>
              <i className="fa-solid fa-droplet text-[24px] text-[#8e8e93]"></i>
            </div>
            <h2 className="text-[3.2rem] font-black leading-none tracking-tighter text-white font-sans">
              <AnimatedNumber value={totalLeak} format={formatCurrency} />
            </h2>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#8e8e93]">
              <span>{totalUnbilledHours.toFixed(1)} hours detected this week</span>
              <span>•</span>
              <span className="text-white font-semibold">↑ 18% vs last week</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6 z-10">
            <button
              onClick={() => setActiveSection("leaks")}
              className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded hover:bg-[#e8e8e8] transition-colors"
            >
              review leaks
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className="px-4 py-2 bg-[#1a1a1a] text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded hover:bg-[#252525] transition-colors"
            >
              view report
            </button>
          </div>
        </div>

        {/* Right Column: Secondary Metrics (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
          {/* Metric 1: Recovered this month */}
          <div className="glass-panel p-3.5 rounded-lg text-left flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">recovered this month</span>
              <span className="text-xl font-black text-[#006622] block mt-0.5">
                {formatCurrency(recoveredThisMonth)}
              </span>
            </div>
            <span className="text-[9px] text-[#006622] font-bold bg-[#006622]/5 px-2 py-0.5 rounded self-start mt-2">
              ↑ 24% recovered
            </span>
          </div>

          {/* Metric 2: Potential leakage */}
          <div className="glass-panel p-3.5 rounded-lg text-left flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">potential leakage</span>
              <span className="text-xl font-black text-black block mt-0.5">
                {formatCurrency(totalLeak)}
              </span>
            </div>
            <span className="text-[9px] text-[#a94442] font-bold bg-[#a94442]/5 px-2 py-0.5 rounded self-start mt-2">
              ↑ 18% leak
            </span>
          </div>

          {/* Metric 3: Effective hourly rate */}
          <div className="glass-panel p-3.5 rounded-lg text-left flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">effective hourly rate</span>
              <span className="text-xl font-black text-black block mt-0.5">
                ${Math.round(effectiveRate)}/hr
              </span>
            </div>
            <span className="text-[9px] text-[#8e8e93] font-medium mt-2 block">
              target base rate: ${targetRate}/hr
            </span>
          </div>

          {/* Metric 4: Clients with leakage */}
          <div className="glass-panel p-3.5 rounded-lg text-left flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">clients with leakage</span>
              <span className="text-xl font-black text-black block mt-0.5">
                {clientsAtRisk}
              </span>
            </div>
            <span className="text-[9px] text-[#8e8e93] font-medium mt-2 block">
              require scope reviews
            </span>
          </div>
        </div>

      </div>

      {/* ranked client leaks list */}
      <div className="glass-panel p-5 rounded-lg text-left">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555]">where your money leaked</h3>
          <p className="text-[10px] text-[#8e8e93] mt-0.5">seep found unbilled calendar sync activity that may require invoicing.</p>
        </div>

        {rankedLeakingClients.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#8e8e93]">
            no client leakages identified this week.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {rankedLeakingClients.map(({ client, duration, leakAmount, reasons }) => (
              <div 
                key={client.id} 
                onClick={() => {
                  setActiveClientId(client.id);
                  setActiveSection("clients");
                }}
                className="flex justify-between items-center p-3 border border-black/5 hover:border-black rounded bg-white cursor-pointer transition-all"
              >
                <div className="text-left flex items-start gap-3">
                  <div className="p-2 bg-[#f2f2f2] rounded text-black shrink-0 mt-0.5">
                    <i className="fa-solid fa-triangle-exclamation text-[16px] text-black"></i>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-black block">{client.name}</span>
                    <span className="text-xs text-[#555555] block mt-0.5">{duration.toFixed(1)}h unbilled</span>
                    
                    {/* Reason badges */}
                    <div className="flex gap-2 mt-2">
                      {reasons.map((r, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-[#8e8e93] bg-[#f2f2f2] px-2 py-0.5 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">estimated leak</span>
                    <span className="text-lg font-black text-black">{formatCurrency(leakAmount)}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveClientId(client.id);
                    }}
                    className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
                  >
                    review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
