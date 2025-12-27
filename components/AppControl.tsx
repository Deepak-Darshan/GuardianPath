
import React from 'react';
import { ChildProfile } from '../types';

interface AppControlProps {
  child: ChildProfile;
  onToggleBlock: (childId: string, appId: string) => void;
}

export default function AppControl({ child, onToggleBlock }: AppControlProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900">App Management</h3>
        <button className="text-indigo-600 text-sm font-semibold">Bulk Action</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {child.activities.map(app => (
          <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border">
                {app.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{app.name}</h4>
                <p className="text-xs text-slate-400">{app.category}</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-20 bg-slate-200 h-1.5 rounded-full">
                     <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${Math.min((app.timeSpentMinutes / Math.max(app.limitMinutes, 1)) * 100, 100)}%` }} 
                     />
                   </div>
                   <span className="text-[10px] text-slate-500">{app.timeSpentMinutes} / {app.limitMinutes || '∞'}m</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Limit</span>
                <span className="text-xs font-semibold">{app.limitMinutes || 'Unlimited'}</span>
              </div>
              <button 
                onClick={() => onToggleBlock(child.id, app.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  app.isBlocked ? 'bg-red-500' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  app.isBlocked ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
