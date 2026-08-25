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
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a] gap-6">
      
      {/* Date header greeting */}
      <div className="flex justify-between items-end pb-0">
        <div className="text-left">
          <h1 className="text-2xl font-black tracking-tight">good morning, {userProfile.name}</h1>
          <p className="text-xs text-[#8e8e93] mt-1 font-sans">here's where your billable time went this week.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-white border border-[#e0e0e0] rounded-lg text-[10px] font-semibold text-[#555555]">
            august 24 – august 30, 2026
          </span>
          <button 
            onClick={() => alert("no new notifications.")} 
            className="w-8 h-8 rounded-lg bg-white border border-[#e0e0e0] flex items-center justify-center text-[#8e8e93] hover:text-[#0a0a0a] hover:border-[#0a0a0a]/20 transition-all"
          >
            <i className="fa-solid fa-bell text-[13px]"></i>
          </button>
        </div>
      </div>

      {/* 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left: Hero Financial Leak Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a0a0a] text-white rounded-xl p-6 flex flex-col justify-between min-h-[200px] relative overflow-hidden text-left animate-card-in">
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">potentially unbilled</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <i className="fa-solid fa-droplet text-[14px] text-white/30"></i>
              </div>
            </div>
            <h2 className="text-[3rem] font-black leading-none tracking-tighter text-white font-sans">
              <AnimatedNumber value={totalLeak} format={formatCurrency} />
            </h2>
            <div className="flex items-center gap-2 mt-3 text-[11px] text-white/40">
              <span>{totalUnbilledHours.toFixed(1)} hours detected this week</span>
              <span className="text-white/15">•</span>
              <span className="text-white font-semibold">↑ 18% vs last week</span>
            </div>
          </div>

          <div className="flex gap-2.5 mt-6 z-10 relative">
            <button
              onClick={() => setActiveSection("leaks")}
              className="px-4 py-2 bg-white text-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
            >
              review leaks
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className="px-4 py-2 bg-white/[0.06] text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              view report
            </button>
          </div>
        </div>

        {/* Right: Secondary Metrics (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3">
          {/* Metric 1: Recovered */}
          <div className="card rounded-xl p-4 text-left flex flex-col justify-between animate-card-in" style={{ animationDelay: "0.05s" }}>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">recovered this month</span>
              <span className="text-xl font-black text-[#0a0a0a] block mt-1">
                {formatCurrency(recoveredThisMonth)}
              </span>
            </div>
            <span className="text-[9px] text-[#006622] font-bold bg-[#006622]/5 px-2 py-0.5 rounded-md self-start mt-3 flex items-center gap-1">
              <i className="fa-solid fa-arrow-up text-[7px]"></i> 24% recovered
            </span>
          </div>

          {/* Metric 2: Potential leakage */}
          <div className="card rounded-xl p-4 text-left flex flex-col justify-between animate-card-in" style={{ animationDelay: "0.1s" }}>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">potential leakage</span>
              <span className="text-xl font-black text-[#0a0a0a] block mt-1">
                {formatCurrency(totalLeak)}
              </span>
            </div>
            <span className="text-[9px] text-[#a94442] font-bold bg-[#a94442]/5 px-2 py-0.5 rounded-md self-start mt-3 flex items-center gap-1">
              <i className="fa-solid fa-arrow-up text-[7px]"></i> 18% leak
            </span>
          </div>

          {/* Metric 3: Effective hourly rate */}
          <div className="card rounded-xl p-4 text-left flex flex-col justify-between animate-card-in" style={{ animationDelay: "0.15s" }}>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">effective hourly rate</span>
              <span className="text-xl font-black text-[#0a0a0a] block mt-1">
                ${Math.round(effectiveRate)}/hr
              </span>
            </div>
            <span className="text-[9px] text-[#8e8e93] font-medium mt-3 block">
              target base rate: ${targetRate}/hr
            </span>
          </div>

          {/* Metric 4: Clients with leakage */}
          <div className="card rounded-xl p-4 text-left flex flex-col justify-between animate-card-in" style={{ animationDelay: "0.2s" }}>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] block">clients with leakage</span>
              <span className="text-xl font-black text-[#0a0a0a] block mt-1">
                {clientsAtRisk}
              </span>
            </div>
            <span className="text-[9px] text-[#8e8e93] font-medium mt-3 block">
              require scope reviews
            </span>
          </div>
        </div>

      </div>

      {/* Ranked client leaks list */}
      <div className="card rounded-xl p-5 text-left animate-card-in" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0a0a0a]">where your money leaked</h3>
            <p className="text-[10px] text-[#8e8e93] mt-0.5">seep found unbilled calendar sync activity that may require invoicing.</p>
          </div>
          {rankedLeakingClients.length > 0 && (
            <button
              onClick={() => setActiveSection("leaks")}
              className="text-[9px] font-bold text-[#8e8e93] hover:text-[#0a0a0a] uppercase tracking-wider transition-colors flex items-center gap-1"
            >
              view all <i className="fa-solid fa-arrow-right text-[8px]"></i>
            </button>
          )}
        </div>

        {rankedLeakingClients.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f2f2f2] flex items-center justify-center">
              <i className="fa-solid fa-shield-check text-xl text-[#8e8e93]"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0a0a0a]">no leaks detected</p>
              <p className="text-[10px] text-[#8e8e93] mt-0.5">all client hours appear properly billed this week.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {rankedLeakingClients.map(({ client, duration, leakAmount, reasons }) => (
              <div 
                key={client.id} 
                onClick={() => {
                  setActiveClientId(client.id);
                  setActiveSection("clients");
                }}
                className="flex justify-between items-center p-3.5 rounded-lg border border-[#e0e0e0] bg-[#fafafa] hover:bg-white hover:border-[#0a0a0a]/15 hover:shadow-sm cursor-pointer transition-all group"
              >
                <div className="text-left flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#0a0a0a]/5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0a0a0a]/8 transition-colors">
                    <i className="fa-solid fa-triangle-exclamation text-[13px] text-[#0a0a0a]/60"></i>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#0a0a0a] block">{client.name}</span>
                    <span className="text-[11px] text-[#8e8e93] block mt-0.5">{duration.toFixed(1)}h unbilled</span>
                    
                    {/* Reason badges */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {reasons.map((r, idx) => (
                        <span key={idx} className="text-[9px] font-medium text-[#8e8e93] bg-[#0a0a0a]/[0.04] px-2 py-0.5 rounded-md">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">estimated leak</span>
                    <span className="text-lg font-black text-[#0a0a0a]">{formatCurrency(leakAmount)}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveClientId(client.id);
                    }}
                    className="px-4 py-2 bg-[#0a0a0a] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-black/85 transition-colors"
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
