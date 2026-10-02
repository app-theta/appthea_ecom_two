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
  chat: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.9 8.9 0 0 1-3.9-.9L3 20.5l1.6-4.6a8 8 0 0 1-1.1-4.4A8.4 8.4 0 0 1 12 3.2a8.4 8.4 0 0 1 9 8.3Z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth="2.6" /></svg>,
  send: (p) => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}><path d="M3.4 20.4 21 12 3.4 3.6l-.1 6.6L15 12 3.3 13.8z" /></svg>,
  clip: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="m21 11.5-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l8.9-8.9a3.7 3.7 0 0 1 5.2 5.2l-8.9 8.9a1.8 1.8 0 0 1-2.6-2.6l8.2-8.2" /></svg>,
  expand: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" /></svg>,
  receipt: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6" /></svg>,
  file: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>,
  shop: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><path d="M4 10v10h16V10" /><path d="M2.5 10 4.5 4h15l2 6a3 3 0 0 1-5.8 0 3 3 0 0 1-5.4 0 3 3 0 0 1-5.8 0Z" /><path d="M10 20v-5h4v5" /></svg>,
  block: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></svg>,
  checkAll: (p) => <svg viewBox="0 0 24 24" {...s} strokeWidth="2" {...p}><path d="m2 13 4 4 8-9M10 17l1 1 10-11" /></svg>,
  smile: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" strokeWidth="2.2" /></svg>,
  messenger: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C6.3 2 2 6.2 2 11.5c0 2.9 1.3 5.5 3.4 7.2V22l3.2-1.8c.9.3 1.9.4 3 .4 5.7 0 10-4.2 10-9.5S17.7 2 12 2Zm1 12.3-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7Z" /></svg>,
  facebook: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a10 10 0 1 0-1.2 20v-7H8.4V12h2.4v-1.9c0-2.4 1.4-3.7 3.5-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 12 2Z" /></svg>,
  instagram: (p) => <svg viewBox="0 0 24 24" {...s} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>,
  x: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path fillRule="evenodd" clipRule="evenodd" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  twitter: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path fillRule="evenodd" clipRule="evenodd" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="4.983" cy="5.009" r="2.188" />
      <path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.702-5.783-4.522-5.783-1.835 0-3.064 1.007-3.567 1.96h-.051v-1.66H9.237zm-6.142 0H6.86v12.139H3.095z" />
    </svg>
  ),
  youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  whatsapp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.2.301-.778.979-.954 1.18-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.508-.678-.518-.176-.008-.377-.01-.578-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.512s1.079 2.913 1.23 3.114c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.229 1.377.197 1.896.12.578-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352zM12.042 2C6.52 2 2.03 6.488 2.03 12c0 1.99.585 3.844 1.597 5.408L2 22l4.742-1.57A9.957 9.957 0 0 0 12.042 22C17.564 22 22 17.512 22 12s-4.436-10-9.958-10z" />
    </svg>
  ),
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
