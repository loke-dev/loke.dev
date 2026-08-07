/**
 * Reads a request body only when it stays below the endpoint's byte limit.
 * Content-Length is a fast rejection path, but the encoded body is checked as
 * well because chunked requests do not have to include that header.
 */
export async function readRequestBody(
  request: Request,
  maxBytes: number
): Promise<string | null> {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return null
  }

  const body = await request.text()
  return new TextEncoder().encode(body).byteLength <= maxBytes ? body : null
}
