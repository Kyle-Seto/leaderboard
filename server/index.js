import express from 'express';
import cors from 'cors';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import {
  getAllUsers,
  getUser,
  addUser,
  updateGoals,
  getApplicationsInRange,
  addApplication,
} from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Users endpoints
app.get('/api/users', (req, res) => {
  const users = getAllUsers();
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, dailyGoal, weeklyGoal } = req.body;
  const avatar = `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 11)}?w=400&h=400&fit=crop`;
  
  const userId = addUser({
    name,
    avatar,
    daily_goal: dailyGoal,
    weekly_goal: weeklyGoal,
  });
  
  const user = getUser(userId);
  res.json(user);
});

app.patch('/api/users/:id/goals', (req, res) => {
  const { id } = req.params;
  const { dailyGoal, weeklyGoal } = req.body;
  
  updateGoals(parseInt(id), dailyGoal, weeklyGoal);
  const user = getUser(parseInt(id));
  res.json(user);
});

// Applications endpoints
app.get('/api/applications', (req, res) => {
  const today = new Date();
  const start = format(startOfWeek(today), 'yyyy-MM-dd');
  const end = format(endOfWeek(today), 'yyyy-MM-dd');
  
  const applications = getApplicationsInRange(start, end);
  res.json(applications);
});

app.post('/api/applications', (req, res) => {
  const { userId, company, role } = req.body;
  const date = format(new Date(), 'yyyy-MM-dd');
  
  const id = addApplication({
    user_id: userId,
    date,
    company,
    role,
  });
  
  res.json({ id, userId, date, company, role });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});