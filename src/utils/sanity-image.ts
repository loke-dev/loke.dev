export interface SanityImageDimensions {
  width: number
  height: number
}

export function getSanityImageDimensions(
  asset: unknown
): SanityImageDimensions | null {
  if (!asset || typeof asset !== 'object') return null
  const ref = (asset as { _ref?: unknown })._ref
  if (typeof ref !== 'string') return null

  const match = /-(\d+)x(\d+)-/.exec(ref)
  if (!match) return null

  const width = Number(match[1])
  const height = Number(match[2])
  return width > 0 && height > 0 ? { width, height } : null
}
