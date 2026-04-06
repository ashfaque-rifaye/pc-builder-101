// ─── Theme ─────────────────────────────────────────────────────────────────────
export type ThemeId = 'dark' | 'light' | 'cyberpunk' | 'ocean' | 'sunset' | 'forest';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  emoji: string;
  accent: string; // hex for the swatch preview
}

export const THEMES: ThemeConfig[] = [
  { id: 'dark',      label: 'Dark',      emoji: '🌑', accent: '#00f5ff' },
  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '⚡', accent: '#f700ff' },
  { id: 'ocean',     label: 'Ocean',     emoji: '🌊', accent: '#00c9ff' },
  { id: 'sunset',    label: 'Sunset',    emoji: '🌅', accent: '#ff6b35' },
  { id: 'forest',    label: 'Forest',    emoji: '🌿', accent: '#00ff88' },
  { id: 'light',     label: 'Light',     emoji: '☀️',  accent: '#2563eb' },
];

// ─── Region ────────────────────────────────────────────────────────────────────
export type RegionCode = 'US' | 'UK' | 'EU' | 'IN' | 'AU' | 'JP' | 'CA' | 'SG' | 'AE' | 'GLOBAL';

export interface RegionConfig {
  code: RegionCode;
  label: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  /** Exchange rate relative to USD */
  usdRate: number;
  /** Amazon affiliate base URL */
  amazonDomain: string;
}

export const REGIONS: RegionConfig[] = [
  { code: 'US',     label: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$',  usdRate: 1.00,  amazonDomain: 'amazon.com' },
  { code: 'UK',     label: 'United Kingdom',flag: '🇬🇧', currency: 'GBP', currencySymbol: '£',  usdRate: 0.79,  amazonDomain: 'amazon.co.uk' },
  { code: 'EU',     label: 'Europe',        flag: '🇪🇺', currency: 'EUR', currencySymbol: '€',  usdRate: 0.92,  amazonDomain: 'amazon.de' },
  { code: 'CA',     label: 'Canada',        flag: '🇨🇦', currency: 'CAD', currencySymbol: 'CA$',usdRate: 1.37,  amazonDomain: 'amazon.ca' },
  { code: 'AU',     label: 'Australia',     flag: '🇦🇺', currency: 'AUD', currencySymbol: 'A$', usdRate: 1.53,  amazonDomain: 'amazon.com.au' },
  { code: 'IN',     label: 'India',         flag: '🇮🇳', currency: 'INR', currencySymbol: '₹',  usdRate: 83.5,  amazonDomain: 'amazon.in' },
  { code: 'JP',     label: 'Japan',         flag: '🇯🇵', currency: 'JPY', currencySymbol: '¥',  usdRate: 149.5, amazonDomain: 'amazon.co.jp' },
  { code: 'SG',     label: 'Singapore',     flag: '🇸🇬', currency: 'SGD', currencySymbol: 'S$', usdRate: 1.34,  amazonDomain: 'amazon.sg' },
  { code: 'AE',     label: 'UAE',           flag: '🇦🇪', currency: 'AED', currencySymbol: 'د.إ',usdRate: 3.67,  amazonDomain: 'amazon.ae' },
  { code: 'GLOBAL', label: 'Global',        flag: '🌍', currency: 'USD', currencySymbol: '$',  usdRate: 1.00,  amazonDomain: 'amazon.com' },
];

export function getRegion(code: RegionCode): RegionConfig {
  return REGIONS.find((r) => r.code === code) ?? REGIONS[0];
}

/** Format a USD price into the selected region's currency */
export function formatPrice(usdPrice: number, regionCode: RegionCode): string {
  const region = getRegion(regionCode);
  const converted = usdPrice * region.usdRate;
  const sym = region.currencySymbol;

  if (region.currency === 'JPY' || region.currency === 'INR') {
    return `${sym}${Math.round(converted).toLocaleString()}`;
  }
  return `${sym}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** Build a regional Amazon search URL for a product name */
export function buildAffiliateUrl(productName: string, regionCode: RegionCode): string {
  const region = getRegion(regionCode);
  const q = encodeURIComponent(productName);
  return `https://www.${region.amazonDomain}/s?k=${q}`;
}

/** Detect region from browser locale (best effort) */
export function detectRegion(): RegionCode {
  try {
    const lang = navigator.language || '';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (lang.startsWith('ja') || tz.startsWith('Asia/Tokyo')) return 'JP';
    if (lang.startsWith('hi') || tz.startsWith('Asia/Kolkata')) return 'IN';
    if (tz.startsWith('Australia/')) return 'AU';
    if (tz.startsWith('Asia/Singapore')) return 'SG';
    if (tz.startsWith('Asia/Dubai')) return 'AE';
    if (lang === 'en-GB' || tz.startsWith('Europe/London')) return 'UK';
    if (lang.startsWith('en-CA') || tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver')) return 'CA';
    if (lang.startsWith('de') || lang.startsWith('fr') || lang.startsWith('es') || lang.startsWith('it') || lang.startsWith('nl')) return 'EU';
    if (tz.startsWith('Europe/')) return 'EU';
  } catch { /* ignore */ }
  return 'US';
}
