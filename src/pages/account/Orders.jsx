import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountHead from '../../components/account/AccountHead';
import { useAsync } from '../../hooks/useAsync';
import { account } from '../../api/endpoints';
import { paginated } from '../../utils/product';
import { statusTone, dateShort } from '../../utils/format';

const STATUSES = ['All orders', 'Pending', 'Processing', 'Confirmed', 'Delivery', 'Cancelled'];

export default function Orders() {
  const [status, setStatus] = useState('All orders');

  const query = useMemo(() => ({
    per_page: 20,
    status: status === 'All orders' ? undefined : status,
  }), [status]);

  const { data, loading, error, reload } = useAsync(
    (signal) => account.orders(query, { signal }),
    [JSON.stringify(query)],
  );
  const { rows, total } = paginated(data);

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await account.deleteOrder(id);
      reload();
    } catch { /* leave as-is, list stays unchanged */ }
  };

  const downloadInvoice = async (id) => {
    try {
      const data = await account.orderDownload(id);
      if (data?.download_url) window.open(data.download_url, '_blank');
    } catch { /* no-op */ }
  };

  return (
    <>
      <AccountHead title="My Orders" description={total + ' orders placed so far.'} />

      <div className="panel">
        <div className="panel__body" style={{ paddingTop: 'var(--sp-4)', paddingBottom: 'var(--sp-4)' }}>
          <div className="shop-toolbar" style={{ padding: 0 }}>
            <label htmlFor="status">Status</label>
            <select className="select" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="link-reset" onClick={() => setStatus('All orders')}>Reset</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="panel"><div className="empty-state">Loading…</div></div>
      ) : error ? (
        <div className="panel"><div className="empty-state">{error.message}</div></div>
      ) : rows.length === 0 ? (
        <div className="panel"><div className="empty-state">No orders to show.</div></div>
      ) : (
        rows.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-card__head">
              <div><b>{o.invoice_no || o.unique_code}</b><br /><span>Placed on {dateShort(o.date)}</span></div>
              <span className={'pill pill--' + statusTone(o.sale_status)}>{o.sale_status}</span>
            </div>
            <div className="order-card__foot">
              <span className="total">Total: <b>BDT {Number(o.total_amount).toFixed(2)}</b></span>
              <Link className="btn btn--sm btn--ghost" to={'/account/orders/' + o.id}>View Details</Link>
              <button className="btn btn--sm btn--ghost" onClick={() => downloadInvoice(o.id)}>Invoice</button>
              {['Pending', 'Processing'].includes(o.sale_status) && (
                <button className="btn btn--sm btn--danger" onClick={() => cancelOrder(o.id)}>Cancel</button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}
