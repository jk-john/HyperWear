import type { NextConfig } from "next";

const supabaseHostname = new URL(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
).hostname;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    // Enable image optimization for all domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Optimize for performance with Vercel Pro
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image sizes for responsive optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  // Compression
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';",
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(_next/static|favicon.ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache images for better performance
      {
        source: "/(.*\\.(png|jpg|jpeg|gif|webp|svg|ico))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;