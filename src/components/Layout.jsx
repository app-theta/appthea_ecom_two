import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import QuickView from './QuickView';
import MobileMenu from './MobileMenu';
import SearchPanel from './SearchPanel';
import FloatingButtons from './FloatingButtons';
import Toast from './Toast';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { pathname } = useLocation();
  const { closeAll } = useCart();

  useEffect(() => {
    closeAll();
    window.scrollTo(0, 0);
  }, [pathname, closeAll]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <MobileMenu />
      <SearchPanel />
      <QuickView />
      <CartDrawer />
      <Toast />
    </>
  );
}
