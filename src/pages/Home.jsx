import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import Img from '../components/Img';
import { FEATURES } from '../data/products';
import { useBusiness } from '../context/BusinessContext';
import { useAsync } from '../hooks/useAsync';
import { home } from '../api/endpoints';
import { paginated, imageUrl } from '../utils/product';

function Hero({ slides }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 5500);
    return () => clearInterval(t);
  }, [total]);

  if (total === 0) return null;

  const go = (n) => setIndex((n + total) % total);

  return (
    <section className="hero">
      <div className="hero__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s) => {
          const slide = (
            <Img
              src={imageUrl(s.image)}
              alt={s.title || ''}
              fill={false}
              style={{ width: '100%', height: 'clamp(320px, 47vw, 760px)', objectFit: 'cover', display: 'block' }}
            />
          );
          return (
            <div className="hero__slide" key={s.id}>
              {s.url ? <a href={s.url}>{slide}</a> : slide}
            </div>
          );
        })}
      </div>
      {total > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" onClick={() => go(index - 1)} aria-label="Previous slide">
            <Icon.chevronLeft />
          </button>
          <button className="hero__arrow hero__arrow--next" onClick={() => go(index + 1)} aria-label="Next slide">
            <Icon.chevronRight />
          </button>
          <div className="hero__dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={i === index ? 'is-active' : undefined}
                onClick={() => go(i)}
                aria-label={'Go to slide ' + (i + 1)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function Home() {
  const { categories, sliders } = useBusiness();
  const summary = useAsync((signal) => home.summary({ per_page: 8 }, { signal }), []);
  const arrivals = paginated(summary.data?.latest).rows;

  return (
    <>
      <Hero slides={sliders} />

      <section className="features">
        <div className="container">
          <div className="features__grid">
            {FEATURES.map((feat) => {
              const Ico = Icon[feat.icon];
              return (
                <div className="feature" key={feat.text}>
                  <Ico />
                  <p>{feat.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><h2>Shop by Collection</h2></div>
            <div className="collection-grid">
              {categories.map((c) => (
                <Link className="collection-card" to={'/shop/' + c.slug} key={c.slug}>
                  <Img
                    src={imageUrl(c.image)}
                    alt={c.name}
                    fill={false}
                    style={{ width: '100%', aspectRatio: '1 / 1.2', objectFit: 'cover', display: 'block' }}
                  />
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <h2>New Arrivals</h2>
            <p>Fresh cuts, straight from the studio</p>
          </div>
          <div className="product-grid">
            {summary.loading
              ? Array.from({ length: 8 }, (_, i) => <div className="product-card" key={i} style={{ aspectRatio: 'var(--card-ratio)', background: 'var(--cat-bg)', borderRadius: 'var(--radius)' }} />)
              : arrivals.map((p) => <ProductCard product={p} key={p.id} />)}
          </div>
        </div>
      </section>
    </>
  );
}
