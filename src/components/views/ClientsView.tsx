"use client";

import React, { useState } from "react";
import { useSeep, Client } from "@/context/SeepContext";

type SortField = "name" | "revenue" | "worked" | "unbilled" | "effectiveRate";
type SortOrder = "asc" | "desc";

interface ClientsViewProps {
  onAddClientClick: () => void;
}

export default function ClientsView({ onAddClientClick }: ClientsViewProps) {
  const {
    clients,
    events,
    invoicedHours,
    setActiveClientId,
    historicalSnapshots,
  } = useSeep();

  const [sortField, setSortField] = useState<SortField>("unbilled");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const CURRENT_WEEK = "2026-08-24";

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Build client stats rows
  const clientsData = clients.map((c) => {
    // 1. Current week stats
    const currentEvents = events.filter((e) => e.clientId === c.id && e.billable);
    const currentWorked = currentEvents.reduce((acc, curr) => acc + curr.duration, 0);
    const invoiceRecord = invoicedHours.find(
      (inv) => inv.clientId === c.id && inv.weekStart === CURRENT_WEEK
    );
    const currentInvoiced = invoiceRecord ? invoiceRecord.hours : 0;
    const currentLeak = Math.max(0, currentWorked - currentInvoiced) * c.rate;

    // 2. Historical aggregates
    const snapshots = historicalSnapshots.filter((snap) => snap.clientId === c.id);
    const totalHistoricalWorked = snapshots.reduce((acc, curr) => acc + curr.hoursWorked, 0);
    const totalHistoricalInvoiced = snapshots.reduce((acc, curr) => acc + curr.hoursInvoiced, 0);
    
    const totalWorked = totalHistoricalWorked + currentWorked;
    const totalInvoiced = totalHistoricalInvoiced + currentInvoiced;
    
    // Revenue is defined as actual billed income: invoiced hours * rate
    const revenue = totalInvoiced * c.rate;
    
    // Effective Rate = revenue / total hours worked
    const effectiveRate = totalWorked > 0 ? (totalInvoiced * c.rate) / totalWorked : c.rate;

    // Trend calculation (compare current week leak vs previous week leak)
    const prevWeekRecord = snapshots[snapshots.length - 1];
    const prevLeak = prevWeekRecord ? prevWeekRecord.leakAmount : 0;
    const trendDirection: "improving" | "declining" | "flat" = 
      currentLeak < prevLeak ? "improving" : currentLeak > prevLeak ? "declining" : "flat";

    return {
      client: c,
      revenue,
      worked: totalWorked,
      unbilled: currentLeak,
      effectiveRate,
      trendDirection,
      snapshots: [...snapshots.map((s) => s.leakAmount), currentLeak], // For mini sparkline
    };
  });

  // Sort logic
  const sortedClients = [...clientsData].sort((a, b) => {
    let valA: any = a.client.name;
    let valB: any = b.client.name;

    if (sortField === "revenue") {
      valA = a.revenue;
      valB = b.revenue;
    } else if (sortField === "worked") {
      valA = a.worked;
      valB = b.worked;
    } else if (sortField === "unbilled") {
      valA = a.unbilled;
      valB = b.unbilled;
    } else if (sortField === "effectiveRate") {
      valA = a.effectiveRate;
      valB = b.effectiveRate;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <i className="fa-solid fa-sort text-[10px] text-[#8e8e93]"></i>;
    return sortOrder === "asc" 
      ? <i className="fa-solid fa-sort-up text-[10px] text-black font-bold"></i> 
      : <i className="fa-solid fa-sort-down text-[10px] text-black font-bold"></i>;
  };

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e8e93] block mb-1">profitability overview</span>
          <h1 className="text-2xl font-black tracking-tight text-[#0a0a0a]">client profitability audits</h1>
        </div>
        <button
          onClick={onAddClientClick}
          className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black/85 transition-colors"
        >
          add client
        </button>
      </div>

      {/* Main clients grid table */}
      <div className="card rounded-xl p-6 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e0e0] text-[#8e8e93] font-bold text-[9px] uppercase tracking-wider select-none">
                <th className="pb-4 pr-2 cursor-pointer hover:text-black" onClick={() => handleSort("name")}>
                  <span className="flex items-center gap-1.5">client {getSortIcon("name")}</span>
                </th>
                <th className="pb-4 px-2 cursor-pointer hover:text-black text-right" onClick={() => handleSort("revenue")}>
                  <span className="flex items-center justify-end gap-1.5">revenue {getSortIcon("revenue")}</span>
                </th>
                <th className="pb-4 px-2 cursor-pointer hover:text-black text-right" onClick={() => handleSort("worked")}>
                  <span className="flex items-center justify-end gap-1.5">tracked work {getSortIcon("worked")}</span>
                </th>
                <th className="pb-4 px-2 cursor-pointer hover:text-black text-right" onClick={() => handleSort("unbilled")}>
                  <span className="flex items-center justify-end gap-1.5">potentially unbilled {getSortIcon("unbilled")}</span>
                </th>
                <th className="pb-4 px-2 cursor-pointer hover:text-black text-right" onClick={() => handleSort("effectiveRate")}>
                  <span className="flex items-center justify-end gap-1.5">effective rate {getSortIcon("effectiveRate")}</span>
                </th>
                <th className="pb-4 px-2 text-center">leak trend</th>
                <th className="pb-4 pl-2 text-right">status</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.map(({ client, revenue, worked, unbilled, effectiveRate, trendDirection, snapshots }) => {
                const targetRate = client.rate;
                const isUnderTarget = effectiveRate < targetRate - 2;

                return (
                  <tr
                    key={client.id}
                    onClick={() => setActiveClientId(client.id)}
                    className="border-b border-[#e0e0e0] last:border-0 hover:bg-[#f2f2f2]/60 cursor-pointer transition-colors group"
                  >
                    {/* Client Name */}
                    <td className="py-4 pr-2 font-bold text-[#0a0a0a] group-hover:underline">
                      {client.name}
                    </td>

                    {/* Revenue */}
                    <td className="py-4 px-2 text-right font-medium">
                      {formatCurrency(revenue)}
                    </td>

                    {/* Tracked Work */}
                    <td className="py-4 px-2 text-right text-[#555555]">
                      {worked.toFixed(1)}h
                    </td>

                    {/* Potentially Unbilled */}
                    <td className={`py-4 px-2 text-right font-bold ${unbilled > 0 ? "text-black" : "text-[#8e8e93]"}`}>
                      {formatCurrency(unbilled)}
                    </td>

                    {/* Effective Hourly Rate */}
                    <td className="py-4 px-2 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-bold ${isUnderTarget ? "text-[#a94442]" : "text-black"}`}>
                          ${Math.round(effectiveRate)}/hr
                        </span>
                        <span className="text-[9px] text-[#8e8e93]">target: ${targetRate}/hr</span>
                      </div>
                    </td>

                    {/* Sparkline Trend */}
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center gap-3">
                        {/* Mini Sparkline SVG */}
                        <svg width="40" height="16" className="overflow-visible">
                          {snapshots.map((val, idx) => {
                            const maxVal = Math.max(...snapshots, 50);
                            const w = 6;
                            const x = idx * (w + 2) + 2;
                            const h = Math.max(2, (val / maxVal) * 14);
                            const y = 16 - h;
                            return (
                              <rect
                                key={idx}
                                x={x}
                                y={y}
                                width={w}
                                height={h}
                                fill={idx === snapshots.length - 1 ? "#0a0a0a" : "#e0e0e0"}
                                rx="1"
                              />
                            );
                          })}
                        </svg>
                        
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93]">
                          {trendDirection}
                        </span>
                      </div>
                    </td>

                    {/* Profitability Status Dot */}
                    <td className="py-4 pl-2 text-right">
                      {unbilled > 0 || isUnderTarget ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-black bg-[#e0e0e0] px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                          at-risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#8e8e93] bg-[#f2f2f2] px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 border border-black/20 rounded-full"></span>
                          on-track
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
