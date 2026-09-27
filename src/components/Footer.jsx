import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons';
import { useBusiness } from '../context/BusinessContext';
import { useSubscribe } from '../hooks/useSubscribe';

const LINKS = [
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact us', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms and Conditions', to: '/terms' },
  { label: 'Shipping Policy', to: '/shipping-policy' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Return Policy', to: '/return-policy' },
  { label: 'My Account', to: '/account' }
];

export default function Footer() {
  const { info, features } = useBusiness();
  const name = info?.name || 'AppTheta';
  const [email, setEmail] = useState('');
  const newsletter = useSubscribe();

  const normalizeUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  // only the networks the shop has actually filled in
  const socials = [
    { url: normalizeUrl(info?.facebook_link), label: 'Facebook', icon: Icon.facebook },
    { url: normalizeUrl(info?.instagram_link), label: 'Instagram', icon: Icon.instagram },
    { url: normalizeUrl(info?.x_link || info?.twitter_link), label: 'X', icon: Icon.x },
    { url: normalizeUrl(info?.linkedin_link), label: 'LinkedIn', icon: Icon.linkedin },
    { url: normalizeUrl(info?.youtube_link), label: 'YouTube', icon: Icon.youtube },
    { url: normalizeUrl(info?.whatsapp_link), label: 'WhatsApp', icon: Icon.whatsapp },
  ].filter((s) => Boolean(s.url));

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

            {features.is_subscribe_newsletter && (
              newsletter.done ? (
                <p className="footer-about">Thanks for subscribing!</p>
              ) : (
                <form
                  className="footer-subscribe"
                  onSubmit={(e) => { e.preventDefault(); newsletter.subscribe(email); }}
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
                  <button type="submit" className="btn btn--primary" disabled={newsletter.busy}>Join</button>
                </form>
              )
            )}
            {newsletter.error && <p className="footer-about">{newsletter.error}</p>}

            {socials.length > 0 && (
              <div className="footer-social">
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}><s.icon /></a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
