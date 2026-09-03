import { Icon } from './Icons';
import { useCart } from '../context/CartContext';

export default function FloatingButtons() {
  const { count, setDrawerOpen } = useCart();
  return (
    <div className="floating">
      <a className="fab fab--messenger" href="#" aria-label="Messenger"><Icon.messenger /></a>
      <button className="fab fab--cart" onClick={() => setDrawerOpen(true)} aria-label="Open cart">
        <Icon.cart />
        {count > 0 && <span className="cart-count">{count}</span>}
      </button>
    </div>
  );
}
