
import React, { useState } from 'react';
import { User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
  const [email, setEmail] = useState('parent@guardianpath.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        id: 'user_1',
        name: 'Sarah Mitchell',
        email: email,
        role: 'parent',
        children: []
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="inline-block bg-white p-3 rounded-2xl text-indigo-600 font-black text-2xl mb-4 shadow-xl">GP</div>
          <h1 className="text-3xl font-bold">GuardianPath</h1>
          <p className="text-indigo-200 mt-2">The ultimate digital safety suite for your family.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="parent@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Security Pin / Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-indigo-600" defaultChecked />
              <span className="text-sm text-slate-600">Remember Me</span>
            </label>
            <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Forgot Code?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Access Dashboard'}
          </button>

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-slate-500">Need to link a new device? <a href="#" className="font-bold text-indigo-600">Get Setup Guide</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
