
import React from 'react';
import { ChildProfile } from '../types';

export default function LocationMap({ child }: { child: ChildProfile }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-96">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900">Current Location</h3>
          <p className="text-xs text-slate-500">{child.lastLocation.address}</p>
        </div>
        <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">Refresh</button>
      </div>
      <div className="flex-1 bg-slate-100 relative">
        {/* Mock Map View */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/400')] bg-cover bg-center grayscale-[20%]" />
        
        {/* Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-indigo-500/30">
              <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>

        {/* Location Controls */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">📍</div>
             <div className="text-xs">
               <p className="font-bold">Home Zone</p>
               <p className="text-slate-500">Inside Safe Zone</p>
             </div>
          </div>
          <button className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Manage Safe Zones</button>
        </div>
      </div>
    </div>
  );
}
