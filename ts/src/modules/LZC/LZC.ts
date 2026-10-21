/*
* Leading zero counter for data of any width from 1 to 256 bits, by dichotomy: each level of a
* binary tree checks whether the upper half of the word is all zeros, and keeps the half that
* holds the leading one
*/
import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'

/**
 * configuration parameters of the LZC module
 */
export interface LZC_Parameters extends TSSVParameters {
  /**
     * bit width of LZC data
     */
  dataWidth: IntRange<1, 256>
}

/**
 * Counts the leading zeros of `data_in`, combinationally.
 *
 * @see doc/modules/LZC/LZC-spec.md
 */
export class LZC extends Module {
  declare params: LZC_Parameters
  constructor (params: LZC_Parameters) {
    super({
      name: params.name,
      dataWidth: params.dataWidth
    })

    // parameter checks (PARAM-5): the type rules out a bad width; this catches callers from JavaScript
    const dataWidth = this.params.dataWidth
    if (!Number.isInteger(dataWidth) || dataWidth < 1 || dataWidth > 256) {
      throw Error(`LZC: dataWidth must be an integer from 1 to 256, got ${dataWidth}`)
    }

    // derived values: the tree works on data_in zero-padded on the left to a power of 2
    let levels = 0
    while (2 ** levels < dataWidth) levels++
    const paddedWidth = 2 ** levels
    const padding = paddedWidth - dataWidth
    const countWidth = this.bitWidth(dataWidth) // holds every count from 0 to dataWidth

    this.IOs = {
      data_in: { direction: 'input', width: dataWidth },
      zero_num: { direction: 'output', width: countWidth },
      is_zero: { direction: 'output' }
    }

    // is_zero compares data_in directly, so it doesn't wait for the tree
    this.addAssign({ in: new Expr("(data_in == '0)"), out: 'is_zero' })

    if (levels === 0) {
      // a 1-bit word has no tree: one leading zero exactly when it is zero
      this.addAssign({ in: new Expr('is_zero'), out: 'zero_num' })
      return
    }

    // the padded word
    let word = 'data_in'
    if (padding > 0) {
      word = `val${paddedWidth}`
      this.addSignal(word, { width: paddedWidth })
      this.addAssign({ in: new Expr(`{${padding}'d0, data_in}`), out: word })
    }

    // the tree: level i sets cnt[i] when the upper half of the word is all zeros, then keeps the
    // half that holds the leading one in val<half>. For a non-zero word, cnt is then the
    // leading-zero count of the padded word.
    this.addSignal('cnt', { width: levels })
    const outputs = ['cnt']
    let body = 'begin : lz_tree\n'
    for (let i = levels - 1; i >= 0; i--) {
      const half = 2 ** i
      const cntBit = levels === 1 ? 'cnt' : `cnt[${i}]`
      const upper = half === 1 ? `${word}[1]` : `${word}[${2 * half - 1}:${half}]`
      const lower = half === 1 ? `${word}[0]` : `${word}[${half - 1}:0]`
      const next = `val${half}`
      this.addSignal(next, { width: half })
      outputs.push(next)
      body += `  ${cntBit} = (${upper} == '0);\n`
      body += `  ${next} = ${cntBit} ? ${lower} : ${upper};\n`
      word = next
    }
    body += 'end\n'
    this.addCombAlways({ outputs }, body)

    // val1, the last bit the tree keeps, is the leading one, or 0 when data_in is all zeros. cnt
    // alone can't tell all zeros from a single one in the lowest bit, so val1 picks dataWidth.
    // A count of the padded word includes the padding; the cast drops the subtraction's borrow,
    // which is never set, since the padding is always leading (WIDTH-2).
    const count = padding > 0
      ? `${countWidth}'(cnt - ${this.bitWidth(padding)}'d${padding})`
      : `${countWidth}'(cnt)`
    this.addAssign({ in: new Expr(`val1 ? ${count} : ${countWidth}'d${dataWidth}`), out: 'zero_num' })
  }
}

export default LZC
