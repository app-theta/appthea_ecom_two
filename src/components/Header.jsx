import { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Icon } from './Icons';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';
import { categoryNavTree } from '../utils/categoryTree';

function Marquee({ address }) {
  const item = (
    <span className="marquee__item">
      Visit our flagship outlet
      <Icon.pin width="14" height="14" />
      <b>{address}</b>
    </span>
  );
  return (
    <div className="topbar">
      <div className="marquee">
        {Array.from({ length: 6 }, (_, i) => <span key={i} style={{ display: 'contents' }}>{item}</span>)}
      </div>
    </div>
  );
}

export default function Header() {
  const { count, setDrawerOpen, setMenuOpen, setSearchOpen } = useCart();
  const { info, categories } = useBusiness();

  const navLinks = useMemo(
    () => [{ label: 'Home', to: '/' }, ...categoryNavTree(categories, { limit: 5 })],
    [categories],
  );

  return (
    <>
      <Marquee address={info?.address} />
      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <button className="icon-btn hamburger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <Icon.menu />
            </button>
            <form className="header-search" onSubmit={(e) => e.preventDefault()}>
              <Icon.search />
              <input
                type="search"
                placeholder="Search products..."
                onFocus={() => setSearchOpen(true)}
                readOnly
              />
            </form>
          </div>

          <Link className="brand" to="/">{info?.name || 'AppTheta'}</Link>

          <div className="header-actions">
            <button className="icon-btn mobile-search-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Icon.search />
            </button>
            <Link className="icon-btn" to="/account" aria-label="My account">
              <Icon.user />
            </Link>
            <button className="icon-btn" aria-label="Cart" onClick={() => setDrawerOpen(true)}>
              <Icon.cart />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <ul className="main-nav__list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => 'main-nav__link' + (isActive ? ' is-active' : '')}
              >
                {link.label}
                {link.children?.length > 0 && <Icon.chevronDown />}
              </NavLink>
              {link.children?.length > 0 && (
                <div className="dropdown">
                  {link.children.map((c) => (
                    <Link key={c.slug} to={'/shop/' + c.slug}>{c.name}</Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
