import { User, Application } from './types';
import { supabase } from './lib/supabase';
import { format } from 'date-fns';

export async function fetchUsers(): Promise<User[]> {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return users.map(user => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.created_at,
    dailyGoal: user.daily_goal,
    weeklyGoal: user.weekly_goal,
  }));
}

export async function createUser(data: { name: string; dailyGoal: number; weeklyGoal: number }): Promise<User> {
  const avatar = `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 11)}?w=400&h=400&fit=crop`;
  
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name: data.name,
      avatar,
      created_at: format(new Date(), 'yyyy-MM-dd'),
      daily_goal: data.dailyGoal,
      weekly_goal: data.weeklyGoal,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.created_at,
    dailyGoal: user.daily_goal,
    weeklyGoal: user.weekly_goal,
  };
}

export async function updateUserGoals(userId: string, dailyGoal: number, weeklyGoal: number): Promise<User> {
  const { data: user, error } = await supabase
    .from('users')
    .update({
      daily_goal: dailyGoal,
      weekly_goal: weeklyGoal,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.created_at,
    dailyGoal: user.daily_goal,
    weeklyGoal: user.weekly_goal,
  };
}

export async function fetchApplications(): Promise<Application[]> {
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return applications.map(app => ({
    id: app.id,
    userId: app.user_id,
    date: app.date,
    company: app.company,
    role: app.role,
  }));
}

export async function createApplication(data: Omit<Application, 'id' | 'date'>): Promise<Application> {
  const { data: app, error } = await supabase
    .from('applications')
    .insert({
      user_id: data.userId,
      date: format(new Date(), 'yyyy-MM-dd'),
      company: data.company,
      role: data.role,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: app.id,
    userId: app.user_id,
    date: app.date,
    company: app.company,
    role: app.role,
  };
}