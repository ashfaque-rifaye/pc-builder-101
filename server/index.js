import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3001;

app.use(cors({ origin: (origin, cb) => { cb(null, !origin || origin.startsWith('http://localhost')); } }));
app.use(express.json());

// ─── In-memory cache with TTL ────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── User agents rotation ────────────────────────────────────────────────────
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
];

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// ─── Amazon scraper ──────────────────────────────────────────────────────────
async function scrapeAmazon(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUA(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Try multiple price selectors
    let price =
      $('span.a-price .a-offscreen').first().text().trim() ||
      $('#priceblock_ourprice').text().trim() ||
      $('#priceblock_dealprice').text().trim() ||
      $('span.a-price-whole').first().text().trim() ||
      $('.a-price .a-price-whole').first().text().trim() ||
      $('[data-a-color="price"] .a-offscreen').first().text().trim();

    const title = $('span#productTitle').text().trim() || $('h1#title span').text().trim();
    const image =
      $('img#landingImage').attr('src') ||
      $('img#imgBlkFront').attr('src') ||
      $('img#main-image').attr('src') ||
      $('img.a-dynamic-image').first().attr('src');

    const available = !$('#availability .a-color-state').text().includes('unavailable');
    const rating = $('span.a-icon-alt').first().text().trim();

    return {
      price: price || null,
      title: title || null,
      image: image || null,
      available,
      rating: rating || null,
      url,
      source: 'amazon',
      scraped: true,
    };
  } catch (err) {
    console.error(`Amazon scrape failed for ${url}:`, err.message);
    return null;
  }
}

// ─── Flipkart scraper ────────────────────────────────────────────────────────
async function scrapeFlipkart(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUA(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const price =
      $('div._30jeq3').first().text().trim() ||
      $('div._16Jk6d').first().text().trim() ||
      $('[class*="price"] div').first().text().trim();

    const title =
      $('span.B_NuCI').text().trim() ||
      $('h1._9E25nV').text().trim() ||
      $('span.VU-ZEz').text().trim();

    const image =
      $('img._396cs4').first().attr('src') ||
      $('img._2r_T1I').first().attr('src');

    return {
      price: price || null,
      title: title || null,
      image: image || null,
      available: true,
      url,
      source: 'flipkart',
      scraped: true,
    };
  } catch (err) {
    console.error(`Flipkart scrape failed for ${url}:`, err.message);
    return null;
  }
}

// ─── Generic scraper (Newegg, Walmart, BestBuy) ─────────────────────────────
async function scrapeGeneric(url, source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUA(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    let price = null;
    let title = null;
    let image = null;

    if (source === 'newegg') {
      price = $('li.price-current').first().text().trim() ||
              $('[itemprop="price"]').attr('content');
      title = $('h1.product-title').text().trim();
      image = $('img.product-view-img-original').first().attr('src');
    } else if (source === 'walmart') {
      price = $('[itemprop="price"]').attr('content') ||
              $('span[data-testid="price-wrap"]').first().text().trim();
      title = $('h1[itemprop="name"]').text().trim();
      image = $('img[data-testid="hero-image"]').first().attr('src');
    } else if (source === 'bestbuy') {
      price = $('[data-testid="customer-price"] span').first().text().trim() ||
              $('.priceView-customer-price span').first().text().trim();
      title = $('h1.heading-5').text().trim();
      image = $('img.primary-image').first().attr('src');
    }

    return {
      price: price || null,
      title: title || null,
      image: image || null,
      available: true,
      url,
      source,
      scraped: true,
    };
  } catch (err) {
    console.error(`${source} scrape failed for ${url}:`, err.message);
    return null;
  }
}

