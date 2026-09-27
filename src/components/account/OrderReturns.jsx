import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { returns as returnsApi } from '../../api/endpoints';
import { parseApiError } from '../../api/errors';
import { useAsync } from '../../hooks/useAsync';
import { useCart } from '../../context/CartContext';
import { dateShort } from '../../utils/format';

const money = (n) => 'BDT ' + Number(n || 0).toFixed(2);

// return statuses on the pill colours the order statuses already use
export function returnTone(status) {
  if (status === 'Completed') return 'success';
  if (status === 'Rejected') return 'danger';
  if (status === 'Approved') return 'info';
  return 'pending';
}

/** One return request, as a card - used on the order page and the account's returns list. */
export function ReturnCard({ item, showOrder = false }) {
  return (
    <div className="order-card">
      <div className="order-card__head">
        <div>
          <b>{item.return_no}</b>
          {showOrder && item.order?.id && (
            <> · <Link to={'/account/orders/' + item.order.id}>{item.order.invoice_no || 'Order'}</Link></>
          )}
          <br /><span>{dateShort(item.requested_at)}{item.reason ? ' · ' + item.reason : ''}</span>
        </div>
        <span className={'pill pill--' + returnTone(item.status)}>{item.status}</span>
      </div>
      <div className="order-card__body">
        {item.items.map((line) => (
          <div key={line.sale_product_id} className="summary-row">
            <span>{line.product}{line.combination ? ' (' + line.combination + ')' : ''} × {line.quantity}</span>
            <span>{money(line.total)}</span>
          </div>
        ))}
        {item.shop_note && <p className="form-note">Note from the shop: {item.shop_note}</p>}
      </div>
      <div className="order-card__foot">
        <span className="total">Return value: <b>{money(item.total_amount)}</b></span>
        {item.refunded_amount > 0 && <span className="total">Refunded: <b>{money(item.refunded_amount)}</b></span>}
      </div>
    </div>
  );
}

/**
 * Returns for one delivered order: what can still be sent back (and until when), the request
 * form, and the requests so far. The shop approves and refunds from its admin panel.
 */
export default function OrderReturns({ orderId, onChanged }) {
  const { setToast } = useCart();
  const state = useAsync((signal) => returnsApi.forOrder(orderId, { signal }), [orderId]);
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [qty, setQty] = useState({});
  const [reasonId, setReasonId] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // arriving from the returns page (…/orders/5#returns): bring the section into view
  useEffect(() => {
    if (state.data && window.location.hash === '#returns') document.getElementById('returns')?.scrollIntoView({ behavior: 'smooth' });
  }, [state.data]);

  if (state.loading && !state.data) return <div className="panel"><div className="empty-state">Loading returns…</div></div>;
  if (state.error) return null;

  const info = state.data || {};
  const items = (info.returnable_items || []).filter((line) => line.returnable_quantity > 0);
  const history = info.returns || [];
  const value = items.reduce((sum, line) => sum + (qty[line.sale_product_id] || 0) * line.unit_price, 0);

  const start = async () => {
    setOpen(true);
    if (!reasons.length) {
      try { setReasons(await returnsApi.reasons()); } catch (e) { setError(parseApiError(e).message); }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const chosen = items
      .filter((line) => (qty[line.sale_product_id] || 0) > 0)
      .map((line) => ({ sale_product_id: line.sale_product_id, quantity: qty[line.sale_product_id] }));
    if (!chosen.length) {
      setError('Choose at least one item to return.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await returnsApi.request(orderId, { items: chosen, sale_return_reason_id: Number(reasonId), note });
      setToast('Return request ' + (res?.return_no || '') + ' sent');
      setOpen(false);
      setQty({});
      setReasonId('');
      setNote('');
      state.reload();
      onChanged?.();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel" id="returns">
      <div className="panel__head"><h2>Returns</h2></div>
      <div className="panel__body">
        {info.can_return ? (
          !open && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <button className="btn btn--sm btn--outline" type="button" onClick={start}>Request a return</button>
              {info.return_deadline && <span className="form-note">Returns accepted until {dateShort(info.return_deadline)}</span>}
            </div>
          )
        ) : (
          info.not_returnable_reason && <p className="form-note">{info.not_returnable_reason}</p>
        )}

        {open && (
          <form onSubmit={submit}>
            <span className="label">Choose what you are sending back</span>
            {items.map((line) => (
              <div key={line.sale_product_id} className="summary-row" style={{ alignItems: 'center' }}>
                <span>
                  <strong style={{ display: 'block' }}>{line.product}</strong>
                  <small className="form-note">
                    {line.combination ? line.combination + ' · ' : ''}{money(line.unit_price)} · up to {line.returnable_quantity} of {line.quantity}
                  </small>
                </span>
                <select
                  className="select"
                  aria-label={'Quantity to return of ' + line.product}
                  value={qty[line.sale_product_id] || 0}
                  onChange={(e) => setQty({ ...qty, [line.sale_product_id]: Number(e.target.value) })}
                >
                  {Array.from({ length: Math.floor(line.returnable_quantity) + 1 }, (_, n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}

            <div className="field">
              <label className="label" htmlFor="return-reason">Reason</label>
              <select className="select" id="return-reason" style={{ width: '100%' }} required value={reasonId} onChange={(e) => setReasonId(e.target.value)}>
                <option value="">Choose a reason</option>
                {reasons.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="return-note">Anything the shop should know? (optional)</label>
              <textarea className="textarea" id="return-note" rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            {error && <div className="review-form__error" style={{ marginBottom: 'var(--sp-3)' }}>{error}</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <span>Return value: <b className="return-value">{money(value)}</b></span>
              <span style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                <button className="btn btn--sm btn--ghost" type="button" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn btn--sm btn--primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send return request'}</button>
              </span>
            </div>
          </form>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: 'var(--sp-5)' }}>
            <span className="label">Your return requests</span>
            {history.map((r) => <ReturnCard key={r.id} item={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

