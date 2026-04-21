import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, FormEvent } from 'react';

export default function Registration() {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const { error } = await registerWithEmail(name, email, password, role);

    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      setSuccess('Account created! Check your email to confirm, then log in.');
      setIsLoading(false);
      // If email confirmation is disabled in Supabase, auto-navigate
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      // Store intended role in localStorage for pickup after OAuth
      localStorage.setItem('galerie_intended_role', role);
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed');
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
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tighter leading-tight">Join Galerie</h1>
          <p className="text-sm font-medium text-on-surface-variant opacity-60">Curate your minimalist lifestyle today.</p>
        </div>

        {/* Role Selector */}
        <div className="bg-surface-container-low p-1.5 rounded-2xl flex relative overflow-hidden ring-1 ring-black/5">
          <motion.div
            animate={{ x: role === 'buyer' ? 0 : '100%' }}
            className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-surface-container-lowest rounded-xl shadow-sm z-0"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'buyer' ? 'text-on-surface' : 'text-on-surface-variant'}`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'seller' ? 'text-on-surface' : 'text-on-surface-variant'}`}
          >
            Seller
          </button>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-black/10 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-bold text-sm text-gray-700 uppercase tracking-widest">Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-low"></div></div>
          <span className="relative z-10 px-4 bg-surface-container-lowest text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40">Or register with email</span>
        </div>

        {/* Status messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700"
          >
            <CheckCircle size={16} />
            <span>{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="name">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
              <input
                className="w-full bg-surface-container-low border-none rounded-xl pl-11 pr-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                id="name"
                placeholder="E.g. James Atelier"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
              <input
                className="w-full bg-surface-container-low border-none rounded-xl pl-11 pr-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                id="email"
                placeholder="hello@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
              <input
                className="w-full bg-surface-container-low border-none rounded-xl pl-11 pr-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                id="password"
                placeholder="Min. 6 characters"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4 flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            Already curated?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
