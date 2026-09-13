import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icons';
import { reels as reelsApi } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';
import { useBusiness } from '../context/BusinessContext';
import { imageUrl, paginated } from '../utils/product';

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const MuteIcon = (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M4 9v6h4l5 5V4L8 9H4Z" /><path d="M17 8a5 5 0 0 1 0 8M20 5a9 9 0 0 1 0 14" /></svg>;
const UnmuteIcon = (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M4 9v6h4l5 5V4L8 9H4Z" /><path d="m16 9 5 6M21 9l-5 6" /></svg>;

/** True for a hosted-embed URL (YouTube/Vimeo) that needs an <iframe>
    rather than a plain <video src>. */
function isEmbedVideo(url) {
  return /youtube\.com|youtu\.be|player\.vimeo\.com/i.test(url || '');
}

/** Appends autoplay/mute params an embed needs to behave like the native
    <video muted loop> used for direct file URLs. */
function withAutoplay(url) {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}autoplay=1&mute=1&playsinline=1`;
}

/** Vertical snap feed. Autoplay follows the reel in view; view/like are posted once. */
export default function Reels() {
  const { slug } = useParams();
  const { features } = useBusiness();
  const { data, loading, error, reload } = useAsync(
    (signal) => reelsApi.list({ per_page: 20 }, { signal }),
    [],
    { skip: !features.product_reels },
  );
  const rows = useMemo(() => paginated(data).rows, [data]);
  const containerRef = useRef(null);

  if (!features.product_reels) return <Navigate to="/" replace />;

  const ordered = useMemo(() => {
    if (!slug) return rows;
    const i = rows.findIndex((r) => r.slug === slug);
    return i > 0 ? [rows[i], ...rows.slice(0, i), ...rows.slice(i + 1)] : rows;
  }, [rows, slug]);

  if (loading) return <div className="container" style={{ padding: 'var(--sp-10) 0', textAlign: 'center' }}>Loading…</div>;
  if (error) {
    return (
      <div className="container" style={{ padding: 'var(--sp-10) 0', textAlign: 'center' }}>
        <p>{error.message}</p>
        <button type="button" className="btn btn--outline" onClick={reload}>Retry</button>
      </div>
    );
  }
  if (!ordered.length) {
    return <div className="container" style={{ padding: 'var(--sp-10) 0', textAlign: 'center' }}>No reels yet — check back soon.</div>;
  }

  return (
    <div className="reels-page" ref={containerRef}>
      {ordered.map((reel) => <Reel key={reel.id} reel={reel} root={containerRef} />)}
    </div>
  );
}

function Reel({ reel, root }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [liked, setLiked] = useState(Boolean(reel.is_liked));
  const [likes, setLikes] = useState(Number(reel.reel_likes_count ?? reel.likes_count ?? reel.total_likes ?? 0));
  const [viewed, setViewed] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      const v = videoRef.current;
      if (entry.isIntersecting) {
        v?.play?.().catch(() => {});
        if (!viewed) { setViewed(true); reelsApi.view(reel.id).catch(() => {}); }
      } else {
        v?.pause?.();
      }
    }, { root: root?.current || null, threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [reel.id, viewed, root]);

  const like = async () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? Math.max(0, n - 1) : n + 1));
    try { await reelsApi.like(reel.id); } catch { /* optimistic */ }
  };

  const video = reel.reel_video_url || reel.video || reel.video_url || reel.file;
  const embed = isEmbedVideo(video);
  const poster = imageUrl(reel.thumbnail || reel.image);
  const title = reel.title || reel.name;
  const description = reel.description || reel.short_description;
  const productSlug = reel.product?.slug || reel.slug;

  return (
    <section className="reel-slide" ref={ref} data-reel={reel.slug}>
      {video ? (
        embed ? (
          <iframe
            src={withAutoplay(video)}
            title={title || 'Reel'}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video ref={videoRef} src={video} poster={poster || undefined} loop muted={muted} playsInline preload="metadata" />
        )
      ) : (
        <img src={poster} alt={title || ''} loading="lazy" />
      )}

      <div className="reel-slide-side">
        <button type="button" className={liked ? 'is-on' : ''} onClick={like} aria-pressed={liked} aria-label="Like">
          <Icon.heart width="22" height="22" fill={liked ? 'currentColor' : 'none'} />
          <small>{likes}</small>
        </button>
        <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <MuteIcon width="22" height="22" /> : <UnmuteIcon width="22" height="22" />}
        </button>
        {(reel.reel_views_count ?? reel.views_count ?? reel.total_views) != null && (
          <span style={{ textAlign: 'center' }}>
            <Icon.eye width="20" height="20" />
            <small style={{ display: 'block' }}>{reel.reel_views_count ?? reel.views_count ?? reel.total_views}</small>
          </span>
        )}
      </div>

      <div className="reel-slide-meta">
        {title && <h2 style={{ fontFamily: 'var(--ff-brand)', fontSize: 'var(--fs-6xl)', margin: 0 }}>{title}</h2>}
        {description && (
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 'var(--fs-sm)', maxWidth: '46ch', margin: 'var(--sp-2) 0 var(--sp-3)' }}>
            {description}
          </p>
        )}
        {productSlug && (
          <Link to={'/product/' + productSlug} className="btn btn--primary btn--sm">
            <Icon.bag width="16" height="16" /> Shop this
          </Link>
        )}
      </div>
    </section>
  );
}
