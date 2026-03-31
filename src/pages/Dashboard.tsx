import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Plus, 
  ArrowUpRight, ArrowDownRight, Timer, ListTodo,
  TrendingUp, Briefcase, UserCheck, ShieldCheck, Trash2, Camera,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { LeaveRequest, AttendanceRecord, Task, LeaveType } from '../types';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

import { useAuth } from '../hooks/useAuth';
import { mockService } from '../mockService';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, uid } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveImage, setLeaveImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', icon: '🌞' };
    if (hour < 18) return { text: 'Good Afternoon', icon: '☀️' };
    return { text: 'Good Evening', icon: '🌙' };
  };

  const loadData = () => {
    if (!uid) return;
    setRequests(mockService.getLeaves(uid));
    setAttendance(mockService.getAttendance(uid));
    setTasks(mockService.getTasks(uid));
    setLoading(false);
  };

  const todayStr = currentTime.toISOString().split('T')[0];
  const todayRecord = attendance.find(r => r.date === todayStr);
  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.checkOut;

  useEffect(() => {
    loadData();
  }, [uid]);

  const handleCheckIn = () => {
    if (!uid) return;
    const todayStr = currentTime.toISOString().split('T')[0];
    const hour = currentTime.getHours();
    const isLate = hour >= 9;

    mockService.saveAttendance({
      userId: uid,
      date: todayStr,
      checkIn: currentTime.toISOString(),
      isLate,
      isEarlyOut: false,
    });
    toast.success('Checked in successfully!');
    loadData();
  };

  const handleCheckOut = () => {
    if (!todayRecord?.id) return;
    const hour = currentTime.getHours();
    const isEarlyOut = hour < 17;

    mockService.updateAttendance(todayRecord.id, {
      checkOut: currentTime.toISOString(),
      isEarlyOut,
    });
    toast.success('Checked out successfully!');
    loadData();
  };

  const toggleTask = (id: string) => {
    mockService.toggleTask(id);
    loadData();
  };

  const deleteTask = (id: string) => {
    mockService.deleteTask(id);
    loadData();
  };

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('taskTitle') as HTMLInputElement).value;
    if (!title || !uid) return;

    mockService.saveTask({
      userId: uid,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    form.reset();
    toast.success('Task added');
    loadData();
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !user) return;
    
    const typeKey = leaveType.toLowerCase() as keyof typeof user.leaveQuotas;
    const remaining = user.leaveQuotas[typeKey] - user.usedLeaves[typeKey];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > remaining) {
      toast.error(`Insufficient ${leaveType} leave balance. Remaining: ${remaining} days.`);
      return;
    }

    setSubmitting(true);
    mockService.saveLeave({
      userId: uid,
      userName: user.name,
      userRole: user.role,
      leaveType,
      reason,
      startDate: startDate,
      endDate: endDate,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      imageUrl: leaveImage || undefined,
    });
    
    toast.success('Leave request submitted!');
    setIsModalOpen(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    setLeaveImage(null);
    setSubmitting(false);
    loadData();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeaveImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            <CalendarIcon size={18} className="text-orange-500" />
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button 
              onClick={() => setCalendarDate(new Date(year, month - 1))}
              className="p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-600 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCalendarDate(new Date(year, month + 1))}
              className="p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-600 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <span key={d} className="text-[10px] font-bold text-zinc-400 uppercase">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div 
              key={i} 
              className={cn(
                "aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all",
                !day ? "invisible" : "hover:bg-orange-50 cursor-default",
                day === today.getDate() && month === today.getMonth() && year === today.getFullYear() 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                  : "text-zinc-600"
              )}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const leaveData = user ? [
    { name: 'Annual', value: user.leaveQuotas.annual - user.usedLeaves.annual, color: '#f97316' },
    { name: 'Sick', value: user.leaveQuotas.sick - user.usedLeaves.sick, color: '#ef4444' },
    { name: 'Casual', value: user.leaveQuotas.casual - user.usedLeaves.casual, color: '#3b82f6' },
    { name: 'Short', value: user.leaveQuotas.short - user.usedLeaves.short, color: '#10b981' },
  ] : [];

  const attendanceData = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
  ];

  attendance.forEach(r => {
    const day = new Date(r.date).toLocaleDateString([], { weekday: 'short' });
    const data = attendanceData.find(d => d.day === day);
    if (data && r.checkIn && r.checkOut) {
      const diff = new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime();
      data.hours = Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
    }
  });

  if (loading) return <div className="p-8 text-center text-zinc-400">Loading your workspace...</div>;

  const greeting = getGreeting();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-8 text-white shadow-xl shadow-orange-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{greeting.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-black">{greeting.text}, {user?.name.split(' ')[0]}!</h1>
                      <p className="text-orange-100 font-bold">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-5xl font-black tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                      <p className="text-xs font-bold text-orange-200 uppercase tracking-widest">Current Time</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-orange-50 opacity-90 font-medium max-w-md mb-8">
                {user?.role === 'employee' 
                  ? `You have ${user.leaveQuotas.annual - user.usedLeaves.annual} annual leave days remaining. Your current performance score is ${user.performanceScore}%.`
                  : `Administrative Portal: You have full control over ${user?.role === 'owner' || user?.role === 'super' ? 'HR and Employee' : 'Employee'} management.`}
              </p>

              <div className="flex flex-wrap gap-4">
                {user?.role === 'employee' && (
                  <>
                    {!isCheckedIn ? (
                      <button 
                        onClick={handleCheckIn}
                        className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-50 transition-all shadow-lg"
                      >
                        <ArrowUpRight size={20} />
                        Check In Now
                      </button>
                    ) : !isCheckedOut ? (
                      <button 
                        onClick={handleCheckOut}
                        className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg"
                      >
                        <ArrowDownRight size={20} />
                        Check Out
                      </button>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                        <UserCheck size={20} />
                        Shift Completed
                      </div>
                    )}
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-orange-400/30 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-400/40 transition-all"
                    >
                      <Plus size={20} />
                      Request Leave
                    </button>
                  </>
                )}
                {(user?.role === 'hr' || user?.role === 'owner' || user?.role === 'super') && (
                  <div className="flex gap-4">
                    <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                      <ShieldCheck size={20} />
                      {user.role.toUpperCase()} Access
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-orange-400/30 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-400/40 transition-all"
                    >
                      <Plus size={20} />
                      Request Personal Leave
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-orange-400/20 rounded-full blur-2xl"></div>
          </div>

          {/* Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-orange-500" />
                  Leave Balances
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {leaveData.map(item => (
                  <div key={item.name} className="text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.name}</p>
                    <p className="text-sm font-black text-zinc-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Timer size={18} className="text-orange-500" />
                  Weekly Activity
                </h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#fff7ed' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="hours" fill="#f97316" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-zinc-400 mt-4 font-medium">
                {attendance.length > 0 ? `Last check-in: ${formatDate(attendance[attendance.length-1].checkIn)}` : 'No attendance records yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Performance</p>
              <p className="text-2xl font-black text-orange-500">{user?.performanceScore}%</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Net Pay</p>
              <p className="text-2xl font-black text-zinc-900">LKR {user?.net.toLocaleString()}</p>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                <ListTodo size={18} className="text-orange-500" />
                Daily Tasks
              </h3>
            </div>
            <form onSubmit={addTask} className="mb-6">
              <div className="relative">
                <input 
                  name="taskTitle"
                  type="text" 
                  placeholder="Add a new task..." 
                  className="w-full pl-4 pr-12 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all">
                  <Plus size={16} />
                </button>
              </div>
            </form>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px]">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-zinc-400 font-medium">No tasks for today</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "group flex items-center gap-3 p-4 rounded-2xl border transition-all",
                      task.completed ? "bg-zinc-50 border-zinc-100 opacity-60" : "bg-white border-zinc-100 hover:border-orange-200"
                    )}
                  >
                    <div 
                      onClick={() => toggleTask(task.id!)}
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                        task.completed ? "bg-orange-500 border-orange-500 text-white" : "border-zinc-300 group-hover:border-orange-400"
                      )}
                    >
                      {task.completed && <CheckCircle2 size={12} />}
                    </div>
                    <span 
                      onClick={() => toggleTask(task.id!)}
                      className={cn("flex-1 text-sm font-medium cursor-pointer", task.completed ? "line-through text-zinc-400" : "text-zinc-700")}
                    >
                      {task.title}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id!)}
                      className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Calendar Widget */}
          {renderCalendar()}
        </div>
      </div>

      {/* Leave History Table */}
      <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-zinc-900">Recent Leave Requests</h2>
          <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Duration</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reason</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-zinc-400 font-medium">No leave requests found</td>
                </tr>
              ) : (
                requests.slice(0, 5).map((request) => (
                  <tr key={request.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                          <Briefcase size={16} />
                        </div>
                        <span className="font-bold text-zinc-900">{request.leaveType}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-zinc-700">{formatDate(request.startDate)}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">To {formatDate(request.endDate)}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-zinc-500 max-w-xs truncate font-medium">{request.reason}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        request.status === 'Approved' ? "bg-green-50 text-green-700 border-green-100" :
                        request.status === 'Rejected' ? "bg-red-50 text-red-700 border-red-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                      )}>
                        {request.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-zinc-900">Apply for Leave</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmitLeave} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                  >
                    {['Annual', 'Sick', 'Casual', 'Short'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Reason</label>
                  <textarea
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all resize-none font-medium"
                    placeholder="Briefly explain the reason for your leave..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Attachment (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="leave-image"
                    />
                    <label
                      htmlFor="leave-image"
                      className="flex items-center justify-center gap-2 w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group"
                    >
                      <Camera size={20} className="text-zinc-400 group-hover:text-orange-500" />
                      <span className="text-sm font-bold text-zinc-500 group-hover:text-orange-600">
                        {leaveImage ? 'Image Selected' : 'Upload Image/Document'}
                      </span>
                    </label>
                    {leaveImage && (
                      <div className="mt-4 relative inline-block">
                        <img src={leaveImage} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-zinc-100" />
                        <button 
                          type="button"
                          onClick={() => setLeaveImage(null)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
