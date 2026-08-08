const origin = (
  process.env.SITE_ORIGIN ?? 'https://loke.dev'
).replace(/\/$/, '')
const userAgent =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36 loke.dev deployment smoke test'
const timeoutMs = 10_000
const concurrency = 8

async function fetchWithTimeout(url) {
  const signal = AbortSignal.timeout(timeoutMs)
  return fetch(url, { headers: { 'user-agent': userAgent }, signal })
}

const sitemapResponse = await fetchWithTimeout(`${origin}/sitemap.xml`)
if (!sitemapResponse.ok) {
  throw new Error(`Sitemap request failed with HTTP ${sitemapResponse.status}`)
}

const sitemap = await sitemapResponse.text()
const urls = sitemap
  .split('<loc>')
  .slice(1)
  .map((part) => part.split('</loc>')[0]?.trim())
  .filter(Boolean)

if (urls.length === 0) throw new Error('Sitemap did not contain any URLs')

const failures = []
let nextIndex = 0

async function checkNext() {
  while (nextIndex < urls.length) {
    const index = nextIndex++
    const publicUrl = urls[index]
    const publicUrlObject = new URL(publicUrl)
    const requestUrl = `${origin}${publicUrlObject.pathname}${publicUrlObject.search}`

    try {
      const response = await fetchWithTimeout(requestUrl)
      const html = await response.text()
      const canonical = html.match(
        /<link\s+rel="canonical"\s+href="([^"]+)"/i
      )?.[1]

      if (!response.ok || canonical !== publicUrl) {
        failures.push({
          url: publicUrl,
          status: response.status,
          canonical: canonical ?? null,
        })
      }
    } catch (error) {
      failures.push({
        url: publicUrl,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, urls.length) }, checkNext)
)

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2))
  process.exit(1)
}

console.log(`Sitemap canonical check passed for ${urls.length} URLs.`)
