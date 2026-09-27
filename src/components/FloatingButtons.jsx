import { Icon } from './Icons';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';

export default function FloatingButtons() {
  const { count, setDrawerOpen } = useCart();
  const { info } = useBusiness();
  // the shop's Facebook page is where shoppers can message it; no page set, no button
  const facebook = typeof info?.facebook_link === 'string' && info.facebook_link.startsWith('http') ? info.facebook_link : null;

  return (
    <div className="floating">
      {facebook && (
        <a className="fab fab--messenger" href={facebook} target="_blank" rel="noreferrer" aria-label="Message us on Facebook"><Icon.messenger /></a>
      )}
      <button className="fab fab--cart" onClick={() => setDrawerOpen(true)} aria-label="Open cart">
        <Icon.cart />
        {count > 0 && <span className="cart-count">{count}</span>}
      </button>
    </div>
  );
}
