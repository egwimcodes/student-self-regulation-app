import { useApp } from '../context/AppContext';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Trophy, Share2, Award, Lock } from 'lucide-react';
import { format } from 'date-fns';

export function Achievements() {
  const { achievements, xp, level } = useApp();

  const xpToNextLevel = 2500 * level;
  const xpProgress = (xp / xpToNextLevel) * 100;

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const inProgressAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-7 h-7 text-[#E9B35F]" />
          ACHIEVEMENTS
        </h1>
        <button className="text-sm text-[#1E3E5F] font-medium hover:text-[#2C4C6E] flex items-center gap-1">
          View All
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#E9B35F]/10 to-[#9C89B8]/10 rounded-2xl p-6 border border-[#E9B35F]/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            🎮 YOUR PROGRESS
          </h2>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline">
              View Leaderboard
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-1" />
              Share Progress
            </Button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div>
            <div className="text-5xl font-bold text-foreground mb-2">
              Level {level}
            </div>
            <div className="text-lg text-[#9C89B8] font-semibold">
              Scholar Apprentice
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {xp.toLocaleString()} XP
              </span>
              <span className="text-muted-foreground">
                {xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <Progress value={xpProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {(xpToNextLevel - xp).toLocaleString()} XP to Level {level + 1}
            </p>
          </div>

          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Next Reward at Level {level + 1}:
            </p>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-[#9C89B8]" />
              <span className="font-semibold text-foreground">
                "Focus Pro" badge
              </span>
            </div>
          </div>

          <div className="bg-white/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Recent XP Gains:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  • Completed focus session
                </span>
                <span className="text-[#2D6A4F] font-semibold">+50 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  • Met daily study goal
                </span>
                <span className="text-[#2D6A4F] font-semibold">+30 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">• Added 3 subtasks</span>
                <span className="text-[#2D6A4F] font-semibold">+20 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Unlocked ({unlockedAchievements.length})
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {unlockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-gradient-to-br from-[#E9B35F]/10 to-[#2D6A4F]/10 rounded-xl p-6 border-2 border-[#E9B35F]/30 text-center space-y-2 hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-2">{achievement.icon}</div>
              <h3 className="font-bold text-foreground">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
              {achievement.unlockedAt && (
                <div className="text-xs text-[#2D6A4F] font-semibold">
                  Unlocked {format(achievement.unlockedAt, 'MMM d')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            In Progress ({inProgressAchievements.length})
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {inProgressAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-card rounded-xl p-6 border border-border text-center space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-5xl mb-2 opacity-40">
                {achievement.icon}
              </div>
              <h3 className="font-bold text-foreground">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
              {achievement.progress !== undefined &&
                achievement.target !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <Progress
                      value={(achievement.progress / achievement.target) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        ((achievement.target - achievement.progress) /
                          achievement.target) *
                          100
                      )}
                      % to go
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1E3E5F]/10 to-[#2D6A4F]/10 rounded-2xl p-6 border border-[#1E3E5F]/20">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          🎯 ACHIEVEMENT TIPS
        </h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Close to "Focus Master"
              </p>
              <p className="text-sm text-muted-foreground">
                Complete 3 more focus sessions to unlock this achievement and earn
                100 XP
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">🎖️</div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Maintain your streak!
              </p>
              <p className="text-sm text-muted-foreground">
                You're on a 21-day streak. Keep going to unlock "Month Master"
                achievement!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <div className="text-3xl font-bold text-[#2D6A4F] mb-1">
            {unlockedAchievements.length}
          </div>
          <p className="text-sm text-muted-foreground">
            Achievements Unlocked
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <div className="text-3xl font-bold text-[#9C89B8] mb-1">
            {achievements.length - unlockedAchievements.length}
          </div>
          <p className="text-sm text-muted-foreground">
            Achievements Remaining
          </p>
        </div>
      </div>
    </div>
  );
}