// ─── Route: scrape a product URL ─────────────────────────────────────────────
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL to prevent SSRF
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const allowedDomains = [
    'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.in',
    'amazon.co.jp', 'amazon.ca', 'amazon.com.au', 'amazon.sg', 'amazon.ae',
    'flipkart.com', 'newegg.com', 'walmart.com', 'bestbuy.com',
  ];

  const hostname = parsedUrl.hostname.replace('www.', '');
  if (!allowedDomains.some(d => hostname.endsWith(d))) {
    return res.status(400).json({ error: 'Domain not supported' });
  }

  // Check cache
  const cached = getCached(url);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  let result = null;

  if (hostname.includes('amazon')) {
    result = await scrapeAmazon(url);
  } else if (hostname.includes('flipkart')) {
    result = await scrapeFlipkart(url);
  } else if (hostname.includes('newegg')) {
    result = await scrapeGeneric(url, 'newegg');
  } else if (hostname.includes('walmart')) {
    result = await scrapeGeneric(url, 'walmart');
  } else if (hostname.includes('bestbuy')) {
    result = await scrapeGeneric(url, 'bestbuy');
  }

  if (result) {
    setCache(url, result);
    return res.json(result);
  }

  return res.json({
    price: null,
    url,
    scraped: false,
    error: 'Could not extract product data',
  });
});

// ─── Route: batch scrape multiple URLs ───────────────────────────────────────
app.post('/api/scrape/batch', async (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'urls array is required' });
  }

  // Limit batch size to prevent abuse
  const limitedUrls = urls.slice(0, 20);

  const results = await Promise.allSettled(
    limitedUrls.map(async (url) => {
      const cached = getCached(url);
      if (cached) return { ...cached, cached: true };

      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        return { url, error: 'Invalid URL' };
      }

      const hostname = parsedUrl.hostname.replace('www.', '');
      let result = null;

      if (hostname.includes('amazon')) {
        result = await scrapeAmazon(url);
      } else if (hostname.includes('flipkart')) {
        result = await scrapeFlipkart(url);
      } else if (hostname.includes('newegg')) {
        result = await scrapeGeneric(url, 'newegg');
      } else if (hostname.includes('walmart')) {
        result = await scrapeGeneric(url, 'walmart');
      } else if (hostname.includes('bestbuy')) {
        result = await scrapeGeneric(url, 'bestbuy');
      }

      if (result) {
        setCache(url, result);
        return result;
      }
      return { url, scraped: false };
    })
  );

  res.json(
    results.map((r) => (r.status === 'fulfilled' ? r.value : { error: r.reason?.message }))
  );
});

// ─── Route: search products on a retailer ────────────────────────────────────
app.get('/api/search', async (req, res) => {
  const { q, retailer = 'amazon.com' } = req.query;
  if (!q) return res.status(400).json({ error: 'Query (q) is required' });

  const cacheKey = `search:${retailer}:${q}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const searchUrl = `https://www.${retailer}/s?k=${encodeURIComponent(q)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUA(),
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract first few product results
    const products = [];
    $('[data-component-type="s-search-result"]').slice(0, 5).each((_, el) => {
      const $el = $(el);
      const asin = $el.attr('data-asin');
      const title = $el.find('h2 a span').text().trim();
      const price = $el.find('.a-price .a-offscreen').first().text().trim();
      const image = $el.find('img.s-image').attr('src');
      const link = $el.find('h2 a').attr('href');

      if (asin && title) {
        products.push({
          asin,
          title,
          price: price || null,
          image: image || null,
          url: link ? `https://www.${retailer}${link}` : `https://www.${retailer}/dp/${asin}`,
        });
      }
    });

    const result = { products, retailer, query: q };
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.json({ products: [], retailer, query: q, error: err.message });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    cache_size: cache.size,
    uptime: process.uptime(),
  });
});

// ── Gateway Configuration for LLM-powered URL resolution ─────────────────────
const GATEWAY_SPACES = [
  'https://Ashfaque94-inference-gateway.hf.space',
  'https://Ashfaque94-inference-gateway-2.hf.space',
  'https://Ashfaque94-inference-gateway-3.hf.space',
  'https://Ashfaque94-inference-gateway-4.hf.space',
  'https://Ashfaque94-inference-gateway-5.hf.space',
];
let gwIdx = 0;
function nextGateway() {
  return GATEWAY_SPACES[gwIdx++ % GATEWAY_SPACES.length];
}

