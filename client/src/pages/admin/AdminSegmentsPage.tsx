import React, { useState, useEffect } from 'react';
import { Layers, Users, DollarSign, AlertCircle, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CustomerSegment } from '../../types';
import { apiRequest, formatINR } from '../../utils/api';

export const AdminSegmentsPage: React.FC = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/admin/segments');
        setSegments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSegments();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading customer segments...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Customer Segmentation & RFM Behavioral Health</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {segments.length} cohorts
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Algorithmic clustering of customer lifecycles, spend propensity, and automated churn prevention playbooks
        </p>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {segments.map((seg) => {
          let charList: string[] = [];
          let actionList: string[] = [];
          try { charList = JSON.parse(seg.characteristics); } catch { /* ignore */ }
          try { actionList = JSON.parse(seg.recommendedActions); } catch { /* ignore */ }

          return (
            <div
              key={seg.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Top Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {seg.name}
                    </h2>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    seg.churnRisk === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : seg.churnRisk === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {seg.churnRisk} Churn Risk
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {seg.description}
                </p>

                {/* Cohort Stats */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Cohort Size</div>
                    <div className="text-sm font-bold text-white mt-0.5">{seg.customerCount} Customers</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Avg AOV</div>
                    <div className="text-sm font-bold text-cyan-400 mt-0.5">{formatINR(seg.avgAOV)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Avg CLV</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatINR(seg.avgCLV)}</div>
                  </div>
                </div>

                {/* Characteristics */}
                {charList.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Observed Behavioral Traits
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {charList.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-400">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommended Retention Playbooks */}
              {actionList.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5 text-xs">
                  <div className="text-[10px] font-bold uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Autonomous AI Playbooks</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {actionList.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">›</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
