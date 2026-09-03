import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icons';
import Img from '../../components/Img';
import AccountHead from '../../components/account/AccountHead';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { money } from '../../data/products';
import { headlinePrice, productImages, productInStock } from '../../utils/product';

export default function Wishlist() {
  const { setQuickView, setToast } = useCart();
  const { rows, loading, toggle } = useWishlist();
  const items = rows.map((r) => r.product).filter(Boolean);

  const remove = async (product) => {
    try {
      await toggle(product.id);
      setToast(product.name + ' removed from wishlist');
    } catch { setToast('Something went wrong'); }
  };

  return (
    <>
      <AccountHead title="Wishlist" description={items.length + ' items saved. We will let you know if the price drops.'} />

      <div className="panel">
        <div className="panel__head">
          <h2>Saved Items</h2>
          <Link to="/shop">Continue shopping</Link>
        </div>
        <div className="panel__body">
          {loading ? (
            <div className="empty-state">Loading…</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Icon.heart />
              Your wishlist is empty. <Link to="/shop">Find something you like</Link>
            </div>
          ) : (
            <div className="wish-grid">
              {items.map((p) => {
                const soldOut = !productInStock(p);
                const price = headlinePrice(p);
                return (
                  <article className="wish-card" key={p.id}>
                    <Link className="wish-card__media" to={'/product/' + p.slug}>
                      <Img src={productImages(p)[0]} alt={p.name} />
                      {soldOut && <span className="badge-soldout">Sold Out</span>}
                    </Link>
                    <button className="wish-remove" onClick={() => remove(p)} aria-label={'Remove ' + p.name}>
                      <Icon.close width="16" height="16" />
                    </button>
                    <div className="wish-card__body">
                      <strong>{p.name}</strong>
                      <span>BDT {money(price.now)}{price.was > 0 && <s>BDT {money(price.was)}</s>}</span>
                      <button
                        className={'btn btn--sm btn--block ' + (soldOut ? 'btn--muted' : 'btn--primary')}
                        disabled={soldOut}
                        onClick={() => setQuickView(p)}
                      >
                        {soldOut ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
