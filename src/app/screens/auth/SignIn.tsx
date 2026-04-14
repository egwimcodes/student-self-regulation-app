import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    // Derive display name from email prefix
    const name = form.email.split('@')[0].replace(/[._]/g, ' ');
    login(form.email, name);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1E3E5F] to-[#2D6A4F]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-2">📚</div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-white/80">Sign in to continue your journey</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button type="button" className="text-white/70 text-sm hover:text-white text-right w-full">
              Forgot password?
            </button>

            <Button type="submit" size="lg" className="w-full h-12 bg-white text-[#1E3E5F] hover:bg-white/90 font-semibold">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-white/80 text-sm">
          Don't have an account?{' '}
          <button className="text-white font-semibold hover:underline" onClick={() => navigate('/auth/signup')}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
