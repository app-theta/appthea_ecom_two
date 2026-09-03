import { useState } from 'react';
import { Icon } from './Icons';
import Overlay from './Overlay';
import { checkout as checkoutApi } from '../api/endpoints';
import { parseApiError } from '../api/errors';

export default function OtpModal({ open, phone, onClose, onVerified }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await checkoutApi.verifyOtp({ phone, otp_code: code });
      onVerified();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally { setBusy(false); }
  };

  const resend = async () => {
    setError('');
    try {
      await checkoutApi.sendOtp(phone);
    } catch (err) {
      setError(parseApiError(err).message);
    }
  };

  return (
    <>
      <Overlay />
      <div className="modal">
        <div className="modal__box modal__box--narrow">
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <Icon.close width="18" height="18" />
          </button>
          <div>
            <h3 className="qv-title">Verify your phone</h3>
            <p className="otp-note">We sent a verification code to {phone}. Enter it below to confirm your order.</p>
            <form onSubmit={verify}>
              <div className="field">
                <input
                  className="input otp-input"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
                {error && <div className="review-form__error">{error}</div>}
              </div>
              <button type="submit" className="btn btn--primary btn--block" disabled={busy || code.length < 4}>
                {busy ? 'Verifying…' : 'Verify & Place Order'}
              </button>
            </form>
            <button type="button" className="link-reset" style={{ margin: 'var(--sp-4) auto 0', display: 'block' }} onClick={resend}>
              Resend code
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
