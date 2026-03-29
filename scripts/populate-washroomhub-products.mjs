import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: 'Automatic No Touch Sanitary Bin 22L',
    slug: 'automatic-no-touch-22l',
    description: 'Premium automatic sensor bin with side-opening design for maximum hygiene',
    detailed_description: `<p>Our <strong>Automatic No Touch Sanitary Bin</strong> represents the pinnacle of washroom hygiene technology. Featuring advanced infrared sensor technology, this bin opens automatically with a simple hand wave, ensuring zero contact and maximum hygiene standards.</p>

<h3>Key Features:</h3>
<ul>
<li><strong>Infrared Sensor Technology:</strong> Opens automatically with a wave of your hand - no touch required</li>
<li><strong>Side Opening Design:</strong> Provides easy access for servicing while maintaining discretion</li>
<li><strong>Chute Design:</strong> Hides bin contents from user view, maintaining dignity and hygiene</li>
<li><strong>22L Capacity:</strong> Large capacity reduces servicing frequency</li>
<li><strong>Slimline Design:</strong> Fits perfectly in narrow cubicles without taking up valuable space</li>
<li><strong>Battery Operated:</strong> Requires 4x AA batteries (not included)</li>
<li><strong>Durable Construction:</strong> Made from high-quality ABS plastic for long-lasting performance</li>
</ul>

<h3>Why Choose Automatic?</h3>
<p>Automatic bins offer the highest level of hygiene by eliminating the need for any physical contact. This is particularly important in high-traffic washrooms where cross-contamination is a concern. The sensor technology ensures the lid only opens when needed, helping to contain odours effectively.</p>

<h3>Ideal For:</h3>
<ul>
<li>Premium office buildings</li>
<li>Healthcare facilities</li>
<li>Hotels and hospitality venues</li>
<li>Shopping centres</li>
<li>Any environment where hygiene is paramount</li>
</ul>`,
    features: [
      'Infrared sensor for no-touch operation',
      'Side-opening design for easy servicing',
      'Chute design hides contents',
      'Slimline profile fits narrow spaces',
      '22L capacity for reduced servicing',
      'Battery operated (4x AA)'
    ],
    specifications: {
      'Capacity': '22 Litres',
      'Height': '56cm',
      'Width': '31cm',
      'Depth': '20cm',
      'Weight': '2.8kg',
      'Material': 'ABS Plastic',
      'Power': '4x AA Batteries',
      'Opening Mechanism': 'Automatic Sensor'
    },
    category: 'Automatic Bins',
    brand: 'Washroom Hub',
    variants: [
      {
        variant_name: 'White',
        sku: 'WR-ASB-22L-AUTO-W-2',
        price: 48.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_1_6.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_2_4.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_3_4.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_4_4.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_5_4.jpg'
        ],
        stock_status: 'In Stock',
        is_default: true
      },
      {
        variant_name: 'Black',
        sku: 'WR-ASB-22L-AUTO-B-2',
        price: 48.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_1_6.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_2_4.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_3_4.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_4_4.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_5_4.jpg'
        ],
        stock_status: 'In Stock',
        is_default: false
      }
    ]
  },
  {
    name: 'Pedal Operated Sanitary Bin 22L',
    slug: 'pedal-operated-22l',
    description: 'Hygienic foot-pedal operated bin with slim design, perfect for narrow cubicles',
    detailed_description: `<p>The <strong>Pedal Operated Sanitary Bin 22L</strong> combines practical functionality with a sleek, modern design. This bin has been specifically engineered to fit into even the narrowest toilet cubicles while providing generous 22-litre capacity.</p>

<h3>Key Features:</h3>
<ul>
<li><strong>Hands-Free Operation:</strong> Foot pedal mechanism ensures hygienic, touch-free disposal</li>
<li><strong>Easy to Clean Design:</strong> Smooth surfaces and removable inner bucket make cleaning simple</li>
<li><strong>Slim Profile:</strong> At just 20cm deep, fits perfectly in tight spaces</li>
<li><strong>Side Opening Access:</strong> Choice of left or right-side opening for flexible installation</li>
<li><strong>Durable Construction:</strong> High-quality plastic construction ensures long-lasting performance</li>
<li><strong>Odour Control:</strong> Tight-fitting lid helps contain odours between services</li>
</ul>

<h3>Why Choose Pedal Operation?</h3>
<p>Pedal-operated bins offer an excellent balance of hygiene and reliability. With no batteries required and simple mechanical operation, these bins provide consistent hands-free performance year after year. The pedal mechanism is robust and designed to withstand heavy commercial use.</p>

<h3>Perfect For:</h3>
<ul>
<li>Office buildings</li>
<li>Retail premises</li>
<li>Leisure facilities</li>
<li>Educational institutions</li>
<li>Any commercial washroom</li>
</ul>`,
    features: [
      'Hygienic foot-pedal operation',
      'Side opening with choice of lid fitting',
      'Ultra-slim 20cm depth design',
      '22L capacity',
      'Easy to clean smooth surfaces',
      'No batteries required'
    ],
    specifications: {
      'Capacity': '22 Litres',
      'Height': '56cm',
      'Width': '31cm',
      'Depth': '20cm',
      'Weight': '2.4kg',
      'Material': 'High-Grade Plastic',
      'Opening Mechanism': 'Foot Pedal'
    },
    category: 'Pedal Bins',
    brand: 'Washroom Hub',
    variants: [
      {
        variant_name: 'White',
        sku: 'WR-PSB-22L-W',
        price: 28.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_1_4.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_2_2.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_3_2.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_4_2.jpg'
        ],
        stock_status: 'In Stock',
        is_default: true
      },
      {
        variant_name: 'Charcoal Grey',
        sku: 'WR-PSB-22L-G',
        price: 28.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_1_3.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_2_2.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_3_2.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_4_1.jpg'
        ],
        stock_status: 'In Stock',
        is_default: false
      }
    ]
  },
  {
    name: 'Automatic Sanitary Bin 15L',
    slug: 'automatic-sanitary-15l',
    description: 'Compact automatic sensor bin with side-opening design for easy servicing',
    detailed_description: `<p>The <strong>Automatic Sanitary Bin 15L</strong> offers premium no-touch technology in a more compact format, perfect for smaller washrooms or where space is at a premium.</p>

<h3>Key Features:</h3>
<ul>
<li><strong>Infrared Sensor:</strong> Touch-free operation for maximum hygiene</li>
<li><strong>Compact 15L Size:</strong> Perfect for smaller washrooms</li>
<li><strong>Side Opening Design:</strong> Easy to service and clean</li>
<li><strong>Slimline Profile:</strong> Fits in narrow spaces</li>
<li><strong>Battery Operated:</strong> Reliable sensor operation</li>
</ul>`,
    features: [
      'Automatic infrared sensor',
      'Compact 15L capacity',
      'Side-opening for easy servicing',
      'Slimline design',
      'Battery operated',
      'Chute design hides contents'
    ],
    specifications: {
      'Capacity': '15 Litres',
      'Height': '50cm',
      'Width': '28cm',
      'Depth': '18cm',
      'Material': 'ABS Plastic',
      'Power': '4x AA Batteries',
      'Opening Mechanism': 'Automatic Sensor'
    },
    category: 'Automatic Bins',
    brand: 'Washroom Hub',
    variants: [
      {
        variant_name: 'White',
        sku: 'WR-ASB-15L-W',
        price: 39.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-w_1_2.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-w_2_2.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-w_3_2.jpg'
        ],
        stock_status: 'In Stock',
        is_default: true
      },
      {
        variant_name: 'Black',
        sku: 'WR-ASB-15L-B',
        price: 39.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-b_1_2.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-b_2_2.jpg',
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-b_3_2.jpg'
        ],
        stock_status: 'In Stock',
        is_default: false
      }
    ]
  },
  {
    name: 'Wall Mounted Compact Steel Sanitary Waste Bin 9L',
    slug: 'wall-mounted-steel-9l',
    description: 'Space-saving wall-mounted bin with durable stainless steel construction',
    detailed_description: `<p>The <strong>Wall Mounted Compact Steel Sanitary Waste Bin</strong> is the ultimate space-saving solution for washrooms where floor space is limited. Constructed from high-quality stainless steel, this bin combines durability with a modern, professional aesthetic.</p>

<h3>Key Features:</h3>
<ul>
<li><strong>Wall Mounted:</strong> Saves valuable floor space</li>
<li><strong>Stainless Steel Construction:</strong> Durable, hygienic, and easy to clean</li>
<li><strong>9L Capacity:</strong> Compact yet practical</li>
<li><strong>Easy Installation:</strong> Includes mounting hardware</li>
<li><strong>Modern Design:</strong> Complements any washroom décor</li>
</ul>`,
    features: [
      'Wall-mounted design saves floor space',
      'Durable stainless steel construction',
      '9L capacity',
      'Easy to clean and maintain',
      'Includes mounting hardware',
      'Modern professional appearance'
    ],
    specifications: {
      'Capacity': '9 Litres',
      'Height': '40cm',
      'Width': '25cm',
      'Depth': '15cm',
      'Material': 'Stainless Steel',
      'Mounting': 'Wall Mounted'
    },
    category: 'Wall Mounted Bins',
    brand: 'Washroom Hub',
    variants: [
      {
        variant_name: 'Brushed Steel',
        sku: 'WR-WMB-9L-SS',
        price: 34.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-wmb-9l-ss_1_1.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-wmb-9l-ss_2_1.jpg'
        ],
        stock_status: 'In Stock',
        is_default: true
      }
    ]
  },
  {
    name: 'Pedal Operated Sanitary Bin 5L',
    slug: 'pedal-operated-5l',
    description: 'Ultra-compact pedal bin perfect for single-user washrooms',
    detailed_description: `<p>The <strong>Pedal Operated Sanitary Bin 5L</strong> is our most compact pedal bin, designed specifically for smaller washrooms or single-user facilities where space is extremely limited.</p>

<h3>Key Features:</h3>
<ul>
<li><strong>Ultra-Compact:</strong> 5L capacity perfect for small spaces</li>
<li><strong>Foot Pedal Operation:</strong> Hands-free hygienic use</li>
<li><strong>Slim Design:</strong> Fits in the tightest spaces</li>
<li><strong>Easy to Service:</strong> Removable inner bucket</li>
<li><strong>No Batteries:</strong> Simple mechanical operation</li>
</ul>`,
    features: [
      'Ultra-compact 5L capacity',
      'Foot pedal operation',
      'Perfect for small washrooms',
      'Easy to clean',
      'Removable inner bucket',
      'No batteries required'
    ],
    specifications: {
      'Capacity': '5 Litres',
      'Height': '38cm',
      'Width': '20cm',
      'Depth': '15cm',
      'Weight': '1.2kg',
      'Material': 'Plastic',
      'Opening Mechanism': 'Foot Pedal'
    },
    category: 'Pedal Bins',
    brand: 'Washroom Hub',
    variants: [
      {
        variant_name: 'White',
        sku: 'WR-PSB-5L-W',
        price: 18.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-w_1_1.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-w_2_1.jpg'
        ],
        stock_status: 'In Stock',
        is_default: true
      },
      {
        variant_name: 'Charcoal Grey',
        sku: 'WR-PSB-5L-G',
        price: 18.95,
        image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-g_1_1.jpg',
        additional_images: [
          'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-g_2_1.jpg'
        ],
        stock_status: 'In Stock',
        is_default: false
      }
    ]
  }
];

