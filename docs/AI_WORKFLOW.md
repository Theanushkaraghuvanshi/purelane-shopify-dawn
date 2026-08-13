# AI workflow notes

This build was done in Cursor with an agent (Composer). That is how I normally work on Shopify section work: I keep the design file as the spec, I write the Liquid/CSS myself or with the agent, and I refuse to let the model “redesign” anything.

## What I delegated

- Extracting the prototype’s base64 bottle SVGs and rasterising them to PNG.
- First pass of scoped CSS transcribed from the HTML (tokens, glass, type, hero, cards, marquee, combos, tiers).
- Section schema boilerplate and `index.json` wiring.
- Atmosphere SVG simplification (drop `feTurbulence`, keep caustic strokes + shafts + bubbles).
- Seed script / metafield inventory.

## Where it failed me

- **Shopify CLI 4.x** needed a newer Node than 22.2 (`enableCompileCache`). I pinned CLI 3.84.1. An agent that “just upgrades the world” would have burned time.
- **Horizon vs Dawn.** The store shipped Horizon. An agent that built on the live theme would have failed the brief. I kept Dawn as a second, published theme.
- **Liquid `concat` of a product onto an empty array** and **escaped `<br>` in badge labels** — classic “looks right in the prompt, breaks in Shopify”. I had to correct both.
- **Product media:** Shopify will not use SVG as product images. Needed an extra rasterise step the first CSS pass ignored.
- **Theme-editor JS:** a one-shot script from the HTML file would leak timers when sections are removed. I rewrote init/teardown around `shopify:section:load` / `unload`.
- **Push-then-seed order.** `index.json` product handles were stripped because the catalog did not exist yet. Empty Shopify product drops are also *truthy*, so `{% if product %}` hid price fallbacks. `productCreate` in 2024-10 does not publish to Online Store (`publishedAt` stays null), so `all_products` and the storefront stayed empty until a 2023-10 `published: true` update.
- **Liquid `0` is truthy.** Passing `forloop.index0` as `duplicate` marked every review card `aria-hidden`.
- **Zero inventory = every card sold out.** CLI cannot write inventory quantities; `inventoryPolicy: CONTINUE` plus `custom.sold_out` on Magic Eraser is the working fixture.
- Pixel match still needs a human eye at 375px. Agents are confident and wrong about spacing.

## What I’d systematise for twenty more of these

1. **A “prototype → Dawn sections” playbook:** tokens file, atmosphere snippet, card snippets, one JS controller with editor events, `index.json` order. Same skeleton every time.
2. **A spec linter:** dump computed styles from the HTML at 375/768/1180 and diff against the live theme. That’s the pixel-accuracy gate, not screenshots in chat.
3. **A catalog seed recipe:** metafield definitions + CSV + PNG naming convention (`p-{handle}.png`) + publish to Online Store + `inventoryPolicy: CONTINUE` + “one sold out / one no-image / one long title” fixtures baked in.
4. **CLI pin + Node pin** in the repo so Partner-store bring-up is not a 20-minute debug.
5. **Never let the model restyle.** Prompt: “the HTML is the spec; only change semantics, a11y, performance, breakpoints.”
6. **Commit slices that match the brief** (hero, shop, combos…) so a reviewer can see what was chosen and what was cut.
