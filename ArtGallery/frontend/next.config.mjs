/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8082/api/:path*' // Proxy to Spring Boot
        }
      ]
    }
  }
  
  export default nextConfig;