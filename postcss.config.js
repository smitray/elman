const join = require('path').join
const tailwindJS = join(__dirname, 'tailwind.js')
const path = require('path')
const purgecss = require('@fullhuman/postcss-purgecss')

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || []
  }
}

module.exports = {
  plugins: [
    require('tailwindcss')(tailwindJS),
    require('postcss-partial-import'),
    require('postcss-crip'),
    require('postcss-mixins'),
    require('postcss-advanced-variables'),
    require('postcss-short'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': false
      }
    }),
    require('postcss-nested'),
    require('postcss-ref'),
    require('postcss-property-lookup'),
    require('postcss-utilities'),
    require('rucksack-css'),
    require('postcss-extend'),
    require('css-mqpacker'),
    require('postcss-media-minmax'),
    require('postcss-merge-rules'),
    purgecss({
      content: [
        path.join(__dirname, './src/client/pages/**/*.vue'),
        path.join(__dirname, './src/client/layouts/**/*.vue'),
        path.join(__dirname, './src/client/components/**/*.vue')
      ],
      extractors: [
        {
          extractor: TailwindExtractor,
          extensions: ['vue', 'js', 'html']
        }
      ],
      whitelist: ['html', 'body', 'nuxt-progress']
    }),
    require('cssnano')({
        preset: 'default'
    })
  ]
}
