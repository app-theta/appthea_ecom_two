import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { parseApiError } from '../api/errors';

export default function Login() {
  const { login } = useAuth();
  const { features } = useBusiness();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember_me: false });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({}); setError('');
    try {
      await login(form);
      navigate(location.state?.from || '/account', { replace: true });
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
          <h2>Login</h2>
          <p>Welcome back. Sign in to track your orders.</p>

          <form onSubmit={submit}>
            <div className="field">
              <input
                className="input"
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="review-form__error">{errors.email}</div>}
            </div>
            <div className="field pass-wrap">
              <input
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="pass-toggle" onClick={() => setShow(!show)} aria-label="Show password">
                <Icon.eye width="19" height="19" />
              </button>
              {errors.password && <div className="review-form__error">{errors.password}</div>}
            </div>
            {error && <div className="review-form__error" style={{ marginBottom: 'var(--sp-3)' }}>{error}</div>}
            <div className="auth-row">
              <label className="check-line">
                <input type="checkbox" checked={form.remember_me} onChange={(e) => setForm({ ...form, remember_me: e.target.checked })} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button className="btn btn--primary btn--block btn--lg btn--upper" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Login'}
            </button>
          </form>

          {(features.google_status || features.facebook_status) && (
            <>
              <div className="auth-or">or continue with</div>
              {features.google_status && (
                <button className="btn-google" type="button"><Icon.google width="20" height="20" /> Google</button>
              )}
            </>
          )}
          <p className="auth-foot">Don&apos;t have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
