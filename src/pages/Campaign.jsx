import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CampaignHero from '../components/CampaignHero';
import { Icon } from '../components/Icons';
import { useBusiness } from '../context/BusinessContext';
import { useAsync } from '../hooks/useAsync';
import { deals } from '../api/endpoints';
import { paginated } from '../utils/product';

/** /campaign/:slug - one running campaign and all its products at the campaign price. */
export default function Campaign() {
  const { slug } = useParams();
  const { features } = useBusiness();
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [slug]);

  const { data, loading, error, reload } = useAsync(
    (signal) => deals.campaign(slug, { page, per_page: 24 }, { signal }),
    [slug, page],
  );
  const campaign = data?.campaign;
  const { rows, lastPage } = paginated(data?.products);

  useEffect(() => {
    if (campaign?.title) document.title = campaign.title;
  }, [campaign?.title]);

  const goPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 404 = not running any more (ended, not started yet, or taken down)
  const ended = error?.status === 404;

  return (
    <div className="container campaign-page">
      {features.show_breedcrumb && (
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span className="current">{campaign?.title || 'Campaign'}</span>
        </div>
      )}

      {loading && !data ? (
        <>
          <div className="campaign-hero" style={{ opacity: 0.35 }} />
          <div className="product-grid" style={{ marginTop: 'var(--sp-6)' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{ aspectRatio: 'var(--card-ratio)', background: 'var(--cat-bg)', borderRadius: 'var(--radius)' }} />
            ))}
          </div>
        </>
      ) : ended ? (
        <div className="empty-state">
          <Icon.info />
          <h2 className="campaign-ended__title">This campaign has ended</h2>
          <p>Its special prices are no longer available, but there is plenty more in the shop.</p>
          <Link to="/shop" className="btn btn--primary">Keep shopping</Link>
        </div>
      ) : error ? (
        <div className="empty-state">
          {error.message}
          <div style={{ marginTop: 'var(--sp-3)' }}>
            <button className="link-reset" style={{ margin: 0 }} onClick={reload}>Retry</button>
          </div>
        </div>
      ) : campaign && (
        <>
          <CampaignHero campaign={campaign} linked={false} as="h1" onEnd={reload} />

          {rows.length ? (
            <div className="product-grid" style={{ marginTop: 'var(--sp-6)' }}>
              {rows.map((p) => <ProductCard product={p} key={p.id} />)}
            </div>
          ) : (
            <div className="empty-state">No products in this campaign right now.</div>
          )}

          {lastPage > 1 && (
            <div className="pagination">
              <button onClick={() => goPage(page - 1)} disabled={page === 1} aria-label="Previous page">
                <Icon.chevronLeft width="16" height="16" />
              </button>
              {Array.from({ length: lastPage }, (_, i) => (
                <button key={i} className={page === i + 1 ? 'is-active' : undefined} onClick={() => goPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => goPage(page + 1)} disabled={page === lastPage} aria-label="Next page">
                <Icon.chevronRight width="16" height="16" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
