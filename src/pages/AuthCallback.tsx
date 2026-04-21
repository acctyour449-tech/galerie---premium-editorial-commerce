import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

/**
 * AuthCallback - handles the redirect after Google OAuth
 * Shows role selection if it's a first-time login
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { profile, setRole } = useAuth();
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/login?error=auth_failed');
        return;
      }

      // Check if user has a profile with a role set
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, created_at, updated_at')
        .eq('id', session.user.id)
        .single();

      // If profile was just created (created_at ≈ updated_at), show role picker
      const isNewUser = profileData && 
        Math.abs(new Date(profileData.created_at).getTime() - new Date(profileData.updated_at).getTime()) < 5000;

      if (isNewUser) {
        setShowRolePicker(true);
      } else {
        // Existing user, redirect based on role
        if (profileData?.role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/');
        }
      }
    };

    handleCallback();
  }, []);

  const handleRoleConfirm = async () => {
    setIsProcessing(true);
    await setRole(selectedRole);
    navigate(selectedRole === 'seller' ? '/seller' : '/');
  };

  if (showRolePicker) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-surface">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-surface-container-lowest p-12 rounded-3xl shadow-ambient border border-black/5 flex flex-col gap-10"
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-on-surface">Welcome to Galerie</h1>
            <p className="text-sm text-on-surface-variant opacity-70">How would you like to use Galerie?</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole('buyer')}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                selectedRole === 'buyer'
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-container-high bg-surface-container-low hover:border-primary/30'
              }`}
            >
              <span className="text-3xl">🛍️</span>
              <div className="text-center">
                <p className="font-bold text-sm text-on-surface">Buyer</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Discover & shop curated pieces</p>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole('seller')}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                selectedRole === 'seller'
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-container-high bg-surface-container-low hover:border-primary/30'
              }`}
            >
              <span className="text-3xl">🏪</span>
              <div className="text-center">
                <p className="font-bold text-sm text-on-surface">Seller</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">List & sell your products</p>
              </div>
            </button>
          </div>

          <button
            onClick={handleRoleConfirm}
            disabled={isProcessing}
            className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isProcessing ? 'Setting up your account...' : `Continue as ${selectedRole}`}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">Signing you in...</p>
      </div>
    </div>
  );
}
