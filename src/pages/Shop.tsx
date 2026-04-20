/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-16 lg:gap-24 max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24 animate-in fade-in duration-700">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-56 lg:w-64 flex-shrink-0">
        <div className="sticky top-32 flex flex-col gap-12">
          {/* Category Filter */}
          <div className="flex flex-col gap-5">
            <h3 className="font-headline text-[0.875rem] font-semibold tracking-wider uppercase text-on-surface">Category</h3>
            <ul className="flex flex-col gap-4 font-body text-[0.875rem]">
              <li><button className="text-on-surface font-medium hover:text-primary transition-colors text-left w-full">All Objects</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Furniture</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Lighting</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Ceramics</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Textiles</button></li>
            </ul>
          </div>
          
          {/* Designer Filter */}
          <div className="flex flex-col gap-5">
            <h3 className="font-headline text-[0.875rem] font-semibold tracking-wider uppercase text-on-surface">Designer</h3>
            <ul className="flex flex-col gap-4 font-body text-[0.875rem]">
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Studio Koto</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Atelier Blanc</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Neri & Hu</button></li>
              <li><button className="text-on-surface-variant hover:text-on-surface transition-colors text-left w-full">Frama</button></li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-grow flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-6xl font-headline font-light text-on-surface tracking-tight mb-2">Curated Objects</h1>
          <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed">
            A selection of meticulously crafted pieces designed to elevate your living space. Focus on material integrity and timeless form.
          </p>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-surface-container-low">
          <div className="text-sm text-on-surface-variant font-medium">
            {loading ? 'Loading items...' : `Showing ${products.length} items`}
          </div>
          <button className="flex items-center gap-2 text-sm text-on-surface hover:opacity-70 transition-opacity uppercase font-bold tracking-widest text-[10px]">
            <span>Sort by: Featured</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
          {products.map((product, idx) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/product/${product.id}`} className="group flex flex-col gap-6 block outline-none">
                <div className="bg-surface-container-lowest rounded-xl p-6 aspect-[4/5] flex items-center justify-center relative overflow-hidden shadow-ambient transition-transform duration-500 group-hover:-translate-y-1">
                  <img 
                    alt={product.name} 
                    className="object-contain w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-label text-xs font-medium tracking-wide shadow-lg hover:scale-95 transition-transform uppercase">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">{product.category}</span>
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-lg font-semibold text-on-surface leading-tight">{product.name}</h2>
                    <span className="text-lg font-medium text-on-surface">${product.price}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1 italic">{product.short_description || product.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {!loading && products.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button className="bg-surface-container-low text-on-surface font-label text-xs uppercase tracking-widest py-4 px-12 rounded-full hover:bg-surface-container transition-colors duration-300 font-bold">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}