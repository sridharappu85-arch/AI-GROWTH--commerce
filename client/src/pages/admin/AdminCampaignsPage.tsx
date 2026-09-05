import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Sparkles 
} from 'lucide-react';
import type { MarketingCampaign, CustomerSegment } from '../../types';
import { apiRequest, formatINR } from '../../utils/api';

export const AdminCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);

  // Generator form
  const [targetSegmentId, setTargetSegmentId] = useState('');
  const [objective, setObjective] = useState('Developer Productivity Bundle Cross-Sell');
  const [channel, setChannel] = useState<'EMAIL' | 'WHATSAPP' | 'PUSH' | 'ADS'>('EMAIL');
  const [budget, setBudget] = useState(25000);
  const [generating, setGenerating] = useState(false);
  const [newlyCreated, setNewlyCreated] = useState<MarketingCampaign | null>(null);

  const fetchCampaignsAndSegments = async () => {
    try {
      setLoading(true);
      const [c, s] = await Promise.all([
        apiRequest('/admin/campaigns'),
        apiRequest('/admin/segments')
      ]);
      setCampaigns(c);
      setSegments(s);
      if (s.length > 0 && !targetSegmentId) {
        setTargetSegmentId(s[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsAndSegments();
  }, []);

  const handleGenerateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const campaign = await apiRequest('/agents/generate-campaign', {
        method: 'POST',
        body: JSON.stringify({
          segmentId: targetSegmentId,
          objective,
          channel,
          budget
        })
      });
      setNewlyCreated(campaign);
      await fetchCampaignsAndSegments();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading campaign studio...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>AI Marketing Campaign Studio</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Autonomous Copy & Targeting</span>
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Synthesize personalized ad copy, select target segments, and forecast campaign ROI with the Marketing Agent
        </p>
      </div>

      {/* Generator Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Campaign Generator Configuration */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              1-Click AI Campaign Generator
            </h2>
          </div>

          <form onSubmit={handleGenerateCampaign} className="space-y-4 text-xs">
            {/* Target Segment */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Target Customer Segment</label>
              <select
                value={targetSegmentId}
                onChange={(e) => setTargetSegmentId(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              >
                {segments.map((seg) => (
                  <option key={seg.id} value={seg.id}>
                    {seg.name} ({seg.customerCount} customers)
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Objective */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Campaign Objective / Angle</label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Student No-Cost EMI Push, Cart Recovery..."
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Channel */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Distribution Channel</label>
              <div className="grid grid-cols-2 gap-2">
                {(['EMAIL', 'WHATSAPP', 'PUSH', 'ADS'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition cursor-pointer ${
                      channel === ch
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Allocated Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-300 font-medium">Allocated Budget</label>
                <span className="text-cyan-400 font-bold">{formatINR(budget)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="80000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generating ? (
                <span>Synthesizing Copy...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Campaign with AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Live Generated Campaign Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Generated Copy & Target Preview</span>
              </h2>
              {newlyCreated && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Generated
                </span>
              )}
            </div>

            {newlyCreated ? (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400">
                    Channel: {newlyCreated.channel} • Predicted CR: {newlyCreated.predictedConversion}%
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {newlyCreated.generatedHeadline}
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
                  {newlyCreated.generatedCopy}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                    CTA: {newlyCreated.cta}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Target Budget: {formatINR(newlyCreated.budget)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center space-y-2 text-xs text-slate-400">
                <p>Configure options on the left and click "Generate Campaign with AI" to synthesize high-converting copy.</p>
                <p className="text-[11px] text-slate-500">The Marketing Agent customizes the value proposition to match the audience segment's behavioral triggers.</p>
              </div>
            )}
          </div>

          {/* Active Campaigns Table */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight">
              Active Campaigns & Performance Telemetry
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3 font-semibold">Campaign Name</th>
                    <th className="pb-3 font-semibold">Channel</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Predicted CR</th>
                    <th className="pb-3 font-semibold">Budget</th>
                    <th className="pb-3 font-semibold">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="py-3 font-medium text-white max-w-[200px] truncate">
                        {c.name}
                      </td>
                      <td className="py-3 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold">
                          {c.channel}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 text-cyan-400 font-semibold font-mono">
                        {c.predictedConversion}%
                      </td>
                      <td className="py-3 text-slate-300">
                        {formatINR(c.budget)}
                      </td>
                      <td className="py-3 font-bold text-emerald-400">
                        {formatINR(c.revenueGenerated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
