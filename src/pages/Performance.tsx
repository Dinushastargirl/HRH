import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Award, Target, Zap, 
  Star, AlertCircle, CheckCircle2, BarChart3
} from 'lucide-react';
import { PerformanceRecord, UserProfile } from '../types';
import { mockService } from '../mockService';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Performance() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<UserProfile | null>(null);

  useEffect(() => {
    const emps = mockService.getEmployees();
    setEmployees(emps);
    if (!selectedEmp && emps.length > 0) {
      setSelectedEmp(user?.role === 'employee' ? emps.find(e => e.uid === user.uid) || emps[0] : emps[0]);
    }
  }, [user]);

  const performanceData = [
    { subject: 'Attendance', A: selectedEmp?.performanceScore || 80, fullMark: 100 },
    { subject: 'Efficiency', A: (selectedEmp?.performanceScore || 80) - 5, fullMark: 100 },
    { subject: 'Quality', A: (selectedEmp?.performanceScore || 80) + 10, fullMark: 100 },
    { subject: 'Teamwork', A: 85, fullMark: 100 },
    { subject: 'Reliability', A: 90, fullMark: 100 },
  ];

  const historyData = [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 82 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: selectedEmp?.performanceScore || 80 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Performance</h1>
          <p className="text-zinc-500 font-medium">Analyze employee growth and metrics</p>
        </div>
        {user?.role !== 'employee' && (
          <select 
            value={selectedEmp?.uid}
            onChange={(e) => setSelectedEmp(employees.find(emp => emp.uid === e.target.value) || null)}
            className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-orange-500"
          >
            {employees.map(e => <option key={e.uid} value={e.uid}>{e.name}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm text-center">
            <div className="w-24 h-24 rounded-3xl bg-zinc-100 mx-auto mb-4 flex items-center justify-center text-zinc-400 font-black text-3xl">
              {selectedEmp?.name.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-zinc-900">{selectedEmp?.name}</h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">{selectedEmp?.role} • {selectedEmp?.branch}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Score</p>
                <p className="text-xl font-black text-zinc-900">{selectedEmp?.performanceScore}%</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Rank</p>
                <p className="text-xl font-black text-zinc-900">#4</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white">
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-orange-400" size={24} />
              <h3 className="font-black text-lg">Key Achievements</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-zinc-300">100% Attendance in May</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-zinc-300">Exceeded sales target by 15%</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-zinc-300">Employee of the Month (March)</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-6 flex items-center gap-2">
                <Target size={20} className="text-orange-500" />
                Skill Distribution
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                    <PolarGrid stroke="#f4f4f5" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }} />
                    <Radar name="Score" dataKey="A" stroke="#18181b" fill="#18181b" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <h3 className="font-black text-zinc-900 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" />
                Score History
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="score" fill="#18181b" radius={[10, 10, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Efficiency', val: '92%', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { label: 'Quality', val: '88%', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Attendance', val: '98%', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Reliability', val: '95%', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map((m, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", m.bg, m.color)}>
                  <m.icon size={20} />
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{m.label}</p>
                <p className="text-xl font-black text-zinc-900">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
