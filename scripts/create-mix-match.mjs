/**
 * Creates collection `build-a-box` (all single SKUs) and one automatic
 * discount: buy 3 → ₹101 off so 3 × ₹200 = ₹499 (the ticker offer).
 * Tiers 2-for-349 and 5-for-799 need Shopify Functions or stacked Admin
 * discounts; documented in docs/METAFIELDS.md.
 */
import fs from 'node:fs';

const shop = 'purelane-joazssp6.myshopify.com';
const api = `https://${shop}/admin/api/2024-10/graphql.json`;

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
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

const handles = [
  'tap-cleaner-limescale-remover',
  'kitchen-cleaner-foaming',
  'copper-bronze-brass-cleaner',
  'washing-machine-cleaner-descaler',
  'dishwash-gel',
  'floor-cleaner',
  'toilet-cleaner',
  'laundry-detergent',
  'fabric-conditioner',
  'magic-eraser',
  'plant-based-concentrated-washing-machine-cleaner-and-hard-water-descaler-tablets-for-front-load-and-top-load-machines',
];

async function main() {
  const found = await gql(
    `query ($q: String!) {
      products(first: 30, query: $q) { nodes { id handle } }
      collections(first: 5, query: "handle:build-a-box") { nodes { id handle title } }
    }`,
    { q: handles.map((h) => `handle:${h}`).join(' OR ') }
  );

  const ids = found.products.nodes.map((p) => p.id);
  console.log('products', found.products.nodes.map((p) => p.handle));

  let collectionId = found.collections.nodes[0]?.id;
  if (!collectionId) {
    const created = await gql(
      `mutation ($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id handle }
          userErrors { field message }
        }
      }`,
      {
        input: {
          title: 'Build a box',
          handle: 'build-a-box',
          products: ids,
        },
      }
    );
    if (created.collectionCreate.userErrors?.length) {
      throw new Error(JSON.stringify(created.collectionCreate.userErrors));
    }
    collectionId = created.collectionCreate.collection.id;
    console.log('collection created', collectionId);
  } else {
    console.log('collection exists', collectionId);
  }

  const discount = await gql(
    `mutation ($discount: DiscountAutomaticBasicInput!) {
      discountAutomaticBasicCreate(automaticBasicDiscount: $discount) {
        automaticDiscountNode { id automaticDiscount { ... on DiscountAutomaticBasic { title status } } }
        userErrors { field message code }
      }
    }`,
    {
      discount: {
        title: 'Any 3 for ₹499',
        startsAt: new Date().toISOString(),
        minimumRequirement: {
          quantity: { greaterThanOrEqualToQuantity: '3' },
        },
        customerGets: {
          value: { discountAmount: { amount: '101.00', appliesOnEachItem: false } },
          items: { collections: { add: [collectionId] } },
        },
        combinesWith: {
          orderDiscounts: false,
          productDiscounts: false,
          shippingDiscounts: true,
        },
      },
    }
  );

  const err = discount.discountAutomaticBasicCreate.userErrors;
  if (err?.length) {
    console.error('discount errors', JSON.stringify(err, null, 2));
    process.exit(2);
  }
  console.log('discount', JSON.stringify(discount.discountAutomaticBasicCreate.automaticDiscountNode, null, 2));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
