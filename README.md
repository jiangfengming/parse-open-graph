# parse-open-graph
Cross-platform Open Graph parser

## Usage

### Broswer
```js
const { parseFromDocument } = require('parse-open-graph')
const result = parseFromDocument()
console.log(result)
```

### Node.js
```js
const { parse } = require('parse-open-graph')
const cheerio = require('cheerio')

const html = `
<meta property="og:title" content="The Rock" />
<meta property="og:type" content="video.movie" />
<meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
<meta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
`
const $ = cheerio.load(html)

const meta = $('meta[property]').map((i, el) => ({
  property: $(el).attr('property'),
  content: $(el).attr('content')
})).get()

const result = parse(meta)
console.log(JSON.stringify(result, null, 2))
```

## APIs

### parseMetaFromDocument()
Parses the meta to arrays from document.

Return format:
```js
[
  {
    "property": "og:title",
    "content": "Open Graph protocol"
  },
  {
    "property": "og:type",
    "content": "website"
  },
  {
    "property": "og:url",
    "content": "http://ogp.me/"
  },
  {
    "property": "og:image",
    "content": "http://ogp.me/logo.png"
  },
  ...
]
```

### parse(meta, options)
Parses meta arrays to structured objects.

Params:  
`meta`: Meta arrays. The format is the same as the return value of `parseMetaFromDocument()`.  
`options`: Parse options. Defaults:
```js
{
  alias: {
    'og:locale': 'og:locale:_', // `og:locale` will be parsed to `og.local._`
    'og:image': 'og:image:url',
    'og:video': 'og:video:url',
    'og:audio': 'og:audio:url',
    'music:album': 'music:album:url',
    'music:song': 'music:song:url',
    'video:actor': 'video:actor:url'
  },

  arrays: [
    'og:image',
    'og:video',
    'og:audio',
    'music:album',
    'music:song',
    'video:actor',
    'og:locale:alternate',
    'music:musician',
    'music:creator',
    'video:director',
    'video:writer',
    'video:tag',
    'article:author',
    'article:tag',
    'book:author',
    'book:tag'
  ]
}
```

Your custom `alias` and `arrays` options will be merged into default options.

Return format:
```js
{
  og: {
    title: 'Open Graph protocol',
    type: 'website',
    url: 'http://ogp.me/',
    image: [
      {
        url: 'http://ogp.me/logo.png',
        type: 'image/png',
        width: '300',
        height: '300',
        alt: 'The Open Graph logo'
      }
    ]
    description: 'The Open Graph protocol enables any web page to become a rich object in a social graph.'
  },
  fb: {
    app_id: '115190258555800'
  }
}
```

See [examples/browser.html](examples/browser.html) for example.

### parseFromDocument(options)
Shortcut of `parse(parseMetaFromDocument(), options)`

## License
[MIT](LICENSE)
