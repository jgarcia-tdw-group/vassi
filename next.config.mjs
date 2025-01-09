import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async redirects() {
        return [
            // Add any redirects here
            // {
            //   source: '/old-path',
            //   destination: '/new-path',
            //   permanent: true,
            // },
        ];
    },
    env: {
        // biome-ignore lint/style/useNamingConvention: constant
        DB_SERVER: process.env.DB_SERVER,
        // biome-ignore lint/style/useNamingConvention: constant
        DB_PORT: process.env.DB_PORT,
        // biome-ignore lint/style/useNamingConvention: constant
        DB_NAME: process.env.DB_NAME,
        // biome-ignore lint/style/useNamingConvention: constant
        DB_USER: process.env.DB_USER,
        // biome-ignore lint/style/useNamingConvention: constant
        DB_PASSWORD: process.env.DB_PASSWORD,
        // biome-ignore lint/style/useNamingConvention: constant
        DB_ENCRYPT: process.env.DB_ENCRYPT,
        // biome-ignore lint/style/useNamingConvention: constant
        DB_TRUST_CERT: process.env.DB_TRUST_CERT,
    },
};

export default nextConfig;
