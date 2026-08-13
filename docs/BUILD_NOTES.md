# Build notes — Purelane homepage

Dev store: `https://purelane-joazssp6.myshopify.com`  
Password: sent only in the submission email (not in this repo).  
Theme: stock **Dawn 16.0.0**, live theme **Purelane Dawn** `#190907154796`. Horizon `#190905745772` stays unpublished.

## What I’d flag about the original file

- Shop grid **duplicates the same four products** twice: first with CSS-background bottles, then with labelled inline SVGs. We render **eight unique live products** instead (the seed fixtures the brief asked for).
- Product “photos” are CSS `background-image` data-URIs and empty `<span>`s. In Dawn, `div:empty { display: none }` and grid min-size collapse those spans to **0×0**, which is why shop cards went blank. Wrong for LCP, caching, and Shopify media.
- Duplicate SVG `id`s (`cg`, `wf`, shop-card gradient ids) make the file invalid when more than one graphic is on the page.
- Two stacked stylesheets: Version 1 (dark cinematic geometry) then Version 2 (mint ground, dark ink, teal buttons). Version 2 is what the file *renders*. Shipping V1 colours is a miss.
- `feTurbulence` water and `filter: blur()` reveals are expensive. They *are* the look, so we kept them and kill them under `prefers-reduced-motion`.
- Prices, ratings, and copy are hardcoded. A marketing team could not run this.
- Marquee duplicates markup (correct pattern) but the clone set was not `aria-hidden`.
- Global `*` reset and unscoped classes would collide with Dawn.
- Google Fonts are render-blocking. We still load Outfit + Inter (required for the match) with `display=swap` + preconnect, homepage only.

## What we changed in the code, and why

Visual output stays the file. The HTML/CSS underneath does not, where it was wrong for production.

### Semantics, a11y, breakpoints

- Landmarks: `h1` in hero, `h2` per section, cards as `<article>`. ATC is `<button type="button">`. Product titles are links.
- Review marquee clone is `aria-hidden` on pass 2 only. Liquid `0` is truthy — do not pass `forloop.index0`.
- `:focus-visible`, skip link, drawer `aria-expanded`. Marquee pauses on hover and `:focus-within`.
- Reduced motion: no hero autoplay, ticker, marquee, blur reveals, or water parallax.
- Breakpoints copied from the file (`900px` hero, `760px` type), not Dawn’s rem grid. Type stays px.

### CSS that would not survive Dawn

- All rules scoped `body.purelane-home`. Geometry from V1, **Version 2 mint palette** written into those same selectors (an appended V2 blob loses to higher-specificity V1).
- `body.purelane-home.gradient { background: transparent !important }` so Dawn scheme colour cannot paint the homepage.
- Dawn `div:empty { display: none }` hid `.s1–.s4` and `.vig`. Forced `display: block` — without it the mint scenes never paint and the page stays lilac.
- Shop bottles are real `<img src="{{ 'p-tap.svg' | asset_url }}">` via `purelane-pimg`. CSS-background spans look like the file in isolation and disappear in Dawn.

### Data (not Liquid hardcoding)

- Shop / combos: live products, prices, compare-at, inventory, metafields.
- Bundles: offer products `build-a-box-2/3/5` as the price source; feature lists in editor blocks.
- Reviews: theme-editor blocks. Metaobject `review` is defined for later.
- Every string a marketer would change is in section schema.

### Reuse

`purelane-card-product`, `purelane-card-combo`, `purelane-card-tier`, `purelane-card-review`, shared `purelane-price` / `purelane-money`.

### Theme editor

`purelane.js` inits per root and listens for `shopify:section:load` / `unload`. Atmosphere lives in the layout, so reordering the five sections cannot kill the water. Empty product pickers fall back to `all_products[handle]` (empty product drops are truthy — we check `.handle`).

### Seed fixtures the brief asked for

- Eight+ singles plus combos and offer products.
- **Sold out:** Magic Eraser (`custom.sold_out`) — inventory CLI cannot write quantities.
- **No image:** Fabric conditioner has no featured media and no bottle mapping. The card still has title, price, and ATC; the shot is a dashed “No image” well so it reads as a fixture, not a broken image.
- **Long title:** descaler tablets, line-clamped to two lines.

### Performance

Kept (they are the look): `feTurbulence`, glass `backdrop-filter`, Outfit + Inter.  
Changed: reduced-motion kill-switch; fonts `display=swap` + preconnect, index-only CSS/JS; lazy product `<img>`.  
Still expensive: turbulence + backdrop-filter + Google Fonts CSS. Self-host woff2 next.

## QA

Checked against the HTML (Version 2) at 1440 and 375: mint ground, white-on-green waves, frosted white glass, teal Shop Now, dark navy type. Gate: `node scripts/spec-diff.mjs` → [SPEC_DIFF.md](SPEC_DIFF.md).

## Gaps / what I’d do with more time

- **Discounts:** collection `build-a-box` is live. CLI has no `write_discounts`. One Admin click creates “Any 3 for ₹499” — see [DISCOUNTS.md](DISCOUNTS.md). Exclusive 2/3/5 tiers need a Discount Function.
- Keyboard prev/next on the combo rail (swipe works today).
- Self-host Outfit/Inter as woff2; convert bottles to WebP.
- Theme-editor Loom and password page styled to match.
- India shipping zone. The Partner store’s only market ships to **US**; the storefront country is **IN**, so `/cart/add` returned 422 “sold out” until variants were untracked and set `requiresShipping: false`. Proper fix is Settings → Shipping (and Markets) → India.
- Exclusive 2/3/5 mix-and-match as a Discount Function, not stacked automatic minimums.

## Production fixes after first live pass

- Dawn `a:empty { display: none }` collapsed the side rail to 0×0. Links now contain a span; `.rail a { display: block }`.
- Homepage `<title>` is `Purelane — Plant-based homecare` (the HTML file). Shopify was serving shop name only.
- Cart badge reads `cart.js` on load / pageshow / visibility, and hides when empty, so emptying the cart no longer leaves a stale count.
