import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Filter, 
  Search, Calendar, User, MessageSquare,
  AlertCircle, Check, X, Camera, Plus
} from 'lucide-react';
import { LeaveRequest, UserRole } from '../types';
import { mockService } from '../mockService';
import { useAuth } from '../hooks/useAuth';
import { cn, formatDate } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function Leaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLeaves();
  }, [user]);

  const loadLeaves = () => {
    // If HR or Owner, see all. If employee, see own.
    if (user?.role === 'hr' || user?.role === 'owner' || user?.role === 'super') {
      setLeaves(mockService.getLeaves());
    } else {
      setLeaves(mockService.getLeaves(user?.uid));
    }
  };

  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    if (!user) return;
    mockService.updateLeave(id, status, user.name);
    toast.success(`Leave request ${status.toLowerCase()}`);
    loadLeaves();
  };

  const filteredLeaves = leaves.filter(l => {
    const matchesFilter = filter === 'All' || l.status === filter;
    const matchesSearch = l.userName.toLowerCase().includes(search.toLowerCase()) || 
                         l.leaveType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const canApprove = (req: LeaveRequest) => {
    if (!user) return false;
    // OWNER approves Super Admin & HR
    if (user.role === 'owner') {
      return req.userRole === 'super' || req.userRole === 'hr';
    }
    // HR approves Employees
    if (user.role === 'hr') {
      return req.userRole === 'employee';
    }
    // SUPER ADMIN approves Employees (as fallback)
    if (user.role === 'super') {
      return req.userRole === 'employee';
    }
    return false;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Leave Requests</h1>
          <p className="text-zinc-500 font-medium">Manage and track time-off applications</p>
        </div>
        {user?.role === 'employee' && (
          <button 
            onClick={() => window.location.href = '/'} // Redirect to dashboard where modal is
            className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
          >
            <Plus size={18} />
            New Request
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: leaves.length, icon: Calendar, color: 'text-zinc-600', bg: 'bg-zinc-100' },
          { label: 'Pending', value: leaves.filter(l => l.status === 'Pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by employee or leave type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                filter === f 
                  ? "bg-zinc-900 text-white" 
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredLeaves.map((req) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={req.id}
              className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 font-black">
                  {req.userName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{req.userName}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{req.userRole}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-zinc-900">{req.leaveType}</p>
                    <p className="text-[10px] font-bold text-zinc-400">{formatDate(req.startDate)} - {formatDate(req.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Reason</p>
                    <p className="text-xs font-medium text-zinc-600 line-clamp-1">{req.reason}</p>
                  </div>
                </div>

                {req.imageUrl && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                      <Camera size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Attachment</p>
                      <a 
                        href={req.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-orange-500 hover:underline"
                      >
                        View Image
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                    req.status === 'Approved' ? "bg-green-50 text-green-700 border-green-100" :
                    req.status === 'Rejected' ? "bg-red-50 text-red-700 border-red-100" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  )}>
                    {req.status}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {req.status === 'Pending' && canApprove(req) ? (
                  <>
                    <button 
                      onClick={() => handleAction(req.id!, 'Approved')}
                      className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(req.id!, 'Rejected')}
                      className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : req.status === 'Pending' && !canApprove(req) ? (
                  <div className="flex items-center gap-2 text-zinc-400 px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                    <AlertCircle size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Approval</span>
                  </div>
                ) : (
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Processed by {req.approvedBy}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredLeaves.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-zinc-100">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No requests found</h3>
            <p className="text-zinc-500 font-medium">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
