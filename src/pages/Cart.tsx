import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-serif mb-4">Giỏ hàng trống</h2>
        <Link to="/shop" className="text-gray-500 hover:text-black underline">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-serif mb-12 border-b pb-4">Giỏ hàng của bạn</h1>
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover object-center" />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>{item.name}</h3>
                  <p className="ml-4">${item.price}</p>
                </div>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">SL:</span>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-16 border px-2 py-1 text-center" />
                </div>
                <button type="button" onClick={() => removeFromCart(item.id)} className="font-medium text-red-500 hover:text-red-700">
                  Xóa
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-200 mt-10 pt-8">
        <div className="flex justify-between text-xl font-medium text-gray-900 mb-6">
          <p>Tổng cộng</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <Link to="/checkout" className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-gray-800 uppercase tracking-widest">
          Thanh toán
        </Link>
      </div>
    </div>
  );
}