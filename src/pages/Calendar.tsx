import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  MapPin, Clock, Info, Gift, PartyPopper
} from 'lucide-react';
import { HOLIDAYS } from '../constants';
import { cn } from '../lib/utils';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isHoliday = (day: number) => {
    return HOLIDAYS.find(h => {
      const hDate = new Date(h.date);
      return hDate.getDate() === day && hDate.getMonth() === month && hDate.getFullYear() === year;
    });
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">Holiday Calendar</h1>
          <p className="text-zinc-500 font-medium">Public holidays and company events</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-50 rounded-xl transition-all text-zinc-400 hover:text-zinc-900">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-black text-zinc-900 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-50 rounded-xl transition-all text-zinc-400 hover:text-zinc-900">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {blanks.map(b => <div key={`blank-${b}`} className="aspect-square" />)}
            {days.map(day => {
              const holiday = isHoliday(day);
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
              
              return (
                <div 
                  key={day} 
                  className={cn(
                    "aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all group cursor-default",
                    isToday ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "hover:bg-zinc-50",
                    holiday ? "bg-orange-50/50" : ""
                  )}
                >
                  <span className={cn("text-sm font-black", holiday && !isToday ? "text-orange-600" : "")}>
                    {day}
                  </span>
                  {holiday && (
                    <div className="absolute bottom-2 w-1 h-1 rounded-full bg-orange-500" />
                  )}
                  {holiday && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-32 p-2 bg-zinc-900 text-white text-[10px] font-bold rounded-lg text-center shadow-xl">
                      {holiday.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Holidays List */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white">
            <div className="flex items-center gap-3 mb-6">
              <PartyPopper className="text-orange-400" size={24} />
              <h3 className="font-black text-lg">Upcoming Holidays</h3>
            </div>
            <div className="space-y-6">
              {HOLIDAYS.filter(h => new Date(h.date) >= new Date()).slice(0, 4).map((h, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-black uppercase text-orange-400">
                      {new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black leading-none">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{h.title}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Public Holiday</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-zinc-400" size={20} />
              <h3 className="font-black text-zinc-900">Calendar Info</h3>
            </div>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              All listed holidays are observed as non-working days. For branch-specific events, please refer to your local manager.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
