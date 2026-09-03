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
  const { info } = useBusiness();
  const name = info?.name || 'AppTheta';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="footer-brand" to="/">{name}</Link>
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
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
