#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const sharp = require('sharp');

const csvPath = process.argv[2] || 'artists_rows.csv';
const IMAGES_DIR = path.resolve('images');
fs.mkdirSync(IMAGES_DIR, { recursive: true });

const rows = [];

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => rows.push(row))
  .on('end', async () => {
    for (const row of rows) {
      const id = String(row.id || row.ID || row.Id || row.artist_id || row.artistId || '').trim();
      const imageUrl = (row.image_url || row.image || row.ImageURL || row.imageUrl || '').trim();
      if (!id || !imageUrl) continue;
      try {
        const resp = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 });
        await sharp(Buffer.from(resp.data))
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(IMAGES_DIR, `${id}.webp`));
        console.log(`✅  ${id}.webp`);
      } catch (err) {
        console.error(`⚠️  ${id} → ${imageUrl}\n   ${err.message}`);
      }
    }
    console.log('🎉  All done downloading & converting images.');
  });
