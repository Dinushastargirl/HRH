import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, MoreVertical, Edit2, Trash2, 
  Mail, Phone, MapPin, Calendar as CalendarIcon,
  Download, Upload, UserPlus, XCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { mockService } from '../mockService';
import { cn, formatDate } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function Employees() {
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<UserProfile | null>(null);

  const branches = ['All', ...new Set(mockService.getEmployees().map(e => e.branch))];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    setEmployees(mockService.getEmployees());
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                         emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = filterBranch === 'All' || emp.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  const handleDelete = (uid: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      mockService.deleteEmployee(uid);
      toast.success('Employee deleted');
      loadEmployees();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Employees</h1>
          <p className="text-zinc-500 font-medium">Manage your workforce and their profiles</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-zinc-200 text-zinc-600 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => { setEditingEmp(null); setIsModalOpen(true); }}
            className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
          >
            <UserPlus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-orange-500"
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-600 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <motion.div 
            layout
            key={emp.uid}
            className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xl">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-zinc-900 leading-tight">{emp.name}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{emp.branch}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-2 text-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all">
                  <MoreVertical size={20} />
                </button>
                {/* Dropdown would go here */}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-zinc-500">
                <Mail size={16} className="text-zinc-300" />
                <span className="text-xs font-medium truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <CalendarIcon size={16} className="text-zinc-300" />
                <span className="text-xs font-medium">Joined {formatDate(emp.joinDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500">
                <MapPin size={16} className="text-zinc-300" />
                <span className="text-xs font-medium">{emp.branch} Branch</span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Performance</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500" 
                      style={{ width: `${emp.performanceScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-zinc-900">{emp.performanceScore}%</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => { setEditingEmp(emp); setIsModalOpen(true); }}
                  className="p-2 bg-zinc-50 text-zinc-600 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(emp.uid)}
                  className="p-2 bg-zinc-50 text-zinc-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
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
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-zinc-900">
                  {editingEmp ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all">
                  <XCircle size={24} />
                </button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = Object.fromEntries(formData.entries()) as any;
                  
                  const newEmp: UserProfile = {
                    uid: editingEmp?.uid || `emp-${Date.now()}`,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    branch: data.branch,
                    joinDate: data.joinDate,
                    basic: Number(data.basic),
                    epf: Number(data.epf),
                    etf: Number(data.etf),
                    allowances: Number(data.allowances),
                    deductions: Number(data.deductions),
                    net: Number(data.basic) + Number(data.allowances) - Number(data.deductions),
                    performanceScore: editingEmp?.performanceScore || 0,
                    leaveQuotas: editingEmp?.leaveQuotas || { annual: 20, sick: 10, casual: 7, short: 2 },
                    usedLeaves: editingEmp?.usedLeaves || { annual: 0, sick: 0, casual: 0, short: 0 },
                  };

                  mockService.saveEmployee(newEmp);
                  toast.success(editingEmp ? 'Employee updated' : 'Employee added');
                  setIsModalOpen(false);
                  loadEmployees();
                }}
                className="p-8 space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input name="name" defaultValue={editingEmp?.name} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input name="email" type="email" defaultValue={editingEmp?.email} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Role</label>
                    <select name="role" defaultValue={editingEmp?.role || 'employee'} className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-600 outline-none">
                      <option value="employee">Employee</option>
                      <option value="hr">HR Manager</option>
                      <option value="owner">Owner</option>
                      <option value="super">Super Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Branch</label>
                    <input name="branch" defaultValue={editingEmp?.branch} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Join Date</label>
                    <input name="joinDate" type="date" defaultValue={editingEmp?.joinDate} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Basic Salary (LKR)</label>
                    <input name="basic" type="number" defaultValue={editingEmp?.basic} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">EPF (LKR)</label>
                    <input name="epf" type="number" defaultValue={editingEmp?.epf} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">ETF (LKR)</label>
                    <input name="etf" type="number" defaultValue={editingEmp?.etf} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Allowances (LKR)</label>
                    <input name="allowances" type="number" defaultValue={editingEmp?.allowances} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Deductions (LKR)</label>
                    <input name="deductions" type="number" defaultValue={editingEmp?.deductions} required className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 bg-zinc-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100">
                    {editingEmp ? 'Save Changes' : 'Create Employee'}
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
