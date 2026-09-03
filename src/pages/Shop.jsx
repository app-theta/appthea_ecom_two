import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PageHead from '../components/PageHead';
import { Icon } from '../components/Icons';
import { useBusiness } from '../context/BusinessContext';
import { useAsync } from '../hooks/useAsync';
import { catalog } from '../api/endpoints';
import { paginated } from '../utils/product';

const SORTS = [
  { value: 'latest', label: 'Featured' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name: A - Z' },
];

const PRICES = [
  { value: '', label: 'All prices' },
  { value: 'under2000', label: 'Under BDT 2,000' },
  { value: '2000-3000', label: 'BDT 2,000 - 3,000' },
  { value: 'above3000', label: 'Above BDT 3,000' },
];

const PRICE_RANGES = {
  under2000: { max_price: 2000 },
  '2000-3000': { min_price: 2000, max_price: 3000 },
  above3000: { min_price: 3000 },
};

export default function Shop() {
  const { category: categorySlug } = useParams();
  const { categories, brands } = useBusiness();
  const [keyword, setKeyword] = useState('');
  const [brandId, setBrandId] = useState('');
  const [sort, setSort] = useState('latest');
  const [price, setPrice] = useState('');
  const [page, setPage] = useState(1);

  const collection = categorySlug ? categories.find((c) => c.slug === categorySlug) : null;

  useEffect(() => {
    setPage(1);
    setSort('latest');
    setPrice('');
    setBrandId('');
    setKeyword('');
  }, [categorySlug]);

  const query = useMemo(() => ({
    keyword: keyword.trim() || undefined,
    category_id: collection?.id,
    brand_id: brandId || undefined,
    sort,
    per_page: 8,
    page,
    ...(PRICE_RANGES[price] || {}),
  }), [keyword, collection?.id, brandId, sort, price, page]);

  const { data, loading, error, reload } = useAsync(
    (signal) => catalog.products(query, { signal }),
    [JSON.stringify(query)],
  );
  const { rows, lastPage, total } = paginated(data);

  const goPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSort('latest'); setPrice(''); setBrandId(''); setKeyword(''); setPage(1);
  };

  return (
    <div className="container">
      <PageHead
        title={collection ? collection.name : 'All Products'}
        description={
          collection
            ? undefined
            : 'Browse the full AppTheta wardrobe — panjabi, shirts, tees, polos, trousers and the finishing details.'
        }
        crumbs={collection ? [{ label: 'Shop', to: '/shop' }, { label: collection.name }] : [{ label: 'Shop' }]}
      />

      <div className="shop-toolbar">
        <input
          className="select"
          type="search"
          placeholder="Search products..."
          aria-label="Search products"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          style={{ minWidth: 180 }}
        />

        {brands.length > 0 && (
          <select
            className="select"
            aria-label="Brand filter"
            value={brandId}
            onChange={(e) => { setBrandId(e.target.value); setPage(1); }}
          >
            <option value="">All brands</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}

        <label htmlFor="sort">Sort by</label>
        <select className="select" id="sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="select" aria-label="Price filter" value={price} onChange={(e) => { setPrice(e.target.value); setPage(1); }}>
          {PRICES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <span className="result-count">{total} products</span>
        <button className="link-reset" onClick={resetFilters}>Reset filters</button>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ aspectRatio: 'var(--card-ratio)', background: 'var(--cat-bg)', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      ) : error ? (
        <div className="empty-state">
          {error.message}
          <div style={{ marginTop: 'var(--sp-3)' }}>
            <button className="link-reset" style={{ margin: 0 }} onClick={reload}>Retry</button>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="empty-state">No products match these filters.</div>
      ) : (
        <div className="product-grid">
          {rows.map((p) => <ProductCard product={p} key={p.id} />)}
        </div>
      )}

      {lastPage > 1 && (
        <div className="pagination">
          <button onClick={() => goPage(page - 1)} disabled={page === 1} aria-label="Previous page">
            <Icon.chevronLeft width="16" height="16" />
          </button>
          {Array.from({ length: lastPage }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? 'is-active' : undefined}
              onClick={() => goPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goPage(page + 1)} disabled={page === lastPage} aria-label="Next page">
            <Icon.chevronRight width="16" height="16" />
          </button>
        </div>
      )}
    </div>
  );
}
