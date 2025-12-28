
import React, { useState, useEffect } from 'react';
import { ChildProfile, Alert, FilterLevel } from '../types';
import ActivityChart from './ActivityChart';
import AppControl from './AppControl';
import LocationMap from './LocationMap';
import WebFiltering from './WebFiltering';
import { getSmartInsights } from '../geminiService';
import { supabaseService } from '../services/supabaseService';

interface ParentDashboardProps {
  child: ChildProfile | null;
  children: ChildProfile[];
  alerts: Alert[];
  onToggleAppBlock: (childId: string, appId: string) => void;
  onUpdateChild: (child: ChildProfile) => void;
  onRefresh: () => void;
}

export default function ParentDashboard({ child, children, alerts, onToggleAppBlock, onUpdateChild, onRefresh }: ParentDashboardProps) {
  const [aiInsights, setAiInsights] = useState<{ summary: string; concerns: string[]; recommendations: string[] } | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    if (child) {
      generateInsights();
    } else {
      setAiInsights(null);
    }
  }, [child]);

  const generateInsights = async () => {
    if (!child) return;
    setIsGeneratingInsights(true);
    const childAlerts = alerts.filter(a => a.childId === child.id);
    const insights = await getSmartInsights(child, childAlerts);
    setAiInsights(insights);
    setIsGeneratingInsights(false);
  };

  const handleDecision = async (requestId: string, decision: 'approved' | 'denied', minutes: number, childId: string) => {
    try {
      await supabaseService.updateTimeRequest(requestId, decision, decision === 'approved' ? 'Have fun!' : 'Screen time over for now.');
      if (decision === 'approved') {
        await supabaseService.updateChildLimit(childId, minutes);
      }
      onRefresh();
    } catch (error) {
      console.error("Decision failed:", error);
    }
  };

  const pendingRequests = children.flatMap(c => (c as any).time_requests || []).filter(r => r.status === 'pending');

  if (children.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-5xl">👋</div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">Welcome to GuardianPath</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Get started by creating your first child profile to monitor activities and set safety rules.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
          + Create Child Profile
        </button>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Family Overview</h2>
            <p className="text-slate-500">Summary of all children digital activity today.</p>
          </div>
          <button onClick={onRefresh} className="p-2 hover:bg-slate-100 rounded-full transition-all">🔄</button>
        </header>

        {pendingRequests.length > 0 && (
          <section className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
              <span>⏳</span> Pending Requests ({pendingRequests.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req: any) => (
                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-900">
                      {children.find(c => c.id === req.child_id)?.name} wants {req.requested_minutes}m for {req.app_name || 'Apps'}
                    </p>
                    <p className="text-xs text-slate-500 italic mt-1">"{req.reason}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDecision(req.id, 'approved', req.requested_minutes, req.child_id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                    >Approve</button>
                    <button 
                      onClick={() => handleDecision(req.id, 'denied', 0, req.child_id)}
                      className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                    >Deny</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(c => (
             <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
               <div className="flex items-center mb-4">
                 <img src={c.photoUrl} alt={c.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                 <div>
                   <h3 className="font-bold text-slate-900">{c.name}</h3>
                   <div className="flex items-center text-xs">
                     <span className={`px-2 py-0.5 rounded-full ${c.healthScore > 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        Score: {c.healthScore}
                     </span>
                   </div>
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Screen Time</span>
                   <span className="font-medium">{Math.floor(c.totalScreenTimeMinutes / 60)}h {c.totalScreenTimeMinutes % 60}m</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                   <div 
                    className={`h-full rounded-full ${c.totalScreenTimeMinutes > c.screenTimeLimitMinutes ? 'bg-red-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${Math.min((c.totalScreenTimeMinutes / (c.screenTimeLimitMinutes || 1)) * 100, 100)}%` }}
                   />
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{child.name}'s Dashboard</h2>
          <p className="text-slate-500">Monitoring activity for {child.age} year old profile.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onRefresh} className="p-2 hover:bg-slate-100 rounded-full transition-all">🔄</button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Filter Level:</span>
            <select 
              value={child.filterLevel}
              onChange={(e) => onUpdateChild({ ...child, filterLevel: e.target.value as FilterLevel })}
              className="bg-white border rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(FilterLevel).map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">✨</div>
            <h3 className="text-xl font-bold">AI Smart Insights</h3>
            {isGeneratingInsights && <div className="ml-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
          </div>

          {aiInsights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-indigo-100 mb-4 leading-relaxed">{aiInsights.summary}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-200">Key Concerns</h4>
                  {aiInsights.concerns.length > 0 ? aiInsights.concerns.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded-lg">
                      <span className="text-orange-300">⚠️</span> {c}
                    </div>
                  )) : <p className="text-xs text-indigo-300 italic">No major concerns today.</p>}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-200 mb-4">Parental Recommendations</h4>
                <ul className="space-y-3">
                  {aiInsights.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0"></div>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-indigo-100">Generating latest intelligence for {child.name}...</p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityChart child={child} />
        <LocationMap child={child} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AppControl child={child} onToggleBlock={onToggleAppBlock} />
        <WebFiltering child={child} />
      </div>
    </div>
  );
}
