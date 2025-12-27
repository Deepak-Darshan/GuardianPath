
import React from 'react';
import { ChildProfile } from '../types';

interface SidebarProps {
  children: ChildProfile[];
  selectedChildId: string | null;
  onSelectChild: (id: string | null) => void;
}

export default function Sidebar({ children, selectedChildId, onSelectChild }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-slate-900">Family Members</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => onSelectChild(null)}
          className={`w-full flex items-center p-3 rounded-xl transition-all ${
            selectedChildId === null ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mr-3">
             🏠
          </div>
          <span>Overview</span>
        </button>

        {children.map(child => (
          <button
            key={child.id}
            onClick={() => onSelectChild(child.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${
              selectedChildId === child.id ? 'bg-indigo-50 text-indigo-600 border-indigo-100 font-semibold shadow-sm' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <img 
              src={child.photoUrl} 
              alt={child.name} 
              className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-white shadow-sm" 
            />
            <div className="text-left">
              <p className="text-sm font-medium">{child.name}</p>
              <p className="text-xs text-slate-400">Age {child.age}</p>
            </div>
            {child.healthScore < 80 && (
              <div className="ml-auto w-2 h-2 rounded-full bg-orange-400"></div>
            )}
          </button>
        ))}
      </nav>
      <div className="p-6 border-t mt-auto">
        <button className="w-full flex items-center justify-center py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all text-sm font-medium">
          + Add Profile
        </button>
      </div>
    </aside>
  );
}
