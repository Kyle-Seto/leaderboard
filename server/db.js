import Database from 'better-sqlite3';
import { format } from 'date-fns';

const db = new Database('jobhunt.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    created_at TEXT NOT NULL,
    daily_goal INTEGER NOT NULL DEFAULT 5,
    weekly_goal INTEGER NOT NULL DEFAULT 25
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Prepare statements
const getUsers = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const createUser = db.prepare(`
  INSERT INTO users (name, avatar, created_at, daily_goal, weekly_goal)
  VALUES (@name, @avatar, @created_at, @daily_goal, @weekly_goal)
`);
const updateUserGoals = db.prepare(`
  UPDATE users 
  SET daily_goal = @daily_goal, weekly_goal = @weekly_goal
  WHERE id = @id
`);

const getApplications = db.prepare(`
  SELECT * FROM applications 
  WHERE date BETWEEN ? AND ? 
  ORDER BY date DESC
`);
const createApplication = db.prepare(`
  INSERT INTO applications (user_id, date, company, role)
  VALUES (@user_id, @date, @company, @role)
`);

export function getAllUsers() {
  return getUsers.all();
}

export function getUser(id) {
  return getUserById.get(id);
}

export function addUser(userData) {
  const result = createUser.run({
    ...userData,
    created_at: format(new Date(), 'yyyy-MM-dd'),
  });
  return result.lastInsertRowid;
}

export function updateGoals(userId, dailyGoal, weeklyGoal) {
  return updateUserGoals.run({
    id: userId,
    daily_goal: dailyGoal,
    weekly_goal: weeklyGoal,
  });
}

export function getApplicationsInRange(startDate, endDate) {
  return getApplications.all(startDate, endDate);
}

export function addApplication(applicationData) {
  const result = createApplication.run(applicationData);
  return result.lastInsertRowid;
}

// Add some initial data if the database is empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  addUser({
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    daily_goal: 5,
    weekly_goal: 25,
  });
  
  addUser({
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    daily_goal: 3,
    weekly_goal: 15,
  });
}