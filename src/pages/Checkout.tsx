import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { useState, FormEvent } from 'react';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveAddress: false,
  });

  const tax = subtotal * 0.09;
  const total = subtotal + tax;

  const updateForm = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          status: 'processing',
          subtotal,
          shipping_cost: 0,
          tax_amount: tax,
          total_amount: total,
          shipping_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            address_line1: form.address,
            city: form.city,
            state: form.state,
            zip_code: form.zip,
            country: 'US',
          },
          payment_method: 'card',
          payment_status: 'paid',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        seller_id: item.product.seller_id,
        product_name: item.product.name,
        product_image: item.product.images[0] || null,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
        size: item.size,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Save address if requested
      if (form.saveAddress) {
        await supabase.from('addresses').insert({
          user_id: user.id,
          label: 'Home',
          first_name: form.firstName,
          last_name: form.lastName,
          address_line1: form.address,
          city: form.city,
          state: form.state,
          zip_code: form.zip,
          country: 'US',
        });
      }

      // 4. Clear the cart
      await clearCart(user.id);

      // 5. Navigate to success with order number
      navigate('/success', { state: { orderNumber: order.order_number } });

    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 text-center">
        <p className="text-on-surface-variant mb-4">Please sign in to checkout.</p>
        <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="text-primary font-bold underline">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 text-center">
        <p className="text-on-surface-variant mb-4">Your bag is empty.</p>
        <Link to="/shop" className="text-primary font-bold underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8 py-16 animate-in slide-in-from-right-4 duration-700">
      <div className="mb-16">
        <h1 className="text-6xl font-bold text-on-surface tracking-tighter mb-4">Checkout</h1>
        <p className="text-on-surface-variant font-medium text-lg italic">Experience seamless curation.</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleCheckout}>
        <div className="flex flex-col lg:flex-row gap-24 items-start">
          {/* Left Column: Forms */}
          <div className="w-full lg:w-7/12 flex flex-col gap-16">
            {/* Shipping Address */}
            <section className="space-y-10">
              <div className="flex items-center gap-4">
                <MapPin className="text-primary" size={32} />
                <h2 className="text-sm font-semibold text-on-surface tracking-tight uppercase tracking-widest">1. Delivery Destination</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm outline-none"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={e => updateForm('firstName', e.target.value)}
                />
                <input
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm outline-none"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={e => updateForm('lastName', e.target.value)}
                />
                <div className="md:col-span-2">
                  <input
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm outline-none"
                    placeholder="Street address"
                    value={form.address}
                    onChange={e => updateForm('address', e.target.value)}
                  />
                </div>
                <input
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm outline-none"
                  placeholder="City"
                  value={form.city}
                  onChange={e => updateForm('city', e.target.value)}
                />
                <input
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm outline-none"
                  placeholder="State"
                  value={form.state}
                  onChange={e => updateForm('state', e.target.value)}
                />
                <input
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm outline-none"
                  placeholder="ZIP code"
                  value={form.zip}
                  onChange={e => updateForm('zip', e.target.value)}
                />
              </div>
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md"
                  checked={form.saveAddress}
                  onChange={e => updateForm('saveAddress', e.target.checked)}
                />
                <span className="text-sm text-on-surface-variant font-medium">Save this address for future curations</span>
              </label>
            </section>

            {/* Payment */}
            <section className="space-y-10 pt-16 border-t border-surface-container-low">
              <div className="flex items-center gap-4">
                <CreditCard className="text-primary" size={32} />
                <h2 className="text-sm font-semibold text-on-surface tracking-tight uppercase tracking-widest">2. Secure Payment</h2>
              </div>
              <p className="text-xs text-on-surface-variant opacity-60 italic">Demo mode: enter any valid-looking card details</p>
              <div className="p-10 bg-surface-container-low/50 rounded-2xl border border-black/5 space-y-8">
                <div className="relative">
                  <input
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 pl-14 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-mono outline-none"
                    placeholder="Card Number"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={e => updateForm('cardNumber', e.target.value)}
                  />
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" size={20} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-mono outline-none"
                    placeholder="MM / YY"
                    value={form.expiry}
                    onChange={e => updateForm('expiry', e.target.value)}
                  />
                  <input
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-mono outline-none"
                    placeholder="CVV"
                    maxLength={4}
                    value={form.cvv}
                    onChange={e => updateForm('cvv', e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
            <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-ambient border border-black/5">
              <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-8">Your Selection ({items.length})</h3>

              <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-4 scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        alt={item.product.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                        src={item.product.images[0]}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-base font-semibold text-on-surface line-clamp-1">{item.product.name}</h4>
                      {item.size && <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest">Size {item.size}</p>}
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-surface-container-low">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Subtotal</span>
                  <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Tax (9%)</span>
                  <span className="font-bold text-on-surface">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-8 mt-8 border-t border-surface-container-low mb-10">
                <span className="text-lg font-bold text-on-surface-variant uppercase tracking-[0.2em]">Total</span>
                <div className="text-right">
                  <span className="text-4xl font-bold text-on-surface tracking-tighter">${total.toFixed(2)}</span>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-1">USD</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  <>Confirm Order <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
