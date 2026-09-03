import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { parseApiError } from '../api/errors';

export default function Register() {
  const { register } = useAuth();
  const { features } = useBusiness();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '', password: '', password_confirmation: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({}); setError('');
    try {
      await register(form);
      navigate('/account', { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);
      setError(parsed.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="auth-card">
          <h2>Register</h2>
          <p>Create an account to check out faster and track your orders.</p>

          <form onSubmit={submit}>
            <div className="field"><input className="input" placeholder="First name" required value={form.first_name} onChange={set('first_name')} /></div>
            {errors.first_name && <div className="review-form__error">{errors.first_name}</div>}
            <div className="field"><input className="input" placeholder="Last name" required value={form.last_name} onChange={set('last_name')} /></div>
            {errors.last_name && <div className="review-form__error">{errors.last_name}</div>}
            <div className="field"><input className="input" type="tel" placeholder="Phone number" required value={form.phone} onChange={set('phone')} /></div>
            {errors.phone && <div className="review-form__error">{errors.phone}</div>}
            <div className="field"><input className="input" type="email" placeholder="Email (optional)" value={form.email} onChange={set('email')} /></div>
            {errors.email && <div className="review-form__error">{errors.email}</div>}
            <div className="field pass-wrap">
              <input
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="Password"
                required
                value={form.password}
                onChange={set('password')}
              />
              <button type="button" className="pass-toggle" onClick={() => setShow(!show)} aria-label="Show password">
                <Icon.eye width="19" height="19" />
              </button>
              {errors.password && <div className="review-form__error">{errors.password}</div>}
            </div>
            <div className="field">
              <input
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="Confirm password"
                required
                value={form.password_confirmation}
                onChange={set('password_confirmation')}
              />
            </div>
            {error && <div className="review-form__error" style={{ marginBottom: 'var(--sp-3)' }}>{error}</div>}
            <label className="check-line" style={{ marginBottom: 'var(--sp-5)' }}>
              <input type="checkbox" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I agree to the Terms and Conditions and the Privacy Policy.</span>
            </label>
            <button className="btn btn--primary btn--block btn--lg btn--upper" type="submit" disabled={busy}>
              {busy ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {features.google_status && (
            <>
              <div className="auth-or">or continue with</div>
              <button className="btn-google" type="button"><Icon.google width="20" height="20" /> Google</button>
            </>
          )}
          <p className="auth-foot">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
