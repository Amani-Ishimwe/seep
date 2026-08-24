"use client";

import React, { useState } from "react";
import { useSeep, CalendarEvent, Client } from "@/context/SeepContext";

export default function LeaksView() {
  const {
    events,
    clients,
    setEventStatus,
    linkEventToClient,
    recoveredThisMonth,
    markLeakAsRecovered,
  } = useSeep();

  const [activeDraftClient, setActiveDraftClient] = useState<Client | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const CURRENT_WEEK = "2026-08-24";

  // Reusable Currency formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  // Group leaks by Client to calculate cumulative unbilled leakage
  const clientLeakage = clients.map((c) => {
    const clientEvents = events.filter((evt) => evt.clientId === c.id && evt.billable && evt.status !== "recovered");
    const duration = clientEvents.reduce((acc, curr) => acc + curr.duration, 0);
    const amount = duration * c.rate;
    return {
      client: c,
      duration,
      amount,
    };
  }).filter((cl) => cl.amount > 0);

  // Filter events showing active unbilled detections (billable but not recovered/ignored, or detected)
  const detectedLeaks = events.filter(
    (evt) => evt.status === "detected" || (evt.billable && evt.status !== "recovered" && evt.status !== "ignored")
  );

  const getConfidenceStyle = (confidence?: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "bg-black/5 text-black font-semibold";
      case "medium":
        return "bg-black/5 text-[#555555]";
      case "low":
      default:
        return "bg-black/5 text-[#8e8e93]";
    }
  };

  const getSeverityLabel = (amount: number) => {
    if (amount >= 500) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#a94442]/10 text-[#a94442] border border-[#a94442]/20">
          <i className="fa-solid fa-circle-exclamation text-[12px]"></i>
          high severity
        </span>
      );
    }
    if (amount >= 100) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#8a6d3b]/10 text-[#8a6d3b] border border-[#8a6d3b]/20">
          <i className="fa-solid fa-triangle-exclamation text-[12px]"></i>
          medium severity
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f2f2f2] text-[#8e8e93] border border-[#e0e0e0]">
        <i className="fa-solid fa-circle-info text-[12px]"></i>
        low severity
      </span>
    );
  };

  const generateEmailText = (client: Client, duration: number, amount: number) => {
    return `hi Sarah,

i wanted to send a quick note about our scope this week. based on my calendar logs, we spent ${duration.toFixed(1)} hours on meetings and collaboration reviews beyond the original billing. this represents an unbilled leak of $${amount.toFixed(2)}.

let's check whether you'd like me to update the project estimate or include these hours in the next invoice.

best,
amani`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a]">
      
      {/* Page Header */}
      <div className="text-left mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-1">leakage logs</span>
          <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a]">unbilled leak investigations</h1>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#8e8e93] block">recovered this month</span>
          <span className="text-2xl font-black text-[#006622]">{formatCurrency(recoveredThisMonth)}</span>
        </div>
      </div>

      {/* Scope Creep Alert Banner */}
      {clientLeakage.length > 0 && (
        <div className="bg-[#a94442]/5 border border-[#a94442]/10 rounded-lg p-5 mb-8 flex justify-between items-center text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#a94442]/10 rounded-md text-[#a94442]">
              <i className="fa-solid fa-circle-exclamation text-[24px]"></i>
            </div>
            <div>
              <span className="text-xs font-bold text-black block">scope creep warning detected</span>
              <p className="text-[11px] text-[#555555] mt-0.5">
                {clientLeakage[0].client.name} has generated {clientLeakage[0].duration.toFixed(1)} unbilled hours this week.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveDraftClient(clientLeakage[0].client)}
            className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
          >
            draft client message
          </button>
        </div>
      )}

      {/* Main Grid: Detections Timeline & Scope Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Columns: Detections list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] text-left mb-2">detected unbilled activity</h3>
          
          {detectedLeaks.length === 0 ? (
            <div className="glass-panel rounded-lg p-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#f2f2f2] flex items-center justify-center mb-4">
                <i className="fa-solid fa-check text-[24px] text-[#8e8e93]"></i>
              </div>
              <h3 className="text-sm font-bold text-black mb-1">no leaks detected yet</h3>
              <p className="text-xs text-[#8e8e93] leading-relaxed max-w-[280px]">
                connect your calendar or add activity manually. seep will start looking for unbilled events.
              </p>
            </div>
          ) : (
            detectedLeaks.map((evt) => {
              const matchedClient = clients.find((c) => c.id === evt.clientId || c.id === evt.suggestedClientId);
              const rate = matchedClient ? matchedClient.rate : 75;
              const value = evt.duration * rate;

              return (
                <div key={evt.id} className="glass-panel p-5 rounded-lg text-left flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm tracking-tight text-black">{evt.title}</h4>
                      <span className="text-[11px] text-[#555555] mt-1 block">
                        {evt.duration.toFixed(1)} hrs • {new Date(evt.start).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-sm font-black text-black">{formatCurrency(value)}</span>
                      {getSeverityLabel(value)}
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-3.5 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#8e8e93] flex items-center gap-1.5">
                        <i className="fa-solid fa-lightbulb text-[14px]"></i>
                        flag reason: {evt.reason || "potential billable activity pattern"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getConfidenceStyle(evt.confidence)}`}>
                        {evt.confidence || "medium"} confidence
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-[#fafafa] p-3 border border-black/5 rounded">
                      <span className="text-xs font-semibold text-[#555555]">
                        seep thinks this belongs to: <span className="text-black font-bold">{matchedClient?.name || "unassociated"}</span>
                      </span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEventStatus(evt.id, "confirmed")}
                          className="px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
                        >
                          confirm
                        </button>
                        <select
                          value={evt.clientId || evt.suggestedClientId || ""}
                          onChange={(e) => linkEventToClient(evt.id, e.target.value || null)}
                          className="px-2 py-1 text-[9px] bg-white border border-[#e0e0e0] rounded outline-none focus:border-black font-sans font-bold text-[#555555]"
                        >
                          <option value="">wrong client</option>
                          {clients.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEventStatus(evt.id, "ignored")}
                          className="px-2.5 py-1 bg-[#f2f2f2] text-[#8e8e93] border border-[#e0e0e0] text-[9px] font-bold uppercase tracking-wider rounded hover:text-black hover:border-black transition-colors"
                        >
                          ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Ranked Cumulative Leaks Summary */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#555555] text-left">unbilled by client</h3>
          
          <div className="glass-panel p-5 rounded-lg text-left flex flex-col gap-4">
            {clientLeakage.length === 0 ? (
              <span className="text-xs text-[#8e8e93] py-4 text-center">no client leaks logged.</span>
            ) : (
              clientLeakage.map(({ client, duration, amount }) => (
                <div key={client.id} className="flex justify-between items-center py-3 border-b border-black/5 last:border-0 last:pb-0">
                  <div>
                    <span className="font-bold text-xs text-black block">{client.name}</span>
                    <span className="text-[10px] text-[#8e8e93]">{duration.toFixed(1)} unbilled hours</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="font-black text-sm text-black">{formatCurrency(amount)}</span>
                    <button 
                      onClick={() => markLeakAsRecovered(client.id, amount)}
                      className="px-2 py-1 bg-[#006622]/10 border border-[#006622]/20 text-[#006622] rounded text-[8px] font-bold uppercase tracking-widest hover:bg-[#006622]/20 transition-all"
                    >
                      mark recovered
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Scope crepp modal popup */}
      {activeDraftClient && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/15 backdrop-blur-sm flex justify-center items-center p-6 animate-fade-in">
          <div className="glass-panel w-full max-w-[460px] p-8 rounded-lg text-left relative bg-white">
            <button 
              onClick={() => setActiveDraftClient(null)}
              className="absolute top-6 right-6 text-[#8e8e93] hover:text-black transition-colors"
            >
              <i className="fa-solid fa-xmark text-[16px] text-black"></i>
            </button>

            <h3 className="text-xl font-bold tracking-tight text-[#0a0a0a] mb-2">draft scope check notice</h3>
            <p className="text-xs text-[#555555] leading-relaxed mb-6">
              send this professional, non-aggressive message to address time leak with {activeDraftClient.name}.
            </p>

            <div className="bg-[#ffffff] border border-black/5 rounded p-4 text-[11px] font-mono text-[#555555] whitespace-pre-line leading-relaxed mb-6 select-text">
              {generateEmailText(
                activeDraftClient,
                clientLeakage.find((cl) => cl.client.id === activeDraftClient.id)?.duration || 0,
                clientLeakage.find((cl) => cl.client.id === activeDraftClient.id)?.amount || 0
              )}
            </div>

            <button
              onClick={() => copyToClipboard(generateEmailText(
                activeDraftClient,
                clientLeakage.find((cl) => cl.client.id === activeDraftClient.id)?.duration || 0,
                clientLeakage.find((cl) => cl.client.id === activeDraftClient.id)?.amount || 0
              ))}
              className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black/85 transition-colors"
            >
              {copySuccess ? "copied!" : "copy scope message"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
