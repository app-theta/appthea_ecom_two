import { useState } from 'react';
import { Icon } from '../../components/Icons';
import AccountHead from '../../components/account/AccountHead';
import { useCart } from '../../context/CartContext';
import { WALLET } from '../../data/account';
import { money, money2 } from '../../data/products';

export default function Wallet() {
  const { setToast } = useCart();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(WALLET.methods[0]);

  const topUp = (e) => {
    e.preventDefault();
    if (Number(amount) < 100) {
      setToast('Minimum top-up is BDT 100');
      return;
    }
    setToast('Redirecting to ' + method + ' for BDT ' + money(amount));
  };

  return (
    <>
      <AccountHead title="Wallet" description="Store credit, refunds and cashback in one balance." />

      <div className="wallet-card">
        <div>
          <span>Available balance</span>
          <b>BDT {money2(WALLET.balance)}</b>
          <small>{WALLET.expiring}</small>
        </div>
        <div className="wallet-actions">
          <button className="btn btn--lg">Add Money</button>
          <button className="btn btn--lg btn--ghost">Withdraw</button>
        </div>
      </div>

      <div className="stat-grid stat-grid--3">
        {WALLET.stats.map((s) => {
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
        <div className="panel__head"><h2>Transactions</h2><a href="#">Download statement</a></div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Reference</th><th>Type</th><th className="num">Amount</th><th className="num">Balance</th></tr>
            </thead>
            <tbody>
              {WALLET.transactions.map((t) => (
                <tr key={t.date + t.ref}>
                  <td>{t.date}</td>
                  <td>{t.desc}</td>
                  <td>{t.ref}</td>
                  <td><span className={'pill pill--' + (t.amount > 0 ? 'success' : 'danger')}>{t.type}</span></td>
                  <td className={'num ' + (t.amount > 0 ? 'text-green' : 'text-red')}>
                    {t.amount > 0 ? '+' : '−'} BDT {money(Math.abs(t.amount))}
                  </td>
                  <td className="num">BDT {money(t.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head"><h2>Add Money</h2></div>
        <div className="panel__body">
          <form onSubmit={topUp}>
            <div className="grid-2">
              <div className="field">
                <label htmlFor="amount">Amount (BDT)</label>
                <input className="input" id="amount" type="number" min="100" placeholder="500" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="method">Payment method</label>
                <select className="select" id="method" style={{ width: '100%' }} value={method} onChange={(e) => setMethod(e.target.value)}>
                  {WALLET.methods.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <p className="form-note">Minimum top-up BDT 100. Money added to the wallet never expires.</p>
            <button className="btn btn--primary btn--lg" style={{ marginTop: 'var(--sp-4)' }} type="submit">
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
