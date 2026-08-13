# Purelane — Dawn homepage

Troopod AI Product Engineer assignment. Stock [Dawn 16.0.0](https://github.com/Shopify/dawn) plus merchant-editable sections that reproduce [`purelane-homepage.html`](https://troopodaiengineerassignment.pages.dev/).

**Live:** `https://purelane-joazssp6.myshopify.com` (password in the submission email, not in this repo)

## Sections (the five they asked for)

| Prototype | Section |
|---|---|
| `section.hero` | `sections/purelane-hero.liquid` |
| `#reviews` | `sections/purelane-reviews.liquid` |
| `#shop` | `sections/purelane-shop.liquid` |
| `#combos` | `sections/purelane-combos.liquid` |
| `#bundles` | `sections/purelane-bundles.liquid` |

Bonus sections from the HTML (ingredients, how-it-works, proof, range, why, categories, trust, signup, footer) ship on the same tokens. Chrome: `purelane-header`, `purelane-atmosphere`.

## Docs for reviewers

- [docs/BUILD_NOTES.md](docs/BUILD_NOTES.md) — what was wrong in the file, what we changed, gaps
- [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) — what was delegated, where the agent failed, what to systematise
- [docs/METAFIELDS.md](docs/METAFIELDS.md) — metafield / metaobject definitions
- [docs/DISCOUNTS.md](docs/DISCOUNTS.md) — mix-and-match “any 3 for ₹499”
- [docs/SPEC_DIFF.md](docs/SPEC_DIFF.md) — HTML vs live computed-style gate
- [docs/SUBMISSION_EMAIL.md](docs/SUBMISSION_EMAIL.md) — email to `nj@troopod.io`

## Local

```bash
shopify theme push --store purelane-joazssp6.myshopify.com --theme "Purelane Dawn" --allow-live
```

Catalog seed (CLI session): `node scripts/seed-from-cli.mjs`  
Spec gate: `node scripts/spec-diff.mjs`
