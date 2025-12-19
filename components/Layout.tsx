
import React from 'react';
import { Home, Search, MessageSquare, User, CreditCard, Globe, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  walletBalance: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  walletBalance,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 transition-colors relative shadow-2xl overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass dark:bg-slate-900/80 px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            SoulStream
          </h1>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
              <Globe size={18} />
            </button>
            <button 
              onClick={onToggleDarkMode}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800 transition-colors">
          <CreditCard size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">${walletBalance.toFixed(2)}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-50">
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <Search size={22} />
          <span className="text-[10px] font-medium">Global</span>
        </button>
        <button 
          onClick={() => onTabChange('sessions')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'sessions' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <MessageSquare size={22} />
          <span className="text-[10px] font-medium">Chat</span>
        </button>
        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}
        >
          <User size={22} />
          <span className="text-[10px] font-medium">Me</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
