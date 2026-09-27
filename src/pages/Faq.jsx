import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { content } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';

export default function Faq() {
  const { data, loading, error } = useAsync((signal) => content.faqs({ signal }), []);
  const faqs = Array.isArray(data) ? data : [];

  return (
    <div className="container container-narrow section--tight">
      <PageHead title="Frequently asked questions" crumbs={[{ label: 'FAQ' }]} />

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : error ? (
        <div className="empty-state">{error.message}</div>
      ) : faqs.length === 0 ? (
        <div className="empty-state">No questions have been added yet.</div>
      ) : (
        <div className="panel faq-list">
          {faqs.map((f, i) => (
            <details key={f.id} className="faq-item" open={i === 0}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      )}

      <p className="form-note" style={{ marginTop: 'var(--sp-6)' }}>
        Still have a question? <Link to="/contact">Contact us</Link>
      </p>
    </div>
  );
}
