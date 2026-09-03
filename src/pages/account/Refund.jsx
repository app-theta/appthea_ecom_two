import { useState } from 'react';
import AccountHead from '../../components/account/AccountHead';
import { useCart } from '../../context/CartContext';
import { ORDERS, REFUNDS, REFUND_REASONS, REFUND_METHODS, REFUND_TIMELINE } from '../../data/account';
import { money } from '../../data/products';

export default function Refund() {
  const { setToast } = useCart();
  const [orderId, setOrderId] = useState(ORDERS[0].id);
  const [reason, setReason] = useState(REFUND_REASONS[0].value);
  const [method, setMethod] = useState(REFUND_METHODS[0].value);
  const [details, setDetails] = useState('');

  const order = ORDERS.find((o) => o.id === orderId);
  const [itemIndex, setItemIndex] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    if (!details.trim() && reason === 'other') {
      setToast('Please describe the issue');
      return;
    }
    setToast('Refund request submitted for ' + orderId);
    setDetails('');
  };

  return (
    <>
      <AccountHead title="Refund Request" description="Tell us what went wrong and we will process your refund within 3-5 business days." />

      <div className="panel">
        <div className="panel__head"><h2>New Request</h2></div>
        <div className="panel__body">
          <form onSubmit={submit}>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="order">Select order</label>
                <select
                  className="select" id="order" style={{ width: '100%' }}
                  value={orderId}
                  onChange={(e) => { setOrderId(e.target.value); setItemIndex(0); }}
                >
                  {ORDERS.map((o) => (
                    <option key={o.id} value={o.id}>{o.id} — {o.date} — BDT {money(o.total)}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="item">Select item</label>
                <select
                  className="select" id="item" style={{ width: '100%' }}
                  value={itemIndex}
                  onChange={(e) => setItemIndex(Number(e.target.value))}
                >
                  {order.items.map((i, n) => (
                    <option key={i.product.id + i.size} value={n}>{i.product.name} (Size {i.size})</option>
                  ))}
                </select>
              </div>
            </div>

            <span className="label">Reason for refund</span>
            {REFUND_REASONS.map((r) => (
              <label className={'opt-row' + (reason === r.value ? ' is-active' : '')} key={r.value}>
                <input type="radio" name="reason" checked={reason === r.value} onChange={() => setReason(r.value)} />
                <span><strong>{r.title}</strong><small>{r.note}</small></span>
                <span />
              </label>
            ))}

            <div className="field" style={{ marginTop: 'var(--sp-5)' }}>
              <label htmlFor="details">Details</label>
              <textarea
                className="textarea" id="details" placeholder="Describe the issue in a few lines..."
                value={details} onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Upload photos (optional)</label>
              <div className="upload-box">Drag images here or <a href="#">browse</a><br />JPG or PNG, up to 5 MB each</div>
            </div>

            <span className="label">Refund to</span>
            {REFUND_METHODS.map((m) => (
              <label className={'opt-row' + (method === m.value ? ' is-active' : '')} key={m.value}>
                <input type="radio" name="method" checked={method === m.value} onChange={() => setMethod(m.value)} />
                <span><strong>{m.title}</strong><small>{m.note}</small></span>
                <span className="price">{m.tag}</span>
              </label>
            ))}

            <button className="btn btn--primary btn--lg" style={{ marginTop: 'var(--sp-5)' }} type="submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head"><h2>Request History</h2></div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Request</th><th>Order</th><th>Reason</th><th>Date</th><th>Status</th><th className="num">Amount</th></tr>
            </thead>
            <tbody>
              {REFUNDS.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.order}</td><td>{r.reason}</td><td>{r.date}</td>
                  <td><span className={'pill pill--' + r.tone}>{r.status}</span></td>
                  <td className="num">BDT {money(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head"><h2>{REFUNDS[0].id} Progress</h2></div>
        <div className="panel__body">
          <div className="timeline">
            {REFUND_TIMELINE.map((t) => (
              <div className={'timeline-item' + (t.done ? ' is-done' : '')} key={t.title}>
                <span className="timeline-dot" />
                <div><strong>{t.title}</strong><small>{t.note}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
