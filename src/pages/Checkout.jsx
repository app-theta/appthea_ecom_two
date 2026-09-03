import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons';
import PageHead from '../components/PageHead';
import OtpModal from '../components/OtpModal';
import { LineDetail } from '../components/CartDrawer.jsx';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { checkout as checkoutApi } from '../api/endpoints';
import { parseApiError, isPriceMismatch, needsOtp } from '../api/errors';
import { money2 } from '../data/products';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, apiCart, syncPrices, clear, setToast } = useCart();
  const { shipping, enabledPayments, features } = useBusiness();
  const { customer, isAuthed } = useAuth();

  const [area, setArea] = useState('inside_city');
  const [payment, setPayment] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [form, setForm] = useState({ phone: '', name: '', email: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpDone, setOtpDone] = useState(false);
  const renderedAt = useRef(Math.floor(Date.now() / 1000));
  const honeypot = useRef('');

  useEffect(() => {
    if (!payment && enabledPayments.length) setPayment(enabledPayments[0]);
  }, [enabledPayments, payment]);

  useEffect(() => {
    if (!isAuthed || !customer) return;
    setForm((f) => ({
      ...f,
      name: f.name || [customer.first_name, customer.last_name].filter(Boolean).join(' ') || customer.name || '',
      email: f.email || customer.email || '',
      phone: f.phone || customer.phone || '',
      address: f.address || customer.address || '',
    }));
  }, [isAuthed, customer]);

  const shippingCharge = useMemo(() => {
    if (shipping.freeAbove > 0 && subtotal >= shipping.freeAbove) return 0;
    return area === 'inside_city' ? shipping.inside : shipping.outside;
  }, [area, shipping, subtotal]);

  const discount = Number(applied?.discount_amount ?? 0);
  const grandTotal = useMemo(() => {
    if (applied?.grand_total != null) return Number(applied.grand_total);
    return Math.max(0, subtotal + shippingCharge - discount);
  }, [applied, subtotal, shippingCharge, discount]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponBusy(true); setCouponError('');
    try {
      const data = await checkoutApi.applyCoupon({
        coupon_code: coupon.trim(),
        cart: apiCart(),
        shipping_area: area,
      });
      setApplied(data);
      setToast('Coupon applied');
    } catch (e) {
      const parsed = parseApiError(e);
      setApplied(null);
      setCouponError(parsed.message);
    } finally { setCouponBusy(false); }
  };

  const removeCoupon = () => { setApplied(null); setCoupon(''); setCouponError(''); };

  const placeOrder = async (e) => {
    e?.preventDefault();
    setErrors({}); setBanner(null);

    if (!items.length) { setToast('Your cart is empty'); return; }
    if (!form.phone || !form.name || !form.address) {
      setToast('Please fill in phone, name and address');
      return;
    }
    if (!payment) { setBanner({ kind: 'error', text: 'Please select a payment method' }); return; }

    setPlacing(true);
    try {
      const { changed } = await syncPrices();
      if (changed) {
        setBanner({ kind: 'info', text: 'Prices were updated - please review your order before continuing.' });
        setPlacing(false);
        return;
      }

      const payload = {
        cart: apiCart(),
        coupon_code: applied ? coupon.trim() : '',
        coupon_discount_amount: discount,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        country: 'Bangladesh',
        order_note: form.notes,
        shipping_area: area,
        payment_type: payment,
        grand_total: grandTotal,
        website: honeypot.current,
        form_rendered_at: renderedAt.current,
      };

      const res = await checkoutApi.place(payload);
      if (res?.status === false) throw { response: { data: res, status: res.code } };

      const data = res?.data || {};
      const code = data.order?.unique_code || data.order?.order_code || '';

      if (data.payment_required && data.payment_url) {
        setToast('Redirecting to payment…');
        window.location.href = data.payment_url;
        return;
      }

      clear();
      navigate(`/order/success?order=${encodeURIComponent(code)}&message=${encodeURIComponent(res?.message || '')}`);
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);

      if (needsOtp(parsed) && payment === 'Cash On Delivery' && !otpDone) {
        try { await checkoutApi.sendOtp(form.phone); } catch { /* modal has its own resend */ }
        setOtpOpen(true);
      } else if (isPriceMismatch(parsed)) {
        await syncPrices();
        setBanner({ kind: 'error', text: 'A price changed - please review your order and try again.' });
      } else {
        setBanner({ kind: 'error', text: parsed.message });
      }
    } finally { setPlacing(false); }
  };

  if (!items.length) {
    return (
      <div className="container">
        <PageHead title="Checkout" description="Complete your purchase securely" crumbs={[{ label: 'Checkout' }]} />
        <div className="card"><div className="empty-state"><Icon.bag />Your cart is empty.</div></div>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHead title="Checkout" description="Complete your purchase securely" crumbs={[{ label: 'Checkout' }]} />

      {banner && (
        <div className={'checkout-banner checkout-banner--' + banner.kind} role="alert">
          {banner.text}
        </div>
      )}

      <form className="checkout-layout" onSubmit={placeOrder} noValidate>
        <div className="card">
          <div className="card__body">
            <h2 className="form-title"><Icon.bag /> Billing Details</h2>

            <div className="field phone-row">
              <span className="phone-prefix">+88</span>
              <input className="input" type="tel" placeholder="Phone number" value={form.phone} onChange={set('phone')} required />
            </div>
            {errors.phone && <div className="review-form__error">{errors.phone}</div>}
            <div className="field"><input className="input" placeholder="Full name" value={form.name} onChange={set('name')} required /></div>
            {errors.full_name && <div className="review-form__error">{errors.full_name}</div>}
            <div className="field"><input className="input" type="email" placeholder="Email address" value={form.email} onChange={set('email')} /></div>
            <div className="field"><input className="input" placeholder="Full address (house, road, block, area)" value={form.address} onChange={set('address')} required /></div>
            {errors.address && <div className="review-form__error">{errors.address}</div>}
            <div className="field">
              <label htmlFor="notes">Order notes (optional)</label>
              <textarea className="textarea" id="notes" placeholder="Special instructions for delivery..." value={form.notes} onChange={set('notes')} />
            </div>

            {/* honeypot - invisible to humans, filled only by bots */}
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" onChange={(e) => { honeypot.current = e.target.value; }} />
            </div>

            <h2 className="form-title" style={{ fontSize: 'var(--fs-2xl)', marginTop: 'var(--sp-7)' }}>
              <Icon.truck /> Shipping Options
            </h2>
            {[
              { id: 'inside_city', label: 'Inside Dhaka', note: 'Delivery in 24-48 hours', price: shipping.inside },
              { id: 'outside_city', label: 'Outside Dhaka', note: 'Delivery in 2-4 business days', price: shipping.outside },
            ].map((s) => (
              <label className={'opt-row' + (area === s.id ? ' is-active' : '')} key={s.id}>
                <input type="radio" name="shipping" checked={area === s.id} onChange={() => setArea(s.id)} />
                <span><strong>{s.label}</strong><small>{s.note}</small></span>
                <span className="price">
                  {shipping.freeAbove > 0 && subtotal >= shipping.freeAbove ? 'Free' : 'BDT ' + money2(s.price)}
                </span>
              </label>
            ))}
            <p className="form-note">Select the delivery area that matches your address.</p>

            {enabledPayments.length > 0 && (
              <>
                <h2 className="form-title" style={{ fontSize: 'var(--fs-2xl)', marginTop: 'var(--sp-7)' }}>
                  <Icon.check /> Payment Method
                </h2>
                {enabledPayments.map((type) => (
                  <label className={'opt-row' + (payment === type ? ' is-active' : '')} key={type}>
                    <input type="radio" name="payment" checked={payment === type} onChange={() => setPayment(type)} />
                    <span><strong>{type}</strong><small>{type === 'Cash On Delivery' ? 'Pay when your order arrives' : 'Pay securely online'}</small></span>
                  </label>
                ))}
              </>
            )}
          </div>
        </div>

        <aside>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="summary-head">Order Summary</div>
            <div className="card__body">
              {items.map((i) => (
                <div className="order-line" key={i.key}>
                  <div>
                    {i.name}
                    <LineDetail item={i} className="order-line-meta" />
                    <small>Qty {i.qty}</small>
                  </div>
                  <div>BDT {money2(i.total_price)}</div>
                </div>
              ))}
              <div className="divider" />
              <div className="summary-row"><span>Subtotal</span><strong>BDT {money2(applied?.sub_total ?? subtotal)}</strong></div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>BDT {money2(applied?.shipping_charge ?? shippingCharge)}</strong>
              </div>
              {discount > 0 && (
                <div className="summary-row"><span>Discount</span><strong>− BDT {money2(discount)}</strong></div>
              )}
              <div className="divider" />
              <div className="summary-row" style={{ fontSize: 'var(--fs-xl)' }}>
                <strong>Total</strong><strong>BDT {money2(grandTotal)}</strong>
              </div>
            </div>

            {features.is_coupon && (
              <div className="coupon-box">
                <h5>Have a coupon code?</h5>
                {applied ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{coupon.toUpperCase()}</span>
                    <button type="button" className="link-reset" onClick={removeCoupon}>Remove</button>
                  </div>
                ) : (
                  <div className="coupon-row">
                    <input className="input" placeholder="Enter code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    <button className="btn btn--dark" type="button" onClick={applyCoupon} disabled={couponBusy}>
                      {couponBusy ? '…' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <div className="review-form__error">{couponError}</div>}
              </div>
            )}

            <div className="card__body">
              <button className="btn btn--primary btn--block btn--lg" type="submit" disabled={placing}>
                <Icon.check width="18" height="18" /> {placing ? 'Placing order…' : 'Place Order'}
              </button>
            </div>
          </div>
        </aside>
      </form>

      <OtpModal
        open={otpOpen}
        phone={form.phone}
        onClose={() => setOtpOpen(false)}
        onVerified={() => { setOtpOpen(false); setOtpDone(true); placeOrder(); }}
      />
    </div>
  );
}
