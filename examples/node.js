/* eslint no-console: "off" */

const { parse } = require('..')
const cheerio = require('cheerio')
const { readFileSync } = require('fs')

const html = readFileSync(__dirname + '/browser.html', 'utf8')
const $ = cheerio.load(html)

const meta = $('meta[property]').map((i, el) => ({
  property: $(el).attr('property'),
  content: $(el).attr('content')
})).get()

const result = parse(meta, {
  // these tag has attributes
  alias: {
    'sitemap:video:player_loc': 'sitemap:video:player_loc:_',
    'sitemap:video:restriction': 'sitemap:video:restriction:_',
    'sitemap:video:platform': 'sitemap:video:platform:_',
    'sitemap:video:price': 'sitemap:video:price:_',
    'sitemap:video:uploader': 'sitemap:video:uploader:_'
  },

  arrays: [
    'sitemap:image',
    'sitemap:video',
    'sitemap:video:tag'
  ]
})

console.log(JSON.stringify(result, null, 2))
