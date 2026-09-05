import React from 'react';
import { ShieldCheck, Cpu, Database, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          Agentic Governance
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How Agentic Commerce Operates
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          The safety model, audited tool execution framework, and human-in-the-loop boundaries powering NexAgentic.
        </p>
      </div>

      {/* Layered Diagram */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center items-center">
          
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="text-xs font-bold text-indigo-300">1. Client Layer</div>
            <p className="text-[11px] text-slate-300">Natural conversational requests & intent signals</p>
          </div>

          <div className="text-indigo-400 font-bold text-lg hidden md:block">→</div>

          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
            <div className="text-xs font-bold text-cyan-300">2. Orchestrator</div>
            <p className="text-[11px] text-slate-300">Task routing, safety guards & logging</p>
          </div>

          <div className="text-cyan-400 font-bold text-lg hidden md:block">→</div>

          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
            <div className="text-xs font-bold text-purple-300">3. Safe Tools</div>
            <p className="text-[11px] text-slate-300">searchProducts(), compare(), prepareCheckout()</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Unsupervised Writes</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              The AI agent cannot execute raw SQL or alter database states directly. All mutations occur through strictly typed, authorized application tool handlers.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Mandatory Confirmation</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              High-consequence actions like placing orders, calculating discounts, or modifying cart quantities prompt human approval with explicit summary verification.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Full Audit Observability</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Every invocation logs query inputs, tool names, outputs, execution latencies, and step-by-step reasoning chains into the AgentLog table.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/assistant"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <span>Experience the Agent in Action</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
