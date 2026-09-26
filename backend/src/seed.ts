import { esClient, ensureIndex, INDEX_NAME } from "./es-client";

const sampleProducts = [
  { name: "Wireless Mechanical Keyboard", description: "Hot-swappable switches, RGB backlight, Bluetooth 5.0", category: "Electronics", price: 89.99 },
  { name: "Noise Cancelling Headphones", description: "Over-ear, 30 hour battery, active noise cancellation", category: "Electronics", price: 199.0 },
  { name: "Standing Desk Converter", description: "Height adjustable, fits dual monitors, sturdy steel frame", category: "Furniture", price: 149.5 },
  { name: "Ergonomic Office Chair", description: "Lumbar support, breathable mesh, adjustable armrests", category: "Furniture", price: 259.0 },
  { name: "Stainless Steel Water Bottle", description: "Insulated, keeps drinks cold for 24 hours", category: "Home", price: 24.99 },
  { name: "Espresso Machine", description: "15-bar pump, built-in grinder, milk frother", category: "Home", price: 349.0 },
  { name: "Running Shoes", description: "Lightweight breathable mesh, cushioned sole for daily runs", category: "Apparel", price: 79.99 },
  { name: "Trail Backpack", description: "30L capacity, water resistant, padded hip belt", category: "Outdoors", price: 64.0 },
  { name: "Smart LED Bulb", description: "Wi-Fi enabled, dimmable, works with voice assistants", category: "Electronics", price: 14.99 },
  { name: "Yoga Mat", description: "Non-slip, extra thick, eco-friendly TPE material", category: "Fitness", price: 29.99 },

  { name: "Wireless Gaming Mouse", description: "High precision sensor, RGB lighting, programmable buttons", category: "Electronics", price: 59.99 },
  { name: "USB-C Charging Hub", description: "Seven ports including HDMI, USB 3.0 and SD card reader", category: "Electronics", price: 44.99 },
  { name: "Portable Bluetooth Speaker", description: "Water resistant speaker with 20 hour battery life", category: "Electronics", price: 69.99 },
  { name: "4K Smart Monitor", description: "27-inch UHD display with USB-C connectivity and HDR", category: "Electronics", price: 329.0 },
  { name: "Wireless Charging Pad", description: "Fast Qi charging pad compatible with smartphones and earbuds", category: "Electronics", price: 29.99 },
  { name: "Smart Fitness Watch", description: "Heart rate tracking, GPS, sleep monitoring and notifications", category: "Electronics", price: 129.99 },
  { name: "Portable SSD 1TB", description: "Compact external SSD with USB-C interface and fast transfer speeds", category: "Electronics", price: 94.99 },
  { name: "Webcam Full HD", description: "1080p webcam with autofocus, microphone and privacy cover", category: "Electronics", price: 54.99 },
  { name: "Mechanical Gaming Keyboard", description: "RGB backlight, tactile switches and detachable USB-C cable", category: "Electronics", price: 109.99 },
  { name: "Tablet Stand", description: "Adjustable aluminum stand for tablets and smartphones", category: "Electronics", price: 27.99 },

  { name: "L-Shaped Computer Desk", description: "Spacious corner desk with cable management and storage shelf", category: "Furniture", price: 189.0 },
  { name: "Adjustable Standing Desk", description: "Electric height adjustment with memory presets and sturdy frame", category: "Furniture", price: 399.0 },
  { name: "Office Desk Lamp", description: "LED desk lamp with adjustable brightness and color temperature", category: "Furniture", price: 39.99 },
  { name: "Bookshelf Organizer", description: "Five-tier wooden bookshelf suitable for home and office", category: "Furniture", price: 119.0 },
  { name: "Folding Study Table", description: "Compact folding desk ideal for small rooms and apartments", category: "Furniture", price: 74.99 },
  { name: "Mesh Office Chair", description: "Breathable backrest with adjustable height and tilt mechanism", category: "Furniture", price: 179.99 },
  { name: "Wooden Coffee Table", description: "Modern solid wood table with lower storage shelf", category: "Furniture", price: 139.0 },
  { name: "Monitor Arm Stand", description: "Adjustable dual monitor arm with cable management system", category: "Furniture", price: 89.99 },
  { name: "Ergonomic Footrest", description: "Memory foam footrest designed for comfortable office work", category: "Furniture", price: 34.99 },
  { name: "Office Storage Cabinet", description: "Compact metal cabinet with adjustable shelves and lock", category: "Furniture", price: 159.0 },

  { name: "Ceramic Coffee Mug", description: "Large ceramic mug with comfortable handle and glossy finish", category: "Home", price: 14.99 },
  { name: "Electric Kettle", description: "1.7L stainless steel kettle with automatic shutoff", category: "Home", price: 39.99 },
  { name: "Digital Kitchen Scale", description: "Accurate food scale with LCD display and tare function", category: "Home", price: 19.99 },
  { name: "Nonstick Frying Pan", description: "Durable nonstick coating with heat resistant handle", category: "Home", price: 34.99 },
  { name: "Air Fryer", description: "5.5L digital air fryer with temperature and timer controls", category: "Home", price: 119.99 },
  { name: "Robot Vacuum Cleaner", description: "Smart robotic vacuum with automatic scheduling and mapping", category: "Home", price: 299.0 },
  { name: "Bedside Table Lamp", description: "Warm LED table lamp with touch brightness control", category: "Home", price: 32.99 },
  { name: "Cotton Bath Towels", description: "Soft absorbent cotton towels suitable for everyday use", category: "Home", price: 39.99 },
  { name: "Kitchen Knife Set", description: "Six-piece stainless steel knife set with storage block", category: "Home", price: 59.99 },
  { name: "Food Storage Container Set", description: "Airtight BPA-free containers with stackable design", category: "Home", price: 29.99 },

  { name: "Cotton Casual T-Shirt", description: "Soft breathable cotton t-shirt suitable for everyday wear", category: "Apparel", price: 24.99 },
  { name: "Slim Fit Jeans", description: "Stretch denim jeans with modern slim fit design", category: "Apparel", price: 49.99 },
  { name: "Waterproof Hiking Jacket", description: "Lightweight waterproof jacket with adjustable hood", category: "Apparel", price: 119.0 },
  { name: "Running Shorts", description: "Lightweight athletic shorts with breathable fabric", category: "Apparel", price: 29.99 },
  { name: "Cotton Hoodie", description: "Warm fleece-lined hoodie with adjustable drawstring hood", category: "Apparel", price: 54.99 },
  { name: "Leather Casual Belt", description: "Genuine leather belt with durable metal buckle", category: "Apparel", price: 34.99 },
  { name: "Winter Wool Scarf", description: "Soft wool scarf designed for cold weather protection", category: "Apparel", price: 27.99 },
  { name: "Sports Compression Shirt", description: "Moisture-wicking compression shirt for training and running", category: "Apparel", price: 39.99 },
  { name: "Classic Polo Shirt", description: "Breathable cotton polo shirt with regular fit", category: "Apparel", price: 32.99 },
  { name: "Lightweight Windbreaker", description: "Packable windbreaker with water resistant outer layer", category: "Apparel", price: 69.99 },

  { name: "Hiking Boots", description: "Durable waterproof boots with reinforced toe protection", category: "Outdoors", price: 109.99 },
  { name: "Camping Tent", description: "Four-person waterproof tent with quick setup design", category: "Outdoors", price: 159.0 },
  { name: "Camping Sleeping Bag", description: "Warm lightweight sleeping bag suitable for three-season camping", category: "Outdoors", price: 79.99 },
  { name: "Portable Camping Stove", description: "Compact gas stove with adjustable flame control", category: "Outdoors", price: 44.99 },
  { name: "Trekking Poles", description: "Adjustable aluminum trekking poles with ergonomic handles", category: "Outdoors", price: 39.99 },
  { name: "Outdoor Folding Chair", description: "Portable folding chair with steel frame and cup holder", category: "Outdoors", price: 49.99 },
  { name: "Waterproof Dry Bag", description: "20L waterproof backpack for hiking, kayaking and camping", category: "Outdoors", price: 34.99 },
  { name: "Camping Lantern", description: "Rechargeable LED lantern with multiple brightness levels", category: "Outdoors", price: 29.99 },
  { name: "Insulated Picnic Cooler", description: "Large insulated cooler bag for outdoor food and drinks", category: "Outdoors", price: 59.99 },
  { name: "Portable Hammock", description: "Lightweight nylon hammock with tree straps included", category: "Outdoors", price: 45.0 },

  { name: "Adjustable Dumbbells", description: "Pair of adjustable dumbbells with compact weight selection system", category: "Fitness", price: 149.99 },
  { name: "Resistance Bands Set", description: "Five resistance levels with handles and ankle straps", category: "Fitness", price: 34.99 },
  { name: "Kettlebell 20kg", description: "Cast iron kettlebell with comfortable textured handle", category: "Fitness", price: 59.99 },
  { name: "Foam Roller", description: "High-density foam roller for muscle recovery and stretching", category: "Fitness", price: 24.99 },
  { name: "Exercise Ball", description: "Anti-burst stability ball for workouts and core exercises", category: "Fitness", price: 29.99 },
  { name: "Jump Rope", description: "Adjustable speed jump rope with lightweight handles", category: "Fitness", price: 16.99 },
  { name: "Gym Training Gloves", description: "Breathable workout gloves with padded palm protection", category: "Fitness", price: 19.99 },
  { name: "Pull Up Bar", description: "Doorway pull-up bar with multiple grip positions", category: "Fitness", price: 39.99 },
  { name: "Fitness Resistance Tube", description: "Heavy-duty resistance tube for strength and mobility exercises", category: "Fitness", price: 22.99 },
  { name: "Workout Bench", description: "Adjustable weight bench with multiple incline positions", category: "Fitness", price: 129.99 },

  { name: "Smartphone Tripod", description: "Adjustable tripod with phone holder and remote shutter", category: "Electronics", price: 34.99 },
  { name: "Laptop Stand", description: "Aluminum laptop stand with adjustable height and viewing angle", category: "Electronics", price: 49.99 },
  { name: "Bluetooth Earbuds", description: "True wireless earbuds with charging case and touch controls", category: "Electronics", price: 79.99 },
  { name: "Smart Home Camera", description: "Indoor security camera with night vision and motion alerts", category: "Electronics", price: 59.99 },
  { name: "Wi-Fi Router", description: "Dual-band Wi-Fi router with high-speed wireless connectivity", category: "Electronics", price: 89.99 },
  { name: "Power Bank 20000mAh", description: "High-capacity portable charger with USB-C fast charging", category: "Electronics", price: 44.99 },
  { name: "USB Desk Fan", description: "Quiet compact desk fan with three adjustable speed levels", category: "Electronics", price: 24.99 },
  { name: "Smart Plug", description: "Wi-Fi smart plug with scheduling and voice assistant support", category: "Electronics", price: 18.99 },
  { name: "Portable Projector", description: "Compact HD projector with HDMI and wireless connectivity", category: "Electronics", price: 219.0 },
  { name: "Noise Isolating Earphones", description: "Wired earphones with in-line microphone and silicone tips", category: "Electronics", price: 19.99 },

  { name: "Glass Food Container Set", description: "Heat-resistant glass containers with airtight locking lids", category: "Home", price: 44.99 },
  { name: "Electric Hand Mixer", description: "Five-speed hand mixer with stainless steel beaters", category: "Home", price: 39.99 },
  { name: "Toaster Oven", description: "Compact toaster oven with multiple cooking modes and timer", category: "Home", price: 89.99 },
  { name: "Blender 1000W", description: "Powerful countertop blender with stainless steel blades", category: "Home", price: 69.99 },
  { name: "Cordless Vacuum Cleaner", description: "Lightweight cordless vacuum with rechargeable battery", category: "Home", price: 179.99 },
  { name: "Memory Foam Pillow", description: "Ergonomic memory foam pillow with breathable cover", category: "Home", price: 39.99 },
  { name: "LED Ceiling Light", description: "Energy efficient LED ceiling light with adjustable brightness", category: "Home", price: 54.99 },
  { name: "Digital Alarm Clock", description: "LED alarm clock with USB charging port and snooze function", category: "Home", price: 24.99 },
  { name: "Laundry Storage Basket", description: "Large foldable laundry basket with reinforced handles", category: "Home", price: 29.99 },
  { name: "Electric Heating Pad", description: "Adjustable temperature heating pad with automatic shutoff", category: "Home", price: 49.99 },

  { name: "Walking Sneakers", description: "Comfortable lightweight sneakers with cushioned footbed", category: "Apparel", price: 69.99 },
  { name: "Rain Jacket", description: "Packable waterproof jacket with breathable fabric lining", category: "Apparel", price: 74.99 },
  { name: "Canvas Backpack", description: "Durable everyday backpack with laptop compartment", category: "Apparel", price: 59.99 },
  { name: "Leather Wallet", description: "Compact leather wallet with multiple card and cash slots", category: "Apparel", price: 39.99 },
  { name: "Baseball Cap", description: "Adjustable cotton cap with embroidered front logo", category: "Apparel", price: 19.99 },
  { name: "Thermal Winter Gloves", description: "Insulated gloves with touchscreen compatible fingertips", category: "Apparel", price: 24.99 },
  { name: "Athletic Joggers", description: "Stretch fabric joggers with zippered side pockets", category: "Apparel", price: 44.99 },
  { name: "Casual Canvas Shoes", description: "Classic canvas shoes with rubber sole and padded insole", category: "Apparel", price: 54.99 },
  { name: "Sports Running Socks", description: "Moisture-wicking socks with cushioned heel and toe", category: "Apparel", price: 14.99 },
  { name: "Lightweight Rain Poncho", description: "Reusable waterproof poncho with adjustable hood", category: "Apparel", price: 22.99 },

  { name: "Camping Cookware Set", description: "Compact cookware set with pots, pan, cups and utensils", category: "Outdoors", price: 69.99 },
  { name: "Outdoor First Aid Kit", description: "Portable first aid kit with essential outdoor medical supplies", category: "Outdoors", price: 39.99 },
  { name: "Tactical Outdoor Flashlight", description: "High brightness rechargeable flashlight with adjustable beam", category: "Outdoors", price: 34.99 },
  { name: "Travel Water Filter", description: "Portable water filtration system for hiking and camping", category: "Outdoors", price: 49.99 },
  { name: "Outdoor Compass", description: "Durable navigation compass with clear directional markings", category: "Outdoors", price: 18.99 },
  { name: "Camping Tarp", description: "Waterproof multi-purpose tarp with reinforced attachment points", category: "Outdoors", price: 42.99 },
  { name: "Hiking Waist Pack", description: "Compact outdoor waist pack with multiple storage compartments", category: "Outdoors", price: 29.99 },
  { name: "Travel Sleeping Pillow", description: "Inflatable travel pillow with soft washable cover", category: "Outdoors", price: 21.99 },
  { name: "Portable Camping Table", description: "Lightweight folding table with aluminum frame", category: "Outdoors", price: 79.99 },
  { name: "Outdoor Gear Organizer", description: "Durable organizer bag for camping accessories and equipment", category: "Outdoors", price: 36.99 }
];

async function seed() {
  await ensureIndex();

  const operations = sampleProducts.flatMap((doc) => [
    { index: { _index: INDEX_NAME } },
    { ...doc, createdAt: new Date().toISOString() },
  ]);

  const bulkResponse = await esClient.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    console.error("Some documents failed to index:", bulkResponse.items);
  } else {
    console.log(`Indexed ${sampleProducts.length} products into "${INDEX_NAME}"`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
