import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { apiRequest, formatINR } from '../../utils/api';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/admin/customers');
        setCustomers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading customer directory...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Customer Directory & Lifetime Value Profiles</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {customers.length} profiles
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed customer personas, order frequency, and AI-assisted purchase propensity
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Persona Tag</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Total Orders</th>
                <th className="p-4 font-semibold">AI Orders</th>
                <th className="p-4 font-semibold">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
                      />
                      <div>
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium">
                      {c.personaTag}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    {c.location}
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {c.orderCount} orders
                  </td>
                  <td className="p-4">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{c.aiOrdersCount}</span>
                    </span>
                  </td>
                  <td className="p-4 font-bold text-emerald-400">
                    {formatINR(c.totalSpend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
