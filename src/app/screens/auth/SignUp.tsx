import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function SignUp() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    login(form.email, form.name);
    navigate('/onboarding/profile');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1E3E5F] to-[#2D6A4F]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">📚</div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-white/80">Start your academic journey today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white/90">Full Name</Label>
              <Input
                type="text"
                placeholder="Alex Chen"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(''); }}
                className="bg-white/15 border-white/20 text-white placeholder:text-white/50 focus-visible:border-white/60 focus-visible:ring-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/90">Email</Label>
              <Input
                type="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
                className="bg-white/15 border-white/20 text-white placeholder:text-white/50 focus-visible:border-white/60 focus-visible:ring-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/90">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
                  className="bg-white/15 border-white/20 text-white placeholder:text-white/50 focus-visible:border-white/60 focus-visible:ring-white/20 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/50 text-xs">Minimum 8 characters</p>
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <Button type="submit" size="lg" className="w-full h-12 bg-white text-[#1E3E5F] hover:bg-white/90 font-semibold mt-2">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-white/80 text-sm">
          Already have an account?{' '}
          <button className="text-white font-semibold hover:underline" onClick={() => navigate('/auth/signin')}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
