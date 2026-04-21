import { motion } from 'motion/react';
import { Calendar, Plus, TrendingUp, TrendingDown, ShoppingBag, Users, ChevronRight, Lightbulb, Activity, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import SellerLayout from '../components/seller/SellerLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: any[];
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    setIsLoading(true);

    // Total products for this seller
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id);

    // Orders involving this seller's products
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('*, order:orders(order_number, status, created_at, buyer:profiles(name, email))')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    const totalRevenue = orderItems?.reduce((sum, item) => sum + item.total_price, 0) || 0;
    const uniqueOrders = new Set(orderItems?.map(i => i.order_id)).size;

    // Recent orders (last 5)
    const recentMap = new Map();
    orderItems?.forEach(item => {
      if (!recentMap.has(item.order_id)) {
        recentMap.set(item.order_id, {
          ...item.order,
          order_id: item.order_id,
          items: [item],
          itemTotal: item.total_price,
        });
      } else {
        const existing = recentMap.get(item.order_id);
        existing.items.push(item);
        existing.itemTotal += item.total_price;
      }
    });

    const recentOrders = Array.from(recentMap.values()).slice(0, 5);

    setStats({
      totalRevenue,
      totalOrders: uniqueOrders,
      totalProducts: productsCount || 0,
      recentOrders,
    });
    setIsLoading(false);
  };

  return (
    <SellerLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-12 animate-in fade-in duration-700">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60">Overview</p>
            <h2 className="text-[2rem] font-headline font-semibold text-on-surface tracking-tighter leading-tight">Performance</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container-low text-on-surface px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={18} />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <Link
              to="/seller/products/new"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              New Product
            </Link>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-ambient transition-all duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2 opacity-60">Total Revenue</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tighter">
                  {isLoading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <CreditCard size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs relative z-10 font-bold uppercase tracking-widest text-[#00837c]">
              <TrendingUp size={16} />
              <span>All time</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-ambient transition-all duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2 opacity-60">Total Orders</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tighter">
                  {isLoading ? '...' : stats.totalOrders}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <ShoppingBag size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs relative z-10 font-bold uppercase tracking-widest text-[#00837c]">
              <TrendingUp size={16} />
              <span>All time</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-black/5 shadow-sm relative overflow-hidden group hover:shadow-ambient transition-all duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2 opacity-60">Active Products</p>
                <h3 className="text-4xl font-headline font-bold text-on-surface tracking-tighter">
                  {isLoading ? '...' : stats.totalProducts}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                <Users size={24} />
              </div>
            </div>
            <Link to="/seller/products" className="flex items-center gap-2 text-xs relative z-10 font-bold uppercase tracking-widest text-primary">
              Manage <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-surface-container-lowest rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
            <h3 className="text-xl font-bold font-headline text-on-surface uppercase tracking-widest opacity-80 leading-none">Recent Orders</h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-on-surface-variant opacity-40 text-sm uppercase tracking-widest">Loading...</div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-on-surface-variant opacity-20 mb-4" />
              <p className="text-on-surface-variant opacity-40 font-medium uppercase tracking-widest text-xs">No orders yet</p>
              <p className="text-on-surface-variant opacity-30 text-xs mt-2">Orders will appear here once customers purchase your products</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant border-b border-surface-container-high/50 font-bold uppercase tracking-widest">
                    <th className="py-6 px-8">Order</th>
                    <th className="py-6 px-8">Customer</th>
                    <th className="py-6 px-8">Status</th>
                    <th className="py-6 px-8 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-on-surface font-body">
                  {stats.recentOrders.map(order => (
                    <tr key={order.order_id} className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-high/20">
                      <td className="py-4 px-8 font-bold text-xs tracking-widest text-on-surface-variant opacity-60">
                        #{order.order_number || order.order_id?.slice(0, 8)}
                      </td>
                      <td className="py-4 px-8 text-xs">{order.buyer?.name || order.buyer?.email || 'Customer'}</td>
                      <td className="py-4 px-8">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          'bg-surface-container text-on-surface-variant'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-right font-bold text-xs">${order.itemTotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
