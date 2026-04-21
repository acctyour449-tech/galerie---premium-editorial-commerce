import { motion } from 'motion/react';
import { User, ReceiptText, MapPin, Shield, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, Order } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

type Tab = 'profile' | 'orders' | 'addresses' | 'security';

export default function Profile() {
  const { user, profile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoadingOrders(true);
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
    setIsLoadingOrders(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveName = async () => {
    await updateProfile({ name: editName });
    setIsEditing(false);
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-surface-container text-on-surface-variant';
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row gap-16 animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold font-headline text-on-surface mb-8 tracking-tighter uppercase tracking-[0.2em]">Account</h2>
        <nav className="flex flex-col gap-2">
          {[
            { id: 'profile', label: 'Personal Info', icon: <User size={20} /> },
            { id: 'orders', label: 'My Orders', icon: <ReceiptText size={20} /> },
            { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
            { id: 'security', label: 'Security', icon: <Shield size={20} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all font-medium ${
                activeTab === item.id
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm border border-black/5'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            <header>
              <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">Personal Info</h1>
              <p className="text-on-surface-variant text-lg font-medium italic opacity-70">Manage your profile details.</p>
            </header>

            <section className="bg-surface-container-lowest p-10 rounded-3xl flex flex-col md:flex-row items-center gap-10 border border-black/5 shadow-ambient relative overflow-hidden">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-md">
                {profile?.avatar_url ? (
                  <img alt="Profile" className="w-full h-full object-cover" src={profile.avatar_url} referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                    {profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-grow text-center md:text-left">
                {isEditing ? (
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="text-2xl font-bold bg-surface-container-low px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={handleSaveName} className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-widest">Save</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold uppercase tracking-widest">Cancel</button>
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold text-on-surface mb-2">{profile?.name || 'Anonymous'}</h2>
                )}
                <p className="text-on-surface-variant text-sm mb-4">{user?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="bg-surface-container-low px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-on-surface-variant capitalize">
                    {profile?.role} Account
                  </span>
                  <span className="bg-surface-container-low px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                    {profile?.tier || 'Standard'} Tier
                  </span>
                  <span className="bg-surface-container-low px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                    Joined {new Date(profile?.member_since || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => { setIsEditing(true); setEditName(profile?.name || ''); }}
                  className="px-8 py-3 bg-on-surface text-surface rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  Edit Name
                </button>
              )}
            </section>

            <section className="bg-surface-container-low/30 p-8 rounded-2xl border border-black/5 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-60">Email</p>
                  <p className="text-sm font-semibold text-on-surface">{user?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-60">Auth Provider</p>
                  <p className="text-sm font-semibold text-on-surface capitalize">
                    {user?.app_metadata?.provider || 'Email'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-60">User ID</p>
                  <p className="text-sm font-mono text-on-surface-variant opacity-60">{user?.id?.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-60">Last Sign In</p>
                  <p className="text-sm font-semibold text-on-surface">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            <header>
              <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">My Orders</h1>
              <p className="text-on-surface-variant text-lg font-medium italic opacity-70">Track and manage your purchases.</p>
            </header>

            {isLoadingOrders ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-32 text-center">
                <Package size={64} className="mx-auto text-on-surface-variant opacity-20 mb-8" />
                <p className="text-on-surface-variant font-medium mb-4">No orders yet</p>
                <a href="/shop" className="text-primary font-bold underline underline-offset-4">Start shopping</a>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-surface-container-lowest p-8 rounded-2xl border border-black/5 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">Order</p>
                        <p className="font-bold text-on-surface">#{order.order_number}</p>
                        <p className="text-xs text-on-surface-variant opacity-60 mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-on-surface mt-2">${order.total_amount?.toFixed(2)}</p>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="border-t border-surface-container-low pt-6 space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-on-surface font-medium">{item.product_name} × {item.quantity}</span>
                            <span className="text-on-surface-variant">${item.total_price?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <>
            <header>
              <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">Addresses</h1>
              <p className="text-on-surface-variant text-lg font-medium italic opacity-70">Manage your saved delivery addresses.</p>
            </header>
            <div className="py-16 text-center text-on-surface-variant opacity-40 font-medium uppercase tracking-widest text-sm">
              Saved addresses will appear here after checkout.
            </div>
          </>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <>
            <header>
              <h1 className="text-5xl font-bold tracking-tighter text-on-surface mb-2">Security</h1>
              <p className="text-on-surface-variant text-lg font-medium italic opacity-70">Manage your account security settings.</p>
            </header>
            <div className="bg-surface-container-low/30 p-8 rounded-2xl border border-black/5 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-on-surface">Password</p>
                  <p className="text-sm text-on-surface-variant opacity-60 mt-1">Last changed: Never</p>
                </div>
                <button className="px-6 py-3 bg-surface-container-low rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-all">
                  Change Password
                </button>
              </div>
            </div>
            <section className="pt-8 border-t border-surface-container-high">
              <button className="text-error font-bold text-xs uppercase tracking-widest hover:opacity-70 transition-opacity border border-error/20 px-8 py-4 rounded-lg bg-error/5">
                Deactivate Account
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
