function parseMetaFromDocument() {
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

function parseFromDocument() {
  return parse(parseMetaFromDocument())
}

function parse(meta) {
  const objs = {
    'og:image': 'og:image:url',
    'og:video': 'og:video:url',
    'og:audio': 'og:audio:url',
    'og:locale': 'og:locale:value',
    'music:album': 'music:album:url',
    'music:song': 'music:song:url',
    'video:actor': 'video:actor:url'
  }

  const objKeys = Object.keys(objs)
  const objValues = Object.values(objs)

  const arrays = [
    'og:image',
    'og:video',
    'og:audio',
    'og:locale:alternate',
    'music:album',
    'music:song',
    'music:musician',
    'music:creator',
    'video:actor',
    'video:director',
    'video:writer',
    'video:tag',
    'article:author',
    'article:tag',
    'book:author',
    'book:tag'
  ]

  const result = {}
  let currentObj

  for (const m of meta) {
    const content = m.content
    let property = m.property

    if (objs[property]) property = objs[property]

    const path = property.split(':')

    if (!objValues.includes(property) && objKeys.some(s => property.startsWith(s))) {
      if (currentObj) {
        currentObj[path.pop()] = content
      }
    } else {
      let node = result

      for (let i = 0; i < path.length; i++) {
        const p = path[i]

        const isArray = arrays.includes(path.slice(0, i + 1).join(':'))

        if (i === path.length - 1) {
          if (isArray) {
            if (!node[p]) node[p] = []
            node[p].push(content)
          } else {
            node[p] = content
          }
        } else {
          if (isArray) {
            if (!node[p]) node[p] = []
            const newNode = {}
            node[p].push(newNode)
            node = newNode
          } else {
            if (!node[p]) node[p] = {}
            node = node[p]
          }
        }
      }

      if (objValues.includes(property)) {
        currentObj = node
      }
    }
  }

  return result
}

export {
  parse,
  parseFromDocument,
  parseMetaFromDocument
}
