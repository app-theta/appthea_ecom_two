/* ==========================================================================
   Demo catalogue. Swap `img()` for your own paths to use local photos:
     export const img = (name) => `/images/${name}.jpg`;
   ========================================================================== */

const PHOTOS = {
  panjabi: ['1610652492500-ded49ceeb378', '1622470953794-aa9c70b0fb9d', '1603252109303-2751441dd157', '1617137968427-85924c800a22', '1583391733956-3750e0ff4e8b', '1598554747436-c9293d6a588f'],
  shirts: ['1596755094514-f87e34085b2c', '1602810318383-e386cc2a3ccf', '1620799140408-edc6dcb6d633', '1618354691373-d851c5c3a990', '1603252109360-909baaf261c7', '1607345366928-199ea26cfe3e'],
  't-shirts': ['1521572163474-6864f9cf17ab', '1594633312681-425c7b97ccd1', '1503341504253-dff4815485f1', '1576566588028-4147f3842f27', '1583743814966-8936f5b7be1a', '1622445275576-721325763afe'],
  polo: ['1586790170083-2f9ceadc732d', '1571945153237-4929e783af4a', '1613852348851-df1739db8201', '1552374196-c4e7ffc6e126', '1589310243389-96a5483213a8', '1600185365483-26d7a4cc7519'],
  'winter-collections': ['1551028719-00167b16eac5', '1578681994506-b8f463449011', '1544022613-e87ca75a784a', '1614495039153-8d1a1de0e0f7', '1547624643-3bf761b09502', '1608063615781-e2ef8c9d4b1a'],
  'bell-bottom-pants': ['1624378439575-d8705ad7ae80', '1473966968600-fa801b869a1a', '1542272604-787c3835535d', '1560243563-062bfc001d68', '1551854838-212c50b4c184', '1594938298603-c8148c4dae35'],
  trousers: ['1473966968600-fa801b869a1a', '1624378439575-d8705ad7ae80', '1542272604-787c3835535d', '1594938298603-c8148c4dae35', '1551854838-212c50b4c184', '1506629082955-511b1aa562c8'],
  accessories: ['1553062407-98eeb64c6a62', '1524805444758-089113d48a6d', '1523170335258-f5ed11844a49', '1547949003-9792a18a2601', '1611923134239-b9be5816e23c', '1509941943102-10c232535736'],
  shoes: ['1549298916-b41d501d3772', '1542291026-7eec264c27ff', '1595950653106-6c9ebd614d3a', '1460353581641-37baddab0fa2', '1600269452121-4f2416e55c28', '1608231387042-66d1773070a5'],
  hero: ['1441986300917-64674bd600d8', '1483985988355-763728e1935b', '1445205170230-053b83016050']
};

