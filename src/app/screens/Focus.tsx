import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Timer, Pause, Play, Square, Plus, Music, Wind } from "lucide-react";

export function Focus() {
  const { tasks, modules, addFocusSession, completeFocusSession, addXP } =
    useApp();
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [sessionType, setSessionType] = useState<"deep" | "pomodoro" | "study">(
    "pomodoro",
  );
  const [duration, setDuration] = useState(25);
  const [environment, setEnvironment] = useState<string[]>([]);
  const [blockNotifications, setBlockNotifications] = useState(true);
  const [blockSocial, setBlockSocial] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartSession = () => {
    if (!selectedTaskId) return;

    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);

    addFocusSession({
      id: newSessionId,
      taskId: selectedTaskId,
      duration: duration * 60,
      type: sessionType,
      startTime: new Date(),
    });

    setIsActive(true);
    setIsPaused(false);
    setSessionComplete(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (sessionId) {
      completeFocusSession(sessionId);
    }
    setIsActive(false);
    setTimeLeft(duration * 60);
    setSessionId(null);
  };

  const handleSessionComplete = () => {
    if (sessionId) {
      completeFocusSession(sessionId);
    }
    setIsActive(false);
    setSessionComplete(true);
  };

  const handleExtend = () => {
    setDuration(duration + 5);
    setTimeLeft(timeLeft + 5 * 60);
  };

  const toggleEnvironment = (env: string) => {
    if (environment.includes(env)) {
      setEnvironment(environment.filter((e) => e !== env));
    } else {
      setEnvironment([...environment, env]);
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const selectedModule = selectedTask
    ? modules.find((m) => m.id === selectedTask.moduleId)
    : null;

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-foreground">
            Session Complete!
          </h1>
          <p className="text-xl text-muted-foreground">
            You focused for {duration} minutes!
          </p>

          <div className="bg-card rounded-xl p-6 border border-border space-y-3 text-left">
            <h3 className="font-semibold text-foreground mb-2">
              📊 This Session:
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Task: {selectedTask?.title}</li>
              <li>• Duration: {duration} minutes</li>
              <li>• Type: {sessionType}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-foreground font-semibold">
              🔥 Your study streak continues!
            </p>
            <p className="text-[#2D6A4F] font-semibold">
              🌟 +50 focus points earned
            </p>
          </div>

          <div className="bg-[#9C89B8]/10 rounded-xl p-4 border border-[#9C89B8]/20">
            <p className="text-sm text-foreground">
              💡 Tip: Take a 5-minute break before your next session to maintain
              productivity
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-[#1E3E5F] hover:bg-[#2C4C6E]"
              onClick={() => {
                setSessionComplete(false);
                setTimeLeft(duration * 60);
              }}
            >
              Start Another
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSessionComplete(false);
                setIsActive(false);
                setTimeLeft(duration * 60);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3E5F] to-[#2C4C6E] p-6 flex items-center justify-center">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Focus Mode Active</h2>
            <button
              onClick={handleStop}
              className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              Exit
            </button>
          </div>

          <div className="relative">
            <div className="w-64 h-64 mx-auto relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 120 * (1 - progress / 100)
                  }`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Timer className="w-12 h-12 text-white mx-auto mb-4" />
                  <div className="text-5xl font-bold text-white">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-white space-y-2">
            <h3 className="text-lg font-semibold">Current Task:</h3>
            <p className="text-xl">{selectedTask?.title}</p>
            {selectedModule && (
              <p className="text-white/70 text-sm">{selectedModule.code}</p>
            )}
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <Progress value={progress} className="h-2 mb-3" />
            <p className="text-white/80 text-sm">
              {Math.round(progress)}% complete
            </p>
          </div>

          <p className="text-white/60 text-sm">
            Today's Total Focus: 1 hour 45 minutes
          </p>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handlePauseResume}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              {isPaused ? (
                <Play className="w-6 h-6 text-white" />
              ) : (
                <Pause className="w-6 h-6 text-white" />
              )}
              <span className="text-white text-sm">
                {isPaused ? "Resume" : "Pause"}
              </span>
            </button>
            <button
              onClick={handleStop}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Square className="w-6 h-6 text-white" />
              <span className="text-white text-sm">Stop</span>
            </button>
            <button
              onClick={handleExtend}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Plus className="w-6 h-6 text-white" />
              <span className="text-white text-sm">Extend</span>
            </button>
          </div>

          {environment.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <Music className="w-4 h-4" />
              <span>
                Now playing:{" "}
                {environment.includes("lofi")
                  ? "Lo-Fi Study Beats"
                  : environment.includes("white")
                    ? "White Noise"
                    : "Nature Sounds"}
              </span>
            </div>
          )}

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/90 text-sm italic">
              "The secret of getting ahead is getting started." - Mark Twain
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🧘</div>
        <h1 className="text-3xl font-bold text-foreground">FOCUS STUDIO</h1>
        <p className="text-muted-foreground">
          Set up your perfect study session
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
        <div>
          <Label className="text-base mb-2 block">Select Task:</Label>
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose a task to focus on" />
            </SelectTrigger>
            <SelectContent>
              {tasks
                .filter((task) => task.status !== "completed")
                .map((task) => {
                  const module = modules.find((m) => m.id === task.moduleId);
                  return (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title} ({module?.code})
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base mb-3 block ">Session Type:</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: "deep", label: "Deep Focus" },
              { value: "pomodoro", label: "Pomodoro" },
              { value: "study", label: "Study with Me" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  setSessionType(type.value as "deep" | "pomodoro" | "study")
                }
                className={`p-3 rounded-lg border-2 transition-all text-center break-words ${
                  sessionType === type.value
                    ? "border-[#1E3E5F] bg-[#1E3E5F]/5"
                    : "border-border hover:border-[#1E3E5F]/30"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base mb-3 block">Duration:</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[25, 50, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`p-3 rounded-lg border-2 transition-all text-center break-words ${
                  duration === mins
                    ? "border-[#1E3E5F] bg-[#1E3E5F]/5"
                    : "border-border hover:border-[#1E3E5F]/30"
                }`}
              >
                {mins} min
              </button>
            ))}

            <button
              onClick={() => {
                const custom = prompt("Enter duration in minutes:", "60");
                if (custom) setDuration(parseInt(custom));
              }}
              className="p-3 rounded-lg border-2 border-border hover:border-[#1E3E5F]/30 transition-all text-center break-words"
            >
              Custom
            </button>
          </div>
        </div>

        <div>
          <Label className="text-base mb-3 block">Environment:</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "lofi", label: "Lo-Fi Music", icon: Music },
              { id: "white", label: "White Noise", icon: Wind },
              { id: "nature", label: "Nature", icon: Wind },
              { id: "none", label: "No Sound", icon: Square },
            ].map((env) => {
              const Icon = env.icon;
              return (
                <button
                  key={env.id}
                  onClick={() => toggleEnvironment(env.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    environment.includes(env.id)
                      ? "border-[#1E3E5F] bg-[#1E3E5F]/5"
                      : "border-border hover:border-[#1E3E5F]/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{env.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-base mb-3 block">Focus Mode:</Label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={blockNotifications}
                onCheckedChange={(checked) =>
                  setBlockNotifications(checked as boolean)
                }
              />
              <span className="text-sm">Block notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={blockSocial}
                onCheckedChange={(checked) =>
                  setBlockSocial(checked as boolean)
                }
              />
              <span className="text-sm">Block social media apps</span>
            </label>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-12 bg-[#1E3E5F] hover:bg-[#2C4C6E]"
          onClick={handleStartSession}
          disabled={!selectedTaskId}
        >
          Start Session
        </Button>
      </div>
    </div>
  );
}
