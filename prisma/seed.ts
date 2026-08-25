// prisma/seed.ts
// Seeds the database with all 68 BehindBars Fabrics products across 9 categories.
// Run: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 14 standard colours for most apparel items
const APPAREL_COLOURS = [
  { name: "Jet Black",      hex: "#1C1C1C" },
  { name: "Crisp White",    hex: "#F8F8F8" },
  { name: "Navy Blue",      hex: "#1B2A4A" },
  { name: "Charcoal Grey",  hex: "#3D3D3D" },
  { name: "Olive Green",    hex: "#4E5B31" },
  { name: "Burgundy",       hex: "#6D1A36" },
  { name: "Royal Blue",     hex: "#2055A4" },
  { name: "Forest Green",   hex: "#228B22" },
  { name: "Camel Brown",    hex: "#C19A6B" },
  { name: "Stone Grey",     hex: "#8D9093" },
  { name: "Sky Blue",       hex: "#87CEEB" },
  { name: "Ecru",           hex: "#C2B280" },
  { name: "Rust Orange",    hex: "#B7410E" },
  { name: "Midnight Blue",  hex: "#191970" },
];

// 4 standard leather colours for leather goods
const LEATHER_COLOURS = [
  { name: "Tan",          hex: "#D2691E" },
  { name: "Dark Brown",   hex: "#4A2F1A" },
  { name: "Jet Black",    hex: "#1C1C1C" },
  { name: "Cognac",       hex: "#9A4A28" },
];

// 6 leather colours for shoes/boots
const SHOE_COLOURS_6 = LEATHER_COLOURS.concat([
  { name: "Oxblood",  hex: "#6E0F1A" },
  { name: "Chestnut", hex: "#954535" },
]);

// Sock colours (8)
const SOCK_COLOURS = [
  { name: "White",        hex: "#F8F8F8" },
  { name: "Black",        hex: "#1C1C1C" },
  { name: "Grey Marl",    hex: "#A0A0A0" },
  { name: "Navy",         hex: "#1B2A4A" },
  { name: "Charcoal",     hex: "#3D3D3D" },
  { name: "Red",          hex: "#CC0000" },
  { name: "Olive",        hex: "#4E5B31" },
  { name: "Stripe Mix",   hex: "#C2B280" },
];

// Inner-wear colours (8)
const INNERWEAR_COLOURS = SOCK_COLOURS;

// Tights colours (2)
const TIGHTS_COLOURS = [
  { name: "Jet Black", hex: "#1C1C1C" },
  { name: "Navy Blue", hex: "#1B2A4A" },
];

// Bath robe colours (6)
const BATHROBE_COLOURS = [
  { name: "White",       hex: "#F8F8F8" },
  { name: "Grey",        hex: "#A0A0A0" },
  { name: "Navy",        hex: "#1B2A4A" },
  { name: "Olive",       hex: "#4E5B31" },
  { name: "Cream",       hex: "#FFFDD0" },
  { name: "Charcoal",    hex: "#3D3D3D" },
];

// Kerchief colours (6)
const KERCHIEF_COLOURS = BATHROBE_COLOURS;

// Accessory colours (8 or 4 depending on item)
const ACCESSORY_COLOURS_8 = SOCK_COLOURS;
const ACCESSORY_COLOURS_4 = LEATHER_COLOURS;

