import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../Icons';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { parseApiError } from '../../api/errors';

const MAX_FILE = 5 * 1024 * 1024;
const Spinner = () => <span className="chat-spin" aria-hidden="true" />;

/** The conversation with the store - inside the floating window ("popup") or the account page ("page"). */
export default function ChatPanel({ variant = 'popup', onClose }) {
  const { isAuthed } = useAuth();
  const chat = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthed) {
    const goTo = (path) => {
      chat.rememberForLogin();
      onClose?.();
      navigate(path, { state: { from: location.pathname + location.search } });
    };

    return (
      <div className={`chat-panel chat-panel--${variant}`}>
        <ChatHeader onClose={onClose} variant={variant} />
        <div className="chat-guest">
          <Icon.chat className="chat-guest__icon" />
          <h3>Chat with the store</h3>
          <p>Sign in to send a message - we will reply right here.</p>
          <div className="chat-guest__actions">
            <button type="button" className="btn btn--primary btn--block" onClick={() => goTo('/login')}>Sign in</button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => goTo('/register')}>Create an account</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-panel chat-panel--${variant}`}>
      <ChatHeader onClose={onClose} variant={variant} />
      <ChatBody />
      <ChatComposer />
    </div>
  );
}

function ChatHeader({ onClose, variant }) {
  const { chat, live } = useChat();
  const store = chat?.store;

  return (
    <div className="chat-head">
      <div className="chat-head__store">
        {store?.logo ? <img src={store.logo} alt="" /> : <span className="chat-head__logo"><Icon.shop /></span>}
        <div>
          <strong>{store?.name || 'Chat with us'}</strong>
          <small>{live ? <><span className="chat-dot" />Online now</> : 'We usually reply soon'}</small>
        </div>
      </div>
      <div className="chat-head__actions">
        {variant === 'popup' && (
          <Link to="/account/chat" className="chat-icon-btn" title="Open full page" onClick={onClose}><Icon.expand /></Link>
        )}
        {onClose && <button type="button" className="chat-icon-btn" onClick={onClose} aria-label="Close"><Icon.close /></button>}
      </div>
    </div>
  );
}

function ChatBody() {
  const { chat, messages, hasMore, loading, typingName, loadOlder, reload } = useChat();
  const bodyRef = useRef(null);
  const stick = useRef(true);
  const [olderLoading, setOlderLoading] = useState(false);
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // follow new messages when the reader is at the bottom
  useEffect(() => {
    const el = bodyRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages.length, typingName]);

  const onScroll = () => {
    const el = bodyRef.current;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const older = async () => {
    const el = bodyRef.current;
    const before = el.scrollHeight;
    setOlderLoading(true);
    stick.current = false;
    try { await loadOlder(); } finally { setOlderLoading(false); }
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight - before; });
  };

  if (loading && !chat) {
    return <div className="chat-body chat-body--center"><Spinner /> Loading…</div>;
  }

  if (!chat) {
    return (
      <div className="chat-body chat-body--center">
        <button type="button" className="btn btn--sm btn--ghost" onClick={reload}>Try again</button>
      </div>
    );
  }

  let lastDate = null;

  return (
    <div className="chat-body" ref={bodyRef} onScroll={onScroll}>
      {hasMore && (
        <div className="chat-earlier">
          <button type="button" onClick={older} disabled={olderLoading}>
            {olderLoading ? <Spinner /> : 'Show earlier messages'}
          </button>
        </div>
      )}

      {!messages.length && (
        <div className="chat-welcome">
          <Icon.smile />
          <p>Hi! Ask us anything about a product or your order.</p>
        </div>
      )}

      {messages.map((m) => {
        const day = m.date !== lastDate ? m.date : null;
        lastDate = m.date;
        return (
          <div key={m.id}>
            {day && <div className="chat-day"><span>{day === today ? 'Today' : day}</span></div>}
            <ChatBubble m={m} store={chat.store} />
          </div>
        );
      })}

      {typingName !== null && (
        <div className="chat-typing">
          <span className="chat-dots"><i /><i /><i /></span>
          {(typingName || chat.store?.name || 'The store') + ' is typing…'}
        </div>
      )}

      {chat.can_rate && <ChatRating />}
    </div>
  );
}

function ChatBubble({ m, store }) {
  if (m.is_system) {
    return <div className="chat-system"><span>{(m.store_name || store?.name) + ' ' + m.message} · {m.clock}</span></div>;
  }

  const mine = m.sender_type === 'Customer';

  return (
    <div className={`chat-msg ${mine ? 'is-mine' : ''}`}>
      {!mine && (store?.logo ? <img className="chat-avatar" src={store.logo} alt="" /> : <span className="chat-avatar chat-avatar--icon"><Icon.shop /></span>)}
      <div className="chat-msg__wrap">
        {!mine && <div className="chat-msg__name">{m.store_name || store?.name}</div>}
        <div className="chat-bubble">
          {m.order && (
            <Link to={`/account/orders/${m.order.id}`} className="chat-card">
              <Icon.receipt />
              <span><strong>Order {m.order.invoice_no}</strong><small>{m.order.date} · {m.order.status}</small></span>
            </Link>
          )}
          {m.product && (
            <Link to={`/product/${m.product.slug}`} className="chat-card">
              {m.product.image ? <img src={m.product.image} alt="" /> : <Icon.bag />}
              <span><strong>{m.product.title}</strong><small>Product</small></span>
            </Link>
          )}
          {m.message && <p className="chat-text">{m.message}</p>}
          {m.file && (m.is_image
            ? <a href={m.file} target="_blank" rel="noreferrer"><img className="chat-img" src={m.file} alt={m.file_name} loading="lazy" /></a>
            : <a className="chat-file" href={m.file} target="_blank" rel="noreferrer"><Icon.file />{m.file_name}</a>)}
        </div>
        <div className="chat-meta">
          {m.clock}
          {mine && <Icon.checkAll className={m.read ? 'is-read' : ''} aria-label={m.read ? 'Seen' : 'Sent'} />}
        </div>
      </div>
    </div>
  );
}

function ChatRating() {
  const { rate } = useChat();
  const [stars, setStars] = useState(0);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!stars) return;
    setBusy(true);
    try { await rate(stars, note); } finally { setBusy(false); }
  };

  return (
    <div className="chat-rate">
      <p>How did we do?</p>
      <div className="chat-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" className={n <= stars ? 'is-on' : ''} onClick={() => setStars(n)} aria-label={`${n}`}>★</button>
        ))}
      </div>
      {stars > 0 && (
        <>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} maxLength={191} placeholder="Anything to add? (optional)" />
          <button type="button" className="btn btn--sm btn--primary" onClick={submit} disabled={busy}>Send rating</button>
        </>
      )}
    </div>
  );
}

function ChatComposer() {
  const { chat, send, notifyTyping, pending, setPending } = useChat();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { if (pending) inputRef.current?.focus(); }, [pending]);

  if (!chat) return null;

  if (chat.blocked) {
    return <div className="chat-blocked"><Icon.block />You can no longer send messages in this chat.</div>;
  }

  const pick = (e) => {
    const chosen = e.target.files?.[0];
    e.target.value = '';
    if (!chosen) return;
    if (chosen.size > MAX_FILE) { setError('The file is too big - 5 MB at most.'); return; }
    setError('');
    setFile(chosen);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy || (!text.trim() && !file && !pending)) return;
    setBusy(true);
    setError('');
    try {
      await send(text, file);
      setText('');
      setFile(null);
      if (inputRef.current) inputRef.current.style.height = 'auto';
    } catch (err) {
      const parsed = parseApiError(err);
      setError(Object.values(parsed.fields || {})[0] || parsed.message || 'Could not send. Please try again.');
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  return (
    <form className="chat-composer" onSubmit={submit}>
      {(pending || file) && (
        <div className="chat-attachments">
          {pending?.product && (
            <span className="chat-chip">{pending.product.image ? <img src={pending.product.image} alt="" /> : <Icon.bag />}
              {pending.product.title}<button type="button" onClick={() => setPending(null)} aria-label="Remove"><Icon.close /></button></span>
          )}
          {pending?.order && (
            <span className="chat-chip"><Icon.receipt />Order {pending.order.invoice_no}
              <button type="button" onClick={() => setPending(null)} aria-label="Remove"><Icon.close /></button></span>
          )}
          {file && (
            <span className="chat-chip">{file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt="" /> : <Icon.file />}
              {file.name}<button type="button" onClick={() => setFile(null)} aria-label="Remove"><Icon.close /></button></span>
          )}
        </div>
      )}
      <div className="chat-composer__row">
        <button type="button" className="chat-icon-btn" onClick={() => fileRef.current?.click()} title="Attach a photo or PDF"><Icon.clip /></button>
        <input ref={fileRef} type="file" hidden accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={pick} />
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          maxLength={3000}
          placeholder="Write a message…"
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            if (e.target.value.trim()) notifyTyping();
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) submit(e); }}
        />
        <button type="submit" className="chat-send" disabled={busy} aria-label="Send">
          {busy ? <Spinner /> : <Icon.send />}
        </button>
      </div>
      {error && <small className="chat-error">{error}</small>}
    </form>
  );
}
