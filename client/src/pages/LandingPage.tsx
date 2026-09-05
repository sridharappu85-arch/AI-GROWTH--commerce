import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  Check, 
  Layers, 
  Users, 
  ChevronRight,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatINR } from '../utils/api';

export const LandingPage: React.FC = () => {
  const [activeDemoTab, setActiveDemoTab] = useState<'shopping' | 'growth' | 'marketing'>('shopping');

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background glow flares */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-violet-600/20 blur-[120px] -z-10 pointer-events-none" />

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>The Future of Autonomous Commerce & Business Growth</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Turn AI Into Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Growth Engine.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            An intelligent commerce platform where autonomous AI agents discover opportunities, personalize customer journeys, and turn shopping intent into action.
          </p>

          {/* Dual Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/assistant"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span>Try AI Shopping Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-sm border border-white/15 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>View Growth Dashboard</span>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No API keys required (Deterministic mode ready)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Human-In-The-Loop confirmation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Prices in Indian Rupees (₹)</span>
            </div>
          </div>
        </div>

        {/* 2. Interactive Agentic Showcase Widget */}
        <div className="mt-12 rounded-3xl glass-panel p-2 sm:p-4 border border-white/15 shadow-2xl relative">
          <div className="bg-[#0b101d] rounded-2xl border border-white/10 overflow-hidden">
            
            {/* Widget Top Tab Switcher */}
            <div className="p-3 sm:p-4 border-b border-white/10 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">nex-agent-orchestrator.ts</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setActiveDemoTab('shopping')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeDemoTab === 'shopping' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Shopping Agent Flow
                </button>
                <button
                  onClick={() => setActiveDemoTab('growth')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeDemoTab === 'growth' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Growth Engine Diagnostic
                </button>
                <button
                  onClick={() => setActiveDemoTab('marketing')}
                  className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                    activeDemoTab === 'marketing' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Marketing Agent Generator
                </button>
              </div>
            </div>

            {/* Widget Tab Content */}
            <div className="p-6 sm:p-8">
              {activeDemoTab === 'shopping' && (
                <div className="space-y-6">
                  {/* Customer query bubble */}
                  <div className="flex items-start gap-3 max-w-xl">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80"
                      alt="User"
                      className="w-8 h-8 rounded-full border border-indigo-500/40"
                    />
                    <div className="p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-xs text-white leading-relaxed">
                      "I need a laptop for programming under ₹70,000 with good battery life."
                    </div>
                  </div>

                  {/* Agent reasoning trace */}
                  <div className="ml-11 p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-200 space-y-1.5 font-mono">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>ShoppingAgent Autonomous Reasoning:</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      ✓ Extracted constraints: Budget ≤ ₹70,000 | Category = Laptops & Computing | Intent = Programming
                    </div>
                    <div className="text-[11px] text-slate-300">
                      ✓ Tool Invocation: searchProducts(category="Laptops", maxPrice=70000, keywords=["programming", "battery"])
                    </div>
                    <div className="text-[11px] text-slate-300">
                      ✓ Ranked candidate: ASUS Vivobook Pro 15 OLED (8-core Ryzen 7, 16GB RAM, 9h battery) @ ₹68,990
                    </div>
                  </div>

                  {/* Product card preview */}
                  <div className="ml-11 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 max-w-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80"
                      alt="Laptop"
                      className="w-24 h-20 rounded-lg object-cover bg-slate-950"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-indigo-400 font-semibold uppercase">AI Top Recommendation</div>
                      <h4 className="text-sm font-bold text-white truncate">ASUS Vivobook Pro 15 OLED Creator</h4>
                      <p className="text-xs text-cyan-300 font-semibold">{formatINR(68990)}</p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        AMD Ryzen 7, 16GB RAM, OLED 100% DCI-P3 display, 9-hour endurance.
                      </p>
                    </div>
                    <Link
                      to="/assistant"
                      className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold whitespace-nowrap transition cursor-pointer"
                    >
                      Test in Assistant
                    </Link>
                  </div>
                </div>
              )}

              {activeDemoTab === 'growth' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-emerald-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Growth Diagnostic: Developer Accessory Bundle Cross-Sell
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold">
                        High Impact
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                      Data shows 68% of laptop buyers in the ₹60,000–₹75,000 cohort search for ergonomic mice within 14 days. Autonomous agent bundle recommendations boost Average Order Value by 18.4%.
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-slate-400 text-[11px]">
                      <span>Projected Lift: <strong className="text-white">+₹3,40,000 / mo</strong></span>
                      <span>Conversion Multiplier: <strong className="text-emerald-400">3.4x</strong></span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/admin/insights"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Explore Growth Insights</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {activeDemoTab === 'marketing' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 text-slate-200 space-y-2 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        AI-Generated Multi-Channel Campaign
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] uppercase font-bold">
                        Target: Tech Enthusiasts
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <p className="text-indigo-300 font-semibold text-xs">
                        "Elevate Your Dev Workflow: OLED Clarity Meets Precision Ergonomics"
                      </p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Hi Rahul, compile code without eye strain. Pair the ASUS Vivobook Pro OLED with the Logitech MX Master 3S for effortless 1000-line navigation. Enjoy an exclusive 8% dev bundle privilege this week.
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                      <span>Predicted Conversion: <strong className="text-cyan-400">6.8%</strong></span>
                      <span>Channel: <strong className="text-white">Email + WhatsApp</strong></span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/admin/campaigns"
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Open Campaign Studio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live KPI Ticker Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              3.4x
            </div>
            <div className="text-xs text-indigo-400 font-medium">Conversion Lift</div>
            <p className="text-[11px] text-slate-400">AI-assisted vs traditional browsing</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">
              +18.4%
            </div>
            <div className="text-xs text-cyan-300 font-medium">Average Order Value</div>
            <p className="text-[11px] text-slate-400">Via autonomous cross-selling</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              &lt;150ms
            </div>
            <div className="text-xs text-emerald-300 font-medium">Agent Latency</div>
            <p className="text-[11px] text-slate-400">Real-time constraint parsing</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 tracking-tight">
              100%
            </div>
            <div className="text-xs text-purple-300 font-medium">Human Confirmation</div>
            <p className="text-[11px] text-slate-400">Zero non-authorized orders</p>
          </div>
        </div>
      </section>

      {/* 4. Specialized Multi-Agent Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Specialized Multi-Agent Ecosystem
          </h2>
          <p className="text-sm text-slate-400">
            Rather than a generic chatbot, NexAgentic coordinates dedicated AI agents equipped with audited tool access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Agent 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-indigo-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">1. Shopping Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts budgets (e.g. ₹70k), use-cases, and hardware specifications. Conducts side-by-side product comparisons with transparent rationales.
            </p>
            <div className="pt-2 text-[11px] text-indigo-300 font-mono">
              Tools: searchProducts(), compareProducts(), addToCart()
            </div>
          </div>

          {/* Agent 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-cyan-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">2. Recommendation Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates customer profiles, purchase history, and category affinity to score relevant accessories and eliminate repetitive offerings.
            </p>
            <div className="pt-2 text-[11px] text-cyan-300 font-mono">
              Tools: getCustomerProfile(), scoreAffinities()
            </div>
          </div>

          {/* Agent 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">3. Growth Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors revenue trends, cohort dropouts, and category performance. Synthesizes high-impact strategies with quantified revenue forecasts.
            </p>
            <div className="pt-2 text-[11px] text-emerald-300 font-mono">
              Tools: analyzeGrowth(), detectChurnRisks()
            </div>
          </div>

          {/* Agent 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">4. Marketing Agent</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates tailored promotional copy, target segment filters, recommended distribution channels (Email, WhatsApp, Push), and estimated ROI.
            </p>
            <div className="pt-2 text-[11px] text-purple-300 font-mono">
              Tools: generateCampaign(), estimateLift()
            </div>
          </div>
        </div>
      </section>

      {/* 5. How Agentic Commerce Works 4-Step Walkthrough */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            How Agentic Commerce Works
          </h2>
          <p className="text-sm text-slate-400">
            From natural conversation to confirmed fulfillment in four intelligent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 relative">
            <span className="text-3xl font-black text-indigo-500/40">01</span>
            <h4 className="text-base font-bold text-white">Natural Conversation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer states their needs in natural language, specifying budget, specs, or dilemmas without wrestling complex filter dropdowns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 relative">
            <span className="text-3xl font-black text-cyan-500/40">02</span>
            <h4 className="text-base font-bold text-white">Autonomous Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Agents parse constraints, query the product catalog, rank candidates, and generate side-by-side comparisons with clear rationales.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 relative">
            <span className="text-3xl font-black text-violet-500/40">03</span>
            <h4 className="text-base font-bold text-white">Agent-Assisted Cart</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer instructs agent to add products, verify accessory compatibility, apply AI perks, and prepare the simulated checkout.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3 relative">
            <span className="text-3xl font-black text-emerald-500/40">04</span>
            <h4 className="text-base font-bold text-white">Confirmed Fulfillment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Order requires explicit human-in-the-loop sign-off before recording confirmed simulated transaction, keeping you fully in control.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience the Future of Commerce Today
            </h2>
            <p className="text-sm text-slate-300">
              Test both perspectives: converse with the AI Shopping Assistant or explore the Executive Growth Dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assistant"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Shopping Assistant</span>
            </Link>
            <Link
              to="/admin"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition cursor-pointer flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Launch Executive BI Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
