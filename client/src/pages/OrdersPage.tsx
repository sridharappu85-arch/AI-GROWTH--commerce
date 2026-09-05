import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Truck 
} from 'lucide-react';
import type { Order } from '../types';
import { apiRequest, formatINR } from '../utils/api';
import { useUser } from '../contexts/UserContext';

export const OrdersPage: React.FC = () => {
  const { currentUser } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/orders');
        setOrders(data);
      } catch (e) {
        console.error('Failed to load orders:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>In Transit / Shipped</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Order History & Deliveries</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {orders.length} orders
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track previous purchases, AI-assisted transactions, and fulfillment status
          </p>
        </div>

        <Link
          to="/products"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
        >
          New Purchase
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-base font-bold text-white">No Orders Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't placed any simulated orders yet. Try asking our Shopping Assistant to build an order!
          </p>
          <Link
            to="/assistant"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Launch Shopping Assistant
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-4"
            >
              {/* Order Card Header */}
              <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-mono">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {order.isAiAssisted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI-Assisted</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{order.shippingAddress}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-white">
                    {formatINR(order.finalAmount)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {order.items.length} item(s) • {order.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-4 sm:p-5 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.productId}`}
                          className="text-xs font-semibold text-white hover:text-indigo-300 transition truncate block"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-slate-400">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-200">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}

                {/* AI Agent Summary Note */}
                {order.agentSummary && (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cyan-300">Agent Note:</span> {order.agentSummary}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
