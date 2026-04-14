import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { getCookie, setCookie, clearAllCookies } from './storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Module {
  id: string;
  name: string;
  code: string;
  color: string;
  progress: number;
  creditHours: number;
  grade?: number;
  timeSpent: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  moduleId: string;
  dueDate: string; // ISO string — safe for JSON/cookie round-trips
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  subtasks: Subtask[];
  timeEstimate: number;
  description?: string;
}

export interface FocusSession {
  id: string;
  taskId: string;
  duration: number;
  type: 'deep' | 'pomodoro' | 'study';
  startTime: string; // ISO string
  completedAt?: string; // ISO string
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string; // ISO string
  progress?: number;
  target?: number;
}

export interface UserProfile {
  name: string;
  academicLevel: 'undergraduate' | 'postgraduate' | 'phd';
  year: string;
  field: string;
  joinDate: string; // ISO string
  primaryGoal: string;
  avatar?: string;
}

export interface StudySettings {
  pomodoroDuration: number;
  shortBreak: number;
  longBreak: number;
  dailyGoalHours: number;
  weeklyGoalHours: number;
  notifications: boolean;
  studyReminders: boolean;
  weeklyReports: boolean;
  achievementNotifications: boolean;
  motivationalQuotes: boolean;
}

// ─── Cookie keys ─────────────────────────────────────────────────────────────

const KEYS = {
  user: 'ac_user',
  modules: 'ac_modules',
  tasks: 'ac_tasks',
  focusSessions: 'ac_focus',
  achievements: 'ac_achievements',
  xp: 'ac_xp',
  level: 'ac_level',
  streak: 'ac_streak',
  totalStudyTime: 'ac_study_time',
  onboarding: 'ac_onboarding',
  darkMode: 'ac_dark',
  settings: 'ac_settings',
  lastStudyDate: 'ac_last_study',
  auth: 'ac_auth',
} as const;

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_MODULES: Module[] = [
  { id: '1', name: 'Literature', code: 'ENGL4001', color: '#E76F51', progress: 68, creditHours: 20, grade: 78, timeSpent: 32 },
  { id: '2', name: 'Research', code: 'RES5002', color: '#2D6A4F', progress: 45, creditHours: 20, grade: 71, timeSpent: 28 },
  { id: '3', name: 'Business', code: 'BUS3001', color: '#1E3E5F', progress: 92, creditHours: 15, grade: 85, timeSpent: 22 },
];

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Complete Research Methods Quiz', moduleId: '2', dueDate: new Date(2026, 2, 31).toISOString(), priority: 'high', status: 'in_progress', progress: 60, subtasks: [{ id: '1-1', title: 'Find sources', completed: false }, { id: '1-2', title: 'Read', completed: false }, { id: '1-3', title: 'Synthesize', completed: true }, { id: '1-4', title: 'Draft outline', completed: false }, { id: '1-5', title: 'Write', completed: false }], timeEstimate: 120 },
  { id: '2', title: 'Literature Review Draft', moduleId: '1', dueDate: new Date(2026, 2, 30, 23, 59).toISOString(), priority: 'high', status: 'in_progress', progress: 75, subtasks: [], timeEstimate: 240 },
  { id: '3', title: 'Annotated Bibliography', moduleId: '1', dueDate: new Date(2026, 2, 28).toISOString(), priority: 'high', status: 'overdue', progress: 50, subtasks: [], timeEstimate: 180 },
  { id: '4', title: 'Peer Review Responses', moduleId: '1', dueDate: new Date(2026, 2, 30).toISOString(), priority: 'medium', status: 'pending', progress: 0, subtasks: [], timeEstimate: 60 },
  { id: '5', title: 'Ethics Approval Form', moduleId: '2', dueDate: new Date(2026, 3, 1).toISOString(), priority: 'high', status: 'pending', progress: 66, subtasks: [], timeEstimate: 90 },
  { id: '6', title: 'Group Project Submission', moduleId: '3', dueDate: new Date(2026, 3, 2).toISOString(), priority: 'high', status: 'in_progress', progress: 40, subtasks: [], timeEstimate: 300 },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: '21-Day Streak', description: 'Studied for 21 consecutive days', icon: '🔥', unlocked: true, unlockedAt: new Date(2026, 2, 15).toISOString() },
  { id: '2', title: 'Early Bird', description: 'Completed 10 morning study sessions', icon: '🌙', unlocked: true, unlockedAt: new Date(2026, 2, 10).toISOString() },
  { id: '3', title: '100 Tasks Completed', description: 'Complete 100 tasks', icon: '📚', unlocked: true, unlockedAt: new Date(2026, 2, 20).toISOString() },
  { id: '4', title: 'Focus Master', description: 'Complete 50 hours of focus sessions', icon: '⏱️', unlocked: false, progress: 35, target: 50 },
  { id: '5', title: 'Goal Crusher', description: 'Complete 5 major goals', icon: '🎯', unlocked: false, progress: 3, target: 5 },
  { id: '6', title: 'Peer Helper', description: 'Help 10 classmates with peer reviews', icon: '🤝', unlocked: false, progress: 3, target: 10 },
];

