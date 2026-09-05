import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Megaphone, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Autonomous Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Engineered for Agentic Precision & Scalable Growth
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Four dedicated AI agents operating under strict execution guardrails to drive customer conversion and business intelligence.
        </p>
      </div>

      {/* Feature 1: Shopping Agent */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            1. Autonomous Shopping Agent
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Eliminates multi-faceted filter fatigue. Customers converse in natural language, and the agent extracts explicit budgets (e.g. ₹70,000), use cases (programming, coding, gaming), and desired specifications (OLED, battery, RAM).
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Multi-constraint constraint decomposition with relaxed fallbacks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Side-by-side technical specification differential matrices</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Human-in-the-loop authorization modal for simulated checkout</span>
            </li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-cyan-300 space-y-2">
          <div className="text-slate-400">// Shopping Agent Intent Parsing</div>
          <div>User: "Need a laptop for programming under ₹70,000 with good battery life."</div>
          <div className="text-emerald-400">→ Budget: ≤ 70,000 INR</div>
          <div className="text-emerald-400">→ Category: "Laptops & Computing"</div>
          <div className="text-emerald-400">→ Attributes: ["Ryzen/i5+", "RAM ≥ 16GB", "Battery ≥ 8hrs"]</div>
          <div className="text-indigo-400">✓ Invoking: searchProducts() with ranking model</div>
        </div>
      </div>

      {/* Feature 2: Growth Agent */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1 p-6 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-emerald-300 space-y-2">
          <div className="text-slate-400">// Growth Diagnostic Telemetry</div>
          <div>Cohort: "Value-Conscious Students (18–25)"</div>
          <div>Metric: High Catalog Browse (84%) → 26% Drop-off at Checkout</div>
          <div>Root Cause: Lack of 0% No-Cost EMI at checkout step</div>
          <div className="text-cyan-400">✓ Generated Insight: Deploy instant WhatsApp 3-month EMI nudge</div>
          <div className="text-white">Impact: Saves ~₹2,10,000 In At-Risk Carts</div>
        </div>
        <div className="order-1 lg:order-2 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            2. Autonomous Growth Agent
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Continuously monitors store conversion funnels, category sales velocity, and cohort drop-off rates. Generates prioritized, quantified growth opportunities for store executives.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>RFM (Recency, Frequency, Monetary) segment anomaly detection</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cart abandonment pattern diagnostics and retention playbooks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AOV optimization via automated cross-sell prompts (+18.4% lift)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Feature 3: Marketing & Recommendation Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Marketing Campaign Agent</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            1-Click synthesis of ad copy, targeted email headers, and WhatsApp messaging tailored to behavioral customer cohorts. Quantifies predicted conversion lift before dispatch.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">4. Recommendation Agent</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Continuously tunes customer affinity models based on past orders, active wishlists, and technical proficiency. Dynamically boosts accessory cross-sells.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/assistant"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <span>Try AI Shopping Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
