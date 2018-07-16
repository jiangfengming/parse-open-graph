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
  let currentArray

  for (const m of meta) {
    const content = m.content
    let property = m.property

    if (alias[property]) property = alias[property]

    const path = property.split(':')
    let node = result
    let i = 0

    const parent = path.slice(0, -1).join(':')
    let arrayRoot
    for (const tag of arrays) {
      if (tag === property || tag === parent) {
        arrayRoot = tag
        break
      }
    }

    if (currentArray) {
      if (arrayRoot && currentArray.root === arrayRoot && currentArray.lead !== property) {
        node = currentArray.node
        i = currentArray.depth
      } else {
        currentArray = null
      }
    }

    for (; i < path.length; i++) {
      const p = path[i]
      const currentPath = path.slice(0, i + 1).join(':')

      if (arrayRoot === currentPath) {
        if (!node[p]) node[p] = []

        if (i === path.length - 1) {
          node[p].push(content)
          if (!currentArray) {
            currentArray = {
              root: currentPath,
              node,
              depth: i
            }
          }
        } else {
          const newNode = {}
          node[p].push(newNode)
          node = newNode
          if (!currentArray) {
            currentArray = {
              root: currentPath,
              lead: path.slice(0, i + 2).join(':'),
              node,
              depth: i + 1
            }
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
