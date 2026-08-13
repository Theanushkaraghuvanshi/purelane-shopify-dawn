/**
 * Seed Purelane catalog on a development store.
 * Requires: SHOPIFY_SHOP (e.g. purelane-joazssp6.myshopify.com)
 *           SHOPIFY_ADMIN_TOKEN (shpat_… custom app token with products/metafields/metaobjects write)
 *
 * Usage: node scripts/seed-catalog.mjs
 */
const shop = process.env.SHOPIFY_SHOP;
const token = process.env.SHOPIFY_ADMIN_TOKEN;
const apiVersion = '2025-01';

if (!shop || !token) {
  console.error('Set SHOPIFY_SHOP and SHOPIFY_ADMIN_TOKEN');
  process.exit(1);
}

const endpoint = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('GraphQL error');
  }
  return json.data;
}

const singles = [
  {
    handle: 'tap-cleaner-limescale-remover',
    title: 'Tap cleaner & limescale remover',
    image: 'p-tap.svg',
    badge: 'Best seller',
    benefit: 'Melts hard water stains',
    rating: '4.8',
    count: '237',
    qty: 40,
  },
  {
    handle: 'kitchen-cleaner-foaming',
    title: 'Kitchen cleaner, foaming',
    image: 'p-kitchen.svg',
    badge: 'Best seller',
    benefit: 'Cuts grease instantly',
    rating: '4.8',
    count: '254',
    qty: 40,
  },
  {
    handle: 'copper-bronze-brass-cleaner',
    title: 'Copper, bronze & brass cleaner',
    image: 'p-metal.svg',
    badge: 'Top rated',
    benefit: 'Restores shine on metal',
    rating: '4.8',
    count: '231',
    qty: 40,
  },
  {
    handle: 'washing-machine-cleaner-descaler',
    title: 'Washing machine cleaner & descaler',
    image: 'p-wm.svg',
    badge: 'New',
    benefit: 'Deep-cleans your machine',
    rating: '4.8',
    count: '183',
    qty: 40,
  },
  {
    handle: 'dishwash-gel',
    title: 'Dishwash gel',
    image: 'p-dish.svg',
    badge: '',
    benefit: 'Squeaky clean dishes',
    rating: '4.8',
    count: '190',
    qty: 40,
  },
  {
    handle: 'floor-cleaner',
    title: 'Floor cleaner',
    image: 'p-floor.svg',
    badge: '',
    benefit: 'Kills 99.9% germs',
    rating: '4.8',
    count: '210',
    qty: 40,
  },
  {
    handle: 'toilet-cleaner',
    title: 'Toilet cleaner',
    image: 'p-toilet.svg',
    badge: '',
    benefit: 'Fights limescale in the bowl',
    rating: '4.8',
    count: '160',
    qty: 40,
  },
  {
    handle: 'laundry-detergent',
    title: 'Laundry detergent',
    image: 'p-laundry.svg',
    badge: '',
    benefit: 'Removes tough stains & odour',
    rating: '4.8',
    count: '220',
    qty: 40,
  },
  {
    handle: 'fabric-conditioner',
    title: 'Fabric conditioner',
    image: null,
    badge: '',
    benefit: 'Softens & freshens every wash',
    rating: '4.7',
    count: '88',
    qty: 20,
  },
  {
    handle: 'magic-eraser',
    title: 'Magic eraser',
    image: 'p-eraser.svg',
    badge: '',
    benefit: 'Scrubs away soap scum',
    rating: '4.6',
    count: '74',
    qty: 0,
  },
  {
    handle:
      'plant-based-concentrated-washing-machine-cleaner-and-hard-water-descaler-tablets-for-front-load-and-top-load-machines',
    title:
      'Purelane Plant-Based Concentrated Washing Machine Cleaner & Hard Water Descaler Tablets for Front Load and Top Load Machines',
    image: 'p-wm.svg',
    badge: '',
    benefit: 'Descales front and top load machines',
    rating: '4.5',
    count: '41',
    qty: 12,
  },
];

const boxes = [
  { handle: 'build-a-box-2', title: 'Build a box · 2 products', price: '349.00', compare: '598.00' },
  { handle: 'build-a-box-3', title: 'Build a box · 3 products', price: '499.00', compare: '897.00' },
  { handle: 'build-a-box-5', title: 'Build a box · 5 products', price: '799.00', compare: '1495.00' },
];

