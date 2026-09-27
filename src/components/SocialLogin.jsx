import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { parseApiError } from '../api/errors';
import { loadScript } from '../utils/loadScript';

/**
 * "Continue with Google / Facebook". The provider's own browser SDK signs the shopper in and
 * hands us a token; the backend checks that token was issued to this shop's app, then answers
 * like a normal login. business/info.social_login carries the public ids (null = switched off).
 */
export default function SocialLogin({ onDone }) {
  const { info } = useBusiness();
  const { socialLogin } = useAuth();
  const googleBox = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const googleId = info?.social_login?.google_client_id;
  const facebookId = info?.social_login?.facebook_app_id;

  // the SDK callbacks outlive renders - always call the latest version
  const finish = useRef();
  finish.current = async (provider, token) => {
    if (!token) return;
    setBusy(true);
    setError('');
    try {
      await socialLogin(provider, token);
      onDone?.();
    } catch (e) {
      setError(parseApiError(e).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!googleId) return undefined;
    let alive = true;
    loadScript('https://accounts.google.com/gsi/client')
      .then(() => {
        const gsi = window.google?.accounts?.id;
        if (!alive || !gsi || !googleBox.current) return;
        gsi.initialize({ client_id: googleId, callback: (res) => finish.current('google', res.credential) });
        gsi.renderButton(googleBox.current, {
          theme: 'outline', size: 'large', text: 'continue_with', width: Math.min(googleBox.current.offsetWidth || 320, 400),
        });
      })
      .catch(() => { if (alive) setError('Google sign-in could not load. Please use your email instead.'); });
    return () => { alive = false; };
  }, [googleId]);

  useEffect(() => {
    if (!facebookId) return;
    loadScript('https://connect.facebook.net/en_US/sdk.js')
      .then(() => window.FB?.init({ appId: facebookId, cookie: false, xfbml: false, version: 'v19.0' }))
      .catch(() => {});
  }, [facebookId]);

  const facebook = () => {
    if (!window.FB) {
      setError('Facebook sign-in could not load. Please use your email instead.');
      return;
    }
    window.FB.login((res) => finish.current('facebook', res?.authResponse?.accessToken), { scope: 'email,public_profile' });
  };

  if (!googleId && !facebookId) return null;

  return (
    <div aria-busy={busy}>
      <div className="auth-or">or continue with</div>
      {googleId && <div ref={googleBox} style={{ display: 'flex', justifyContent: 'center', minHeight: 44, marginBottom: 'var(--sp-3)' }} />}
      {facebookId && (
        <button className="btn btn--outline btn--block" type="button" onClick={facebook} disabled={busy}>
          Continue with Facebook
        </button>
      )}
      {error && <div className="review-form__error" style={{ marginTop: 'var(--sp-3)' }}>{error}</div>}
    </div>
  );
}
