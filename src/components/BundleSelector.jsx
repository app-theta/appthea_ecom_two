import Img from './Img';
import { money } from '../data/products';
import { num, barcodesOf, variantLabel, meaningfulVariantLabel, thumbOf } from '../utils/product';

/**
 * combo_type = "Different": one or more fixed bundles, each a set of
 * different products sold together at one bundle price. `is_current_product`
 * marks the item that IS the product being viewed - its variant comes from
 * the page's own picker above; every other item needs its own choice here.
 */
export default function BundleSelector({
  bundles = [], selectedId, onSelect, selections = {}, onSelectItem, currentBarcodeId,
}) {
  if (!bundles.length) return null;

  return (
    <>
      <span className="label">Bundle offers</span>
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        {bundles.map((bundle) => {
          const active = Number(selectedId) === Number(bundle.id);
          const items = Array.isArray(bundle.items) ? bundle.items : [];

          return (
            <div key={bundle.id}>
              <button
                type="button"
                className={'promo-row' + (active ? ' is-active' : '')}
                aria-pressed={active}
                onClick={() => onSelect(active ? null : bundle)}
              >
                <div className="promo-row__top">
                  <strong>{items.length} items bundled</strong>
                  <span className="promo-row__price">BDT {money(bundle.price)}</span>
                </div>
                <div className="promo-row__sub">
                  <s>BDT {money(bundle.regular_total)}</s>
                  {num(bundle.savings_amount) > 0 && (
                    <span className="promo-row__save">Save BDT {money(bundle.savings_amount)}</span>
                  )}
                </div>
                <ul className="promo-row__items">
                  {items.map((it, n) => (
                    <li key={it.product?.id ?? n}>
                      <span>{num(it.quantity) > 1 ? `${it.quantity} × ` : ''}{it.product?.name || `#${it.product?.id}`}</span>
                      <span>BDT {money(it.unit_price)}</span>
                    </li>
                  ))}
                </ul>
              </button>

              {active && (
                <div className="pick-panel">
                  <div className="pick-panel__label">Choose the variant for each item</div>
                  {items.map((it) => {
                    const product = it.product || {};
                    const bcs = barcodesOf(product);
                    const isCurrent = Boolean(it.is_current_product);
                    const chosen = isCurrent
                      ? currentBarcodeId
                      : selections?.[product.id]?.barcode_id ?? (bcs.length === 1 ? bcs[0].id : null);

                    return (
                      <div key={product.id} style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                        <Img src={thumbOf(product)} alt="" fill={false} style={{ width: 46, height: 58, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 'var(--fs-sm)' }}>
                            {product.name}
                            {isCurrent && <span style={{ color: 'var(--ink-soft)' }}> · this product, variant above ↑</span>}
                          </div>
                          {!isCurrent && bcs.length > 1 && (
                            <div className="pick-chip-list" style={{ marginTop: 'var(--sp-2)' }}>
                              {bcs.map((b) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  className={'pick-chip' + (Number(chosen) === Number(b.id) ? ' is-active' : '')}
                                  onClick={() => onSelectItem(product.id, { barcode_id: b.id, name: product.name, variant: variantLabel(b) })}
                                >
                                  {variantLabel(b)}
                                </button>
                              ))}
                            </div>
                          )}
                          {!isCurrent && bcs.length === 1 && meaningfulVariantLabel(bcs[0]) && (
                            <small style={{ color: 'var(--ink-soft)' }}>{meaningfulVariantLabel(bcs[0])}</small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
