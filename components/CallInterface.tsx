
import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Send, MessageCircle, User, Loader2, X, Sparkles } from 'lucide-react';
import { Healer, SessionType } from '../types';
import { GeminiService } from '../services/geminiService';

interface CallInterfaceProps {
  healer: Healer;
  type: SessionType;
  onEnd: (cost: number) => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ healer, type, onEnd }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(type === SessionType.TEXT);
  const [messages, setMessages] = useState<{role: string, content: string, timestamp: number}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const gemini = useRef(new GeminiService());

  // Initialize Media Devices (Camera/Mic)
  useEffect(() => {
    const initMedia = async () => {
      try {
        const needsVideo = type === SessionType.VIDEO;
        const needsAudio = type === SessionType.VIDEO || type === SessionType.VOICE;

        if (needsVideo || needsAudio) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: needsVideo,
            audio: needsAudio
          });
          
          streamRef.current = stream;
          if (localVideoRef.current && needsVideo) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Failed to access media devices:", err);
      } finally {
        // Handshake delay
        setTimeout(async () => {
          setIsConnecting(false);
          // Get initial greeting from healer
          const greeting = await gemini.current.getInitialGreeting(healer.name, healer.specialty, healer.location);
          setMessages([{ 
            role: 'healer', 
            content: greeting, 
            timestamp: Date.now() 
          }]);
        }, 1500);
      }
    };

    initMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [type, healer.name, healer.specialty, healer.location]);

  // Session Duration Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isConnecting) setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isConnecting]);

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showChat]);

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    } else {
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = { role: 'user', content: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    const response = await gemini.current.generateHealerResponse(
      healer.name,
      healer.specialty,
      currentInput,
      messages.map(({ role, content }) => ({ role, content }))
    );
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'healer', 
      content: response, 
      timestamp: Date.now() 
    }]);
  };

  const handleEndCall = () => {
    const totalCost = (duration / 60) * healer.pricePerMinute;
    onEnd(totalCost);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col max-w-md mx-auto h-full overflow-hidden">
      {/* Connecting Overlay */}
      {isConnecting && (
        <div className="absolute inset-0 z-[110] bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping bg-indigo-500/20 rounded-full"></div>
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Syncing Universal Energy</h2>
          <p className="text-slate-400 text-sm">Securing your cross-border connection with {healer.name}...</p>
        </div>
      )}

      {/* Media Content Area */}
      <div className="relative flex-1 bg-slate-800 flex flex-col">
        {/* Main Remote View (Healer) or Placeholder for Text-only */}
        <div className="absolute inset-0 overflow-hidden">
          {type === SessionType.TEXT ? (
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 ring-4 ring-indigo-500/20">
                <img src={healer.avatar} className="w-full h-full object-cover" alt={healer.name} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{healer.name}</h3>
              <p className="text-indigo-400 text-sm font-medium mb-6">{healer.specialty}</p>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure Text Channel Active</span>
              </div>
            </div>
          ) : (
            <>
              <img 
                src={healer.avatar} 
                className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
                alt="Healer Video Feed"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40"></div>
            </>
          )}
          
          {!showChat && type !== SessionType.TEXT && (
            <div className="absolute bottom-10 left-6 text-white transition-opacity duration-300">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {healer.name}
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
              </h3>
              <p className="text-indigo-300 text-sm font-medium">{healer.specialty}</p>
            </div>
          )}
        </div>

        {/* Small Self View (User Camera) */}
        {type === SessionType.VIDEO && !showChat && (
          <div className="absolute top-6 right-6 w-28 h-40 bg-slate-700 rounded-2xl border border-white/10 overflow-hidden shadow-2xl ring-1 ring-white/20 z-10">
            {isVideoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                <User size={24} />
                <span className="text-[8px] mt-2 uppercase tracking-widest font-bold">Cam Off</span>
              </div>
            ) : (
              <video 
                ref={localVideoRef}
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
          </div>
        )}

        {/* Floating Timer */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <div className="glass dark:bg-slate-900/40 px-3 py-1.5 rounded-full flex items-center gap-2 border-white/20">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-white tracking-widest">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Chat Overlay / Main Content for Text Sessions */}
        {showChat && (
          <div className={`absolute inset-0 flex flex-col transition-all z-20 ${type === SessionType.TEXT ? 'bg-slate-950' : 'bg-slate-950/90'}`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-500/30">
                  <img src={healer.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">{healer.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              {type !== SessionType.TEXT && (
                <button onClick={() => setShowChat(false)} className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-900/20 text-indigo-400 rounded-full border border-indigo-800/30 text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles size={10} />
                  Healing Session Started
                </div>
                <p className="text-[10px] text-slate-600 mt-2">All messages are private and cross-border encrypted.</p>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-white/5 px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-slate-900/50 backdrop-blur-md flex gap-2 border-t border-white/5">
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Share your heart..."
                className="flex-1 bg-slate-800 text-white text-sm px-4 py-3 rounded-2xl focus:outline-none border border-white/5 placeholder:text-slate-600"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-slate-950 px-8 py-8 flex justify-between items-center border-t border-white/5 relative z-30">
        <button 
          onClick={toggleMute}
          className={`p-4 rounded-2xl transition-all transform active:scale-95 ${isMuted ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white shadow-lg'}`}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        
        <button 
          onClick={handleEndCall}
          className="p-5 rounded-3xl bg-red-600 text-white shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:bg-red-700 transform hover:scale-110 active:scale-90 transition-all group"
        >
          <PhoneOff size={28} className="group-hover:rotate-12 transition-transform" />
        </button>

        {type === SessionType.VIDEO ? (
          <button 
            onClick={toggleVideo}
            className={`p-4 rounded-2xl transition-all transform active:scale-95 ${isVideoOff ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white shadow-lg'}`}
          >
            {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
          </button>
        ) : (
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-2xl transition-all transform active:scale-95 ${showChat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 shadow-lg'}`}
          >
            <MessageCircle size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CallInterface;
