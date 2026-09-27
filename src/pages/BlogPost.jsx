import { Link, useParams } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { content } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';
import { dateShort } from '../utils/format';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useAsync((signal) => content.blog(slug, { signal }), [slug]);

  if (loading) return <div className="container section--tight"><div className="empty-state">Loading…</div></div>;

  if (error) {
    return (
      <div className="container section--tight">
        <div className="empty-state">
          {error.status === 404 ? 'This post could not be found.' : error.message} <Link to="/blog">Back to the blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container container-narrow section--tight">
      <PageHead title={post?.title} description={dateShort(post?.published_at)} crumbs={[{ label: 'Blog', to: '/blog' }, { label: post?.title || '' }]} />
      {post?.thumbnail && (
        <img src={post.thumbnail} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--sp-6)' }} />
      )}
      {/* written by the shop in the admin's rich-text editor */}
      <div className="pd-desc blog-body" dangerouslySetInnerHTML={{ __html: post?.description || '' }} />
      <p style={{ marginTop: 'var(--sp-7)' }}><Link to="/blog">← Back to the blog</Link></p>
    </div>
  );
}
