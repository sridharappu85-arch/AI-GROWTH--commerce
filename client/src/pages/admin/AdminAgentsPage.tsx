import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bot, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw 
} from 'lucide-react';
import { AgentLog } from '../../types';
import { apiRequest } from '../../utils/api';

export const AdminAgentsPage: React.FC = () => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<Record<string, boolean>>({});
  
  // Provider status & Key configuration
  const [providerStatus, setProviderStatus] = useState<any>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSettingKey, setIsSettingKey] = useState(false);
  const [keyMessage, setKeyMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/agents/logs');
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderStatus = async () => {
    try {
      const status = await apiRequest('/agents/provider-status');
      setProviderStatus(status);
    } catch (e) {
      console.error('Failed to fetch provider status', e);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchProviderStatus();
  }, []);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    try {
      setIsSettingKey(true);
      setKeyMessage(null);
      const res = await apiRequest('/agents/set-key', {
        method: 'POST',
        body: JSON.stringify({ apiKey: apiKeyInput.trim() })
      });
      setKeyMessage(res.message || 'Key saved successfully');
      setApiKeyInput('');
      fetchProviderStatus();
    } catch (err: any) {
      setKeyMessage(err.message || 'Failed to save API key');
    } finally {
      setIsSettingKey(false);
    }
  };

  const getAgentBadge = (agent: string) => {
    switch (agent) {
      case 'ShoppingAgent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Bot className="w-3 h-3 text-indigo-400" />
            <span>ShoppingAgent</span>
          </span>
        );
      case 'GrowthAgent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>GrowthAgent</span>
          </span>
        );
      case 'MarketingAgent':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>MarketingAgent</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>RecommendationAgent</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Autonomous Agent Observability & Audit Log</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Telemetry Stream
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Full audit trail of intent parsing, tool execution permissions, reasoning traces, and latency benchmarks
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* AI Engine & OpenAI Configuration Card */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Active AI Engine Architecture</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  providerStatus?.hasOpenAIKey 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {providerStatus?.provider || 'Deterministic & Neural Hybrid'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {providerStatus?.hasOpenAIKey 
                  ? '⚡ OpenAI GPT-4o-mini is active for natural reasoning, campaign generation & intent discovery.' 
                  : '🛡️ Running on built-in Deterministic Vector Scoring engine (Zero API cost & 100% offline capable).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">Engine Status: HEALTHY</span>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSaveApiKey} className="pt-2 flex flex-col sm:flex-row items-center gap-3 border-t border-white/5">
          <div className="flex-1 w-full relative">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste OpenAI API Key (sk-...)"
              className="w-full pl-4 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={isSettingKey || !apiKeyInput.trim()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSettingKey ? 'Connecting...' : 'Set / Update OpenAI Key'}</span>
          </button>
        </form>

        {keyMessage && (
          <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-cyan-300 font-mono">
            {keyMessage}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">
          Loading agent execution logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center text-slate-400 text-xs">
          No agent activity recorded yet. Run a search or comparison in the Shopping Assistant!
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const isExpanded = expandedLog[log.id];
            return (
              <div
                key={log.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 hover:border-indigo-500/30 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {getAgentBadge(log.agentName)}
                    <span className="text-xs font-bold text-white font-mono">
                      Tool: <span className="text-cyan-400">{log.toolInvoked || 'N/A'}</span>
                    </span>
                    {log.user && (
                      <span className="text-xs text-slate-400">
                        User: <strong className="text-slate-200">{log.user.name}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{log.executionTimeMs}ms</span>
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Success</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* User Query Prompt */}
                <div className="text-xs text-slate-300">
                  <span className="text-slate-500 font-semibold">Query / Trigger: </span>
                  <span className="text-indigo-200 font-medium">"{log.userQuery}"</span>
                </div>

                {/* Output Summary */}
                <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">Output Summary</span>
                  <span>{log.outputSummary}</span>
                </div>

                {/* Reasoning Chain Collapsible */}
                {log.reasoningSteps && log.reasoningSteps.length > 0 && (
                  <div className="border-t border-white/5 pt-2">
                    <button
                      onClick={() => setExpandedLog(prev => ({ ...prev, [log.id]: !isExpanded }))}
                      className="text-indigo-400 hover:text-indigo-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <span>Reasoning Trace ({log.reasoningSteps.length} steps)</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-[11px] font-mono text-slate-300">
                        {log.reasoningSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400">›</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
