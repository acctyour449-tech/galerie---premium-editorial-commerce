/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, ShoppingBag, ReceiptText, Package, Settings, Store, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function SellerSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface border-r border-surface-container-low flex flex-col gap-2 p-6 z-40 hidden md:flex">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shadow-primary/20">
          <Store size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-on-surface">Seller Studio</h1>
          <p className="text-sm text-on-surface-variant font-medium opacity-60">Premium Tier</p>
        </div>
      </div>
      
      <nav className="flex flex-col gap-2 flex-grow">
        <NavLink 
          to="/seller" 
          end
          className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${isActive ? 'bg-surface-container text-on-surface font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/seller/products" 
          className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${isActive ? 'bg-surface-container text-on-surface font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
        >
          <ShoppingBag size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink 
          to="#" 
          className="flex items-center gap-4 text-on-surface-variant px-4 py-3 hover:bg-surface-container-low hover:text-on-surface transition-all duration-300 rounded-lg font-medium text-sm"
        >
          <ReceiptText size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink 
          to="/seller/inventory" 
          className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm ${isActive ? 'bg-surface-container text-on-surface font-semibold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
        >
          <Package size={20} />
          <span>Inventory</span>
        </NavLink>
        <NavLink 
          to="#" 
          className="flex items-center gap-4 text-on-surface-variant px-4 py-3 hover:bg-surface-container-low hover:text-on-surface transition-all duration-300 rounded-lg font-medium text-sm mt-auto"
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="pt-6 border-t border-surface-container-low">
        <button className="flex items-center gap-4 w-full px-4 py-3 text-on-surface-variant hover:text-error hover:bg-error/5 transition-all duration-300 rounded-lg font-medium text-sm">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
