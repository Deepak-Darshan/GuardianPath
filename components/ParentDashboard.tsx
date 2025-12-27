
import React, { useState, useEffect } from 'react';
import { ChildProfile, Alert, FilterLevel } from '../types';
import ActivityChart from './ActivityChart';
import AppControl from './AppControl';
import LocationMap from './LocationMap';
import WebFiltering from './WebFiltering';
import { getSmartInsights } from '../geminiService';

interface ParentDashboardProps {
  child: ChildProfile | null;
  children: ChildProfile[];
  alerts: Alert[];
  onToggleAppBlock: (childId: string, appId: string) => void;
  onUpdateChild: (child: ChildProfile) => void;
}

export default function ParentDashboard({ child, children, alerts, onToggleAppBlock, onUpdateChild }: ParentDashboardProps) {
  const [aiInsights, setAiInsights] = useState<{ summary: string; concerns: string[]; recommendations: string[] } | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    if (child) {
      generateInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child]);

  const generateInsights = async () => {
    if (!child) return;
    setIsGeneratingInsights(true);
    const childAlerts = alerts.filter(a => a.childId === child.id);
    const insights = await getSmartInsights(child, childAlerts);
    setAiInsights(insights);
    setIsGeneratingInsights(false);
  };

  if (!child) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h2 className="text-3xl font-bold text-slate-900">Family Overview</h2>
          <p className="text-slate-500">Summary of all children digital activity today.</p>
        </header>

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
                    style={{ width: `${Math.min((c.totalScreenTimeMinutes / c.screenTimeLimitMinutes) * 100, 100)}%` }}
                   />
                 </div>
               </div>
             </div>
          ))}
        </div>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl flex items-start gap-4 ${
                alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-50' : 'bg-slate-50'
              }`}>
                <div className={`mt-1 p-2 rounded-lg ${
                  alert.severity === 'high' || alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {alert.type === 'blocked_app' ? '📱' : alert.type === 'blocked_web' ? '🌐' : '⚠️'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{alert.message}</p>
                  <p className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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
      </header>

      {/* AI Insights Card */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
        
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
                  {aiInsights.concerns.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded-lg">
                      <span className="text-orange-300">⚠️</span> {c}
                    </div>
                  ))}
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
