import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Target, TrendingUp, Star, List } from 'lucide-react';
import Confetti from 'react-confetti';
import type { User, Application } from '../types';
import { startOfWeek, endOfWeek, format, isWithinInterval } from 'date-fns';

interface UserCardProps {
  user: User;
  applications: Application[];
  allUsers: User[]; // Pass all users to determine ranking
  rank: number; // Rank will now be calculated dynamically
  onUpdateGoals: (dailyGoal: number, weeklyGoal: number) => void;
}

export function UserCard({ user, applications, allUsers, onUpdateGoals }: UserCardProps) {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  const userApps = applications.filter(app => app.userId === user.id);
  const totalCount = userApps.length; // Total applications count
  const todayCount = userApps.filter(app => app.date === todayStr).length;

  const weekCount = userApps.filter(app => 
    isWithinInterval(new Date(app.date), {
      start: startOfWeek(today),
      end: endOfWeek(today),
    })
  ).length;

  const [showConfetti, setShowConfetti] = useState(false);

  // Confetti logic when goals are met
  const dailyGoalMet = todayCount >= user.dailyGoal;
  const weeklyGoalMet = weekCount >= user.weeklyGoal;

  useEffect(() => {
    if (dailyGoalMet || weeklyGoalMet) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000); // Confetti for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [dailyGoalMet, weeklyGoalMet]);

  // Calculate rankings based on today's application count
  const userRankings = allUsers.map(userItem => {
    const userTodayCount = applications.filter(
      app => app.userId === userItem.id && app.date === todayStr
    ).length;
    return { userId: userItem.id, todayCount: userTodayCount };
  });

  userRankings.sort((a, b) => b.todayCount - a.todayCount);
  const rank = userRankings.findIndex(u => u.userId === user.id) + 1;

  const handleUpdateGoals = () => {
    const dailyGoal = parseInt(prompt('Enter your daily application goal:', user.dailyGoal.toString()) || '0');
    const weeklyGoal = parseInt(prompt('Enter your weekly application goal:', user.weeklyGoal.toString()) || '0');
    if (dailyGoal > 0 && weeklyGoal > 0) {
      onUpdateGoals(dailyGoal, weeklyGoal);
    }
  };

  const cardClassName = `bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 ${
    dailyGoalMet && weeklyGoalMet ? 'ring-4 ring-yellow-400' : ''
  }`;

  return (
    <div className={cardClassName}>
      {showConfetti && <Confetti />}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-indigo-500"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <p className="text-gray-500 text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        {rank <= 3 && (
          <div className="ml-auto">
            <Trophy className={`w-8 h-8 ${
              rank === 1 ? 'text-yellow-500' :
              rank === 2 ? 'text-gray-400' :
              'text-amber-600'
            }`} />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-gray-600">Today's Apps</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600">
            {todayCount} / {user.dailyGoal}
            {dailyGoalMet && <Star className="w-5 h-5 text-yellow-500 inline ml-2" />}
          </p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Week's Apps</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {weekCount} / {user.weeklyGoal}
            {weeklyGoalMet && <Star className="w-5 h-5 text-yellow-500 inline ml-2" />}
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Total Apps</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{totalCount}</p>
        </div>
      </div>

      <button
        onClick={handleUpdateGoals}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        Update Goals
      </button>
    </div>
  );
}
