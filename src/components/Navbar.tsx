import { Link } from 'react-router-dom';
import { Search, ShoppingBag, UserCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, profile, isAuthenticated } = useAuth();
  const { itemCount, fetchCart } = useCartStore();

  // Sync cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user]);

  return (
    <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl w-full top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-stone-900 dark:text-stone-50">GALERIE</Link>
          <div className="hidden md:flex gap-6">
            <Link to="/shop" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-900 dark:text-stone-50 font-bold border-b-2 border-primary pb-1 hover:opacity-70 transition-opacity duration-300">Shop</Link>
            <a href="#" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors">Editorial</a>
            <a href="#" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors">Archives</a>
            <a href="#" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors">About</a>
          </div>
        </div>
        <div className="flex items-center gap-6 text-primary dark:text-primary-container">
          <button className="hover:opacity-70 transition-opacity duration-300"><Search size={20} /></button>

          {/* Cart with badge */}
          <Link to="/cart" className="hover:opacity-70 transition-opacity duration-300 relative">
            <ShoppingBag size={20} />
            {isAuthenticated && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {profile?.role === 'seller' && (
                <Link to="/seller" title="Merchant Dashboard" className="hover:opacity-70 transition-opacity duration-300">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <Link to="/profile" title="Account" className="hover:opacity-70 transition-opacity duration-300">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || ''}
                    className="w-7 h-7 rounded-full object-cover border-2 border-primary/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle size={20} />
                )}
              </Link>
            </div>
          ) : (
            <Link to="/login" title="Login" className="hover:opacity-70 transition-opacity duration-300">
              <UserCircle size={20} />
            </Link>
          )}
        </div>
      </div>
      <div className="bg-stone-100/50 dark:bg-stone-800/50 h-[1px] w-full"></div>
    </nav>
  );
}
