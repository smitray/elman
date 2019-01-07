const cfg = require('config');

module.exports = {
  srcDir: cfg.get('paths.app.client'),
  buildDir: cfg.get('paths.dist.client'),
  rootDir: './',
  head: {
    title: 'Elman 1.0',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '@/assets/css/main.css'
  ],
  loading: { color: '#3B8070' },
  build: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  },
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/apollo'
  ],
  manifest: {
    name: 'Elman',
    description: 'SSR based boilerplate',
    theme_color: '#000'
  },
  apollo: {
    clientConfigs: {
      default: '@/graphql/config'
    }
  },
  plugins: []
};
