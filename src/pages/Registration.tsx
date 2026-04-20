/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Registration() {
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8 animate-in fade-in duration-700">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest p-12 rounded-3xl shadow-ambient border border-black/5 flex flex-col gap-10"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tighter leading-tight">Join Galerie</h1>
          <p className="text-sm font-medium text-on-surface-variant opacity-60">Curate your minimalist lifestyle today.</p>
        </div>

        {/* Role Selector */}
        <div className="bg-surface-container-low p-1.5 rounded-2xl flex relative overflow-hidden ring-1 ring-black/5">
          <motion.div 
            animate={{ x: role === 'buyer' ? 0 : '100%' }}
            className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-surface-container-lowest rounded-xl shadow-sm z-0"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            onClick={() => setRole('buyer')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'buyer' ? 'text-on-surface' : 'text-on-surface-variant'}`}
          >
            Buyer
          </button>
          <button 
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'seller' ? 'text-on-surface' : 'text-on-surface-variant'}`}
          >
            Seller
          </button>
        </div>

        <form className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="name">Full Name</label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
              id="name" 
              placeholder="E.g. James Atelier" 
              type="text" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="email">Email Address</label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
              id="email" 
              placeholder="hello@example.com" 
              type="email" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="password">Password</label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
              id="password" 
              placeholder="••••••••" 
              type="password" 
            />
          </div>

          <button className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4 flex items-center justify-center gap-3 group">
            Sign Up
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            Already curated? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Log in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
