
export enum AppView {
  PARENT_DASHBOARD = 'PARENT_DASHBOARD',
  CHILD_VIEW = 'CHILD_VIEW',
  AUTH = 'AUTH'
}

export enum FilterLevel {
  YOUNG_CHILD = 'Young Child (5-9)',
  PRE_TEEN = 'Pre-teen (10-12)',
  TEEN = 'Teen (13-17)',
  CUSTOM = 'Custom'
}

export interface AppActivity {
  id: string;
  name: string;
  category: string;
  timeSpentMinutes: number;
  isBlocked: boolean;
  limitMinutes: number;
  icon: string;
}

export interface WebLog {
  id: string;
  url: string;
  category: string;
  timestamp: string;
  status: 'allowed' | 'blocked';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'streak' | 'time' | 'learning';
}

export interface Goal {
  id: string;
  title: string;
  requirement: string;
  reward: string;
  progress: number;
  icon: string;
}

export interface TimeRequest {
  id: string;
  childId: string;
  requestedMinutes: number;
  reason: string;
  appId?: string;
  appName?: string;
  status: 'pending' | 'approved' | 'denied';
  timestamp: string;
  parentMessage?: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  healthScore: number;
  totalScreenTimeMinutes: number;
  screenTimeLimitMinutes: number;
  lastLocation: {
    lat: number;
    lng: number;
    address: string;
    timestamp: string;
  };
  activities: AppActivity[];
  webLogs: WebLog[];
  filterLevel: FilterLevel;
  achievements: Achievement[];
  goals: Goal[];
}

export interface Alert {
  id: string;
  childId: string;
  type: 'blocked_app' | 'blocked_web' | 'time_limit' | 'location_geofence' | 'concerning_content';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'guardian';
  children: ChildProfile[];
}
