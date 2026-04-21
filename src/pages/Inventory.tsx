import { motion, AnimatePresence } from 'motion/react';
import { Plus, Filter, LayoutGrid, List, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import SellerLayout from '../components/seller/SellerLayout';
import { useState, useEffect, useRef } from 'react';

const PAGE_SIZE = 12;

export default function Inventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (user) fetchProducts();
  }, [user, page]);

  const fetchProducts = async () => {
    if (!user) return;
    setIsLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      setProducts(data as Product[]);
      setTotal(count || 0);
    }
    setIsLoading(false);
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);

    if (!error) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
      showMsg(product.is_active ? 'Product hidden from shop' : 'Product is now live!');
    }
    setOpenMenu(null);
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setTotal(prev => prev - 1);
      showMsg('Product deleted');
    }
    setDeleteConfirm(null);
  };

  const showMsg = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <SellerLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-10 animate-in fade-in duration-700">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h2 className="text-[2.5rem] font-headline font-semibold text-on-surface tracking-tighter leading-tight italic">Inventory</h2>
            <p className="text-on-surface-variant font-medium opacity-60">
              {total} product{total !== 1 ? 's' : ''} in your stockroom
            </p>
          </div>
          <Link
            to="/seller/products/new"
            className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </header>

        {/* Toast message */}
        <AnimatePresence>
          {actionMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-6 right-6 z-50 bg-on-surface text-surface px-6 py-4 rounded-xl shadow-2xl text-sm font-bold"
            >
              {actionMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest rounded-3xl p-10 max-w-sm w-full shadow-2xl border border-black/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-error" size={24} />
                <h3 className="text-xl font-bold text-on-surface">Delete Product?</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-8">This action cannot be undone. The product will be permanently removed from your inventory.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(deleteConfirm)}
                  className="flex-1 py-3 bg-error text-white rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-surface-container-low rounded-2xl aspect-square mb-4"></div>
                <div className="h-4 bg-surface-container-low rounded mb-2"></div>
                <div className="h-4 bg-surface-container-low rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-on-surface-variant opacity-40 font-medium uppercase tracking-widest text-sm mb-4">No products yet</p>
            <Link to="/seller/products/new" className="text-primary font-bold underline underline-offset-4 text-sm">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-surface-container-lowest rounded-2xl p-6 border border-black/5 shadow-sm group hover:shadow-ambient transition-all duration-500 flex flex-col ${!product.is_active ? 'opacity-60' : ''}`}
              >
                <div className="aspect-square bg-surface-container-low rounded-xl overflow-hidden mb-6 relative">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/400?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform group-hover:scale-110 duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-2 ${
                    product.is_active
                      ? 'bg-surface-container-lowest/90 text-[#00837c]'
                      : 'bg-surface-container-lowest/90 text-on-surface-variant'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-[#00837c]' : 'bg-on-surface-variant opacity-50'}`}></span>
                    {product.is_active ? 'Active' : 'Hidden'}
                  </div>
                </div>

                <div className="flex flex-col flex-grow space-y-4">
                  <div className="space-y-1">
                    {product.sku && <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-[0.2em] opacity-40">SKU: {product.sku}</p>}
                    <h3 className="text-lg font-headline font-semibold text-on-surface leading-tight tracking-tight">{product.name}</h3>
                    <p className="text-xs text-on-surface-variant opacity-60">{product.category}</p>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-surface-container-low">
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-tighter opacity-40 mb-1">Price</p>
                      <p className="text-base font-bold text-on-surface tracking-tight">${product.price}.00</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-tighter opacity-40 mb-1">Stock</p>
                      <p className={`text-base font-bold tracking-tight ${product.stock_quantity <= 5 ? 'text-error' : 'text-primary'}`}>
                        {product.stock_quantity} <span className="text-[10px] font-normal text-on-surface-variant tracking-normal opacity-40">units</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action menu */}
                <div className="mt-6 pt-6 border-t border-surface-container-low flex justify-between items-center">
                  <button
                    onClick={() => toggleActive(product)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {product.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
                    {product.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    p === page
                      ? 'bg-surface-container-high text-on-surface'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
