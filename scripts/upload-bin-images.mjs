import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const productImages = [
  {
    slug: 'classic-pedal-bin-white',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_-8.jpg',
    fileName: 'pedal-bin-white.jpg'
  },
  {
    slug: 'classic-pedal-bin-grey',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_-8.jpg',
    fileName: 'pedal-bin-grey.jpg'
  },
  {
    slug: 'compact-pedal-bin',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/s/a/sani-bin_-15.jpg',
    fileName: 'compact-pedal-bin.jpg'
  },
  {
    slug: 'automatic-sensor-bin-white',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002-01__11319.jpg',
    fileName: 'automatic-sensor-white.jpg'
  },
  {
    slug: 'automatic-sensor-bin-grey',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002-01__11319.jpg',
    fileName: 'automatic-sensor-grey.jpg'
  },
  {
    slug: 'automatic-sensor-bin-xl',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-cd-7002-01__11319.jpg',
    fileName: 'automatic-sensor-xl.jpg'
  },
  {
    slug: 'stainless-steel-chute-bin',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-pl72mbs.jpg',
    fileName: 'stainless-chute.jpg'
  },
  {
    slug: 'stainless-steel-flap-bin',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-pl73mbs__53749_1.jpg',
    fileName: 'stainless-flap.jpg'
  },
  {
    slug: 'stainless-steel-slim-bin',
    imageUrl: 'https://cdn.zapem.co.uk/unsafe/fit-in/center/middle/smart/filters:fill%28white,1%29:format%28webp%29:upscale%28%29:quality%2890%29/media/catalog/product/w/r/wr-pl70mbs.jpg',
    fileName: 'stainless-slim.jpg'
  }
];

async function downloadAndUploadImage(imageUrl, fileName, slug) {
  try {
    console.log(`Downloading ${fileName}...`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`Uploading ${fileName} to Supabase...`);
    const { data, error } = await supabase.storage
      .from('sanitary-bin-images')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${fileName}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('sanitary-bin-images')
      .getPublicUrl(fileName);

    console.log(`✓ Uploaded ${fileName}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
    return null;
  }
}

async function updateProductImages() {
  console.log('Starting image upload process...\n');

  for (const product of productImages) {
    const publicUrl = await downloadAndUploadImage(
      product.imageUrl,
      product.fileName,
      product.slug
    );

    if (publicUrl) {
      const { error } = await supabase
        .from('sanitary_bin_products')
        .update({ image_url: publicUrl })
        .eq('slug', product.slug);

      if (error) {
        console.error(`Error updating ${product.slug}:`, error);
      } else {
        console.log(`✓ Updated database for ${product.slug}\n`);
      }
    }
  }

  console.log('Image upload process complete!');
}

updateProductImages();
