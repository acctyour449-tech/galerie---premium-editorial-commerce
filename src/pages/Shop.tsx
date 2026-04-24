import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';

const CATEGORIES = ['All', 'Ceramics', 'Furniture', 'Lighting', 'Textiles', 'Apparel', 'Accessories'];

export default function Shop() {
  const { user } = useAuth();
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [query, setQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy]);

  const fetchProducts = async () => {
    setIsLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (activeCategory !== 'All') {
      query = query.eq('category', activeCategory);
    }

    if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
    else if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (!error && data) setProducts(data as Product[]);
    setIsLoading(false);
  };


  const filteredProducts = products.filter(product => {
    const matchesQuery =
      query.trim().length === 0 ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.short_description || '').toLowerCase().includes(query.toLowerCase());
    const matchesStock = !inStockOnly || product.stock_quantity > 0;
    const matchesSale = !onSaleOnly || !!product.sale_price;
    return matchesQuery && matchesStock && matchesSale;
  });

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    if (!user) return;
    setAddingToCart(productId);
    await addToCart(user.id, productId);
    setAddingToCart(null);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-16 lg:gap-24 max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24 animate-in fade-in duration-700">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-56 lg:w-64 flex-shrink-0">
        <div className="sticky top-32 flex flex-col gap-12">
          <div className="flex flex-col gap-5">
            <h3 className="font-headline text-[0.875rem] font-semibold tracking-wider uppercase text-on-surface">Category</h3>
            <ul className="flex flex-col gap-4 font-body text-[0.875rem]">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left w-full transition-colors ${
                      activeCategory === cat
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-grow flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-6xl font-headline font-light text-on-surface tracking-tight mb-2">Curated Objects</h1>
          <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed">
            A selection of meticulously crafted pieces designed to elevate your living space.
          </p>
        </div>

        <div className="flex flex-col gap-4 py-4 border-b border-surface-container-low">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg min-w-[260px]">
              <Search size={15} className="text-on-surface-variant" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, style, material..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <button
              onClick={() => setInStockOnly(prev => !prev)}
              className={`text-xs px-3 py-2 rounded-full border transition-colors ${inStockOnly ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant/30'}`}
            >
              In stock
            </button>
            <button
              onClick={() => setOnSaleOnly(prev => !prev)}
              className={`text-xs px-3 py-2 rounded-full border transition-colors ${onSaleOnly ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant/30'}`}
            >
              On sale
            </button>
            <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant"><SlidersHorizontal size={14} /> Quick filters</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-on-surface-variant font-medium">
              {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} items`}
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-transparent text-[10px] font-bold uppercase tracking-widest text-on-surface pr-6 outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Sort: Price Low-High</option>
                <option value="price_desc">Sort: Price High-Low</option>
              </select>
              <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-surface-container-low rounded-xl aspect-[4/5] mb-6"></div>
                <div className="h-4 bg-surface-container-low rounded mb-2"></div>
                <div className="h-4 bg-surface-container-low rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-on-surface-variant opacity-40 font-medium uppercase tracking-widest text-sm">
              No products found in {activeCategory}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/product/${product.id}`} className="group flex flex-col gap-6 block outline-none">
                  <div className="bg-surface-container-lowest rounded-xl p-6 aspect-[4/5] flex items-center justify-center relative overflow-hidden shadow-ambient transition-transform duration-500 group-hover:-translate-y-1">
                    <img
                      alt={product.name}
                      className="object-contain w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                      src={product.images[0] || 'https://via.placeholder.com/400x500?text=No+Image'}
                      referrerPolicy="no-referrer"
                    />
                    {product.sale_price && (
                      <div className="absolute top-4 left-4 bg-error text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">
                        Sale
                      </div>
                    )}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2">
                      {user ? (
                        <button
                          onClick={e => handleAddToCart(e, product.id)}
                          disabled={addingToCart === product.id || product.stock_quantity === 0}
                          className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-label text-xs font-medium tracking-wide shadow-lg hover:scale-95 transition-transform uppercase disabled:opacity-50"
                        >
                          {addingToCart === product.id ? '...' : product.stock_quantity === 0 ? 'Sold Out' : 'Add to Bag'}
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          onClick={e => e.stopPropagation()}
                          className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-label text-xs font-medium tracking-wide shadow-lg hover:scale-95 transition-transform uppercase"
                        >
                          Sign in to Buy
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-bold">{product.category}</span>
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg font-semibold text-on-surface leading-tight">{product.name}</h2>
                      <div className="text-right">
                        {product.sale_price ? (
                          <>
                            <span className="text-lg font-medium text-error">${product.sale_price}</span>
                            <span className="text-sm text-on-surface-variant line-through ml-2">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-medium text-on-surface">${product.price}</span>
                        )}
                      </div>
                    </div>
                    {product.short_description && (
                      <p className="text-sm text-on-surface-variant mt-1 italic">{product.short_description}</p>
                    )}
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <p className="text-xs text-error font-bold mt-1 uppercase tracking-wider">Only {product.stock_quantity} left</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}