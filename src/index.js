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

export function parseFromDocument() {
  return parse(parseMetaFromDocument())
}

export function parse(meta) {
  const appends = {
    'og:locale': '_',
    'og:image': 'url',
    'og:video': 'url',
    'og:audio': 'url',
    'music:album': 'url',
    'music:song': 'url',
    'video:actor': 'url'
  }

  const arrays = [
    ['og:image', 'url'],
    ['og:video', 'url'],
    ['og:audio', 'url'],
    ['music:album', 'url'],
    ['music:song', 'url'],
    ['video:actor', 'url'],
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

  const result = {}
  let currentArrayElement

  for (const m of meta) {
    const content = m.content
    let property = m.property

    if (appends[property]) property += ':' + appends[property]

    const path = property.split(':')
    let node
    let i = 0

    const matched = arrays.find(a => a instanceof Array && property.startsWith(a[0]) && path[path.length - 1] !== a[1])
    if (matched) {
      if (!currentArrayElement || currentArrayElement.path !== matched[0]) continue
      node = currentArrayElement.node
      i = currentArrayElement.path.split(':').length
    } else {
      node = result
      currentArrayElement = null
    }

    for (; i < path.length; i++) {
      const p = path[i]
      const currentPath = path.slice(0, i + 1).join(':')
      const isArray = arrays.some(a => (a instanceof Array ? a[0] : a) === currentPath)

      if (isArray) {
        if (!node[p]) node[p] = []

        if (i === path.length - 1) {
          node[p].push(content)
        } else {
          const newNode = {}
          node[p].push(newNode)
          node = newNode

          currentArrayElement = {
            path: currentPath,
            node
          }
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
