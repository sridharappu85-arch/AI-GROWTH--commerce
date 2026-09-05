import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  ArrowUpRight, 
  Percent, 
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { apiRequest, formatINR } from '../../utils/api';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [m, c, ins] = await Promise.all([
          apiRequest('/admin/metrics'),
          apiRequest('/admin/charts'),
          apiRequest('/admin/insights')
        ]);
        setMetrics(m);
        setCharts(c);
        setInsights(ins);
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading executive business intelligence telemetry...
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Revenue',
      value: formatINR(metrics?.totalRevenue || 0),
      subtitle: '+24.6% vs last quarter',
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      color: 'emerald'
    },
    {
      title: 'Total Orders',
      value: metrics?.totalOrders || 0,
      subtitle: `${metrics?.aiAssistedOrdersCount || 0} assisted by AI`,
      icon: <ShoppingBag className="w-5 h-5 text-indigo-400" />,
      color: 'indigo'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics?.conversionRate || 4.8}%`,
      subtitle: 'Baseline: 2.1% (Traditional)',
      icon: <Percent className="w-5 h-5 text-cyan-400" />,
      color: 'cyan'
    },
    {
      title: 'Active Customers',
      value: metrics?.activeCustomers || 0,
      subtitle: '100% active cohort tracking',
      icon: <Users className="w-5 h-5 text-violet-400" />,
      color: 'violet'
    },
    {
      title: 'Customer Lifetime Value',
      value: formatINR(metrics?.customerLifetimeValue || 0),
      subtitle: 'Predicted CLV: ₹1,85,000',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      color: 'emerald'
    },
    {
      title: 'AI-Assisted Purchases',
      value: `${metrics?.aiAssistedPurchasesPercent || 0}%`,
      subtitle: `${metrics?.aiAssistedOrdersCount || 0} of ${metrics?.totalOrders || 0} orders`,
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      color: 'cyan'
    },
    {
      title: 'Agent Conversion Rate',
      value: `${metrics?.agentConversionRate || 7.2}%`,
      subtitle: '+3.4x vs catalog direct',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-400" />,
      color: 'purple'
    },
    {
      title: 'Average Order Value (AOV)',
      value: formatINR(metrics?.averageOrderValue || 0),
      subtitle: '+18.4% with cross-sell prompt',
      icon: <BarChart3 className="w-5 h-5 text-amber-400" />,
      color: 'amber'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Executive Business Intelligence Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics on revenue velocity, conversion funnels, and autonomous agent performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/insights"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI Growth Insights ({insights.length})</span>
          </Link>
          <Link
            to="/admin/campaigns"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campaign Studio</span>
          </Link>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{card.title}</span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                {card.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {card.value}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">↑</span>
              <span>{card.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section 1: Revenue over Time & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Revenue & Orders Over Time
              </h2>
              <p className="text-xs text-slate-400">
                Weekly GMV in Indian Rupees (₹) with AI-Assisted order proportion
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                <span>Revenue (₹)</span>
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
                <span>AI-Assisted</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [formatINR(Number(value)), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Conversion Funnel
            </h2>
            <p className="text-xs text-slate-400">
              Drop-off telemetry from impressions to simulated checkout
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {charts?.conversionFunnel?.map((stage: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[170px]">{stage.stage}</span>
                  <span className="text-cyan-400 font-bold">{stage.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  {stage.visitors.toLocaleString()} visitors
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section 2: Category Performance & Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Revenue Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Product Category Revenue (₹ INR)
            </h2>
            <p className="text-xs text-slate-400">
              Sales performance aggregated across major hardware divisions
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.categoryPerformance || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  type="number" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  width={130} 
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [formatINR(Number(val)), 'Total Revenue']}
                />
                <Bar dataKey="revenue" fill="#38bdf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Agent Telemetry Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Autonomous Agent Activity Distribution
            </h2>
            <p className="text-xs text-slate-400">
              Tool executions and reasoning invocations logged by agent type
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.agentBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [val, 'Invocations']}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Growth Insights Preview Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                AI Growth Insights & Autonomous Recommendations
              </h2>
              <p className="text-xs text-slate-400">
                Actionable opportunities synthesized by the Growth Agent
              </p>
            </div>
          </div>

          <Link
            to="/admin/insights"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>View All ({insights.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.slice(0, 3).map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {ins.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ins.impactLevel === 'CRITICAL' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {ins.impactLevel}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-2">
                  {ins.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {ins.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-cyan-300 font-semibold">{ins.estimatedImpactValue}</span>
                <span className="text-slate-400 font-mono">{ins.metricHighlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
