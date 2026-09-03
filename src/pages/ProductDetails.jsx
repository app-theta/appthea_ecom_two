import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icon } from '../components/Icons';
import Img from '../components/Img';
import Qty from '../components/Qty';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import ComboTiers from '../components/ComboTiers';
import BundleSelector from '../components/BundleSelector';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { useWishlist } from '../context/WishlistContext';
import { useAsync } from '../hooks/useAsync';
import { catalog } from '../api/endpoints';
import { money } from '../data/products';
import {
  barcodesOf, coloursOf, sizesOf, barcodePrice, productImages, paginated, plain,
  num, thumbOf, meaningfulVariantLabel, isSameCombo, isBundle, comboTiers, bundlesOf,
} from '../utils/product';

export default function ProductDetails() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { addItem, addComboItem, addBundleItem, setToast } = useCart();
  const { isAuthed } = useAuth();
  const { features, enabledPayments } = useBusiness();
  const wishlist = useWishlist();

  const { data: product, loading, error } = useAsync((signal) => catalog.product(slug, { signal }), [slug]);

  const [index, setIndex] = useState(0);
  const [colourCode, setColourCode] = useState(null);
  const [sizeLabel, setSizeLabel] = useState(null);
  const [qty, setQty] = useState(1);
  const [tier, setTier] = useState(null);
  const [freePicks, setFreePicks] = useState([]);
  const [bundle, setBundle] = useState(null);
  const [bundleSel, setBundleSel] = useState({});

  const barcodes = useMemo(() => (product ? barcodesOf(product) : []), [product]);
  const colours = useMemo(() => coloursOf(barcodes), [barcodes]);
  const sizesForColour = useMemo(() => {
    const pool = colours.length > 0
      ? barcodes.filter((b) => (b?.combination?.colour?.code || b?.combination?.color?.code) === colourCode)
      : barcodes;
    return sizesOf(pool);
  }, [barcodes, colours.length, colourCode]);

  const selectedBarcode = useMemo(() => {
    if (barcodes.length === 1) return barcodes[0];
    return sizesForColour.find((s) => s.label === sizeLabel)?.barcode || null;
  }, [barcodes, sizesForColour, sizeLabel]);

  useEffect(() => {
    setIndex(0);
    setQty(1);
    setColourCode(colours[0]?.code ?? null);
    setSizeLabel(barcodes.length === 1 ? sizesOf(barcodes)[0]?.label ?? null : null);
    setTier(null); setFreePicks([]); setBundle(null); setBundleSel({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (loading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="container">
        <div className="empty-state">Product not found. <Link to="/shop">Back to shop</Link></div>
      </div>
    );
  }

  const images = productImages(product);
  const price = selectedBarcode ? barcodePrice(selectedBarcode) : { now: 0, was: 0 };
  const available = selectedBarcode
    ? (selectedBarcode.stock_qty == null || Number(selectedBarcode.stock_qty) > 0)
    : barcodes.length > 0;
  const needsSize = sizesForColour.length > 1 || (sizesForColour.length === 1 && !barcodes.length);
  const step = (n) => setIndex((i) => (i + n + images.length) % images.length);

  const tiers = comboTiers(product);
  const bundles = bundlesOf(product);

  const buildComboEntry = () => {
    if (!selectedBarcode) { setToast('Please select a variant'); return null; }
    const freeNeeded = num(tier.free_qty);
    const picks = freePicks.slice(0, freeNeeded);
    if (freeNeeded > 0 && (picks.length < freeNeeded || picks.some((p) => !p?.product_id || !p?.barcode_id))) {
      setToast(`Please choose ${freeNeeded} free item${freeNeeded > 1 ? 's' : ''}`);
      return null;
    }
    const vLabel = meaningfulVariantLabel(selectedBarcode);
    return {
      product_id: product.id,
      barcode_id: selectedBarcode.id,
      qty: num(tier.combo_qty),
      total_price: num(tier.combo_price),
      name: product.name,
      image: thumbOf(product),
      variant: vLabel ? `${tier.combo_qty} pcs · ${vLabel}` : `${tier.combo_qty} pcs`,
      free_items: picks.map((p) => [p.name, p.variant].filter(Boolean).join(' · ')),
      free_selections: picks.map((p) => ({ product_id: p.product_id, barcode_id: p.barcode_id })),
    };
  };

  const buildBundleEntry = () => {
    const items = Array.isArray(bundle.items) ? bundle.items : [];
    const selections = [];
    const labels = [];
    for (const it of items) {
      const p = it.product || {};
      const own = barcodesOf(p);
      const bid = it.is_current_product
        ? selectedBarcode?.id
        : bundleSel[p.id]?.barcode_id ?? (own.length === 1 ? own[0].id : null);
      if (!bid) { setToast('Please choose a variant for every bundle item'); return null; }
      selections.push({ product_id: p.id, barcode_id: bid });
      labels.push(`${num(it.quantity) > 1 ? `${it.quantity} × ` : ''}${p.name}`);
    }
    return {
      bundle_id: bundle.id,
      qty,
      total_price: num(bundle.price) * qty,
      name: `${product.name} — Bundle`,
      image: thumbOf(product),
      items: labels,
      selections,
    };
  };

  const add = (buyNow) => {
    if (bundle) {
      const entry = buildBundleEntry();
      if (!entry) return;
      addBundleItem(entry);
    } else if (tier) {
      const entry = buildComboEntry();
      if (!entry) return;
      addComboItem(entry);
    } else {
      if (barcodes.length > 1 && !selectedBarcode) {
        setToast('Please select a variant');
        return;
      }
      addItem(product, selectedBarcode, qty);
    }
    if (buyNow) navigate('/checkout');
    else setToast(product.name + ' added to cart');
  };

  const onWish = async () => {
    if (!isAuthed) { navigate('/login'); return; }
    try {
      const action = await wishlist.toggle(product.id);
      setToast(action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { setToast('Something went wrong'); }
  };

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        {product.category?.name && (
          <>
            <Link to={'/shop/' + (product.category.slug || '')}>{product.category.name}</Link><span>/</span>
          </>
        )}
        <span className="current">{product.name}</span>
      </div>

      <div className="pd-layout">
        <div>
          <div className="pd-gallery__main">
            <Img
              src={images[index]}
              alt={product.name}
              fill={false}
              style={{ width: '100%', aspectRatio: 'var(--card-ratio)', objectFit: 'cover', display: 'block' }}
            />
            {images.length > 1 && (
              <>
                <button className="qv-arrow qv-arrow--prev" onClick={() => step(-1)} aria-label="Previous image">
                  <Icon.chevronLeft />
                </button>
                <button className="qv-arrow qv-arrow--next" onClick={() => step(1)} aria-label="Next image">
                  <Icon.chevronRight />
                </button>
                <span className="pd-counter">{index + 1} / {images.length}</span>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              <div className="pd-thumbs__track">
                {images.map((src, i) => (
                  <Img
                    key={src + i}
                    src={src}
                    alt={'View ' + (i + 1)}
                    fill={false}
                    className={i === index ? 'is-active' : undefined}
                    style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid transparent', cursor: 'pointer' }}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--sp-3)' }}>
            <h1 className="pd-title">{product.name}</h1>
            {features.user_wishlist && (
              <button
                type="button"
                className="icon-btn"
                aria-label="Toggle wishlist"
                aria-pressed={wishlist.has(product.id)}
                onClick={onWish}
                style={{ color: wishlist.has(product.id) ? 'var(--red)' : 'var(--ink-soft)' }}
              >
                <Icon.heart fill={wishlist.has(product.id) ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          <div className="pd-price">
            BDT {money(price.now)}
            {price.was > 0 && <s>BDT {money(price.was)}</s>}
          </div>

          {colours.length > 0 && (
            <>
              <span className="label">Available colours</span>
              <div className="color-list">
                {colours.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={'color-opt' + (c.code === colourCode ? ' is-active' : '')}
                    onClick={() => { setColourCode(c.code); setSizeLabel(null); }}
                  >
                    <i style={{ background: c.code }}><Icon.check /></i>
                    <span>{c.name || c.code}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {sizesForColour.length > 0 && (
            <>
              <span className="label">Available sizes</span>
              <div className="size-list size-list--round">
                {sizesForColour.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className={'size-btn' + (s.label === sizeLabel ? ' is-active' : '')}
                    disabled={s.barcode.stock_qty != null && Number(s.barcode.stock_qty) <= 0}
                    onClick={() => setSizeLabel(s.label)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {isSameCombo(product) && (
            <ComboTiers
              tiers={tiers}
              selectedQty={tier ? num(tier.combo_qty) : null}
              onSelect={(next) => { setTier(next); setFreePicks([]); if (next) setQty(1); }}
              freePicks={freePicks}
              onFreePick={(slot, pick) => setFreePicks((list) => {
                const next = [...list];
                next[slot] = pick;
                return next;
              })}
            />
          )}

          {isBundle(product) && (
            <BundleSelector
              bundles={bundles}
              selectedId={bundle?.id ?? null}
              onSelect={(b) => { setBundle(b); setBundleSel({}); setQty(1); }}
              selections={bundleSel}
              currentBarcodeId={selectedBarcode?.id ?? null}
              onSelectItem={(pid, val) => setBundleSel((s) => ({ ...s, [pid]: val }))}
            />
          )}

          {!tier && (
            <>
              <span className="label">Quantity</span>
              <Qty value={qty} onChange={setQty} />
            </>
          )}

          <div className="pd-actions">
            <button
              className={'btn btn--lg ' + ((!available && !bundle && !tier) ? 'btn--muted' : 'btn--dark')}
              disabled={(!available && !bundle && !tier) || (needsSize && !selectedBarcode)}
              onClick={() => add(false)}
            >
              <Icon.cart width="18" height="18" /> Add to Cart
            </button>
            <button
              className={'btn btn--lg ' + ((!available && !bundle && !tier) ? 'btn--muted' : 'btn--primary')}
              disabled={(!available && !bundle && !tier) || (needsSize && !selectedBarcode)}
              onClick={() => add(true)}
            >
              Buy Now
            </button>
          </div>

          {features.is_coupon && (
            <>
              <span className="label">Available offers</span>
              <div className="offer-row">
                <div className="offer-card">
                  <div className="offer-card__top">
                    <span>Coupon codes are available — apply yours at checkout.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="info-box">
            <h4><Icon.info width="18" height="18" /> Delivery information</h4>
            <ul>
              <li><Icon.check /> Estimated delivery: 2-4 business days</li>
              <li><Icon.check /> Easy exchange within 7 days</li>
              {enabledPayments.includes('Cash On Delivery') && <li><Icon.check /> Cash on delivery available</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className="is-active">Product Details</button>
      </div>
      <div className="pd-desc">
        <p>{plain(product.long_description || product.short_description) || 'No description available for this product yet.'}</p>
      </div>

      <ReviewSection productId={product.id} />

      <RelatedProducts categoryId={product.category?.id} excludeId={product.id} />
    </div>
  );
}

function RelatedProducts({ categoryId, excludeId }) {
  const { data } = useAsync(
    (signal) => (categoryId ? catalog.products({ category_id: categoryId, per_page: 4 }, { signal }) : Promise.resolve(null)),
    [categoryId],
    { skip: !categoryId },
  );
  const rows = paginated(data).rows.filter((p) => p.id !== excludeId).slice(0, 3);
  if (rows.length === 0) return null;

  return (
    <section className="section">
      <div className="section-head">
        <h2>You may also like</h2>
      </div>
      <div className="product-grid product-grid--3">
        {rows.map((p) => <ProductCard product={p} key={p.id} />)}
      </div>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="container">
      <div className="pd-layout">
        <div className="pd-gallery__main" style={{ aspectRatio: 'var(--card-ratio)' }} />
        <div>
          <div style={{ height: 34, width: '70%', background: 'var(--cat-bg)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--sp-4)' }} />
          <div style={{ height: 22, width: '30%', background: 'var(--cat-bg)', borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>
    </div>
  );
}
