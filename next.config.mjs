/** @type {import('next').NextConfig} */
const nextConfig = {};
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

export default nextConfig;

if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
}