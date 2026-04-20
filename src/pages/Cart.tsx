/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cart Items List */}
      <section className="lg:col-span-8 flex flex-col gap-12">
        <header className="mb-4">
          <h1 className="text-6xl font-bold tracking-tighter text-on-surface">Your Bag</h1>
          <p className="text-on-surface-variant font-medium mt-4 italic">{items.length} items in your curation.</p>
        </header>

        <div className="flex flex-col gap-8">
          {items.length === 0 ? (
            <div className="py-20 text-center bg-surface-container-lowest rounded-xl ring-1 ring-black/5">
              <p className="text-on-surface-variant mb-6 uppercase tracking-widest font-bold text-sm">Your curation bag is empty.</p>
              <Link to="/shop" className="text-primary underline underline-offset-4 text-sm font-semibold">Discover Objects</Link>
            </div>
          ) : (
            items.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-8 bg-surface-container-lowest p-8 rounded-xl ring-1 ring-black/5 shadow-sm group"
              >
                <div className="w-40 h-52 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                  <img alt={item.name} className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-105" src={item.image_url} referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col flex-grow justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-semibold text-on-surface mb-1">{item.name}</h3>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em]">Curated Object</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-on-surface-variant hover:text-error transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-error/10">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center gap-6 bg-surface-container-low rounded-full px-6 py-3 border border-black/5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-on-surface hover:opacity-70 transition-opacity">
                        <Minus size={18} />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-on-surface hover:opacity-70 transition-opacity">
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-on-surface">${item.price * item.quantity}.00</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
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
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span className="font-medium">Shipping</span>
              <span className="italic">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span className="font-medium">Taxes</span>
              <span className="italic">Calculated at checkout</span>
            </div>
          </div>
          
          <div className="h-[2px] bg-surface-container-low rounded-full"></div>
          
          <div className="flex justify-between items-end">
            <span className="font-semibold text-lg uppercase tracking-widest text-on-surface-variant">Total</span>
            <span className="text-4xl font-bold text-on-surface tracking-tighter">${subtotal.toFixed(2)}</span>
          </div>

          <Link 
            to="/checkout" 
            className={`w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-lg transition-all flex justify-center items-center gap-3 ${items.length === 0 ? 'opacity-50 pointer-events-none' : 'hover:opacity-90 active:scale-95 shadow-xl shadow-primary/20'}`}
          >
            Checkout
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