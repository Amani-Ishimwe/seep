"use client";

import React from "react";
import { useSeep } from "@/context/SeepContext";

export default function IntegrationsView() {
  const { calendarConnected, connectCalendar } = useSeep();

  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-2 text-lowercase text-[#0a0a0a] text-left">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8e8e93] block mb-1">connected apps</span>
        <h1 className="text-2xl font-black tracking-tight text-[#0a0a0a]">active integration syncs</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Calendar Card */}
        <div className="card rounded-xl p-6 rounded-lg flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="36" height="36" fill="#1A73E8" />
                <rect x="12" y="15" width="24" height="21" fill="white" />
                <path d="M30 6v9h12L30 6z" fill="#FFF" opacity="0.4" />
                <path d="M42 15h-9V6l9 9z" fill="#185ABC" />
                <text x="24" y="26" fill="#1A73E8" font-family="Satoshi, sans-serif" font-size="14" font-weight="900" text-anchor="middle" dominant-baseline="central">31</text>
              </svg>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${calendarConnected ? "bg-[#006622]/10 text-[#006622]" : "bg-[#8a6d3b]/10 text-[#8a6d3b]"}`}>
                {calendarConnected ? "connected" : "disconnected"}
              </span>
            </div>
            <h3 className="font-bold text-sm text-black mb-1">google calendar</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              seep uses your calendar logs to parse client meeting coordinates and durations.
            </p>
          </div>

          <div className="mt-6">
            {calendarConnected ? (
              <span className="text-[10px] text-[#8e8e93] font-semibold flex items-center gap-1">
                <i className="fa-solid fa-circle-check text-[14px] text-[#006622]"></i>
                syncing automatically in background
              </span>
            ) : (
              <button
                onClick={connectCalendar}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black/85 transition-colors"
              >
                connect calendar
              </button>
            )}
          </div>
        </div>

        {/* Slack Card (coming soon) */}
        <div className="card rounded-xl p-6 rounded-lg opacity-70 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left (Blue) */}
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.834a2.528 2.528 0 0 1-2.52-2.522v-6.313z" fill="#36C5F0"/>
                {/* Top (Green) */}
                <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522a2.528 2.528 0 0 1-2.522-2.521h6.312z" fill="#2EB67D"/>
                {/* Right (Yellow) */}
                <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#ECB22E"/>
                {/* Bottom (Magenta) */}
                <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
              </svg>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#f2f2f2] text-[#8e8e93]">later</span>
            </div>
            <h3 className="font-bold text-sm text-black mb-1">slack workspace</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              sync active team chat logs to auto-suggest leakage generated from support discussions.
            </p>
          </div>

          <div className="mt-6">
            <button
              disabled
              className="px-4 py-2 bg-[#f2f2f2] text-[#8e8e93] border border-[#e0e0e0] text-xs font-bold uppercase tracking-wider rounded cursor-not-allowed"
            >
              slack integration planned
            </button>
          </div>
        </div>

        {/* Email Card (coming soon) */}
        <div className="card rounded-xl p-6 rounded-lg opacity-70 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Leg: Blue */}
                <path d="M4 20H1.636A1.636 1.636 0 0 1 0 18.364V6.545L4 9.545V20z" fill="#4285F4"/>
                {/* Right Leg: Green */}
                <path d="M20 20h2.364A1.636 1.636 0 0 0 24 18.364V6.545l-4 3v10.455z" fill="#34A853"/>
                {/* Top Bar/Flaps: Red & Yellow */}
                <path d="M20 6.545L12 12.545L4 6.545V3.818l8 6l8-6v2.727z" fill="#EA4335"/>
                <path d="M4 3.818V6.545L12 12.545L20 6.545V3.818L12 9.818L4 3.818z" fill="#FBBC05" opacity="0.9"/>
              </svg>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#f2f2f2] text-[#8e8e93]">later</span>
            </div>
            <h3 className="font-bold text-sm text-black mb-1">google workspace email</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              detect client follow-up intervals to bill for administrative correspondence.
            </p>
          </div>

          <div className="mt-6">
            <button
              disabled
              className="px-4 py-2 bg-[#f2f2f2] text-[#8e8e93] border border-[#e0e0e0] text-xs font-bold uppercase tracking-wider rounded cursor-not-allowed"
            >
              email integration planned
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
