import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { UserCard } from './components/UserCard';
import { AddApplicationModal } from './components/AddApplicationModal';
import { Stats } from './components/Stats';
import type { User, Application } from './types';
import { fetchUsers, fetchApplications, createUser, createApplication, updateUserGoals } from './api';
import { startOfWeek, endOfWeek, format } from 'date-fns';

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: users = [] } = useQuery<User[]>('users', fetchUsers);
  const { data: applications = [] } = useQuery<Application[]>('applications', fetchApplications);
  
  const today = new Date();
  const dateRange = {
    start: format(startOfWeek(today), 'yyyy-MM-dd'),
    end: format(endOfWeek(today), 'yyyy-MM-dd'),
  };

  const addUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  const addApplicationMutation = useMutation(createApplication, {
    onSuccess: () => {
      queryClient.invalidateQueries('applications');
    },
  });

  const updateGoalsMutation = useMutation(
    ({ userId, dailyGoal, weeklyGoal }: { userId: string; dailyGoal: number; weeklyGoal: number }) =>
      updateUserGoals(userId, dailyGoal, weeklyGoal),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleAddUser = () => {
    const name = prompt('Enter your name:');
    if (name) {
      const dailyGoal = parseInt(prompt('Enter your daily application goal:', '5') || '5');
      const weeklyGoal = parseInt(prompt('Enter your weekly application goal:', '25') || '25');
      
      addUserMutation.mutate({ name, dailyGoal, weeklyGoal });
    }
  };

  const handleAddApplication = (data: Omit<Application, 'id' | 'date'>) => {
    addApplicationMutation.mutate(data);
    setShowAddModal(false);
  };

  const handleUpdateGoals = (userId: string, dailyGoal: number, weeklyGoal: number) => {
    updateGoalsMutation.mutate({ userId, dailyGoal, weeklyGoal });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Hunt Leaderboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Application
            </button>
            <button
              onClick={handleAddUser}
              className="btn bg-green-600 text-white hover:bg-green-700"
            >
              Join Board
            </button>
          </div>
        </div>

        <div className="mb-8">
          <Stats applications={applications} dateRange={dateRange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <UserCard
              key={user.id}
              user={user}
              applications={applications}
              rank={index + 1}
              onUpdateGoals={(dailyGoal, weeklyGoal) => 
                handleUpdateGoals(user.id, dailyGoal, weeklyGoal)
              }
            />
          ))}
        </div>

        {showAddModal && (
          <AddApplicationModal
            users={users}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddApplication}
          />
        )}
      </div>
    </div>
  );
}

export default App;