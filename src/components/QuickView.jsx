import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './Icons';
import Img from './Img';
import Qty from './Qty';
import Overlay from './Overlay';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { useWishlist } from '../context/WishlistContext';
import { money } from '../data/products';
import { barcodesOf, coloursOf, sizesOf, barcodePrice, productImages, isCombo } from '../utils/product';

export default function QuickView() {
  const { quickView: product, setQuickView, addItem, setToast } = useCart();
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const { features } = useBusiness();
  const wishlist = useWishlist();

  const [index, setIndex] = useState(0);
  const [colourCode, setColourCode] = useState(null);
  const [sizeLabel, setSizeLabel] = useState(null);
  const [qty, setQty] = useState(1);

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
    if (!product) return;
    setIndex(0);
    setQty(1);
    setColourCode(coloursOf(barcodesOf(product))[0]?.code ?? null);
    setSizeLabel(barcodesOf(product).length === 1 ? sizesOf(barcodesOf(product))[0]?.label ?? null : null);
  }, [product]);

  if (!product) return null;

  const images = productImages(product);
  const price = selectedBarcode ? barcodePrice(selectedBarcode) : { now: 0, was: 0 };
  const needsSize = sizesForColour.length > 1;
  const step = (n) => setIndex((i) => (i + n + images.length) % images.length);

  const add = () => {
    if (barcodes.length > 1 && !selectedBarcode) {
      setToast('Please select a variant');
      return;
    }
    addItem(product, selectedBarcode, qty);
    setToast(product.name + ' added to cart');
  };

  const onWish = async () => {
    if (!isAuthed) { setQuickView(null); navigate('/login'); return; }
    try {
      const action = await wishlist.toggle(product.id);
      setToast(action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { setToast('Something went wrong'); }
  };

  return (
    <>
      <Overlay />
      <div className="modal">
        <div className="modal__box">
          <button className="modal__close" onClick={() => setQuickView(null)} aria-label="Close">
            <Icon.close width="18" height="18" />
          </button>

          <div className="qv-gallery">
            <Img src={images[index]} alt={product.name} fill={false} style={{ width: '100%', height: '100%', aspectRatio: 'var(--card-ratio)', objectFit: 'cover', display: 'block' }} />
            {images.length > 1 && (
              <>
                <button className="qv-arrow qv-arrow--prev" onClick={() => step(-1)} aria-label="Previous image">
                  <Icon.chevronLeft />
                </button>
                <button className="qv-arrow qv-arrow--next" onClick={() => step(1)} aria-label="Next image">
                  <Icon.chevronRight />
                </button>
              </>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--sp-3)' }}>
              <h3 className="qv-title">{product.name}</h3>
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
            <div className="qv-price">
              BDT {money(price.now)}
              {price.was > 0 && <s>BDT {money(price.was)}</s>}
            </div>

            {colours.length > 0 && (
              <>
                <span className="label">Select colour</span>
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
                <span className="label">Select size</span>
                <div className="size-list">
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

            {isCombo(product) ? (
              <>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-soft)', marginBottom: 'var(--sp-5)' }}>
                  This product has combo/bundle offers - open the full page to pick one.
                </p>
                <Link className="btn btn--primary btn--block btn--upper" to={'/product/' + product.slug} onClick={() => setQuickView(null)}>
                  View Full Details
                </Link>
              </>
            ) : (
              <>
                <span className="label">Quantity</span>
                <div className="qv-actions">
                  <Qty value={qty} onChange={setQty} />
                  <button className="btn btn--primary btn--upper" disabled={needsSize && !selectedBarcode} onClick={add}>Add to Cart</button>
                </div>

                <Link className="btn btn--outline btn--block btn--upper" to={'/product/' + product.slug} onClick={() => setQuickView(null)}>
                  View Full Details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
