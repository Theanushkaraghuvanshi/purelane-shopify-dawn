# Mix-and-match discounts

CLI sessions on this store **cannot write discounts** (`write_discounts` is denied). The collection is live. Finish the ticker offer in Admin.

## Already in the store

- Collection **Build a box** — handle `build-a-box`, id `643107619180`
- Contains every **single** SKU (not combos, not `build-a-box-2/3/5`)
- Bundle cards still read price from offer products `build-a-box-2` / `3` / `5`
- “Build this box” scrolls to `#shop` so the customer mixes real products

## Create “Any 3 for ₹499” (exact clicks)

The screenshot that looks like **Discount code + Percentage + no collection + no minimum** will not produce ₹499. Use this instead:

1. Admin → **Discounts** → **Create discount**
2. Choose **Amount off products**
3. Method: **Automatic discount** (not Discount code). Title: `Any 3 for ₹499`
4. Discount value: **Fixed amount** (not Percentage) → **₹101**  
   Math: 3 × ₹200 − ₹101 = **₹499**
5. Applies to: **Specific collections** → search **Build a box** → add it
6. Eligibility: **All customers**
7. Minimum purchase requirements: **Minimum quantity of items** → **3**
8. Combinations: shipping only is fine
9. **Save**

Proof: add any three singles from Shop. Cart subtotal should be **₹499**.

## Tiers 2 / 5

Same pattern if you want them too. Shopify’s basic automatic discounts are **minimum quantity**, not exclusive tiers. Three overlapping rules will fight; the ₹499 rule is the one the homepage ticker advertises.

| Title | Qty | Amount off | Cart total at ₹200 |
|---|---|---|---|
| Any 2 for ₹349 | 2 | ₹51 | ₹349 |
| Any 3 for ₹499 | 3 | ₹101 | ₹499 |
| Any 5 for ₹799 | 5 | ₹201 | ₹799 |

Exclusive 2/3/5 boxes need a Discount Function — out of scope.

Script that created the collection: `scripts/create-mix-match.mjs`.
