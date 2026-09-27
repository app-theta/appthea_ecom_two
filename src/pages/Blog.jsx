import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Img from '../components/Img';
import { content } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';
import { paginated } from '../utils/product';
import { dateShort } from '../utils/format';

export default function Blog() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useAsync((signal) => content.blogs({ page, per_page: 9 }, { signal }), [page]);
  const { rows, lastPage } = paginated(data);

  return (
    <div className="container section--tight">
      <PageHead title="Blog" description="News, guides and stories from the shop." crumbs={[{ label: 'Blog' }]} />

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : error ? (
        <div className="empty-state">{error.message}</div>
      ) : rows.length === 0 ? (
        <div className="empty-state">No posts yet.</div>
      ) : (
        <>
          <div className="grid-3 blog-grid">
            {rows.map((post) => (
              <article className="card blog-card" key={post.id}>
                <Link to={'/blog/' + post.slug} className="blog-card__media" tabIndex={-1} aria-hidden="true">
                  <Img src={post.thumbnail} alt="" />
                </Link>
                <div className="card__body">
                  <small className="form-note">{dateShort(post.published_at)}</small>
                  <h2 className="blog-card__title"><Link to={'/blog/' + post.slug}>{post.title}</Link></h2>
                  {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
                  <Link to={'/blog/' + post.slug} className="link-reset" style={{ margin: 0 }}>Read more →</Link>
                </div>
              </article>
            ))}
          </div>
          {lastPage > 1 && (
            <div className="pagination">
              {Array.from({ length: lastPage }, (_, i) => (
                <button key={i} type="button" className={page === i + 1 ? 'is-active' : undefined} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
