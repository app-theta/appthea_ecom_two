import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons';
import { useBusiness } from '../context/BusinessContext';

const LINKS = [
  { label: 'About us', to: '/shop' },
  { label: 'Privacy Policy', to: '/shop' },
  { label: 'Terms and Conditions', to: '/shop' },
  { label: 'My Account', to: '/account' }
];

export default function Footer() {
  const { info, features } = useBusiness();
  const name = info?.name || 'AppTheta';
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="footer-brand" to="/">
              {info?.logo ? <img src={info.logo} alt={name} className="brand-logo-img" /> : name}
            </Link>
            <p className="footer-about">
              <b>{name}</b> — your destination for the latest fashion trends.<br />
              {info?.address}<br />
              {info?.phone}<br />
              {info?.email}
            </p>
          </div>
          <div className="footer-col">
            <h4>Useful Links</h4>
            <ul>
              {LINKS.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href={info?.facebook_link || '#'} aria-label="Facebook"><Icon.facebook /></a>
              <a href={info?.instagram_link || '#'} aria-label="Instagram"><Icon.instagram /></a>
              <a href="#" aria-label="Messenger"><Icon.messenger /></a>
            </div>
          </div>
          {features.is_subscribe_newsletter && (
            <div className="footer-col">
              <h4>Newsletter</h4>
              {done ? (
                <p className="footer-about">Thanks for subscribing!</p>
              ) : (
                <form
                  style={{ display: 'flex', gap: 'var(--sp-2)' }}
                  onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setDone(true); }}
                >
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    required
                  />
                  <button type="submit" className="btn btn--primary">Join</button>
                </form>
              )}
            </div>
          )}
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
