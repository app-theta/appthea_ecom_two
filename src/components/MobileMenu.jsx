import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons';
import Overlay from './Overlay';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';
import { categoryNavTree } from '../utils/categoryTree';

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useCart();
  const { info, categories, features } = useBusiness();
  const navLinks = useMemo(
    () => [
      { label: 'Home', to: '/' },
      ...(features.product_reels ? [{ label: 'Reels', to: '/reels' }] : []),
      ...categoryNavTree(categories),
    ],
    [categories, features.product_reels],
  );

  if (!menuOpen) return null;

  return (
    <>
      <Overlay />
      <nav className="mobile-menu">
        <div className="mobile-menu__head">
          <span className="brand" style={{ fontSize: 'var(--fs-6xl)' }}>
            {info?.logo ? <img src={info.logo} alt={info?.name || 'Home'} className="brand-logo-img" /> : (info?.name || 'AppTheta')}
          </span>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon.close width="20" height="20" />
          </button>
        </div>
        {navLinks.map((link) => (
          <div key={link.label}>
            <Link to={link.to}>{link.label}</Link>
            {link.children?.length > 0 && (
              <div className="sub">
                {link.children.map((c) => (
                  <Link key={c.slug} to={'/shop/' + c.slug}>{c.name}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link to="/cart">Cart</Link>
        <Link to="/account">My Account</Link>
        <Link to="/login">Login</Link>
      </nav>
    </>
  );
}
