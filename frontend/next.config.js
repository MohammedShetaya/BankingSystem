/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_API_URL: "http://localhost:8000/",
  }
}

module.exports = nextConfig
