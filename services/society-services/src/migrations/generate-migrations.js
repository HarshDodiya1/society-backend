/*
 Simple migration generator for society-services.
 Scans `src/models/*.js` for `DBConnect.model('collectionName', ...new Schema({...}))` patterns,
 extracts top-level field types using heuristics, and creates a single migrate-mongo style
 migration file that creates collections with basic JSON Schema validators.

 Usage:
   cd services/society-services
   npm run gen:migrations

 Notes/limitations:
 - This uses simple JS parsing heuristics and supports common patterns (primitive types, ObjectId refs).
 - Nested objects and arrays are treated as `object` or omitted.
 - Please review generated migration(s) before running them in production.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't define __dirname; derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatTimestamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function readModels(modelsDir) {
  const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));
  const models = [];

  for (const file of files) {
    const full = path.join(modelsDir, file);
    const content = fs.readFileSync(full, 'utf8');

    // Attempt to find the collection name passed to DBConnect.model('collectionName', ...)
    let collection = null;
    const m = content.match(/DBConnect\.model\(\s*['"`]([^'"`]+)['"`]/);
    if (m) collection = m[1];
    else collection = path.basename(file, '.js').toLowerCase();

    // Find the `new Schema({...})` block and grab the top-level object contents
    const schemaIdx = content.indexOf('new Schema(');
    let schemaBody = null;
    if (schemaIdx !== -1) {
      const start = content.indexOf('{', schemaIdx);
      if (start !== -1) {
        // find matching closing brace for this top-level schema object
        let pos = start;
        let depth = 0;
        for (; pos < content.length; pos++) {
          const ch = content[pos];
          if (ch === '{') depth++;
          else if (ch === '}') {
            depth--;
            if (depth === 0) break;
          }
        }
        schemaBody = content.slice(start+1, pos);
      }
    }

    models.push({ file, collection, schemaBody, content });
  }

  return models;
}

function parseTopLevelProps(schemaBody) {
  if (!schemaBody) return {};

  const props = {};

  // Very simple top-level property matcher: propName: { ... }
  const re = /([\w$]+)\s*:\s*\{([\s\S]*?)\}(?:\s*,|\s*$)/g;
  let match;
  while ((match = re.exec(schemaBody)) !== null) {
    const name = match[1];
    const inside = match[2];

    // detect type
    let bsonType = 'object';
    if (/Schema\.Types\.ObjectId/.test(inside) || /type\s*:\s*Schema\.Types\.ObjectId/.test(inside) || /ref\s*:/.test(inside)) {
      bsonType = 'objectId';
    } else if (/type\s*:\s*String/.test(inside) || /:\s*String\b/.test(inside)) {
      bsonType = 'string';
    } else if (/type\s*:\s*Number/.test(inside) || /: ?Number\b/.test(inside)) {
      bsonType = 'number';
    } else if (/type\s*:\s*Date/.test(inside) || /:\s*Date\b/.test(inside)) {
      bsonType = 'date';
    } else if (/type\s*:\s*Boolean/.test(inside) || /:\s*Boolean\b/.test(inside)) {
      bsonType = 'bool';
    }

    // detect required
    const required = /required\s*:\s*true/.test(inside);

    props[name] = { bsonType, required };
  }

  return props;
}

function buildJsonSchema(props) {
  const json = { bsonType: 'object', properties: {} };
  const required = [];
  for (const [k,v] of Object.entries(props)) {
    json.properties[k] = { bsonType: v.bsonType };
    if (v.required) required.push(k);
  }
  if (required.length) json.required = required;
  return json;
}

function generateMigrationFile(models, outDir) {
  const timestamp = formatTimestamp();
  const filename = `${timestamp}-create-collections.js`;
  const fullPath = path.join(outDir, filename);

  const creates = [];
  const drops = [];

  for (const m of models) {
    const props = parseTopLevelProps(m.schemaBody);
    const jsonSchema = buildJsonSchema(props);

    creates.push({ collection: m.collection, jsonSchema });
    drops.push(m.collection);
  }

  // Build migration JS content (migrate-mongo style)
  const lines = [];
  lines.push('module.exports = {');
  lines.push('  async up(db, client) {');

  for (const c of creates) {
    const validator = JSON.stringify({ $jsonSchema: c.jsonSchema }, null, 4);
    lines.push(`    // create collection: ${c.collection}`);
    lines.push(`    await db.createCollection("${c.collection}", ${validator});`);
    lines.push('');
  }

  lines.push('  },');
  lines.push('');
  lines.push('  async down(db, client) {');
  for (const name of drops) {
    lines.push(`    await db.collection('${name}').drop();`);
  }
  lines.push('  }');
  lines.push('};');

  fs.writeFileSync(fullPath, lines.join('\n'));

  return fullPath;
}

async function main() {
  const migrationsDir = path.resolve(path.join(__dirname));
  const modelsDir = path.resolve(path.join(__dirname, '..', 'models'));

  if (!fs.existsSync(modelsDir)) {
    console.error('Models directory not found:', modelsDir);
    process.exit(1);
  }

  if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true });

  const models = readModels(modelsDir);
  if (!models.length) {
    console.warn('No model files found in', modelsDir);
    process.exit(0);
  }

  const out = generateMigrationFile(models, migrationsDir);
  console.log('Migration file created:', out);
}

main();
