"use client";

import React, { useState, useEffect } from "react";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [billingYearly, setBillingYearly] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Calculator states
  const [hourlyRate, setHourlyRate] = useState(85);
  const [leakHours, setLeakHours] = useState(3.5);

  // FAQ Accordion states
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const weeklyLeak = hourlyRate * leakHours;
  const annualLeak = weeklyLeak * 52;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const faqItems = [
    {
      q: "does seep monitor my screen or record keystrokes?",
      a: "absolutely not. seep does not install tracking daemons on your local system or monitor screen inputs. it reads only calendar time entries and metadata logs linked to client scopes. your privacy remains intact.",
    },
    {
      q: "how does calendar auto-tagging match client hours?",
      a: "when client accounts are created, seep parses target names and emails. the algorithm compares attendees and event title coordinates to assign a confidence index (high/medium/low) for scope checks.",
    },
    {
      q: "can i connect other tools than google calendar?",
      a: "google calendar is fully integrated for v1. slack and google workspace email sync updates are planned for next cycles. you can add manual signal override logs directly into your streams at any time.",
    },
    {
      q: "is the free tier limited?",
      a: "the free tier logs up to two concurrent clients. upgrade to the pro freelancer membership ($29/month) for unlimited active client audits, priority tracker syncs, and ai scope email drafting.",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#fafafa] text-[#0a0a0a] font-sans selection:bg-black selection:text-white relative overflow-x-hidden text-lowercase select-none">
      
      {/* Ambient decorative grid backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[80px] h-[80px] bg-transparent opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:30px_30px] inset-0"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full top-[5%] right-[-5%] bg-radial from-[#e8e8e8]/50 to-transparent opacity-40 border border-[#e0e0e0]/20 animate-float-slow"></div>
        <div className="absolute w-[500px] h-[500px] rounded-[40%_60%_50%_50%] bottom-[10%] left-[-10%] bg-radial from-[#f2f2f2]/70 to-transparent opacity-40 border border-[#e0e0e0]/20 animate-float-slower"></div>
      </div>

      {/* ── Sticky navbar ── always glassmorphic */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[60px] px-8 flex items-center justify-between select-none transition-all duration-300 bg-black/40 backdrop-blur-md border-b border-white/10"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0">
          <div className="w-6 h-6 bg-white flex items-center justify-center shrink-0">
            <i className="fa-solid fa-droplet text-[10px] text-black"></i>
          </div>
          <span className="font-black text-base tracking-tighter text-white">seep</span>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-7">
          <a href="#how-it-works" className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors tracking-wide">how it works</a>
          <a href="#calculator" className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors tracking-wide">calculator</a>
          <a href="#features" className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors tracking-wide">features</a>
          <a href="#pricing" className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors tracking-wide">pricing</a>
          <a href="#faq" className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors tracking-wide">faq</a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={onLaunchApp} className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors cursor-pointer tracking-wide">
            log in
          </button>
          <button
            onClick={onLaunchApp}
            className="px-5 py-2 border border-white/40 text-white text-[11px] font-bold tracking-wide hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            get started
          </button>
        </div>
      </header>

      {/* ── Hero Section ── Lateral-style split layout ── */}
      <section
        className="relative w-full min-h-screen flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/normal-refraction.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Left content */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-[520px] px-12 pt-40 pb-32">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 self-start px-3 py-1 border border-white/25 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold tracking-widest uppercase mb-8 animate-fade-in-up">
            <i className="fa-solid fa-circle-dot text-green-400 text-[8px]"></i>
            seep raises $2m seed — read announcement
            <i className="fa-solid fa-arrow-right text-[8px] text-white/50"></i>
          </span>

          {/* Headline */}
          <h1 className="text-5xl md:text-[3.8rem] font-black leading-[1.05] mb-5 animate-fade-in-up [animation-delay:0.1s]">
            <span className="text-white">your revenue</span><br />
            <span className="text-white/40">stops leaking.</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm text-white/60 leading-relaxed mb-10 max-w-sm animate-fade-in-up [animation-delay:0.2s]">
            seep automatically detects unbilled hours, unscheduled client calls, and revision drift — and recovers them before they vanish.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-4 animate-fade-in-up [animation-delay:0.3s]">
            <button
              onClick={onLaunchApp}
              className="px-7 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              start for free
            </button>
            <button
              onClick={onLaunchApp}
              className="px-7 py-3 border border-white/30 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/60 transition-all cursor-pointer"
            >
              see how it works
            </button>
          </div>
        </div>

        {/* Bottom logo ticker */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-black/20 backdrop-blur-sm py-6 px-8">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">trusted by teams at</span>
            <div className="flex items-center gap-6 md:gap-10 flex-wrap justify-center">
              {["Meridian Studio", "Northline", "Gantry Co.", "53 Capital", "Westbridge", "Lattice Labs", "Arc Media"].map((name, i, arr) => (
                <span key={name} className="flex items-center gap-6 md:gap-10">
                  <span className="text-white/50 text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap hover:text-white transition-colors cursor-default">{name}</span>
                  {i < arr.length - 1 && <span className="text-white/15 text-[6px]">●</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>



      {/* How it works */}
      <section id="how-it-works" className="relative z-10 bg-[#fafafa] py-24 border-t border-[#e0e0e0]">
        <div className="max-w-5xl mx-auto px-8 w-full">

          {/* Header */}
          <div className="mb-14">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8e8e93] block mb-4">seep</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0a0a0a] leading-tight mb-4">
              three steps.<br />
              <span className="text-[#8e8e93]">real fast.</span>
            </h2>
            <p className="text-sm text-[#555555] max-w-sm leading-relaxed">
              from zero visibility to recovered revenue in under two minutes.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Step 1 */}
            <div className="bg-white border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">01</span>
                <span className="text-[9px] font-semibold text-[#8e8e93] uppercase tracking-widest">&lt; 60 sec</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0a0a0a] mb-2">connect workspace.</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  link your google calendar with one-click auth. seep observes in the background — no keyloggers, no screen tracking.
                </p>
              </div>
              {/* Preview element */}
              <div className="mt-auto pt-4 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-[#fafafa] border border-[#e0e0e0] w-fit">
                  <i className="fa-brands fa-google text-black text-xs"></i>
                  <span className="text-[10px] font-bold text-[#0a0a0a]">google calendar</span>
                  <span className="text-[9px] text-[#8e8e93] ml-2">connected</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">02</span>
                <span className="text-[9px] font-semibold text-[#8e8e93] uppercase tracking-widest">as long as it takes</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0a0a0a] mb-2">detect unbilled drift.</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  seep flags overlapping client calls, unlogged revisions, and meetings outside your standard scope — automatically.
                </p>
              </div>
              {/* Preview element */}
              <div className="mt-auto pt-4 border-t border-[#e0e0e0] flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 bg-black/5 border border-black/10">
                  <span className="text-[10px] font-bold text-[#0a0a0a]">revision call • 1.5 hrs</span>
                  <span className="text-[9px] text-[#0a0a0a] font-semibold uppercase tracking-wide">unbilled</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-[#fafafa] border border-[#e0e0e0]">
                  <span className="text-[10px] font-bold text-[#555555]">weekly sync • 0.8 hrs</span>
                  <span className="text-[9px] text-[#8e8e93] font-semibold uppercase tracking-wide">flagged</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">03</span>
                <span className="text-[9px] font-semibold text-[#8e8e93] uppercase tracking-widest">&lt; 1 min</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0a0a0a] mb-2">claim &amp; recover.</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  confirm the unbilled slot, fire off an ai-drafted scope notice, and recover the revenue. professional, stress-free, done.
                </p>
              </div>
              {/* Preview element */}
              <div className="mt-auto pt-4 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-black text-white w-fit">
                  <i className="fa-solid fa-circle-check text-white text-xs"></i>
                  <span className="text-[10px] font-bold">$195.00 recovered</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-white/60 text-[8px] ml-1"></i>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Interactive Leak Calculator Section */}
      <section id="calculator" className="relative z-10 border-t border-[#e0e0e0] bg-[#fafafa] py-20 flex flex-col items-center text-center">
        <div className="max-w-5xl mx-auto px-8 w-full">
          
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-1">roi estimator</span>
            <h2 className="text-3xl font-black tracking-tight text-black mb-3">how much are you losing?</h2>
            <p className="text-xs text-[#555555] leading-relaxed">
              adjust the sliders to estimate how many unbilled hours slip away through meetings, updates, and support chats weekly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Inputs */}
            <div className="flex flex-col gap-5 justify-between">
              
              {/* Slider 1: Hourly Rate */}
              <div className="bg-white p-5 border border-black/5 rounded shadow-sm text-left hover:border-black/10 transition-colors duration-300">
                <div className="flex justify-between items-center mb-3 text-xs font-bold">
                  <span>your hourly rate</span>
                  <span className="text-black text-sm">${hourlyRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="250"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#f2f2f2] rounded outline-none accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#8e8e93] mt-2 font-mono">
                  <span>$30</span>
                  <span>$140</span>
                  <span>$250</span>
                </div>
              </div>

              {/* Slider 2: Leak Hours */}
              <div className="bg-white p-5 border border-black/5 rounded shadow-sm text-left hover:border-black/10 transition-colors duration-300">
                <div className="flex justify-between items-center mb-3 text-xs font-bold">
                  <span>unbilled hours / week</span>
                  <span className="text-black text-sm">{leakHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={leakHours}
                  onChange={(e) => setLeakHours(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#f2f2f2] rounded outline-none accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#8e8e93] mt-2 font-mono">
                  <span>1h</span>
                  <span>8h</span>
                  <span>15h</span>
                </div>
              </div>

            </div>

            {/* Results display */}
            <div className="bg-black text-white p-8 rounded flex flex-col justify-between min-h-[240px] text-left relative overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_65%)] pointer-events-none"></div>
              
              <div className="relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#8e8e93] block mb-3">estimated leakage scope</span>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-black tracking-tight font-sans text-white transition-all duration-200">
                    {formatCurrency(weeklyLeak)} <span className="text-xs text-[#8e8e93] font-medium lowercase">lost every week</span>
                  </span>
                  <span className="text-4xl font-black tracking-tight font-sans text-[#EA4335] transition-all duration-200">
                    {formatCurrency(annualLeak)} <span className="text-xs text-[#8e8e93] font-medium lowercase">lost every year</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <span className="text-[10px] text-[#8e8e93] leading-relaxed max-w-[200px]">
                  seep recovers up to 88% of lost client hours automatically.
                </span>
                <button
                  onClick={onLaunchApp}
                  className="px-5 py-2.5 bg-white text-black text-[9px] font-black uppercase tracking-wider rounded hover:bg-[#f2f2f2] hover:scale-[1.03] transition-all cursor-pointer shadow"
                >
                  plug leak now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features — Jasper Platform style */}
      <section id="features" className="relative z-10 border-t border-[#e0e0e0] bg-white py-24">
        <div className="max-w-6xl mx-auto px-8 w-full">

          {/* Split header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8e8e93] flex items-center gap-1.5 mb-4">
                <i className="fa-solid fa-droplet text-[8px] text-black"></i>
                the seep platform
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0a0a0a] leading-tight">
                built for<br />
                revenue recovery
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm text-[#555555] leading-relaxed mb-5">
                seep is a purpose-built leak detection engine for freelancers and agencies. it deeply understands your billing patterns, surfaces unbilled hours, and drafts professional scope adjustments — so you keep what you earned.
              </p>
              <a href="#pricing" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e0e0e0] text-[11px] font-bold text-[#0a0a0a] uppercase tracking-wider hover:bg-[#fafafa] transition-colors">
                explore the platform
              </a>
            </div>
          </div>

          {/* 4-card row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Card 1 */}
            <div className="bg-[#fafafa] border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-black text-[#0a0a0a] leading-tight">active<br />radar scanner</h3>
                <div className="w-8 h-8 bg-white border border-[#e0e0e0] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-satellite-dish text-[11px] text-[#0a0a0a]"></i>
                </div>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed flex-1">
                background tracking logic audits calendar overlaps and client messaging feeds to identify meetings that went unbilled.
              </p>
              <div className="pt-3 border-t border-[#e0e0e0]">
                <span className="text-[#0a0a0a] text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#fafafa] border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-black text-[#0a0a0a] leading-tight">smart tag<br />associate</h3>
                <div className="w-8 h-8 bg-white border border-[#e0e0e0] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-wand-magic-sparkles text-[11px] text-[#0a0a0a]"></i>
                </div>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed flex-1">
                automatically matches time slots to active clients using title patterns and email attendees. review confidence rankings before confirming.
              </p>
              <div className="pt-3 border-t border-[#e0e0e0]">
                <span className="text-[#0a0a0a] text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#fafafa] border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-black text-[#0a0a0a] leading-tight">ai scope<br />adjustment drafts</h3>
                <div className="w-8 h-8 bg-white border border-[#e0e0e0] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope text-[11px] text-[#0a0a0a]"></i>
                </div>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed flex-1">
                one-click professional notice drafts that make billing client revisions, scope drift, or calls stress-free and non-confrontational.
              </p>
              <div className="pt-3 border-t border-[#e0e0e0]">
                <span className="text-[#0a0a0a] text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#fafafa] border border-[#e0e0e0] p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-black text-[#0a0a0a] leading-tight">effective<br />rate auditor</h3>
                <div className="w-8 h-8 bg-white border border-[#e0e0e0] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-chart-line text-[11px] text-[#0a0a0a]"></i>
                </div>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed flex-1">
                calculates your actual hourly rate based on real hours worked vs target billing, showing you exactly where you leave margin on the table.
              </p>
              <div className="pt-3 border-t border-[#e0e0e0]">
                <span className="text-[#0a0a0a] text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Pricing grid — dark Lateral style */}
      <section id="pricing" className="relative z-10 bg-[#0a0a0a] py-24 flex flex-col items-center">
        <div className="max-w-6xl mx-auto px-8 w-full">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">billing tiers</span>
            <h2 className="text-4xl font-black tracking-tight text-white mb-4">flat pricing. immediate payback.</h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">no seats, no surprises. cancel any time.</p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-14">
            <span className={`text-[11px] font-semibold transition-colors ${!billingYearly ? "text-white" : "text-white/40"}`}>monthly</span>
            <button
              onClick={() => setBillingYearly(!billingYearly)}
              className="relative w-10 h-5 bg-white/20 rounded-full transition-all cursor-pointer"
              aria-label="toggle billing period"
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                  billingYearly ? "left-5" : "left-0.5"
                }`}
              ></span>
            </button>
            <span className={`text-[11px] font-semibold transition-colors ${billingYearly ? "text-white" : "text-white/40"}`}>yearly</span>
            <span className="px-2 py-0.5 bg-green-500/15 border border-green-500/30 text-green-400 text-[9px] font-bold uppercase tracking-wider">save 20%</span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

            {/* Core */}
            <div className="bg-[#141414] border border-white/8 p-7 flex flex-col gap-6 hover:border-white/15 transition-colors duration-300">
              <div>
                <h3 className="text-lg font-black text-white mb-2">core</h3>
                <p className="text-xs text-white/40 leading-relaxed">for freelancers tracking their first client leaks.</p>
              </div>
              <div className="border-t border-white/8 pt-5">
                <span className="text-5xl font-black text-white">$0</span>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mt-1">free forever</p>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">tracking</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>up to 2 active clients</li>
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>basic calendar sync</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">reporting</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>manual override logs</li>
                    <li className="flex items-center gap-2.5 text-xs text-white/40 line-through"><i className="fa-solid fa-xmark text-white/20 text-[9px] w-3"></i>limited history only</li>
                  </ul>
                </div>
              </div>
              <button onClick={onLaunchApp} className="w-full py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer">
                get started
              </button>
            </div>

            {/* Growth — Popular */}
            <div className="bg-[#141414] border border-white/20 p-7 flex flex-col gap-6 relative hover:border-white/30 transition-colors duration-300 shadow-[0_0_40px_rgba(255,255,255,0.04)]">
              <div className="absolute top-5 right-5">
                <span className="px-3 py-1 border border-white/20 bg-white/5 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">popular</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white mb-2">pro freelancer</h3>
                <p className="text-xs text-white/40 leading-relaxed">for independent builders scaling multiple clients.</p>
              </div>
              <div className="border-t border-white/8 pt-5">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">{billingYearly ? "$23" : "$29"}</span>
                  {billingYearly && <span className="text-white/30 text-sm line-through mb-1">$29</span>}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mt-1">per month{billingYearly ? ", billed yearly" : ""}</p>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">tracking</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>unlimited active clients</li>
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>priority calendar syncs</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">ai features</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>ai scope adjustment drafts</li>
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>weekly leakage statements</li>
                  </ul>
                </div>
              </div>
              <button onClick={onLaunchApp} className="w-full py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer">
                get started
              </button>
            </div>

            {/* Agency */}
            <div className="bg-[#141414] border border-white/8 p-7 flex flex-col gap-6 hover:border-white/15 transition-colors duration-300">
              <div>
                <h3 className="text-lg font-black text-white mb-2">agency</h3>
                <p className="text-xs text-white/40 leading-relaxed">for studios and firms with complex client portfolios.</p>
              </div>
              <div className="border-t border-white/8 pt-5">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">{billingYearly ? "$71" : "$89"}</span>
                  {billingYearly && <span className="text-white/30 text-sm line-through mb-1">$89</span>}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mt-1">per month{billingYearly ? ", billed yearly" : ""}</p>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">tracking</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>unlimited clients + seats</li>
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>team leakage dashboards</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">advanced</p>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>all integrations + sso</li>
                    <li className="flex items-center gap-2.5 text-xs text-white/70"><i className="fa-solid fa-check text-white/40 text-[9px] w-3"></i>dedicated account support</li>
                  </ul>
                </div>
              </div>
              <button onClick={onLaunchApp} className="w-full py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer">
                get started
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ — split layout */}
      <section id="faq" className="relative z-10 border-t border-[#e0e0e0] bg-white py-24">
        <div className="max-w-6xl mx-auto px-8 w-full">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">

            {/* Left — heading */}
            <div className="md:col-span-4 flex flex-col gap-5">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#0a0a0a] leading-tight">
                frequently asked<br />questions
              </h2>
              <p className="text-xs text-[#555555] leading-relaxed max-w-xs">
                got questions? we've got answers. browse our faq, or reach out anytime — we're here to help make your journey smooth sailing.
              </p>
              <button
                onClick={onLaunchApp}
                className="w-fit px-5 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black/85 transition-colors cursor-pointer mt-1"
              >
                reach out
              </button>
            </div>

            {/* Right — questions */}
            <div className="md:col-span-8 flex flex-col">
              {faqItems.map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border-b border-[#e0e0e0] last:border-b-0"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center py-4 text-sm font-semibold text-[#0a0a0a] cursor-pointer hover:text-black/70 transition-colors text-left gap-4"
                    >
                      <span>{item.q}</span>
                      <span className="w-6 h-6 border border-[#e0e0e0] rounded-full flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"} text-[8px] text-[#0a0a0a]`}></i>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="text-xs text-[#555555] leading-relaxed pb-4 pr-10 animate-fade-in-up">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>


      {/* Full-width CTA */}
      <section className="bg-black text-white py-32 relative z-10 border-t border-white/10 select-none overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none"></div>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[180px] md:text-[280px] font-black tracking-tighter text-white/[0.02] leading-none">seep</span>
        </div>

        <div className="max-w-3xl mx-auto px-8 text-center relative z-10 flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 mb-6">ready to recover?</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
            stop letting client<br />drift leak profit.
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-10">
            connect your workspace logs in less than 2 minutes. estimate target billing and claim what you worked.
          </p>
          <button
            onClick={onLaunchApp}
            className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 hover:scale-[1.03] transition-all cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            claim your free account
          </button>

          {/* Trust stats */}
          <div className="flex items-center gap-8 mt-14 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">88%</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1">recovery rate</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">&lt;2 min</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1">setup time</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">$0</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest mt-1">to start</span>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#0a0a0a] pt-20 pb-0 relative z-10 select-none overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 w-full relative z-10">

          {/* Main columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">

            {/* Branding */}
            <div className="md:col-span-5 flex flex-col gap-4 text-left">
              <div
                onClick={onLaunchApp}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 bg-white flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-droplet text-[10px] text-black"></i>
                </div>
                <span className="font-black text-lg tracking-tighter text-white">seep</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-sm">
                automatically detect unbilled client hours, meetings, and revision drift in real time — without manual time tracking.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 mt-2">
                <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all">
                  <i className="fa-brands fa-x-twitter text-white/40 text-[11px]"></i>
                </a>
                <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all">
                  <i className="fa-brands fa-linkedin-in text-white/40 text-[11px]"></i>
                </a>
                <a href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all">
                  <i className="fa-brands fa-github text-white/40 text-[11px]"></i>
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="md:col-span-2 flex flex-col gap-3 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/25 block">product</span>
              <div className="flex flex-col gap-2.5 text-xs text-white/50">
                <a href="#how-it-works" className="hover:text-white transition-colors">how it works</a>
                <a href="#calculator" className="hover:text-white transition-colors">leak calculator</a>
                <a href="#features" className="hover:text-white transition-colors">features</a>
                <a href="#pricing" className="hover:text-white transition-colors">pricing</a>
                <a href="#faq" className="hover:text-white transition-colors">faq</a>
              </div>
            </div>

            {/* Company */}
            <div className="md:col-span-2 flex flex-col gap-3 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/25 block">company</span>
              <div className="flex flex-col gap-2.5 text-xs text-white/50">
                <a href="#" className="hover:text-white transition-colors">about</a>
                <a href="#" className="hover:text-white transition-colors">blog</a>
                <a href="#" className="hover:text-white transition-colors">careers</a>
                <a href="#" className="hover:text-white transition-colors">contact</a>
              </div>
            </div>

            {/* Get started */}
            <div className="md:col-span-3 flex flex-col gap-3 text-left">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/25 block">get started</span>
              <div className="flex flex-col gap-2.5 text-xs text-white/50">
                <button onClick={onLaunchApp} className="hover:text-white transition-colors text-left cursor-pointer">sign in</button>
                <button onClick={onLaunchApp} className="hover:text-white transition-colors text-left cursor-pointer">create account</button>
                <button onClick={onLaunchApp} className="hover:text-white transition-colors text-left cursor-pointer">recover leakage</button>
              </div>
            </div>

          </div>

          {/* Separator */}
          <div className="border-t border-white/8 w-full mb-6"></div>

          {/* Legal row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/25 mb-8">
            <span>© 2026 seep inc. all rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">terms of service</a>
              <a href="#" className="hover:text-white/60 transition-colors">privacy policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">cookie policy</a>
            </div>
          </div>

        </div>

        {/* Giant seep watermark — flush to bottom */}
        <div className="relative w-full flex justify-center overflow-hidden h-[70px] md:h-[130px] pointer-events-none select-none">
          <span className="text-[100px] md:text-[200px] font-black tracking-[-0.05em] text-white/[0.04] leading-none absolute bottom-[-35%] whitespace-nowrap">
            seep
          </span>
        </div>
      </footer>


    </div>
  );
}
