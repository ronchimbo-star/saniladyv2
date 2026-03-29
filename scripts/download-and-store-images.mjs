import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'product-images';
const TEMP_DIR = '/tmp/product-images';

// Ensure temp directory exists
if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

async function createBucketIfNotExists() {
  console.log('Checking storage bucket...');

  const { data: buckets } = await supabase.storage.listBuckets();

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (bucketExists) {
    console.log('✓ Bucket already exists');
  } else {
    console.log(`! Bucket '${BUCKET_NAME}' not found. Please create it manually.`);
    return false;
  }

  return true;
}

async function downloadImage(url, filename) {
  try {
    console.log(`  Downloading: ${filename}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to temp directory
    const tempPath = join(TEMP_DIR, filename);
    writeFileSync(tempPath, buffer);

    return buffer;
  } catch (error) {
    console.error(`  Error downloading ${filename}:`, error.message);
    return null;
  }
}

async function uploadToStorage(buffer, filename) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`  Error uploading ${filename}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`  Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function processImages() {
  console.log('\nFetching all product variants...\n');

  const { data: variants, error } = await supabase
    .from('sanitary_bin_variants')
    .select('id, sku, image_url, additional_images')
    .like('image_url', '%washroomhub.co.uk%');

  if (error) {
    console.error('Error fetching variants:', error);
    return;
  }

  console.log(`Found ${variants.length} variants to process\n`);

  for (const variant of variants) {
    console.log(`Processing variant: ${variant.sku}`);

    // Process main image
    const mainImageFilename = `${variant.sku}_main.jpg`;
    const mainImageBuffer = await downloadImage(variant.image_url, mainImageFilename);

    let newMainImageUrl = variant.image_url;
    if (mainImageBuffer) {
      const uploadedUrl = await uploadToStorage(mainImageBuffer, mainImageFilename);
      if (uploadedUrl) {
        newMainImageUrl = uploadedUrl;
        console.log(`  ✓ Main image uploaded`);
      }
    }

    // Process additional images
    const additionalImages = variant.additional_images || [];
    const newAdditionalImages = [];

    for (let i = 0; i < additionalImages.length; i++) {
      const imageUrl = additionalImages[i];
      const filename = `${variant.sku}_${i + 1}.jpg`;

      const buffer = await downloadImage(imageUrl, filename);
      if (buffer) {
        const uploadedUrl = await uploadToStorage(buffer, filename);
        if (uploadedUrl) {
          newAdditionalImages.push(uploadedUrl);
          console.log(`  ✓ Additional image ${i + 1} uploaded`);
        } else {
          newAdditionalImages.push(imageUrl); // Keep original on failure
        }
      } else {
        newAdditionalImages.push(imageUrl); // Keep original on failure
      }
    }

    // Update database
    const { error: updateError } = await supabase
      .from('sanitary_bin_variants')
      .update({
        image_url: newMainImageUrl,
        additional_images: newAdditionalImages
      })
      .eq('id', variant.id);

    if (updateError) {
      console.error(`  Error updating variant:`, updateError);
    } else {
      console.log(`  ✓ Database updated for ${variant.sku}\n`);
    }
  }

  console.log('All images processed!');
}

async function run() {
  console.log('Starting image download and upload process...\n');
  await processImages();
}

run();
