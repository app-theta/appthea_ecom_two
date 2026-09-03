import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { Icon } from '../Icons';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAsync } from '../../hooks/useAsync';
import { account } from '../../api/endpoints';
import { initials } from '../../utils/format';

export default function AccountLayout() {
  const { customer, logout } = useAuth();
  const wishlist = useWishlist();
  const navigate = useNavigate();
  const { data } = useAsync((signal) => account.dashboard({ signal }), []);

  const name = [customer?.first_name, customer?.last_name].filter(Boolean).join(' ') || customer?.username || 'Account';

  const links = [
    { to: '/account', end: true, icon: 'grid', label: 'Dashboard' },
    { to: '/account/orders', icon: 'box', label: 'My Orders', badge: data?.total_orders },
    { to: '/account/refund', icon: 'refund', label: 'Refund Request' },
    { to: '/account/wallet', icon: 'wallet', label: 'Wallet' },
    { to: '/account/wishlist', icon: 'heart', label: 'Wishlist', badge: wishlist.count || undefined },
  ];

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container container-narrow">
      <div className="breadcrumb">
        <Link to="/">Home</Link><span>/</span><span className="current">My Account</span>
      </div>
      <div className="account-layout">
        <aside className="account-side">
          <div className="account-user">
            <span className="account-user__avatar">{initials(name)}</span>
            <div>
              <strong>{name}</strong>
              <span>{customer?.phone}</span>
            </div>
          </div>
          <nav className="account-nav">
            {links.map((l) => {
              const Ico = Icon[l.icon];
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  <Ico />
                  <span>{l.label}</span>
                  {l.badge ? <span className="account-nav__badge">{l.badge}</span> : null}
                </NavLink>
              );
            })}
            <button type="button" onClick={onLogout}>
              <Icon.logout /><span>Logout</span>
            </button>
            <NavLink
              to="/account/delete"
              className={({ isActive }) => 'is-danger' + (isActive ? ' is-active' : '')}
            >
              <Icon.trash /><span>Delete Account</span>
            </NavLink>
          </nav>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  );
}
