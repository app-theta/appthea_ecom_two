import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AccountLayout from './components/account/AccountLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Reels from './pages/Reels';
import Policy from './pages/Policy';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderCancel from './pages/OrderCancel';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Overview from './pages/account/Overview';
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import Refund from './pages/account/Refund';
import Wallet from './pages/account/Wallet';
import Wishlist from './pages/account/Wishlist';
import Profile from './pages/account/Profile';
import Points from './pages/account/Points';
import DeleteAccount from './pages/account/DeleteAccount';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="reels" element={<Reels />} />
        <Route path="reels/:slug" element={<Reels />} />
        <Route path="privacy" element={<Policy field="privacy_policy" title="Privacy Policy" />} />
        <Route path="terms" element={<Policy field="terms_condition" title="Terms & Conditions" />} />
        <Route path="shipping-policy" element={<Policy field="shipping_policy" title="Shipping Policy" />} />
        <Route path="refund-policy" element={<Policy field="refund_policy" title="Refund Policy" />} />
        <Route path="return-policy" element={<Policy field="return_policy" title="Return Policy" />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/success" element={<OrderSuccess />} />
        <Route path="order/cancel" element={<OrderCancel />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="refund" element={<Refund />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
          <Route path="points" element={<Points />} />
          <Route path="delete" element={<DeleteAccount />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
