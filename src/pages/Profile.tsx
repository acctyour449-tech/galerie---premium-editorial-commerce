import { motion } from 'motion/react';
import { User, ReceiptText, MapPin, Shield, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, Order, Address } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, FormEvent } from 'react';

type Tab = 'profile' | 'orders' | 'addresses' | 'security';

export default function Profile() {
  const { user, profile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [securityMessage, setSecurityMessage] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isGlobalSignOutLoading, setIsGlobalSignOutLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
    if (activeTab === 'addresses' && user) {
      fetchAddresses();
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

  const fetchAddresses = async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    setAddressError('');

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      setAddressError(error.message);
    } else {
      setAddresses((data || []) as Address[]);
    }
    setIsLoadingAddresses(false);
  };

  const updateAddressField = (key: keyof typeof newAddress, value: string) => {
    setNewAddress(prev => ({ ...prev, [key]: value }));
  };

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSavingAddress(true);
    setAddressError('');
    setAddressSuccess('');

    const { error } = await supabase.from('addresses').insert({
      user_id: user.id,
      ...newAddress,
      is_default: addresses.length === 0,
    });

    if (error) {
      setAddressError(error.message);
      setIsSavingAddress(false);
      return;
    }

    setAddressSuccess('Address saved successfully.');
    setNewAddress({
      label: 'Home',
      first_name: '',
      last_name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'US',
    });
    await fetchAddresses();
    setIsSavingAddress(false);
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user) return;
    setAddressError('');

    const { error: resetError } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);

    if (resetError) {
      setAddressError(resetError.message);
      return;
    }

    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', user.id);

    if (error) {
      setAddressError(error.message);
      return;
    }
    setAddressSuccess('Default address updated.');
    await fetchAddresses();
  };

  const deleteAddress = async (addressId: string) => {
    if (!user) return;
    setAddressError('');
    setAddressSuccess('');

    const removedAddress = addresses.find(addr => addr.id === addressId);
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id);

    if (error) {
      setAddressError(error.message);
      return;
    }

    setAddressSuccess('Address removed.');
    await fetchAddresses();

    if (removedAddress?.is_default) {
      const fallback = addresses.find(addr => addr.id !== addressId);
      if (fallback) {
        await setDefaultAddress(fallback.id);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setSecurityMessage('');
    setSecurityError('');
    setIsSendingReset(true);

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setSecurityError(error.message);
    } else {
      setSecurityMessage(`Password reset email sent to ${user.email}.`);
    }
    setIsSendingReset(false);
  };

  const handleGlobalSignOut = async () => {
    setSecurityMessage('');
    setSecurityError('');
    setIsGlobalSignOutLoading(true);

    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) {
      setSecurityError(error.message);
      setIsGlobalSignOutLoading(false);
      return;
    }

    setIsGlobalSignOutLoading(false);
    navigate('/login');
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

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <form onSubmit={handleAddAddress} className="bg-surface-container-low/30 p-8 rounded-2xl border border-black/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Add New Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required value={newAddress.label} onChange={e => updateAddressField('label', e.target.value)} placeholder="Label (Home, Office...)" className="md:col-span-2 bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.first_name} onChange={e => updateAddressField('first_name', e.target.value)} placeholder="First Name" className="bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.last_name} onChange={e => updateAddressField('last_name', e.target.value)} placeholder="Last Name" className="bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.address_line1} onChange={e => updateAddressField('address_line1', e.target.value)} placeholder="Address line 1" className="md:col-span-2 bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input value={newAddress.address_line2} onChange={e => updateAddressField('address_line2', e.target.value)} placeholder="Address line 2 (optional)" className="md:col-span-2 bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.city} onChange={e => updateAddressField('city', e.target.value)} placeholder="City" className="bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.state} onChange={e => updateAddressField('state', e.target.value)} placeholder="State" className="bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.zip_code} onChange={e => updateAddressField('zip_code', e.target.value)} placeholder="ZIP code" className="bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                  <input required value={newAddress.country} onChange={e => updateAddressField('country', e.target.value)} placeholder="Country code" className="bg-surface-container-low rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {isSavingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </form>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Saved Addresses</h3>
                {isLoadingAddresses ? (
                  <div className="py-12 text-on-surface-variant">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="py-12 text-on-surface-variant opacity-60">No saved addresses yet.</div>
                ) : (
                  addresses.map(address => (
                    <div key={address.id} className="bg-surface-container-lowest p-6 rounded-xl border border-black/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-on-surface">{address.label}</p>
                        {address.is_default && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-widest">Default</span>
                        )}
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        <p>{address.first_name} {address.last_name}</p>
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>{address.city}, {address.state} {address.zip_code}</p>
                        <p>{address.country}</p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        {!address.is_default && (
                          <button onClick={() => setDefaultAddress(address.id)} className="px-4 py-2 rounded-lg bg-surface-container-low text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-all">
                            Set Default
                          </button>
                        )}
                        <button onClick={() => deleteAddress(address.id)} className="px-4 py-2 rounded-lg bg-error/10 text-error text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {(addressError || addressSuccess) && (
              <p className={`text-sm font-medium ${addressError ? 'text-error' : 'text-green-600'}`}>
                {addressError || addressSuccess}
              </p>
            )}
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
                  <p className="text-sm text-on-surface-variant opacity-60 mt-1">Secure your account with a password reset link.</p>
                </div>
                <button
                  onClick={handlePasswordReset}
                  disabled={isSendingReset}
                  className="px-6 py-3 bg-surface-container-low rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-surface-container transition-all disabled:opacity-50"
                >
                  {isSendingReset ? 'Sending...' : 'Change Password'}
                </button>
              </div>
            </div>
            {(securityError || securityMessage) && (
              <p className={`text-sm font-medium ${securityError ? 'text-error' : 'text-green-600'}`}>
                {securityError || securityMessage}
              </p>
            )}
            <section className="pt-8 border-t border-surface-container-high">
              <button
                onClick={handleGlobalSignOut}
                disabled={isGlobalSignOutLoading}
                className="text-error font-bold text-xs uppercase tracking-widest hover:opacity-70 transition-opacity border border-error/20 px-8 py-4 rounded-lg bg-error/5 disabled:opacity-50"
              >
                {isGlobalSignOutLoading ? 'Signing out...' : 'Sign Out All Devices'}
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}