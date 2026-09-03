import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons';
import Img from './Img';
import { useCart } from '../context/CartContext';
import { catalog } from '../api/endpoints';
import { money } from '../data/products';
import { headlinePrice, productImages, paginated } from '../utils/product';

export default function SearchPanel() {
  const { searchOpen, setSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setHits([]); setLoading(false); return undefined; }
    setLoading(true);
    const controller = new AbortController();
    const t = setTimeout(() => {
      catalog.products({ keyword: q, per_page: 7 }, { signal: controller.signal })
        .then((data) => setHits(paginated(data).rows))
        .catch((e) => { if (e?.code !== 'ERR_CANCELED') setHits([]); })
        .finally(() => setLoading(false));
    }, 300);
    return () => { clearTimeout(t); controller.abort(); };
  }, [query]);

  if (!searchOpen) return null;

  return (
    <div className="search-panel" onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
      <button className="search-panel__close" onClick={() => setSearchOpen(false)} aria-label="Close search">
        <Icon.close width="22" height="22" />
      </button>
      <div className="search-panel__field">
        <Icon.search />
        <input
          autoFocus
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() === '' ? (
        <p>Start typing to search the catalogue</p>
      ) : loading ? (
        <p>Searching…</p>
      ) : hits.length === 0 ? (
        <p>No products found for &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="search-results">
          {hits.map((p) => {
            const price = headlinePrice(p);
            return (
              <Link key={p.id} to={'/product/' + p.slug} onClick={() => setSearchOpen(false)}>
                <Img src={productImages(p)[0]} alt={p.name} fill={false} style={{ width: 44, height: 55, objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }} />
                <span>{p.name}</span>
                <span style={{ marginLeft: 'auto' }}>BDT {money(price.now)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
