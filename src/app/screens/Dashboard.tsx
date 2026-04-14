import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import {
  Flame,
  Clock,
  CheckCircle2,
  Sun,
  Bell,
  Target,
  ChevronRight,
  Lightbulb,
  Calendar,
  Plus,
} from 'lucide-react';
import { format, differenceInHours } from 'date-fns';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    modules,
    studyStreak,
    totalStudyTime,
    completionRate,
    onboardingCompleted,
    isAuthenticated,
    user,
  } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/onboarding');
    } else if (!onboardingCompleted) {
      navigate('/onboarding/profile');
    }
  }, [isAuthenticated, onboardingCompleted, navigate]);

  const todayTasks = tasks.filter((task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = tasks
    .filter((task) => task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const primaryTask = tasks.find((task) => task.id === '1');

  const getTimeUntilDue = (dueDate: Date) => {
    const now = new Date();
    const hours = differenceInHours(dueDate, now);
    if (hours < 24) return `${hours} hours left`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} left`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#2D6A4F]';
      case 'in_progress':
        return 'text-[#1E3E5F]';
      case 'overdue':
        return 'text-[#E76F51]';
      default:
        return 'text-[#8E9DAE]';
    }
  };

  const getModuleById = (moduleId: string) =>
    modules.find((m) => m.id === moduleId);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-muted-foreground italic text-sm mt-1">
            "Consistency is more important than intensity."
          </p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
            <Sun className="w-5 h-5 text-[#E9B35F]" />
          </button>
          <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E76F51] rounded-full" />
          </button>
        </div>
      </header>

      {primaryTask && (
        <div className="bg-gradient-to-br from-[#1E3E5F] to-[#2C4C6E] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">TODAY'S PRIORITY</h2>
            <button
              onClick={() => navigate("/focus")}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Focus Mode
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold mb-1">{primaryTask.title}</h3>
              <p className="text-white/80 text-sm">
                {getModuleById(primaryTask.moduleId)?.code} • Due{" "}
                {format(new Date(primaryTask.dueDate), "MMMM d")} • 85% of class
                has done
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {primaryTask.subtasks.filter((st) => st.completed).length}/
                  {primaryTask.subtasks.length} steps
                </span>
                <span>{primaryTask.progress}%</span>
              </div>
              <Progress value={primaryTask.progress} className="h-2" />
              <div className="flex flex-wrap gap-2 text-xs">
                {primaryTask.subtasks.map((subtask) => (
                  <span
                    key={subtask.id}
                    className={`px-2 py-1 rounded ${
                      subtask.completed
                        ? "bg-[#2D6A4F] text-white"
                        : "bg-white/20"
                    }`}
                  >
                    {subtask.completed ? "✓" : "○"} {subtask.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => navigate("/focus")}
                className="flex-1 bg-white text-[#1E3E5F] hover:bg-white/90"
              >
                Start Focus Session
              </Button>
              <Button
                onClick={() => navigate("/tasks")}
                variant="outline"
                className="flex-1 border-white/30 text-[#1E3E5F] hover:bg-white/10"
              >
                Break Down Task
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        <div className="min-w-[250px] flex-shrink-0 bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-[#E76F51]" />
            <span className="text-sm font-medium text-muted-foreground">
              STUDY STREAK
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {studyStreak} <span className="text-xl">days</span>
          </div>
          <p className="text-xs text-[#2D6A4F]">+2 from last week</p>
          <p className="text-xs text-muted-foreground mt-1">Best: 47 days</p>
        </div>

        <div className="min-w-[250px] flex-shrink-0 bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#1E3E5F]" />
            <span className="text-sm font-medium text-muted-foreground">
              THIS WEEK
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {totalStudyTime} <span className="text-xl">hrs</span>
          </div>
          <p className="text-xs text-[#2D6A4F]">+3 from last week</p>
          <p className="text-xs text-muted-foreground mt-1">Goal: 20 hrs</p>
        </div>

        <div className="min-w-[250px] flex-shrink-0 bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
            <span className="text-sm font-medium text-muted-foreground">
              COMPLETION
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {completionRate}%
          </div>
          <p className="text-xs text-[#2D6A4F]">+5% from last week</p>
          <p className="text-xs text-muted-foreground mt-1">Goal: 90%</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-[#1E3E5F]" />
            UPCOMING DEADLINES
          </h2>
        </div>

        <div className="space-y-3">
          {upcomingTasks.map((task) => {
            const module = getModuleById(task.moduleId);
            const isUrgent =
              differenceInHours(new Date(task.dueDate), new Date()) < 24;

            return (
              <div
                key={task.id}
                className={`bg-card rounded-xl p-4 border transition-all hover:shadow-md cursor-pointer ${
                  isUrgent ? "border-[#E76F51] bg-[#E76F51]/5" : "border-border"
                }`}
                onClick={() => navigate("/tasks")}
              >
                {isUrgent && (
                  <div className="flex items-center gap-1 text-[#E76F51] text-xs font-semibold mb-2">
                    ⚠️ URGENT
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module?.code} • Due{" "}
                      {format(new Date(task.dueDate), "MMMM d")}
                    </p>
                  </div>
                  {task.progress > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#2D6A4F]">
                        {task.progress}%
                      </div>
                    </div>
                  )}
                </div>
                {isUrgent && (
                  <p className="text-sm font-medium text-[#E76F51] mb-2">
                    {getTimeUntilDue(new Date(task.dueDate))}
                  </p>
                )}
                {task.progress > 0 && (
                  <Progress value={task.progress} className="h-1.5 mb-3" />
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/tasks");
                    }}
                  >
                    Continue
                  </Button>
                  {isUrgent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Extend
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">
          MODULE PROGRESS
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-card rounded-xl p-4 border border-border min-w-[200px] cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate("/analytics")}
            >
              <div
                className="w-full h-1 rounded-full mb-3"
                style={{ backgroundColor: module.color }}
              />
              <h3 className="font-semibold text-foreground mb-1">
                {module.code}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {module.name}
              </p>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Next: Final Essay (35%)
              </p>
              <Button
                size="sm"
                className="w-full"
                style={{ backgroundColor: module.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/focus");
                }}
              >
                Study
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#9C89B8]/10 to-[#5E9B9C]/10 rounded-xl p-4 border border-[#9C89B8]/20">
        <div className="flex gap-3">
          <Lightbulb className="w-5 h-5 text-[#9C89B8] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              💡 AI INSIGHT
            </h3>
            <p className="text-sm text-foreground/80 mb-3">
              Based on your patterns, you focus best between 9-11 AM. You have 2
              tasks that could be completed in tomorrow's optimal window.
              Schedule them now?
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-[#9C89B8] hover:bg-[#9C89B8]/90">
                Schedule
              </Button>
              <Button size="sm" variant="outline">
                Dismiss
              </Button>
              <Button size="sm" variant="ghost">
                Tell Me More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/tasks")}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#1E3E5F] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#2C4C6E] transition-all hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