// ─── Route: LLM-powered product URL resolution ──────────────────────────────
app.post('/api/resolve-url', async (req, res) => {
  const { productName, brand, category, retailers = ['amazon.com', 'newegg.com', 'bestbuy.com'] } = req.body;
  if (!productName || !brand) {
    return res.status(400).json({ error: 'productName and brand are required' });
  }

  const cacheKey = `resolve:${brand}:${productName}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const gateway = nextGateway();
  try {
    const prompt = `Find the REAL product identifiers for this PC component. Return ONLY valid JSON, no markdown.

Product: ${brand} ${productName}
Category: ${category || 'pc-component'}

{
  "amazon_asin": "B0XXXXXXXX",
  "newegg_item": "N82E168XXXXXXX",
  "bestbuy_sku": "XXXXXXX"
}

Rules:
- Amazon ASIN: exactly 10 alphanumeric chars, typically starts with B0
- Newegg: starts with N82E168
- BestBuy SKU: 7-digit number
- Return null if unsure, do NOT guess`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const llmRes = await fetch(`${gateway}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a product research assistant. Return only valid JSON.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.05,
      }),
    });
    clearTimeout(timeout);

    if (!llmRes.ok) {
      return res.json({ urls: {}, error: 'Gateway unavailable' });
    }

    const llmData = await llmRes.json();
    const content = llmData.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.json({ urls: {}, error: 'No JSON in LLM response' });
    }

    const ids = JSON.parse(jsonMatch[0]);
    const urls = {};

    // Construct and validate URLs
    const validationTasks = [];

    if (ids.amazon_asin && /^B0[A-Z0-9]{8}$/i.test(ids.amazon_asin)) {
      const url = `https://www.amazon.com/dp/${ids.amazon_asin}`;
      validationTasks.push(
        validateProductUrl(url).then((ok) => {
          if (ok) urls['amazon.com'] = url;
        })
      );
    }

    if (ids.newegg_item && /^N82E168\d+$/.test(ids.newegg_item)) {
      const url = `https://www.newegg.com/p/${ids.newegg_item}`;
      validationTasks.push(
        validateProductUrl(url).then((ok) => {
          if (ok) urls['newegg.com'] = url;
        })
      );
    }

    if (ids.bestbuy_sku && /^\d{7}$/.test(ids.bestbuy_sku)) {
      const url = `https://www.bestbuy.com/site/${ids.bestbuy_sku}.p`;
      validationTasks.push(
        validateProductUrl(url).then((ok) => {
          if (ok) urls['bestbuy.com'] = url;
        })
      );
    }

    await Promise.all(validationTasks);

    const result = { urls, productName: `${brand} ${productName}`, resolved: Object.keys(urls).length };
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.json({ urls: {}, error: err.message });
  }
});

// ─── Route: batch resolve URLs for multiple components ───────────────────────
app.post('/api/resolve-url/batch', async (req, res) => {
  const { components } = req.body;
  if (!Array.isArray(components) || components.length === 0) {
    return res.status(400).json({ error: 'components array is required' });
  }

  const limitedComponents = components.slice(0, 10);
  const results = await Promise.allSettled(
    limitedComponents.map(async (comp) => {
      const cacheKey = `resolve:${comp.brand}:${comp.productName}`;
      const cached = getCached(cacheKey);
      if (cached) return { ...cached, cached: true };

      // Use the resolve endpoint logic inline
      const gateway = nextGateway();
      try {
        const prompt = `Find the REAL product URL identifiers. Return ONLY JSON.
Product: ${comp.brand} ${comp.productName}
{"amazon_asin": "B0XXXXXXXX", "newegg_item": "N82E168XXXXXXX", "bestbuy_sku": "XXXXXXX"}
Rules: null if unsure.`;

        const llmRes = await fetch(`${gateway}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'Product research assistant. JSON only.' },
              { role: 'user', content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.05,
          }),
        });

        if (!llmRes.ok) return { urls: {}, productName: `${comp.brand} ${comp.productName}` };

        const llmData = await llmRes.json();
        const content = llmData.choices?.[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { urls: {}, productName: `${comp.brand} ${comp.productName}` };

        const ids = JSON.parse(jsonMatch[0]);
        const urls = {};

        if (ids.amazon_asin && /^B0[A-Z0-9]{8}$/i.test(ids.amazon_asin)) {
          urls['amazon.com'] = `https://www.amazon.com/dp/${ids.amazon_asin}`;
        }
        if (ids.newegg_item && /^N82E168\d+$/.test(ids.newegg_item)) {
          urls['newegg.com'] = `https://www.newegg.com/p/${ids.newegg_item}`;
        }
        if (ids.bestbuy_sku && /^\d{7}$/.test(ids.bestbuy_sku)) {
          urls['bestbuy.com'] = `https://www.bestbuy.com/site/${ids.bestbuy_sku}.p`;
        }

        const result = { urls, productName: `${comp.brand} ${comp.productName}`, resolved: Object.keys(urls).length };
        setCache(cacheKey, result);
        return result;
      } catch {
        return { urls: {}, productName: `${comp.brand} ${comp.productName}` };
      }
    })
  );

  res.json(results.map((r) => (r.status === 'fulfilled' ? r.value : { urls: {}, error: r.reason?.message })));
});