const combos = [
  {
    handle: 'kitchen-essentials',
    title: 'Kitchen essentials',
    price: '499.00',
    compare: '897.00',
    flag: 'Most popular',
    save: 'You save ₹398',
    highlight: false,
    components: ['kitchen-cleaner-foaming', 'dishwash-gel', 'tap-cleaner-limescale-remover'],
    description:
      'Includes: Foaming Kitchen Cleaner, Dishwash Gel & Tap Cleaner. Everything for a sparkling kitchen, no need to pick separately.',
  },
  {
    handle: 'laundry-care-bundle',
    title: 'Laundry care bundle',
    price: '499.00',
    compare: '947.00',
    flag: '',
    save: 'You save ₹448',
    highlight: false,
    components: ['laundry-detergent', 'fabric-conditioner', 'washing-machine-cleaner-descaler'],
    description:
      'Includes: Laundry Detergent, Fabric Conditioner & Machine Cleaner Powder. Softer, fresher wash, all in one box.',
  },
  {
    handle: 'complete-home-bundle',
    title: 'Complete home bundle',
    price: '799.00',
    compare: '1495.00',
    flag: 'Best value',
    save: 'Biggest saving',
    highlight: true,
    components: [
      'kitchen-cleaner-foaming',
      'laundry-detergent',
      'floor-cleaner',
      'toilet-cleaner',
      'dishwash-gel',
    ],
    description:
      'Includes: Kitchen Cleaner, Laundry Detergent, Floor Cleaner, Toilet Cleaner & Handwash. Our biggest saving box.',
  },
  {
    handle: 'bathroom-deep-clean',
    title: 'Bathroom deep clean',
    price: '499.00',
    compare: '897.00',
    flag: '',
    save: 'You save ₹398',
    highlight: false,
    components: ['toilet-cleaner', 'tap-cleaner-limescale-remover', 'magic-eraser'],
    description: 'Includes: Toilet Cleaner, Tap Cleaner & Magic Eraser. A complete bathroom refresh in one box.',
  },
  {
    handle: 'hard-water-solution-kit',
    title: 'Hard water solution kit',
    price: '349.00',
    compare: '598.00',
    flag: '',
    save: 'You save ₹249',
    highlight: false,
    components: ['tap-cleaner-limescale-remover', 'toilet-cleaner'],
    description: 'Includes: Tap Cleaner & Toilet Cleaner. A quick, focused fix for hard water stains across the home.',
  },
];

async function ensureDefinitions() {
  const defs = [
    ['badge', 'single_line_text_field', 'Badge'],
    ['short_benefit', 'single_line_text_field', 'Short benefit'],
    ['flag', 'single_line_text_field', 'Combo flag'],
    ['save_label', 'single_line_text_field', 'Save label'],
    ['highlight', 'boolean', 'Highlight combo'],
    ['components', 'list.product_reference', 'Combo components'],
  ];
  for (const [key, type, name] of defs) {
    await gql(
      `mutation($def: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $def) {
          createdDefinition { id }
          userErrors { field message }
        }
      }`,
      {
        def: {
          name,
          namespace: 'custom',
          key,
          description: name,
          type,
          ownerType: 'PRODUCT',
        },
      }
    );
  }
  await gql(
    `mutation {
      metafieldDefinitionCreate(definition: {
        name: "Rating"
        namespace: "reviews"
        key: "rating"
        type: "number_decimal"
        ownerType: PRODUCT
      }) { userErrors { message } }
    }`
  );
  await gql(
    `mutation {
      metafieldDefinitionCreate(definition: {
        name: "Rating count"
        namespace: "reviews"
        key: "rating_count"
        type: "number_integer"
        ownerType: PRODUCT
      }) { userErrors { message } }
    }`
  );
}

async function createProduct({ handle, title, body, price, compare, qty, productType }) {
  const data = await gql(
    `mutation($input: ProductInput!) {
      productCreate(input: $input) {
        product { id handle variants(first: 1) { edges { node { id } } } }
        userErrors { field message }
      }
    }`,
    {
      input: {
        title,
        handle,
        descriptionHtml: body || '',
        vendor: 'Purelane',
        productType: productType || 'Homecare',
        status: 'ACTIVE',
        variants: [
          {
            price,
            compareAtPrice: compare,
            inventoryManagement: 'SHOPIFY',
            inventoryQuantities: [{ availableQuantity: qty ?? 20, locationId: null }],
          },
        ],
      },
    }
  );
  const errors = data.productCreate.userErrors;
  if (errors && errors.length) {
    console.warn(handle, errors);
  }
  return data.productCreate.product;
}

async function main() {
  console.log('Creating metafield definitions…');
  await ensureDefinitions();
  console.log('Creating products…');
  const created = {};
  for (const p of singles) {
    const product = await createProduct({
      handle: p.handle,
      title: p.title,
      body: `<p>Plant-based ${p.title.toLowerCase()} from Purelane.</p>`,
      price: '200.00',
      compare: '299.00',
      qty: p.qty,
    });
    created[p.handle] = product;
    console.log('created', p.handle, product && product.id);
  }
  for (const b of boxes) {
    created[b.handle] = await createProduct({
      handle: b.handle,
      title: b.title,
      body: '<p>Mix and match. One flat price, free shipping.</p>',
      price: b.price,
      compare: b.compare,
      qty: 50,
      productType: 'Bundle offer',
    });
  }
  for (const c of combos) {
    created[c.handle] = await createProduct({
      handle: c.handle,
      title: c.title,
      body: `<p>${c.description}</p>`,
      price: c.price,
      compare: c.compare,
      qty: 30,
      productType: 'Combo',
    });
  }
  console.log('Done creating products. Set metafields in Admin if the mutation omitted location inventory.');
  console.log(Object.keys(created).length, 'products attempted');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
