import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus } from 'lucide-react';

interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
}

export function GoalSetting() {
  const navigate = useNavigate();
  const { completeOnboarding, addTask } = useApp();
  const [goalTitle, setGoalTitle] = useState('Complete Literature Review');
  const [subGoals, setSubGoals] = useState<SubGoal[]>([
    { id: '1', title: 'Find 15 sources', completed: false },
    { id: '2', title: 'Read and annotate', completed: false },
    { id: '3', title: 'Write synthesis', completed: false },
  ]);
  const [startDate, setStartDate] = useState('2026-03-30');
  const [endDate, setEndDate] = useState('2026-04-15');

  const addSubGoal = () => {
    setSubGoals([
      ...subGoals,
      { id: Date.now().toString(), title: '', completed: false },
    ]);
  };

  const updateSubGoal = (id: string, title: string) => {
    setSubGoals(subGoals.map((sg) => (sg.id === id ? { ...sg, title } : sg)));
  };

  const handleStartJourney = () => {
    addTask({
      id: Date.now().toString(),
      title: goalTitle,
      moduleId: '1',
      dueDate: new Date(endDate).toISOString(),
      priority: 'high',
      status: 'pending',
      progress: 0,
      subtasks: subGoals.map((sg) => ({
        id: sg.id,
        title: sg.title,
        completed: sg.completed,
      })),
      timeEstimate: 240,
    });

    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Let's set your first goal
          </h1>
          <p className="text-muted-foreground">
            Break it down into manageable steps
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border space-y-6">
          <div>
            <Label className="text-base mb-2 block">Goal Title</Label>
            <Input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="Enter your goal"
              className="h-12"
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">Sub-goals</Label>
            <div className="space-y-2">
              {subGoals.map((subGoal, index) => (
                <div key={subGoal.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={subGoal.completed}
                    onCheckedChange={(checked) =>
                      setSubGoals(
                        subGoals.map((sg) =>
                          sg.id === subGoal.id
                            ? { ...sg, completed: checked as boolean }
                            : sg
                        )
                      )
                    }
                  />
                  <Input
                    value={subGoal.title}
                    onChange={(e) => updateSubGoal(subGoal.id, e.target.value)}
                    placeholder={`Sub-goal ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
              <button
                onClick={addSubGoal}
                className="flex items-center gap-2 text-[#1E3E5F] hover:text-[#2C4C6E] font-medium"
              >
                <Plus className="w-4 h-4" />
                Add sub-goal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-base mb-2 block">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div>
              <Label className="text-base mb-2 block">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Timeline: {new Date(startDate).toLocaleDateString()} -{' '}
              {new Date(endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-12 bg-[#1E3E5F] hover:bg-[#2C4C6E]"
            onClick={handleStartJourney}
          >
            Start My Journey
          </Button>
          <button
            onClick={handleStartJourney}
            className="w-full text-center text-muted-foreground text-sm hover:text-foreground"
          >
            Create Another Goal Later
          </button>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2">
            {[1, 2, 3].map((step, index) => (
              <div
                key={step}
                className={`h-2 rounded-full ${
                  index === 2 ? 'w-8 bg-[#1E3E5F]' : 'w-2 bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
