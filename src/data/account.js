import { PRODUCTS } from './products';

const p = (i) => PRODUCTS[i];

export const USER = {
  name: 'Arif Hossain',
  initial: 'A',
  phone: '+880 1601-828841',
  email: 'arif.hossain@gmail.com',
  memberSince: 'March 2025',
  address: {
    line1: 'House 14, Road 7, Sector 11',
    line2: 'Uttara, Dhaka 1230',
    zone: 'Inside Dhaka — BDT 70 shipping'
  }
};

export const ORDERS = [
  {
    id: '#ZRV-10428', date: '18 Aug 2026', status: 'Shipped', tone: 'info', total: 3770,
    items: [
      { product: p(0), size: 'L', qty: 1 },
      { product: p(24), size: 'M', qty: 1 }
    ],
    actions: ['Track Order', 'Request Refund']
  },
  {
    id: '#ZRV-10391', date: '09 Aug 2026', status: 'Processing', tone: 'pending', total: 1920,
    items: [{ product: p(28), size: 'XL', qty: 1 }],
    actions: ['Cancel Order', 'Invoice']
  },
  {
    id: '#ZRV-10322', date: '27 Jul 2026', status: 'Delivered', tone: 'success', total: 5240,
    items: [
      { product: p(42), size: '42', qty: 1 },
      { product: p(18), size: 'L', qty: 2 }
    ],
    actions: ['Buy Again', 'Write a Review', 'Request Refund']
  },
  {
    id: '#ZRV-10275', date: '12 Jul 2026', status: 'Cancelled', tone: 'danger', total: 1290,
    items: [{ product: p(35), size: 'M', qty: 1 }],
    actions: ['Buy Again']
  }
];

export const REFUNDS = [
  { id: '#RF-2201', order: '#ZRV-10322', reason: 'Wrong size delivered', date: '29 Jul 2026', status: 'Under review', tone: 'pending', amount: 1990 },
  { id: '#RF-2140', order: '#ZRV-10275', reason: 'Damaged item', date: '14 Jul 2026', status: 'Refunded', tone: 'success', amount: 1290 }
];

export const REFUND_REASONS = [
  { value: 'size', title: 'Wrong size delivered', note: 'The size received does not match the order' },
  { value: 'damaged', title: 'Damaged or defective item', note: 'Tear, stain or manufacturing fault' },
  { value: 'described', title: 'Item not as described', note: 'Colour or fabric differs from the listing' },
  { value: 'other', title: 'Other', note: 'Explain in the notes below' }
];

export const REFUND_METHODS = [
  { value: 'wallet', title: 'AppTheta Wallet', note: 'Instant credit, usable on your next order', tag: 'Instant' },
  { value: 'mfs', title: 'bKash / Nagad', note: 'Sent to ' + USER.phone, tag: '3-5 days' }
];

export const REFUND_TIMELINE = [
  { title: 'Request submitted', note: '29 Jul 2026, 4:12 PM', done: true },
  { title: 'Pickup completed', note: '31 Jul 2026, 11:30 AM', done: true },
  { title: 'Quality check', note: 'In progress at the Uttara warehouse', done: false },
  { title: 'Refund issued', note: 'Expected within 2 business days', done: false }
];

export const WALLET = {
  balance: 1250,
  expiring: 'BDT 300 of this expires on 30 Sep 2026',
  stats: [
    { label: 'Added this year', value: 'BDT 4,000', note: 'Across 3 top-ups', icon: 'wallet' },
    { label: 'Refunds received', value: 'BDT 1,290', note: '1 refund settled', icon: 'refund' },
    { label: 'Spent from wallet', value: 'BDT 4,040', note: 'On 4 orders', icon: 'cart' }
  ],
  transactions: [
    { date: '18 Aug 2026', desc: 'Order payment', ref: '#ZRV-10428', type: 'Debit', amount: -1000, balance: 1250 },
    { date: '05 Aug 2026', desc: 'Top-up via bKash', ref: 'TRX-88213', type: 'Credit', amount: 2000, balance: 2250 },
    { date: '29 Jul 2026', desc: 'Festival cashback', ref: 'EID-CASH', type: 'Credit', amount: 250, balance: 250 },
    { date: '16 Jul 2026', desc: 'Refund for cancelled order', ref: '#RF-2140', type: 'Credit', amount: 1290, balance: 1290 },
    { date: '12 Jul 2026', desc: 'Order payment', ref: '#ZRV-10275', type: 'Debit', amount: -1290, balance: 0 }
  ],
  methods: ['bKash', 'Nagad', 'Rocket', 'Card']
};

export const WISHLIST_IDS = ['p1', 'p25', 'p19', 'p33', 'p43', 'p41'];

export const DELETE_REASONS = [
  'I no longer shop here',
  'I had a problem with an order',
  'Too many emails or messages',
  'Privacy concerns',
  'Other'
];
