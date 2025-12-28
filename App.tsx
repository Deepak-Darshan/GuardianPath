
import React, { useState, useEffect } from 'react';
import { AppView, User, ChildProfile, Alert, FilterLevel, TimeRequest } from './types';
import Sidebar from './components/Sidebar';
import ParentDashboard from './components/ParentDashboard';
import ChildView from './components/ChildView';
import AuthView from './components/AuthView';
import TopNav from './components/TopNav';
import { supabase } from './supabaseClient';
import { supabaseService } from './services/supabaseService';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Parent',
          email: session.user.email || '',
          role: 'parent',
          children: []
        };
        setCurrentUser(user);
        
        // Ensure we aren't already loading to prevent double-syncing
        if (!isLoading) {
          await loadFamilyData(session.user.id);
        }
        
        setView(AppView.PARENT_DASHBOARD);
      } else {
        setCurrentUser(null);
        setChildren([]);
        setView(AppView.AUTH);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFamilyData = async (userId: string) => {
    setIsLoading(true);
    try {
      const familyData = await supabaseService.fetchFamilyData(userId);
      setChildren(familyData);
    } catch (error) {
      console.error("Failed to load family data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGrantTime = async (childId: string, minutes: number) => {
    try {
      await supabaseService.updateChildLimit(childId, minutes);
      if (currentUser) await loadFamilyData(currentUser.id);
    } catch (error) {
      console.error("Failed to grant time:", error);
    }
  };

  const updateChildProfile = (updatedChild: ChildProfile) => {
    setChildren(prev => prev.map(c => c.id === updatedChild.id ? updatedChild : c));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Syncing Family Cloud...</p>
            <p className="text-xs text-slate-400 mt-2">Connecting to GuardianPath Servers</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case AppView.AUTH:
        return <AuthView onLogin={() => {
          // No manual call here - onAuthStateChange handles it
        }} />;
      case AppView.PARENT_DASHBOARD:
        return (
          <div className="flex flex-col h-screen overflow-hidden animate-in fade-in duration-500">
            <TopNav 
              user={currentUser} 
              onSwitchToChild={() => setView(AppView.CHILD_VIEW)} 
              onLogout={handleLogout}
            />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                children={children} 
                selectedChildId={selectedChildId} 
                onSelectChild={setSelectedChildId} 
              />
              <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <ParentDashboard 
                  child={children.find(c => c.id === selectedChildId) || null}
                  children={children}
                  alerts={[]}
                  onToggleAppBlock={() => {}}
                  onUpdateChild={updateChildProfile}
                  onRefresh={() => currentUser && loadFamilyData(currentUser.id)}
                />
              </main>
            </div>
          </div>
        );
      case AppView.CHILD_VIEW:
        const activeChild = children[0] || null;
        if (!activeChild) return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
            <p className="text-xl font-bold mb-4">No child profiles found.</p>
            <p className="text-slate-400 mb-8">Please add a profile in the Parent Dashboard first.</p>
            <button onClick={() => setView(AppView.PARENT_DASHBOARD)} className="bg-indigo-600 px-8 py-3 rounded-2xl font-bold">Back to Parent Dashboard</button>
          </div>
        );
        return (
          <ChildView 
            child={activeChild} 
            onSwitchToParent={() => setView(AppView.PARENT_DASHBOARD)}
            onSendRequest={async (req) => {
               await supabaseService.createTimeRequest(req);
               if (currentUser) loadFamilyData(currentUser.id);
            }}
            onGrantExtraTime={(mins) => handleGrantTime(activeChild.id, mins)}
          />
        );
      default:
        return null;
    }
  };

  return <div className="min-h-screen text-slate-800">{renderContent()}</div>;
}
