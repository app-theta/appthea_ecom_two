import { useState } from 'react';
import PageHead from '../components/PageHead';
import { content } from '../api/endpoints';
import { parseApiError } from '../api/errors';
import { useBusiness } from '../context/BusinessContext';

const BLANK = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

export default function Contact() {
  const { info } = useBusiness();
  const [form, setForm] = useState(BLANK);
  const [fields, setFields] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(''); setFields({});
    try {
      await content.contact(form);
      setSent(true);
      setForm(BLANK);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFields(parsed.fields);
    } finally { setBusy(false); }
  };

  const input = (name, placeholder, props = {}) => (
    <div className="field">
      <input className="input" name={name} placeholder={placeholder} value={form[name]} onChange={set(name)} {...props} />
      {fields[name] && <div className="review-form__error">{fields[name]}</div>}
    </div>
  );

  return (
    <div className="container section--tight">
      <PageHead title="Contact us" description="Questions about an order or a product? Send us a message and we will get back to you." crumbs={[{ label: 'Contact us' }]} />

      <div className="grid-2">
        <div className="panel">
          <div className="panel__head"><h2>Send a message</h2></div>
          <div className="panel__body">
            {sent ? (
              <div className="checkout-banner checkout-banner--info">
                Thank you - your message has been sent. We will reply as soon as we can.{' '}
                <button type="button" className="link-reset" style={{ margin: 0 }} onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="contact-form">
                {input('name', 'Your name', { required: true, maxLength: 191, autoComplete: 'name' })}
                {input('email', 'Email', { type: 'email', required: true, maxLength: 191, autoComplete: 'email' })}
                {input('phone', 'Phone (optional)', { type: 'tel', maxLength: 30, autoComplete: 'tel' })}
                {input('subject', 'Subject (optional)', { maxLength: 191 })}
                <div className="field">
                  <textarea className="textarea" name="message" placeholder="Message" rows={6} required maxLength={2000} value={form.message} onChange={set('message')} />
                  {fields.message && <div className="review-form__error">{fields.message}</div>}
                </div>
                {/* honeypot: people never see or fill it, bots do - the API then refuses the message */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                {error && <div className="review-form__error" style={{ marginBottom: 'var(--sp-3)' }}>{error}</div>}
                <button className="btn btn--primary btn--upper" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
              </form>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__head"><h2>Reach us</h2></div>
          <div className="panel__body">
            {info?.address && <p><strong>Address</strong><br />{[info.address, info.area, info.city].filter(Boolean).join(', ')}</p>}
            {info?.phone && <p><strong>Phone</strong><br /><a href={'tel:' + info.phone}>{info.phone}</a></p>}
            {info?.email && <p><strong>Email</strong><br /><a href={'mailto:' + info.email}>{info.email}</a></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
