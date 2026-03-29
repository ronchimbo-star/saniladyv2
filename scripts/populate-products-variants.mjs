import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    name: 'Pedal Operated Sanitary Bin 20L',
    slug: 'pedal-sanitary-bin-20l',
    description: 'Great space saving design with round edges and a modern finish. Ideal for busy washroom applications. This sanitary bin has been designed for easy bag replacement and is pedal operated for hands free use.',
    features: [
      'Soft white or grey colour',
      '20 litre capacity',
      'Double cover, the inner cover closes when outer cover opened',
      'Shorter sleeker design',
      'Pedal operated for hands-free use',
      'Easy bag replacement',
      'Smooth easy clean surface'
    ],
    specifications: {
      capacity: '20L',
      material: 'ABS Plastic',
      operation: 'Pedal Operated'
    },
    category: 'Pedal Bins',
    brand: 'Airsenz',
    sku_prefix: 'WR-ZYS-20L',
    variants: [
      {
        sku: 'WR-ZYS-20L-WHITE',
        variant_name: 'White 20L',
        color: 'White',
        capacity: '20L',
        price: 34.95,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bins.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_-15_1.jpg',
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_-8_1.jpg'
        ],
        isDefault: true
      },
      {
        sku: 'WR-ZYS-20L-GREY',
        variant_name: 'Grey 20L',
        color: 'Grey',
        capacity: '20L',
        price: 34.95,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_grey-zys-20lj_1.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_grey-zys-20lj-2_1.jpg',
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_grey-zys-20lj_3_1.jpg'
        ],
        isDefault: false
      }
    ]
  },
  {
    name: 'Automatic Sanitary Bin 15L',
    slug: 'automatic-sanitary-bin-15l',
    description: 'Automatic contactless sanitary bin with side opening design for easy disposal. Promoting a higher level of hygiene with infrared sensor activation.',
    features: [
      'Hands Free Activation',
      'Open the bin via Infrared hand Sensor',
      'Robust, easy to clean ABS plastic in 2 finishes',
      'Double cover system to hide contents',
      'Sleek, slimline design',
      'Side opening design',
      'Reversible lid for left or right placement'
    ],
    specifications: {
      capacity: '15L',
      material: 'ABS Plastic',
      operation: 'Automatic Sensor',
      dimensions: 'H:460mm x W:440mm x D:140mm',
      power: '4 x C Series Batteries (not supplied)'
    },
    category: 'Automatic Bins',
    brand: 'Airsenz',
    sku_prefix: 'WR-ASB-15L',
    variants: [
      {
        sku: 'WR-ASB-15L-WHITE',
        variant_name: 'White 15L',
        color: 'White',
        capacity: '15L',
        price: 59.95,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002-01__11319.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002a_2__70516.jpg',
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002a__18521.jpg'
        ],
        isDefault: true
      },
      {
        sku: 'WR-ASB-15L-BLACK',
        variant_name: 'Black 15L',
        color: 'Black',
        capacity: '15L',
        price: 59.95,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002b_2__45581.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002b_4__96254.jpg',
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002b_6__06727.jpg'
        ],
        isDefault: false
      }
    ]
  },
  {
    name: 'Automatic Sanitary Bin 20L',
    slug: 'automatic-sanitary-bin-20l',
    description: 'Large capacity automatic sanitary bin with no-touch operation. Wave your foot over the sensor for hands-free disposal.',
    features: [
      'No Touch Operation',
      'Foot sensor activation',
      'Robust ABS Plastic Body with Modern Design',
      '20 Litre Capacity',
      'Double cover system',
      'Modern shape and design',
      'Suitable for busy washroom facilities'
    ],
    specifications: {
      capacity: '20L',
      material: 'ABS Plastic',
      operation: 'Foot Sensor',
      power: '4 x AA batteries (not included)'
    },
    category: 'Automatic Bins',
    brand: 'Washroom Hub',
    sku_prefix: 'WR-ZYS-20FT',
    variants: [
      {
        sku: 'WR-ZYS-20FT-WHITE',
        variant_name: 'White 20L',
        color: 'White',
        capacity: '20L',
        price: 69.95,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/z/y/zys-20ft-both_1.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-zys-20ft_white_2.jpg',
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-zys-20ft-2_1.jpg'
        ],
        isDefault: true
      },
      {
        sku: 'WR-ZYS-20FT-GREY',
        variant_name: 'Grey 20L',
        color: 'Grey',
        capacity: '20L',
        price: 69.95,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/z/y/zys-20ft-grey_1.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-zys-20ft-grey_1.jpg',
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-zys-20ft-grey_lid_1.jpg'
        ],
        isDefault: false
      }
    ]
  },
  {
    name: 'Brushed Stainless Steel Sanitary Bin with Chute Lid 30L',
    slug: 'stainless-steel-chute-bin-30l',
    description: 'Specialist chute style lid for privacy. Made from grade 304 stainless steel with brushed finish for a robust and durable addition to your bathroom.',
    features: [
      'Specialist Chute Style Vanity Lid',
      'Durable Stainless-Steel Construction',
      'Made in the UK',
      'Grade 304 stainless steel',
      'Brushed finish',
      'Wall mounted or free standing',
      'Bag strap for easy fitting'
    ],
    specifications: {
      capacity: '30L',
      material: 'Grade 304 Stainless Steel',
      finish: 'Brushed',
      mounting: 'Wall Mounted or Free Standing'
    },
    category: 'Stainless Steel Bins',
    brand: 'Washroom Hub',
    sku_prefix: 'WR-PL72MBS',
    variants: [
      {
        sku: 'WR-PL72MBS',
        variant_name: 'Brushed Stainless Steel 30L',
        color: 'Brushed Stainless Steel',
        capacity: '30L',
        price: 155.98,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-pl72mbs.jpg',
        additionalImages: [
          'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sanitary__66149.png'
        ],
        isDefault: true
      }
    ]
  },
  {
    name: 'Brushed Stainless Steel Washroom Waste Bin with Flap Lid 30L',
    slug: 'stainless-steel-flap-bin-30l',
    description: 'High-quality washroom waste bin made in the UK from grade 304 stainless steel. The flap lid ensures the bin contents remain hidden.',
    features: [
      'High-Quality Washroom Waste Bin',
      'Made Here in the UK',
      'Manufactured from grade 304 stainless steel',
      'Flap lid hides bin contents',
      'Brushed finish',
      'Wall mounted or free standing',
      'Durable and stylish'
    ],
    specifications: {
      capacity: '30L',
      material: 'Grade 304 Stainless Steel',
      finish: 'Brushed',
      mounting: 'Wall Mounted or Free Standing'
    },
    category: 'Stainless Steel Bins',
    brand: 'Washroom Hub',
    sku_prefix: 'WR-PL73MBS',
    variants: [
      {
        sku: 'WR-PL73MBS',
        variant_name: 'Brushed Stainless Steel 30L',
        color: 'Brushed Stainless Steel',
        capacity: '30L',
        price: 155.98,
        imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-pl73mbs__53749_1.jpg',
        additionalImages: [],
        isDefault: true
      }
    ]
  }
];

