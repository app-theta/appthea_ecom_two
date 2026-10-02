import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountHead from '../../components/account/AccountHead';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { account } from '../../api/endpoints';
import { parseApiError } from '../../api/errors';

/** Closes the customer's account for good - the password and an "I understand" tick are both required. */
export default function DeleteAccount() {
  const { logout } = useAuth();
  const { setToast } = useCart();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setToast('Please confirm you understand this cannot be undone');
      return;
    }
    if (!password) {
      setToast('Please confirm your password');
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      await account.deleteAccount({ password, agree: agreed });
      setToast('Your account was deleted.');
      // leave the account pages first, then drop the (already revoked) session
      navigate('/', { replace: true });
      logout();
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);
      if (!Object.keys(parsed.fields).length) setToast(parsed.message);
      setBusy(false);
    }
  };

  return (
    <>
      <AccountHead title="Delete Account" description="This closes your account at this shop for good. Please read what happens first." />

      <div className="panel">
        <div className="panel__body">
          <div className="danger-box">
            <h3>Deleting your account will:</h3>
            <ul>
              <li>Sign you out on every device</li>
              <li>Hide your orders, wishlist, reviews and chat from this account</li>
              <li>Keep the orders you placed with the shop, for its records</li>
              <li>Free your email and phone - you can sign up again with them later</li>
            </ul>
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="pass">Confirm your password</label>
              <input
                className="input"
                id="pass"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="review-form__error">{errors.password}</div>}
              <p className="form-note" style={{ marginTop: 'var(--sp-2)' }}>
                Signed in with Google or Facebook? Set a password first with <Link to="/forgot-password">Forgot password</Link>.
              </p>
            </div>

            <label className="check-line" style={{ marginBottom: 'var(--sp-6)' }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I understand this action cannot be undone.</span>
            </label>
            {errors.agree && <div className="review-form__error">{errors.agree}</div>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
              <button className="btn btn--danger btn--lg" type="submit" disabled={busy}>{busy ? 'Deleting…' : 'Delete My Account'}</button>
              <Link className="btn btn--outline btn--lg" to="/account">Keep My Account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
