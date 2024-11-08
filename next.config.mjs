/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental:  {
        serverActions: {
            bodySizeLimit: '500mb',
        },
        ppr: 'incremental',
    },
    typescript: {
        ignoreBuildErrors: true, // this is a bad practice again
    },
    reactStrictMode: false
};

export default nextConfig;
