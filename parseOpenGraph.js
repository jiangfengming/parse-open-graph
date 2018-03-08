function parseOpenGraph(doc = document) {
  const alias = {
    'og:image': 'og:image:url',
    'og:video': 'og:video:url',
    'og:audio': 'og:audio:url'
  }

  const elems = doc.querySelectorAll('meta[property]')
  const result = {}

  for (const el of elems) {
    let prop = el.getAttribute('property')
    if (alias[prop]) prop = alias[prop]
    const value = el.content

    const path = prop.split(':')
    let depth = result
    for (let i = 0; i < path.length; i++) {
      const p = path[i]
      if (i === path.length - 1) {
        depth[p] = el.content
      } else {
        if (!depth[p]) depth[p] = {}
        depth = depth[p]
      }
    }
  }

  return result
}

module.exports = parseOpenGraph
