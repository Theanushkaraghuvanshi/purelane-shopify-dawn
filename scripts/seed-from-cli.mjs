import fs from 'node:fs';

const shop = 'purelane-joazssp6.myshopify.com';
const api = `https://${shop}/admin/api/2024-10/graphql.json`;
const imageBase = 'https://raw.githubusercontent.com/Theanushkaraghuvanshi/purelane-shopify-dawn/main/seed/images';

function cliToken() {
  const cfg = JSON.parse(
    fs.readFileSync(process.env.APPDATA + '/shopify-cli-kit-nodejs/Config/config.json', 'utf8')
  );
  const store = JSON.parse(cfg.sessionStore);
  const apps = store['accounts.shopify.com'].applications;
  const key = Object.keys(apps).find((k) => k.includes(shop));
  if (!key) throw new Error('No CLI session for store');
  return apps[key].accessToken;
}

const token = cliToken();

async function gql(query, variables = {}) {
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const singles = [
  ['tap-cleaner-limescale-remover', 'Tap cleaner & limescale remover', 'p-tap.png', 'Best seller', 'Melts hard water stains', '4.8', 237, 40],
  ['kitchen-cleaner-foaming', 'Kitchen cleaner, foaming', 'p-kitchen.png', 'Best seller', 'Cuts grease instantly', '4.8', 254, 40],
  ['copper-bronze-brass-cleaner', 'Copper, bronze & brass cleaner', 'p-metal.png', 'Top rated', 'Restores shine on metal', '4.8', 231, 40],
  ['washing-machine-cleaner-descaler', 'Washing machine cleaner & descaler', 'p-wm.png', 'New', 'Deep-cleans your machine', '4.8', 183, 40],
  ['dishwash-gel', 'Dishwash gel', 'p-dish.png', '', 'Squeaky clean dishes', '4.8', 190, 40],
  ['floor-cleaner', 'Floor cleaner', 'p-floor.png', '', 'Kills 99.9% germs', '4.8', 210, 40],
  ['toilet-cleaner', 'Toilet cleaner', 'p-toilet.png', '', 'Fights limescale in the bowl', '4.8', 160, 40],
  ['laundry-detergent', 'Laundry detergent', 'p-laundry.png', '', 'Removes tough stains & odour', '4.8', 220, 40],
  ['fabric-conditioner', 'Fabric conditioner', null, '', 'Softens & freshens every wash', '4.7', 88, 20],
  ['magic-eraser', 'Magic eraser', 'p-eraser.png', '', 'Scrubs away soap scum', '4.6', 74, 0],
  [
    'plant-based-concentrated-washing-machine-cleaner-and-hard-water-descaler-tablets-for-front-load-and-top-load-machines',
    'Purelane Plant-Based Concentrated Washing Machine Cleaner & Hard Water Descaler Tablets for Front Load and Top Load Machines',
    'p-wm.png',
    '',
    'Descales front and top load machines',
    '4.5',
    41,
    12,
  ],
];

const offers = [
  ['build-a-box-2', 'Build a box · 2 products', '349.00', '598.00', 'p-combo2.png'],
  ['build-a-box-3', 'Build a box · 3 products', '499.00', '897.00', 'p-kitchen.png'],
  ['build-a-box-5', 'Build a box · 5 products', '799.00', '1495.00', 'p-combo2.png'],
];

const combos = [
  ['kitchen-essentials', 'Kitchen essentials', '499.00', '897.00', 'Most popular', 'You save ₹398', false, ['kitchen-cleaner-foaming', 'dishwash-gel', 'tap-cleaner-limescale-remover'], 'Includes: Foaming Kitchen Cleaner, Dishwash Gel & Tap Cleaner. Everything for a sparkling kitchen, no need to pick separately.', 'p-kitchen.png'],
  ['laundry-care-bundle', 'Laundry care bundle', '499.00', '947.00', '', 'You save ₹448', false, ['laundry-detergent', 'fabric-conditioner', 'washing-machine-cleaner-descaler'], 'Includes: Laundry Detergent, Fabric Conditioner & Machine Cleaner Powder. Softer, fresher wash, all in one box.', 'p-laundry.png'],
  ['complete-home-bundle', 'Complete home bundle', '799.00', '1495.00', 'Best value', 'Biggest saving', true, ['kitchen-cleaner-foaming', 'laundry-detergent', 'floor-cleaner', 'toilet-cleaner', 'dishwash-gel'], 'Includes: Kitchen Cleaner, Laundry Detergent, Floor Cleaner, Toilet Cleaner & Handwash. Our biggest saving box.', 'p-combo2.png'],
  ['bathroom-deep-clean', 'Bathroom deep clean', '499.00', '897.00', '', 'You save ₹398', false, ['toilet-cleaner', 'tap-cleaner-limescale-remover', 'magic-eraser'], 'Includes: Toilet Cleaner, Tap Cleaner & Magic Eraser. A complete bathroom refresh in one box.', 'p-toilet.png'],
  ['hard-water-solution-kit', 'Hard water solution kit', '349.00', '598.00', '', 'You save ₹249', false, ['tap-cleaner-limescale-remover', 'toilet-cleaner'], 'Includes: Tap Cleaner & Toilet Cleaner. A quick, focused fix for hard water stains across the home.', 'p-tap.png'],
];

async function createProduct({ handle, title, body, type, image, price, compare }) {
  const media = image
    ? [{ originalSource: `${imageBase}/${image}`, mediaContentType: 'IMAGE', alt: title }]
    : [];
  const data = await gql(
    `mutation ($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product { id handle variants(first: 1) { nodes { id inventoryItem { id } } } }
        userErrors { field message }
      }
    }`,
    {
      product: {
        title,
        handle,
        descriptionHtml: body || '',
        vendor: 'Purelane',
        productType: type || 'Homecare',
        status: 'ACTIVE',
      },
      media,
    }
  );
  const payload = data.productCreate;
  if (payload.userErrors?.length) {
    console.warn('create', handle, payload.userErrors);
  }
  const product = payload.product;
  if (!product) return null;
  const variantId = product.variants.nodes[0].id;
  await gql(
    `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { field message }
      }
    }`,
    {
      productId: product.id,
      variants: [{ id: variantId, price, compareAtPrice: compare }],
    }
  );
  return product;
}

async function setInventory(itemId, locationId, qty) {
  await gql(
    `mutation ($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) { userErrors { message } }
    }`,
    {
      input: {
        name: 'available',
        reason: 'correction',
        quantities: [{ inventoryItemId: itemId, locationId, quantity: qty }],
      },
    }
  );
}

async function setMetafields(ownerId, fields) {
  await gql(
    `mutation ($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) { userErrors { field message } }
    }`,
    { metafields: fields.map((f) => ({ ownerId, ...f })) }
  );
}

async function main() {
  let locationId = null;
  try {
    const locData = await gql(`{ locations(first: 1) { nodes { id name } } }`);
    locationId = locData.locations.nodes[0]?.id || null;
  } catch {
    console.log('no locations scope — skip inventory quantities');
  }

  const created = {};

  for (const [handle, title, image, badge, benefit, rating, count, qty] of singles) {
    const product = await createProduct({
      handle,
      title,
      image,
      price: '200.00',
      compare: '299.00',
      body: `<p>Plant-based ${title.toLowerCase()} from Purelane.</p>`,
    });
    if (!product) continue;
    created[handle] = product;
    if (locationId) await setInventory(product.variants.nodes[0].inventoryItem.id, locationId, qty);
    const fields = [
      { namespace: 'custom', key: 'short_benefit', type: 'single_line_text_field', value: benefit },
      { namespace: 'reviews', key: 'rating', type: 'number_decimal', value: rating },
      { namespace: 'reviews', key: 'rating_count', type: 'number_integer', value: String(count) },
    ];
    if (badge) fields.push({ namespace: 'custom', key: 'badge', type: 'single_line_text_field', value: badge });
    await setMetafields(product.id, fields);
    console.log('singles', handle);
  }

  for (const [handle, title, price, compare, image] of offers) {
    const product = await createProduct({
      handle,
      title,
      image,
      price,
      compare,
      type: 'Bundle offer',
      body: '<p>Mix and match. One flat price, free shipping across India.</p>',
    });
    created[handle] = product;
    if (locationId) await setInventory(product.variants.nodes[0].inventoryItem.id, locationId, 50);
    console.log('offer', handle);
  }

  for (const [handle, title, price, compare, flag, save, highlight, components, description, image] of combos) {
    const product = await createProduct({
      handle,
      title,
      image,
      price,
      compare,
      type: 'Combo',
      body: `<p>${description}</p>`,
    });
    created[handle] = product;
    if (locationId) await setInventory(product.variants.nodes[0].inventoryItem.id, locationId, 30);
    const gids = components.map((h) => created[h]?.id).filter(Boolean);
    const fields = [
      { namespace: 'custom', key: 'save_label', type: 'single_line_text_field', value: save },
      { namespace: 'custom', key: 'highlight', type: 'boolean', value: highlight ? 'true' : 'false' },
      { namespace: 'custom', key: 'components', type: 'list.product_reference', value: JSON.stringify(gids) },
    ];
    if (flag) fields.push({ namespace: 'custom', key: 'flag', type: 'single_line_text_field', value: flag });
    await setMetafields(product.id, fields);
    console.log('combo', handle);
  }

  console.log('seeded', Object.keys(created).length, 'products');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
