/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    serverExternalPackages: ['@libsql/client'],
    output: 'standalone',
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

export default nextConfig;