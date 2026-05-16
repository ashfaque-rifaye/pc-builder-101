import { buildAffiliateUrl, type RegionCode } from '../data/regions';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ScrapedProduct {
  price: string | null;
  title: string | null;
  image: string | null;
  available: boolean;
  url: string;
  source: string;
  scraped: boolean;
  cached?: boolean;
  error?: string;
}

export interface RetailerInfo {
  name: string;
  domain: string;
  logo: string;
  color: string;
  regions: RegionCode[];
}

export interface ProductLink {
  retailer: RetailerInfo;
  url: string;
  isSearchFallback?: boolean;
}

// ─── Retailer registry ──────────────────────────────────────────────────────
export const RETAILERS: Record<string, RetailerInfo> = {
  'amazon.com':    { name: 'Amazon US',      domain: 'amazon.com',     logo: '🛒', color: '#FF9900', regions: ['US', 'GLOBAL'] },
  'amazon.co.uk':  { name: 'Amazon UK',      domain: 'amazon.co.uk',   logo: '🛒', color: '#FF9900', regions: ['UK'] },
  'amazon.de':     { name: 'Amazon DE',      domain: 'amazon.de',      logo: '🛒', color: '#FF9900', regions: ['EU'] },
  'amazon.fr':     { name: 'Amazon FR',      domain: 'amazon.fr',      logo: '🛒', color: '#FF9900', regions: ['EU'] },
  'amazon.in':     { name: 'Amazon India',   domain: 'amazon.in',      logo: '🛒', color: '#FF9900', regions: ['IN'] },
  'amazon.co.jp':  { name: 'Amazon Japan',   domain: 'amazon.co.jp',   logo: '🛒', color: '#FF9900', regions: ['JP'] },
  'amazon.ca':     { name: 'Amazon Canada',  domain: 'amazon.ca',      logo: '🛒', color: '#FF9900', regions: ['CA'] },
  'amazon.com.au': { name: 'Amazon AU',      domain: 'amazon.com.au',  logo: '🛒', color: '#FF9900', regions: ['AU'] },
  'amazon.sg':     { name: 'Amazon SG',      domain: 'amazon.sg',      logo: '🛒', color: '#FF9900', regions: ['SG'] },
  'amazon.ae':     { name: 'Amazon UAE',     domain: 'amazon.ae',      logo: '🛒', color: '#FF9900', regions: ['AE'] },
  'flipkart.com':  { name: 'Flipkart',       domain: 'flipkart.com',   logo: '🏷️', color: '#2874F0', regions: ['IN'] },
  'newegg.com':    { name: 'Newegg',         domain: 'newegg.com',     logo: '🖥️', color: '#F7A51C', regions: ['US', 'GLOBAL'] },
  'newegg.ca':     { name: 'Newegg CA',      domain: 'newegg.ca',      logo: '🖥️', color: '#F7A51C', regions: ['CA'] },
  'walmart.com':   { name: 'Walmart',        domain: 'walmart.com',    logo: '🏪', color: '#0071CE', regions: ['US'] },
  'bestbuy.com':   { name: 'Best Buy',       domain: 'bestbuy.com',    logo: '📦', color: '#0046BE', regions: ['US'] },
  'currys.co.uk':  { name: 'Currys',         domain: 'currys.co.uk',   logo: '🛍️', color: '#4B0082', regions: ['UK'] },
  'scan.co.uk':    { name: 'Scan UK',        domain: 'scan.co.uk',     logo: '🖥️', color: '#000000', regions: ['UK'] },
  'mindfactory.de':{ name: 'Mindfactory',    domain: 'mindfactory.de', logo: '⚙️', color: '#1B1464', regions: ['EU'] },
  'vedantcomputers.com': { name: 'Vedant Computers', domain: 'vedantcomputers.com', logo: '💻', color: '#0A2643', regions: ['IN'] },
  'mdcomputers.in':{ name: 'MD Computers',   domain: 'mdcomputers.in', logo: '💻', color: '#000000', regions: ['IN'] },
  'canadacomputers.com': { name: 'Canada Computers', domain: 'canadacomputers.com', logo: '🍁', color: '#D3222A', regions: ['CA'] },
  'scorptec.com.au': { name: 'Scorptec',     domain: 'scorptec.com.au',logo: '🦂', color: '#013D82', regions: ['AU'] },
  'pccasegear.com':{ name: 'PC Case Gear',   domain: 'pccasegear.com', logo: '⚙️', color: '#00AEEF', regions: ['AU'] },
  'kakaku.com':    { name: 'Kakaku',         domain: 'kakaku.com',     logo: '🔍', color: '#E4002B', regions: ['JP'] },
  'lazada.sg':     { name: 'Lazada SG',      domain: 'lazada.sg',      logo: '🛍️', color: '#0F136D', regions: ['SG'] },
  'microless.com': { name: 'Microless',      domain: 'microless.com',  logo: '🖥️', color: '#27B8E6', regions: ['AE'] },
};

