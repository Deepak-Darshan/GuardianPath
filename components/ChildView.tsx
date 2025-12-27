
import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile, TimeRequest, AppActivity } from '../types';
import confetti from 'canvas-confetti';
import { simulateParentDecision } from '../geminiService';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ChildViewProps {
  child: ChildProfile;
  onSwitchToParent: () => void;
  onSendRequest: (req: TimeRequest) => void;
  onGrantExtraTime: (mins: number) => void;
}

export default function ChildView({ child, onSwitchToParent, onSendRequest, onGrantExtraTime }: ChildViewProps) {
  const [remainingSeconds, setRemainingSeconds] = useState((child.screenTimeLimitMinutes - child.totalScreenTimeMinutes) * 60);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState<any>(null);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [requestResult, setRequestResult] = useState<{ decision: string; message: string } | null>(null);

  // Form State
  const [reqMins, setReqMins] = useState(30);
  const [reqReason, setReqReason] = useState('');
  const [reqApp, setReqApp] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds(prev => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingRequest(true);
    const app = child.activities.find(a => a.id === reqApp);
    const req: TimeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      childId: child.id,
      requestedMinutes: reqMins,
      reason: reqReason,
      appId: reqApp,
      appName: app?.name,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    onSendRequest(req);
    
    // Simulate Parent AI Response
    const result = await simulateParentDecision(child, req);
    setRequestResult(result);
    setIsProcessingRequest(false);

    if (result.decision === 'approved') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      onGrantExtraTime(reqMins);
      setRemainingSeconds(prev => prev + reqMins * 60);
    }
  };

  const getTimerColor = () => {
    if (remainingSeconds < 300) return 'from-red-600 to-rose-700';
    if (remainingSeconds < 900) return 'from-orange-500 to-amber-600';
    return 'from-indigo-600 to-violet-700';
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col p-4 md:p-8 text-white bg-gradient-to-br ${getTimerColor()}`}>
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={child.photoUrl} alt={child.name} className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] border-4 border-white/20 shadow-2xl object-cover" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-indigo-600 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Hi, {child.name}! 👋</h1>
            <p className="text-indigo-100/70 text-sm font-medium">You're doing great today!</p>
          </div>
        </div>
        <button 
          onClick={onSwitchToParent}
          className="bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl transition-all border border-white/10 backdrop-blur-xl flex items-center gap-2 font-bold"
        >
          <span>🔐</span> Parent Zone
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full space-y-8 pb-20">
        
        {/* TIMER CARD */}
        <section className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl text-slate-900 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.71L11 12.41V7h2v4.59l3.71 3.71-1.42 1.41z"/></svg>
          </div>
          
          <div className="text-center relative z-10">
            <h2 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">Time Remaining Today</h2>
            <div className={`text-6xl md:text-8xl font-black mb-8 font-mono tracking-tighter ${remainingSeconds < 300 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>
              {formatTime(remainingSeconds)}
            </div>
            
            <div className="w-full bg-slate-100 h-8 rounded-full overflow-hidden mb-8 relative border border-slate-100 shadow-inner">
               <div 
                 className={`h-full transition-all duration-1000 ease-out shadow-lg ${remainingSeconds < 300 ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`}
                 style={{ width: `${Math.min((remainingSeconds / (child.screenTimeLimitMinutes * 60)) * 100, 100)}%` }}
               />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95 text-lg"
              >
                Request More Time ⚡
              </button>
              <button 
                onClick={() => setShowActivityLog(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-5 rounded-3xl font-black transition-all active:scale-95 text-lg"
              >
                My Activity 📊
              </button>
            </div>
          </div>
        </section>

        {/* GOALS & ACHIEVEMENTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/20 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
               <div className="p-4 bg-yellow-400 rounded-2xl text-2xl shadow-lg shadow-yellow-500/30">🏆</div>
               <h3 className="font-black text-2xl">Unlocked Badges</h3>
             </div>
             <div className="flex flex-wrap gap-4">
               {child.achievements.map(a => (
                 <button 
                   key={a.id} 
                   onClick={() => {
                     setShowAchievementModal(a);
                     if(a.unlocked) confetti();
                   }}
                   className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-90 ${a.unlocked ? 'bg-white shadow-xl' : 'bg-black/20 opacity-40 grayscale'}`}
                 >
                   {a.icon}
                 </button>
               ))}
             </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/20 shadow-xl">
             <div className="flex items-center gap-4 mb-6">
               <div className="p-4 bg-indigo-400 rounded-2xl text-2xl shadow-lg shadow-indigo-500/30">🎯</div>
               <h3 className="font-black text-2xl">Power-Up Goal</h3>
             </div>
             {child.goals.map(goal => (
               <div key={goal.id} className="space-y-4">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="font-black text-xl">{goal.title}</p>
                     <p className="text-indigo-100/70 text-sm">{goal.requirement}</p>
                   </div>
                   <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">+{goal.reward}</div>
                 </div>
                 <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${goal.progress}%` }} />
                 </div>
                 <p className="text-xs font-bold text-right uppercase tracking-widest">{goal.progress}% Complete</p>
               </div>
             ))}
          </div>
        </section>
      </main>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 md:p-12 text-slate-900 shadow-2xl relative overflow-hidden">
             {!requestResult ? (
               <>
                 <button onClick={() => setShowRequestModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">✕</button>
                 <h2 className="text-3xl font-black mb-2 text-indigo-600">Request Extra Time</h2>
                 <p className="text-slate-500 mb-8 text-sm font-medium">Your request will be sent to your parents for review.</p>
                 
                 <form onSubmit={handleRequestSubmit} className="space-y-6">
                   <div>
                     <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-3">How much time?</label>
                     <div className="grid grid-cols-3 gap-3">
                       {[15, 30, 60].map(m => (
                         <button 
                           key={m} type="button" 
                           onClick={() => setReqMins(m)}
                           className={`py-3 rounded-2xl font-bold transition-all ${reqMins === m ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                         >
                           {m}m
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Which app?</label>
                     <select 
                       value={reqApp}
                       onChange={(e) => setReqApp(e.target.value)}
                       className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all"
                     >
                       <option value="">Any / General</option>
                       {child.activities.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
                     </select>
                   </div>

                   <div>
                     <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Why do you need it?</label>
                     <textarea 
                        value={reqReason}
                        onChange={(e) => setReqReason(e.target.value)}
                        placeholder="e.g., I'm finishing my homework project..."
                        className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all h-24 resize-none"
                        required
                     />
                   </div>

                   <button 
                     disabled={isProcessingRequest}
                     className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 text-lg"
                   >
                     {isProcessingRequest ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Request 🚀'}
                   </button>
                 </form>
               </>
             ) : (
               <div className="text-center py-10">
                 <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl mb-6 shadow-xl ${requestResult.decision === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {requestResult.decision === 'approved' ? '✅' : '🚫'}
                 </div>
                 <h3 className="text-3xl font-black mb-4 text-slate-900">
                   {requestResult.decision === 'approved' ? 'Approved!' : 'Parent says...'}
                 </h3>
                 <p className="text-slate-600 italic leading-relaxed mb-8 px-4">"{requestResult.message}"</p>
                 <button 
                   onClick={() => {
                     setShowRequestModal(false);
                     setRequestResult(null);
                     setReqReason('');
                   }}
                   className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black"
                 >
                   Okay!
                 </button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* ACTIVITY LOG MODAL */}
      {showActivityLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in zoom-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] p-10 text-slate-900 shadow-2xl flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-black text-indigo-600">My Daily Stats 📊</h2>
               <button onClick={() => setShowActivityLog(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-black">✕</button>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={child.activities}>
                     <XAxis dataKey="name" tick={{fontSize: 10}} />
                     <YAxis />
                     <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                     <Bar dataKey="timeSpentMinutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {child.activities.map(app => (
                   <div key={app.id} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                     <span className="text-3xl">{app.icon}</span>
                     <div>
                       <p className="font-bold text-sm">{app.name}</p>
                       <p className="text-xs text-slate-500">{app.timeSpentMinutes} mins today</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      )}

      {/* TIME'S UP OVERLAY */}
      {remainingSeconds <= 0 && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6 animate-in fade-in duration-700">
           <div className="text-center max-w-md">
             <div className="text-9xl mb-8 animate-bounce">😴</div>
             <h1 className="text-5xl font-black mb-4">Time's Up!</h1>
             <p className="text-indigo-200/70 text-lg mb-10 leading-relaxed">You've had a great day of screen time. It's time for a break to stretch, read a book, or play outside!</p>
             <div className="space-y-4">
                <button 
                  onClick={() => setShowRequestModal(true)}
                  className="w-full bg-white text-indigo-600 px-10 py-5 rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95"
                >
                  Request Extra Time 🚀
                </button>
                <button 
                  onClick={onSwitchToParent}
                  className="w-full bg-white/10 text-white px-10 py-5 rounded-3xl font-black text-xl border border-white/20 transition-all active:scale-95"
                >
                  Parent Login 🔐
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
