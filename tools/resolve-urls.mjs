#!/usr/bin/env node
/**
 * LLM-Powered Product URL Resolver for PC Builder
 *
 * Uses the Inference Gateway (HuggingFace Spaces) to find real product URLs
 * for all PC components, validates them via HTTP HEAD, and outputs a JSON
 * mapping that can be merged into src/data/components.ts
 *
 * Usage:
 *   node tools/resolve-urls.mjs                    # Resolve all components
 *   node tools/resolve-urls.mjs --dry-run           # Print without writing
 *   node tools/resolve-urls.mjs --id=gpu-001        # Single component
 *   node tools/resolve-urls.mjs --category=gpu      # One category
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'tools', 'resolved-urls.json');

// ── Gateway Configuration ─────────────────────────────────────────────────────
const SPACES = [
  'https://Ashfaque94-inference-gateway.hf.space',
  'https://Ashfaque94-inference-gateway-2.hf.space',
  'https://Ashfaque94-inference-gateway-3.hf.space',
  'https://Ashfaque94-inference-gateway-4.hf.space',
  'https://Ashfaque94-inference-gateway-5.hf.space',
];

let spaceIdx = 0;
function nextSpace() {
  return SPACES[spaceIdx++ % SPACES.length];
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const DRY_RUN = !!args['dry-run'];
const FILTER_ID = args.id || null;
const FILTER_CAT = args.category || null;

// ── Parse component data from source ──────────────────────────────────────────
function parseComponents() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/components.ts'), 'utf8');
  const components = [];
  const re =
    /id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?brand:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    components.push({ id: m[1], name: m[2], brand: m[3], category: m[4] });
  }
  return components;
}

// ── LLM Chat ──────────────────────────────────────────────────────────────────
async function chat(prompt, maxTokens = 2000, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const space = nextSpace();
    try {
      const res = await fetch(`${space}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a product research assistant that finds REAL product identifiers for PC components on e-commerce sites. You ONLY return identifiers you are confident exist. When unsure, you return null. You output strict JSON only, no markdown.`,
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.05,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) {
        console.warn(`  ⚠ Space ${space} returned ${res.status}, retrying...`);
        continue;
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    } catch (err) {
      console.warn(`  ⚠ Space ${space} error: ${err.message}`);
      if (attempt === retries) return '';
    }
  }
  return '';
}

// ── URL Validation ────────────────────────────────────────────────────────────
async function validateUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    // Amazon returns 200 even for invalid ASINs but shows "dog" page
    // Newegg returns 200 for valid products
    if (!res.ok) return false;
    // For Amazon, check if the page has the product title
    if (url.includes('amazon')) {
      const html = await res.text();
      // If we see "productTitle" or "a-price", it's a real product
      return html.includes('productTitle') || html.includes('a-price');
    }
    return true;
  } catch {
    return false;
  }
}

// ── Resolve a single component ────────────────────────────────────────────────
async function resolveComponent(comp) {
  console.log(`\n🔍 Resolving: ${comp.brand} ${comp.name} (${comp.id})`);

  const prompt = `Find the REAL e-commerce product identifiers for this PC component.

Product: ${comp.brand} ${comp.name}
Category: ${comp.category}

Return ONLY a JSON object with these fields:
{
  "amazon_us_asin": "B0XXXXXXXX",
  "amazon_uk_asin": "B0XXXXXXXX",
  "amazon_de_asin": "B0XXXXXXXX",
  "amazon_in_asin": "B0XXXXXXXX",
  "amazon_ca_asin": "B0XXXXXXXX",
  "newegg_item": "N82E16819113934",
  "bestbuy_sku": "6595200"
}

RULES:
- Amazon ASINs are exactly 10 alphanumeric chars, typically starting with B0
- Often the SAME ASIN works across Amazon US/UK/DE/IN/CA
- Newegg items look like N82E168XXXXXXX (starts with N82E168)
- BestBuy SKUs are 7-digit numbers
- Return null for any field you're NOT 100% confident about
- Do NOT guess or fabricate identifiers
- This is the ${new Date().getFullYear()} version of the product
- Return ONLY the JSON, no explanation, no markdown fences`;

  const response = await chat(prompt);
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.log('  ❌ No JSON in LLM response');
    return {};
  }

  let ids;
  try {
    ids = JSON.parse(jsonMatch[0]);
  } catch {
    console.log('  ❌ Invalid JSON from LLM');
    return {};
  }

  // Build and validate URLs
  const verified = {};
  const tasks = [];

  // Amazon regions
  const amazonRegions = [
    { key: 'amazon_us_asin', domain: 'amazon.com' },
    { key: 'amazon_uk_asin', domain: 'amazon.co.uk' },
    { key: 'amazon_de_asin', domain: 'amazon.de' },
    { key: 'amazon_in_asin', domain: 'amazon.in' },
    { key: 'amazon_ca_asin', domain: 'amazon.ca' },
  ];

  for (const { key, domain } of amazonRegions) {
    const asin = ids[key];
    if (asin && /^B0[A-Z0-9]{8}$/i.test(asin)) {
      const url = `https://www.${domain}/dp/${asin}`;
      tasks.push(
        validateUrl(url).then((ok) => {
          if (ok) {
            verified[domain] = url;
            console.log(`  ✅ ${domain}: ${url}`);
          } else {
            console.log(`  ❌ ${domain}: ${url} (invalid/404)`);
          }
        })
      );
    }
  }

  // Newegg
  if (ids.newegg_item && /^N82E168\d+$/.test(ids.newegg_item)) {
    // We need the product slug for the URL. Use a search-based approach instead.
    // Newegg URLs: https://www.newegg.com/{slug}/p/{item}
    // Since we don't know the slug, we'll use the item number format
    const url = `https://www.newegg.com/p/${ids.newegg_item}`;
    tasks.push(
      validateUrl(url).then((ok) => {
        if (ok) {
          verified['newegg.com'] = url;
          console.log(`  ✅ newegg.com: ${url}`);
        } else {
          console.log(`  ❌ newegg.com: ${url} (invalid)`);
        }
      })
    );
  }

  // BestBuy
  if (ids.bestbuy_sku && /^\d{7}$/.test(ids.bestbuy_sku)) {
    const url = `https://www.bestbuy.com/site/${ids.bestbuy_sku}.p`;
    tasks.push(
      validateUrl(url).then((ok) => {
        if (ok) {
          verified['bestbuy.com'] = url;
          console.log(`  ✅ bestbuy.com: ${url}`);
        } else {
          console.log(`  ❌ bestbuy.com: ${url} (invalid)`);
        }
      })
    );
  }

  await Promise.all(tasks);

  // If Amazon ASINs failed, try the LLM-backed search approach
  if (!verified['amazon.com']) {
    console.log('  🔄 Trying Amazon search fallback...');
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(comp.brand + ' ' + comp.name)}&i=computers-intl-ship`;
    try {
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US' },
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        const html = await res.text();
        // Extract first ASIN from search results
        const asinMatch = html.match(/data-asin="(B0[A-Z0-9]{8})"/i);
        if (asinMatch) {
          const directUrl = `https://www.amazon.com/dp/${asinMatch[1]}`;
          const valid = await validateUrl(directUrl);
          if (valid) {
            verified['amazon.com'] = directUrl;
            console.log(`  ✅ amazon.com (search): ${directUrl}`);
            // Use same ASIN for other Amazon regions
            for (const { domain } of amazonRegions.slice(1)) {
              if (!verified[domain]) {
                verified[domain] = `https://www.${domain}/dp/${asinMatch[1]}`;
                console.log(`  ➕ ${domain} (shared ASIN): ${verified[domain]}`);
              }
            }
          }
        }
      }
    } catch {}
  }

  // If Newegg failed, try search
  if (!verified['newegg.com']) {
    console.log('  🔄 Trying Newegg search fallback...');
    const searchUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(comp.brand + ' ' + comp.name)}`;
    try {
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        const html = await res.text();
        // Extract first product link
        const linkMatch = html.match(/href="(https:\/\/www\.newegg\.com\/[^"]*\/p\/N82E168[^"]*?)"/);
        if (linkMatch) {
          verified['newegg.com'] = linkMatch[1].split('?')[0]; // strip query params
          console.log(`  ✅ newegg.com (search): ${verified['newegg.com']}`);
        }
      }
    } catch {}
  }

  return verified;
}

// ── Merge results into components.ts ──────────────────────────────────────────
function mergeIntoSource(results) {
  let src = fs.readFileSync(path.join(ROOT, 'src/data/components.ts'), 'utf8');
  let replacements = 0;

  for (const [compId, urls] of Object.entries(results)) {
    if (Object.keys(urls).length === 0) continue;

    // Find the productUrls block for this component
    const idEscaped = compId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(id:\\s*'${idEscaped}'[\\s\\S]*?productUrls:\\s*\\{)([^}]*)(\\})`,
      'g'
    );

    const match = regex.exec(src);
    if (match) {
      // Build new productUrls content
      const entries = Object.entries(urls)
        .map(([domain, url]) => `      '${domain}': '${url}'`)
        .join(',\n');

      const newBlock = `${match[1]}\n${entries},\n    ${match[3]}`;
      src = src.slice(0, match.index) + src.slice(match.index).replace(match[0], newBlock);
      replacements++;
      console.log(`📝 Updated ${compId} with ${Object.keys(urls).length} URLs`);
    }
  }

  if (replacements > 0 && !DRY_RUN) {
    fs.writeFileSync(path.join(ROOT, 'src/data/components.ts'), src, 'utf8');
    console.log(`\n✅ Updated ${replacements} components in components.ts`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 PC Builder — LLM Product URL Resolver');
  console.log(`   Spaces: ${SPACES.length}`);
  console.log(`   Dry run: ${DRY_RUN}`);
  if (FILTER_ID) console.log(`   Filter: id=${FILTER_ID}`);
  if (FILTER_CAT) console.log(`   Filter: category=${FILTER_CAT}`);
  console.log('');

  // Check gateway health
  try {
    const res = await fetch(`${SPACES[0]}/v1/providers`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      console.log('✅ Gateway is reachable\n');
    } else {
      console.log('⚠️  Gateway returned non-OK status, continuing anyway...\n');
    }
  } catch {
    console.error('❌ Cannot reach the inference gateway. Check your connection.');
    process.exit(1);
  }

  let components = parseComponents();
  console.log(`📦 Found ${components.length} components in source`);

  if (FILTER_ID) components = components.filter((c) => c.id === FILTER_ID);
  if (FILTER_CAT) components = components.filter((c) => c.category === FILTER_CAT);
  console.log(`🎯 Resolving ${components.length} components\n`);

  const results = {};
  let resolved = 0;
  let totalUrls = 0;

  // Process in batches of 3 to avoid rate limits
  for (let i = 0; i < components.length; i += 3) {
    const batch = components.slice(i, i + 3);
    const batchResults = await Promise.all(batch.map(resolveComponent));

    batch.forEach((comp, j) => {
      const urls = batchResults[j];
      results[comp.id] = urls;
      const count = Object.keys(urls).length;
      if (count > 0) {
        resolved++;
        totalUrls += count;
      }
    });

    // Brief pause between batches
    if (i + 3 < components.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`📊 Results: ${resolved}/${components.length} resolved, ${totalUrls} total URLs`);

  // Save JSON output
  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2), 'utf8');
  console.log(`💾 Saved results to ${OUTPUT}`);

  // Merge into source if not dry run
  if (!DRY_RUN) {
    mergeIntoSource(results);
  } else {
    console.log('\n⏭️  Dry run — skipping source file update');
  }

  // Summary per retailer
  const retailerCount = {};
  for (const urls of Object.values(results)) {
    for (const domain of Object.keys(urls)) {
      retailerCount[domain] = (retailerCount[domain] || 0) + 1;
    }
  }
  console.log('\n📈 URLs by retailer:');
  for (const [domain, count] of Object.entries(retailerCount).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${domain}: ${count}`);
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
