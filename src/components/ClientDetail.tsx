"use client";

import React, { useState } from "react";
import { useSeep, Client } from "@/context/SeepContext";

interface ClientDetailProps {
  client: Client;
}

export default function ClientDetail({ client }: ClientDetailProps) {
  const {
    events,
    invoicedHours,
    historicalSnapshots,
    setActiveClientId,
    updateClientRate,
    toggleEventBillable,
    logInvoicedHours,
    syncErrorMessage,
  } = useSeep();

  const CURRENT_WEEK = "2026-08-24";

  // Rate Editing state
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [newRate, setNewRate] = useState(String(client.rate));

  // Invoiced Hours input state
  const invoiceRecord = invoicedHours.find(
    (inv) => inv.clientId === client.id && inv.weekStart === CURRENT_WEEK
  );
  const currentInvoiced = invoiceRecord ? invoiceRecord.hours : 0;
  const [invoicedInput, setInvoicedInput] = useState(String(currentInvoiced));

  // Copy success indicator
  const [copySuccess, setCopySuccess] = useState(false);

  // Calculations
  const clientEvents = events.filter((evt) => evt.clientId === client.id);
  const billableEvents = clientEvents.filter((evt) => evt.billable);
  const billableDuration = billableEvents.reduce((acc, curr) => acc + curr.duration, 0);

  const leakHours = Math.max(0, billableDuration - currentInvoiced);
  const leakAmount = leakHours * client.rate;

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = parseFloat(newRate);
    if (!isNaN(rateVal) && rateVal > 0) {
      await updateClientRate(client.id, rateVal);
      setIsEditingRate(false);
    }
  };

  const handleUpdateInvoiced = async (e: React.FormEvent) => {
    e.preventDefault();
    const hoursVal = parseFloat(invoicedInput);
    if (!isNaN(hoursVal) && hoursVal >= 0) {
      await logInvoicedHours(client.id, CURRENT_WEEK, hoursVal);
    }
  };

  // Find snapshots for history charts
  const history = historicalSnapshots.filter((snap) => snap.clientId === client.id);
  const allHistory = [
    ...history,
    {
      clientId: client.id,
      weekStart: CURRENT_WEEK,
      hoursWorked: billableDuration,
      hoursInvoiced: currentInvoiced,
      leakAmount: leakAmount,
    },
  ];

  // SVG Chart parameters
  const chartHeight = 120;
  const barWidth = 32;
  const barSpacing = 48;
  const maxLeakInHistory = Math.max(...allHistory.map((h) => h.leakAmount), 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  const generateEmailText = () => {
    const leakText = formatCurrency(leakAmount);
    return `hi ${client.name},

i wanted to send a quick note about our scope this week. based on my calendar logs, we spent ${billableDuration.toFixed(1)} hours on meetings and collaboration reviews. however, my logs show we only logged ${currentInvoiced.toFixed(1)} hours for this period, leaving an unbilled leak of ${leakHours.toFixed(1)} hours (worth ${leakText}).

let's check if we need to adjust our weekly scope, or if i should list these hours on the next invoice.

let me know your thoughts.

best,`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmailText());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 relative text-lowercase">
      
      {/* Optimistic UI Error Banner */}
      {syncErrorMessage && (
        <div className="fixed top-6 right-6 z-50 glass-panel rounded-md px-5 py-3 border-black text-xs font-semibold text-black animate-fade-in flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>
          <span>{syncErrorMessage}</span>
        </div>
      )}

      {/* Header with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#e0e0e0]">
        <button
          onClick={() => setActiveClientId(null)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8e8e93] hover:text-black transition-colors self-start"
        >
          <i className="fa-solid fa-caret-left text-[14px]"></i>
          back to overview
        </button>

        {isEditingRate ? (
          <form onSubmit={handleUpdateRate} className="flex items-center gap-2">
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="w-20 px-2 py-1 text-xs border border-[#e0e0e0] rounded outline-none focus:border-black font-sans"
            />
            <button type="submit" className="text-xs font-bold uppercase tracking-wider text-black">save</button>
            <button type="button" onClick={() => setIsEditingRate(false)} className="text-xs font-bold uppercase tracking-wider text-[#8e8e93]">cancel</button>
          </form>
        ) : (
          <button
            onClick={() => setIsEditingRate(true)}
            className="text-xs font-bold uppercase tracking-wider text-[#8e8e93] hover:text-black transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <i className="fa-solid fa-pen text-[16px]"></i>
            edit rate (${client.rate}/hr)
          </button>
        )}
      </div>

      {/* Client Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start mb-16">
        {/* Left Side: Client Data */}
        <div className="flex flex-col gap-8 sm:gap-12">
          {/* Main Info */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93] mb-2 sm:mb-3 block">
              unbilled leak for {client.name}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-[#0a0a0a] mb-3 sm:mb-4 font-sans">
              {formatCurrency(leakAmount)}
            </h1>
            <p className="text-sm text-[#555555]">
              {leakHours.toFixed(1)} unbilled hours remaining this week.
            </p>
          </div>

          {/* SVG Trend Chart */}
          <div className="card rounded-xl p-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-[18px]"></i>
                historical leak trend
              </h3>
            </div>
            
            <div className="w-full overflow-x-auto flex justify-center items-end h-[160px] pb-6 relative pt-4">
              <svg className="w-full min-w-[300px] max-w-[400px] h-[140px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {allHistory.map((snap, idx) => {
                  const barHeight = (snap.leakAmount / maxLeakInHistory) * chartHeight;
                  const x = idx * (barWidth + barSpacing) + 20;
                  const y = chartHeight - barHeight;
                  
                  return (
                    <g key={idx} className="group">
                      <rect x={x} y={0} width={barWidth} height={chartHeight} fill="transparent" />
                      <rect x={x} y={y} width={barWidth} height={barHeight} fill={idx === allHistory.length - 1 ? "#0a0a0a" : "#e8e8e8"} rx="4" />
                      <text x={x + barWidth / 2} y={y - 8} fontFamily="Satoshi" fontSize="9" fontWeight="700" fill="#0a0a0a" textAnchor="middle">
                        {formatCurrency(snap.leakAmount)}
                      </text>
                      <text x={x + barWidth / 2} y={chartHeight + 16} fontFamily="Satoshi" fontSize="8" fontWeight="500" fill="#8e8e93" textAnchor="middle">
                        {snap.weekStart.slice(5)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Sync Events List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-4 flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[18px]"></i>
              synced calendar entries
            </h3>
            <div className="flex flex-col gap-3">
              {clientEvents.length === 0 ? (
                <div className="text-xs text-[#8e8e93] py-4 border border-dashed border-[#e0e0e0] rounded-lg text-center">
                  no calendar events synced to this client.
                </div>
              ) : (
                clientEvents.map((evt) => (
                  <div key={evt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 border border-[#e0e0e0] rounded-lg bg-white">
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-sm font-semibold text-black">{evt.title}</span>
                      <span className="text-xs text-[#555555]">
                        {evt.duration.toFixed(1)} hrs • {new Date(evt.start).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleEventBillable(evt.id)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md border transition-all self-start sm:self-auto ${
                        evt.billable 
                          ? "bg-black text-white border-black" 
                          : "bg-white text-[#8e8e93] border-[#e0e0e0] hover:border-black"
                      }`}
                    >
                      {evt.billable ? "billable" : "ignored"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Action Forms */}
        <div className="flex flex-col gap-8">
          {/* Manual Invoice hours logging */}
          <div className="card rounded-xl p-5 sm:p-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-invoice text-[18px]"></i>
              log manually invoiced hours
            </h3>
            <p className="text-xs text-[#8e8e93] leading-relaxed mb-6">
              entered billable time you actually sent on an invoice. seep matches this against meeting hours.
            </p>

            <form onSubmit={handleUpdateInvoiced} className="flex flex-col gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1.5">
                  hours invoiced this week
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={invoicedInput}
                  onChange={(e) => setInvoicedInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e0e0e0] rounded text-sm outline-none focus:border-black font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
              >
                update invoiced hours
              </button>
            </form>
          </div>

          {/* Draft scope adjust message */}
          {leakAmount > 100 && (
            <div className="card rounded-xl p-5 sm:p-6 text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-4 flex items-center gap-2">
                <i className="fa-regular fa-message text-[18px]"></i>
                draft a scope adjustment
              </h3>
              <p className="text-xs text-[#8e8e93] leading-relaxed mb-4">
                your leak exceeds the $100 threshold. copy this direct message to address client drift.
              </p>

              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 text-[11px] font-mono text-[#555555] whitespace-pre-line leading-relaxed mb-4 select-text">
                {generateEmailText()}
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black/85 transition-all"
              >
                {copySuccess ? "copied!" : "copy message text"}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
