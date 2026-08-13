# Metafield and metaobject definitions

Store: `purelane-joazssp6.myshopify.com`

Create these in **Settings → Custom data** (or run `node scripts/seed-from-cli.mjs` with a Shopify CLI session, which also publishes products to the Online Store channel).

## Product metafields

| Namespace | Key | Type | Used by |
|---|---|---|---|
| `custom` | `badge` | Single line text | Shop cards (Best seller / Top rated / New) |
| `custom` | `short_benefit` | Single line text | Combo stack captions |
| `custom` | `components` | List of product references | Combo contents |
| `custom` | `flag` | Single line text | Combo corner flag (Most popular / Best value) |
| `custom` | `save_label` | Single line text | Combo save pill |
| `custom` | `highlight` | True/false | Emphasised combo card |
| `custom` | `sold_out` | True/false | Force sold-out card when inventory scope is unavailable |
| `reviews` | `rating` | Decimal | Shop card star rating |
| `reviews` | `rating_count` | Integer | Shop card review count |

`reviews.rating` / `reviews.rating_count` use the namespace Shopify product-review apps already expect, so a reviews app can take over later without a theme change.

## Metaobject: `review`

Shopify has no native storefront review object. Definition:

| Field | Type |
|---|---|
| `title` | Single line text |
| `quote` | Multi-line text |
| `author` | Single line text |
| `product_label` | Single line text |
| `rating` | Integer 1–5 |
| `verified` | True/false |

The reviews section is merchant-editable with **blocks** today (so the homepage is complete without waiting on metaobject entries). Point the same copy at `review` entries when you want one source of truth across the site.

## Mix-and-match bundle prices

Tiers “any 2 / 3 / 5” are not a native product field. They are represented as:

1. Offer products `build-a-box-2`, `build-a-box-3`, `build-a-box-5` (price + compare-at live on the product).
2. Theme editor blocks that pick those products plus a feature list.
3. Automatic discounts on collection `build-a-box` (create in **Discounts**): Buy 2 → ₹349, Buy 3 → ₹499, Buy 5 → ₹799.

CTAs scroll to `#shop` so the marketing team can change the offer without a developer.
