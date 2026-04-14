import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useApp } from '../../context/AppContext';
import { Plus, X } from 'lucide-react';

interface ModuleInput {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  color: string;
}

export function ProfileSetup() {
  const navigate = useNavigate();
  const { setUser, addModule, user } = useApp();
  const [academicLevel, setAcademicLevel] = useState<
    'undergraduate' | 'postgraduate' | 'phd' | null
  >(null);
  const [modules, setModules] = useState<ModuleInput[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);

  const colors = [
    '#E76F51',
    '#2D6A4F',
    '#1E3E5F',
    '#E9B35F',
    '#9C89B8',
    '#5E9B9C',
  ];

  const goals = [
    { id: '1', icon: '🎯', text: 'Achieve First Class Honours' },
    { id: '2', icon: '📈', text: 'Improve Grade by One Category' },
    { id: '3', icon: '⏰', text: 'Stop Procrastinating Completely' },
    { id: '4', icon: '💪', text: 'Build Consistent Study Habits' },
    { id: '5', icon: '⚖️', text: 'Balance Academic & Personal Life' },
  ];

  const addNewModule = () => {
    const newModule: ModuleInput = {
      id: Date.now().toString(),
      name: '',
      code: '',
      creditHours: 20,
      color: colors[modules.length % colors.length],
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (id: string, field: string, value: string | number) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleContinue = () => {
    if (academicLevel && modules.length > 0 && primaryGoal) {
      modules.forEach((module, index) => {
        addModule({
          ...module,
          progress: 0,
          timeSpent: 0,
        });
      });

      setUser({
        name: user?.name || 'Student',
        academicLevel,
        year: 'Year 1',
        field: 'General',
        joinDate: new Date().toISOString(),
        primaryGoal,
      });

      navigate('/onboarding/goals');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Let's set up your profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about your academic journey
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">
              What's your academic level?
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "undergraduate",
                  label: "Undergraduate",
                  sub: "Year 1-4",
                },
                {
                  value: "postgraduate",
                  label: "Postgraduate",
                  sub: "Masters",
                },
                { value: "phd", label: "PhD/Research", sub: "Doctoral" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setAcademicLevel(
                      option.value as "undergraduate" | "postgraduate" | "phd",
                    )
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    academicLevel === option.value
                      ? "border-[#1E3E5F] bg-[#1E3E5F]/5"
                      : "border-border hover:border-[#1E3E5F]/30"
                  }`}
                >
                  <div className="font-semibold text-sm md:text-bas truncate">
                    {option.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Select your modules/courses
            </Label>
            <div className="space-y-3">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="flex gap-2 items-center p-3 bg-card rounded-xl border border-border"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: module.color }}
                  />
                  <Input
                    placeholder="Course Name"
                    value={module.name}
                    onChange={(e) =>
                      updateModule(module.id, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Code"
                    value={module.code}
                    onChange={(e) =>
                      updateModule(module.id, "code", e.target.value)
                    }
                    className="w-32"
                  />
                  <button
                    onClick={() => removeModule(module.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
              {modules.length < 8 && (
                <button
                  onClick={addNewModule}
                  className="w-full p-3 border-2 border-dashed border-border rounded-xl hover:border-[#1E3E5F] hover:bg-[#1E3E5F]/5 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-[#1E3E5F]"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              )}
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              What's your primary goal this semester?
            </Label>
            <div className="space-y-2">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setPrimaryGoal(goal.text)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    primaryGoal === goal.text
                      ? "border-[#1E3E5F] bg-[#1E3E5F]/5"
                      : "border-border hover:border-[#1E3E5F]/30"
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-medium">{goal.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-12 bg-[#1E3E5F] hover:bg-[#2C4C6E]"
          onClick={handleContinue}
          disabled={!academicLevel || modules.length === 0 || !primaryGoal}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
