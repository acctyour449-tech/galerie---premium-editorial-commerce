import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useEffect } from 'react';

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const { items, isLoading, subtotal, itemCount, fetchCart, removeFromCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 text-center">
        <ShoppingBag size={64} className="mx-auto text-on-surface-variant opacity-20 mb-8" />
        <h1 className="text-4xl font-bold tracking-tighter text-on-surface mb-4">Your bag is empty</h1>
        <p className="text-on-surface-variant mb-8">Sign in to view your saved items.</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
          Sign In <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 text-center">
        <ShoppingBag size={64} className="mx-auto text-on-surface-variant opacity-20 mb-8" />
        <h1 className="text-4xl font-bold tracking-tighter text-on-surface mb-4">Your bag is empty</h1>
        <p className="text-on-surface-variant mb-8 italic">Begin your curation journey.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
          Explore Collection <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const tax = subtotal * 0.09;
  const total = subtotal + tax;

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cart Items */}
      <section className="lg:col-span-8 flex flex-col gap-12">
        <header className="mb-4">
          <h1 className="text-6xl font-bold tracking-tighter text-on-surface">Your Bag</h1>
          <p className="text-on-surface-variant font-medium mt-4 italic">{itemCount} item{itemCount !== 1 ? 's' : ''} in your curation.</p>
        </header>

        <div className="flex flex-col gap-8">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-8 bg-surface-container-lowest p-8 rounded-xl ring-1 ring-black/5 shadow-sm group"
              >
                <Link to={`/product/${item.product_id}`} className="w-40 h-52 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                  <img
                    alt={item.product.name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-105"
                    src={item.product.images[0]}
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="flex flex-col flex-grow justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold text-on-surface mb-1">{item.product.name}</h3>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em]">
                        {item.product.category} • {item.product.material}
                        {item.size && ` • Size ${item.size}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-error/10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center gap-6 bg-surface-container-low rounded-full px-6 py-3 border border-black/5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-on-surface hover:opacity-70 transition-opacity disabled:opacity-30"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                        className="text-on-surface hover:opacity-70 transition-opacity disabled:opacity-30"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-on-surface">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-on-surface-variant opacity-60">${item.product.price.toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Order Summary */}
      <aside className="lg:col-span-4 sticky top-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-lowest p-10 rounded-2xl flex flex-col gap-8 shadow-ambient border border-black/5"
        >
          <h2 className="text-2xl font-semibold text-on-surface tracking-tight uppercase tracking-[0.1em]">Order Summary</h2>
          <div className="flex flex-col gap-6 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span className="font-medium">Subtotal ({itemCount} items)</span>
              <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span className="font-medium">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span className="font-medium">Tax (9%)</span>
              <span className="font-bold text-on-surface">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="h-[2px] bg-surface-container-low rounded-full"></div>

          <div className="flex justify-between items-end">
            <span className="font-semibold text-lg uppercase tracking-widest text-on-surface-variant">Total</span>
            <span className="text-4xl font-bold text-on-surface tracking-tighter">${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>

          <p className="text-[10px] text-on-surface-variant font-bold text-center mt-2 uppercase tracking-[0.1em] opacity-60">
            Secure checkout powered by GALERIE
          </p>
        </motion.div>
      </aside>
    </div>
  );
}