export const img = (id, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const pick = (bucket, i, w, h) => {
  const list = PHOTOS[bucket] || PHOTOS.panjabi;
  return img(list[i % list.length], w, h);
};

export const STORE = {
  name: 'AppTheta',
  phone: '+880 1601-828841',
  email: 'hello@AppTheta.com',
  address: 'Shop no 47, Latif Emporium Shopping Complex, 2nd floor, Rajlakkhi, Uttara',
  marquee: 'Visit our flagship outlet at Uttara'
};

export const HERO_SLIDES = PHOTOS.hero.map((id, i) => ({
  id: 'slide-' + i,
  image: img(id, 1920, 900),
  alt: 'AppTheta campaign ' + (i + 1)
}));

export const COLLECTIONS = [
  { slug: 'panjabi', name: 'Panjabi' },
  { slug: 'shirts', name: 'Shirts' },
  { slug: 't-shirts', name: 'T-Shirts' },
  { slug: 'winter-collections', name: 'Winter Collections' },
  { slug: 'polo', name: 'Polo' },
  { slug: 'bell-bottom-pants', name: 'Bell Bottom Pants' },
  { slug: 'trousers', name: 'Trousers' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'shoes', name: 'Shoes' }
].map((c, i) => ({ ...c, image: pick(c.slug, 0, 900, 1100) }));

export const CATEGORY_COPY = {
  panjabi: 'Celebrate tradition with our collection of Panjabi outfits, made for festive occasions and cultural celebrations. Crafted from high-quality fabrics with intricate patterns and comfortable fits, each piece balances heritage and ease.',
  shirts: 'Everyday shirting built on breathable fabrics and clean cuts. Relaxed collars, considered proportions and colours that carry from the office to the weekend.',
  't-shirts': 'Soft cotton tees in a fit that holds its shape wash after wash. Simple graphics, honest fabric and colours picked to layer with everything you own.',
  'winter-collections': 'Hoodies, sweatshirts and jackets made for Dhaka winters. Heavier knits, brushed interiors and finishes that stay sharp all season.',
  polo: 'The polo, refined. Stretch cotton pique, ribbed collars and a fit that sits neatly between casual and dressed up.',
  'bell-bottom-pants': 'Wide-leg silhouettes with a clean high rise. Structured drape, easy movement and a shape that lengthens every look.',
  trousers: 'Tailored and casual trousers cut for comfort, in neutral tones that pair with the whole wardrobe.',
  accessories: 'The finishing details — belts, caps, bags and small leather goods chosen to complete the outfit.',
  shoes: 'Footwear made for long days, with cushioned soles and uppers that break in fast and last.'
};

const RAW = [
  ['Embo Seoul Katua - Mint', 'panjabi', 1850, 1990, { isNew: true }],
  ['Embo Seoul Katua - Sky', 'panjabi', 1850, 1990, { isNew: true }],
  ['Embo Seoul Katua - Cream', 'panjabi', 1850, 1990, { isNew: true }],
  ['Floral Embo Katua - Paste', 'panjabi', 1850, 1990, { isNew: true }],
  ['Embo Seoul Katua - Olive', 'panjabi', 1850, 1990, { isNew: true }],
  ['Floral Embo Katua - Sand', 'panjabi', 1850, 1990, { isNew: true }],
  ['Embo Seoul Katua - Ash', 'panjabi', 1850, 1990, { isNew: true }],
  ['Floral Embo Katua - Rose', 'panjabi', 1850, 1990, { isNew: true }],
  ['Faris | Designer Panjabi', 'panjabi', 2940, 4200, { soldOut: true }],
  ['Faris Noir | Designer Panjabi', 'panjabi', 2940, 4200, {}],
  ['Eco Noor | Eid Panjabi', 'panjabi', 2555, 3650, {}],
  ['Eco Noor Ivory | Eid Panjabi', 'panjabi', 2555, 3650, {}],
  ['Nawab Prestige | Panjabi', 'panjabi', 2555, 3650, {}],
  ['Nawab Heritage | Panjabi', 'panjabi', 2555, 3650, { outOfStockSizes: ['L'] }],
  ['Nawab Royale | Panjabi', 'panjabi', 2555, 3650, {}],
  ['Sarfaraz | Designer Panjabi', 'panjabi', 3150, 4500, {}],
  ['Sarfaraz Onyx | Designer Panjabi', 'panjabi', 3150, 4500, { soldOut: true }],
  ['Glowline Eid | Panjabi', 'panjabi', 2233, 3190, {}],
  ['Essential Polo - Off White', 'polo', 1290, null, { colors: [{ name: 'Lavender', hex: '#c9b6f5' }, { name: 'Off White', hex: '#f6f2e9' }], outOfStockSizes: ['L'] }],
  ['Essential Polo - Lavender', 'polo', 1290, null, { colors: [{ name: 'Lavender', hex: '#c9b6f5' }, { name: 'Off White', hex: '#f6f2e9' }] }],
  ['Signature Contrast Polo', 'polo', 1290, null, {}],
  ['Signature Rib Polo', 'polo', 1390, 1590, {}],
  ['Gutter Lab Polo - Black', 'polo', 1390, 1590, {}],
  ['Gutter Lab Polo - Sand', 'polo', 1390, 1590, {}],
  ['Oversized Cuban Shirt', 'shirts', 1690, 1990, {}],
  ['Linen Blend Shirt - Khaki', 'shirts', 1790, 2190, {}],
  ['Denim Shirt - Indigo', 'shirts', 1890, 2290, {}],
  ['Utility Shirt - Cream', 'shirts', 1750, 2100, {}],
  ['Grateful Nothing Tee', 't-shirts', 890, 1090, {}],
  ['Classic Heavy Tee - Black', 't-shirts', 790, 990, {}],
  ['444 Varsity Tee', 't-shirts', 950, 1190, {}],
  ['Boxy Fit Tee - Sage', 't-shirts', 850, 1050, {}],
  ['Panelled Hoodie - Camel', 'winter-collections', 2290, 2890, {}],
  ['Sherpa Jacket - Off White', 'winter-collections', 2790, 3390, {}],
  ['Track Set - Black', 'winter-collections', 2490, 2990, {}],
  ['Zip Sweatshirt - Grey', 'winter-collections', 1990, 2490, {}],
  ['Bell Bottom Pant - Ivory', 'bell-bottom-pants', 1590, 1890, {}],
  ['Bell Bottom Pant - Black', 'bell-bottom-pants', 1590, 1890, {}],
  ['Wide Leg Trouser - Stone', 'trousers', 1690, 1990, {}],
  ['Pleated Trouser - Charcoal', 'trousers', 1790, 2090, {}],
  ['Woven Belt - Tan', 'accessories', 690, 890, { sizes: ['32', '34', '36'] }],
  ['Ribbed Cap - Cream', 'accessories', 590, 750, { sizes: ['One Size'] }],
  ['Leather Sandal - Brown', 'shoes', 1990, 2490, { sizes: ['40', '41', '42', '43'] }],
  ['Loafer - Black', 'shoes', 2490, 2990, { sizes: ['40', '41', '42', '43'] }]
];

export const PRODUCTS = RAW.map(([name, category, price, oldPrice, opts], i) => {
  const images = [0, 1, 2, 3, 4].map((n) => pick(category, i + n, 800, 1000));
  return {
    id: 'p' + (i + 1),
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name,
    category,
    price,
    oldPrice,
    discount: oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0,
    sizes: opts.sizes || ['M', 'L', 'XL'],
    outOfStockSizes: opts.outOfStockSizes || [],
    soldOut: !!opts.soldOut,
    colors: opts.colors || [],
    isNew: !!opts.isNew,
    images
  };
});

export const OFFERS = [
  { text: 'Spend BDT 2,399 and get BDT 310 off', code: 'GET310' },
  { text: 'Buy 3, save BDT 399 + free delivery', code: 'SAVEMORE' },
  { text: 'First order? Take BDT 150 off', code: 'WELCOME150' }
];

export const SHIPPING = [
  { id: 'inside', label: 'Inside Dhaka', note: 'Delivery in 24-48 hours', price: 70 },
  { id: 'sub', label: 'Dhaka Sub Areas', note: 'Tongi, Gazipur, Savar, Keraniganj, Narayanganj', price: 100 },
  { id: 'outside', label: 'Outside Dhaka', note: 'Delivery in 2-4 business days', price: 130 }
];

export const FEATURES = [
  { icon: 'users', text: '70,000+ satisfied customers' },
  { icon: 'pin', text: '64 districts reached' },
  { icon: 'truck', text: 'Ships within 12-48 hours' }
];

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'Clothing',
    to: '/shop',
    children: ['panjabi', 'shirts', 't-shirts', 'polo', 'bell-bottom-pants', 'trousers']
  },
  { label: 'Accessories', to: '/shop/accessories' },
  { label: 'Shoes', to: '/shop/shoes' },
  { label: 'Winter', to: '/shop/winter-collections' }
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const getCollection = (slug) => COLLECTIONS.find((c) => c.slug === slug);
export const money = (n) => Number(n).toLocaleString('en-US');
export const money2 = (n) => Number(n).toFixed(2);
