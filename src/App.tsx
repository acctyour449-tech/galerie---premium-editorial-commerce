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
import AuthCallback from './pages/AuthCallback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />

              {/* OAuth Callback - handles Google redirect */}
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Seller Routes */}
              <Route
                path="/seller"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/inventory"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/products/new"
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
