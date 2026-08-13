# Purelane — Dawn homepage

Stock [Dawn 16](https://github.com/Shopify/dawn) plus five merchant-editable sections that reproduce [`purelane-homepage.html`](https://troopodaiengineerassignment.pages.dev/).

## Sections

1. `purelane-hero` — `section.hero`
2. `purelane-reviews` — `#reviews`
3. `purelane-combos` — `#combos`
4. `purelane-bundles` — `#bundles`
5. `purelane-shop` — `#shop`

Supporting: `purelane-header`, `purelane-atmosphere`, shared card snippets.

## Local

```bash
shopify theme push --store purelane-joazssp6.myshopify.com --unpublished --theme "Purelane Dawn"
```

Seed catalog: import `seed/products.csv` in **Products → Import**, then set metafields from [docs/METAFIELDS.md](docs/METAFIELDS.md).

## Docs

- [docs/BUILD_NOTES.md](docs/BUILD_NOTES.md) — flags, production fixes, gaps
- [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) — what the agent did and where it failed
- [docs/METAFIELDS.md](docs/METAFIELDS.md) — custom data
- [docs/DISCOUNTS.md](docs/DISCOUNTS.md) — mix-and-match (collection live; Admin click for ₹499)
- [docs/SPEC_DIFF.md](docs/SPEC_DIFF.md) — HTML vs live computed-style gate (`node scripts/spec-diff.mjs`)
- [docs/SUBMISSION_EMAIL.md](docs/SUBMISSION_EMAIL.md) — email to nj@troopod.io
