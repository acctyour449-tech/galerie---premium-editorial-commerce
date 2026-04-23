import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function PasswordRecovery() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (type === 'recovery' && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          if (isMounted) {
            setError('This password reset link is invalid or expired. Please request a new one.');
            setIsRecoverySessionReady(false);
          }
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (data.session) {
        setIsRecoverySessionReady(true);
      } else {
        setError('Reset link missing or expired. Request a new password reset email.');
        setIsRecoverySessionReady(false);
      }
    };

    initRecovery();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccessMessage('Password updated successfully. You can now sign in with your new password.');
    setPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8 animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-lowest p-12 rounded-3xl shadow-ambient border border-black/5 flex flex-col gap-8"
      >
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-headline font-bold text-on-surface tracking-tighter leading-tight">Reset Password</h1>
          <p className="text-sm font-medium text-on-surface-variant opacity-70">Choose a new password to secure your account.</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 p-4 bg-green-100 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle2 size={16} className="mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                disabled={!isRecoverySessionReady || isLoading}
                className="w-full bg-surface-container-low border-none rounded-xl pl-11 pr-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none disabled:opacity-60"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 ml-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
              disabled={!isRecoverySessionReady || isLoading}
              className="w-full bg-surface-container-low border-none rounded-xl px-6 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none disabled:opacity-60"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={!isRecoverySessionReady || isLoading}
            className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 mt-2 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <p className="text-xs text-center text-on-surface-variant font-medium">
          Back to{' '}
          <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
            sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}