// Size arrays per category
const TOPS_SIZES     = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const PANTS_SIZES    = ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46"];
const LOUNGE_SIZES   = ["S", "M", "L", "XL", "XXL", "XXXL"];
const INNERWEAR_SIZES= ["S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_SIZES     = ["6", "7", "8", "9", "10", "11", "12"];
const FREE_SIZE      = ["One Size"];

// Pieces per set per size (reference only — stored as metadata)
// Used to calculate initial stock levels

interface ProductDef {
  name:       string;
  slug:       string;
  basePrice:  number;
  colours:    { name: string; hex: string }[];
  sizes:      string[];
  stockPerSize: number[];
  description?: string;
  gsm?:       number;
  composition?: string;
}

const PRODUCTS_BY_CATEGORY: Record<string, ProductDef[]> = {
  "Tops": [
    {
      name: "Round Neck T-Shirt — Half Sleeve",
      slug: "round-neck-t-shirt-half-sleeve",
      basePrice: 899,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      description: "Premium round-neck half-sleeve t-shirt in breathable cotton blend.",
      gsm: 180,
      composition: "100% Combed Cotton",
    },
    {
      name: "Round Neck T-Shirt — Full Sleeve",
      slug: "round-neck-t-shirt-full-sleeve",
      basePrice: 999,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 180,
      composition: "100% Combed Cotton",
    },
    {
      name: "Round Neck T-Shirt — Sleeveless",
      slug: "round-neck-t-shirt-sleeveless",
      basePrice: 799,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 180,
      composition: "100% Combed Cotton",
    },
    {
      name: "Collared T-Shirt — Half Sleeve",
      slug: "collared-t-shirt-half-sleeve",
      basePrice: 1099,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 200,
      composition: "95% Cotton 5% Elastane",
    },
    {
      name: "Collared T-Shirt — Full Sleeve",
      slug: "collared-t-shirt-full-sleeve",
      basePrice: 1199,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 200,
      composition: "95% Cotton 5% Elastane",
    },
    {
      name: "Henley T-Shirt — Half Sleeve",
      slug: "henley-t-shirt-half-sleeve",
      basePrice: 1049,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 190,
      composition: "100% Combed Cotton",
    },
    {
      name: "Henley T-Shirt — Full Sleeve",
      slug: "henley-t-shirt-full-sleeve",
      basePrice: 1149,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 190,
      composition: "100% Combed Cotton",
    },
    {
      name: "Casual Shirt — Full Sleeve",
      slug: "casual-shirt-full-sleeve",
      basePrice: 1599,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 120,
      composition: "100% Premium Cotton",
    },
    {
      name: "Casual Shirt — Half Sleeve",
      slug: "casual-shirt-half-sleeve",
      basePrice: 1399,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 120,
      composition: "100% Premium Cotton",
    },
    {
      name: "Formal Shirt — Full Sleeve",
      slug: "formal-shirt-full-sleeve",
      basePrice: 1899,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 130,
      composition: "60% Cotton 40% Polyester",
    },
    {
      name: "Silky Sateen Shirt",
      slug: "silky-sateen-shirt",
      basePrice: 2299,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      description: "Luxurious silky sateen weave — premium sheen with a satin-smooth finish.",
      gsm: 110,
      composition: "75% Polyester 25% Viscose",
    },
  ],

  "Bottoms": [
    {
      name: "Cotton Chinos",
      slug: "cotton-chinos",
      basePrice: 1699,
      colours: APPAREL_COLOURS,
      sizes: PANTS_SIZES,
      stockPerSize: [1,2,4,4,4,4,2,2,1,1],
      gsm: 260,
      composition: "98% Cotton 2% Elastane",
    },
    {
      name: "Denim Jeans",
      slug: "denim-jeans",
      basePrice: 1999,
      colours: APPAREL_COLOURS,
      sizes: PANTS_SIZES,
      stockPerSize: [1,2,4,4,4,4,2,2,1,1],
      gsm: 340,
      composition: "99% Cotton 1% Elastane",
    },
    {
      name: "Formal Pants",
      slug: "formal-pants",
      basePrice: 2199,
      colours: APPAREL_COLOURS,
      sizes: PANTS_SIZES,
      stockPerSize: [1,2,4,4,4,4,2,2,1,1],
      gsm: 230,
      composition: "65% Polyester 35% Viscose",
    },
    {
      name: "Travel Cargo Pants",
      slug: "travel-cargo-pants",
      basePrice: 2499,
      colours: APPAREL_COLOURS,
      sizes: PANTS_SIZES,
      stockPerSize: [1,2,4,4,4,4,2,2,1,1],
      gsm: 280,
      composition: "100% Cotton Ripstop",
    },
    {
      name: "Cotton Shorts",
      slug: "cotton-shorts",
      basePrice: 1199,
      colours: APPAREL_COLOURS,
      sizes: PANTS_SIZES,
      stockPerSize: [1,2,4,4,4,4,2,2,1,1],
      gsm: 240,
      composition: "100% Cotton",
    },
    {
      name: "Italian Pants",
      slug: "italian-pants",
      basePrice: 3499,
      colours: APPAREL_COLOURS,
      sizes: PANTS_SIZES,
      stockPerSize: [1,2,4,4,4,4,2,2,1,1],
      description: "Tailored Italian-cut trousers with a luxurious drape.",
      gsm: 210,
      composition: "55% Wool 45% Polyester",
    },
  ],

  "Outer Wear": [
    {
      name: "Leather Jacket",
      slug: "leather-jacket",
      basePrice: 12999,
      colours: LEATHER_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      description: "Genuine full-grain leather jacket with quilted lining.",
    },
    {
      name: "Bomber Jacket",
      slug: "bomber-jacket",
      basePrice: 4999,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
    },
    {
      name: "Denim Shacket",
      slug: "denim-shacket",
      basePrice: 2799,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 340,
      composition: "100% Cotton Denim",
    },
    {
      name: "Sweatshirt",
      slug: "sweatshirt",
      basePrice: 1699,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 320,
      composition: "80% Cotton 20% Polyester",
    },
    {
      name: "Hoodie",
      slug: "hoodie",
      basePrice: 1999,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      gsm: 320,
      composition: "80% Cotton 20% Polyester",
    },
    {
      name: "Shrug",
      slug: "shrug",
      basePrice: 1499,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
    },
    {
      name: "Sweater",
      slug: "sweater",
      basePrice: 2499,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      composition: "100% Merino Wool Blend",
    },
    {
      name: "Blazer Coat",
      slug: "blazer-coat",
      basePrice: 5999,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      description: "Structured single-breasted blazer coat in premium suiting fabric.",
    },
  ],

  "Lounge & Sleep Wear": [
    {
      name: "Joggers",
      slug: "joggers",
      basePrice: 1399,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
      gsm: 280,
      composition: "80% Cotton 20% Polyester",
    },
    {
      name: "Sweatpants",
      slug: "sweatpants",
      basePrice: 1299,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
      gsm: 300,
    },
    {
      name: "Lounge Shorts",
      slug: "lounge-shorts",
      basePrice: 999,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
    },
    {
      name: "Lounge Coord Shorts Set",
      slug: "lounge-coord-shorts-set",
      basePrice: 2199,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
      description: "Matching lounge top + shorts coord set.",
    },
    {
      name: "Bath Robe",
      slug: "bath-robe",
      basePrice: 3499,
      colours: BATHROBE_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [1,1,1,1,0,0],
      description: "Plush 100% Turkish cotton bath robe.",
      composition: "100% Turkish Cotton",
    },
  ],

  "Active Wear": [
    {
      name: "Active Tank Top",
      slug: "active-tank-top",
      basePrice: 799,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      composition: "88% Polyester 12% Elastane",
    },
    {
      name: "Active Half-Sleeve T-Shirt",
      slug: "active-half-sleeve-t-shirt",
      basePrice: 999,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
    },
    {
      name: "Active Full-Sleeve T-Shirt",
      slug: "active-full-sleeve-t-shirt",
      basePrice: 1099,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
    },
    {
      name: "Active Shorts",
      slug: "active-shorts",
      basePrice: 899,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
    },
    {
      name: "Active Track Pants",
      slug: "active-track-pants",
      basePrice: 1299,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
    },
    {
      name: "Active Track Joggers",
      slug: "active-track-joggers",
      basePrice: 1399,
      colours: APPAREL_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
    },
    {
      name: "Active Track Jacket",
      slug: "active-track-jacket",
      basePrice: 2299,
      colours: APPAREL_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
    },
    {
      name: "Compression Tights Top",
      slug: "compression-tights-top",
      basePrice: 1499,
      colours: TIGHTS_COLOURS,
      sizes: TOPS_SIZES,
      stockPerSize: [1,2,4,4,4,2,1],
      composition: "80% Polyamide 20% Elastane",
    },
    {
      name: "Compression Tights Shorts",
      slug: "compression-tights-shorts",
      basePrice: 1299,
      colours: TIGHTS_COLOURS,
      sizes: LOUNGE_SIZES,
      stockPerSize: [4,4,4,2,1,1],
    },
  ],

  "Inner Wear": [
    {
      name: "Boxers",
      slug: "boxers",
      basePrice: 499,
      colours: INNERWEAR_COLOURS,
      sizes: INNERWEAR_SIZES,
      stockPerSize: [2,4,4,4,2,2],
      composition: "100% Combed Cotton",
    },
    {
      name: "Trunks",
      slug: "trunks",
      basePrice: 449,
      colours: INNERWEAR_COLOURS,
      sizes: INNERWEAR_SIZES,
      stockPerSize: [2,4,4,4,2,2],
    },
    {
      name: "Vests — Long Sleeve",
      slug: "vests-long-sleeve",
      basePrice: 549,
      colours: INNERWEAR_COLOURS,
      sizes: INNERWEAR_SIZES,
      stockPerSize: [2,4,4,4,2,2],
    },
    {
      name: "Shapewear Shirt — Sleeved & Sleeveless",
      slug: "shapewear-shirt",
      basePrice: 899,
      colours: TIGHTS_COLOURS,
      sizes: INNERWEAR_SIZES,
      stockPerSize: [2,4,4,4,2,2],
      description: "Body-shaping compression undershirt — sleeved and sleeveless options.",
    },
    {
      name: "No-Show Socks",
      slug: "no-show-socks",
      basePrice: 299,
      colours: SOCK_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Ankle Socks",
      slug: "ankle-socks",
      basePrice: 299,
      colours: SOCK_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Crew Socks",
      slug: "crew-socks",
      basePrice: 349,
      colours: SOCK_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Sports Cushion Socks",
      slug: "sports-cushion-socks",
      basePrice: 399,
      colours: SOCK_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Pilates Socks",
      slug: "pilates-socks",
      basePrice: 449,
      colours: SOCK_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
      description: "Non-slip grip soles for yoga and pilates.",
    },
  ],

  "Footwear": [
    {
      name: "Leather Boots",
      slug: "leather-boots",
      basePrice: 6499,
      colours: LEATHER_COLOURS,
      sizes: SHOE_SIZES,
      stockPerSize: [1,2,2,2,2,1,1],
      description: "Full-grain leather ankle boots with Goodyear welt construction.",
    },
    {
      name: "High-Neck Leather Boots",
      slug: "high-neck-leather-boots",
      basePrice: 7499,
      colours: LEATHER_COLOURS,
      sizes: SHOE_SIZES,
      stockPerSize: [1,2,2,2,2,1,1],
    },
    {
      name: "Leather Sneakers",
      slug: "leather-sneakers",
      basePrice: 4999,
      colours: SHOE_COLOURS_6,
      sizes: SHOE_SIZES,
      stockPerSize: [1,2,2,2,2,1,1],
      description: "Clean minimalist leather sneakers with cupsole construction.",
    },
    {
      name: "Leather Loafers",
      slug: "leather-loafers",
      basePrice: 5499,
      colours: SHOE_COLOURS_6,
      sizes: SHOE_SIZES,
      stockPerSize: [1,2,2,2,2,1,1],
    },
    {
      name: "Leather Formal Shoes",
      slug: "leather-formal-shoes",
      basePrice: 5999,
      colours: SHOE_COLOURS_6,
      sizes: SHOE_SIZES,
      stockPerSize: [1,2,2,2,2,1,1],
    },
    {
      name: "Leather Gloss Shoes",
      slug: "leather-gloss-shoes",
      basePrice: 6999,
      colours: SHOE_COLOURS_6,
      sizes: SHOE_SIZES,
      stockPerSize: [1,2,2,2,2,1,1],
      description: "High-shine patent leather Oxford shoes with mirror-gloss finish.",
    },
  ],

  "Bags": [
    {
      name: "Leather Backpack",
      slug: "leather-backpack",
      basePrice: 8999,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
      description: "Full-grain leather roll-top backpack with laptop sleeve.",
    },
    {
      name: "Leather Messenger Bag",
      slug: "leather-messenger-bag",
      basePrice: 7499,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Leather Business Brief Bag",
      slug: "leather-business-brief-bag",
      basePrice: 9999,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Leather Duffel Bag",
      slug: "leather-duffel-bag",
      basePrice: 12999,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
      description: "Full-grain leather weekender duffel with shoe compartment.",
    },
  ],

  "Accessories": [
    {
      name: "Leather Belt",
      slug: "leather-belt",
      basePrice: 1499,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Leather Wallet",
      slug: "leather-wallet",
      basePrice: 1999,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Leather Keychain",
      slug: "leather-keychain",
      basePrice: 599,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Leather Motorcycle Gloves",
      slug: "leather-motorcycle-gloves",
      basePrice: 2999,
      colours: LEATHER_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Head Bandana",
      slug: "head-bandana",
      basePrice: 399,
      colours: ACCESSORY_COLOURS_8,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Kerchief",
      slug: "kerchief",
      basePrice: 299,
      colours: KERCHIEF_COLOURS,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Tie",
      slug: "tie",
      basePrice: 899,
      colours: ACCESSORY_COLOURS_8,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Pocket Square",
      slug: "pocket-square",
      basePrice: 499,
      colours: ACCESSORY_COLOURS_8,
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
    {
      name: "Neutral Scented Wardrobe Pouch",
      slug: "wardrobe-pouch",
      basePrice: 349,
      colours: [{ name: "Natural Linen", hex: "#C2B280" }],
      sizes: FREE_SIZE,
      stockPerSize: [1],
      description: "Cedar and lavender-infused wardrobe freshener pouch.",
    },
    {
      name: "Pocket Spiral Notebook",
      slug: "pocket-spiral-notebook",
      basePrice: 249,
      colours: [{ name: "Leather Brown", hex: "#4A2F1A" }],
      sizes: FREE_SIZE,
      stockPerSize: [1],
    },
  ],
};

async function main() {
  console.log("🌱 Starting BehindBars Fabrics seed...\n");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.fabricMaterial.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  let totalProducts = 0;
  let totalVariants = 0;

  for (const [categoryName, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug,
        description: `BehindBars Fabrics ${categoryName} collection`,
        imageUrl: `/images/categories/${slug}.jpg`,
        sortOrder: Object.keys(PRODUCTS_BY_CATEGORY).indexOf(categoryName),
      },
    });

    console.log(`📂 Category: ${categoryName}`);

    for (const pd of products) {
      const product = await prisma.product.create({
        data: {
          name: pd.name,
          slug: pd.slug,
          description: pd.description ?? `Premium ${pd.name} from BehindBars Fabrics.`,
          categoryId: category.id,
          basePrice: pd.basePrice,
          currency: "INR",
          gsm: pd.gsm,
          composition: pd.composition,
          isActive: true,
          isFeatured: [
            "silky-sateen-shirt", "italian-pants", "leather-jacket",
            "leather-boots", "active-track-jacket", "leather-backpack",
          ].includes(pd.slug),
          tags: [categoryName.toLowerCase(), "premium", "men"],
          metaTitle: `${pd.name} | BehindBars Fabrics`,
          metaDescription: `Shop ${pd.name} from BehindBars Fabrics — premium men's ${categoryName.toLowerCase()}.`,
        },
      });

      // Create image placeholder record
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `/images/products/${pd.slug}/primary.jpg`,
          altText: pd.name,
          sortOrder: 0,
          isPrimary: true,
        },
      });

      // Create 3D material placeholder record
      await prisma.fabricMaterial.create({
        data: {
          productId: product.id,
          gltfUrl: `/3d/${pd.slug}/model.glb`,
          albedoMapUrl: `/textures/fabric/albedo.jpg`,
          normalMapUrl: `/textures/fabric/normal.jpg`,
          roughnessMapUrl: `/textures/fabric/roughness.jpg`,
          sheenMapUrl: `/textures/fabric/sheen.jpg`,
          hdriDaylight: `/hdri/daylight.hdr`,
          hdriIndoor: `/hdri/indoor.hdr`,
          hdriWarm: `/hdri/warm.hdr`,
          thumbnailUrl: `/images/products/${pd.slug}/3d-thumb.jpg`,
        },
      });

      // Create variants (colour × size combinations)
      for (const colour of pd.colours) {
        for (let si = 0; si < pd.sizes.length; si++) {
          const size = pd.sizes[si];
          const stock = pd.stockPerSize[si] ?? 0;
          const sku = `BB-${pd.slug.slice(0, 8).toUpperCase()}-${colour.name.replace(/\s+/g, "").slice(0,4).toUpperCase()}-${size}`;

          await prisma.productVariant.create({
            data: {
              productId: product.id,
              colour: colour.name,
              colourHex: colour.hex,
              size,
              sku,
              stock: stock * 2, // × 2 for buffer
              isActive: true,
              weight: categoryName === "Footwear" ? 800 : categoryName === "Bags" ? 1200 : 350,
            },
          });
          totalVariants++;
        }
      }

      totalProducts++;
      console.log(`  ✓ ${pd.name} (${pd.colours.length} colours × ${pd.sizes.length} sizes)`);
    }
  }

  // Create a demo admin user
  await prisma.user.upsert({
    where: { email: "admin@behindbars.in" },
    update: {},
    create: {
      email: "admin@behindbars.in",
      name: "BehindBars Admin",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create sample coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "LAUNCH20",
        description: "20% off on launch",
        type: "PERCENTAGE",
        value: 20,
        minOrderAmount: 1999,
        maxDiscount: 2000,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free shipping on all orders",
        type: "FREE_SHIPPING",
        value: 0,
        minOrderAmount: 999,
        isActive: true,
      },
      {
        code: "BB500",
        description: "Flat ₹500 off",
        type: "FLAT",
        value: 500,
        minOrderAmount: 2999,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`\n✅ Seed complete!`);
  console.log(`   Products: ${totalProducts}`);
  console.log(`   Variants: ${totalVariants}`);
  console.log(`   Coupons: LAUNCH20, FREESHIP, BB500`);
  console.log(`   Admin: admin@behindbars.in`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
