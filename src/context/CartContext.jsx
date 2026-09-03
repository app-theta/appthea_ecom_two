import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { checkout as checkoutApi } from '../api/endpoints';
import { barcodePrice, variantLabel, productImages, barcodesOf } from '../utils/product';

const CartContext = createContext(null);
const KEY = 'AppTheta_cart';

/**
 * Every cart item carries `total_price` (the authoritative line total, exactly
 * what the API is sent) plus `price` (a derived per-unit figure, kept only for
 * display). `type` is one of:
 *
 *  simple        { type, key, product_id, barcode_id, qty, price, total_price }
 *  combo_product { type, key, product_id, barcode_id, qty, total_price, free_selections[] }
 *  bundle        { type, key, bundle_id, qty, total_price, selections[] }
 *
 * combo_product/bundle lines are never merged and never quantity-edited after
 * being added — the quantity/free-picks/selections were fixed by whichever
 * combo tier or bundle the customer chose on the product page, and arbitrarily
 * bumping that number in the cart has no well-defined meaning (it wouldn't
 * necessarily match any real tier any more). They can only be removed and
 * re-added with a fresh choice. Simple lines merge and re-quantity freely.
 */
let uidSeq = 0;
const uid = () => `${Date.now()}-${(uidSeq += 1)}`;

/** Backfills `type`/`total_price` on carts saved by an older build of this
    context, so a stale localStorage cart never produces a NaN total_price. */
