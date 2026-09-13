import { useEffect, useState } from 'react';
import AccountHead from '../../components/account/AccountHead';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { useCart } from '../../context/CartContext';
import { auth as authApi } from '../../api/endpoints';
import { parseApiError } from '../../api/errors';

export default function Profile() {
  const { customer, refresh } = useAuth();
  const { features } = useBusiness();
  const { setToast } = useCart();

  const [form, setForm] = useState({ first_name: '', last_name: '', address: '', city: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const [pw, setPw] = useState({ old_password: '', password: '', password_confirmation: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwBusy, setPwBusy] = useState(false);

  const [contactType, setContactType] = useState('email');
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [contactBusy, setContactBusy] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setForm({
      first_name: customer.first_name || '',
      last_name: customer.last_name || '',
      address: customer.address || '',
      city: customer.city || '',
    });
  }, [customer]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({});
    try {
      await authApi.updateProfile(form);
      await refresh();
      setToast('Profile updated');
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);
      setToast(parsed.message);
    } finally { setBusy(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwBusy(true); setPwErrors({});
    try {
      await authApi.changePassword(pw);
      setPw({ old_password: '', password: '', password_confirmation: '' });
      setToast('Password changed');
    } catch (err) {
      const parsed = parseApiError(err);
      setPwErrors(parsed.fields);
      setToast(parsed.message);
    } finally { setPwBusy(false); }
  };

  const sendContactOtp = async () => {
    try {
      await authApi.sendOtp(contactType);
      setOtpSent(true);
      setToast('Verification code sent');
    } catch (e) { setToast(parseApiError(e).message); }
  };

  const confirmContact = async (e) => {
    e.preventDefault();
    setContactBusy(true);
    try {
      await authApi.changeContact({ type: contactType, otp_code: otp, [contactType]: contactValue });
      await refresh();
      setOtp(''); setOtpSent(false); setContactValue('');
      setToast(`${contactType === 'email' ? 'Email' : 'Phone'} updated`);
    } catch (err) {
      setToast(parseApiError(err).message);
    } finally { setContactBusy(false); }
  };

  const showContact = features.email_verification || features.phone_verification;

  return (
    <>
      <AccountHead title="Manage Profile" description="Update your personal details and password." />

      <div className="panel">
        <div className="panel__head"><h2>Profile</h2></div>
        <div className="panel__body">
          <form onSubmit={save}>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="first_name">First name</label>
                <input className="input" id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                {errors.first_name && <div className="review-form__error">{errors.first_name}</div>}
              </div>
              <div className="field">
                <label htmlFor="last_name">Last name</label>
                <input className="input" id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                {errors.last_name && <div className="review-form__error">{errors.last_name}</div>}
              </div>
              <div className="field">
                <label htmlFor="city">City</label>
                <input className="input" id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="address">Address</label>
                <input className="input" id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? 'Saving…' : 'Save Changes'}</button>
          </form>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head"><h2>Change Password</h2></div>
        <div className="panel__body">
          <form onSubmit={changePassword}>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="old_password">Current password</label>
                <input className="input" id="old_password" type="password" autoComplete="current-password" value={pw.old_password} onChange={(e) => setPw({ ...pw, old_password: e.target.value })} />
                {pwErrors.old_password && <div className="review-form__error">{pwErrors.old_password}</div>}
              </div>
              <div />
              <div className="field">
                <label htmlFor="password">New password</label>
                <input className="input" id="password" type="password" autoComplete="new-password" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} />
                {pwErrors.password && <div className="review-form__error">{pwErrors.password}</div>}
              </div>
              <div className="field">
                <label htmlFor="password_confirmation">Confirm new password</label>
                <input className="input" id="password_confirmation" type="password" autoComplete="new-password" value={pw.password_confirmation} onChange={(e) => setPw({ ...pw, password_confirmation: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn--outline" disabled={pwBusy}>{pwBusy ? '…' : 'Change Password'}</button>
          </form>
        </div>
      </div>

      {showContact && (
        <div className="panel">
          <div className="panel__head"><h2>Change {contactType === 'email' ? 'Email' : 'Phone'}</h2></div>
          <div className="panel__body">
            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
              {features.email_verification && (
                <button
                  type="button"
                  className={`btn btn--sm ${contactType === 'email' ? 'btn--primary' : 'btn--outline'}`}
                  onClick={() => { setContactType('email'); setOtpSent(false); setOtp(''); setContactValue(''); }}
                >
                  Email
                </button>
              )}
              {features.phone_verification && (
                <button
                  type="button"
                  className={`btn btn--sm ${contactType === 'phone' ? 'btn--primary' : 'btn--outline'}`}
                  onClick={() => { setContactType('phone'); setOtpSent(false); setOtp(''); setContactValue(''); }}
                >
                  Phone
                </button>
              )}
            </div>
            <form onSubmit={confirmContact}>
              <div className="grid-2">
                <div className="field">
                  <label htmlFor="contact_new">New {contactType === 'email' ? 'email address' : 'phone number'}</label>
                  <input
                    className="input"
                    id="contact_new"
                    type={contactType === 'email' ? 'email' : 'tel'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    required
                  />
                </div>
                <div className="field" style={{ alignSelf: 'end' }}>
                  <button type="button" className="btn btn--outline btn--block" onClick={sendContactOtp} disabled={!contactValue}>
                    Send code
                  </button>
                </div>
              </div>
              {otpSent && (
                <div className="grid-2">
                  <div className="field">
                    <label htmlFor="contact_otp">Verification code</label>
                    <input
                      className="input"
                      id="contact_otp"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div className="field" style={{ alignSelf: 'end' }}>
                    <button type="submit" className="btn btn--primary btn--block" disabled={contactBusy || otp.length < 4}>
                      {contactBusy ? 'Verifying…' : 'Verify & Save'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
