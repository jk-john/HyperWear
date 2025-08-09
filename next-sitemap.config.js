/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://hyperwear.io",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,

  // Transform function to set custom priorities and settings
  transform: async (config, path) => {
    // High priority pages
    if (
      path === "/" ||
      path === "/hyperliquid-tshirts" ||
      path === "/hyperliquid-mugs" ||
      path === "/hyperliquid-merchandise"
    ) {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Important product and category pages
    if (
      path === "/products" ||
      path === "/collections" ||
      path.startsWith("/products/")
    ) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // Community and content pages
    if (
      path === "/community" ||
      path === "/about-us" ||
      path === "/new-arrivals"
    ) {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      };
    }

    // Footer/legal pages
    if (
      path.includes("/privacy-policy") ||
      path.includes("/terms-of-service") ||
      path.includes("/cookie-policy") ||
      path.includes("/shipping-info") ||
      path.includes("/returns-and-refunds-policy") ||
      path.includes("/care-instructions") ||
      path.includes("/size-guide") ||
      path.includes("/taxes-and-duties") ||
      path.includes("/faq") ||
      path.includes("/support") ||
      path.includes("/careers") ||
      path.includes("/materials")
    ) {
      return {
        loc: path,
        changefreq: "yearly",
        priority: 0.3,
        lastmod: new Date().toISOString(),
      };
    }

    // Default for other pages
    return {
      loc: path,
      changefreq: "monthly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },

  // Exclude authentication and internal pages
  exclude: [
    "/sign-in",
    "/sign-up",
    "/password-reset",
    "/password-update",
    "/welcome",
    "/dashboard",
    "/dashboard/*",
    "/checkout",
    "/checkout/*",
    "/auth/*",
    "/api/*",
    "/unsubscribe",
    "/_next/*",
    "/404",
    "/500",
  ],

  // Custom robots.txt rules
  robotsTxtOptions: {
    additionalSitemaps: ["https://hyperwear.io/sitemap.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/checkout/",
          "/auth/",
          "/api/",
          "/sign-in",
          "/sign-up",
          "/password-reset",
          "/password-update",
          "/welcome",
          "/unsubscribe",
          "/_next/",
          "/404",
          "/500",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
    ],
  },
};
