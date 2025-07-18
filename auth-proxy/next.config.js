/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `https://jhxxuhisdypknlvhaklm.supabase.co/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
