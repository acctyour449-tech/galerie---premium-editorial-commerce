/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SellerDashboard from './pages/SellerDashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Seller Routes */}
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/inventory" element={<Inventory />} />
            <Route path="/seller/products" element={<Inventory />} />
            <Route path="/seller/products/new" element={<AddProduct />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
