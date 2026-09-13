import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icons';

/** Landing page for a cancelled/failed online payment gateway return - see
    redirectToFrontendAfterPayment() in the backend, which sends the browser
    here whenever bKash/Nagad/SSL/AamarPay/Stripe/PayPal comes back with
    anything other than success: /order/cancel?order=CODE&message=… */
export default function OrderCancel() {
  const [params] = useSearchParams();
  const code = params.get('order') || '';
  const message = params.get('message') || '';

  return (
    <div className="container" style={{ padding: 'var(--sp-10) 0' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div className="order-cancel__icon">
          <Icon.close width="28" height="28" />
        </div>
        <h1 style={{ fontSize: 'var(--fs-8xl)', marginBottom: 'var(--sp-3)' }}>Payment not completed</h1>
        <p style={{ color: 'var(--ink-soft)' }}>{message || 'Your payment was cancelled or could not be completed. Your cart is still saved.'}</p>

        {code && (
          <div className="card" style={{ margin: 'var(--sp-5) 0', padding: 'var(--sp-4) var(--sp-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="label" style={{ margin: 0 }}>Order number</span>
            <strong>{code}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--sp-5)' }}>
          <Link to="/checkout" className="btn btn--primary">Try again</Link>
          <Link to="/cart" className="btn btn--outline">View cart</Link>
        </div>
      </div>
    </div>
  );
}