async function clearExistingProducts() {
  console.log('Clearing existing products...');

  const { error: variantsError } = await supabase
    .from('sanitary_bin_variants')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (variantsError) {
    console.error('Error clearing variants:', variantsError);
  }

  const { error: productsError } = await supabase
    .from('sanitary_bin_base_products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (productsError) {
    console.error('Error clearing products:', productsError);
  }

  console.log('✓ Existing products cleared\n');
}

async function insertProducts() {
  console.log('Starting product insertion...\n');

  for (const product of products) {
    console.log(`Processing product: ${product.name}`);

    const { variants, ...productData } = product;

    // Try to find existing product first
    const { data: existingProduct } = await supabase
      .from('sanitary_bin_base_products')
      .select('id')
      .eq('slug', product.slug)
      .maybeSingle();

    let productId;

    if (existingProduct) {
      console.log(`  Product exists, updating: ${product.name}`);

      const { error: updateError } = await supabase
        .from('sanitary_bin_base_products')
        .update(productData)
        .eq('id', existingProduct.id);

      if (updateError) {
        console.error(`  Error updating product:`, updateError);
        continue;
      }

      productId = existingProduct.id;
      console.log(`  ✓ Product updated`);
    } else {
      console.log(`  Inserting new product: ${product.name}`);

      const { data: insertedProduct, error: productError } = await supabase
        .from('sanitary_bin_base_products')
        .insert([productData])
        .select()
        .single();

      if (productError) {
        console.error(`  Error inserting product:`, productError);
        continue;
      }

      productId = insertedProduct.id;
      console.log(`  ✓ Product inserted`);
    }

    // Delete existing variants for this product
    await supabase
      .from('sanitary_bin_variants')
      .delete()
      .eq('base_product_id', productId);

    // Insert new variants
    for (const variant of variants) {
      console.log(`  Inserting variant: ${variant.variant_name}`);

      const variantData = {
        base_product_id: productId,
        ...variant
      };

      const { error: variantError } = await supabase
        .from('sanitary_bin_variants')
        .insert([variantData]);

      if (variantError) {
        console.error(`  Error inserting variant ${variant.variant_name}:`, variantError);
      } else {
        console.log(`  ✓ Variant inserted: ${variant.variant_name}`);
      }
    }

    console.log('');
  }

  console.log('Product insertion complete!');
}

async function run() {
  // Don't clear existing products, just update them
  await insertProducts();
}

run();
