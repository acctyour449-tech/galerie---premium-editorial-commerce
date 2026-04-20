/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState('9');
  const [loading, setLoading] = useState(true);
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch current product
      const { data: prodData } = await supabase.from('products').select('*').eq('id', id).single();
      if (prodData) setProduct(prodData);
      
      // Fetch related products
      const { data: relData } = await supabase.from('products').select('*').neq('id', id).limit(3);
      if (relData) setRelated(relData);
      
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.images?.[0] || 'https://via.placeholder.com/400'
      });
      alert('Added to your curation bag!');
    }
  };

  if (loading) return <div className="p-20 text-center font-bold uppercase tracking-widest text-on-surface-variant opacity-40">Loading Object...</div>;
  if (!product) return <div className="p-20 text-center font-bold uppercase tracking-widest text-on-surface-variant opacity-40">Object not found.</div>;

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4 sticky top-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[600px] bg-surface-container-low rounded-xl overflow-hidden relative shadow-sm"
          >
            <img 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply" 
              src={product.images?.[0] || 'https://via.placeholder.com/600'}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-surface-container-low rounded-xl overflow-hidden">
              <img 
                alt="Detail" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform hover:scale-110" 
                src={product.images?.[1] || product.images?.[0] || 'https://via.placeholder.com/400'} 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="h-48 bg-surface-container-low rounded-xl overflow-hidden">
              <img 
                alt="Detail" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform hover:scale-110" 
                src={product.images?.[2] || product.images?.[0] || 'https://via.placeholder.com/400'} 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs text-secondary font-bold tracking-[0.2em] uppercase">{product.category}</p>
            <h1 className="text-6xl font-headline font-semibold text-on-surface tracking-tighter leading-tight">{product.name}</h1>
            <p className="text-2xl text-on-surface-variant font-medium">${product.price}.00</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-on-surface uppercase tracking-widest text-xs">The Curated Statement</h3>
            <p className="text-base text-on-surface-variant leading-relaxed opacity-80 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-8 p-8 bg-surface-container-low rounded-xl">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface font-semibold uppercase tracking-wider">Select Size</span>
                <button className="text-xs text-primary underline underline-offset-4">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '10', '11'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-4 rounded font-medium text-sm transition-all ${selectedSize === size ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest text-on-surface border border-outline-variant/15 hover:bg-surface-container'}`}
                  >
                    {size}
                  </button>
                ))}
                <button className="py-4 bg-surface-container-lowest text-on-surface border border-outline-variant/15 rounded opacity-40 cursor-not-allowed text-sm">12</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button onClick={handleAddToCart} className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Add to Cart
              </button>
              <Link to="/checkout" className="w-full py-5 bg-secondary-fixed text-on-secondary-fixed rounded-lg font-semibold text-base hover:bg-secondary-fixed/80 active:scale-95 transition-all text-center">
                Express Checkout
              </Link>
            </div>
          </div>

          {/* Details Accordion */}
          <div className="flex flex-col border-t border-surface-container-high pt-6">
            <details className="group border-b border-surface-container-high/50">
              <summary className="flex justify-between items-center py-6 cursor-pointer list-none">
                <span className="font-semibold text-sm uppercase tracking-widest text-on-surface">Material & Care</span>
                <Plus size={18} className="transition-transform group-open:rotate-45" />
              </summary>
              <div className="pb-8 text-sm text-on-surface-variant leading-relaxed">
                Handcrafted from {product.material || 'premium materials'}. Sustainably sourced and naturally treated. Avoid direct sunlight for extended periods. Wipe with a damp cloth only.
              </div>
            </details>
            <details className="group border-b border-surface-container-high/50">
              <summary className="flex justify-between items-center py-6 cursor-pointer list-none">
                <span className="font-semibold text-sm uppercase tracking-widest text-on-surface">Specifications</span>
                <Plus size={18} className="transition-transform group-open:rotate-45" />
              </summary>
              <div className="pb-8 space-y-2">
                {product.specs && Object.entries(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">{key}</span>
                      <span className="text-on-surface font-medium">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-on-surface-variant">No specifications available.</div>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <section className="mt-32 pt-24 border-t border-surface-container-high">
        <h2 className="text-2xl font-headline font-semibold text-on-surface mb-12 text-center tracking-tight uppercase tracking-[0.2em]">Curated Accompaniments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="group flex flex-col gap-6 p-6 bg-surface-container-low/30 rounded-xl hover:bg-surface-container-lowest hover:shadow-ambient transition-all duration-500">
              <div className="w-full aspect-[4/5] bg-surface-container rounded-lg overflow-hidden relative">
                <img alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" src={p.images?.[0] || 'https://via.placeholder.com/400'} referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-semibold text-on-surface">{p.name}</h4>
                <p className="text-sm text-on-surface-variant">${p.price}.00</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}