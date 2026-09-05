import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Megaphone, 
  RefreshCw
} from 'lucide-react';
import type { GrowthInsight } from '../../types';
import { apiRequest } from '../../utils/api';

export const AdminInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<GrowthInsight[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [appliedAction, setAppliedAction] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/insights');
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/admin/insights/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      await fetchInsights();
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyAction = (id: string, title: string) => {
    setAppliedAction(title);
    handleUpdateStatus(id, 'IMPLEMENTED');
    setTimeout(() => setAppliedAction(null), 3500);
  };

  const filtered = insights.filter(i => {
    if (filterType !== 'ALL' && i.type !== filterType) return false;
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>AI Growth Insights & Autonomous Diagnostics</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {insights.length} active signals
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Predictive customer intent signals, cart drop-off risks, and automated conversion playbooks
          </p>
        </div>

        <button
          onClick={fetchInsights}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run Diagnostics</span>
        </button>
      </div>

      {appliedAction && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Autonomous Playbook Applied: <strong>{appliedAction}</strong>. Status updated to Implemented.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Type Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'OPPORTUNITY', 'RISK', 'CONVERSION', 'MARKETING', 'RETENTION'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-1 px-2.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="IMPLEMENTED">Implemented</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ins) => (
          <div
            key={ins.id}
            className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition ${
              ins.status === 'IMPLEMENTED'
                ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80'
                : 'border-white/10 hover:border-indigo-500/40'
            }`}
          >
            <div className="space-y-3">
              {/* Card Meta */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {ins.type}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    ins.impactLevel === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : ins.impactLevel === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {ins.impactLevel} Impact
                  </span>

                  {ins.status === 'IMPLEMENTED' && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-semibold">
                      Implemented
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Metric Highlight */}
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {ins.title}
                </h2>
                {ins.metricHighlight && (
                  <div className="text-xs text-cyan-400 font-mono font-semibold mt-0.5">
                    Signal: {ins.metricHighlight}
                  </div>
                )}
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {ins.explanation}
              </p>

              {/* Recommended Action */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1 text-xs">
                <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recommended Playbook Action</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-[11px]">
                  {ins.recommendedAction}
                </p>
              </div>
            </div>

            {/* Bottom Actions & Impact */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Business Impact:</span>
                <span className="font-extrabold text-emerald-400">
                  {ins.estimatedImpactValue}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => navigate('/admin/campaigns')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Launch Campaign</span>
                </button>

                {ins.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleApplyAction(ins.id, ins.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Deploy Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(ins.id, 'ACTIVE')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Reopen Signal
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
