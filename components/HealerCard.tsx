
import React from 'react';
import { Star, Video, Phone, MessageCircle, Heart, MapPin, Languages, ChevronRight } from 'lucide-react';
import { Healer } from '../types';

interface HealerCardProps {
  healer: Healer;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCall: (healer: Healer, type: 'VIDEO' | 'VOICE' | 'TEXT') => void;
  onViewProfile: (healer: Healer) => void;
}

const HealerCard: React.FC<HealerCardProps> = ({ healer, isFavorite, onToggleFavorite, onCall, onViewProfile }) => {
  return (
    <div 
      onClick={() => onViewProfile(healer)}
      className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4 hover:shadow-md transition-all relative cursor-pointer group"
    >
      <div className="flex gap-4">
        <div className="relative">
          <img 
            src={healer.avatar} 
            alt={healer.name} 
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-50 dark:ring-slate-800"
          />
          {healer.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {healer.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-slate-400 dark:text-slate-600" />
                <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">{healer.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(healer.id);
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  isFavorite 
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' 
                    : 'text-slate-300 dark:text-slate-700 hover:text-slate-400 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{healer.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1 mb-1">{healer.specialty}</p>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
              <Languages size={10} className="text-slate-400 dark:text-slate-600" />
              <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">{healer.languages.join(', ')}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {healer.bio}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tighter">Universal Rate</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">${healer.pricePerMinute.toFixed(2)}<span className="text-[10px] text-slate-400 dark:text-slate-600">/min</span></span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onCall(healer, 'TEXT');
            }}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <MessageCircle size={18} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onCall(healer, 'VIDEO');
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none font-bold text-xs flex items-center gap-2"
          >
            <Video size={16} />
            <span>Connect</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealerCard;
