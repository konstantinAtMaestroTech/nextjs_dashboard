/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental:  {
        serverActions: {
            bodySizeLimit: '500mb',
        },
        ppr: 'incremental',
    },
};

export default nextConfig;
