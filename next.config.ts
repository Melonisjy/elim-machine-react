import type { NextConfig } from 'next'

const withPWA = require('next-pwa')({
  dest: 'public',
  maximumFileSizeToCacheInBytes: 7000000
})

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.170/workspace_refactoring/api/:path*",
      }
    ]
  },
  basePath: process.env.BASEPATH,

  // redirects: async () => {
  //   return [
  //     // 기본적으로 캘린더로 가도록
  //     // {
  //     //   source: '/',
  //     //   destination: '/calendar',
  //     //   permanent: true,
  //     //   locale: false
  //     // }
  //     // {
  //     //   source: '/:lang(en|fr|ar)',
  //     //   destination: '/:lang(en|fr|ar)/calendar',
  //     //   permanent: true,
  //     //   locale: false
  //     // },
  //     // {
  //     //   source: '/:path((?!en|fr|ar|front-pages|favicon\\.ico|api|images|fonts|_next|public).*)',
  //     //   destination: '/en/:path',
  //     //   permanent: true,
  //     //   locale: false
  //     // }
  //   ]
  // },

  // IP주소로 접속 가능
  allowedDevOrigins: ['http://192.168.0.50', '192.168.0.50']
}

module.exports = withPWA(nextConfig)

export default nextConfig
