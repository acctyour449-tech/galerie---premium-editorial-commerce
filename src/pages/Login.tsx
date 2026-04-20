/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, FormEvent } from 'react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  
  // Use location state to redirect back after login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // For demo, we'll assume any email with 'seller' in it logs in as a seller
    const role = email.toLowerCase().includes('seller') ? 'seller' : 'buyer';
    login(email || 'demo@galerie.com', role);
    
    // Redirect to where they were going, or dashboard if they are a seller
    if (role === 'seller' && from === '/') {
      navigate('/seller');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8 animate-in fade-in duration-700">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest p-12 rounded-3xl shadow-ambient border border-black/5 flex flex-col gap-10"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tighter leading-tight">Welcome Back</h1>
          <p className="text-sm font-medium text-on-surface-variant opacity-60">Continue your curated journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="email">Email Address</label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
              id="email" 
              placeholder="hello@example.com" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-[9px] text-on-surface-variant italic opacity-40 ml-2">Tip: Use "seller" in email to login as Merchant</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60" htmlFor="password">Password</label>
              <button type="button" className="text-[10px] text-primary font-bold hover:underline underline-offset-4 uppercase tracking-[0.1em]">Forgot?</button>
            </div>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
              id="password" 
              placeholder="••••••••" 
              type="password" 
              required
            />
          </div>

          <button type="submit" className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4 flex items-center justify-center gap-3 group">
            Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative py-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-low"></div></div>
            <span className="relative z-10 px-4 bg-surface-container-lowest text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => { login('google@example.com', 'buyer'); navigate('/profile'); }}
              className="flex items-center justify-center gap-3 py-4 border border-black/5 rounded-xl hover:bg-surface-container-low transition-all group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Google</span>
            </button>
            <button 
              type="button" 
              onClick={() => { login('apple@example.com', 'buyer'); navigate('/profile'); }}
              className="flex items-center justify-center gap-3 py-4 border border-black/5 rounded-xl hover:bg-surface-container-low transition-all group"
            >
              <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-4 h-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Apple</span>
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            New to Galerie? <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
