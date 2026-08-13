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

- [docs/BUILD_NOTES.md](docs/BUILD_NOTES.md)
- [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md)
- [docs/METAFIELDS.md](docs/METAFIELDS.md)
