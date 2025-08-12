import { NextRequest } from 'next/server';

// Generate secure CSP nonce (Edge Runtime compatible)
export function generateNonce(): string {
  // Use Web Crypto API which is available in Edge Runtime
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Convert to base64 (Edge Runtime compatible)
  return btoa(String.fromCharCode(...array));
}

// Secure CSP configuration with nonces
export function getSecureCSP(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://checkout.stripe.com`,
    "child-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: *.supabase.co *.hyperwear.io",
    "media-src 'self'",
    `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} https://api.resend.com https://api.hyperliquid.xyz https://vitals.vercel-insights.com https://*.ingest.sentry.io https://*.supabase.co https://api.stripe.com`,
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

// Rate limiting utility
interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 100, windowMs: 60000 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowKey = `${identifier}:${Math.floor(now / options.windowMs)}`;
  
  const current = rateLimitStore.get(windowKey) || { count: 0, resetTime: now + options.windowMs };
  
  if (current.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  current.count += 1;
  rateLimitStore.set(windowKey, current);
  
  // Clean up old entries
  setTimeout(() => {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < Date.now()) {
        rateLimitStore.delete(key);
      }
    }
  }, options.windowMs);
  
  return {
    success: true,
    remaining: options.maxRequests - current.count,
    resetTime: current.resetTime
  };
}

// Get client identifier for rate limiting (Edge Runtime compatible)
export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Include user agent to make it harder to bypass
  const userAgent = request.headers.get('user-agent') || '';
  
  // Create a simple hash using Edge Runtime compatible methods
  const identifier = `${ip}:${userAgent}`;
  
  // Simple hash function for Edge Runtime
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 16);
}

// Sanitize error messages for production
export function sanitizeError(error: unknown, context?: string): { message: string; code?: string } {
  if (process.env.NODE_ENV === 'development') {
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error ? error.name : undefined
    };
  }
  
  // In production, return generic messages for security
  const productionMessages: Record<string, string> = {
    'auth': 'Authentication required',
    'validation': 'Invalid request data',
    'not_found': 'Resource not found',
    'forbidden': 'Access denied',
    'rate_limit': 'Too many requests',
    'server': 'Internal server error'
  };
  
  return {
    message: productionMessages[context || 'server'] || 'An error occurred',
    code: context
  };
}

// SVG sanitization utility
export function sanitizeSVG(svgContent: string): string {
  // Remove potentially dangerous elements and attributes
  const dangerousElements = /<(script|object|embed|link|meta|iframe|form|input)[^>]*>/gi;
  const dangerousAttributes = /(on\w+|href|src)\s*=\s*["'][^"']*["']/gi;
  const dangerousUrls = /(javascript:|data:|vbscript:|file:)/gi;
  
  return svgContent
    .replace(dangerousElements, '')
    .replace(dangerousAttributes, '')
    .replace(dangerousUrls, '');
}

// Secure headers utility
export function getSecurityHeaders(nonce?: string) {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  };
  
  if (nonce) {
    headers['Content-Security-Policy'] = getSecureCSP(nonce);
  }
  
  return headers;
}