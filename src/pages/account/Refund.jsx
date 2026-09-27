import { Link } from 'react-router-dom';
import AccountHead from '../../components/account/AccountHead';
import { ReturnCard } from '../../components/account/OrderReturns';
import { account, returns as returnsApi } from '../../api/endpoints';
import { useAsync } from '../../hooks/useAsync';
import { paginated } from '../../utils/product';
import { dateShort } from '../../utils/format';

/**
 * Returns & refunds: every return request the customer made, and the delivered orders they can
 * still ask a return for (the request itself is made on the order's page, item by item).
 */
export default function Refund() {
  const mine = useAsync((signal) => returnsApi.mine({ per_page: 50 }, { signal }), []);
  const delivered = useAsync((signal) => account.orders({ status: 'Delivery', per_page: 20 }, { signal }), []);
  const requests = paginated(mine.data).rows;
  const orders = paginated(delivered.data).rows;
  // an order with a request still open can't take another one yet
  const inProgress = new Set(requests.filter((r) => ['Requested', 'Approved'].includes(r.status)).map((r) => r.order?.id));

  return (
    <>
      <AccountHead title="Returns & Refunds" description="Send back something from a delivered order, and follow your requests." />

      <div className="panel">
        <div className="panel__head"><h2>Ask for a return</h2></div>
        <div className="panel__body">
          {delivered.loading ? (
            <div className="empty-state">Loading…</div>
          ) : orders.length === 0 ? (
            <p className="form-note">Only delivered orders can be returned. You have none yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="summary-row" style={{ alignItems: 'center' }}>
                <span><strong>{o.invoice_no}</strong> <small className="form-note">· delivered order from {dateShort(o.date)}</small></span>
                {inProgress.has(o.id)
                  ? <span className="pill pill--pending">Return in progress</span>
                  : <Link className="btn btn--sm btn--outline" to={'/account/orders/' + o.id + '#returns'}>Return items</Link>}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 'var(--sp-5)' }}>
        <div className="panel__head"><h2>Your requests</h2></div>
        <div className="panel__body">
          {mine.loading ? (
            <div className="empty-state">Loading…</div>
          ) : mine.error ? (
            <div className="empty-state">{mine.error.message}</div>
          ) : requests.length === 0 ? (
            <div className="empty-state">You have not asked for a return yet.</div>
          ) : (
            requests.map((r) => <ReturnCard key={r.id} item={r} showOrder />)
          )}
        </div>
      </div>
    </>
  );
}
