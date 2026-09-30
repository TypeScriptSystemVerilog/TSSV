import { spawnSync } from 'node:child_process'

export interface VeribleOpts {
  veriblePath?: string
  veribleFlags?: string[]
  failOnFormatError?: boolean
  formatTimeoutMs?: number
}

export function runVerible (sv: string, opts: VeribleOpts): string {
  const binary = opts.veriblePath ?? 'verible-verilog-format'
  const args = [...(opts.veribleFlags ?? []), '-']
  const timeout = opts.formatTimeoutMs ?? 5000

  const result = spawnSync(binary, args, {
    input: sv,
    timeout,
    encoding: 'utf8',
    // formatted output is about the size of the input; the 1 MiB default is too small for large designs
    maxBuffer: 1 << 30
  })

  if (result.status === 0 && result.stdout) {
    return result.stdout
  }

  const diagnostic = [
    `verible-verilog-format failed`,
    `  binary:    ${binary}`,
    `  exit code: ${result.status ?? '(none)'}`,
    result.error ? `  error:     ${result.error.message}` : null,
    result.stderr ? `  stderr:    ${result.stderr.trim()}` : null
  ].filter(Boolean).join('\n')

  if (opts.failOnFormatError === true) {
    throw new Error(diagnostic)
  }

  console.warn(diagnostic)
  return sv
}
