export interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  dailyGoal: number;
  weeklyGoal: number;
}

export interface Application {
  id: string;
  userId: string;
  date: string;
  company: string;
  role: string;
}

export interface UserStats {
  totalApplications: number;
  streak: number;
  personalBest: number;
  dailyAverage: number;
  lastSubmission: string;
  todayCount: number;
  weekCount: number;
  dailyGoalMet: boolean;
  weeklyGoalMet: boolean;
}