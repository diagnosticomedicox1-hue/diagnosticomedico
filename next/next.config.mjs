/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    serverExternalPackages: ['@libsql/client'],
    // Removiendo output: 'export' para permitir el uso de API routes
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

export default nextConfig;