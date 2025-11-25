#!/usr/bin/env node

/**
 * Script to automatically translate en.json to other languages
 * Uses google-translate-api-x for lightweight translation without API keys
 */

const fs = require('fs');
const path = require('path');

// Import translate function - works without API keys
let translate;
try {
  translate = require('google-translate-api-x').translate;
} catch (e) {
  console.error('❌ Error loading google-translate-api-x');
  console.error('Make sure it\'s installed: npm install google-translate-api-x');
  process.exit(1);
}

const messagesDir = path.join(__dirname, '..', 'messages');

// Supported languages with language codes
const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English' },
  de: { code: 'de', name: 'Deutsch' },
  fr: { code: 'fr', name: 'Français' },
  es: { code: 'es', name: 'Español' },
  it: { code: 'it', name: 'Italiano' },
  pt: { code: 'pt', name: 'Português' },
  nl: { code: 'nl', name: 'Nederlands' },
  pl: { code: 'pl', name: 'Polski' },
  ru: { code: 'ru', name: 'Русский' },
  ja: { code: 'ja', name: '日本語' },
  zh: { code: 'zh-CN', name: '中文' }, // Use simplified Chinese
};

function loadEnglishMessages() {
  const enPath = path.join(messagesDir, 'en.json');
  if (!fs.existsSync(enPath)) {
    throw new Error(`English messages file not found: ${enPath}`);
  }
  return JSON.parse(fs.readFileSync(enPath, 'utf-8'));
}

// Recursively extract all string values from an object
function extractStrings(obj, prefix = '') {
  const strings = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      strings.push({ key: fullKey, value });
    } else if (typeof value === 'object' && value !== null) {
      strings.push(...extractStrings(value, fullKey));
    }
  }

  return strings;
}

// Reconstruct object from flat key-value pairs
function reconstructObject(flat) {
  const result = {};

  for (const { key, value } of flat) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

// Translate text with retries
async function translateText(text, targetLang, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await translate(text, {
        from: 'en',
        to: targetLang,
      });
      return result.text || text;
    } catch (error) {
      if (i < retries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      } else {
        console.warn(`   ⚠ Failed to translate "${text.substring(0, 30)}...": ${error.message}`);
        return text; // Return original text if all retries fail
      }
    }
  }
}

// Batch translate strings
async function translateStrings(texts, targetLang) {
  const results = [];

  // Translate in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(text => translateText(text, targetLang))
    );
    results.push(...batchResults);

    // Small delay between batches
    if (i + batchSize < texts.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return results;
}

async function generateTranslations() {
  console.log('🌍 Starting automatic translation generation...\n');

  try {
    const enMessages = loadEnglishMessages();
    const strings = extractStrings(enMessages);

    console.log(`📦 Found ${strings.length} strings to translate\n`);

    for (const [lang, langInfo] of Object.entries(SUPPORTED_LANGUAGES)) {
      if (lang === 'en') continue; // Skip English

      console.log(`📝 Translating to ${langInfo.name} (${lang})...`);

      const filePath = path.join(messagesDir, `${lang}.json`);

      // Check if file already exists and skip
      if (fs.existsSync(filePath)) {
        console.log(`   ✓ ${lang}.json already exists (skipping)`);
        continue;
      }

      try {
        const textsToTranslate = strings.map(s => s.value);

        // Translate all strings
        console.log(`   ⏳ Translating ${textsToTranslate.length} strings...`);
        const translatedTexts = await translateStrings(textsToTranslate, langInfo.code);

        // Reconstruct the object with translated strings
        const translatedStrings = strings.map((s, idx) => ({
          key: s.key,
          value: translatedTexts[idx] || s.value
        }));

        const translatedMessages = reconstructObject(translatedStrings);

        // Write the translated file
        const content = JSON.stringify(translatedMessages, null, 2);
        fs.writeFileSync(filePath, content);

        console.log(`   ✓ Created ${lang}.json\n`);
      } catch (error) {
        console.error(`   ✗ Error translating to ${lang}:`, error.message, '\n');
      }
    }

    console.log('✅ Translation generation completed!');
    console.log('📌 All files translated automatically using google-translate-api-x');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateTranslations().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { generateTranslations, SUPPORTED_LANGUAGES };
