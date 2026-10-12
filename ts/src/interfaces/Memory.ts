/** @module Memory */
import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'

/** Parameters of a {@link Memory} bus. */
export interface Memory_Parameters extends TSSVParameters {
  /** Width of `DATA_WR` and `DATA_RD` in bits. Default 32. */
  DATA_WIDTH?: 32 | 64 | 128 | 256 | 512 | 1024

  /** Width of `ADDR` in bits. `ADDR` is a byte address. Default 32. */
  ADDR_WIDTH?: IntRange<16, 64>
}

/**
 * `outward` is a master's port, `inward` is a slave's port, and `undefined` is a local bundle
 * that is not a port.
 */
export type Memory_Role = 'outward' | 'inward' | undefined

/**
 * A simple memory bus. It is not pipelined, and only one access is outstanding at a time. A
 * master drives it through an `outward` port and a slave answers through an `inward` port.
 * `APB_to_Memory` is a master, and `RegisterBlock`'s `regs` port is a slave.
 *
 * #### Why these signals
 *
 * The signals are chosen so that a slave can drive a synchronous SRAM macro with them, with
 * minimal glue logic. A synchronous SRAM starts one access on each clock edge where its enable
 * is high. The master raises `WE` or `RE` for exactly one cycle, so each request starts exactly
 * one access. An enable held high for several cycles would repeat the access on every edge. The
 * SRAM's registered output then holds the read data until its next access, which is what the
 * `DATA_RD` rule below asks for.
 *
 * `ADDR` is a byte address, the address software uses. It needs no logic to convert it, but the
 * slave's RTL must select the word-address bits from it. With `B = DATA_WIDTH / 8` bytes per
 * word, the word address is `ADDR[ADDR_WIDTH-1:$clog2(B)]`. The low `$clog2(B)` bits pick a byte
 * within the word, and a slave that stores whole words ignores them. `WSTRB` says which bytes of
 * the word a write changes.
 *
 * #### Handshake
 *
 * - **Request.** The master raises `WE` or `RE`, never both, for exactly one cycle, and only
 *   while `READY` is high. The slave captures the request on the next rising `clk` edge.
 * - **Hold.** The master holds `ADDR`, and for a write `DATA_WR` and `WSTRB`, from the request
 *   cycle until `READY` is high again. With a slave that has no wait states, that is the request
 *   cycle only. With one that has wait states, a slow slave can keep using them without
 *   capturing them first.
 * - **`READY`** is high while the bus holds the last settled access. A slave that needs wait
 *   states drops it from the cycle after the request until the access settles. A slave with no
 *   wait states keeps it high. A synchronous SRAM with a one-cycle read can tie it high.
 * - **`DATA_RD`.** After a read, it is valid in every cycle `READY` is high, and holds until the
 *   next request. After a write it is undefined.
 * - **`WSTRB`** has one bit per byte of `DATA_WR`: bit `i` enables `DATA_WR[8*i+7:8*i]`. Its
 *   width is `ADDR_WIDTH / 8` today instead of `DATA_WIDTH / 8`
 *   ([#81](https://github.com/TypeScriptSystemVerilog/TSSV/issues/81)).
 *
 * In the diagrams, the arrow marks the `clk` edge that captures the request, and the span on
 * `ready` marks the wait states the slave inserts.
 *
 * @wavedrom Zero-wait write
 *
 * ```json
 * {
 *   "signal": [
 *     {"name": "clk",      "wave": "p.......", "node": "...C"},
 *     {"name": "we",       "wave": "0.10....", "node": "..A"},
 *     {"name": "re",       "wave": "0......."},
 *     {"name": "addr",     "wave": "x.=x....", "data": ["A"]},
 *     {"name": "data_wr",  "wave": "x.=x....", "data": ["D"]},
 *     {"name": "wstrb",    "wave": "x.=x....", "data": ["S"]},
 *     {"name": "ready",    "wave": "1......."},
 *     {"name": "data_rd",  "wave": "x......."}
 *   ],
 *   "edge": ["A~>C capture"]
 * }
 * ```
 *
 * @wavedrom Zero-wait read
 *
 * ```json
 * {
 *   "signal": [
 *     {"name": "clk",      "wave": "p.......", "node": "...C"},
 *     {"name": "we",       "wave": "0......."},
 *     {"name": "re",       "wave": "0.10....", "node": "..A"},
 *     {"name": "addr",     "wave": "x.=x....", "data": ["A"]},
 *     {"name": "data_wr",  "wave": "x......."},
 *     {"name": "wstrb",    "wave": "x......."},
 *     {"name": "ready",    "wave": "1......."},
 *     {"name": "data_rd",  "wave": "x..=....", "data": ["Q"]}
 *   ],
 *   "edge": ["A~>C capture"]
 * }
 * ```
 *
 * @wavedrom Write with wait states
 *
 * ```json
 * {
 *   "signal": [
 *     {"name": "clk",      "wave": "p.........", "node": "...C"},
 *     {"name": "we",       "wave": "0.10......", "node": "..A"},
 *     {"name": "re",       "wave": "0........."},
 *     {"name": "addr",     "wave": "x.=...x...", "data": ["A"]},
 *     {"name": "data_wr",  "wave": "x.=...x...", "data": ["D"]},
 *     {"name": "wstrb",    "wave": "x.=...x...", "data": ["S"]},
 *     {"name": "ready",    "wave": "1..0..1...", "node": "...D..E"},
 *     {"name": "data_rd",  "wave": "x........."}
 *   ],
 *   "edge": ["A~>C capture", "D<->E wait states"]
 * }
 * ```
 *
 * @wavedrom Read with wait states
 *
 * ```json
 * {
 *   "signal": [
 *     {"name": "clk",      "wave": "p.........", "node": "...C"},
 *     {"name": "we",       "wave": "0........."},
 *     {"name": "re",       "wave": "0.10......", "node": "..A"},
 *     {"name": "addr",     "wave": "x.=...x...", "data": ["A"]},
 *     {"name": "data_wr",  "wave": "x........."},
 *     {"name": "wstrb",    "wave": "x........."},
 *     {"name": "ready",    "wave": "1..0..1...", "node": "...D..E"},
 *     {"name": "data_rd",  "wave": "x.....=...", "data": ["Q"]}
 *   ],
 *   "edge": ["A~>C capture", "D<->E wait states"]
 * }
 * ```
 *
 * @noInheritDoc
 */
export class Memory extends Interface {
  declare params: Memory_Parameters
  declare signals
  constructor (params: Memory_Parameters = {}, role: Memory_Role = undefined) {
    super(
      'memory',
      {
        DATA_WIDTH: params.DATA_WIDTH || 32,
        ADDR_WIDTH: params.ADDR_WIDTH || 32
      },
      role
    )
    this.signals =
        {
          ADDR: { width: this.params.ADDR_WIDTH || 32 },
          DATA_WR: { width: this.params.DATA_WIDTH || 32 },
          DATA_RD: { width: this.params.DATA_WIDTH || 32 },
          RE: { width: 1 },
          WE: { width: 1 },
          READY: { width: 1 },
          WSTRB: { width: (this.params.ADDR_WIDTH || 32) / 8 }
        }
    this.modports = {
      outward: {
        ADDR: 'output',
        DATA_WR: 'output',
        DATA_RD: 'input',
        WE: 'output',
        RE: 'output',
        READY: 'input',
        WSTRB: 'output'
      },
      inward: {
        ADDR: 'input',
        DATA_WR: 'input',
        DATA_RD: 'output',
        WE: 'input',
        RE: 'input',
        READY: 'output',
        WSTRB: 'input'
      }
    }
  }
}
