
import React from 'react';
import { User } from '../types';

interface TopNavProps {
  user: User | null;
  onSwitchToChild: () => void;
  onLogout: () => void;
}

export default function TopNav({ user, onSwitchToChild, onLogout }: TopNavProps) {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold text-xl">GP</div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">GuardianPath</h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onSwitchToChild}
          className="hidden sm:flex items-center px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
        >
          Switch to Child View
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
        
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Parent User'}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-indigo-100">
               <img src="https://picsum.photos/seed/parent/100/100" alt="avatar" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform scale-95 group-hover:scale-100 z-50">
              <div className="p-2">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Account Settings</button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Family Settings</button>
                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
