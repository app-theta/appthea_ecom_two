import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../components/Icons';
import Img from '../../components/Img';
import AccountHead from '../../components/account/AccountHead';
import { account } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import { statusTone, dateShort } from '../../utils/format';
import { imageUrl, num } from '../../utils/product';
import { useCart } from '../../context/CartContext';
import { useChat } from '../../context/ChatContext';
import { parseApiError } from '../../api/errors';
import OrderReturns from '../../components/account/OrderReturns';

export default function OrderDetail() {
  const { id } = useParams();
  const { setToast } = useCart();
  const chat = useChat();
  const { data, loading, error, reload } = useAsync((signal) => account.orderDetails(id, { signal }), [id]);

  // reloads (after cancel / a return) keep the page on screen
  if (loading && !data) return <div className="panel"><div className="empty-state">Loading…</div></div>;
  if (error || !data?.order) {
    return (
      <div className="panel">
        <div className="empty-state">
          {error?.message || 'Order not found.'} <Link to="/account/orders">Back to orders</Link>
        </div>
      </div>
    );
  }

  const o = data.order;
  const items = Array.isArray(o.products) ? o.products : [];
  const activities = Array.isArray(o.status_activities) ? o.status_activities : [];
  const address = o.shipping_address || {};

  const download = async () => {
    try {
      const res = await account.orderDownload(o.id);
      if (res?.download_url) window.open(res.download_url, '_blank');
    } catch { /* no-op */ }
  };

  const cancel = async () => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    try {
      await account.cancelOrder(o.id);
      setToast('Your order was cancelled');
      reload();
    } catch (e) {
      setToast(parseApiError(e).message);
    }
  };

  return (
    <>
      <AccountHead title={o.invoice_no || o.unique_code || ('Order #' + o.id)} description={'Placed on ' + dateShort(o.date)} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
        <Link to="/account/orders" className="link-reset" style={{ margin: 0 }}>← Back to orders</Link>
        <span className={'pill pill--' + statusTone(o.sale_status)} style={{ marginLeft: 'auto' }}>{o.sale_status}</span>
        {o.sale_paid_status && (
          <span className={'pill pill--' + (o.sale_paid_status === 'Paid' ? 'success' : 'pending')}>{o.sale_paid_status}</span>
        )}
        <button className="btn btn--sm btn--ghost" onClick={download}>Download invoice</button>
        {chat.enabled && (
          <button className="btn btn--sm btn--ghost" onClick={() => chat.openChat({ order: { id: o.id, invoice_no: o.invoice_no || o.unique_code || ('#' + o.id) } })}>
            <Icon.chat width="16" height="16" /> Help with this order
          </button>
        )}
        {o.can_cancel && <button className="btn btn--sm btn--danger" onClick={cancel}>Cancel order</button>}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel__head"><h2>Items</h2></div>
          <div className="panel__body">
            {items.map((it) => (
              <div className="order-item" key={it.id}>
                <Img
                  src={imageUrl(it.product?.thumbnail)}
                  alt={it.product?.name || ''}
                  fill={false}
                  style={{ width: 62, height: 78, objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }}
                />
                <div>
                  <strong>{it.product?.name}</strong>
                  <small>
                    {it.barcode?.combination ? it.barcode.combination + ' · ' : ''}BDT {num(it.selling_price).toFixed(2)} × {num(it.quantity)}
                  </small>
                </div>
                <div className="num">BDT {num(it.subtotal_price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {activities.length > 0 && (
            <>
              <div className="panel__head" style={{ borderTop: '1px solid var(--line)' }}><h2>Order Timeline</h2></div>
              <div className="panel__body">
                {activities.map((a, i) => (
                  <div key={i} className="summary-row" style={{ alignItems: 'flex-start' }}>
                    <span>
                      <strong style={{ display: 'block' }}>{a.status}</strong>
                      {a.note && <small style={{ color: 'var(--ink-soft)' }}>{a.note}</small>}
                    </span>
                    <span className="form-note">{dateShort(a.date_time)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="panel">
          <div className="panel__head"><h2>Summary</h2></div>
          <div className="panel__body">
            <div className="summary-row"><span>Subtotal</span><strong>BDT {num(o.sub_total).toFixed(2)}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>BDT {num(o.shipping_charge).toFixed(2)}</strong></div>
            {num(o.discount_amount) > 0 && (
              <div className="summary-row"><span>Discount</span><strong>− BDT {num(o.discount_amount).toFixed(2)}</strong></div>
            )}
            {num(o.discount_coupon_amount) > 0 && (
              <div className="summary-row"><span>Coupon</span><strong>− BDT {num(o.discount_coupon_amount).toFixed(2)}</strong></div>
            )}
            <div className="summary-row" style={{ fontSize: 'var(--fs-lg)' }}>
              <strong>Total</strong><strong>BDT {num(o.total_amount).toFixed(2)}</strong>
            </div>
            {num(o.returned_amount) > 0 && (
              <div className="summary-row"><span>Returned</span><strong>− BDT {num(o.returned_amount).toFixed(2)}</strong></div>
            )}
            <div className="summary-row"><span>Paid</span><strong>BDT {num(o.paid_amount).toFixed(2)}</strong></div>
            {num(o.due_amount) > 0 && (
              <div className="summary-row"><span>Due</span><strong className="text-red">BDT {num(o.due_amount).toFixed(2)}</strong></div>
            )}
          </div>
          <div className="panel__head" style={{ borderTop: '1px solid var(--line)' }}><h2>Delivery</h2></div>
          <div className="panel__body">
            <p style={{ margin: '0 0 var(--sp-2)', fontSize: 'var(--fs-sm)' }}>
              <strong>{address.name}</strong><br />
              {address.phone}<br />
              {[address.address, address.city, address.zip_code, address.country].filter(Boolean).join(', ')}
            </p>
            {o.payment_type && (
              <p className="form-note" style={{ marginTop: 'var(--sp-3)' }}>
                <Icon.check width="14" height="14" /> {o.payment_type}
              </p>
            )}
          </div>
        </div>
      </div>

      {(o.can_request_return || num(o.returned_amount) > 0) && (
        <div style={{ marginTop: 'var(--sp-5)' }}>
          <OrderReturns orderId={o.id} onChanged={reload} />
        </div>
      )}
    </>
  );
}
