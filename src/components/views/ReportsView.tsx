"use client";

import React from "react";
import { useSeep } from "@/context/SeepContext";

export default function ReportsView() {
  const {
    clients,
    events,
    invoicedHours,
    recoveredThisMonth,
    userProfile,
  } = useSeep();

  const CURRENT_WEEK = "2026-08-24";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Compute stats
  const clientLeaks = clients.map((c) => {
    const clientEvents = events.filter((e) => e.clientId === c.id && e.billable);
    const duration = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);
    const invoiceRecord = invoicedHours.find(
      (inv) => inv.clientId === c.id && inv.weekStart === CURRENT_WEEK
    );
    const invoiced = invoiceRecord ? invoiceRecord.hours : 0;
    const leakHours = Math.max(0, duration - invoiced);
    const leakAmount = leakHours * c.rate;

    return {
      clientName: c.name,
      leakAmount,
      worked: duration,
      invoiced,
    };
  });

  const totalLeak = clientLeaks.reduce((acc, curr) => acc + curr.leakAmount, 0);
  
  // Weekly leak reports aggregates
  const unresolvedLeak = Math.max(0, totalLeak - recoveredThisMonth);

  // Sorting top leaking clients
  const rankedLeaks = [...clientLeaks].sort((a, b) => b.leakAmount - a.leakAmount);

  // Category proportions
  const meetingHours = events
    .filter((e) => e.billable && (e.title.includes("sync") || e.title.includes("kickoff") || e.title.includes("meeting") || e.title.includes("alignment")))
    .reduce((acc, c) => acc + c.duration, 0);
  
  const revisionHours = events
    .filter((e) => e.billable && (e.title.includes("figma") || e.title.includes("review") || e.title.includes("design")))
    .reduce((acc, c) => acc + c.duration, 0);

  const supportHours = events
    .filter((e) => e.billable && (e.title.includes("slack") || e.title.includes("email") || e.title.includes("response") || e.title.includes("support")))
    .reduce((acc, c) => acc + c.duration, 0);

  const totalCatHours = meetingHours + revisionHours + supportHours || 1;
  const pctMeetings = Math.round((meetingHours / totalCatHours) * 100) || 45;
  const pctRevisions = Math.round((revisionHours / totalCatHours) * 100) || 35;
  const pctSupport = Math.round((supportHours / totalCatHours) * 100) || 20;

  // Effective hourly rate
  const totalWorkedAll = clientLeaks.reduce((acc, curr) => acc + curr.worked, 0);
  const totalInvoicedAll = clientLeaks.reduce((acc, curr) => acc + curr.invoiced, 0);
  
  // Seed aggregates for comparison
  const targetRate = userProfile.billingRate;
  const actualRate = totalWorkedAll > 0 ? (totalInvoicedAll * targetRate) / totalWorkedAll : 61;
  const rateDiff = actualRate - targetRate;

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a]">
      
      {/* Header */}
      <div className="text-left mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e8e93] block mb-1">decision analytics</span>
        <h1 className="text-2xl font-black tracking-tight text-[#0a0a0a]">reconciliation reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Leak aggregates & comparative charts */}
        <div className="md:col-span-8 flex flex-col gap-8">
          
          {/* Weekly Leak Summary Card */}
          <div className="card rounded-xl p-5 sm:p-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-6">weekly leak report</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-b border-[#e0e0e0] pb-6">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">potentially unbilled</span>
                <span className="text-xl sm:text-2xl font-black text-black">{formatCurrency(totalLeak)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">recovered</span>
                <span className="text-xl sm:text-2xl font-black text-[#006622]">{formatCurrency(recoveredThisMonth)}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">still unresolved</span>
                <span className="text-xl sm:text-2xl font-black text-[#a94442]">{formatCurrency(unresolvedLeak)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs text-[#555555]">
              <i className="fa-solid fa-shield-halved text-[16px] text-black"></i>
              <span>3 unbilled scope alerts could recover approximately {formatCurrency(unresolvedLeak)}.</span>
            </div>
          </div>

          {/* Effective Hourly Rate comparison */}
          <div className="card rounded-xl p-5 sm:p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555]">effective hourly rate</h3>
                <p className="text-[10px] text-[#8e8e93] mt-0.5">real earnings vs your standard base rate</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded self-start sm:self-auto ${rateDiff < 0 ? "bg-[#a94442]/10 text-[#a94442]" : "bg-[#006622]/10 text-[#006622]"}`}>
                {rateDiff < 0 ? `-${formatCurrency(Math.abs(rateDiff))}/hr delta` : `+${formatCurrency(rateDiff)}/hr delta`}
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-6 sm:gap-12 py-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">target rate</span>
                <span className="text-xl sm:text-2xl font-black text-black">${targetRate}/hr</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">actual effective rate</span>
                <span className="text-xl sm:text-2xl font-black text-[#a94442]">${Math.round(actualRate)}/hr</span>
              </div>
            </div>

            {/* Simple comparative SVG layout */}
            <div className="w-full bg-[#f2f2f2] h-2 rounded-full overflow-hidden mt-4 relative">
              <div className="bg-black h-full" style={{ width: `${(actualRate / targetRate) * 100}%` }}></div>
            </div>
          </div>

          {/* Biggest Causes breakdown */}
          <div className="card rounded-xl p-6 rounded-lg text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-6">leakage sources breakdown</h3>
            
            <div className="flex flex-col gap-4">
              {/* Cause 1: Meetings */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-2">
                    <i className="fa-regular fa-calendar-check text-[16px] text-black"></i>
                    meetings & sync alignments
                  </span>
                  <span>{pctMeetings}%</span>
                </div>
                <div className="w-full bg-[#f2f2f2] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-black h-full" style={{ width: `${pctMeetings}%` }}></div>
                </div>
              </div>

              {/* Cause 2: Revisions */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-pen-to-square text-[16px] text-[#555555]"></i>
                    revisions & content updates
                  </span>
                  <span>{pctRevisions}%</span>
                </div>
                <div className="w-full bg-[#f2f2f2] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#8e8e93] h-full" style={{ width: `${pctRevisions}%` }}></div>
                </div>
              </div>

              {/* Cause 3: Support */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-2">
                    <i className="fa-regular fa-comment-dots text-[16px] text-[#8e8e93]"></i>
                    slack support & messages
                  </span>
                  <span>{pctSupport}%</span>
                </div>
                <div className="w-full bg-[#f2f2f2] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#e0e0e0] h-full" style={{ width: `${pctSupport}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Top leaking clients */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] text-left">top leaking clients</h3>
          
          <div className="card rounded-xl p-5 rounded-lg text-left flex flex-col gap-4">
            {rankedLeaks.length === 0 ? (
              <span className="text-xs text-[#8e8e93] py-4 text-center">no data logged yet.</span>
            ) : (
              rankedLeaks.map((leak, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e0e0e0] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#8e8e93]">{idx + 1}.</span>
                    <div>
                      <span className="font-bold text-xs text-black block">{leak.clientName}</span>
                      <span className="text-[9px] text-[#8e8e93]">{leak.worked.toFixed(1)}h logged</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-black">{formatCurrency(leak.leakAmount)}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
