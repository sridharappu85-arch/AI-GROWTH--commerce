import React from 'react';
import { Bot, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090e] border-t border-white/10 mt-auto pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Theme */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">NexAgentic</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous AI Growth & Agentic Commerce platform bridging intent understanding with supervised, secure transactional fulfillment.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Human-In-The-Loop Confirmation Mode</span>
            </div>
          </div>

          {/* Col 2: Multi-Agent System */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Specialized Agents
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Shopping Agent (Intent & Rationale)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span>Recommendation Agent (Persona Scoring)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <Bot className="w-3 h-3 text-indigo-400" />
                <span>Growth Agent (KPI & Churn Diagnostics)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Marketing Agent (Automated Campaigns)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/assistant" className="hover:text-cyan-400 transition">AI Shopping Assistant</Link></li>
              <li><Link to="/products" className="hover:text-white transition">Product Catalog (₹ INR)</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400 transition">Executive BI Dashboard</Link></li>
              <li><Link to="/admin/insights" className="hover:text-white transition">AI Growth Insights</Link></li>
              <li><Link to="/admin/campaigns" className="hover:text-white transition">Marketing Campaign Studio</Link></li>
            </ul>
          </div>

          {/* Col 4: Demo Safety Notice */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Safety & Compliance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This application operates in simulated demo mode. All payment simulations and order records are processed with zero financial liability or external payment gateway dependencies.
            </p>
            <div className="mt-4 p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300">
              ⚡ Local SQLite Database & Deterministic Agent Service Active
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 NexAgentic AI Growth & Commerce Platform. Built for modern agentic web commerce.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Indian Rupee (₹) Pricing</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="text-indigo-400">Node + React + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
