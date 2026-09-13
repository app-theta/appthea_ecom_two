import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { useBusiness } from '../context/BusinessContext';

const SEEN_KEY = 'apptheta_newsletter_seen';

/** Shows a one-time "join our newsletter" modal a few seconds after load,
    gated by the `newsletter_popup` business feature flag. Any dismissal
    marks it seen so it never shows again on this device. */
export default function NewsletterPopup() {
  const { features, info } = useBusiness();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!features.newsletter_popup) return;
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch { /* ignore */ }
    if (seen) return;
    const id = window.setTimeout(() => setOpen(true), 6000);
    return () => window.clearTimeout(id);
  }, [features.newsletter_popup]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
  };

  const subscribe = (e) => {
    e.preventDefault();
    setDone(true);
  };

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="modal">
        <div className="modal__box modal__box--narrow">
          <button className="modal__close" onClick={close} aria-label="Close">
            <Icon.close width="18" height="18" />
          </button>
          <div>
            <h3 className="qv-title">Join our newsletter</h3>
            {done ? (
              <p className="mb-0">Thanks for subscribing!</p>
            ) : (
              <>
                <p className="otp-note">Get updates on new arrivals, sales and more from {info?.name || 'us'}.</p>
                <form onSubmit={subscribe}>
                  <div className="field">
                    <input
                      type="email"
                      className="input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-label="Email address"
                    />
                  </div>
                  <button type="submit" className="btn btn--primary btn--block">Subscribe</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
