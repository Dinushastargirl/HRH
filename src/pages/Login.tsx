import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Briefcase, Mail, Lock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      // Redirection is handled by the useEffect above
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 overflow-hidden border border-zinc-100">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Briefcase size={28} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">HR PULSE</h1>
            </div>
            <h2 className="text-5xl font-black leading-tight mb-6">
              Manage your <br /> workforce with <br /> precision.
            </h2>
            <p className="text-orange-100 text-lg font-medium max-w-sm">
              The all-in-one platform for attendance, payroll, and employee growth.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-orange-500 bg-orange-400 flex items-center justify-center text-[10px] font-bold">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-orange-100">Trusted by 500+ companies</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-orange-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-zinc-900 mb-2">Sign In</h3>
            <p className="text-zinc-500 font-medium">Enter your credentials to access the HR Pulse dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Employee Login Info</p>
            <div className="grid grid-cols-1 gap-1 text-[10px] font-bold text-zinc-600">
              <div>Username: name.surname (e.g. dahami.divyanjali)</div>
              <div>Password: firstname123 (e.g. dahami123)</div>
              <div className="mt-2 text-orange-500">Example: dahami.divyanjali@hrpulse.com / dahami123</div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Need help? Contact system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
