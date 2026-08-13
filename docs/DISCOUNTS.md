# Mix-and-match discounts

CLI sessions on this store **cannot write discounts** (`write_discounts` is denied). The collection **is** live so a reviewer can finish the ticker offer in Admin in under a minute.

## What is already in the store

- Collection **Build a box** — handle `build-a-box`, id `643107619180`
- Contains every single SKU (not combos, not the `build-a-box-2/3/5` offer products)
- Bundle *cards* still read price from offer products `build-a-box-2` / `3` / `5`
- “Build this box” scrolls to `#shop` so the customer mixes real products

## The ticker offer (do this in Admin)

`https://admin.shopify.com/store/purelane-joazssp6/discounts`

1. **Create discount** → Automatic → **Amount off products**
2. Title: `Any 3 for ₹499`
3. Discount value: **₹101** off (3 × ₹200 − ₹101 = **₹499**)
4. Applies to: collection **Build a box**
5. Minimum purchase: **Quantity 3**
6. Combinations: shipping only

Proof: add any three singles from Shop → cart subtotal **₹499**.

## Tiers 2 / 5

Same pattern if you want them too:

| Title | Qty | Amount off | Cart total at ₹200 |
|---|---|---|---|
| Any 2 for ₹349 | 2 | ₹51 | ₹349 |
| Any 3 for ₹499 | 3 | ₹101 | ₹499 |
| Any 5 for ₹799 | 5 | ₹201 | ₹799 |

Shopify’s basic automatic discounts are **minimum quantity**, not exclusive tiers. Three overlapping rules will fight; the ₹499 rule is the one the homepage ticker advertises. Exclusive 2/3/5 boxes need a Discount Function — out of scope for this assignment.

Script that created the collection (and attempted the discount): `scripts/create-mix-match.mjs`.
