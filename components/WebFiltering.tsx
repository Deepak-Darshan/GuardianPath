
import React, { useState } from 'react';
import { ChildProfile } from '../types';

export default function WebFiltering({ child }: { child: ChildProfile }) {
  const [activeTab, setActiveTab] = useState<'history' | 'rules'>('history');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900">Web Content Filtering</h3>
        <div className="flex bg-slate-100 rounded-lg p-1">
           <button 
             onClick={() => setActiveTab('history')}
             className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
           >History</button>
           <button 
             onClick={() => setActiveTab('rules')}
             className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'rules' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
           >Rules</button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {child.webLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${log.status === 'blocked' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                   {log.status === 'blocked' ? '🚫' : '🌐'}
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{log.url}</p>
                    <p className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()} • {log.category}</p>
                 </div>
               </div>
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                 log.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
               }`}>
                 {log.status.toUpperCase()}
               </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
             <h4 className="text-sm font-bold text-indigo-900 mb-1">SafeSearch Enabled</h4>
             <p className="text-xs text-indigo-700">Inappropriate results are hidden on major search engines.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Blocked Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Adult Content', 'Violence', 'Gambling', 'Drugs', 'Social Media', 'Chat'].map(cat => (
                <div key={cat} className="flex items-center justify-between p-2 border rounded-lg">
                   <span className="text-xs font-medium">{cat}</span>
                   <input type="checkbox" defaultChecked className="accent-indigo-600" />
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
            Manage Whitelist
          </button>
        </div>
      )}
    </div>
  );
}
