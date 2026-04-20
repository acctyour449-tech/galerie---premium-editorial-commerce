/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { User, ReceiptText, MapPin, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row gap-16 animate-in fade-in duration-700">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold font-headline text-on-surface mb-8 tracking-tighter uppercase tracking-[0.2em]">Account</h2>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-6 py-4 rounded-xl bg-surface-container-lowest text-primary font-bold shadow-sm border border-black/5">
            <User size={20} className="fill-current" />
            <span>Personal Info</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-4 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all font-medium group">
            <ReceiptText size={20} className="group-hover:text-on-surface transition-colors" />
            <span>My Orders</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-4 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all font-medium group">
            <MapPin size={20} className="group-hover:text-on-surface transition-colors" />
            <span>Addresses</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-4 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all font-medium group">
            <Shield size={20} className="group-hover:text-on-surface transition-colors" />
            <span>Security</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-4 rounded-xl text-error hover:bg-error/5 transition-all font-medium group mt-8 border border-transparent hover:border-error/20"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col gap-12">
        <header>
          <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">Personal Info</h1>
          <p className="text-on-surface-variant text-lg font-medium italic opacity-70">Manage your profile details and account preferences.</p>
        </header>

        {/* Profile Card */}
        <section className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col md:flex-row items-center gap-10 border border-black/5 shadow-ambient relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-transparent opacity-30"></div>
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-md cursor-pointer">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvJ_fnFyltZgU7aZz3Ofb8rHN1RVGXfEW3-pdTIT9l0a2jDmYc0jCNDoYYnpVgsFg_OV-ytZ-T8hdptcXagxRaKnwg85iz_ySYWBvfyJHfLCI_y0wugzMUbjE0d3u8d_lOe6i_qlIy2pHfRlxCV65s-spna--tuKKi3vBk83UQvz1IeaODqNJSGSeS9KonOEdr8Gb_JqxFKCuj-CfQDK-gbq5q_mp0_mu2kOBrdoMpfgTmmqCc9d3QId59Q8cc2-bcT3-TBLIci8I"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative flex-grow text-center md:text-left">
            <h2 className="text-3xl font-bold text-on-surface mb-2">Jane Doe</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="bg-surface-container-low px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Premium Member</span>
              <span className="bg-surface-container-low px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Joined Oct 2021</span>
            </div>
          </div>
          <button className="relative px-8 py-3 bg-on-surface text-surface rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
            Update Photo
          </button>
        </section>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-surface-container-low/30 p-8 rounded-2xl border border-black/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Contact Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-60">Secondary Email</p>
                <p className="text-sm font-semibold text-on-surface">jane.work@example.com</p>
              </div>
              <div className="h-px bg-surface-container-high w-full"></div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-60">Phone</p>
                <p className="text-sm font-semibold text-on-surface">+1 (555) 000-0000</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low/30 p-8 rounded-2xl border border-black/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Preferences</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-on-surface">Newsletters</span>
                <div className="w-10 h-5 bg-primary rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="h-px bg-surface-container-high w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-on-surface">Two-Factor Auth</span>
                <div className="w-10 h-5 bg-surface-container-high rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Danger Zone */}
        <section className="mt-8 pt-8 border-t border-surface-container-high">
          <button className="text-error font-bold text-xs uppercase tracking-widest hover:opacity-70 transition-opacity border border-error/20 px-8 py-4 rounded-lg bg-error/5">
            Deactivate Account
          </button>
        </section>
      </div>
    </div>
  );
}
