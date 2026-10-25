/** @type {import('next').NextConfig} */
const nextConfig = {
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
