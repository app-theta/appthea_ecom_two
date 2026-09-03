import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons';
import { reviews as reviewsApi } from '../api/endpoints';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { parseApiError } from '../api/errors';
import { initials, dateShort } from '../utils/format';

export function Stars({ value = 0, size = 16, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className="stars__star"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          style={{ color: n <= Math.round(value) ? 'var(--accent)' : 'var(--line)', width: size, height: size }}
          aria-label={onChange ? `Rate ${n} out of 5` : undefined}
        >
          <Icon.star width={size} height={size} />
        </button>
      ))}
    </span>
  );
}

export default function ReviewSection({ productId }) {
  const { isAuthed } = useAuth();
  const { setToast } = useCart();
  const [writing, setWriting] = useState(false);

  const { data, loading, reload } = useAsync((signal) => reviewsApi.list(productId, undefined, { signal }), [productId]);
  const rows = Array.isArray(data) ? data : (data?.data ?? []);
  const summary = data?.summary || null;

  const onHelpful = async (reviewId) => {
    try {
      await reviewsApi.reaction({ review_id: reviewId, reaction: 'like' });
      reload();
    } catch (e) { setToast(parseApiError(e).message); }
  };

  return (
    <section className="review-section" id="reviews">
      <div className="review-section__head">
        <div>
          <h2>Ratings &amp; Reviews</h2>
          {summary && (
            <div className="review-summary">
              <span className="review-summary__score">{Number(summary.average || 0).toFixed(1)}</span>
              <div>
                <Stars value={summary.average} />
                <div className="form-note">{summary.total} review{summary.total === 1 ? '' : 's'}</div>
              </div>
            </div>
          )}
        </div>
        {isAuthed ? (
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setWriting((v) => !v)}>
            Write a review
          </button>
        ) : (
          <Link to="/login" className="btn btn--ghost btn--sm">Login to write a review</Link>
        )}
      </div>

      {writing && (
        <ReviewForm
          productId={productId}
          onDone={() => { setWriting(false); reload(); setToast('Review submitted'); }}
        />
      )}

      {loading ? (
        <div className="review-skeleton" />
      ) : rows.length === 0 ? (
        <div className="empty-state">No reviews yet. Be the first to review this product.</div>
      ) : (
        <div className="review-list">
          {rows.map((r) => (
            <article className="review" key={r.id}>
              <header className="review__head">
                <span className="review__avatar">{initials(r.customer?.name || r.customer_name || 'A')}</span>
                <div>
                  <div className="review__author">{r.customer?.name || r.customer_name || 'Customer'}</div>
                  <div className="form-note">{dateShort(r.created_at)}</div>
                </div>
                <span className="review__rating"><Stars value={r.rating} size={14} /></span>
              </header>
              <p className="review__body">{r.comment || r.review}</p>
              {(r.replies || []).map((rep) => (
                <div className="review__reply" key={rep.id}>
                  <div className="review__reply-label">Seller reply</div>
                  {rep.comment || rep.reply}
                </div>
              ))}
              <button type="button" className="review__helpful" onClick={() => onHelpful(r.id)}>
                <Icon.thumbUp width="14" height="14" />
                Helpful{r.likes_count ? ` (${r.likes_count})` : ''}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewForm({ productId, onDone }) {
  const { setToast } = useCart();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await reviewsApi.store({ product_id: productId, rating, comment });
      setComment('');
      onDone();
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.fields.comment || parsed.message);
      setToast(parsed.message);
    } finally { setBusy(false); }
  };

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="field">
        <label>Your rating</label>
        <Stars value={rating} onChange={setRating} size={22} />
      </div>
      <div className="field">
        <label htmlFor="rv-comment">Your review</label>
        <textarea
          id="rv-comment"
          className="textarea"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        {error && <div className="review-form__error">{error}</div>}
      </div>
      <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
