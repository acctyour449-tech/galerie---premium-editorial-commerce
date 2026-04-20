import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-32 text-gray-500">Đang tải bộ sưu tập...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif mb-12 text-center">BỘ SƯU TẬP</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden mb-4">
              <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">{product.name}</h3>
            <p className="mt-2 text-sm text-gray-500">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}