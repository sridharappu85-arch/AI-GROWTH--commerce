import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../utils/api';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: {
    itemsCount: number;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    items: Array<{
      productId: string;
      title: string;
      price: number;
      quantity: number;
      imageUrl: string;
    }>;
  };
  shippingAddress: string;
  onConfirmOrder: (shippingAddress: string) => Promise<any>;
  onOrderSuccess: (order: any) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderSummary,
  shippingAddress,
  onConfirmOrder,
  onOrderSuccess
}) => {
  const [confirmedByUser, setConfirmedByUser] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!confirmedByUser) {
      setError('Please check the confirmation box to authorize order placement.');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      const result = await onConfirmOrder(shippingAddress);
      
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch { /* ignore */ }

      onOrderSuccess(result.order);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to place simulated order.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Safety Header */}
        <div className="p-5 border-b border-white/10 bg-indigo-950/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-cyan-400 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Human-In-The-Loop Order Confirmation
            </h3>
            <p className="text-xs text-indigo-300">
              Agentic safeguards require explicit approval before finalizing orders
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Notice Alert */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-cyan-300">Simulated Commerce Transaction</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                No real financial charges will occur. This step simulates an autonomous agent ordering flow with human sign-off.
              </p>
            </div>
          </div>

          {/* Items Summary Preview */}
          <div className="space-y-2">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Order Items ({orderSummary.itemsCount})
            </div>
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {orderSummary.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-9 h-9 rounded-md object-cover bg-slate-900 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate text-xs">{item.title}</p>
                      <p className="text-slate-400 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-slate-200 font-semibold flex-shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-200">{formatINR(orderSummary.subtotal)}</span>
            </div>
            {orderSummary.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>AI Assistant Privilege Discount (5%)</span>
                <span>-{formatINR(orderSummary.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Estimated GST (18%)</span>
              <span className="text-slate-200">{formatINR(orderSummary.tax)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Express Delivery</span>
              <span className="text-emerald-400 font-medium">Free</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-cyan-400">{formatINR(orderSummary.total)}</span>
            </div>
          </div>

          {/* Shipping destination */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
            <span>Shipping to:</span>
            <span className="text-slate-200 font-medium">{shippingAddress}</span>
          </div>

          {/* User Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-indigo-500/30 cursor-pointer hover:bg-slate-800 transition">
            <input
              type="checkbox"
              checked={confirmedByUser}
              onChange={(e) => setConfirmedByUser(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900 border-white/20"
            />
            <span className="text-slate-200 text-xs leading-relaxed">
              I have reviewed the items and total of <strong>{formatINR(orderSummary.total)}</strong>. I explicitly authorize the AI agent to finalize this order.
            </span>
          </label>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing || !confirmedByUser}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {processing ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