const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || [];
    if (!Array.isArray(raw)) return [];
    return raw.map((i) => ({
      ...i,
      type: i.type || 'simple',
      total_price: i.total_price != null ? i.total_price : round2(Number(i.price || 0) * Number(i.qty || 1)),
    }));
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(read);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [pricing, setPricing] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const anyLayerOpen = drawerOpen || !!quickView || menuOpen || searchOpen;
  useEffect(() => {
    document.body.classList.toggle('no-scroll', anyLayerOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [anyLayerOpen]);

  const closeAll = useCallback(() => {
    setDrawerOpen(false);
    setQuickView(null);
    setMenuOpen(false);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAll]);

  /**
   * `barcode` is the selected variant object (from a product's `barcodes[]`),
   * not a plain size string - the backend prices/checks-out by barcode_id.
   * `size` is only set when the product actually has more than one variant,
   * so single-SKU products (most of the current catalogue) don't show a
   * meaningless "Size: <raw barcode>" line in the cart.
   */
  const addItem = useCallback((product, barcode, qty = 1) => {
    const hasVariants = barcodesOf(product).length > 1;
    const price = barcodePrice(barcode);
    const key = 'simple-' + product.id + '|' + (barcode?.id ?? 'default');
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        const nextQty = found.qty + qty;
        return prev.map((i) => (i.key === key
          ? { ...i, qty: nextQty, total_price: round2(i.price * nextQty) }
          : i));
      }
      return [
        ...prev,
        {
          type: 'simple',
          key,
          id: product.id,
          product_id: product.id,
          barcode_id: barcode?.id ?? null,
          name: product.name,
          size: hasVariants ? variantLabel(barcode) : null,
          qty,
          price: price.now,
          oldPrice: price.was,
          image: productImages(product)[0],
          total_price: round2(price.now * qty),
        },
      ];
    });
    setQuickView(null);
    setDrawerOpen(true);
  }, []);

  /** entry: { product_id, barcode_id, qty, total_price, name, image, variant,
      free_items[], free_selections[] } - built by the product-details page from
      the chosen combo tier. Always a new, standalone line (see file header). */
  const addComboItem = useCallback((entry) => {
    const key = 'combo-' + uid();
    setItems((prev) => [...prev, {
      type: 'combo_product',
      key,
      product_id: entry.product_id,
      barcode_id: entry.barcode_id,
      name: entry.name,
      image: entry.image,
      size: entry.variant || null,
      freeItems: entry.free_items || [],
      free_selections: entry.free_selections || [],
      qty: entry.qty,
      price: entry.qty > 0 ? round2(entry.total_price / entry.qty) : entry.total_price,
      oldPrice: 0,
      total_price: round2(entry.total_price),
    }]);
    setQuickView(null);
    setDrawerOpen(true);
  }, []);

  /** entry: { bundle_id, qty, total_price, name, image, items[] (display labels),
      selections[] } - built by the product-details page from the chosen bundle.
      Always a new, standalone line (see file header). */
  const addBundleItem = useCallback((entry) => {
    const key = 'bundle-' + uid();
    setItems((prev) => [...prev, {
      type: 'bundle',
      key,
      bundle_id: entry.bundle_id,
      name: entry.name,
      image: entry.image,
      bundleItems: entry.items || [],
      selections: entry.selections || [],
      qty: entry.qty,
      price: entry.qty > 0 ? round2(entry.total_price / entry.qty) : entry.total_price,
      oldPrice: 0,
      total_price: round2(entry.total_price),
    }]);
    setQuickView(null);
    setDrawerOpen(true);
  }, []);

  /** Only simple lines are re-quantified in place - combo/bundle lines ignore
      this (they're remove-and-re-add only, see file header). */
  const setQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((i) => {
      if (i.key !== key || i.type !== 'simple') return i;
      const nextQty = Math.max(1, qty);
      return { ...i, qty: nextQty, total_price: round2(i.price * nextQty) };
    }));
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const apiCart = useCallback(() => items.map((i) => {
    if (i.type === 'bundle') {
      return {
        type: 'bundle',
        bundle_id: i.bundle_id,
        bundle_quantity: i.qty,
        selections: i.selections || [],
        total_price: round2(i.total_price),
      };
    }
    if (i.type === 'combo_product') {
      return {
        type: 'combo_product',
        product_id: i.product_id,
        barcode_id: i.barcode_id,
        quantity: i.qty,
        free_selections: i.free_selections || [],
        total_price: round2(i.total_price),
      };
    }
    return {
      type: 'simple',
      product_id: i.product_id,
      barcode_id: i.barcode_id,
      quantity: i.qty,
      total_price: round2(i.total_price),
    };
  }), [items]);

  /** POST cart/price - refreshes each line's total from the backend right
      before checkout, since the backend re-prices every line and rejects
      checkout on any mismatch. Returns whether anything actually changed. */
  const syncPrices = useCallback(async () => {
    if (!items.length) return { changed: false, data: null };
    setPricing(true);
    try {
      const data = await checkoutApi.price(apiCart());
      const lines = Array.isArray(data?.cart) ? data.cart : Array.isArray(data?.items) ? data.items : null;
      if (!lines) return { changed: false, data };

      const next = items.map((line, idx) => {
        const server = lines[idx];
        const fresh = Number(server?.total_price ?? line.total_price);
        if (!(Math.abs(fresh - Number(line.total_price)) > 0.009)) return line;
        return { ...line, total_price: fresh, price: line.qty > 0 ? round2(fresh / line.qty) : fresh };
      });
      const changed = next.some((line, i) => line !== items[i]);
      if (changed) setItems(next);
      return { changed, data };
    } finally {
      setPricing(false);
    }
  }, [items, apiCart]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + Number(i.total_price || 0), 0);
    return {
      items, count, subtotal, pricing,
      addItem, addComboItem, addBundleItem, setQty, removeItem, clear, apiCart, syncPrices,
      drawerOpen, setDrawerOpen,
      quickView, setQuickView,
      menuOpen, setMenuOpen,
      searchOpen, setSearchOpen,
      toast, setToast,
      closeAll
    };
  }, [items, pricing, addItem, addComboItem, addBundleItem, setQty, removeItem, clear, apiCart, syncPrices, drawerOpen, quickView, menuOpen, searchOpen, toast, closeAll]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const round2 = (n) => Math.round(Number(n) * 100) / 100;

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
