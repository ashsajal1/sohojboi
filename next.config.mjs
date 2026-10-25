/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://img.clerk.com https://*.clerk.accounts.dev https://*.clerk.com; font-src 'self' data:; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com wss://*.clerk.accounts.dev wss://*.clerk.com; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com; worker-src 'self' blob:; manifest-src 'self'",
                    },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
                    },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                ],
            },
        ];
    },
    images: {
        // `domains` is deprecated in Next 15; remotePatterns keeps the same
        // allow-list and lets the optimizer serve AVIF/WebP.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30,
    },
    experimental: {
        // Tree-shake barrel-file packages (icons, dates) instead of shipping
        // whole index modules to the client.
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-icons',
            'date-fns',
        ],
    },
};

export default nextConfig;
