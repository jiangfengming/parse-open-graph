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

const result = parse(meta)
console.log(JSON.stringify(result, null, 2))
