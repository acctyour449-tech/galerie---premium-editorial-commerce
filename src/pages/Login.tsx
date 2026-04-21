import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, FormEvent } from 'react';

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await loginWithEmail(email, password);
    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Redirect is handled by OAuth flow
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setIsGoogleLoading(false);
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

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-black/10 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span className="font-bold text-sm text-gray-700 uppercase tracking-widest">
            {isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}
          </span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-low"></div></div>
          <span className="relative z-10 px-4 bg-surface-container-lowest text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40">Or sign in with email</span>
        </div>

        {/* Error Message */}
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

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="email">
              Email Address
            </label>
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
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60" htmlFor="password">
                Password
              </label>
              <button type="button" className="text-[10px] text-primary font-bold hover:underline underline-offset-4 uppercase tracking-[0.1em]">
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
              <input
                className="w-full bg-surface-container-low border-none rounded-xl pl-11 pr-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                id="password"
                placeholder="••••••••"
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
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            New to Galerie?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
