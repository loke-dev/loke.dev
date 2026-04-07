async function probeUrl(
  url: string,
  signal: AbortSignal
): Promise<number | null> {
  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal,
    })
    if (head.status === 405 || head.status === 501) {
      const get = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal,
        headers: { Range: 'bytes=0-0' },
      })
      return get.status
    }
    return head.status
  } catch {
    return null
  }
}

export async function filterResourcesWithSuccessfulHttp(
  resources: Array<{ title: string; url: string }>,
  timeoutMs = 10000
): Promise<Array<{ title: string; url: string }>> {
  const out: Array<{ title: string; url: string }> = []

  for (const r of resources) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    try {
      const status = await probeUrl(r.url, ctrl.signal)
      if (status === null) continue
      if (status === 404 || status === 410) continue
      out.push(r)
    } finally {
      clearTimeout(timer)
    }
  }

  return out
}
