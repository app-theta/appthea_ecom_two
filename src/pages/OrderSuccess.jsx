import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/** Landing page for both COD success and gateway return: /order/success?order=CODE&message=… */
export default function OrderSuccess() {
  const [params] = useSearchParams();
  const { clear, items } = useCart();
  const { isAuthed } = useAuth();
  const code = params.get('order') || '';
  const message = params.get('message') || '';

  /* A gateway return means the order went through - the local cart is stale. */
  useEffect(() => { if (items.length) clear(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container" style={{ padding: 'var(--sp-10) 0' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div className="order-success__icon">
          <Icon.check width="28" height="28" />
        </div>
        <h1 style={{ fontSize: 'var(--fs-8xl)', marginBottom: 'var(--sp-3)' }}>Order placed!</h1>
        <p style={{ color: 'var(--ink-soft)' }}>{message || 'Thank you - we have received your order and will contact you shortly.'}</p>

        {code && (
          <div className="card" style={{ margin: 'var(--sp-5) 0', padding: 'var(--sp-4) var(--sp-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="label" style={{ margin: 0 }}>Order number</span>
            <strong>{code}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--sp-5)' }}>
          {isAuthed ? (
            <Link to="/account/orders" className="btn btn--primary">View my orders</Link>
          ) : (
            <Link to="/login" className="btn btn--primary">Track my order</Link>
          )}
          <Link to="/shop" className="btn btn--outline">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
