/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Plus, TrendingUp, TrendingDown, ShoppingBag, Users, ChevronRight, Lightbulb, Activity, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import SellerLayout from '../components/seller/SellerLayout';

export default function SellerDashboard() {
  return (
    <SellerLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-12 animate-in fade-in duration-700">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60">Overview</p>
            <h2 className="text-[2rem] font-headline font-semibold text-on-surface tracking-tighter leading-tight">Today's Performance</h2>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-low text-on-surface px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-all flex items-center gap-2">
              <Calendar size={18} />
              Today, Oct 24
            </button>
            <Link 
              to="/seller/products/new" 
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              New Product
            </Link>
          </div>
        </header>

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Sales */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-ambient transition-all duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2 opacity-60">Total Sales</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tighter">$24,590.00</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <CreditCard size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs relative z-10 font-bold uppercase tracking-widest text-[#00837c]">
              <TrendingUp size={16} />
              <span>+12.5%</span>
              <span className="text-on-surface-variant opacity-40 ml-1">vs last week</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary-fixed/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Orders */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-ambient transition-all duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2 opacity-60">Total Orders</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tighter">342</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <ShoppingBag size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs relative z-10 font-bold uppercase tracking-widest text-[#00837c]">
              <TrendingUp size={16} />
              <span>+5.2%</span>
              <span className="text-on-surface-variant opacity-40 ml-1">vs last week</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-fixed/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Visitors */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-ambient transition-all duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2 opacity-60">Visitors</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tighter">12.4k</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                <Users size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs relative z-10 font-bold uppercase tracking-widest text-error">
              <TrendingDown size={16} />
              <span>-1.4%</span>
              <span className="text-on-surface-variant opacity-40 ml-1">vs last week</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-surface-variant/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Content Area: Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
              <h3 className="text-xl font-bold font-headline text-on-surface uppercase tracking-widest opacity-80 leading-none">Recent Activity</h3>
              <button className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant border-b border-surface-container-high/50 font-bold uppercase tracking-widest">
                    <th className="py-6 px-8">Order ID</th>
                    <th className="py-6 px-8">Product</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-on-surface font-body italic">
                  {[
                    { id: 'ORD-9842', name: 'Minimalist Watch V2', status: 'Completed', amount: '$299.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjB7zs7K7r7eF6DXmSdoCz4J_yY5-cfZZbxJNEpGalCBlTjBGBRuBZk2hoWTYThprXGyyYDmVCdxEzvRnMUILQ0kt5CzwBOfq3UeUCjQiflTyRDNtQ80E4eFKicEs6t1A7XsiK83tjFZENxqVb053mrw70I75YYkB8ZnF4HOHu7nMHSYqtgJa_vLNtyeJ6hBQjSWsPuoi-BzpUWlRO1Bt-UFzEBX8gj9JU4e1WXi1rTxng5BkPn6sMudvclnuS9WHQQmicfwdeJz4' },
                    { id: 'ORD-9841', name: 'Studio Headphones', status: 'Processing', amount: '$349.50', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEq18Fk3lbiKl89q97f1N0oHVu224yuug0a-N5RmrAW4MK_5SMEw6nPj79i2TyowQnDbc8V219kCMbp552tFZrnwYRNtzxYgkIsTiK-vw24_RhLBzWLfmc588KulhqwoZMMmNQH0VSMzmeu7FTIaRGHQ_OEYgMLzk6l1q7KdnQwlidP3grhKOZn1I0kwkJTaWwSdZZ4sB4yUwxgrawrOLH3RK3vDHTQrpewY4HAG9PDoJSYwiOivcvmwtQzg_hPusLmXiy9B1bwpI' },
                    { id: 'ORD-9840', name: 'Ovoid Vase', status: 'Completed', amount: '$180.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgq2_7NWaiXb8qvrxd1im4HJdc8DLnZGgnvTIpKbkSEFvYKEl9wwFjM5-Q6AvVF5rLNRU4lc20cDVos_KFBjktQwHZNHQOymxgoTeEWirtrF1cWfFdSWctv1htFz2I1Ut_wsR4gcEkFaGchjMfE5CWw6mW1-U0MH9yDTTGbMs-YUTIa5kQQ9cr0y5dTYpFIiI56Uh7KTsFcgjJ60RpFwv_m1cXq04msQHmi5wCUT-QpaWb47upayb6L3AnZEjiFiR_oFNdKDaTdo0' }
                  ].map((order, idx) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-high/20 group cursor-pointer">
                      <td className="py-4 px-8 font-bold text-xs tracking-widest text-on-surface-variant opacity-60">#{order.id}</td>
                      <td className="py-4 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-12 rounded-lg bg-surface-container-low overflow-hidden shrink-0 border border-black/5">
                            <img src={order.img} alt={order.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <span className="font-semibold text-xs tracking-tight">{order.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'Completed' ? 'bg-tertiary-container/10 text-tertiary-container' : 'bg-secondary-container/30 text-on-secondary-container'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right font-bold text-xs tracking-tight">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Quick Actions */}
            <div className="bg-surface-container-low rounded-3xl p-8 border-none flex flex-col gap-8">
              <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-widest opacity-80 leading-none">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Create Promotion', icon: <Plus size={18} />, color: 'bg-primary-fixed/50 text-on-primary-fixed' },
                  { label: 'Update Inventory', icon: <Activity size={18} />, color: 'bg-secondary-fixed/50 text-on-secondary-fixed' },
                  { label: 'Customer Messages', icon: <Users size={18} />, color: 'bg-tertiary-fixed-dim/30 text-on-tertiary-fixed-variant', badge: 3 }
                ].map((action, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-5 rounded-2xl bg-surface-container-lowest border border-black/5 hover:bg-surface group transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color}`}>
                        {action.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-on-surface">{action.label}</span>
                      {action.badge && (
                        <span className="bg-primary text-on-primary text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">{action.badge}</span>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Insights */}
            <div className="bg-gradient-to-br from-surface-container-low to-surface-container rounded-3xl p-8 border border-black/5 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-2">Inventory Insight</h4>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-60">"Ovoid Vase" views are up 45% this week. We recommend a limited restock to maintain exclusive momentum.</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group/btn">
                  Take Action
                  <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <Activity size={120} className="absolute -right-8 -bottom-8 opacity-5 text-on-surface pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
