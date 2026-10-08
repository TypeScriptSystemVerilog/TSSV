// TypeDoc plugin, loaded by typedoc.config.mjs: rewrites each `@wavedrom` tag
// in the JSDoc into the markdown form scripts/render-wavedrom.mjs renders, so
// the generated reference shows the diagram as an SVG instead of raw JSON.
//
// In the source, a tag is a label on the tag line and a fenced json block:
//
//   @wavedrom Write on `regs`
//   ```json
//   { "signal": [ ... ] }
//   ```
//
// In the generated page it becomes
//
//   Write on `regs`
//
//   <!-- wavedrom RegisterBlock-write-on-regs.svg
//   { "signal": [ ... ] }
//   -->
//
//   ![Write on `regs`](RegisterBlock-write-on-regs.svg)
//
// and `npm run docs` then runs render-wavedrom.mjs on doc/reference/ to write
// the SVG beside the page. The SVG is named after the documented item and the
// label, so reordering diagrams doesn't rename them.

import { Converter, ReflectionKind } from 'typedoc'

const TAG = /^([^\n]*)\n+```json\n([\s\S]*?)\n```\s*$/

function slug (text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function load (app) {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, context => {
    const used = new Map()
    for (const refl of context.project.getReflectionsByKind(ReflectionKind.All)) {
      const tags = refl.comment?.blockTags.filter(t => t.tag === '@wavedrom') ?? []
      tags.forEach((tag, i) => {
        const where = `@wavedrom on ${refl.getFullName()}`
        const m = TAG.exec(tag.content.map(p => p.text).join(''))
        if (m === null) {
          app.logger.error(`${where}: expected a label line, then a fenced json block and nothing else`)
          return
        }
        const [, label, json] = m
        try {
          JSON.parse(json)
        } catch (e) {
          app.logger.error(`${where}: invalid JSON: ${e.message}`)
          return
        }
        if (json.includes('--')) {
          app.logger.error(`${where}: the JSON must not contain "--", which would end the HTML comment`)
          return
        }
        const svg = `${refl.name}-${slug(label) || `wavedrom-${i + 1}`}.svg`
        if (used.has(svg)) {
          app.logger.error(`${where}: ${svg} is also used by ${used.get(svg)}; give the diagrams different labels`)
          return
        }
        used.set(svg, where)
        const alt = label.trim() || `${refl.name} timing`
        const caption = label.trim() === '' ? '' : `${label.trim()}\n\n`
        tag.content = [{ kind: 'text', text: `${caption}<!-- wavedrom ${svg}\n${json}\n-->\n\n![${alt}](${svg})` }]
      })
    }
  })
}
