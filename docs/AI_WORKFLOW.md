# AI workflow notes

This build was done in Cursor with an agent (Composer). That is how I normally work on Shopify section work: the design file is the spec, I write the Liquid/CSS with the agent, and I refuse to let the model redesign anything.

## What I delegated

- Extracting the prototype’s base64 bottle SVGs and rasterising them to PNG.
- First pass of scoped CSS transcribed from the HTML (tokens, glass, type, hero, cards, marquee, combos, tiers).
- Section schema boilerplate and `index.json` wiring.
- Atmosphere SVG (keep `feTurbulence`; unique `pl-*` filter ids).
- Catalog seed script / metafield inventory.
- A computed-style gate (`scripts/spec-diff.mjs`) so pixel-match is a table, not a screenshot argument.

## Where it failed me

- **Shopify CLI 4.x** needed a newer Node than 22.2. I pinned CLI 3.84.1. An agent that “just upgrades the world” would have burned time.
- **Horizon vs Dawn.** The store shipped Horizon. Building on the live theme would have failed the brief. Dawn is a second, published theme.
- **Liquid truthiness.** Empty product drops are truthy; `0` is truthy. `{% if product %}` and `duplicate: index0` both hid real UI. I had to correct both.
- **Cascade, not tokens.** Version 2 mint CSS appended with weaker selectors lost to `body.purelane-home` Version 1. The live store stayed lilac until V2 values were written into the original selectors.
- **Dawn `div:empty`.** Mint scene layers are empty divs. Dawn hides them. Computed style still showed the mint gradient; pixels were lavender. Agents trust computed style; humans (and a screenshot sampler) caught it.
- **Shop bottles as CSS backgrounds.** They match the file in isolation and collapse to 0×0 in Dawn’s grid. Switched to `<img>` + `asset_url`.
- **Push-then-seed order.** `index.json` product handles were stripped because the catalog did not exist yet. `productCreate` in 2024-10 does not publish to Online Store.
- **Zero inventory = every card sold out.** `inventoryPolicy: CONTINUE` plus `custom.sold_out` on Magic Eraser.
- **`write_discounts` denied** on the CLI session. Collection `build-a-box` was created; the ₹499 automatic discount still needs one Admin click.
- Pixel match still needs a human eye at 375px. Agents are confident and wrong about spacing.

## What I’d systematise for twenty more of these

1. **A “prototype → Dawn sections” playbook:** tokens file, atmosphere snippet, card snippets, one JS controller with editor events, `index.json` order.
2. **A spec linter** (`scripts/spec-diff.mjs`): dump computed styles from the HTML at 375/1440 and diff against the live theme. That is the pixel-accuracy gate.
3. **A catalog seed recipe:** metafields + PNG naming + publish to Online Store + `inventoryPolicy: CONTINUE` + “one sold out / one no-image / one long title” baked in + a `build-a-box` collection.
4. **CLI pin + Node pin** in the repo so Partner-store bring-up is not a 20-minute debug.
5. **Never let the model restyle.** Prompt: “the HTML is the spec; only change semantics, a11y, performance, breakpoints.”
6. **Commit slices that match the brief** (hero, shop, combos…) so a reviewer can see what was chosen and what was cut.
