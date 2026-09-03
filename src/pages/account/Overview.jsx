import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icons';
import AccountHead from '../../components/account/AccountHead';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { account } from '../../api/endpoints';
import { paginated, num } from '../../utils/product';
import { statusTone, dateShort } from '../../utils/format';

export default function Overview() {
  const { customer } = useAuth();
  const { data } = useAsync((signal) => account.dashboard({ signal }), []);
  const recent = useAsync((signal) => account.orders({ per_page: 5 }, { signal }), []);
  const rows = paginated(recent.data).rows;

  const name = [customer?.first_name, customer?.last_name].filter(Boolean).join(' ') || customer?.username || 'there';

  const stats = [
    { icon: 'box', label: 'Total Orders', value: data?.total_orders ?? '—', note: 'BDT ' + num(data?.total_spent).toFixed(0) + ' spent' },
    { icon: 'wallet', label: 'Wallet', value: '—', note: 'Coming soon' },
    { icon: 'heart', label: 'Wishlist', value: data?.total_wishlist ?? '—', note: 'Items saved' },
    { icon: 'refund', label: 'Reviews', value: data?.total_reviews ?? '—', note: 'Written so far' },
  ];

  return (
    <>
      <AccountHead title="Dashboard" description={'Welcome back, ' + name.split(' ')[0] + '. Here is what is happening with your orders.'} />

      <div className="stat-grid">
        {stats.map((s) => {
          const Ico = Icon[s.icon];
          return (
            <div className="stat" key={s.label}>
              <div className="stat__top">
                <span className="stat__label">{s.label}</span>
                <span className="stat__icon"><Ico /></span>
              </div>
              <b>{s.value}</b>
              <small>{s.note}</small>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2>Recent Orders</h2>
          <Link to="/account/orders">View all</Link>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Order</th><th>Date</th><th>Status</th><th className="num">Total</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={4}>No orders yet.</td></tr>
              ) : rows.map((o) => (
                <tr key={o.id}>
                  <td><Link to={'/account/orders/' + o.id}>{o.invoice_no || o.unique_code}</Link></td>
                  <td>{dateShort(o.date)}</td>
                  <td><span className={'pill pill--' + statusTone(o.sale_status)}>{o.sale_status}</span></td>
                  <td className="num">BDT {num(o.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel__head"><h2>Profile</h2></div>
          <div className="panel__body">
            <div className="summary-row"><span>Full name</span><strong>{name}</strong></div>
            <div className="summary-row"><span>Phone</span><strong>{customer?.phone}</strong></div>
            <div className="summary-row" style={{ marginBottom: 0 }}><span>Email</span><strong>{customer?.email || '—'}</strong></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel__head"><h2>Default Address</h2></div>
          <div className="panel__body">
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
              {customer?.address || 'No address on file yet.'}
              {customer?.city && <><br />{customer.city}</>}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
