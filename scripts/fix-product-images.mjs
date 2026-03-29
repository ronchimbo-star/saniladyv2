import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Corrected image URLs without the double protocol issue
const imageUpdates = [
  {
    sku: 'WR-ASB-22L-AUTO-W-2',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_1_6.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_2_4.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_3_4.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_4_4.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-w-2_5_4.jpg'
    ]
  },
  {
    sku: 'WR-ASB-22L-AUTO-B-2',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_1_6.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_2_4.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_3_4.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_4_4.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-22l-auto-b-2_5_4.jpg'
    ]
  },
  {
    sku: 'WR-PSB-22L-W',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_1_4.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_2_2.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_3_2.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-w_4_2.jpg'
    ]
  },
  {
    sku: 'WR-PSB-22L-G',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_1_3.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_2_2.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_3_2.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-22l-g_4_1.jpg'
    ]
  },
  {
    sku: 'WR-ASB-15L-W',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-w_1_2.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-w_2_2.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-w_3_2.jpg'
    ]
  },
  {
    sku: 'WR-ASB-15L-B',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-b_1_2.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-b_2_2.jpg',
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-asb-15l-b_3_2.jpg'
    ]
  },
  {
    sku: 'WR-WMB-9L-SS',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-wmb-9l-ss_1_1.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-wmb-9l-ss_2_1.jpg'
    ]
  },
  {
    sku: 'WR-PSB-5L-W',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-w_1_1.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-w_2_1.jpg'
    ]
  },
  {
    sku: 'WR-PSB-5L-G',
    image_url: 'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-g_1_1.jpg',
    additional_images: [
      'https://www.washroomhub.co.uk/media/catalog/product/cache/a3ffc2f62e0d0d0ae2e25f8b47b3cc2b/w/r/wr-psb-5l-g_2_1.jpg'
    ]
  }
];

async function fixImages() {
  console.log('Fixing product image URLs...\n');

  for (const update of imageUpdates) {
    console.log(`Updating variant: ${update.sku}`);

    const { error } = await supabase
      .from('sanitary_bin_variants')
      .update({
        image_url: update.image_url,
        additional_images: update.additional_images
      })
      .eq('sku', update.sku);

    if (error) {
      console.error(`  Error updating ${update.sku}:`, error);
    } else {
      console.log(`  ✓ Updated ${update.sku}`);
    }
  }

  console.log('\nImage URLs fixed!');
}

fixImages();
