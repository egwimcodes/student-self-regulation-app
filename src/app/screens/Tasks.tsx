import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Search, Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

export function Tasks() {
  const { tasks, modules, addTask, updateTask, completeTask } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overdue: true,
    today: true,
    thisWeek: true,
  });

  const [newTask, setNewTask] = useState({
    title: '',
    moduleId: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    timeEstimate: 120,
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const today = new Date();
    const dueDate = new Date(task.dueDate);

    switch (filter) {
      case 'today':
        return dueDate.toDateString() === today.toDateString();
      case 'thisWeek':
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return dueDate >= today && dueDate <= weekFromNow;
      case 'overdue':
        return task.status === 'overdue' || dueDate < today;
      default:
        return true;
    }
  });

  const overdueTasks = filteredTasks.filter(
    (task) =>
      task.status === 'overdue' || new Date(task.dueDate) < new Date()
  );
  const todayTasks = filteredTasks.filter((task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.toDateString() === today.toDateString() &&
      task.status !== 'completed'
    );
  });
  const thisWeekTasks = filteredTasks.filter((task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return (
      dueDate > today &&
      dueDate <= weekFromNow &&
      task.status !== 'completed' &&
      dueDate.toDateString() !== today.toDateString()
    );
  });

  const handleCreateTask = () => {
    if (newTask.title && newTask.moduleId && newTask.dueDate) {
      addTask({
        id: Date.now().toString(),
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString(),
        status: 'pending',
        progress: 0,
        subtasks: [],
      });
      setNewTask({
        title: '',
        moduleId: '',
        dueDate: '',
        priority: 'medium',
        timeEstimate: 120,
      });
      setShowCreateModal(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-[#E76F51] bg-[#E76F51]/10 border-[#E76F51]/20';
      case 'medium':
        return 'text-[#E9B35F] bg-[#E9B35F]/10 border-[#E9B35F]/20';
      case 'low':
        return 'text-[#2D6A4F] bg-[#2D6A4F]/10 border-[#2D6A4F]/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getModuleById = (moduleId: string) =>
    modules.find((m) => m.id === moduleId);

  const TaskCard = ({ task }: { task: typeof tasks[0] }) => {
    const module = getModuleById(task.moduleId);

    return (
      <div className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={() => {
              if (task.status !== 'completed') {
                completeTask(task.id);
              }
            }}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-foreground">{task.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className="font-medium" style={{ color: module?.color }}>
                  {module?.code}
                </span>
                <span>•</span>
                <span>Due {format(new Date(task.dueDate), 'MMM d')}</span>
                {task.status === 'overdue' && (
                  <>
                    <span>•</span>
                    <span className="text-[#E76F51] font-medium">
                      {Math.floor(
                        (new Date().getTime() - new Date(task.dueDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      days overdue
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority.toUpperCase()}
              </span>
              {task.subtasks.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  Subtasks: {task.subtasks.filter((st) => st.completed).length}/
                  {task.subtasks.length}
                </span>
              )}
            </div>

            {task.progress > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-1.5" />
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Focus Session
              </Button>
              <Button size="sm" variant="outline">
                Break Down
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E3E5F] hover:bg-[#2C4C6E]">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Create New Task
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Task Name</Label>
                <Input
                  placeholder="Write Methodology Section"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Module</Label>
                  <Select
                    value={newTask.moduleId}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, moduleId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Priority</Label>
                <div className="flex gap-2">
                  {['high', 'medium', 'low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() =>
                        setNewTask({
                          ...newTask,
                          priority: priority as 'high' | 'medium' | 'low',
                        })
                      }
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        newTask.priority === priority
                          ? 'border-[#1E3E5F] bg-[#1E3E5F]/5'
                          : 'border-border'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Time Estimate (minutes)</Label>
                <Input
                  type="number"
                  value={newTask.timeEstimate}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      timeEstimate: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#1E3E5F] hover:bg-[#2C4C6E]"
                  onClick={handleCreateTask}
                >
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'today', 'thisWeek', 'overdue'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              filter === filterOption
                ? 'bg-[#1E3E5F] text-white'
                : 'bg-card border border-border text-muted-foreground hover:border-[#1E3E5F]/30'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() +
              filterOption.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks, modules, or deadlines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-6">
        {overdueTasks.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('overdue')}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h2 className="text-lg font-bold text-[#E76F51] flex items-center gap-2">
                OVERDUE ({overdueTasks.length})
              </h2>
              {expandedSections.overdue ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              )}
            </button>
            {expandedSections.overdue && (
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}

        {todayTasks.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('today')}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                TODAY ({todayTasks.length})
              </h2>
              {expandedSections.today ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              )}
            </button>
            {expandedSections.today && (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}

        {thisWeekTasks.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('thisWeek')}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                THIS WEEK ({thisWeekTasks.length})
              </h2>
              {expandedSections.thisWeek ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              )}
            </button>
            {expandedSections.thisWeek && (
              <div className="space-y-3">
                {thisWeekTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
