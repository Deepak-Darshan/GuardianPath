
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('parent@guardianpath.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUpMode) {
      handleSignUp();
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback for demo purposes if specific mock credentials used
        if (authError.message === 'Invalid login credentials' && email === 'parent@guardianpath.com') {
          console.warn("Auth failed, falling back to mock user for development.");
          onLogin({
            id: 'user_1',
            name: 'Sarah Mitchell',
            email: email,
            role: 'parent',
            children: []
          });
        } else {
          throw authError;
        }
      } else if (data.user) {
        onLogin({
          id: data.user.id,
          name: data.user.user_metadata.full_name || email.split('@')[0],
          email: data.user.email || '',
          role: 'parent',
          children: []
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!fullName && isSignUpMode) {
      setError("Please enter your full name");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user && data.session) {
        // Auto-logged in (if confirmation is disabled in Supabase)
        onLogin({
          id: data.user.id,
          name: fullName,
          email: email,
          role: 'parent',
          children: []
        });
      } else {
        setSuccessMsg('Success! Please check your email to confirm your account.');
        setIsSignUpMode(false);
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="inline-block bg-white p-3 rounded-2xl text-indigo-600 font-black text-2xl mb-4 shadow-xl">GP</div>
          <h1 className="text-3xl font-bold">GuardianPath</h1>
          <p className="text-indigo-200 mt-2">
            {isSignUpMode ? 'Create Parent Account' : 'Connected to Cloud Database ☁️'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 font-medium">
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            {isSignUpMode && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
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

          {!isSignUpMode && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-indigo-600" defaultChecked />
                <span className="text-sm text-slate-600">Remember Me</span>
              </label>
              <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Forgot Code?</a>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (isSignUpMode ? 'Register Now' : 'Access Dashboard')}
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setError(null);
                setSuccessMsg(null);
              }}
              disabled={loading}
              className="w-full bg-white text-slate-700 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              {isSignUpMode ? 'Back to Login' : 'Create New Account'}
            </button>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-slate-500">Need to link a new device? <a href="#" className="font-bold text-indigo-600">Get Setup Guide</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
