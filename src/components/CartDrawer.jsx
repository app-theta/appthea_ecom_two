import { Link } from 'react-router-dom';
import { Icon } from './Icons';
import Img from './Img';
import Qty from './Qty';
import Overlay from './Overlay';
import { useCart } from '../context/CartContext';
import { money } from '../data/products';

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, items, count, subtotal, setQty, removeItem } = useCart();
  if (!drawerOpen) return null;

  return (
    <>
      <Overlay />
      <aside className="drawer" aria-label="Shopping cart">
        <div className="drawer__head">
          <div>
            <h3>Shopping Cart</h3>
            <p>{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close cart">
            <Icon.close width="20" height="20" />
          </button>
        </div>

        <div className="drawer__body">
          {items.length === 0 ? (
            <div className="empty-state">
              <Icon.bag />
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div className="drawer-item" key={item.key}>
                <Img
                  src={item.image}
                  alt={item.name}
                  fill={false}
                  style={{ width: 70, height: 88, objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }}
                />
                <div>
                  <div className="drawer-item__name">{item.name}</div>
                  <LineDetail item={item} />
                  <div className="drawer-item__price">
                    BDT {money(item.total_price)}
                    {item.type === 'simple' && item.oldPrice > 0 && <s>BDT {money(item.oldPrice * item.qty)}</s>}
                  </div>
                  {item.type === 'simple'
                    ? <Qty value={item.qty} onChange={(q) => setQty(item.key, q)} small />
                    : <span className="drawer-item__meta">Qty {item.qty}</span>}
                </div>
                <button className="link-remove" onClick={() => removeItem(item.key)} aria-label={'Remove ' + item.name}>
                  <Icon.close width="16" height="16" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="drawer__foot">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>BDT {money(subtotal)}</span>
          </div>
          <p className="subtotal-note">Shipping calculated at checkout</p>
          <Link className="btn btn--primary btn--block btn--lg btn--upper" to="/checkout">Checkout</Link>
          <Link className="btn btn--outline btn--block btn--lg btn--upper" to="/cart">View Cart</Link>
        </div>
      </aside>
    </>
  );
}

/** The sub-detail line under a cart item's name - the variant for a simple
    line, or the free items / bundled items list for a combo/bundle line. */
export function LineDetail({ item, className = 'drawer-item__meta' }) {
  if (item.type === 'bundle') {
    return (
      <div className={className}>
        Bundle
        {(item.bundleItems || []).map((i, n) => <div key={n}>{i}</div>)}
      </div>
    );
  }
  if (item.type === 'combo_product') {
    return (
      <div className={className}>
        {item.size || 'Combo'}
        {(item.freeItems || []).map((i, n) => <div key={n}>Free: {i}</div>)}
      </div>
    );
  }
  return item.size ? <div className={className}>Variant: {item.size}</div> : null;
}
