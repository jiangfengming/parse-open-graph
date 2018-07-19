export function parseMetaFromDocument() {
  const elems = document.querySelectorAll('meta[property]')
  const result = []

  for (const el of elems) {
    result.push({
      property: el.getAttribute('property'),
      content: el.content
    })
  }

  return result
}

export function parseFromDocument(options) {
  return parse(parseMetaFromDocument(), options)
}

export function parse(meta, { alias = {}, arrays = [] } = {}) {
  alias = {
    'og:locale': 'og:locale:_',
    'og:image': 'og:image:url',
    'og:video': 'og:video:url',
    'og:audio': 'og:audio:url',
    'music:album': 'music:album:url',
    'music:song': 'music:song:url',
    'video:actor': 'video:actor:url',
    ...alias
  }

  arrays = [
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
    'book:tag',
    ...arrays
  ]

  const result = {}

  for (const m of meta) {
    const content = m.content
    let property = m.property

    if (alias[property]) property = alias[property]

    const path = property.split(':')
    let node = result
    let i = 0

    for (; i < path.length; i++) {
      const p = path[i]
      const currentPath = path.slice(0, i + 1).join(':')

      if (arrays.includes(currentPath)) {
        if (!node[p]) node[p] = []
        const array = node[p]

        if (i === path.length - 1) {
          // string array
          array.push(content)
        } else {
          // object array
          if (array.length) {
            const existing = array[array.length - 1]
            if (!existing[path[i + 1]] || arrays.includes(path.slice(0, i + 2).join(':'))) {
              node = existing
              continue
            }
          }

          const newNode = {}
          node[p].push(newNode)
          node = newNode
        }
      } else {
        if (i === path.length - 1) {
          node[p] = content
        } else {
          if (!node[p]) node[p] = {}
          node = node[p]
        }
      }
    }
  }

  return Object.keys(result).length ? result : null
}

export default {
  parse,
  parseFromDocument,
  parseMetaFromDocument
}
