/** @type {import('next').NextConfig} */
const nextConfig = {
  externals: [webpackNodeExternals()],
};

export default nextConfig;
