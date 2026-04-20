import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const uploadImage = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error: any) {
      alert('Lỗi tải ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const generateDescription = async () => {
    if (!name) return alert('Vui lòng nhập tên sản phẩm trước');
    setGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Viết một đoạn mô tả ngắn (khoảng 3 câu) chuẩn editorial sang trọng, tối giản cho sản phẩm tên là: "${name}".`,
      });
      setDescription(response.text);
    } catch (error) {
      alert("Lỗi AI. Vui lòng kiểm tra API Key.");
    }
    setGenerating(false);
  };

  const handlePublish = async () => {
    const { error } = await supabase.from('products').insert([
      { name, price: parseFloat(price), description, image_url: imageUrl }
    ]);
    if (error) {
      alert('Lỗi lưu sản phẩm: ' + error.message);
    } else {
      alert('Đăng sản phẩm thành công!');
      setName(''); setPrice(''); setDescription(''); setImageUrl('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-serif mb-8 border-b pb-4">Thêm Sản Phẩm Mới</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Giá ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm</label>
          <div className="border-2 border-dashed border-gray-300 p-6 text-center relative bg-gray-50">
            <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {uploading ? <p>Đang tải ảnh lên...</p> : <p className="text-gray-500">Nhấn hoặc kéo thả ảnh vào đây</p>}
            {imageUrl && <img src={imageUrl} alt="Preview" className="h-32 object-contain mx-auto mt-4" />}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Mô tả sản phẩm</label>
            <button type="button" onClick={generateDescription} disabled={generating} className="text-xs bg-gray-200 px-3 py-1 hover:bg-gray-300 transition">
              {generating ? 'Đang viết...' : '✨ Tự động viết bằng AI'}
            </button>
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 p-2" />
        </div>

        <button onClick={handlePublish} className="w-full bg-black text-white py-4 hover:bg-gray-800 uppercase tracking-widest text-sm">
          Đăng Sản Phẩm
        </button>
      </div>
    </div>
  );
}