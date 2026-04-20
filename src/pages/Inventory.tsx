/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Plus, Filter, LayoutGrid, List, Search, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import SellerLayout from '../components/seller/SellerLayout';

export default function Inventory() {
  return (
    <SellerLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-10 animate-in fade-in duration-700">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h2 className="text-[2.5rem] font-headline font-semibold text-on-surface tracking-tighter leading-tight italic">Inventory</h2>
            <p className="text-on-surface-variant font-medium opacity-60">Manage your stock, prices, and product visibility.</p>
          </div>
          <Link 
            to="/seller/products/new" 
            className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </header>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-black/5 gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-3 px-5 py-2.5 rounded-xl hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-on-surface transition-all border border-surface-container-high/50">
              <Filter size={14} className="text-primary" />
              <span>All Categories</span>
              <ChevronDown size={14} className="opacity-40" />
            </button>
            <button className="flex items-center gap-3 px-5 py-2.5 rounded-xl hover:bg-surface-container-low text-xs font-bold uppercase tracking-widest text-on-surface transition-all border border-surface-container-high/50">
              <span>Status: Any</span>
              <ChevronDown size={14} className="opacity-40" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30" disabled>
              Bulk Actions
            </button>
            <div className="w-px h-6 bg-surface-container-high"></div>
            <div className="flex items-center gap-2">
              <button className="p-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-all">
                <List size={18} />
              </button>
              <button className="p-3 text-on-surface bg-surface-container-low rounded-xl transition-all">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {PRODUCTS.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-black/5 shadow-sm group hover:shadow-ambient transition-all duration-500 flex flex-col"
            >
              <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden mb-6 relative group">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-110 duration-1000" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-[#00837c] shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00837c]"></span> Active
                </div>
              </div>
              <div className="flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-[0.2em] opacity-40">SKU: OBJ-001{idx}</p>
                  <h3 className="text-lg font-headline font-semibold text-on-surface leading-tight tracking-tight">{product.name}</h3>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-surface-container-low">
                  <div>
                    <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-tighter opacity-40 mb-1">Price</p>
                    <p className="text-base font-bold text-on-surface tracking-tight">${product.price}.00</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-tighter opacity-40 mb-1">Stock</p>
                    <p className="text-base font-bold text-primary tracking-tight">12 <span className="text-[10px] font-normal text-on-surface-variant tracking-normal opacity-40">units</span></p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-surface-container-low flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">Edit Details</button>
                <button className="p-2.5 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-all">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all disabled:opacity-30" disabled>
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface font-bold text-xs">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low text-xs font-bold transition-all">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low text-xs font-bold transition-all">3</button>
            <span className="px-2 text-on-surface-variant opacity-40 text-xs font-bold uppercase tracking-widest">...</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}
