/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, Upload, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SellerLayout from '../components/seller/SellerLayout';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleImageUpload = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!name) return alert('Please enter a Product Name first.');
    setGenerating(true);
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short, luxurious, editorial product description (max 3 sentences) for a high-end product named: "${name}". Focus on material integrity and timeless form.`,
      });
      setDescription(response.text);
    } catch (error) {
      alert('Failed to generate AI description. Check API Key.');
    }
    setGenerating(false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    const { error } = await supabase.from('products').insert([{
      name,
      description,
      short_description: description.substring(0, 50) + '...',
      price: parseFloat(price) || 0,
      category,
      images: imageUrl ? [imageUrl] : [],
      specs: {}
    }]);

    if (error) {
      alert('Error publishing: ' + error.message);
    } else {
      alert('Object published successfully!');
      navigate('/seller/inventory');
    }
    setPublishing(false);
  };

  return (
    <SellerLayout>
      <div className="max-w-5xl mx-auto p-8 md:p-12 pb-32 animate-in fade-in duration-700">
        <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <Link 
              to="/seller/inventory" 
              className="flex items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-4 group"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Stockroom
            </Link>
            <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-on-surface leading-tight">Add New Object</h2>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-all">Save Draft</button>
            <button onClick={handlePublish} disabled={publishing} className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-primary bg-gradient-to-r from-primary to-primary-container hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">
              {publishing ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </header>

        <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
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
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                  id="productName" 
                  placeholder="e.g. Minimalist Ceramic Vase" 
                  type="text"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="block text-[10px] font-bold text-on-surface-variant tracking-[0.2em] uppercase opacity-60" htmlFor="productDescription">Description</label>
                  <button type="button" onClick={handleGenerateDescription} disabled={generating} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
                    {generating ? 'Writing...' : '✨ Auto-write with AI'}
                  </button>
                </div>
                <textarea 
                  value={description} onChange={(e) => setDescription(e.target.value)}
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
            <div className="border-2 border-dashed border-outline-variant/30 rounded-3xl p-16 flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface hover:border-primary/30 transition-all relative group overflow-hidden">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="h-48 object-contain mix-blend-multiply" />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors mb-6 shadow-sm">
                    <Upload size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-on-surface mb-2 uppercase tracking-widest">{uploading ? 'Uploading imagery...' : 'Drag & drop high-resolution imagery'}</p>
                  <p className="text-xs text-on-surface-variant font-medium opacity-60">or <span className="text-primary underline underline-offset-4">browse selection</span> (JPEG, PNG up to 10MB)</p>
                </>
              )}
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
                      value={price} onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none" 
                      id="price" 
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
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-1 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none appearance-none cursor-pointer" 
                    id="category"
                  >
                    <option value="">Select a curation...</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Ceramics">Ceramics</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </motion.section>
        </form>
      </div>
    </SellerLayout>
  );
}