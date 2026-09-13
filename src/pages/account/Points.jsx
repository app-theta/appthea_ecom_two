import AccountHead from '../../components/account/AccountHead';
import { useAsync } from '../../hooks/useAsync';
import { account } from '../../api/endpoints';
import { num } from '../../utils/product';

export default function Points() {
  const { data } = useAsync((signal) => account.dashboard({ signal }), []);
  const points = num(data?.customer?.point_balance);

  return (
    <>
      <AccountHead title="Earning Points" description="Points you have earned from purchases and reviews." />

      <div className="wallet-card">
        <div>
          <span>Club points balance</span>
          <b>{points} pts</b>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head"><h2>How to earn points</h2></div>
        <div className="panel__body">
          <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
            <li>Earn points on every completed purchase</li>
            <li>Earn points for writing a product review</li>
          </ul>
        </div>
      </div>
    </>
  );
}
