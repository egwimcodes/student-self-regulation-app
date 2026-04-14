import { useApp } from '../context/AppContext';
import { Progress } from '../components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Flame, Calendar, AlertTriangle } from 'lucide-react';

export function Analytics() {
  const { modules, studyStreak, completionRate, focusSessions, studySettings } = useApp();

  // Build weekly bar chart from real focus sessions (last 7 days)
  const weeklyData = (() => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const result = days.map((day) => ({ day, hours: 0 }));
    const now = new Date();
    focusSessions
      .filter((s) => s.completedAt)
      .forEach((s) => {
        const d = new Date(s.startTime);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
        if (diffDays < 7) {
          const idx = d.getDay();
          result[idx].hours = Math.round((result[idx].hours + s.duration / 3600) * 10) / 10;
        }
      });
    return result;
  })();

  // Build monthly line chart (last 4 weeks)
  const monthlyData = (() => {
    const weeks = [{ week: 'Week 1', hours: 0 }, { week: 'Week 2', hours: 0 }, { week: 'Week 3', hours: 0 }, { week: 'Week 4', hours: 0 }];
    const now = new Date();
    focusSessions
      .filter((s) => s.completedAt)
      .forEach((s) => {
        const d = new Date(s.startTime);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
        if (diffDays < 28) {
          const weekIdx = Math.min(3, Math.floor(diffDays / 7));
          weeks[3 - weekIdx].hours = Math.round((weeks[3 - weekIdx].hours + s.duration / 3600) * 10) / 10;
        }
      });
    return weeks;
  })();

  const totalMonthHours = weeklyData.reduce((a, b) => a + b.hours, 0);
  const dailyAvg = weeklyData.filter((d) => d.hours > 0).length
    ? Math.round((totalMonthHours / weeklyData.filter((d) => d.hours > 0).length) * 10) / 10
    : 0;
  const bestDay = [...weeklyData].sort((a, b) => b.hours - a.hours)[0];

  const calendarData = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ANALYTICS</h1>
        <select className="px-4 py-2 bg-card border border-border rounded-lg text-sm">
          <option>March 2026</option>
          <option>February 2026</option>
          <option>January 2026</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-[#2D6A4F]/10 to-[#1E3E5F]/10 rounded-2xl p-6 border border-[#2D6A4F]/20">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#2D6A4F]" />
          PERFORMANCE SNAPSHOT
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {completionRate}%
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              Completion Rate
            </div>
            <div className="text-xs text-[#2D6A4F] font-semibold">
              ↑ +12%
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">62%</div>
            <div className="text-sm text-muted-foreground mb-1">Class Avg</div>
            <div className="text-xs text-muted-foreground">Reference</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">91%</div>
            <div className="text-sm text-muted-foreground mb-1">
              Consistency Score
            </div>
            <div className="text-xs text-[#9C89B8] font-semibold">
              Top 15%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1E3E5F]" />
          STUDY TIME ANALYSIS
        </h2>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="day" stroke="#8E9DAE" />
              <YAxis stroke="#8E9DAE" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E7EC',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="hours" fill="#1E3E5F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Total: {totalMonthHours.toFixed(1)} hours this month</p>
          <p>Daily average: {dailyAvg} hours</p>
          <p>Most productive: {bestDay.day}days ({bestDay.hours} hours avg)</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          📚 MODULE BREAKDOWN
        </h2>
        <div className="space-y-6">
          {modules.map((module) => (
            <div key={module.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: module.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {module.code}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">
                    {module.progress}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Grade: {module.grade}%
                  </div>
                </div>
              </div>
              <Progress value={module.progress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{module.timeSpent}h studied</span>
                <span>Next: Final Essay (35%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#E76F51]" />
          HABIT CONSISTENCY
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">
                Study Streak: {studyStreak} days 🔥
              </span>
              <span className="text-sm text-muted-foreground">
                Best: 47 days
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Calendar View (March 2026)
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-xs text-center text-muted-foreground mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i}>{day}</div>
                ))}
              </div>
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`aspect-square rounded ${
                        day === 1
                          ? 'bg-[#2D6A4F]'
                          : day === 0
                          ? 'bg-border'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              ))}
              <div className="flex gap-4 text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#2D6A4F] rounded" />
                  Studied
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-border rounded" />
                  Missed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#9C89B8]/10 to-[#5E9B9C]/10 rounded-2xl p-6 border border-[#9C89B8]/20">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          🤖 AI PREDICTIONS
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Based on your current pace:
            </p>
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-semibold">
                  📊 Projected Semester Grade:
                </span>{' '}
                78% (Upper Second)
              </p>
              <p className="text-foreground">
                <span className="font-semibold">🎯 To achieve First Class (70%):</span>
              </p>
              <p className="text-sm text-muted-foreground ml-4">
                Need +2.5 hours/week or +12% on final exam
              </p>
            </div>
          </div>

          <div className="bg-[#E76F51]/10 rounded-lg p-4 border border-[#E76F51]/20">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E76F51] flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  ⚠️ RISK ALERT: ENGL4001 final essay at risk
                </p>
                <p className="text-sm text-muted-foreground">
                  Recommendation: Start draft by April 5
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="px-4 py-2 bg-[#9C89B8] text-white rounded-lg text-sm font-medium hover:bg-[#9C89B8]/90 transition-colors">
              View Detailed Forecast
            </button>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-[#9C89B8]/30 transition-colors">
              Adjust Goal
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          MONTHLY TREND
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
              <XAxis dataKey="week" stroke="#8E9DAE" />
              <YAxis stroke="#8E9DAE" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4E7EC',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#2D6A4F"
                strokeWidth={3}
                dot={{ fill: '#2D6A4F', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
