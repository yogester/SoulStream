
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import HealerCard from './components/HealerCard';
import HealerDetailView from './components/HealerDetailView';
import CallInterface from './components/CallInterface';
import BillingModal from './components/BillingModal';
import { Healer, UserRole, SessionType, Review, Transaction, TransactionType } from './types';
import { MOCK_HEALERS, CATEGORIES, GLOBAL_STATS } from './constants';
import { 
  Search, Bell, Filter, ChevronRight, Wallet, User as UserIcon, LogOut, 
  CheckCircle, CreditCard, MessageSquare, Star, Heart, Activity, Globe, 
  ArrowUpRight, ArrowDownLeft, Clock, Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [walletBalance, setWalletBalance] = useState(150.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeHealer, setActiveHealer] = useState<Healer | null>(null);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [selectedHealerDetail, setSelectedHealerDetail] = useState<Healer | null>(null);
  const [showCallSummary, setShowCallSummary] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [lastCost, setLastCost] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Theme state with improved initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('soulstream_theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('soulstream_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('soulstream_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Favorites persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('soulstream_favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('soulstream_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };
  
  // Review database
  const [healerReviews, setHealerReviews] = useState<Record<string, Review[]>>({});
  const [lastFinishedHealer, setLastFinishedHealer] = useState<Healer | null>(null);
  
  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  // Calculate dynamic ratings
  const healersWithUpdatedRatings = useMemo(() => {
    return MOCK_HEALERS.map(h => {
      const reviews = healerReviews[h.id] || [];
      if (reviews.length === 0) return h;

      const totalRating = (h.rating * h.reviewsCount) + reviews.reduce((acc, r) => acc + r.rating, 0);
      const totalCount = h.reviewsCount + reviews.length;
      return {
        ...h,
        rating: totalRating / totalCount,
        reviewsCount: totalCount
      };
    });
  }, [healerReviews]);

  const filteredHealers = healersWithUpdatedRatings.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         h.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         h.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || h.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const favoriteHealers = healersWithUpdatedRatings.filter(h => favorites.includes(h.id));
  const onlineCount = filteredHealers.filter(h => h.isOnline).length;

  const handleStartCall = (healer: Healer, type: string) => {
    setActiveHealer(healer);
    setSessionType(type as SessionType);
    setSelectedHealerDetail(null);
  };

  const handleEndCall = (cost: number) => {
    const finalCost = parseFloat(cost.toFixed(2));
    setWalletBalance(prev => Math.max(0, prev - finalCost));
    setLastCost(finalCost);
    setLastFinishedHealer(activeHealer);
    
    // Add to transaction ledger
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      amount: finalCost,
      type: TransactionType.DEBIT,
      description: `Session with ${activeHealer?.name}`,
      healerName: activeHealer?.name,
      timestamp: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev]);

    setActiveHealer(null);
    setSessionType(null);
    setShowCallSummary(true);
    setRatingInput(5);
    setCommentInput('');
  };

  const handleAddFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      amount: amount,
      type: TransactionType.CREDIT,
      description: 'Wallet Top Up',
      timestamp: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleSubmitReview = () => {
    if (!lastFinishedHealer) return;
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'alex_thompson',
      rating: ratingInput,
      comment: commentInput,
      timestamp: Date.now()
    };
    setHealerReviews(prev => ({
      ...prev,
      [lastFinishedHealer.id]: [...(prev[lastFinishedHealer.id] || []), newReview]
    }));
    setShowCallSummary(false);
  };

  const renderHome = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Global Healing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Universal connections, worldwide peace.</p>
        </div>
        <button className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative group overflow-hidden transition-colors">
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <Bell size={20} className="text-slate-600 dark:text-slate-300" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-5 mb-8 text-white shadow-xl shadow-indigo-100 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Globe size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-indigo-200 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Live Universal Energy Pulse</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xl font-bold">{GLOBAL_STATS.activeSessions}</p>
              <p className="text-[10px] text-indigo-100 font-medium">Active Sessions</p>
            </div>
            <div>
              <p className="text-xl font-bold">{GLOBAL_STATS.countriesOnline}</p>
              <p className="text-[10px] text-indigo-100 font-medium">Nations Live</p>
            </div>
            <div>
              <p className="text-xl font-bold">12</p>
              <p className="text-[10px] text-indigo-100 font-medium">Timezones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search world-class healers..." 
          className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 dark:text-slate-100 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Filter size={16} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-indigo-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Global Directory</h3>
          {onlineCount > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg border border-green-100 dark:border-green-800">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">{onlineCount} Online Now</span>
            </div>
          )}
        </div>
        {filteredHealers.length > 0 ? (
          filteredHealers.map(healer => (
            <HealerCard 
              key={healer.id} 
              healer={healer} 
              isFavorite={favorites.includes(healer.id)}
              onToggleFavorite={toggleFavorite}
              onCall={handleStartCall}
              onViewProfile={setSelectedHealerDetail}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No cross-border connections found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 mx-auto p-1 mb-4 shadow-lg">
          <img src="https://picsum.photos/seed/user/200" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Alex Thompson</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Universal Citizen | Joined Feb 2024</p>
      </div>

      <div className="space-y-3 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available Energy</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">${walletBalance.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowBilling(true)}
            className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Session Exchanges</h3>
          </div>
          <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">View Ledger</button>
        </div>
        <div className="space-y-2">
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === TransactionType.CREDIT ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                    {tx.type === TransactionType.CREDIT ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{tx.description}</p>
                    <p className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <p className={`text-sm font-bold ${tx.type === TransactionType.CREDIT ? 'text-green-500' : 'text-slate-800 dark:text-slate-100'}`}>
                  {tx.type === TransactionType.CREDIT ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
              <p className="text-xs text-slate-400">No energy exchanges logged yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-1">
        <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account Harmony</h3>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <UserIcon size={18} />
            <span>Profile Settings</span>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>
        <button onClick={() => setShowBilling(true)} className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
            <CreditCard size={18} />
            <span>Billing & Payments</span>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl transition-colors text-left">
          <div className="flex items-center gap-3 font-medium">
            <LogOut size={18} />
            <span>Leave SoulStream</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        walletBalance={walletBalance}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      >
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderHome()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'sessions' && (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <MessageSquare size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Universal Inboxes</h3>
            <p className="text-sm text-slate-400 mt-2">Connecting you with wisdom from all corners of the Earth.</p>
          </div>
        )}
      </Layout>

      {/* Payment Processing Modal */}
      {showBilling && (
        <BillingModal 
          onClose={() => setShowBilling(false)} 
          onSuccess={handleAddFunds}
        />
      )}

      {/* Healer Expanded Detail View */}
      {selectedHealerDetail && (
        <HealerDetailView 
          healer={selectedHealerDetail}
          isFavorite={favorites.includes(selectedHealerDetail.id)}
          onClose={() => setSelectedHealerDetail(null)}
          onToggleFavorite={toggleFavorite}
          onCall={handleStartCall}
        />
      )}

      {/* Full Screen Call UI */}
      {activeHealer && sessionType && (
        <CallInterface 
          healer={activeHealer} 
          type={sessionType} 
          onEnd={handleEndCall} 
        />
      )}

      {/* Call Summary Modal */}
      {showCallSummary && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-300 border dark:border-slate-800">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Energy Exchanged</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Your connection with {lastFinishedHealer?.name} has concluded.</p>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 mb-8 text-left border dark:border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Exchange Value</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">${lastCost.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mb-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">New Balance</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${walletBalance.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 text-left">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Seal this experience</h4>
              <div className="flex gap-2 mb-6 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRatingInput(star)} className="transition-transform active:scale-90">
                    <Star size={36} className={star <= ratingInput ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"} />
                  </button>
                ))}
              </div>
              <textarea 
                placeholder="Briefly describe the shift you felt..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full p-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24 resize-none mb-6 dark:text-slate-200"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleSubmitReview}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Complete Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
