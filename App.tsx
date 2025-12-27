
import React, { useState, useEffect } from 'react';
import { AppView, User, ChildProfile, Alert, FilterLevel, TimeRequest } from './types';
import Sidebar from './components/Sidebar';
import ParentDashboard from './components/ParentDashboard';
import ChildView from './components/ChildView';
import AuthView from './components/AuthView';
import TopNav from './components/TopNav';

const MOCK_CHILDREN: ChildProfile[] = [
  {
    id: 'child_1',
    name: 'Emma',
    age: 12,
    photoUrl: 'https://picsum.photos/seed/emma/200/200',
    healthScore: 88,
    totalScreenTimeMinutes: 145,
    screenTimeLimitMinutes: 180,
    filterLevel: FilterLevel.PRE_TEEN,
    lastLocation: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Near Central High School',
      timestamp: new Date().toISOString()
    },
    activities: [
      { id: 'app_1', name: 'YouTube', category: 'Entertainment', timeSpentMinutes: 65, isBlocked: false, limitMinutes: 60, icon: '📺' },
      { id: 'app_2', name: 'TikTok', category: 'Social', timeSpentMinutes: 45, isBlocked: false, limitMinutes: 45, icon: '🎵' },
      { id: 'app_3', name: 'Math Master', category: 'Education', timeSpentMinutes: 20, isBlocked: false, limitMinutes: 0, icon: '➗' },
      { id: 'app_4', name: 'Roblox', category: 'Gaming', timeSpentMinutes: 15, isBlocked: true, limitMinutes: 30, icon: '🎮' },
    ],
    webLogs: [
      { id: 'web_1', url: 'khanacademy.org', category: 'Education', status: 'allowed', timestamp: new Date().toISOString() },
      { id: 'web_2', url: 'reddit.com/r/gaming', category: 'Social', status: 'blocked', timestamp: new Date().toISOString() },
    ],
    achievements: [
      { id: 'a1', name: 'Early Bird', description: 'Screen off before bedtime', icon: '🦉', unlocked: true, category: 'time' },
      { id: 'a2', name: 'Learning Streak', description: '3 days of Math apps', icon: '🔥', unlocked: false, category: 'streak' },
      { id: 'a3', name: 'Safe Browser', description: 'Zero blocked attempts', icon: '🛡️', unlocked: true, category: 'learning' },
    ],
    goals: [
      { id: 'g1', title: 'Study for 30m', requirement: 'Use Math Master', reward: '15m extra time', progress: 66, icon: '📚' }
    ]
  }
];

export default function App() {
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>(MOCK_CHILDREN);
  const [timeRequests, setTimeRequests] = useState<TimeRequest[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView(AppView.PARENT_DASHBOARD);
  };

  const handleAddTimeRequest = (req: TimeRequest) => {
    setTimeRequests(prev => [...prev, req]);
  };

  const handleGrantTime = (childId: string, minutes: number) => {
    setChildren(prev => prev.map(c => 
      c.id === childId ? { ...c, screenTimeLimitMinutes: c.screenTimeLimitMinutes + minutes } : c
    ));
  };

  const updateChildProfile = (updatedChild: ChildProfile) => {
    setChildren(prev => prev.map(c => c.id === updatedChild.id ? updatedChild : c));
  };

  const renderContent = () => {
    switch (view) {
      case AppView.AUTH:
        return <AuthView onLogin={handleLogin} />;
      case AppView.PARENT_DASHBOARD:
        return (
          <div className="flex flex-col h-screen overflow-hidden">
            <TopNav 
              user={currentUser} 
              onSwitchToChild={() => setView(AppView.CHILD_VIEW)} 
              onLogout={() => setView(AppView.AUTH)}
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
                  onToggleAppBlock={(cid, aid) => {}}
                  onUpdateChild={updateChildProfile}
                />
              </main>
            </div>
          </div>
        );
      case AppView.CHILD_VIEW:
        return (
          <ChildView 
            child={children[0]} 
            onSwitchToParent={() => setView(AppView.PARENT_DASHBOARD)}
            onSendRequest={handleAddTimeRequest}
            onGrantExtraTime={(mins) => handleGrantTime(children[0].id, mins)}
          />
        );
      default:
        return null;
    }
  };

  return <div className="min-h-screen text-slate-800">{renderContent()}</div>;
}
