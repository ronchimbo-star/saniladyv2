import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import puppeteer from 'puppeteer';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'sanitary-bin-images';

async function downloadImageWithBrowser(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    const response = await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    if (!response || response.status() !== 200) {
      throw new Error(`HTTP ${response?.status()}`);
    }

    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    console.error(`    Error: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function uploadToStorage(buffer, filename) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`    Upload error: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`    Upload error: ${error.message}`);
    return null;
  }
}

async function processImages() {
  console.log('Fetching variants with external images...\n');

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
    console.log(`Processing: ${variant.sku}`);

    const mainImageFilename = `${variant.sku.toLowerCase()}_main.jpg`;
    console.log(`  Downloading main image...`);

    const mainImageBuffer = await downloadImageWithBrowser(variant.image_url);

    let newMainImageUrl = variant.image_url;
    if (mainImageBuffer) {
      const uploadedUrl = await uploadToStorage(mainImageBuffer, mainImageFilename);
      if (uploadedUrl) {
        newMainImageUrl = uploadedUrl;
        console.log(`  ✓ Main image uploaded`);
      }
    }

    const additionalImages = variant.additional_images || [];
    const newAdditionalImages = [];

    for (let i = 0; i < additionalImages.length; i++) {
      const imageUrl = additionalImages[i];
      const filename = `${variant.sku.toLowerCase()}_${i + 1}.jpg`;

      console.log(`  Downloading additional image ${i + 1}...`);
      const buffer = await downloadImageWithBrowser(imageUrl);

      if (buffer) {
        const uploadedUrl = await uploadToStorage(buffer, filename);
        if (uploadedUrl) {
          newAdditionalImages.push(uploadedUrl);
          console.log(`  ✓ Additional image ${i + 1} uploaded`);
        } else {
          newAdditionalImages.push(imageUrl);
        }
      } else {
        newAdditionalImages.push(imageUrl);
      }
    }

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
      console.log(`  ✓ Database updated\n`);
    }
  }

  console.log('All images processed!');
}

processImages().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