const RETAILER_PRIORITY: Partial<Record<RegionCode, string[]>> = {
  US: ['newegg.com', 'bestbuy.com', 'walmart.com', 'amazon.com'],
  CA: ['canadacomputers.com', 'newegg.ca', 'amazon.ca'],
  IN: ['mdcomputers.in', 'vedantcomputers.com', 'flipkart.com', 'amazon.in'],
  GLOBAL: ['newegg.com', 'amazon.com'],
  UK: ['scan.co.uk', 'currys.co.uk', 'amazon.co.uk'],
  EU: ['mindfactory.de', 'amazon.de', 'amazon.fr'],
  AU: ['scorptec.com.au', 'pccasegear.com', 'amazon.com.au'],
  JP: ['kakaku.com', 'amazon.co.jp'],
  SG: ['lazada.sg', 'amazon.sg'],
  AE: ['microless.com', 'amazon.ae'],
};

function isAmazonDomain(domain: string): boolean {
  return domain.startsWith('amazon.');
}

function getRetailerRank(domain: string, region: RegionCode): number {
  const priorities = RETAILER_PRIORITY[region] ?? [];
  const explicitRank = priorities.indexOf(domain);
  if (explicitRank >= 0) return explicitRank;
  if (isAmazonDomain(domain)) return priorities.length + 10;
  return priorities.length + 1;
}

// ─── Get retailers available for a region ────────────────────────────────────
export function getRetailersForRegion(region: RegionCode): RetailerInfo[] {
  return Object.values(RETAILERS).filter(
    (r) => r.regions.includes(region) || r.regions.includes('GLOBAL')
  );
}

// ─── Scrape a product URL ────────────────────────────────────────────────────
export async function scrapeProduct(url: string): Promise<ScrapedProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/api/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── Batch scrape multiple URLs ──────────────────────────────────────────────
export async function scrapeProducts(urls: string[]): Promise<(ScrapedProduct | null)[]> {
  try {
    const res = await fetch(`${API_BASE}/api/scrape/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });
    if (!res.ok) return urls.map(() => null);
    return await res.json();
  } catch {
    return urls.map(() => null);
  }
}

// ─── Check if backend is available ──────────────────────────────────────────
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Get product URLs for a component across retailers ──────────────────────
export function getProductUrls(
  productUrls: Record<string, string> | undefined,
  region: RegionCode
): ProductLink[] {
  if (!productUrls) return [];

  const regionRetailers = getRetailersForRegion(region);
  const results: ProductLink[] = [];

  for (const retailer of regionRetailers) {
    const url = productUrls[retailer.domain];
    if (url) {
      results.push({ retailer, url });
    }
  }

  return results.sort((left, right) => {
    return getRetailerRank(left.retailer.domain, region) - getRetailerRank(right.retailer.domain, region);
  });
}

export function getPurchaseLinks(
  productUrls: Record<string, string> | undefined,
  region: RegionCode,
  productName: string
): ProductLink[] {
  const directLinks = getProductUrls(productUrls, region);
  if (directLinks.length === 0) return [];

  const hasNonAmazonOption = directLinks.some((link) => !isAmazonDomain(link.retailer.domain));
  if (hasNonAmazonOption) return directLinks;

  return directLinks.map((link, index) => {
    if (index > 0) return link;
    return {
      ...link,
      url: buildAffiliateUrl(productName, region),
      isSearchFallback: true,
    };
  });
}

export function getPreferredPurchaseUrl(
  productUrls: Record<string, string> | undefined,
  region: RegionCode,
  productName: string
): string | null {
  return getPurchaseLinks(productUrls, region, productName)[0]?.url ?? null;
}

// ─── Runtime LLM-powered URL resolution (via inference gateway) ─────────────
interface ResolvedUrls {
  urls: Record<string, string>;
  productName: string;
  resolved: number;
  cached?: boolean;
  error?: string;
}

export async function resolveProductUrl(
  productName: string,
  brand: string,
  category: string
): Promise<ResolvedUrls | null> {
  try {
    const res = await fetch(`${API_BASE}/api/resolve-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, brand, category }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function resolveProductUrlsBatch(
  components: { productName: string; brand: string; category?: string }[]
): Promise<ResolvedUrls[]> {
  try {
    const res = await fetch(`${API_BASE}/api/resolve-url/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ components }),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Enhanced purchase links: tries static URLs first, then falls back to
 * LLM-resolved URLs via the inference gateway.
 */
export async function getSmartPurchaseUrl(
  productUrls: Record<string, string> | undefined,
  region: RegionCode,
  productName: string,
  brand: string,
  category: string
): Promise<string | null> {
  // Try static URLs first
  const staticUrl = getPreferredPurchaseUrl(productUrls, region, productName);
  if (staticUrl && !staticUrl.includes('/s?k=')) return staticUrl;

  // Fall back to LLM resolution
  const resolved = await resolveProductUrl(productName, brand, category);
  if (resolved && resolved.resolved > 0) {
    // Find best URL for the user's region
    const regionRetailers = getRetailersForRegion(region);
    for (const retailer of regionRetailers) {
      if (resolved.urls[retailer.domain]) return resolved.urls[retailer.domain];
    }
    // Return any resolved URL
    const firstUrl = Object.values(resolved.urls)[0];
    if (firstUrl) return firstUrl;
  }

  // Final fallback to search URL
  return staticUrl;
}

/**
 * Region-aware smart search: asks the LLM gateway to find real product URLs
 * for the user's specific region (India → Flipkart/Amazon.in, US → Newegg/BestBuy, etc.)
 */
export async function smartSearchProduct(
  productName: string,
  brand: string,
  region: RegionCode
): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/api/smart-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, brand, region }),
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.urls || {};
  } catch {
    return {};
  }
}

