import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Timer,
  Link as LinkIcon,
  Shield,
  Moon,
  Sun,
  Share2,
  Download,
  Trash2,
  LogOut,
} from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode, studySettings, updateStudySettings, logout, deleteAccount } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This will permanently delete all your data.')) {
      deleteAccount();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <SettingsIcon className="w-7 h-7" />
        Settings
      </h1>

      {/* Profile */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3E5F] to-[#2D6A4F] flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{user?.name || 'Student'}</h2>
            <p className="text-muted-foreground">{user?.field || 'General'}, {user?.year || 'Year 1'}</p>
            <p className="text-sm text-muted-foreground">
              Member since{' '}
              {user?.joinDate
                ? new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : 'Today'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm">View Public Profile</Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">PREFERENCES</h2>
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-[#9C89B8]" /> : <Sun className="w-5 h-5 text-[#E9B35F]" />}
              <div>
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme across the app</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#1E3E5F]" />
              <div>
                <Label className="text-base">Smart Notifications</Label>
                <p className="text-sm text-muted-foreground">AI-powered contextual reminders</p>
              </div>
            </div>
            <Switch
              checked={studySettings.notifications}
              onCheckedChange={(v) => updateStudySettings({ notifications: v })}
            />
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#1E3E5F]" />
              <div>
                <Label className="text-base">Study Reminders</Label>
                <p className="text-sm text-muted-foreground">Daily study session reminders</p>
              </div>
            </div>
            <Switch
              checked={studySettings.studyReminders}
              onCheckedChange={(v) => updateStudySettings({ studyReminders: v })}
            />
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-[#2D6A4F]" />
              <div>
                <Label className="text-base">Focus Mode Auto-Start</Label>
                <p className="text-sm text-muted-foreground">Auto-start focus mode at scheduled times</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#1E3E5F]" />
              <div>
                <Label className="text-base">Weekly Summary Email</Label>
                <p className="text-sm text-muted-foreground">Receive weekly progress reports</p>
              </div>
            </div>
            <Switch
              checked={studySettings.weeklyReports}
              onCheckedChange={(v) => updateStudySettings({ weeklyReports: v })}
            />
          </div>
        </div>
      </div>

      {/* Study Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">STUDY SETTINGS</h2>
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Pomodoro Duration</Label>
            <Select
              value={String(studySettings.pomodoroDuration)}
              onValueChange={(v) => updateStudySettings({ pomodoroDuration: Number(v) })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[15, 25, 30, 45].map((m) => <SelectItem key={m} value={String(m)}>{m} min</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <Label className="text-base">Short Break Duration</Label>
            <Select
              value={String(studySettings.shortBreak)}
              onValueChange={(v) => updateStudySettings({ shortBreak: Number(v) })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[3, 5, 10].map((m) => <SelectItem key={m} value={String(m)}>{m} min</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <Label className="text-base">Long Break Duration</Label>
            <Select
              value={String(studySettings.longBreak)}
              onValueChange={(v) => updateStudySettings({ longBreak: Number(v) })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[15, 20, 30].map((m) => <SelectItem key={m} value={String(m)}>{m} min</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <Label className="text-base">Daily Study Goal</Label>
            <Select
              value={String(studySettings.dailyGoalHours)}
              onValueChange={(v) => updateStudySettings({ dailyGoalHours: Number(v) })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((h) => <SelectItem key={h} value={String(h)}>{h} hour{h > 1 ? 's' : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <Label className="text-base">Weekly Study Goal</Label>
            <Select
              value={String(studySettings.weeklyGoalHours)}
              onValueChange={(v) => updateStudySettings({ weeklyGoalHours: Number(v) })}
            >
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 15, 20, 25, 30].map((h) => <SelectItem key={h} value={String(h)}>{h} hours</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">INTEGRATIONS</h2>
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          {['Google Calendar', 'Microsoft Outlook', 'Apple Calendar', 'Blackboard Sync'].map((name, index) => (
            <div key={name}>
              {index > 0 && <div className="h-px bg-border mb-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-5 h-5 text-muted-foreground" />
                  <Label className="text-base">{name}</Label>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">NOTIFICATION PREFERENCES</h2>
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Achievement Notifications</Label>
            <Switch
              checked={studySettings.achievementNotifications}
              onCheckedChange={(v) => updateStudySettings({ achievementNotifications: v })}
            />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="text-base">Motivational Quotes</Label>
            <Switch
              checked={studySettings.motivationalQuotes}
              onCheckedChange={(v) => updateStudySettings({ motivationalQuotes: v })}
            />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="text-base">Weekly Reports</Label>
            <Switch
              checked={studySettings.weeklyReports}
              onCheckedChange={(v) => updateStudySettings({ weeklyReports: v })}
            />
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5" />
          DATA & PRIVACY
        </h2>
        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
          <div className="h-px bg-border" />
          <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button>
          <div className="h-px bg-border" />
          <button className="w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button>
          <div className="h-px bg-border" />
          <Button variant="destructive" className="w-full justify-start" size="sm" onClick={handleDeleteAccount}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground pb-6">
        <p>AcaDemia v1.0.0</p>
        <p className="mt-1">© 2026 All rights reserved</p>
      </div>
    </div>
  );
}
