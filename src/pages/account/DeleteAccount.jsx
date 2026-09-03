import { useState } from 'react';
import { Link } from 'react-router-dom';
import AccountHead from '../../components/account/AccountHead';
import { useCart } from '../../context/CartContext';
import { DELETE_REASONS, WALLET, REFUNDS, WISHLIST_IDS } from '../../data/account';
import { money } from '../../data/products';

export default function DeleteAccount() {
  const { setToast } = useCart();
  const [agreed, setAgreed] = useState(false);
  const [reason, setReason] = useState(DELETE_REASONS[0]);
  const [feedback, setFeedback] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setToast('Please confirm you understand this cannot be undone');
      return;
    }
    if (!password) {
      setToast('Please confirm your password');
      return;
    }
    setToast('Account deletion requested. Our team will email you.');
  };

  const pending = REFUNDS.filter((r) => r.tone === 'pending').length;

  return (
    <>
      <AccountHead title="Delete Account" description="This closes your AppTheta account permanently. Please read what happens first." />

      <div className="panel">
        <div className="panel__body">
          <div className="danger-box">
            <h3>Deleting your account will:</h3>
            <ul>
              <li>Remove your order history, addresses and saved payment details</li>
              <li>Forfeit your wallet balance of <strong>BDT {money(WALLET.balance)}</strong> — withdraw it first</li>
              <li>Cancel the {pending} refund request currently under review</li>
              <li>Clear all {WISHLIST_IDS.length} wishlist items</li>
            </ul>
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="why">Why are you leaving?</label>
              <select className="select" id="why" style={{ width: '100%' }} value={reason} onChange={(e) => setReason(e.target.value)}>
                {DELETE_REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="feedback">Anything we could have done better? (optional)</label>
              <textarea
                className="textarea"
                id="feedback"
                placeholder="Your feedback helps us improve."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="pass">Confirm your password</label>
              <input
                className="input"
                id="pass"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label className="check-line" style={{ marginBottom: 'var(--sp-6)' }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I understand this action cannot be undone and I accept the loss of my wallet balance and order history.</span>
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
              <button className="btn btn--danger btn--lg" type="submit">Delete My Account</button>
              <Link className="btn btn--outline btn--lg" to="/account">Keep My Account</Link>
            </div>
            <p className="form-note" style={{ marginTop: 'var(--sp-4)' }}>
              Prefer a break instead? <a href="#">Pause notifications</a> and keep your data.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
