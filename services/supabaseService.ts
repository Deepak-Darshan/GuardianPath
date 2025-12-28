
import { supabase } from '../supabaseClient';
import { ChildProfile, TimeRequest, AppActivity, FilterLevel } from '../types';

export const supabaseService = {
  async fetchFamilyData(parentId: string): Promise<ChildProfile[]> {
    const { data: children, error: childrenError } = await supabase
      .from('children')
      .select(`
        *,
        app_activities (*),
        web_logs (*),
        achievements (*),
        goals (*),
        time_requests (*)
      `)
      .eq('parent_id', parentId);

    if (childrenError) throw childrenError;

    // Robust mapping with null checks for every nested array
    return (children || []).map((c: any) => ({
      id: c.id,
      name: c.name || 'Unknown',
      age: c.age || 0,
      photoUrl: c.photo_url || `https://picsum.photos/seed/${c.id}/200/200`,
      healthScore: c.health_score ?? 100,
      totalScreenTimeMinutes: c.total_screen_time_minutes ?? 0,
      screenTimeLimitMinutes: c.screen_time_limit_minutes ?? 120,
      filterLevel: (c.filter_level as FilterLevel) || FilterLevel.YOUNG_CHILD,
      lastLocation: {
        lat: c.last_location_lat ?? 0,
        lng: c.last_location_lng ?? 0,
        address: c.last_location_address || 'Unknown Location',
        timestamp: c.last_location_timestamp || new Date().toISOString()
      },
      activities: (c.app_activities ?? []).map((a: any) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        timeSpentMinutes: a.time_spent_minutes ?? 0,
        limitMinutes: a.limit_minutes ?? 0,
        isBlocked: a.is_blocked ?? false,
        icon: a.icon || '📱'
      })),
      webLogs: (c.web_logs ?? []).map((l: any) => ({
        id: l.id,
        url: l.url,
        category: l.category,
        timestamp: l.timestamp,
        status: l.status
      })),
      achievements: (c.achievements ?? []).map((ac: any) => ({
        id: ac.id,
        name: ac.name,
        description: ac.description,
        icon: ac.icon,
        unlocked: ac.unlocked,
        category: ac.category
      })),
      goals: (c.goals ?? []).map((g: any) => ({
        id: g.id,
        title: g.title,
        requirement: g.requirement,
        reward: g.reward,
        progress: g.progress,
        icon: g.icon
      }))
    }));
  },

  async createTimeRequest(request: Partial<TimeRequest>) {
    const { data, error } = await supabase
      .from('time_requests')
      .insert({
        child_id: request.childId,
        requested_minutes: request.requestedMinutes,
        reason: request.reason,
        app_name: request.appName,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTimeRequest(requestId: string, status: 'approved' | 'denied', parentMessage?: string) {
    const { data, error } = await supabase
      .from('time_requests')
      .update({ status, parent_message: parentMessage })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChildLimit(childId: string, additionalMinutes: number) {
    const { data: child, error: fetchError } = await supabase
      .from('children')
      .select('screen_time_limit_minutes')
      .eq('id', childId)
      .single();

    if (fetchError) throw fetchError;

    if (child) {
      const newLimit = (child.screen_time_limit_minutes || 0) + additionalMinutes;
      const { error: updateError } = await supabase
        .from('children')
        .update({ screen_time_limit_minutes: newLimit })
        .eq('id', childId);
      
      if (updateError) throw updateError;
    }
  }
};
