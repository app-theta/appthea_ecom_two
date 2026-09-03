const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Icon = {
  search: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  user: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="12" cy="8.5" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>,
  cart: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2.5l2.6 12.1h11.3l2.1-8.6H6" /></svg>,
  menu: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2" {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>,
  close: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2" {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  chevronDown: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2" {...p}><path d="m6 9 6 6 6-6" /></svg>,
  chevronLeft: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2" {...p}><path d="m15 5-7 7 7 7" /></svg>,
  chevronRight: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2" {...p}><path d="m9 5 7 7-7 7" /></svg>,
  users: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5.5a3 3 0 0 1 0 6" /><path d="M18 14.5a6 6 0 0 1 3.5 5.5" /></svg>,
  pin: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>,
  truck: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M2 6h11v11H2z" /><path d="M13 9h4l3 3.2V17h-7" /><circle cx="6" cy="18.6" r="1.6" /><circle cx="17" cy="18.6" r="1.6" /></svg>,
  trash: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>,
  bag: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>,
  check: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2.4" {...p}><path d="m5 13 4.5 4.5L19 7" /></svg>,
  info: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.6v.6" /></svg>,
  eye: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.6" /></svg>,
  grid: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  box: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M21 8.5 12 4 3 8.5v7L12 20l9-4.5z" /><path d="M3 8.5 12 13l9-4.5M12 13v7" /></svg>,
  refund: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>,
  wallet: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><circle cx="17" cy="14.5" r="1.2" /></svg>,
  heart: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3c0 4.8-7.5 9.4-7.5 9.4Z" /></svg>,
  star: (p) => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}><path d="M12 2.5l2.9 6.9 7.4.6-5.6 4.9 1.7 7.3L12 17.8 5.6 21.7l1.7-7.3-5.6-4.9 7.4-.6L12 2.5Z" /></svg>,
  thumbUp: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Z" /><path d="M7 10l4.5-7a2 2 0 0 1 2 2.2L12.5 9H19a2 2 0 0 1 2 2.4l-1.6 8A2 2 0 0 1 17.4 21H7" /></svg>,
  logout: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>,
  messenger: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C6.3 2 2 6.2 2 11.5c0 2.9 1.3 5.5 3.4 7.2V22l3.2-1.8c.9.3 1.9.4 3 .4 5.7 0 10-4.2 10-9.5S17.7 2 12 2Zm1 12.3-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7Z" /></svg>,
  facebook: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a10 10 0 1 0-1.2 20v-7H8.4V12h2.4v-1.9c0-2.4 1.4-3.7 3.5-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 12 2Z" /></svg>,
  instagram: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>,
  google: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.7 4.7 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a5.9 5.9 0 0 1-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9L6.4 14Z" />
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6A5.9 5.9 0 0 1 12 5.9Z" />
    </svg>
  )
};

export default Icon;