async function validateProductUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': getRandomUA(), Accept: 'text/html' },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return false;
    if (url.includes('amazon')) {
      const html = await res.text();
      return html.includes('productTitle') || html.includes('a-price');
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Route: Smart product search using LLM for any region ────────────────────
app.post('/api/smart-search', async (req, res) => {
  const { productName, brand, region = 'US' } = req.body;
  if (!productName || !brand) {
    return res.status(400).json({ error: 'productName and brand are required' });
  }

  const cacheKey = `smart:${brand}:${productName}:${region}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  const regionRetailers = {
    US: ['amazon.com', 'newegg.com', 'bestbuy.com', 'walmart.com'],
    UK: ['amazon.co.uk', 'currys.co.uk', 'scan.co.uk'],
    EU: ['amazon.de', 'amazon.fr', 'mindfactory.de'],
    IN: ['amazon.in', 'flipkart.com', 'vedantcomputers.com', 'mdcomputers.in'],
    CA: ['amazon.ca', 'newegg.ca', 'canadacomputers.com'],
    AU: ['amazon.com.au', 'scorptec.com.au', 'pccasegear.com'],
    JP: ['amazon.co.jp', 'kakaku.com'],
    SG: ['amazon.sg', 'lazada.sg'],
    AE: ['amazon.ae', 'microless.com'],
  };

  const retailers = regionRetailers[region] || regionRetailers.US;
  const gateway = nextGateway();

  try {
    const prompt = `Find the EXACT product page URLs for this PC component on these retailers.
Return ONLY valid JSON. Each URL must be a REAL direct product page URL, NOT a search results page.

Product: ${brand} ${productName}
Retailers to check: ${retailers.join(', ')}

Return format:
{
  "urls": {
    "retailer.domain": "https://exact-product-page-url",
  },
  "confidence": "high|medium|low"
}

Rules:
- Only include URLs you are confident are real product pages
- Amazon URLs should be /dp/ASIN format
- Newegg URLs should be /p/ITEM format
- Never return search result URLs (no /s?k= or /search?)
- Return empty urls {} if unsure about all`;

    const llmRes = await fetch(`${gateway}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a product URL research assistant. Return ONLY valid JSON, no markdown.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.05,
      }),
    });

    if (!llmRes.ok) {
      return res.json({ urls: {}, error: 'Gateway unavailable', region });
    }

    const llmData = await llmRes.json();
    const content = llmData.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.json({ urls: {}, error: 'No JSON in response', region });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validatedUrls = {};

    // Validate each URL
    if (parsed.urls && typeof parsed.urls === 'object') {
      for (const [domain, url] of Object.entries(parsed.urls)) {
        if (typeof url === 'string' && url.startsWith('https://') && !url.includes('/s?k=') && !url.includes('/search?')) {
          validatedUrls[domain] = url;
        }
      }
    }

    const result = {
      urls: validatedUrls,
      productName: `${brand} ${productName}`,
      region,
      resolved: Object.keys(validatedUrls).length,
      confidence: parsed.confidence || 'medium',
    };
    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.json({ urls: {}, error: err.message, region });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PC Builder API running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   POST /api/scrape         - Scrape a product URL`);
  console.log(`   POST /api/scrape/batch   - Batch scrape multiple URLs`);
  console.log(`   GET  /api/search         - Search products on a retailer`);
  console.log(`   POST /api/resolve-url    - LLM-powered URL resolution`);
  console.log(`   POST /api/smart-search   - Smart region-aware product search`);
  console.log(`   GET  /api/health         - Health check`);
});

