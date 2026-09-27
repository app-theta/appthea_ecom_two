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
import NewsletterPopup from './NewsletterPopup';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';

export default function Layout() {
  const { pathname } = useLocation();
  const { closeAll } = useCart();
  const { closed } = useBusiness();

  useEffect(() => {
    closeAll();
    window.scrollTo(0, 0);
  }, [pathname, closeAll]);

  // the API answered 423 - the shop is switched off or its subscription ended
  if (closed) {
    return (
      <main className="container store-closed">
        <h1>We are closed right now</h1>
        <p className="form-note">The shop is not taking orders at the moment. Please check back later.</p>
      </main>
    );
  }

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
      <NewsletterPopup />
    </>
  );
}
