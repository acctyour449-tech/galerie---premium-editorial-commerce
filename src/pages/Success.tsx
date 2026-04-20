/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Success() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-8 py-24 md:py-32 animate-in zoom-in duration-1000">
      <div className="w-full max-w-2xl mx-auto text-center space-y-10 mb-20">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-container-low text-primary mb-6 shadow-sm"
        >
          <span className="material-symbols-outlined text-5xl fill-icon">check_circle</span>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-headline font-light text-on-surface tracking-tighter leading-tight">Thank you for your order</h1>
        <div className="space-y-3">
          <p className="text-on-surface-variant text-xl font-medium tracking-tight">Order <span className="font-bold text-on-surface">#LUM-82931</span></p>
          <p className="text-on-surface-variant text-base max-w-md mx-auto italic">We've sent a confirmation email to <span className="text-on-surface font-semibold">john.doe@example.com</span> with your order details.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
        <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex-grow">
          Track Order
        </button>
        <Link to="/" className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:bg-secondary-fixed/80 active:scale-95 transition-all text-center flex-grow">
          Back Home
        </Link>
      </div>
      
      <div className="mt-32 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <div className="text-[12rem] font-black text-on-surface tracking-tighter select-none leading-none">GALERIE</div>
      </div>
    </div>
  );
}
