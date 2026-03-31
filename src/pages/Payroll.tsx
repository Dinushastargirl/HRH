import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Download, Search, Filter, 
  ArrowUpRight, ArrowDownRight, DollarSign,
  CheckCircle2, Clock, FileText, Plus
} from 'lucide-react';
import { PayrollRecord, UserProfile } from '../types';
import { mockService } from '../mockService';
import { useAuth } from '../hooks/useAuth';
import { cn, formatDate } from '../lib/utils';
import { motion } from 'motion/react';

export default function Payroll() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    if (user?.role === 'hr' || user?.role === 'owner' || user?.role === 'super') {
      setPayrolls(mockService.getPayroll());
    } else {
      setPayrolls(mockService.getPayroll(user?.uid));
    }
  };

  const filteredPayrolls = payrolls.filter(p => {
    const matchesSearch = p.userName.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = p.month === Number(filterMonth);
    return matchesSearch && matchesMonth;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalPayout = filteredPayrolls.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Payroll</h1>
          <p className="text-zinc-500 font-medium">View and manage salary distributions</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-zinc-200 text-zinc-600 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all">
            <Download size={18} />
            Export Payslips
          </button>
          {(user?.role === 'hr' || user?.role === 'super') && (
            <button 
              onClick={() => {
                mockService.generatePayroll(new Date().getMonth(), new Date().getFullYear());
                loadData();
              }}
              className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-100"
            >
              <Plus size={18} />
              Generate Monthly Payroll
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <DollarSign size={18} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Payout</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">LKR {totalPayout.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paid Records</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{filteredPayrolls.filter(p => p.status === 'Paid').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={18} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pending</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{filteredPayrolls.filter(p => p.status === 'Pending').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by employee name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        <select 
          value={filterMonth}
          onChange={(e) => setFilterMonth(Number(e.target.value))}
          className="px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-600 outline-none focus:ring-2 focus:ring-orange-500"
        >
          {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Month</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Basic</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Allowances</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Deductions</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net Salary</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredPayrolls.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 font-black text-xs">
                        {p.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{p.userName}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-zinc-700">{months[p.month]} {p.year}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-zinc-900">
                    LKR {p.basic.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-green-600">
                    +LKR {p.allowances.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-red-600">
                    -LKR {p.deductions.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-base font-black text-zinc-900">LKR {p.netSalary.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      p.status === 'Paid' ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {p.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
