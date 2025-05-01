/**
 * Utility functions for data processing in the scraping pipeline
 */

/**
 * Clean text by removing extra whitespace, newlines, etc.
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ') // Replace newlines and tabs with spaces
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces into one
    .trim(); // Remove leading/trailing whitespace
}

/**
 * Validate and standardize date format (YYYY-MM-DD)
 * @param {string} dateStr - Date string to validate
 * @param {string} format - Expected input format (MM/DD/YYYY, YYYY-MM-DD, etc.)
 * @returns {string|null} Validated date in YYYY-MM-DD format or null if invalid
 */
function validateDate(dateStr, format = 'MM/DD/YYYY') {
  if (!dateStr) return null;

  // Remove any extraneous text (e.g., "Date: 05/15/2023")
  dateStr = dateStr.replace(/^.*?(\d)/, '$1');

  try {
    // This is a simplified example - in production, use a date library like luxon
    const parts = dateStr.match(/(\d{1,4})[\\/\-\\.](\d{1,2})[\\/\-\\.](\d{1,4})/);

    if (!parts) return null;

    // Parse based on expected format
    let year, month, day;

    if (format === 'MM/DD/YYYY') {
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
      year = parseInt(parts[3], 10);
    } else if (format === 'YYYY-MM-DD') {
      year = parseInt(parts[1], 10);
      month = parseInt(parts[2], 10);
      day = parseInt(parts[3], 10);
    } else if (format === 'DD/MM/YYYY') {
      day = parseInt(parts[1], 10);
      month = parseInt(parts[2], 10);
      year = parseInt(parts[3], 10);
    } else {
      // Default to MM/DD/YYYY
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
      year = parseInt(parts[3], 10);
    }

    // Handle 2-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }

    // Validate date components
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 2000 || year > 2100) return null;

    // Format as YYYY-MM-DD
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error(`Error parsing date "${dateStr}":`, error);
    return null;
  }
}

/**
 * Deduplicate items based on a key
 * @param {Array} items - Array of items to deduplicate
 * @param {string} key - Key to use for deduplication
 * @returns {Array} Deduplicated array
 */
function deduplicateItems(items, key = 'name') {
  const seen = new Set();
  return items.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Find matching entity in database
 * @param {Object} supabase - Supabase client
 * @param {string} table - Table to search
 * @param {Object} item - Item to match
 * @param {Array} fields - Fields to match on
 * @returns {Promise<string|null>} Matching entity ID or null
 */
async function findMatchingEntity(supabase, table, item, fields = ['name']) {
  try {
    let query = supabase.from(table).select('id');

    // Add filters for each field
    for (const field of fields) {
      if (item[field]) {
        query = query.eq(field, item[field]);
      }
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data ? data.id : null;
  } catch (error) {
    console.error(`Error finding matching ${table}:`, error);
    return null;
  }
}

/**
 * Normalize text for comparison
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim(); // Trim whitespace
}

/**
 * Calculate similarity between two strings (simple implementation)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 */
function calculateStringSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  // Simple contains check
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }

  // Check word by word
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');

  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 2 && words2.includes(word)) {
      matchCount++;
    }
  }

  return matchCount / Math.max(words1.length, words2.length);
}

module.exports = {
  cleanText,
  validateDate,
  deduplicateItems,
  findMatchingEntity,
  normalizeText,
  calculateStringSimilarity,
};
