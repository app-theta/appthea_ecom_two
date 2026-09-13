import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icons';
import Img from '../components/Img';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { checkout as checkoutApi } from '../api/endpoints';
import { imageUrl, num } from '../utils/product';

/** Landing page for both COD success and gateway return: /order/success?order=CODE&message=… */
export default function OrderSuccess() {
  const [params, setParams] = useSearchParams();
  const { clear, items, setToast } = useCart();
  const { isAuthed } = useAuth();
  const code = params.get('order') || '';
  // Captured once on mount - the URL's `message` param is stripped right
  // after (see below) so the address bar stays a clean `?order=...`.
  const [message] = useState(() => params.get('message') || '');

  /* Full order info (items, totals, shipping address) isn't available here
     via router state - COD and gateway returns both land on this page with
     only `order` + `message` in the URL, so it's fetched from the API. */
  const { data: orderData, loading: orderLoading } = useAsync(
    () => checkoutApi.trackOrder(code),
    [code],
    { skip: !code },
  );
  const order = orderData?.order || null;
  const orderItems = Array.isArray(order?.products) ? order.products : [];
  const address = order?.shipping_address || {};

  /* A gateway return means the order went through - the local cart is stale. */
  useEffect(() => { if (items.length) clear(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Drop the noisy `message` query param from the visible URL. */
  useEffect(() => {
    if (params.get('message')) setParams(code ? { order: code } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setToast('Order number copied');
    } catch {
      setToast('Could not copy - please copy it manually');
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--sp-10) 0' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div className="order-success__icon">
          <Icon.check width="28" height="28" />
        </div>
        <h1 style={{ fontSize: 'var(--fs-8xl)', marginBottom: 'var(--sp-3)' }}>Order placed!</h1>
        <p style={{ color: 'var(--ink-soft)' }}>{message || 'Thank you - we have received your order and will contact you shortly.'}</p>
      </div>

      {code && (
        <button
          type="button"
          className="card"
          onClick={copyCode}
          title="Click to copy"
          style={{
            margin: 'var(--sp-5) auto 0', maxWidth: 640, width: '100%', padding: 'var(--sp-4) var(--sp-5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-4)',
            cursor: 'pointer', font: 'inherit', textAlign: 'left',
          }}
        >
          <span className="label" style={{ margin: 0, flex: 'none' }}>Order number</span>
          <strong style={{ wordBreak: 'break-all', textAlign: 'right' }}>{code}</strong>
        </button>
      )}

      {orderLoading ? (
        <p style={{ textAlign: 'center', marginTop: 'var(--sp-8)' }}>Loading order details…</p>
      ) : order && (
        <div className="grid-2" style={{ maxWidth: 900, margin: 'var(--sp-9) auto 0' }}>
          <div className="panel">
            <div className="panel__head"><h2>Order Items</h2></div>
            <div className="panel__body">
              {orderItems.map((it) => (
                <div className="order-item" key={it.id}>
                  <Img
                    src={imageUrl(it.product?.thumbnail)}
                    alt={it.product?.name || ''}
                    fill={false}
                    style={{ width: 62, height: 78, objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }}
                  />
                  <div>
                    <strong>{it.product?.name}</strong>
                    <small>Qty {it.quantity}</small>
                  </div>
                  <div className="num">BDT {num(it.subtotal_price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel__head"><h2>Summary</h2></div>
            <div className="panel__body">
              <div className="summary-row"><span>Subtotal</span><strong>BDT {num(order.sub_total).toFixed(2)}</strong></div>
              <div className="summary-row"><span>Shipping</span><strong>BDT {num(order.shipping_charge).toFixed(2)}</strong></div>
              {num(order.discount_amount) > 0 && (
                <div className="summary-row"><span>Discount</span><strong>− BDT {num(order.discount_amount).toFixed(2)}</strong></div>
              )}
              <div className="summary-row" style={{ fontSize: 'var(--fs-lg)' }}>
                <strong>Total</strong><strong>BDT {num(order.total_amount).toFixed(2)}</strong>
              </div>
            </div>
            <div className="panel__head" style={{ borderTop: '1px solid var(--line)' }}><h2>Delivery</h2></div>
            <div className="panel__body">
              <p style={{ margin: '0 0 var(--sp-2)', fontSize: 'var(--fs-sm)' }}>
                <strong>{address.name}</strong><br />
                {address.phone}<br />
                {[address.address, address.city, address.zip_code, address.country].filter(Boolean).join(', ')}
              </p>
              {order.payment_type && (
                <p className="form-note" style={{ marginTop: 'var(--sp-3)' }}>
                  <Icon.check width="14" height="14" /> {order.payment_type}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--sp-8)' }}>
        {isAuthed ? (
          <Link to="/account/orders" className="btn btn--primary">View my orders</Link>
        ) : (
          <Link to="/login" className="btn btn--primary">Track my order</Link>
        )}
        <Link to="/shop" className="btn btn--outline">Continue shopping</Link>
      </div>
    </div>
  );
}
