import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Heart, ShoppingBag, Share2, ChevronLeft, Star } from 'lucide-react';
import { supabase, Product, Review } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useState, useEffect } from 'react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<(Review & { reviewer: { name: string } })[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, seller:profiles(name, email, avatar_url)')
      .eq('id', productId)
      .single();

    if (!error && data) {
      setProduct(data as Product);

      // Fetch related products
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', productId)
        .eq('is_active', true)
        .limit(3);
      if (related) setRelatedProducts(related as Product[]);

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, reviewer:profiles(name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (reviewData) setReviews(reviewData as any);

      // Check wishlist
      if (user) {
        const { data: wishlistItem } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle();
        setIsWishlisted(!!wishlistItem);
      }
    }
    setIsLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user || !product) return;
    setIsAddingToCart(true);
    const { error } = await addToCart(user.id, product.id, 1, selectedSize || undefined);
    if (!error) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
    setIsAddingToCart(false);
  };

  const handleToggleWishlist = async () => {
    if (!user || !product) return;
    if (isWishlisted) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id });
    }
    setIsWishlisted(!isWishlisted);
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-32 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-20 text-center font-bold uppercase tracking-widest text-on-surface-variant opacity-40">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-16 animate-in fade-in duration-700">
      {/* Breadcrumb */}
      <Link to="/shop" className="flex items-center gap-2 text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-12 hover:text-primary transition-colors group">
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Shop
      </Link>

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
              src={product.images[activeImage] || product.images[0]}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="font-label text-xs text-primary font-bold tracking-[0.2em] uppercase">{product.category}</p>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full transition-all ${isWishlisted ? 'text-error' : 'text-on-surface-variant hover:text-error'}`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
            <h1 className="text-6xl font-headline font-semibold text-on-surface tracking-tighter leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              {product.sale_price ? (
                <>
                  <span className="text-2xl font-bold text-error">${product.sale_price}</span>
                  <span className="text-xl text-on-surface-variant line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-2xl text-on-surface-variant font-medium">${product.price}.00</span>
              )}
              {reviews.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  <Star size={14} fill="currentColor" className="text-amber-400" />
                  <span className="text-sm font-bold text-on-surface">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-on-surface-variant">({reviews.length})</span>
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-on-surface uppercase tracking-widest">The Object</h3>
              <p className="text-base text-on-surface-variant leading-relaxed opacity-80">{product.description}</p>
            </div>
          )}

          {/* Stock indicator */}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold text-error uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              Only {product.stock_quantity} left in stock
            </div>
          )}

          <div className="flex flex-col gap-8 p-8 bg-surface-container-low rounded-xl">
            {/* Size selector */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface font-semibold uppercase tracking-wider">Select Size</span>
                <button className="text-xs text-primary underline underline-offset-4">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
                    className={`py-4 rounded font-medium text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-lowest text-on-surface border border-outline-variant/15 hover:bg-surface-container'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock_quantity === 0 || addedToCart}
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-semibold text-base hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : addedToCart ? (
                    '✓ Added to Bag!'
                  ) : product.stock_quantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Bag
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/product/${product.id}` } }}
                  className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-lg font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Sign in to Purchase
                </Link>
              )}
              <Link
                to="/checkout"
                className="w-full py-5 bg-secondary-fixed text-on-secondary-fixed rounded-lg font-semibold text-base hover:bg-secondary-fixed/80 active:scale-95 transition-all text-center"
              >
                Express Checkout
              </Link>
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-col border-t border-surface-container-high pt-6">
            {product.material && (
              <details className="group border-b border-surface-container-high/50">
                <summary className="flex justify-between items-center py-6 cursor-pointer list-none">
                  <span className="font-semibold text-sm uppercase tracking-widest text-on-surface">Material & Care</span>
                  <Plus size={18} className="transition-transform group-open:rotate-45" />
                </summary>
                <div className="pb-8 text-sm text-on-surface-variant leading-relaxed">
                  Handcrafted from {product.material}. {product.designer && `Designed by ${product.designer}.`}
                </div>
              </details>
            )}
            {Object.keys(product.specs || {}).length > 0 && (
              <details className="group border-b border-surface-container-high/50">
                <summary className="flex justify-between items-center py-6 cursor-pointer list-none">
                  <span className="font-semibold text-sm uppercase tracking-widest text-on-surface">Specifications</span>
                  <Plus size={18} className="transition-transform group-open:rotate-45" />
                </summary>
                <div className="pb-8 space-y-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">{key}</span>
                      <span className="text-on-surface font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="border-t border-surface-container-high pt-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface mb-6">
                Reviews ({reviews.length})
              </h3>
              <div className="space-y-6">
                {reviews.slice(0, 3).map(review => (
                  <div key={review.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex-shrink-0 flex items-center justify-center text-sm font-bold text-on-surface-variant">
                      {review.reviewer?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-on-surface">{review.reviewer?.name}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={12} fill={star <= review.rating ? 'currentColor' : 'none'} className="text-amber-400" />
                          ))}
                        </div>
                      </div>
                      {review.title && <p className="text-sm font-medium text-on-surface mb-1">{review.title}</p>}
                      {review.body && <p className="text-sm text-on-surface-variant">{review.body}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-32 pt-24 border-t border-surface-container-high">
          <h2 className="text-2xl font-headline font-semibold text-on-surface mb-12 text-center tracking-tight uppercase tracking-[0.2em]">
            Curated Accompaniments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group flex flex-col gap-6 p-6 bg-surface-container-low/30 rounded-xl hover:bg-surface-container-lowest hover:shadow-ambient transition-all duration-500"
              >
                <div className="w-full aspect-[4/5] bg-surface-container rounded-lg overflow-hidden relative">
                  <img
                    alt={p.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                    src={p.images[0]}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-semibold text-on-surface">{p.name}</h4>
                  <p className="text-sm text-on-surface-variant">${p.price}.00</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
