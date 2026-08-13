# Build notes — Purelane homepage

Dev store: `https://purelane-joazssp6.myshopify.com`  
Password: sent separately in the submission email (not in this repo).  
Theme: stock **Dawn 16.0.0** with custom Purelane sections. Horizon remains in the theme library unused.

## What I’d flag in the original file

- The shop grid **duplicates the same four products** with two different image techniques. We render eight unique live products instead.
- Product “photos” are CSS `background-image` data-URIs and inline SVGs, not images. Bad for LCP, caching, and Shopify media.
- Duplicate SVG `id`s (`cg`, `wf`, shop-card gradient ids) make the file invalid when more than one graphic is on the page.
- `feTurbulence` water filters are expensive on main thread / GPU. We kept them because they are the mint/teal look of the file; they are disabled under `prefers-reduced-motion`.
- Reveal animation uses `filter: blur()` which is a paint cost. Honoured, but disabled under `prefers-reduced-motion`.
- Prices, ratings, and copy are hardcoded. A marketing team could not run this.
- Marquee duplicates markup (correct pattern) but the duplicate set was not `aria-hidden`.
- Global `*` reset and unscoped classes would collide with Dawn.
- Google Fonts were render-blocking; we still load Outfit + Inter (required for the match) with `display=swap` and preconnect. Self-hosting woff2 is the next performance step.

## What we changed in the code, and why

- **Dawn, not Horizon.** New stores ship Horizon. The brief asked for stock Dawn so the review is of our sections, not Shopify’s new block framework. Dawn is pushed as a second theme and published.
- **Scoped CSS** under `body.purelane-home`. Pixel values copied from the prototype (px, not Dawn rems).
- **Real `<img>`** for bottles, with product featured media when present and theme SVG assets as fallback.
- **Section schemas + blocks** for every string a merchant would want to change.
- **Live product data** for titles, prices, compare-at, availability, and media.
- **ATC** posts to `/cart/add.js` and updates the cart count.
- **Theme editor survival:** JS listens for `shopify:section:load` / `unload`; empty states if products/blocks are removed; unique water SVG ids.
- **Accessibility:** skip link kept, `:focus-visible` from the spec, marquee pauses on hover/focus, reduced-motion kills autoplay, parallax, ticker, and blur reveals.
- **Combo cards** share `purelane-card-combo`; shop cards share `purelane-card-product`; prices share `purelane-price`.

## QA (375px+ / editor / CWV)

Live theme **Purelane Dawn** `#190907154796`. Horizon `#190905745772` stays unpublished.

Checked against the HTML spec and the password-gated storefront:

- Section order matches the file: hero → reviews → combos → bundles → shop (bonus sections omitted).
- Hero padding `150px` / `132px` at 900px, tokens (`--ink #17102b`), glass, type, and reduced-motion CSS/JS.
- First `theme push` ran **before** the catalog existed, so Shopify dropped `product` / `product_list` handles from `index.json`. `productCreate` also left `publishedAt` null (ACTIVE but not on the Online Store channel). Sections fall back to `all_products[handle]` when a picker is empty; seed now publishes via the 2023-10 `productUpdate(published: true)` mutation.
- Reviews: duplicate marquee set is `aria-hidden` only on the second pass (`0` is truthy in Liquid — do not pass `index0`).
- Shop fixtures: unique products (no prototype duplication), fabric conditioner has no image, magic eraser is sold out via `custom.sold_out`, long-title SKU is line-clamped to two lines. Variants use `inventoryPolicy: CONTINUE` because the CLI session cannot write inventory quantities.
- Theme editor: `shopify:section:load` / `unload` tears down hero timers; atmosphere lives in the layout so reordering the five sections cannot kill the background.
- CWV: no `feTurbulence`, no page-wide `backdrop-filter`, fonts `display=swap` + preconnect. Remaining cost is Google Fonts CSS (self-host next) and hero PNGs.

Automatic mix-and-match discounts were **not** created (CLI session has no discounts scope). Offer products `build-a-box-2/3/5` carry the tier prices; merchants can add Buy X → ₹Y in **Discounts**.

## Gaps / what I’d do with more time

- Seed product PNGs and metafields through a custom app token (script is in `scripts/seed-catalog.mjs`) and wire collection-level automatic discounts for mix-and-match.
- Self-host Outfit/Inter as woff2; convert remaining SVG bottles to WebP.
- Add the bonus prototype sections (ingredients, proof, range, footer, sticky CTA) on the same tokens.
- Keyboard-operable combo rail (prev/next buttons) in addition to swipe.
- Visual regression screenshots at 375 / 768 / 1180 against the HTML file.
- Storefront password page styled to match (currently Dawn’s password template).
