/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { Shirt, Watch, Armchair, Headphones, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SellerGalleryProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  sale_price: number | null;
  images: string[];
  seller_id: string;
  seller?: {
    name: string | null;
    avatar_url: string | null;
  };
}

export default function Home() {
  const [featuredBySeller, setFeaturedBySeller] = useState<SellerGalleryProduct[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  useEffect(() => {
    fetchGalleryBySeller();
  }, []);

  const fetchGalleryBySeller = async () => {
    setIsLoadingGallery(true);

    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, price, sale_price, images, seller_id, seller:profiles(name, avatar_url)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(36);

    if (!error && data) {
      const uniqueSellerMap = new Map<string, SellerGalleryProduct>();
      (data as SellerGalleryProduct[]).forEach(product => {
        if (!uniqueSellerMap.has(product.seller_id)) {
          uniqueSellerMap.set(product.seller_id, product);
        }
      });
      setFeaturedBySeller(Array.from(uniqueSellerMap.values()).slice(0, 6));
    } else {
      setFeaturedBySeller([]);
    }

    setIsLoadingGallery(false);
  };

  const galleryTitle = useMemo(() => {
    if (featuredBySeller.length === 0) {
      return 'Seller Gallery';
    }
    return `Seller Gallery (${featuredBySeller.length} nhà bán hàng nổi bật)`;
  }, [featuredBySeller.length]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full h-[600px] md:h-[800px] rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center p-8 text-center"
        >
          <img
            alt="Minimalist Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-1000 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtT22x2Q2RkPBRQhQbAPV8uXXlrmPkS6Ss3E7G4o92oxHdxvMHeoRi-y_bgy9Qj_0zfrMAZVKagqRqcCc3hO_7zzE6kvOuCiPomAYuV85YIZTpPvJd8cyOh6NQbfoKYLHRIarA1kf86OhxLWxS-I_QrwyGq98c3-1gRoD-cA-psgAH2GUusT5wZDEzTvhCyRmgYYBJ3-EiQNyHzsxb6pHQXVwPasaXl0ZkYTJDeZ56w309ZYQrL2JwqkyRpVvZGREdnCIC-sm-V5g"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-8xl font-headline font-semibold text-on-surface leading-tight tracking-tight mb-4"
            >
              The Curated Gallery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-on-surface-variant font-medium mb-8"
            >
              Discover a refined collection of essential pieces, curated for the modern minimalist.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg font-medium hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {[
            { label: 'Apparel', icon: <Shirt size={28} /> },
            { label: 'Timepieces', icon: <Watch size={28} /> },
            { label: 'Home', icon: <Armchair size={28} /> },
            { label: 'Audio', icon: <Headphones size={28} /> },
          ].map((cat, idx) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-surface-container transition-colors shadow-sm text-on-surface font-light">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-on-surface uppercase tracking-widest text-center">{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products by Seller */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl font-headline font-semibold text-on-surface tracking-tight">{galleryTitle}</h2>
            <p className="text-sm text-on-surface-variant mt-1 font-medium italic">
              Mỗi người bán có 1 sản phẩm đại diện trong Gallery
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-primary hover:text-primary-container transition-colors hidden md:block uppercase tracking-widest underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        {isLoadingGallery ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(item => (
              <div key={item} className="h-[420px] rounded-xl bg-surface-container-low animate-pulse" />
            ))}
          </div>
        ) : featuredBySeller.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-surface-container-low text-on-surface-variant">
            Chưa có sản phẩm nổi bật từ người bán.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBySeller.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden relative group cursor-pointer border border-outline-variant/15 shadow-sm block"
                >
                  <div className="h-[340px] p-8 flex items-center justify-center bg-surface-container-low/30">
                    <img
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                      src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 border-t border-outline-variant/20">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em]">{product.category}</p>
                      <span className="text-sm font-medium text-on-surface">
                        ${product.sale_price ?? product.price}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-on-surface line-clamp-1">{product.name}</h3>
                    <p className="mt-2 text-sm text-on-surface-variant flex items-center gap-2">
                      <BadgeCheck size={14} className="text-primary" />
                      {product.seller?.name || 'Seller'} • Sản phẩm nổi bật
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-stone-100/50 dark:bg-stone-900/50 py-32 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight mb-4 italic">The Weekly Editorial</h2>
          <p className="text-on-surface-variant text-lg mb-12 max-w-lg mx-auto">
            Get design insights, exclusive early access, and curated collections delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-surface-container-lowest border-none px-6 py-4 rounded-lg focus:ring-1 focus:ring-primary shadow-sm"
            />
            <button className="bg-on-surface text-surface py-4 px-10 rounded-lg font-medium hover:bg-on-surface/90 transition-colors uppercase tracking-widest text-xs">
              Join
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}