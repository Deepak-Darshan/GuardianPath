
import React from 'react';
import { ChildProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ActivityChart({ child }: { child: ChildProfile }) {
  const data = child.activities.map(app => ({
    name: app.name,
    minutes: app.timeSpentMinutes,
    color: app.category === 'Entertainment' ? '#6366f1' : app.category === 'Social' ? '#ec4899' : app.category === 'Education' ? '#10b981' : '#f59e0b'
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-96">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900">App Usage Breakdown</h3>
        <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">Today</span>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '12px' }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
