/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, CreditCard, ArrowRight } from 'lucide-react';

export default function Checkout() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8 py-16 animate-in slide-in-from-right-4 duration-700">
      <div className="mb-16">
        <h1 className="text-6xl font-bold text-on-surface tracking-tighter mb-4">Checkout</h1>
        <p className="text-on-surface-variant font-medium text-lg italic">Experience seamless curation.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-24 items-start">
        {/* Left Column: Forms */}
        <div className="w-full lg:w-7/12 flex flex-col gap-16">
          {/* Shipping Address */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <MapPin className="text-primary" size={32} />
              <h2 className="text-2xl font-semibold text-on-surface tracking-tight uppercase tracking-widest text-sm">1. Delivery Destination</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                placeholder="First Name" type="text" 
              />
              <input 
                className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                placeholder="Last Name" type="text" 
              />
              <div className="md:col-span-2">
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                  placeholder="Address line 1" type="text" 
                />
              </div>
              <div className="grid grid-cols-3 md:col-span-2 gap-4">
                <input 
                  className="col-span-1 w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                  placeholder="City" type="text" 
                />
                <input 
                  className="col-span-1 w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                  placeholder="State" type="text" 
                />
                <input 
                  className="col-span-1 w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" 
                  placeholder="ZIP" type="text" 
                />
              </div>
            </div>
            <label className="flex items-center gap-4 cursor-pointer group">
              <input className="w-5 h-5 rounded-md border-none bg-surface-container-low text-primary focus:ring-0" type="checkbox" />
              <span className="text-sm text-on-surface-variant font-medium">Save this address for future curations</span>
            </label>
          </section>

          {/* Payment Method */}
          <section className="space-y-10 pt-16 border-t border-surface-container-low">
            <div className="flex items-center gap-4">
              <CreditCard className="text-primary" size={32} />
              <h2 className="text-2xl font-semibold text-on-surface tracking-tight uppercase tracking-widest text-sm">2. Secure Payment</h2>
            </div>
            <div className="p-10 bg-surface-container-low/50 rounded-2xl border border-black/5 space-y-8">
              <div className="relative group">
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 pl-14 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-mono" 
                  placeholder="Card Number" type="text" 
                />
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" size={20} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-mono" 
                  placeholder="MM / YY" type="text" 
                />
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all font-mono" 
                  placeholder="CVV" type="text" 
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
          <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-ambient border border-black/5">
            <h3 className="text-2xl font-semibold text-on-surface tracking-tight mb-8 uppercase tracking-widest text-sm text-on-surface-variant">Your Selection</h3>
            
            <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-4 scrollbar-hide">
              <div className="flex gap-6 items-center">
                <div className="w-20 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img 
                    alt="Product" 
                    className="w-full h-full object-cover mix-blend-multiply" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzP3LTMFQvMhdq4WkbYmUvwOgV8QPVb-3Vgo5hKgsPl1UInZ2IgqQ6dSqRKEGUw58__RuNXQJgC5Tlw3dz2aeaFkI0JR9wTix0OHxTUu22RWp5Arn8Rqn1Y0RGMYXNvl84_-pI_Z11BNXWnezu67y8JEr-24blRk_LYVlc-6RfRrpyfTWKIOTemkczKDrOoMcQVNax4xVg77PDHlxTbIGbLaMhzoWFyfXI9KydOfvOXbJAMOsNQdobjT_OkUUjYU_jmzvI8t8FuFg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -top-2 -right-2 bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">1</div>
                </div>
                <div className="flex-grow">
                  <h4 className="text-base font-semibold text-on-surface line-clamp-1">Crimson Strider Sneakers</h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-widest">Size 10 / Red</p>
                </div>
                <span className="text-sm font-bold text-on-surface">$245.00</span>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-surface-container-low">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-medium">Subtotal</span>
                <span className="font-bold text-on-surface">$245.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-medium">Shipping</span>
                <span className="font-medium text-tertiary">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-medium">Tax</span>
                <span className="font-bold text-on-surface">$22.05</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-8 mt-8 border-t border-surface-container-low mb-10">
              <span className="text-lg font-bold text-on-surface-variant uppercase tracking-[0.2em]">Total</span>
              <div className="text-right">
                <span className="text-4xl font-bold text-on-surface tracking-tighter">$267.05</span>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-1">USD</p>
              </div>
            </div>

            <Link 
              to="/success" 
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3"
            >
              Confirm Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
