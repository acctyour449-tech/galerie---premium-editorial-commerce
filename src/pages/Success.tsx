import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'LUM-82931';

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-8 py-24 md:py-32 animate-in zoom-in duration-1000">
      <div className="w-full max-w-2xl mx-auto text-center space-y-10 mb-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm"
        >
          <CheckCircle size={48} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-headline font-light text-on-surface tracking-tighter leading-tight"
        >
          Thank you for your order
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <p className="text-on-surface-variant text-xl font-medium tracking-tight">
            Order <span className="font-bold text-on-surface">#{orderNumber}</span>
          </p>
          <p className="text-on-surface-variant text-base max-w-md mx-auto italic">
            Your order has been confirmed and is being processed. You'll receive updates as it ships.
          </p>
        </motion.div>

        {/* Order status steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          {['Order Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => (
            <div key={step} className="flex items-center gap-4">
              <div className={`flex flex-col items-center gap-2 ${idx === 0 ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant hidden md:block">{step}</span>
              </div>
              {idx < 3 && <div className={`h-px w-8 md:w-16 ${idx === 0 ? 'bg-primary/40' : 'bg-surface-container-high'}`}></div>}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md"
      >
        <Link
          to="/profile"
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-5 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex-grow flex items-center justify-center gap-2"
        >
          <Package size={16} />
          View Orders
        </Link>
        <Link
          to="/shop"
          className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 rounded-lg font-bold uppercase tracking-[0.2em] text-xs hover:bg-secondary-fixed/80 active:scale-95 transition-all text-center flex-grow flex items-center justify-center gap-2"
        >
          <Home size={16} />
          Continue Shopping
        </Link>
      </motion.div>

      <div className="mt-32 opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <div className="text-[12rem] font-black text-on-surface tracking-tighter select-none leading-none">GALERIE</div>
      </div>
    </div>
  );
}
