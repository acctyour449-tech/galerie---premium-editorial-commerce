import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
    }
    if (id) fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-32">Đang tải...</div>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div className="aspect-w-1 aspect-h-1 bg-gray-100 mb-8 lg:mb-0">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-center object-cover" />
        </div>
        <div className="flex flex-col justify-center px-4 sm:px-0">
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">{product.name}</h1>
          <p className="mt-4 text-2xl text-gray-900">${product.price}</p>
          <div className="mt-8">
            <p className="text-base text-gray-500 leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-10">
            <button onClick={handleAddToCart} className="w-full bg-black border border-transparent py-4 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 uppercase tracking-widest">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}