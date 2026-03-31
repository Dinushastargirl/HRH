import React, { useState } from 'react';
import { 
  User, Mail, MapPin, Calendar, 
  Briefcase, Shield, LogOut, Edit3,
  Phone, Globe, Github, Linkedin, Save, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../lib/utils';
import { mockService } from '../mockService';
import { toast } from 'sonner';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+94 77 123 4567', // Mock phone
  });

  if (!user) return null;

  const handleSave = () => {
    mockService.saveEmployee({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
    // In a real app, we'd refresh the auth user here
    window.location.reload(); 
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">My Profile</h1>
          <p className="text-zinc-500 font-medium">Manage your personal information and settings</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all"
            >
              <X size={18} />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-100 flex items-center justify-center text-zinc-400 font-black text-4xl uppercase">
                {user.name.charAt(0)}
              </div>
            </div>
            <h2 className="text-2xl font-black text-zinc-900">{user.name}</h2>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">{user.role} • {user.branch}</p>
            
            <div className="space-y-3">
              <button className="w-full py-4 bg-zinc-50 text-zinc-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all">
                <Shield size={18} />
                Security Settings
              </button>
              <button 
                onClick={logout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="font-black text-lg mb-6">Work Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department</p>
                  <p className="font-bold text-sm">Operations</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Joined Date</p>
                  <p className="font-bold text-sm">{formatDate(user.joinDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-green-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                  <p className="font-bold text-sm">{user.branch} Branch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h3 className="text-xl font-black text-zinc-900 mb-8">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                ) : (
                  <div className="px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100">
                    {user.name}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                {isEditing ? (
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                ) : (
                  <div className="px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100">
                    {user.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                ) : (
                  <div className="px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100">
                    {formData.phone}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Employee ID</label>
                <div className="px-5 py-4 bg-zinc-50 rounded-2xl text-sm font-bold text-zinc-700 border border-zinc-100">
                  {user.uid}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
            <h3 className="text-xl font-black text-zinc-900 mb-8">Social & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#" className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <Linkedin size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-600">LinkedIn</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <Github size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-600">GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <Globe size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-600">Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
