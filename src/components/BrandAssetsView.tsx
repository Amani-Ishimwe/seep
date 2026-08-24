"use client";

import React from "react";

export default function BrandAssetsView() {
  return (
    <div className="flex flex-col select-none max-w-5xl mx-auto py-4">
      {/* Title */}
      <div className="flex flex-col gap-2 mb-10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93]">Visual Specification</div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">Seep Brand System</h1>
        <p className="text-sm text-[#555555] font-normal max-w-[600px]">
          Minimalist brand parameters, color swatches, and SVG logomarks engineered for premium, low-contrast precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
        {/* Left Column: App Icon / Logomark */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">App Icon / Logomark</h2>
            <p className="text-sm text-[#555555] leading-relaxed">
              The Seep icon represents billable tracking bars where the final client hour is broken and seeping out into unbilled time. Designed to work in absolute monochrome.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Positive Logo */}
            <div className="border border-[#E0E0E0] rounded-xl p-10 flex flex-col items-center justify-center min-h-[200px] bg-white">
              <div className="flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-[#0A0A0A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="20" x2="4" y2="14" />
                  <line x1="10" y1="20" x2="10" y2="8" />
                  <line x1="16" y1="20" x2="16" y2="2" />
                  <line x1="22" y1="6" x2="22" y2="2" />
                  <circle cx="22" cy="12" r="1.2" fill="currentColor" stroke="none" />
                  <circle cx="22" cy="18" r="1.2" fill="currentColor" stroke="none" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] mt-2">Positive: Black-on-White</span>
              </div>
            </div>

            {/* Negative Logo */}
            <div className="border border-[#0A0A0A] rounded-xl p-10 flex flex-col items-center justify-center min-h-[200px] bg-[#0A0A0A]">
              <div className="flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="20" x2="4" y2="14" stroke="#FFFFFF" />
                  <line x1="10" y1="20" x2="10" y2="8" stroke="#FFFFFF" />
                  <line x1="16" y1="20" x2="16" y2="2" stroke="#FFFFFF" />
                  <line x1="22" y1="6" x2="22" y2="2" stroke="#FFFFFF" />
                  <circle cx="22" cy="12" r="1.2" fill="#FFFFFF" stroke="none" />
                  <circle cx="22" cy="18" r="1.2" fill="#FFFFFF" stroke="none" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-2">Negative: White-on-Black</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Palette & Specifications */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#555555]">Color System Rules</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#E0E0E0] rounded-xl p-4 bg-white">
              <div className="h-[60px] bg-white border border-black/5 rounded-md mb-3"></div>
              <span className="block text-xs font-bold text-[#0A0A0A]">Primary BG</span>
              <span className="block text-[10px] text-[#8E8E93] mt-0.5">#FFFFFF</span>
            </div>

            <div className="border border-[#E0E0E0] rounded-xl p-4 bg-white">
              <div className="h-[60px] bg-[#FAFAFA] border border-black/5 rounded-md mb-3"></div>
              <span className="block text-xs font-bold text-[#0A0A0A]">Secondary BG</span>
              <span className="block text-[10px] text-[#8E8E93] mt-0.5">#FAFAFA</span>
            </div>

            <div className="border border-[#E0E0E0] rounded-xl p-4 bg-white">
              <div className="h-[60px] bg-[#0A0A0A] rounded-md mb-3"></div>
              <span className="block text-xs font-bold text-[#0A0A0A]">Primary Ink</span>
              <span className="block text-[10px] text-[#8E8E93] mt-0.5">#0A0A0A</span>
            </div>

            <div className="border border-[#E0E0E0] rounded-xl p-4 bg-white">
              <div className="h-[60px] bg-white/65 backdrop-blur-md border border-black/10 rounded-md mb-3"></div>
              <span className="block text-xs font-bold text-[#0A0A0A]">Glass Panel</span>
              <span className="block text-[10px] text-[#8E8E93] mt-0.5">rgba(255,255,255,0.65)</span>
            </div>
          </div>

          <h2 className="text-xs font-bold uppercase tracking-wider text-[#555555] mt-4">System Parameters</h2>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-xs py-2.5 border-b border-black/5">
              <span className="font-semibold text-[#555555]">Typography</span>
              <span className="font-bold text-[#0A0A0A]">Inter (Modern Sans)</span>
            </div>
            <div className="flex justify-between text-xs py-2.5 border-b border-black/5">
              <span className="font-semibold text-[#555555]">Corner Radii</span>
              <span className="font-bold text-[#0A0A0A]">14px (Cards), 20px (Modals/Grid)</span>
            </div>
            <div className="flex justify-between text-xs py-2.5 border-b border-black/5">
              <span className="font-semibold text-[#555555]">Glass Blur</span>
              <span className="font-bold text-[#0A0A0A]">backdrop-filter: blur(20px)</span>
            </div>
            <div className="flex justify-between text-xs py-2.5 border-b border-black/5">
              <span className="font-semibold text-[#555555]">Borders</span>
              <span className="font-bold text-[#0A0A0A]">1px, Low contrast (rgba(0,0,0,0.08))</span>
            </div>
            <div className="flex justify-between text-xs py-2.5 border-b border-black/5">
              <span className="font-semibold text-[#555555]">Color Accents</span>
              <span className="font-bold text-[#0A0A0A]">None (Strict Monochrome)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
