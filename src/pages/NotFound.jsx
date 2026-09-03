import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container">
      <div className="auth-wrap">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--fs-9xl)' }}>404</h1>
          <p style={{ color: 'var(--ink-soft)', margin: 'var(--sp-3) 0 var(--sp-6)' }}>
            We could not find that page.
          </p>
          <Link className="btn btn--primary btn--lg" to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
