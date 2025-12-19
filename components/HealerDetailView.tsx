
import React, { useRef, useState } from 'react';
import { X, Play, Star, MapPin, Languages, Check, Video, Phone, MessageCircle, Heart, ChevronLeft } from 'lucide-react';
import { Healer } from '../types';

interface HealerDetailViewProps {
  healer: Healer;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onCall: (healer: Healer, type: 'VIDEO' | 'VOICE' | 'TEXT') => void;
}

const HealerDetailView: React.FC<HealerDetailViewProps> = ({ 
  healer, 
  isFavorite, 
  onClose, 
  onToggleFavorite, 
  onCall 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white dark:bg-slate-950 overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col max-w-md mx-auto h-full shadow-2xl">
      {/* Header Image/Video */}
      <div className="relative h-80 bg-slate-200 dark:bg-slate-900 flex-shrink-0">
        {healer.introVideo ? (
          <>
            <video 
              ref={videoRef}
              src={healer.introVideo}
              className="w-full h-full object-cover"
              loop
              playsInline
            />
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform"
                >
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
              </div>
            )}
            <button 
              onClick={togglePlay}
              className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest border border-white/10"
            >
              {isPlaying ? 'Pause Intro' : 'Watch Journey'}
            </button>
          </>
        ) : (
          <img 
            src={healer.gallery[0] || healer.avatar} 
            className="w-full h-full object-cover" 
            alt={healer.name} 
          />
        )}
        
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => onToggleFavorite(healer.id)}
            className={`p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-colors ${isFavorite ? 'text-rose-500' : 'text-white'}`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 bg-white dark:bg-slate-950 rounded-t-3xl -mt-6 relative z-10 px-6 pt-8 pb-32">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{healer.name}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{healer.specialty}</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-2xl text-center border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center gap-1 text-amber-500 justify-center">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-bold">{healer.rating.toFixed(1)}</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{healer.reviewsCount} Soul Connections</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <MapPin size={16} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Origin</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{healer.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
              <Languages size={16} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Languages</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{healer.languages[0]}+</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Healing Journey</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {healer.fullBio}
          </p>
        </section>

        {/* Categories Section */}
        <div className="flex flex-wrap gap-2 mb-8">
          {healer.categories.map(cat => (
            <span key={cat} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
              {cat}
            </span>
          ))}
        </div>

        {/* Gallery Section */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Healing Space</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {healer.gallery.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                className="w-48 h-32 object-cover rounded-2xl flex-shrink-0 shadow-sm"
                alt={`Healer space ${i+1}`}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 glass dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Exchange Rate</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">${healer.pricePerMinute.toFixed(2)}<span className="text-xs text-slate-400">/min</span></span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onCall(healer, 'TEXT')}
              className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
            >
              <MessageCircle size={24} />
            </button>
            <button 
              onClick={() => onCall(healer, 'VIDEO')}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Video size={20} />
              <span>Connect Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealerDetailView;
