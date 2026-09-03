import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth as authApi } from '../api/endpoints';
import { parseApiError } from '../api/errors';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Forgot password</h2>
          <p>Enter your account email and we&apos;ll send you a link to reset your password.</p>

          {sent ? (
            <div className="checkout-banner checkout-banner--info">
              If an account exists for {email}, a reset link is on its way.
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="field">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <div className="review-form__error">{error}</div>}
              </div>
              <button className="btn btn--primary btn--block btn--lg btn--upper" type="submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="auth-foot"><Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}
