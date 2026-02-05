const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const sourceFile = path.join(messagesDir, 'en.json');
const locales = ['de', 'fr']; // Add other locales here

if (!fs.existsSync(sourceFile)) {
    console.error('Source language file (en.json) not found!');
    process.exit(1);
}

const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

function syncKeys(source, target) {
    const result = { ...target };
    let changes = 0;

    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!result[key] || typeof result[key] !== 'object') {
                result[key] = {};
            }
            const { updated, count } = syncKeys(source[key], result[key]);
            result[key] = updated;
            changes += count;
        } else {
            if (!result.hasOwnProperty(key)) {
                // For missing keys, we just use the English value 
                // Prefixing with [MISSING] is optional but can help identify untranslated strings
                // result[key] = `[${key.toUpperCase()}] ${source[key]}`; 
                
                // User requirement: "No external service".
                // Defaulting to English value for now to prevent crashes.
                result[key] = source[key];
                changes++;
            }
        }
    }
    return { updated: result, count: changes };
}

locales.forEach(locale => {
    const targetFile = path.join(messagesDir, `${locale}.json`);
    let targetContent = {};
    
    if (fs.existsSync(targetFile)) {
        try {
            targetContent = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        } catch (e) {
            console.warn(`Could not parse ${locale}.json, starting fresh.`);
        }
    }

    const { updated, count } = syncKeys(sourceContent, targetContent);

    if (count > 0 || !fs.existsSync(targetFile)) {
        fs.writeFileSync(targetFile, JSON.stringify(updated, null, 2));
        console.log(`Synced ${locale}.json: ${count} new keys added.`);
    } else {
        console.log(`${locale}.json is up to date.`);
    }
});
