import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons';
import Img from '../components/Img';
import Qty from '../components/Qty';
import PageHead from '../components/PageHead';
import { LineDetail } from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { money2 } from '../data/products';

export default function CartPage() {
  const { items, count, subtotal, setQty, removeItem } = useCart();

  return (
    <div className="container">
      <PageHead
        title="Shopping Cart"
        description={count + ' item(s) in your cart'}
        crumbs={[{ label: 'Cart' }]}
      />

      <div className="cart-layout">
        <div>
          {items.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <Icon.bag />
                Your cart is empty. <Link to="/shop">Continue shopping</Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div className="card" style={{ marginBottom: 'var(--sp-4)' }} key={item.key}>
                <div className="card__body">
                  <div className="cart-line">
                    <Img
                      src={item.image}
                      alt={item.name}
                      fill={false}
                      style={{ width: 100, height: 126, objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }}
                    />
                    <div>
                      <div className="cart-line__name">{item.name}</div>
                      <LineDetail item={item} className="cart-line__meta" />
                      <div className="cart-line__price">
                        BDT {money2(item.price)}
                        {item.type === 'simple' && item.oldPrice > 0 && <s>BDT {money2(item.oldPrice)}</s>}
                      </div>
                      <div className="cart-line__qty">
                        <span>Qty</span>
                        {item.type === 'simple'
                          ? <Qty value={item.qty} onChange={(q) => setQty(item.key, q)} small />
                          : <strong>{item.qty}</strong>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <span>BDT {money2(item.total_price)}</span>
                      <button className="icon-trash" onClick={() => removeItem(item.key)} aria-label={'Remove ' + item.name}>
                        <Icon.trash width="20" height="20" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside>
          <div className="card">
            <div className="card__body">
              <div className="summary-row"><span>Subtotal</span><strong>BDT {money2(subtotal)}</strong></div>
              <p className="summary-note">Shipping calculated at checkout</p>
              <div className="summary-total">
                <strong>Total</strong>
                <b>BDT {money2(subtotal)}</b>
              </div>
              <Link className="btn btn--primary btn--block btn--lg" to="/checkout">Proceed to Checkout</Link>
              <div style={{ height: 'var(--sp-3)' }} />
              <Link className="btn btn--outline btn--block btn--lg" to="/shop">Continue Shopping</Link>
              <p className="summary-fineprint">Free returns and exchanges for 7 days</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