async function downloadAndUploadImage(imageUrl, fileName) {
  try {
    console.log(`  Downloading ${fileName}...`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error(`  Failed to download ${fileName}: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('sanitary-bin-images')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`  Error uploading ${fileName}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('sanitary-bin-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`  Error processing ${fileName}:`, error);
    return null;
  }
}

async function populateProducts() {
  console.log('Starting product and variant population...\n');

  for (const product of products) {
    console.log(`\nProcessing: ${product.name}`);

    const { data: baseProduct, error: baseError } = await supabase
      .from('sanitary_bin_base_products')
      .insert({
        name: product.name,
        slug: product.slug,
        description: product.description,
        features: product.features,
        specifications: product.specifications,
        category: product.category,
        brand: product.brand,
        sku_prefix: product.sku_prefix
      })
      .select()
      .single();

    if (baseError) {
      console.error(`Error creating base product: ${baseError.message}`);
      continue;
    }

    console.log(`✓ Created base product: ${baseProduct.name}`);

    for (const variant of product.variants) {
      console.log(`\n  Processing variant: ${variant.variant_name}`);

      const mainImageFileName = `${variant.sku.toLowerCase()}-main.jpg`;
      const mainImageUrl = await downloadAndUploadImage(variant.imageUrl, mainImageFileName);

      if (!mainImageUrl) {
        console.error(`  Failed to upload main image for ${variant.variant_name}`);
        continue;
      }

      console.log(`  ✓ Uploaded main image`);

      const additionalImageUrls = [];
      for (let i = 0; i < variant.additionalImages.length; i++) {
        const fileName = `${variant.sku.toLowerCase()}-${i + 1}.jpg`;
        const url = await downloadAndUploadImage(variant.additionalImages[i], fileName);
        if (url) {
          additionalImageUrls.push(url);
        }
      }

      if (additionalImageUrls.length > 0) {
        console.log(`  ✓ Uploaded ${additionalImageUrls.length} additional images`);
      }

      const { error: variantError } = await supabase
        .from('sanitary_bin_variants')
        .insert({
          base_product_id: baseProduct.id,
          sku: variant.sku,
          variant_name: variant.variant_name,
          color: variant.color,
          capacity: variant.capacity,
          price: variant.price,
          image_url: mainImageUrl,
          additional_images: additionalImageUrls,
          is_default: variant.isDefault,
          stock_status: 'Available'
        });

      if (variantError) {
        console.error(`  Error creating variant: ${variantError.message}`);
      } else {
        console.log(`  ✓ Created variant: ${variant.variant_name}`);
      }
    }
  }

  console.log('\n\nProduct and variant population complete!');
}

populateProducts();
