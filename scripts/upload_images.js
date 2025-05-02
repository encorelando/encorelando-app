#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPA_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPA_URL || !SUPA_KEY) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const BUCKET = 'images';
const IMAGES_DIR = path.resolve('images');

const supabase = createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: false } });

async function uploadFile(file) {
  const filePath = path.join(IMAGES_DIR, file);
  const data = fs.readFileSync(filePath);

  const { error } = await supabase
    .storage
    .from(BUCKET)
    .upload(file, data, { contentType: 'image/webp', upsert: true });

  if (error) throw error;

  const publicUrl = `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${file}`;

  const { error: dbError } = await supabase
    .from('artists')
    .update({ image_url: publicUrl })
    .eq('id', path.parse(file).name);

  if (dbError) throw dbError;

  console.log(`⬆️  ${file} uploaded & DB updated`);
}

(async () => {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('Images directory not found. Run download_images.js first.');
    process.exit(1);
  }
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    try {
      await uploadFile(file);
    } catch (err) {
      console.error(`❌  ${file}: ${err.message}`);
    }
  }
  console.log('🎉  Upload & DB patch finished.');
})();