const DEFAULT_SETTINGS: StudySettings = {
  pomodoroDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  dailyGoalHours: 2,
  weeklyGoalHours: 20,
  notifications: true,
  studyReminders: true,
  weeklyReports: true,
  achievementNotifications: true,
  motivationalQuotes: true,
};

// ─── Context type ─────────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;

  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;

  // Modules
  modules: Module[];
  addModule: (module: Module) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'dueDate'> & { dueDate: Date | string }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;

  // Focus
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, 'startTime'> & { startTime: Date | string }) => void;
  completeFocusSession: (id: string) => void;

  // Stats
  studyStreak: number;
  totalStudyTime: number;
  completionRate: number;
  xp: number;
  level: number;
  addXP: (amount: number) => void;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  // Onboarding
  onboardingCompleted: boolean;
  completeOnboarding: () => void;

  // Settings
  darkMode: boolean;
  toggleDarkMode: () => void;
  studySettings: StudySettings;
  updateStudySettings: (updates: Partial<StudySettings>) => void;

  // Account
  deleteAccount: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // Load everything from cookies, falling back to defaults
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => getCookie<boolean>(KEYS.auth) ?? false
  );
  const [user, setUserState] = useState<UserProfile | null>(
    () => getCookie<UserProfile>(KEYS.user)
  );
  const [modules, setModules] = useState<Module[]>(
    () => getCookie<Module[]>(KEYS.modules) ?? DEFAULT_MODULES
  );
  const [tasks, setTasks] = useState<Task[]>(
    () => getCookie<Task[]>(KEYS.tasks) ?? DEFAULT_TASKS
  );
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(
    () => getCookie<FocusSession[]>(KEYS.focusSessions) ?? []
  );
  const [achievements, setAchievements] = useState<Achievement[]>(
    () => getCookie<Achievement[]>(KEYS.achievements) ?? DEFAULT_ACHIEVEMENTS
  );
  const [xp, setXp] = useState(() => getCookie<number>(KEYS.xp) ?? 1247);
  const [level, setLevel] = useState(() => getCookie<number>(KEYS.level) ?? 8);
  const [studyStreak, setStudyStreak] = useState(
    () => getCookie<number>(KEYS.streak) ?? 21
  );
  const [totalStudyTime, setTotalStudyTime] = useState(
    () => getCookie<number>(KEYS.totalStudyTime) ?? 12.5
  );
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    () => getCookie<boolean>(KEYS.onboarding) ?? false
  );
  const [darkMode, setDarkMode] = useState(
    () => getCookie<boolean>(KEYS.darkMode) ?? false
  );
  const [studySettings, setStudySettings] = useState<StudySettings>(
    () => getCookie<StudySettings>(KEYS.settings) ?? DEFAULT_SETTINGS
  );

  // Apply dark mode class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  // ── Persist helpers ──────────────────────────────────────────────────────

  const persist = useCallback(<T,>(key: string, value: T) => {
    setCookie(key, value);
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────

  const login = useCallback((email: string, name: string) => {
    setIsAuthenticated(true);
    persist(KEYS.auth, true);
    // Preserve existing user if already set, otherwise create minimal profile
    setUserState((prev) => {
      if (prev) return prev;
      const newUser: UserProfile = {
        name,
        academicLevel: 'undergraduate',
        year: 'Year 1',
        field: 'General',
        joinDate: new Date().toISOString(),
        primaryGoal: '',
      };
      persist(KEYS.user, newUser);
      return newUser;
    });
  }, [persist]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    persist(KEYS.auth, false);
  }, [persist]);

  // ── User ─────────────────────────────────────────────────────────────────

  const setUser = useCallback((u: UserProfile) => {
    const normalized = { ...u, joinDate: u.joinDate instanceof Date ? (u.joinDate as Date).toISOString() : u.joinDate };
    setUserState(normalized);
    persist(KEYS.user, normalized);
  }, [persist]);

  // ── Modules ──────────────────────────────────────────────────────────────

  const addModule = useCallback((module: Module) => {
    setModules((prev) => {
      const next = [...prev, module];
      persist(KEYS.modules, next);
      return next;
    });
  }, [persist]);

  const updateModule = useCallback((id: string, updates: Partial<Module>) => {
    setModules((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      persist(KEYS.modules, next);
      return next;
    });
  }, [persist]);

  // ── Tasks ────────────────────────────────────────────────────────────────

  const addTask = useCallback((task: Omit<Task, 'dueDate'> & { dueDate: Date | string }) => {
    const normalized: Task = {
      ...task,
      dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
    };
    setTasks((prev) => {
      const next = [...prev, normalized];
      persist(KEYS.tasks, next);
      return next;
    });
  }, [persist]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      persist(KEYS.tasks, next);
      return next;
    });
  }, [persist]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persist(KEYS.tasks, next);
      return next;
    });
  }, [persist]);

  const addXP = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      persist(KEYS.xp, next);
      setLevel((lvl) => {
        const newLvl = next >= 2500 * lvl ? lvl + 1 : lvl;
        persist(KEYS.level, newLvl);
        return newLvl;
      });
      return next;
    });
  }, [persist]);

  const completeTask = useCallback((id: string) => {
    updateTask(id, { status: 'completed', progress: 100 });
    addXP(30);
    // Update streak
    const today = new Date().toDateString();
    const last = getCookie<string>(KEYS.lastStudyDate);
    if (last !== today) {
      persist(KEYS.lastStudyDate, today);
      setStudyStreak((prev) => {
        const next = prev + 1;
        persist(KEYS.streak, next);
        return next;
      });
    }
  }, [updateTask, addXP, persist]);

  // ── Focus sessions ───────────────────────────────────────────────────────

  const addFocusSession = useCallback((session: Omit<FocusSession, 'startTime'> & { startTime: Date | string }) => {
    const normalized: FocusSession = {
      ...session,
      startTime: session.startTime instanceof Date ? session.startTime.toISOString() : session.startTime,
    };
    setFocusSessions((prev) => {
      const next = [...prev, normalized];
      persist(KEYS.focusSessions, next);
      return next;
    });
  }, [persist]);

  const completeFocusSession = useCallback((id: string) => {
    setFocusSessions((prev) => {
      const session = prev.find((s) => s.id === id);
      if (!session) return prev;
      const next = prev.map((s) =>
        s.id === id ? { ...s, completedAt: new Date().toISOString() } : s
      );
      persist(KEYS.focusSessions, next);

      // Update total study time
      const hoursAdded = session.duration / 3600;
      setTotalStudyTime((t) => {
        const updated = Math.round((t + hoursAdded) * 100) / 100;
        persist(KEYS.totalStudyTime, updated);
        return updated;
      });

      // Update streak
      const today = new Date().toDateString();
      const last = getCookie<string>(KEYS.lastStudyDate);
      if (last !== today) {
        persist(KEYS.lastStudyDate, today);
        setStudyStreak((s) => {
          const next = s + 1;
          persist(KEYS.streak, next);
          return next;
        });
      }

      return next;
    });
    addXP(50);
  }, [persist, addXP]);

  // ── Achievements ─────────────────────────────────────────────────────────

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
      );
      persist(KEYS.achievements, next);
      return next;
    });
    addXP(100);
  }, [persist, addXP]);

  // ── Onboarding ───────────────────────────────────────────────────────────

  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true);
    persist(KEYS.onboarding, true);
  }, [persist]);

  // ── Dark mode ────────────────────────────────────────────────────────────

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      persist(KEYS.darkMode, next);
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, [persist]);

  // ── Study settings ───────────────────────────────────────────────────────

  const updateStudySettings = useCallback((updates: Partial<StudySettings>) => {
    setStudySettings((prev) => {
      const next = { ...prev, ...updates };
      persist(KEYS.settings, next);
      return next;
    });
  }, [persist]);

  // ── Delete account ───────────────────────────────────────────────────────

  const deleteAccount = useCallback(() => {
    clearAllCookies();
    window.location.href = '/onboarding';
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────

  const completionRate = tasks.length
    ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100)
    : 0;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        setUser,
        modules,
        addModule,
        updateModule,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        focusSessions,
        addFocusSession,
        completeFocusSession,
        studyStreak,
        totalStudyTime,
        completionRate,
        xp,
        level,
        addXP,
        achievements,
        unlockAchievement,
        onboardingCompleted,
        completeOnboarding,
        darkMode,
        toggleDarkMode,
        studySettings,
        updateStudySettings,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
