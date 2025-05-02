#!/usr/bin/env node
/**
 * Process a CSV: download each image, convert to WebP, save locally,
 * upload to a Supabase Storage bucket, and patch the DB row's image_url.
 *
 * Usage:
 *   node scripts/process_images.js <csvPath> <tableName>
 *
 * Example:
 *   node scripts/process_images.js artists_rows.csv artists
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

// ---------- CLI args ----------
const [, , csvPath, tableName] = process.argv;
if (!csvPath || !tableName) {
  console.error('Usage: node scripts/process_images.js <csvPath> <tableName>');
  process.exit(1);
}

// ---------- Supabase init ----------
const SUPA_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'images';

if (!SUPA_URL || !SUPA_KEY) {
  console.error('Missing Supabase env vars in .env');
  process.exit(1);
}

const supabase = createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: false } });

// ---------- Helpers ----------
const IMAGES_DIR = path.resolve('images/temp');
fs.mkdirSync(IMAGES_DIR, { recursive: true });

function readCsv(pathToCsv) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(pathToCsv)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('error', reject)
      .on('end', () => resolve(rows));
  });
}

async function fetchConvertSave(id, imgUrl) {
  const destFile = path.join(IMAGES_DIR, `${id}.webp`);
  try {
    const resp = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 15000 });
    await sharp(Buffer.from(resp.data))
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(destFile);
    return destFile;
  } catch (err) {
    console.error(`⚠️  ${id} → ${imgUrl}\n   ${err.message}`);
    return null;
  }
}

async function uploadAndPatch(filePath, id) {
  const fileName = path.basename(filePath);
  const data = fs.readFileSync(filePath);
  const { error } = await supabase.storage.from(BUCKET).upload(fileName, data, {
    contentType: 'image/webp',
    upsert: true,
  });
  if (error) throw error;

  const publicUrl = `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;

  const { error: dbError } = await supabase
    .from(tableName)
    .update({ image_url: publicUrl })
    .eq('id', id);

  if (dbError) throw dbError;
  console.log(`⬆️  ${fileName} → ${tableName}.image_url updated`);
}

async function main() {
  const rows = await readCsv(csvPath);
  for (const row of rows) {
    const id = String(
      row.id || row.ID || row.Id || row.uuid || row.artist_id || row.venue_id || ''
    ).trim();
    const imgUrl = (row.image_url || row.image || row.imageUrl || row.image_URL || '').trim();
    if (!id || !imgUrl) continue;

    const savedPath = await fetchConvertSave(id, imgUrl);
    if (savedPath) {
      try {
        await uploadAndPatch(savedPath, id);
      } catch (err) {
        console.error(`❌  ${id}: ${err.message}`);
      }
    }
  }
  console.log(`🎉  Completed pipeline for ${tableName}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
