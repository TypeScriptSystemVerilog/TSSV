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
  // Large generated designs (tens of thousands of lines) take several seconds to format.
  const timeout = opts.formatTimeoutMs ?? 60000

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
    `  timeout:   ${timeout} ms${(result.error as NodeJS.ErrnoException | undefined)?.code === 'ETIMEDOUT' ? ' (exceeded; raise formatTimeoutMs via Module.setFormatterConfig)' : ''}`,
    result.error ? `  error:     ${result.error.message}` : null,
    result.stderr ? `  stderr:    ${result.stderr.trim()}` : null
  ].filter(Boolean).join('\n')

  if (opts.failOnFormatError === true) {
    throw new Error(diagnostic)
  }

  console.warn(diagnostic)
  return sv
}
