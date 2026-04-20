/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Search, ShoppingBag, UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl w-full top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-stone-900 dark:text-stone-50">GALERIE</Link>
          <div className="hidden md:flex gap-6">
            <Link to="/shop" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-900 dark:text-stone-50 font-bold border-b-2 border-primary pb-1 hover:opacity-70 transition-opacity duration-300">Shop</Link>
            <Link to="/editorial" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors hover:opacity-70 transition-opacity duration-300">Editorial</Link>
            <Link to="/archives" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors hover:opacity-70 transition-opacity duration-300">Archives</Link>
            <Link to="/about" className="font-sans tracking-tight text-sm uppercase font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors hover:opacity-70 transition-opacity duration-300">About</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 text-primary dark:text-primary-container">
          <button className="hover:opacity-70 transition-opacity duration-300"><Search size={20} /></button>
          <Link to="/cart" className="hover:opacity-70 transition-opacity duration-300"><ShoppingBag size={20} /></Link>
          <Link to="/login" className="hover:opacity-70 transition-opacity duration-300"><UserCircle size={20} /></Link>
        </div>
      </div>
      <div className="bg-stone-100/50 dark:bg-stone-800/50 h-[1px] w-full"></div>
    </nav>
  );
}
