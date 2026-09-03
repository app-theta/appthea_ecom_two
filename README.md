# AppTheta — React storefront

Vite + React 18 + React Router. Fully dynamic: every product, collection,
order, transaction and wishlist item is rendered from data in `src/data/`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Design tokens

Every colour, font family, font size, spacing step and radius lives in
`:root` at the top of `src/styles/style.css`. Change a value there and the
whole app follows — no component hardcodes a colour or a px font size.

Font scale: `--fs-3xs` (12px) through `--fs-9xl` (40px).

## Structure

```
src/
  main.jsx                app entry + router
  App.jsx                 routes
  styles/style.css        all tokens + all styles
  data/
    products.js           products, collections, offers, shipping, images
    account.js            demo orders, refunds, wallet, wishlist, user
  context/CartContext.jsx cart state (localStorage) + drawer/modal/search UI state
  components/             Header, Nav, Footer, ProductCard, QuickView,
                          CartDrawer, SearchPanel, MobileMenu, Toast, Icons...
  pages/                  Home, Shop, ProductDetails, Cart, Checkout,
                          Login, Register
  pages/account/          Overview, Orders, Refund, Wallet, Wishlist, DeleteAccount
```

## Images

Demo photos come from Unsplash via the `img()` helper in
`src/data/products.js`. Point that helper at your own files to switch:

```js
export const img = (name) => `/images/${name}.jpg`;
```

Product cards use `images[0]` and swap to `images[1]` on hover.

## Cart

`CartContext` persists to `localStorage` under the key `AppTheta_cart`.
Add to cart from a product card (quick view modal), the product page, or
programmatically with `const { addItem } = useCart()`.
