import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { auth as authApi } from '../api/endpoints';
import { parseApiError } from '../api/errors';

/** Forgot password, and - when the mailed link brings a `token` (plus `email`) - the new-password form. */
export default function ForgotPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(''); setFields({});
    try {
      if (token) {
        await authApi.resetPassword({ token, email, password, password_confirmation: confirm });
      } else {
        await authApi.forgotPassword({ email });
      }
      setSent(true);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFields(parsed.fields);
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="auth-card">
          <h2>{token ? 'Set a new password' : 'Forgot password'}</h2>
          <p>
            {token
              ? 'Choose a new password for your account. The link works once, for one hour.'
              : 'Enter your account email and we’ll send you a link to reset your password.'}
          </p>

          {sent ? (
            <div className="checkout-banner checkout-banner--info">
              {token
                ? <>Your password has been changed. <Link to="/login">Log in</Link> with the new one.</>
                : <>If an account exists for {email}, a reset link is on its way.</>}
            </div>
          ) : (
            <form onSubmit={submit}>
              {token ? (
                <>
                  <div className="field">
                    <input className="input" type="password" placeholder="New password" required minLength={4} maxLength={25}
                      autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {fields.password && <div className="review-form__error">{fields.password}</div>}
                  </div>
                  <div className="field">
                    <input className="input" type="password" placeholder="Confirm new password" required
                      autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  </div>
                </>
              ) : (
                <div className="field">
                  <input className="input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              )}
              {error && <div className="review-form__error" style={{ marginBottom: 'var(--sp-3)' }}>{error}</div>}
              <button className="btn btn--primary btn--block btn--lg btn--upper" type="submit" disabled={busy}>
                {busy ? 'Please wait…' : token ? 'Save new password' : 'Send reset link'}
              </button>
              {token && error && (
                <p className="auth-foot"><Link to="/forgot-password">Ask for a new link</Link></p>
              )}
            </form>
          )}

          <p className="auth-foot"><Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}
