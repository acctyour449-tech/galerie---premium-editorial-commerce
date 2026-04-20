/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, Upload, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import SellerLayout from '../components/seller/SellerLayout';

export default function AddProduct() {
  return (
    <SellerLayout>
      <div className="max-w-5xl mx-auto p-8 md:p-12 pb-32 animate-in fade-in duration-700">
        <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <Link 
              to="/seller/products" 
              className="flex items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-4 group"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Stockroom
            </Link>
            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-on-surface leading-tight">Add New Object</h2>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all">Save Draft</button>
            <button className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">Publish Product</button>
          </div>
        </header>

        <form className="space-y-12">
          {/* Basic Info Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Object Information</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="productName">Product Name</label>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                  id="productName" 
                  placeholder="e.g. Minimalist Ceramic Vase" 
                  type="text"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="productDescription">Description</label>
                <textarea 
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none resize-none min-h-[160px]" 
                  id="productDescription" 
                  placeholder="Detail the features, materials, and care instructions..." 
                  rows={4}
                ></textarea>
              </div>
            </div>
          </motion.section>

          {/* Media Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Media Gallery</h3>
            <div className="border-2 border-dashed border-outline-variant/30 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface hover:border-primary/30 transition-all cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors mb-6 shadow-sm">
                <Upload size={32} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-on-surface mb-2 uppercase tracking-widest">Drag & drop high-resolution imagery</p>
              <p className="text-xs text-on-surface-variant font-medium opacity-60">or <span className="text-primary underline underline-offset-4">browse selection</span> (JPEG, PNG up to 10MB)</p>
            </div>
          </motion.section>

          {/* Pricing & Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Pricing Model</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="price">Regular Price</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-6 flex items-center text-on-surface-variant opacity-40 font-bold">$</span>
                    <input 
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                      id="price" 
                      placeholder="0.00" 
                      type="number"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="salePrice">Sale Price (Optional)</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-6 flex items-center text-on-surface-variant opacity-40 font-bold">$</span>
                    <input 
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                      id="salePrice" 
                      placeholder="0.00" 
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Inventory Control</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="sku">SKU (Stock Keeping Unit)</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none font-mono" 
                    id="sku" 
                    placeholder="e.g. VASE-CER-01" 
                    type="text"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="quantity">Available Quantity</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                    id="quantity" 
                    placeholder="0" 
                    type="number"
                  />
                </div>
              </div>
            </motion.section>
          </div>

          {/* Categorization */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm mb-24"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Categorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="category">Collection</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none appearance-none cursor-pointer" 
                    id="category"
                  >
                    <option value="">Select a curation...</option>
                    <option value="decor">Home Decor</option>
                    <option value="furniture">Furniture</option>
                    <option value="lighting">Lighting</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="tags">Search Tags</label>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                  id="tags" 
                  placeholder="e.g. Minimalist, Ceramic, Handmade" 
                  type="text"
                />
              </div>
            </div>
          </motion.section>
        </form>
      </div>
    </SellerLayout>
  );
}
