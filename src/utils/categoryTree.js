/** True unless the API told us this category has zero (Active) products.
    Missing/unknown products_count fails open (shown) rather than silently
    hiding a category over a data hiccup. */
const hasProducts = (c) => (c.products_count ?? 1) > 0;

/**
 * Builds the nav structure from the flat category list the API returns.
 * Categories with no parent become top-level nav links; any category whose
 * parent_id points at one of those becomes a dropdown child under it. When a
 * business has no sub-categories set up (the common case), every category is
 * just a flat top-level link - no dropdown renders, matching NAV_LINKS' old
 * "Accessories"/"Shoes" entries that had no children either.
 *
 * Empty categories (no Active products) are dropped entirely - a nav link
 * that leads to an empty shop page is a dead end, not a feature. `limit`
 * caps how many top-level links come back (a nav-bar-width concern, not a
 * data one, hence a display option here rather than baked into the API).
 */
export function categoryNavTree(categories, { limit } = {}) {
  const list = Array.isArray(categories) ? categories : [];
  const top = list.filter((c) => !c.parent_id && hasProducts(c));
  const limited = limit ? top.slice(0, limit) : top;
  return limited.map((c) => ({
    label: c.name,
    to: `/shop/${c.slug}`,
    children: list
      .filter((x) => x.parent_id === c.id && hasProducts(x))
      .map((x) => ({ slug: x.slug, name: x.name })),
  }));
}
