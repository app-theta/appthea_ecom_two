import PageHead from '../components/PageHead';
import { useBusiness } from '../context/BusinessContext';

/** Renders one of the business's rich-text legal fields (e.g. `privacy_policy`).
    One page, reused for every policy route via `field`/`title` props. */
export default function Policy({ field, title }) {
  const { info, loading } = useBusiness();
  const html = info?.[field];

  return (
    <div className="container">
      <PageHead title={title} crumbs={[{ label: title }]} />
      <div style={{ padding: '0 0 var(--sp-10)' }}>
        {loading ? (
          <p>Loading…</p>
        ) : html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p style={{ color: 'var(--ink-soft)' }}>This policy has not been published yet.</p>
        )}
      </div>
    </div>
  );
}
