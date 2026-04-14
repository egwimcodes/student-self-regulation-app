import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { BarChart3, Target, Bell, Timer } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ValueProposition() {
  const navigate = useNavigate();
  const { isAuthenticated, onboardingCompleted } = useApp();

  useEffect(() => {
    if (isAuthenticated && onboardingCompleted) navigate('/');
    else if (isAuthenticated) navigate('/onboarding/profile');
  }, [isAuthenticated, onboardingCompleted, navigate]);

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Visualize progress',
    },
    {
      icon: Timer,
      title: 'Focus Sessions',
      description: 'Pomodoro + AI timer',
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'AI-powered planning',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Context-aware alerts',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1E3E5F] to-[#2D6A4F]">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-white">
            Master Your Academic Journey
          </h1>
          <p className="text-lg text-white/90">
            Join 10,000+ students who've transformed their study habits with
            intelligent insights and personalized planning.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white"
              >
                <Icon className="w-8 h-8 mb-2 mx-auto" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-12 bg-white text-[#1E3E5F] hover:bg-white/90 text-base font-semibold"
            onClick={() => navigate("/auth/signup")}
          >
            Start Free Trial
          </Button>
          <button
            className="text-white/80 text-sm hover:text-white"
            onClick={() => navigate("/auth/signin")}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
