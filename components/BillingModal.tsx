
import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, ChevronRight, Loader2, CheckCircle2, Zap, Sparkles } from 'lucide-react';

interface BillingModalProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const BILLING_PLANS = [
  { id: 'p1', amount: 20, label: 'Standard Pack', bonus: 0, icon: <Zap className="text-blue-500" /> },
  { id: 'p2', amount: 50, label: 'Wisdom Pack', bonus: 5, icon: <Sparkles className="text-indigo-500" />, popular: true },
  { id: 'p3', amount: 100, label: 'Healing Pack', bonus: 15, icon: <ShieldCheck className="text-purple-500" /> },
  { id: 'p4', amount: 250, label: 'Mastery Pack', bonus: 50, icon: <ShieldCheck className="text-amber-500" /> },
];

const BillingModal: React.FC<BillingModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [selectedPlan, setSelectedPlan] = useState(BILLING_PLANS[1]);

  const handlePurchase = () => {
    setStep('processing');
    // Simulate payment gateway delay
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleFinish = () => {
    onSuccess(selectedPlan.amount + selectedPlan.bonus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/20 dark:border-slate-800">
        
        {step === 'selection' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Top Up Wallet</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              {BILLING_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left relative overflow-hidden ${
                    selectedPlan.id === plan.id 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-widest">
                      Best Value
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      {plan.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 leading-none">{plan.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        Add ${plan.amount}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${plan.amount}</p>
                    {plan.bonus > 0 && (
                      <p className="text-[10px] font-bold text-green-500">+$ {plan.bonus} Free</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-slate-100 dark:border-slate-700">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">Secure Global Processing</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">Your payment is handled via encrypted cross-border nodes for maximum security.</p>
              </div>
            </div>

            <button 
              onClick={handlePurchase}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              <span>Purchase Energy Credits</span>
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-ping bg-indigo-500/20 rounded-full"></div>
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Syncing with Banks</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Verifying your universal exchange. Please do not close the app.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Wallet Refilled!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Your wallet has been topped up with <span className="text-indigo-600 dark:text-indigo-400 font-bold">${selectedPlan.amount + selectedPlan.bonus}</span>.
              Continue your healing journey.
            </p>
            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingModal;
