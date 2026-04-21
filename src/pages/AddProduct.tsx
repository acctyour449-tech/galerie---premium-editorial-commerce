import { motion } from 'motion/react';
import { ArrowLeft, Upload, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SellerLayout from '../components/seller/SellerLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useState, FormEvent } from 'react';

const CATEGORIES = ['Ceramics', 'Furniture', 'Lighting', 'Textiles', 'Apparel', 'Accessories', 'Electronics', 'Art'];

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    sale_price: '',
    category: '',
    material: '',
    designer: '',
    sku: '',
    stock_quantity: '',
    tags: '',
    imageUrl: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (isPublishing: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.name || !form.price || !form.category || !form.stock_quantity) {
      setError('Please fill in all required fields: Name, Price, Category, Stock Quantity');
      return;
    }

    setIsLoading(true);
    setError('');

    const images = form.imageUrl ? [form.imageUrl] : [];
    const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const { data, error: dbError } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        name: form.name,
        description: form.description || null,
        short_description: form.short_description || null,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        category: form.category,
        material: form.material || null,
        designer: form.designer || null,
        sku: form.sku || null,
        stock_quantity: parseInt(form.stock_quantity),
        images,
        tags,
        is_active: isPublishing,
      })
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(isPublishing ? 'Product published successfully!' : 'Draft saved!');
    setTimeout(() => navigate('/seller/products'), 1500);
    setIsLoading(false);
  };

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
            <button
              onClick={(e) => handleSave(false, e)}
              disabled={isLoading}
              className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={(e) => handleSave(true, e)}
              disabled={isLoading}
              className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Publish Product'}
            </button>
          </div>
        </header>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle size={16} />
            <span>{success}</span>
          </motion.div>
        )}

        <div className="space-y-12">
          {/* Basic Info */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Object Information</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="productName">
                  Product Name <span className="text-error">*</span>
                </label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="productName"
                  placeholder="e.g. Minimalist Ceramic Vase"
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="shortDesc">
                  Short Description
                </label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  id="shortDesc"
                  placeholder="e.g. Matte white earthenware"
                  value={form.short_description}
                  onChange={e => updateForm('short_description', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="productDescription">
                  Full Description
                </label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none resize-none min-h-[160px]"
                  id="productDescription"
                  placeholder="Detail the features, materials, and care instructions..."
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  rows={4}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">Material</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                    placeholder="e.g. 100% Belgian Linen"
                    value={form.material}
                    onChange={e => updateForm('material', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">Designer</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                    placeholder="e.g. Studio Koto"
                    value={form.designer}
                    onChange={e => updateForm('designer', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Image URL */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Product Image</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">Image URL</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={e => updateForm('imageUrl', e.target.value)}
                />
              </div>
              {form.imageUrl && (
                <div className="w-40 h-48 rounded-2xl overflow-hidden bg-surface-container-low">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              )}
              <p className="text-[10px] text-on-surface-variant opacity-40 italic">
                Note: For production, integrate Supabase Storage for direct file uploads.
              </p>
            </div>
          </motion.section>

          {/* Pricing & Inventory */}
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
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">
                    Regular Price <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-6 flex items-center text-on-surface-variant opacity-40 font-bold">$</span>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={e => updateForm('price', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">Sale Price (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-6 flex items-center text-on-surface-variant opacity-40 font-bold">$</span>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.sale_price}
                      onChange={e => updateForm('sale_price', e.target.value)}
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
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">SKU</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none font-mono"
                    placeholder="e.g. VASE-CER-01"
                    value={form.sku}
                    onChange={e => updateForm('sku', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">
                    Stock Quantity <span className="text-error">*</span>
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                    placeholder="0"
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={e => updateForm('stock_quantity', e.target.value)}
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
            className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 border border-black/5 shadow-sm"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-on-surface opacity-80">Categorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">
                  Category <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none appearance-none cursor-pointer"
                    value={form.category}
                    onChange={e => updateForm('category', e.target.value)}
                  >
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60">Tags (comma separated)</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none"
                  placeholder="e.g. Minimalist, Ceramic, Handmade"
                  value={form.tags}
                  onChange={e => updateForm('tags', e.target.value)}
                />
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </SellerLayout>
  );
}
