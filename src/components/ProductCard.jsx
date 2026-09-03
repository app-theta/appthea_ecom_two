import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { useWishlist } from '../context/WishlistContext';
import { money } from '../data/products';
import { headlinePrice, productImages, productInStock } from '../utils/product';
import { Icon } from './Icons';
import Img from './Img';

export default function ProductCard({ product }) {
  const { setQuickView } = useCart();
  const { isAuthed } = useAuth();
  const { features } = useBusiness();
  const wishlist = useWishlist();
  const navigate = useNavigate();

  const images = productImages(product);
  const price = headlinePrice(product);
  const discount = price.was > price.now ? Math.round(((price.was - price.now) / price.was) * 100) : 0;
  const soldOut = !productInStock(product);
  const wished = wishlist.has(product.id);

  const onWish = async (e) => {
    e.preventDefault();
    if (!isAuthed) { navigate('/login'); return; }
    try { await wishlist.toggle(product.id); } catch { /* toast not needed here */ }
  };

  return (
    <article className="product-card">
      <Link className="product-card__media" to={'/product/' + product.slug}>
        <Img className="img-main" src={images[0]} alt={product.name} />
        <Img className="img-alt" src={images[1] || images[0]} alt={product.name + ' alternate view'} />
        {discount > 0 && <span className="badge-discount">-{discount}%</span>}
        {soldOut && <span className="badge-soldout">Sold Out</span>}
        {features.user_wishlist && (
          <button
            type="button"
            aria-label="Toggle wishlist"
            aria-pressed={wished}
            onClick={onWish}
            style={{
              position: 'absolute', top: 'var(--sp-3)', right: 'var(--sp-3)', zIndex: 3,
              width: 32, height: 32, borderRadius: 'var(--radius-pill)', border: 0,
              background: 'rgba(255,255,255,0.9)', color: wished ? 'var(--red)' : 'var(--ink-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon.heart width="16" height="16" fill={wished ? 'currentColor' : 'none'} />
          </button>
        )}
      </Link>
      <div className="product-card__info">
        <Link className="product-card__name" to={'/product/' + product.slug}>{product.name}</Link>
        <span className="product-card__price">
          BDT {money(price.now)}
          {price.was > 0 && <s>BDT {money(price.was)}</s>}
        </span>
      </div>
      <button
        className="btn-addcart"
        disabled={soldOut}
        onClick={() => setQuickView(product)}
      >
        {soldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
    </article>
  );
}
